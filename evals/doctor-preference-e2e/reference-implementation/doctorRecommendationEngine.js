'use strict';

const SURGERY_SERVICES = new Set(['LASIK', 'SMILE', 'SMILE_PRO', 'ICL', 'CAT']);
const REFRACTIVE_SERVICES = new Set(['LASIK', 'SMILE', 'SMILE_PRO', 'ICL']);

const DEFAULT_DOCTORS = [
  { name: 'Dr Tang', services: ['LASIK', 'SMILE', 'ICL', 'CAT'], locations: ['Central', 'HK', 'Mong Kok'] },
  { name: 'Dr Ho', services: ['LASIK', 'CAT', 'general'], locations: ['Central', 'HK'] },
  { name: 'Dr Leung', services: ['general', 'CAT'], locations: ['Central', 'HK'] },
  { name: 'Dr Kwok', services: ['SMILE', 'LASIK', 'CAT'], locations: ['Central', 'Mong Kok'] },
  { name: 'Dr M Wong', services: ['LASIK', 'ICL', 'CAT', 'injection'], locations: ['Central', 'HK', 'Mong Kok'] },
  { name: 'Dr B Chu', services: ['CAT', 'ICL', 'general'], locations: ['Central', 'Mong Kok'] },
  { name: 'Dr Sin', services: ['general', 'LASIK'], locations: ['Mong Kok'] },
  { name: 'Dr V Chu', services: ['dry-eye', 'CMC', 'general'], locations: ['Central', 'HK', 'Mong Kok'] },
];

function recommendDoctors(request, doctors = DEFAULT_DOCTORS) {
  const evaluated = doctors.map(doctor => evaluateDoctor(doctor, request));
  const blocked = evaluated.filter(result => result.blocked);
  const recommendations = evaluated
    .filter(result => !result.blocked)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(result => ({
      doctor: result.doctor.name,
      score: result.score,
      reasons: result.reasons,
      warnings: result.warnings,
    }));

  return {
    recommendations,
    blocked: blocked.map(result => ({
      doctor: result.doctor.name,
      rules: result.blockReasons,
    })),
    sensorGates: buildSensorGates(request, recommendations, blocked),
    auditPreview: {
      request: sanitizeRequest(request),
      recommendedDoctors: recommendations.map(item => item.doctor),
      blockedDoctors: blocked.map(item => item.doctor.name),
      appliedRuleCount: evaluated.reduce((sum, item) => sum + item.appliedRules.length, 0),
    },
  };
}

function evaluateDoctor(doctor, request) {
  const context = normalizeRequest(request);
  const result = {
    doctor,
    score: 50,
    blocked: false,
    blockReasons: [],
    warnings: [],
    reasons: [],
    appliedRules: [],
  };

  applyGenericRules(result, context);
  applyDoctorSpecificRules(result, context);
  applyQuotaRules(result, context);

  if (context.preferredDoctor === doctor.name) {
    result.score += 25;
    result.reasons.push('患者指定该医生');
  }

  if (doctor.services.includes(context.service)) {
    result.score += 20;
    result.reasons.push(`医生支持 ${context.service}`);
  } else if (context.service !== 'general') {
    result.score -= 15;
    result.warnings.push(`服务 ${context.service} 不在该医生的配置服务范围内`);
  }

  if (doctor.locations.includes(context.location)) {
    result.score += 10;
  } else {
    block(result, `医生未配置在 ${context.location} 接诊`, 'generic-location');
  }

  if (context.service === 'SMILE' && context.preferredDoctor === 'Dr Sin' && doctor.name === 'Dr Kwok') {
    result.score += 35;
    result.reasons.push('当患者指定 Dr Sin 做 SMILE 时，Dr Kwok 是配置的替代医生');
    result.appliedRules.push('dr-sin-smile-substitute');
  }

  if (context.service === 'dry-eye' && doctor.name === 'Dr V Chu') {
    result.score += 30;
    result.reasons.push('适合无指定医生的干眼症和 CMC case');
    result.appliedRules.push('dr-v-chu-dry-eye-cmc');
  }

  return result;
}

function applyGenericRules(result, context) {
  if (!context.service || !context.appointmentDate || !context.time || !context.location) {
    block(result, '推荐请求缺少必填字段', 'generic-required-fields');
  }
}

function applyDoctorSpecificRules(result, context) {
  switch (result.doctor.name) {
    case 'Dr Tang':
      if (isSurgery(context.service) && context.time === '10:00') {
        block(result, 'Dr Tang 不在 10:00 预约手术', 'dr-tang-no-10am-surgery');
      }
      if (isSurgery(context.service) && context.location === 'Central' && context.dayOfWeek === 4 && context.time !== '17:00') {
        block(result, 'Dr Tang 周四中环手术只可预约 17:00', 'dr-tang-thursday-central-17');
      }
      if (isSurgery(context.service) && hasSameDaySurgeryTooClose(context, 'Dr Tang', 5)) {
        block(result, 'Dr Tang 同日手术至少需要间隔 5 小时', 'dr-tang-sameday-5h-gap');
      }
      break;

    case 'Dr Ho':
      if (isBeforeStartTime(context, getDrHoStartTime(context.dayOfWeek))) {
        block(result, `Dr Ho 开始接诊时间为 ${getDrHoStartTime(context.dayOfWeek)}`, 'dr-ho-start-time');
      }
      if ((context.isSaturday || context.isBeforePublicHoliday) && ['LASIK', 'CAT'].includes(context.service)) {
        block(result, 'Dr Ho 周六或公众假期前不做 LASIK/CAT', 'dr-ho-no-lasik-cat-sat-ph');
      }
      if (context.visitType === 'new' && hasNewPatientWithinOneHour(context, 'Dr Ho')) {
        block(result, 'Dr Ho 1 小时内只接受 1 个新症', 'dr-ho-one-new-patient-per-hour');
      }
      break;

    case 'Dr Leung':
      if (['SMILE', 'SMILE_PRO', 'LASIK', 'ICL'].includes(context.service)) {
        block(result, 'Dr Leung 不做 SMILE/SMILE PRO/LASIK/ICL', 'dr-leung-service-scope');
      }
      if (Number.isFinite(context.patientAge) && context.patientAge < 6) {
        block(result, 'Dr Leung 不接受 6 岁以下患者', 'dr-leung-age-under-6');
      }
      if (context.usesMedicalCard && Number.isFinite(context.patientAge) && context.patientAge < 12) {
        block(result, 'Dr Leung 不接受 12 岁以下医疗卡患者', 'dr-leung-medical-card-under-12');
      }
      break;

    case 'Dr Kwok':
      if (context.service === 'LASIK' && context.isSameDaySurgery) {
        block(result, 'Dr Kwok 不能做 LASIK 即日手术', 'dr-kwok-no-lasik-sameday');
      }
      if (context.location === 'HK' && context.service === 'CAT') {
        block(result, 'Dr Kwok 不能在 HK 做 CAT 手术', 'dr-kwok-no-cat-hk');
      }
      break;

    case 'Dr M Wong':
      if (context.location === 'HK' && ['CAT', 'ICL'].includes(context.service)) {
        block(result, 'Dr M Wong 不能在 HK 做 CAT/ICL', 'dr-m-wong-no-cat-icl-hk');
      }
      if ((context.isSaturday || context.isBeforePublicHoliday) && ['LASIK', 'ICL'].includes(context.service)) {
        block(result, 'Dr M Wong 周六或公众假期前不做 LASIK/ICL', 'dr-m-wong-no-lasik-icl-sat-ph');
      }
      if (context.service === 'injection' && context.isSaturday) {
        block(result, 'Dr M Wong 黄班援助计划打针只约周一至五', 'dr-m-wong-injection-weekday');
      }
      break;

    case 'Dr B Chu':
      if (!isSurgery(context.service) && isBeforeStartTime(context, '10:00')) {
        block(result, 'Dr B Chu 非手术预约最早 10:00', 'dr-b-chu-earliest-10');
      }
      if (context.visitType === 'follow-up' && context.dayOfWeek === 0 && !['F1', 'C1'].includes(context.followUpCode)) {
        result.warnings.push('Dr B Chu 星期日尽量不约 follow-up，F1/C1 除外');
        result.score -= 10;
        result.appliedRules.push('dr-b-chu-sunday-follow-up-warning');
      }
      break;

    case 'Dr Sin':
      if (['SMILE', 'SMILE_PRO'].includes(context.service)) {
        block(result, 'Dr Sin 不接 SMILE，应安排 Dr Kwok', 'dr-sin-no-smile');
      }
      if (!(context.dayOfWeek === 6 && context.time >= '13:00' && context.time <= '14:00' && context.location === 'Mong Kok')) {
        result.warnings.push('Dr Sin 旺角常规可约时间为周六 13:00-14:00');
        result.score -= 8;
        result.appliedRules.push('dr-sin-mk-saturday-window-warning');
      }
      break;

    default:
      break;
  }
}

function applyQuotaRules(result, context) {
  const quota = context.quotaUsage[result.doctor.name];
  if (!quota) return;

  if (quota.used >= quota.limit) {
    block(result, `${result.doctor.name} 当前周期配额已满`, 'doctor-quota-full');
    return;
  }

  if (quota.used / quota.limit >= 0.8) {
    result.warnings.push(`${result.doctor.name} 当前周期配额已超过 80%`);
    result.score -= 12;
    result.appliedRules.push('doctor-quota-warning');
  }
}

function block(result, reason, ruleId) {
  result.blocked = true;
  result.blockReasons.push(reason);
  result.appliedRules.push(ruleId);
}

function normalizeRequest(request) {
  const date = new Date(`${request.appointmentDate}T00:00:00`);
  return {
    ...request,
    service: request.service || 'general',
    location: request.location || 'Central',
    dayOfWeek: Number.isNaN(date.getTime()) ? null : date.getDay(),
    isSaturday: !Number.isNaN(date.getTime()) && date.getDay() === 6,
    quotaUsage: request.quotaUsage || {},
    existingBookings: request.existingBookings || [],
  };
}

function sanitizeRequest(request) {
  return {
    service: request.service,
    appointmentDate: request.appointmentDate,
    time: request.time,
    location: request.location,
    visitType: request.visitType,
    preferredDoctor: request.preferredDoctor,
  };
}

function buildSensorGates(request, recommendations, blocked) {
  return {
    specCoverage: recommendations.length > 0 || blocked.length > 0 ? 'PASS' : 'FAIL',
    explanationCoverage: recommendations.every(item => item.reasons.length > 0) ? 'PASS' : 'FAIL',
    conflictHandling: blocked.length > 0 ? 'PASS' : 'NOT_TRIGGERED',
    quotaCheck: request.quotaUsage ? 'PASS' : 'NOT_TRIGGERED',
  };
}

function isSurgery(service) {
  return SURGERY_SERVICES.has(service);
}

function isBeforeStartTime(context, startTime) {
  return toMinutes(context.time) < toMinutes(startTime);
}

function getDrHoStartTime(dayOfWeek) {
  if (dayOfWeek === 6) return '12:00';
  if (dayOfWeek === 3) return '13:00';
  return '11:30';
}

function hasSameDaySurgeryTooClose(context, doctorName, minGapHours) {
  return context.existingBookings.some(booking => {
    if (booking.doctor !== doctorName || booking.date !== context.appointmentDate || !isSurgery(booking.service)) return false;
    return Math.abs(toMinutes(booking.time) - toMinutes(context.time)) < minGapHours * 60;
  });
}

function hasNewPatientWithinOneHour(context, doctorName) {
  return context.existingBookings.some(booking => {
    if (booking.doctor !== doctorName || booking.date !== context.appointmentDate || booking.visitType !== 'new') return false;
    return Math.abs(toMinutes(booking.time) - toMinutes(context.time)) < 60;
  });
}

function toMinutes(time) {
  const [hours, minutes] = String(time || '00:00').split(':').map(Number);
  return hours * 60 + minutes;
}

module.exports = {
  DEFAULT_DOCTORS,
  REFRACTIVE_SERVICES,
  recommendDoctors,
  evaluateDoctor,
};
