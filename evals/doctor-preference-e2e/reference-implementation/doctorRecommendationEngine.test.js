'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { recommendDoctors, evaluateDoctor } = require('./doctorRecommendationEngine');

test('患者指定 Dr Sin 做 SMILE 时，阻塞 Dr Sin 并推荐 Dr Kwok', () => {
  const result = recommendDoctors({
    service: 'SMILE',
    appointmentDate: '2026-06-20',
    time: '13:30',
    location: 'Mong Kok',
    visitType: 'surgery',
    preferredDoctor: 'Dr Sin',
  });

  assert.equal(result.recommendations[0].doctor, 'Dr Kwok');
  assert.ok(result.recommendations[0].reasons.some(reason => reason.includes('替代医生')));
  assert.ok(result.blocked.some(item => item.doctor === 'Dr Sin' && item.rules.some(rule => rule.includes('不接 SMILE'))));
});

test('Dr Tang 周四中环手术只允许 17:00', () => {
  const blocked = evaluateDoctor({ name: 'Dr Tang', services: ['CAT'], locations: ['Central'] }, {
    service: 'CAT',
    appointmentDate: '2026-06-18',
    time: '16:00',
    location: 'Central',
    visitType: 'surgery',
  });

  const allowed = evaluateDoctor({ name: 'Dr Tang', services: ['CAT'], locations: ['Central'] }, {
    service: 'CAT',
    appointmentDate: '2026-06-18',
    time: '17:00',
    location: 'Central',
    visitType: 'surgery',
  });

  assert.equal(blocked.blocked, true);
  assert.ok(blocked.blockReasons.some(reason => reason.includes('周四中环手术')));
  assert.equal(allowed.blocked, false);
});

test('Dr Ho 阻塞周六 CAT 手术和 1 小时内新症冲突', () => {
  const result = evaluateDoctor({ name: 'Dr Ho', services: ['CAT'], locations: ['Central'] }, {
    service: 'CAT',
    appointmentDate: '2026-06-20',
    time: '13:30',
    location: 'Central',
    visitType: 'new',
    existingBookings: [
      { doctor: 'Dr Ho', date: '2026-06-20', time: '13:00', visitType: 'new', service: 'general' },
    ],
  });

  assert.equal(result.blocked, true);
  assert.ok(result.blockReasons.some(reason => reason.includes('周六')));
  assert.ok(result.blockReasons.some(reason => reason.includes('1 个新症')));
});

test('Dr Leung 阻塞矫视手术和 6 岁以下患者', () => {
  const result = evaluateDoctor({ name: 'Dr Leung', services: ['general'], locations: ['Central'] }, {
    service: 'LASIK',
    appointmentDate: '2026-06-16',
    time: '14:00',
    location: 'Central',
    patientAge: 5,
    visitType: 'new',
  });

  assert.equal(result.blocked, true);
  assert.ok(result.blockReasons.some(reason => reason.includes('不做')));
  assert.ok(result.blockReasons.some(reason => reason.includes('6 岁以下')));
});

test('配额已满会阻塞原本合格的医生', () => {
  const result = evaluateDoctor({ name: 'Dr V Chu', services: ['dry-eye'], locations: ['Central'] }, {
    service: 'dry-eye',
    appointmentDate: '2026-06-16',
    time: '11:00',
    location: 'Central',
    visitType: 'new',
    quotaUsage: {
      'Dr V Chu': { used: 10, limit: 10 },
    },
  });

  assert.equal(result.blocked, true);
  assert.ok(result.blockReasons.some(reason => reason.includes('配额已满')));
});

test('推荐响应包含解释、Sensor Gates 和审计预览', () => {
  const result = recommendDoctors({
    service: 'dry-eye',
    appointmentDate: '2026-06-16',
    time: '11:00',
    location: 'Central',
    visitType: 'new',
  });

  assert.ok(result.recommendations.length > 0);
  assert.ok(result.recommendations[0].reasons.length > 0);
  assert.equal(result.sensorGates.specCoverage, 'PASS');
  assert.ok(Array.isArray(result.auditPreview.recommendedDoctors));
});
