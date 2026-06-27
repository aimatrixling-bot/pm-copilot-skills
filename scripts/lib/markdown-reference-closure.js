const fs = require('fs');
const path = require('path');

const defaultExcludedDirs = new Set([
  '.git',
  '.release',
  'dist',
  'node_modules',
  'research',
  'references/source-blueprints',
]);

function toPosix(relativePath) {
  return relativePath.split(path.sep).join('/');
}

function shouldSkipDir(rootDir, dirPath, excludedDirs) {
  const relativePath = toPosix(path.relative(rootDir, dirPath));
  if (!relativePath || relativePath === '.') return false;
  return Array.from(excludedDirs).some((excluded) => (
    relativePath === excluded ||
    relativePath.startsWith(`${excluded}/`) ||
    relativePath.split('/').includes(excluded)
  ));
}

function listMarkdownFiles(rootDir, excludedDirs) {
  const files = [];
  if (!fs.existsSync(rootDir)) return files;

  function walk(dirPath) {
    if (shouldSkipDir(rootDir, dirPath, excludedDirs)) return;
    for (const entry of fs.readdirSync(dirPath)) {
      const fullPath = path.join(dirPath, entry);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        walk(fullPath);
      } else if (entry.toLowerCase().endsWith('.md')) {
        files.push(fullPath);
      }
    }
  }

  walk(rootDir);
  return files.sort();
}

function stripCode(content) {
  const lines = content.split(/\r?\n/);
  let inFence = false;
  return lines.map((line) => {
    if (/^\s*(```|~~~)/.test(line)) {
      inFence = !inFence;
      return '';
    }
    if (inFence) return '';
    return line.replace(/`[^`]*`/g, '');
  }).join('\n');
}

function normalizeLinkTarget(rawTarget) {
  let target = rawTarget.trim();
  if (!target) return null;

  if (target.startsWith('<')) {
    const end = target.indexOf('>');
    if (end === -1) return null;
    target = target.slice(1, end);
  } else {
    target = target.split(/\s+/)[0];
  }

  target = target.trim();
  if (!target || target.startsWith('#')) return null;
  if (/^[a-z][a-z0-9+.-]*:/i.test(target)) return null;

  const hashIndex = target.indexOf('#');
  if (hashIndex !== -1) target = target.slice(0, hashIndex);
  const queryIndex = target.indexOf('?');
  if (queryIndex !== -1) target = target.slice(0, queryIndex);
  if (!target) return null;

  try {
    target = decodeURI(target);
  } catch {
    // Keep the raw target if it is not a valid URI-encoded path.
  }

  return target.replace(/\\/g, '/');
}

function lineNumberAt(content, index) {
  return content.slice(0, index).split(/\r?\n/).length;
}

function validateMarkdownReferenceClosure(options) {
  const rootDir = path.resolve(options.rootDir);
  const label = options.label || rootDir;
  const excludedDirs = new Set([
    ...defaultExcludedDirs,
    ...(options.excludeDirs || []),
  ]);
  const failures = [];

  for (const filePath of listMarkdownFiles(rootDir, excludedDirs)) {
    const rawContent = fs.readFileSync(filePath, 'utf8');
    const content = stripCode(rawContent);
    const relativeFile = toPosix(path.relative(rootDir, filePath));
    const linkPattern = /\]\(([^)\n]+)\)/g;
    let match;

    while ((match = linkPattern.exec(content)) !== null) {
      const target = normalizeLinkTarget(match[1]);
      if (!target) continue;

      const resolved = target.startsWith('/')
        ? path.resolve(rootDir, `.${target}`)
        : path.resolve(path.dirname(filePath), target);

      if (!fs.existsSync(resolved)) {
        failures.push(
          `${label}: ${relativeFile}:${lineNumberAt(content, match.index)} 引用不存在: ${target}`,
        );
      }
    }
  }

  return failures;
}

module.exports = {
  validateMarkdownReferenceClosure,
};
