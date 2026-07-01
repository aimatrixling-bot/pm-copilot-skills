#!/usr/bin/env node
//
// check-examples-coverage.js — Examples coverage scanner (v1.1, P1.3/P1.5)
//
// Scope:
//   - Scan skills/<name>/SKILL.md
//   - Count example markers per file: `**Example**` or `**示例**` (bold headings)
//     plus fenced example YAML blocks flagged with `# Example` or `# 示例` comments
//   - Threshold: each SKILL.md must have >= 4 distinct example markers
//   - Output report to dist/examples-coverage.json
//   - Exit code: 0 = all skills meet threshold, 1 = any skill below threshold
//
// Why count markers, not "examples" semantically:
//   v1.1 is intentionally lightweight. Counting markers gives a stable signal
//   that a human author can game only by adding real examples. Semantic
//   example detection (LLM-as-judge) is a v1.2 concern.
//

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const skillsDir = path.join(root, 'skills');
const distDir = path.join(root, 'dist');
const reportPath = path.join(distDir, 'examples-coverage.json');

const THRESHOLD = 4;

const MARKER_PATTERNS = [
  /\*\*Example\*\*/g,
  /\*\*示例\*\*/g,
  /^#\s*(Example|示例)\s*$/gm,
  /^##\s*(Example|示例)\s*$/gm,
  /^\/\/\s*(Example|示例)\s*:/gm,
  /^#\s*(Example|示例)\s*:/gm,
];

function findSkillFiles(dir) {
  const results = [];
  if (!fs.existsSync(dir)) return results;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const skillMd = path.join(dir, entry.name, 'SKILL.md');
    if (fs.existsSync(skillMd)) results.push(skillMd);
  }
  return results.sort();
}

function countExamples(content) {
  let total = 0;
  const hits = {};
  for (const re of MARKER_PATTERNS) {
    const matches = content.match(re);
    if (matches) {
      hits[re.source] = matches.length;
      total += matches.length;
    }
  }
  return { total, hits };
}

function run() {
  const skillFiles = findSkillFiles(skillsDir);
  const report = {
    generated_at: new Date().toISOString(),
    threshold: THRESHOLD,
    threshold_per_skill: THRESHOLD,
    summary: {
      skills_scanned: skillFiles.length,
      skills_passing: 0,
      skills_failing: 0,
    },
    skills: [],
  };

  if (skillFiles.length === 0) {
    report.summary.note = 'No SKILL.md files found under skills/';
    console.warn('[examples-coverage] WARN: no SKILL.md files found');
  }

  for (const file of skillFiles) {
    const content = fs.readFileSync(file, 'utf8');
    const count = countExamples(content);
    const rel = path.relative(root, file);
    const skillName = path.basename(path.dirname(file));
    const passing = count.total >= THRESHOLD;
    const skillReport = {
      skill: skillName,
      file: rel,
      example_markers: count.total,
      threshold: THRESHOLD,
      status: passing ? 'pass' : 'fail',
      hit_breakdown: count.hits,
    };
    if (passing) report.summary.skills_passing += 1;
    else report.summary.skills_failing += 1;
    report.skills.push(skillReport);
  }

  if (!fs.existsSync(distDir)) {
    try {
      fs.mkdirSync(distDir, { recursive: true });
    } catch (err) {
      // ignore
    }
  }
  try {
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  } catch (err) {
    console.error(`[examples-coverage] WARN: could not write ${reportPath}: ${err.message}`);
  }

  console.log('');
  console.log('[examples-coverage] Summary');
  console.log(`  threshold   : ${THRESHOLD} markers per SKILL.md`);
  console.log(`  scanned     : ${report.summary.skills_scanned} skills`);
  console.log(`  passing     : ${report.summary.skills_passing}`);
  console.log(`  failing     : ${report.summary.skills_failing}`);
  console.log(`  report      : ${path.relative(root, reportPath)}`);
  console.log('');

  for (const s of report.skills) {
    const tag = s.status === 'pass' ? 'PASS' : 'FAIL';
    console.log(`  [${tag}] ${s.skill.padEnd(22)} ${s.example_markers}/${s.threshold}`);
  }
  console.log('');

  process.exit(report.summary.skills_failing > 0 ? 1 : 0);
}

run();
