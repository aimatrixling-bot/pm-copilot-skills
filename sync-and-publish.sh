#!/usr/bin/env bash
#
# sync-and-publish.sh — Sync skills from pm-copilot-agent, bump version, publish
#
# Usage:
#   ./sync-and-publish.sh              # sync + commit + push + npm publish
#   ./sync-and-publish.sh --dry-run    # show diff only, no changes
#   ./sync-and-publish.sh --no-publish # sync + commit + push, skip npm publish
#
# Prerequisites:
#   - npm logged in (npm whoami)
#   - git remote configured
#

set -euo pipefail

# --- Config ---
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
AGENT_SKILLS_DIR="D:/Max Brain for AI Copilot/30_Projects/personal/pm-copilot-agent/src/bundled-agents/pm-copilot/.claude/skills"
PKG_SKILLS_DIR="$SCRIPT_DIR/skills"
PKG_JSON="$SCRIPT_DIR/package.json"

# --- Args ---
DRY_RUN=false
NO_PUBLISH=false
for arg in "$@"; do
  case "$arg" in
    --dry-run)     DRY_RUN=true ;;
    --no-publish)  NO_PUBLISH=true ;;
  esac
done

# --- Pre-flight checks ---
if [ ! -d "$AGENT_SKILLS_DIR" ]; then
  echo "ERROR: Source skills directory not found:"
  echo "  $AGENT_SKILLS_DIR"
  echo "Make sure pm-copilot-agent repo is at expected location."
  exit 1
fi

if [ ! -f "$PKG_JSON" ]; then
  echo "ERROR: package.json not found at $PKG_JSON"
  exit 1
fi

# --- Step 1: Diff check ---
echo "=== Step 1: Checking for changes ==="

CHANGED=false
DELETED_ITEMS=()
NEW_ITEMS=()
UPDATED_ITEMS=()

# Get all items from source
for src_item in "$AGENT_SKILLS_DIR"/*/; do
  item_name=$(basename "$src_item")
  dst_item="$PKG_SKILLS_DIR/$item_name"

  if [ ! -d "$dst_item" ]; then
    NEW_ITEMS+=("$item_name")
    CHANGED=true
  else
    # Compare files recursively
    diff_output=$(diff -rq "$src_item" "$dst_item" 2>/dev/null || true)
    if [ -n "$diff_output" ]; then
      UPDATED_ITEMS+=("$item_name")
      CHANGED=true
    fi
  fi
done

# Check for items in dest but not in source (removed from agent)
for dst_item in "$PKG_SKILLS_DIR"/*/; do
  item_name=$(basename "$dst_item")
  src_item="$AGENT_SKILLS_DIR/$item_name"
  if [ ! -d "$src_item" ]; then
    DELETED_ITEMS+=("$item_name")
    CHANGED=true
  fi
done

if [ "$CHANGED" = false ]; then
  echo "No changes detected. Skills are in sync."
  echo ""
  echo "Local install: npx github:aimatrixling-bot/pm-copilot-skills"
  exit 0
fi

# Report changes
echo ""
echo "Changes detected:"
if [ ${#NEW_ITEMS[@]} -gt 0 ]; then
  echo "  NEW:     ${NEW_ITEMS[*]}"
fi
if [ ${#UPDATED_ITEMS[@]} -gt 0 ]; then
  echo "  UPDATED: ${UPDATED_ITEMS[*]}"
fi
if [ ${#DELETED_ITEMS[@]} -gt 0 ]; then
  echo "  DELETED: ${DELETED_ITEMS[*]}"
fi
echo ""

if [ "$DRY_RUN" = true ]; then
  echo "[DRY RUN] No changes made."
  exit 0
fi

# --- Step 2: Sync files ---
echo "=== Step 2: Syncing skills ==="

# Copy all from source (rsync-like: add + update)
for src_item in "$AGENT_SKILLS_DIR"/*/; do
  item_name=$(basename "$src_item")
  dst_item="$PKG_SKILLS_DIR/$item_name"
  cp -r "$src_item" "$dst_item"
  echo "  Synced: $item_name"
done

# Remove items that no longer exist in source
for item in "${DELETED_ITEMS[@]}"; do
  rm -rf "$PKG_SKILLS_DIR/$item"
  echo "  Removed: $item"
done

echo ""

# --- Step 3: Bump version ---
echo "=== Step 3: Bumping version ==="

CURRENT_VERSION=$(node -p "require('$PKG_JSON').version")
IFS='.' read -r major minor patch <<< "$CURRENT_VERSION"
NEW_VERSION="$major.$minor.$((patch + 1))"

node -e "
const fs = require('fs');
const pkg = JSON.parse(fs.readFileSync('$PKG_JSON', 'utf-8'));
pkg.version = '$NEW_VERSION';
fs.writeFileSync('$PKG_JSON', JSON.stringify(pkg, null, 2) + '\n');
"

echo "  Version: $CURRENT_VERSION → $NEW_VERSION"
echo ""

# --- Step 4: Git commit + push ---
echo "=== Step 4: Git commit + push ==="

cd "$SCRIPT_DIR"
git add -A
git commit -m "sync: v$NEW_VERSION — skills from pm-copilot-agent"
git push origin "$(git branch --show-current)"
echo "  Pushed to GitHub"
echo ""

# --- Step 5: npm publish ---
if [ "$NO_PUBLISH" = false ]; then
  echo "=== Step 5: npm publish ==="

  # Check if logged in
  if ! npm whoami &>/dev/null; then
    echo "ERROR: Not logged into npm. Run: npm adduser"
    echo "Then re-run this script with --no-publish already done."
    exit 1
  fi

  npm publish --access public
  echo "  Published to npm: pm-copilot-skills@$NEW_VERSION"
  echo ""
  echo "=== Done! ==="
  echo "  GitHub:  https://github.com/aimatrixling-bot/pm-copilot-skills"
  echo "  Install: npx pm-copilot-skills"
  echo "  Or:      npx github:aimatrixling-bot/pm-copilot-skills"
else
  echo "=== Done! (skipped npm publish) ==="
  echo "  To publish later: npm publish --access public"
fi
