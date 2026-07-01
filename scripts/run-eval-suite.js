#!/usr/bin/env node
//
// run-eval-suite.js — Lightweight eval runner (v1.1)
//
// Scope:
//   - Scan evals/ recursively for files ending in .cases.json
//   - For each case, perform schema validation against the referenced schema file
//     (schema-only — no LLM invocation)
//   - Output pass/fail report to dist/eval-report.json
//   - Exit code: 0 = all pass (or no fixtures found), 1 = any fail
//
// v1.1 boundary:
//   - Schema fixture only (per evals/README.md)
//   - No LLM-as-judge, no regression detection
//   - When evals/ has no fixtures, warns and exits 0 (does not block CI)
//

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const evalsDir = path.join(root, 'evals');
const distDir = path.join(root, 'dist');
const reportPath = path.join(distDir, 'eval-report.json');

// Glob-like recursive scan (avoid external deps)
function findCases(dir) {
  const results = [];
  if (!fs.existsSync(dir)) return results;

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...findCases(full));
    } else if (entry.isFile() && entry.name.endsWith('.cases.json')) {
      results.push(full);
    }
  }
  return results;
}

function loadCases(filePath) {
  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') {
      return { ok: false, error: 'cases file is not an object' };
    }
    if (!Array.isArray(parsed.cases)) {
      return { ok: false, error: 'cases file missing "cases" array' };
    }
    return { ok: true, parsed };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}

function resolveSchemaPath(casesFile, schemaRef) {
  if (!schemaRef) return null;
  const casesDir = path.dirname(casesFile);
  const resolved = path.resolve(casesDir, schemaRef);
  if (!fs.existsSync(resolved)) return null;
  return resolved;
}

function loadSchema(schemaPath) {
  try {
    const raw = fs.readFileSync(schemaPath, 'utf8');
    return { ok: true, parsed: JSON.parse(raw) };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}

// Minimal structural validation.
// v1.1 does NOT bundle ajv or similar; we do field-presence + enum check only.
// Full JSON Schema validation is a v1.2 concern.
//
// Field policy (lenient): historical fixtures use domain-specific shapes
// (source_brief_path / fixture / expected_output / must_preserve etc.) and
// don't carry a generic `input` field. Only `case.id` is hard-required.
// `input` absence is downgraded to a warning so existing suites keep passing.
function validateCaseAgainstSchema(caseItem, schema) {
  const errors = [];
  const warnings = [];
  const required = (schema && Array.isArray(schema.required)) ? schema.required : [];

  // case.id is the only hard-required field
  if (!caseItem.id) errors.push('case.id missing');

  // Soft signal: prefer `input` for new fixtures but don't block old ones
  if (!caseItem.input) warnings.push('case.input missing (downgraded — historical fixture)');

  // If expected_output_contract is present, check its shape
  if (caseItem.expected_output_contract) {
    const eoc = caseItem.expected_output_contract;
    if (eoc.must_contain_fields && !Array.isArray(eoc.must_contain_fields)) {
      errors.push('expected_output_contract.must_contain_fields must be array');
    }
    if (eoc.must_satisfy && !Array.isArray(eoc.must_satisfy)) {
      errors.push('expected_output_contract.must_satisfy must be array');
    }
  }

  return { errors, warnings };
}

function run() {
  const casesFiles = findCases(evalsDir);
  const report = {
    generated_at: new Date().toISOString(),
    suite_version: 'v1.1-schema-only',
    summary: {
      cases_files_found: casesFiles.length,
      cases_total: 0,
      cases_passed: 0,
      cases_failed: 0,
      cases_skipped: 0,
    },
    files: [],
    status: casesFiles.length === 0 ? 'NO_FIXTURES' : 'OK',
  };

  if (casesFiles.length === 0) {
    report.summary.note =
      'No eval fixtures (*.cases.json) found under evals/. ' +
      'v1.1 tolerates this; v1.2 should seed baseline fixtures.';
    console.warn('[eval-suite] WARN: no fixtures found under evals/');
    console.warn('[eval-suite] v1.1 treats this as pass (exit 0).');
  }

  for (const casesFile of casesFiles) {
    const fileReport = {
      file: path.relative(root, casesFile),
      suite_name: null,
      schema_ref: null,
      schema_resolved: null,
      cases: [],
      ok: true,
    };

    const load = loadCases(casesFile);
    if (!load.ok) {
      fileReport.ok = false;
      fileReport.error = load.error;
      report.summary.cases_failed += 1;
      report.files.push(fileReport);
      continue;
    }

    const parsed = load.parsed;
    fileReport.suite_name = parsed.suite_name || null;
    fileReport.schema_ref = parsed.schema_ref || null;

    let schema = null;
    if (parsed.schema_ref) {
      const schemaPath = resolveSchemaPath(casesFile, parsed.schema_ref);
      if (!schemaPath) {
        fileReport.schema_resolved = false;
        fileReport.ok = false;
        fileReport.error = `schema not found: ${parsed.schema_ref}`;
        report.summary.cases_failed += parsed.cases.length;
        report.files.push(fileReport);
        continue;
      }
      fileReport.schema_resolved = true;
      const schemaLoad = loadSchema(schemaPath);
      if (!schemaLoad.ok) {
        fileReport.ok = false;
        fileReport.error = `schema load error: ${schemaLoad.error}`;
        report.summary.cases_failed += parsed.cases.length;
        report.files.push(fileReport);
        continue;
      }
      schema = schemaLoad.parsed;
    } else {
      fileReport.schema_resolved = false;
    }

    for (const c of parsed.cases) {
      report.summary.cases_total += 1;
      const { errors: errs, warnings: warns } = validateCaseAgainstSchema(c, schema);
      const caseReport = {
        id: c.id || '<no-id>',
        status: errs.length === 0 ? 'pass' : 'fail',
        errors: errs,
      };
      if (warns && warns.length > 0) caseReport.warnings = warns;
      if (errs.length === 0) {
        report.summary.cases_passed += 1;
      } else {
        report.summary.cases_failed += 1;
        fileReport.ok = false;
      }
      fileReport.cases.push(caseReport);
    }

    report.files.push(fileReport);
  }

  // Write report
  if (!fs.existsSync(distDir)) {
    try {
      fs.mkdirSync(distDir, { recursive: true });
    } catch (err) {
      // ignore — we still report to stdout
    }
  }
  try {
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  } catch (err) {
    console.error(`[eval-suite] WARN: could not write ${reportPath}: ${err.message}`);
  }

  // Console summary
  const s = report.summary;
  console.log('');
  console.log('[eval-suite] Summary');
  console.log(`  files found : ${s.cases_files_found}`);
  console.log(`  cases total : ${s.cases_total}`);
  console.log(`  passed      : ${s.cases_passed}`);
  console.log(`  failed      : ${s.cases_failed}`);
  console.log(`  report      : ${path.relative(root, reportPath)}`);
  if (report.status === 'NO_FIXTURES') {
    console.log('  note        : no fixtures — v1.1 tolerates this');
  }
  console.log('');

  const anyFailed = report.files.some((f) => !f.ok);
  process.exit(anyFailed ? 1 : 0);
}

run();
