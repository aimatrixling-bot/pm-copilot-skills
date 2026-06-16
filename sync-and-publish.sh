#!/usr/bin/env bash
#
# sync-and-publish.sh — Publish pm-copilot-skills from this canonical source.
#
# Historical note:
#   This script used to sync from pm-copilot-agent into this package. That is no
#   longer allowed: pm-copilot-skills is the upstream source of truth, and
#   downstream agents should mirror from this package after a version is accepted.
#
# Usage:
#   ./sync-and-publish.sh              # check + bump patch + commit + push + npm publish
#   ./sync-and-publish.sh --dry-run    # run checks and show intended version, no changes
#   ./sync-and-publish.sh --no-publish # check + bump patch + commit + push, skip npm publish
#
# Prerequisites:
#   - npm logged in (npm whoami) unless --no-publish
#   - git remote configured
#

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PKG_JSON="$SCRIPT_DIR/package.json"

DRY_RUN=false
NO_PUBLISH=false
for arg in "$@"; do
  case "$arg" in
    --dry-run)     DRY_RUN=true ;;
    --no-publish)  NO_PUBLISH=true ;;
    *)
      echo "ERROR: Unknown argument: $arg"
      echo "Usage: ./sync-and-publish.sh [--dry-run] [--no-publish]"
      exit 1
      ;;
  esac
done

if [ ! -f "$PKG_JSON" ]; then
  echo "ERROR: package.json not found at $PKG_JSON"
  exit 1
fi

cd "$SCRIPT_DIR"

echo "=== Step 1: Validating canonical source ==="

if grep -R "AGENT_SKILLS_DIR=.*pm-copilot-agent" . \
  --exclude-dir=.git \
  --exclude-dir=node_modules \
  --exclude="sync-and-publish.sh" >/dev/null 2>&1; then
  echo "ERROR: Found legacy agent-as-source sync reference."
  echo "pm-copilot-skills must remain the canonical source."
  exit 1
fi

git diff --check

echo "=== Step 2: Builder OS validation ==="
npm run validate:builder-os
npm run validate:doctor-preference-e2e
npm run test:doctor-preference-e2e

echo "=== Step 3: npm pack dry-run ==="
node <<'NODE'
const { execSync } = require('child_process');
const output = execSync('npm pack --dry-run --json', {
  encoding: 'utf8',
  stdio: ['ignore', 'pipe', 'inherit']
});
const pack = JSON.parse(output)[0];
const files = pack.files.map(f => f.path);
const required = [
  'README.md',
  'install.js',
  'package.json',
  'scripts/validate-builder-os.js',
  'scripts/validate-doctor-preference-e2e.js',
  'evals/builder-os-trigger-evals.json',
  'evals/doctor-preference-e2e/README.md',
  'evals/doctor-preference-e2e/reference-implementation/doctorRecommendationEngine.js',
  'skills/skill-template.md',
  'skills/references/quality-gates-shared.md',
  'skills/references/builder-os/blueprint.md'
];
const missing = required.filter(p => !files.includes(p));
if (missing.length) {
  console.error('ERROR: npm package missing required files: ' + missing.join(', '));
  process.exit(1);
}
console.log('  Package: ' + pack.filename + ' (' + pack.entryCount + ' files)');
NODE

CURRENT_VERSION=$(node -p "require('./package.json').version")
IFS='.' read -r major minor patch <<< "$CURRENT_VERSION"
NEW_VERSION="$major.$minor.$((patch + 1))"

echo "=== Step 4: Version plan ==="
echo "  Current: $CURRENT_VERSION"
echo "  Next:    $NEW_VERSION"

if [ "$DRY_RUN" = true ]; then
  echo ""
  echo "[DRY RUN] No files changed, no commit, no publish."
  exit 0
fi

echo "=== Step 5: Bumping version ==="
node -e "
const fs = require('fs');
const pkgPath = 'package.json';
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
pkg.version = '$NEW_VERSION';
fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
"
echo "  Version: $CURRENT_VERSION -> $NEW_VERSION"

echo "=== Step 6: Git commit + push ==="
git add -A
git commit -m "release: pm-copilot-skills v$NEW_VERSION"
git push origin "$(git branch --show-current)"
echo "  Pushed to GitHub"

if [ "$NO_PUBLISH" = false ]; then
  echo "=== Step 7: npm publish ==="
  if ! npm whoami >/dev/null 2>&1; then
    echo "ERROR: Not logged into npm. Run: npm adduser"
    echo "Then re-run with --no-publish already done, or publish manually."
    exit 1
  fi

  npm publish --access public
  echo "  Published to npm: pm-copilot-skills@$NEW_VERSION"
else
  echo "=== Done! (skipped npm publish) ==="
  echo "  To publish later: npm publish --access public"
fi

echo ""
echo "Install: npx pm-copilot-skills"
