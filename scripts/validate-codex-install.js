#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const home = process.env.HOME || process.env.USERPROFILE || process.env.HOMEPATH;
const codexHome = process.env.CODEX_HOME || path.join(home, '.codex');
const targetDir = path.join(codexHome, 'skills');
const markerName = '.pm-copilot-skills-source.json';
const packageJson = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));

const expectedEntries = fs.readdirSync(path.join(root, 'skills')).filter((entry) => {
  return fs.statSync(path.join(root, 'skills', entry)).isDirectory();
});

const pmSkills = expectedEntries.filter((entry) => entry.startsWith('pm-'));
const externallyAllowed = new Set(['pdf']);
const failures = [];
const warnings = [];

function assert(condition, message) {
  if (!condition) failures.push(message);
}

assert(fs.existsSync(targetDir), `Codex skills 目录不存在: ${targetDir}`);
assert(pmSkills.length === 16, `源目录中 PM skills 数量应为 16，实际为 ${pmSkills.length}`);

for (const entry of expectedEntries) {
  const dest = path.join(targetDir, entry);
  const source = path.join(root, 'skills', entry);
  const sourceHasSkill = fs.existsSync(path.join(source, 'SKILL.md'));
  const markerFile = path.join(dest, markerName);

  assert(fs.existsSync(dest), `Codex 目标目录缺少: ${entry}`);
  if (!fs.existsSync(dest)) continue;

  if (sourceHasSkill) {
    assert(fs.existsSync(path.join(dest, 'SKILL.md')), `${entry} 缺少 SKILL.md`);
  }

  if (fs.existsSync(markerFile)) {
    try {
      const marker = JSON.parse(fs.readFileSync(markerFile, 'utf8'));
      assert(marker.package === packageJson.name, `${entry} 的安装标记 package 不匹配`);
      assert(marker.skill === entry, `${entry} 的安装标记 skill 不匹配`);
    } catch (error) {
      failures.push(`${entry} 的安装标记不是合法 JSON: ${error.message}`);
    }
  } else if (externallyAllowed.has(entry)) {
    warnings.push(`${entry} 已存在但没有 pm-copilot-skills 标记，视为保留外部已有 skill`);
  } else {
    failures.push(`${entry} 缺少 ${markerName} 安装标记`);
  }
}

const installedPmSkills = fs.readdirSync(targetDir).filter((entry) => {
  return entry.startsWith('pm-') && fs.statSync(path.join(targetDir, entry)).isDirectory();
});
assert(installedPmSkills.length >= 16, `Codex 目录中的 PM skills 少于 16，实际为 ${installedPmSkills.length}`);

const qualityGates = path.join(targetDir, 'references', 'quality-gates-shared.md');
assert(fs.existsSync(qualityGates), 'Codex references 缺少 quality-gates-shared.md');
if (fs.existsSync(qualityGates)) {
  const content = fs.readFileSync(qualityGates, 'utf8');
  assert(content.includes('默认语言协议'), 'Codex references 未包含中文优先语言协议');
  assert(content.includes('Evidence Packet'), 'Codex references 未包含 Evidence Packet 协议');
}

if (failures.length > 0) {
  console.error('Codex 安装验证失败:');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log('Codex 安装验证通过。');
console.log(`目标目录: ${targetDir}`);
console.log(`已验证 ${expectedEntries.length} 个 package 目录，其中 PM skills ${pmSkills.length} 个。`);
for (const warning of warnings) {
  console.log(`提示: ${warning}`);
}
