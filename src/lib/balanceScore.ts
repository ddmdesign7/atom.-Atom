import { BiomarkerReading, DailyBioLog, SystemScoreBreakdown, BioBalanceInsight, BiomarkerCategory } from '../types';
import { BIOMARKER_CATALOG } from '../data/biomarkerCatalog';

export function calculateSystemScores(readings: BiomarkerReading[], dailyLogs: DailyBioLog[]): SystemScoreBreakdown {
  const categories: BiomarkerCategory[] = ['metabolic', 'lipids', 'hormones', 'vitamins', 'inflammation', 'cardio'];
  const scores: Record<string, number> = {};

  // For each category, get the most recent reading for each unique biomarker
  categories.forEach(cat => {
    const catReadings = readings.filter(r => r.category === cat);
    if (catReadings.length === 0) {
      scores[cat] = 85; // Default healthy baseline if not yet tested
      return;
    }

    // Map by biomarkerId -> latest reading
    const latestMap = new Map<string, BiomarkerReading>();
    catReadings.forEach(r => {
      if (!latestMap.has(r.biomarkerId)) {
        latestMap.set(r.biomarkerId, r);
      }
    });

    let totalPoints = 0;
    let count = 0;

    latestMap.forEach(reading => {
      count++;
      switch (reading.status) {
        case 'optimal':
          totalPoints += 100;
          break;
        case 'borderline_low':
        case 'borderline_high':
          totalPoints += 70;
          break;
        case 'critical_low':
        case 'critical_high':
          totalPoints += 40;
          break;
      }
    });

    scores[cat] = count > 0 ? Math.round(totalPoints / count) : 85;
  });

  // Calculate lifestyle score from recent 7 daily logs
  let lifestyleScore = 80;
  if (dailyLogs.length > 0) {
    const recent = dailyLogs.slice(0, 7);
    let lifeTotal = 0;

    recent.forEach(log => {
      let dayScore = 0;
      // Sleep (7-9h optimal)
      if (log.sleepHours >= 7 && log.sleepHours <= 9) dayScore += 25;
      else if (log.sleepHours >= 6) dayScore += 18;
      else dayScore += 10;

      // Hydration (64+ oz)
      if (log.hydrationOz >= 75) dayScore += 25;
      else if (log.hydrationOz >= 50) dayScore += 18;
      else dayScore += 10;

      // Steps (7k+ target)
      if (log.steps >= 8000) dayScore += 25;
      else if (log.steps >= 5000) dayScore += 18;
      else dayScore += 12;

      // Stress / Sleep Quality
      const recoveryScore = ((6 - log.stressLevel) * 2.5) + (log.sleepQuality * 2.5); // max 25
      dayScore += Math.min(25, recoveryScore);

      lifeTotal += dayScore;
    });

    lifestyleScore = Math.round(lifeTotal / recent.length);
  }

  // Weighted overall calculation
  const overall = Math.round(
    (scores.metabolic * 0.20) +
    (scores.lipids * 0.18) +
    (scores.hormones * 0.16) +
    (scores.vitamins * 0.14) +
    (scores.inflammation * 0.14) +
    (scores.cardio * 0.10) +
    (lifestyleScore * 0.08)
  );

  return {
    metabolic: scores.metabolic,
    lipids: scores.lipids,
    hormones: scores.hormones,
    vitamins: scores.vitamins,
    inflammation: scores.inflammation,
    cardio: scores.cardio,
    lifestyle: lifestyleScore,
    overall: Math.min(100, Math.max(10, overall))
  };
}

export function generateBalanceInsights(readings: BiomarkerReading[], dailyLogs: DailyBioLog[]): BioBalanceInsight[] {
  const insights: BioBalanceInsight[] = [];

  // Group latest readings
  const latestMap = new Map<string, BiomarkerReading>();
  readings.forEach(r => {
    if (!latestMap.has(r.biomarkerId)) {
      latestMap.set(r.biomarkerId, r);
    }
  });

  // Check Vitamin D
  const vitD = latestMap.get('vitamin_d');
  if (vitD && vitD.status !== 'optimal') {
    if (vitD.value < 50) {
      insights.push({
        id: 'ins-vitd-low',
        type: 'warning',
        category: 'vitamins',
        priority: 'high',
        title: 'Vitamin D Sub-Optimal for Immune Priming',
        message: `Your Vitamin D is currently ${vitD.value} ${vitD.unit} (optimal target: 50-80 ng/mL). Adequate 25-OH is crucial for regulatory T-cells, bone matrix, and mental clarity.`,
        actionProtocol: 'Aim for 15-20 minutes of unshielded midday sun exposure, or supplement with 2,000-4,000 IU Vitamin D3 paired with Vitamin K2 (MK-7) alongside healthy dietary fats.',
        relatedBiomarkers: ['vitamin_d']
      });
    }
  }

  // Check Fasting Glucose & Insulin
  const glucose = latestMap.get('fasting_glucose');
  const insulin = latestMap.get('fasting_insulin');
  if (glucose && insulin && glucose.status === 'optimal' && insulin.status === 'optimal') {
    insights.push({
      id: 'ins-metabolic-optimal',
      type: 'success',
      category: 'metabolic',
      priority: 'low',
      title: 'Peak Glycemic Balance & Insulin Sensitivity',
      message: `Fasting Glucose (${glucose.value} ${glucose.unit}) and Insulin (${insulin.value} ${insulin.unit}) indicate prime metabolic flexibility and efficient cellular glucose uptake.`,
      actionProtocol: 'Maintain your current cadence of nutrient-dense whole foods and post-prandial movement.',
      relatedBiomarkers: ['fasting_glucose', 'fasting_insulin']
    });
  } else if (glucose && glucose.status !== 'optimal') {
    insights.push({
      id: 'ins-glucose-elevated',
      type: 'warning',
      category: 'metabolic',
      priority: 'medium',
      title: 'Elevated Glycemic Variability Detected',
      message: `Fasting glucose measured at ${glucose.value} ${glucose.unit}. Early stabilization prevents chronic glycation stress.`,
      actionProtocol: 'Front-load protein and fiber in meals, avoid refined carbohydrates after 7:00 PM, and integrate a brisk 10-minute walk immediately following your highest-carb meal.',
      relatedBiomarkers: ['fasting_glucose']
    });
  }

  // Check hs-CRP (Inflammation)
  const crp = latestMap.get('hs_crp');
  if (crp) {
    if (crp.value <= 0.7) {
      insights.push({
        id: 'ins-crp-low',
        type: 'success',
        category: 'inflammation',
        priority: 'low',
        title: 'Systemic Endothelial Inflammation is Calibrated',
        message: `hs-CRP level is ${crp.value} ${crp.unit}, placing you in the lowest cardiovascular inflammatory risk tier.`,
        actionProtocol: 'Continue incorporating cold-water omega-3 fatty acids and polyphenol rich extra-virgin olive oil.',
        relatedBiomarkers: ['hs_crp']
      });
    } else {
      insights.push({
        id: 'ins-crp-high',
        type: 'alert',
        category: 'inflammation',
        priority: 'high',
        title: 'Elevated Systemic Inflammatory Marker',
        message: `hs-CRP is ${crp.value} ${crp.unit} (optimal < 0.7 mg/L). This suggests microvascular irritation, chronic recovery debt, or acute physiological strain.`,
        actionProtocol: 'Review sleep latency, eliminate seed oils and industrial trans-fats, and add targeted curcumin or specialized pro-resolving mediators (SPMs).',
        relatedBiomarkers: ['hs_crp']
      });
    }
  }

  // Check Lipids (Triglycerides to HDL ratio)
  const tg = latestMap.get('triglycerides');
  const hdl = latestMap.get('hdl_c');
  if (tg && hdl) {
    const ratio = Number((tg.value / hdl.value).toFixed(2));
    if (ratio <= 1.5) {
      insights.push({
        id: 'ins-tg-hdl-optimal',
        type: 'success',
        category: 'lipids',
        priority: 'low',
        title: 'Optimal TG/HDL Atherogenic Ratio',
        message: `Your TG:HDL ratio is ${ratio} (optimal < 1.8), indicating small dense LDL particles are minimal and vascular clearance is robust.`,
        actionProtocol: 'Keep up the daily resistance training and healthy fats intake.',
        relatedBiomarkers: ['triglycerides', 'hdl_c']
      });
    } else if (ratio > 2.5) {
      insights.push({
        id: 'ins-tg-hdl-high',
        type: 'warning',
        category: 'lipids',
        priority: 'medium',
        title: 'Elevated Triglyceride to HDL Proportion',
        message: `Your TG:HDL ratio is currently ${ratio}. Higher ratios frequently correspond with increased small dense LDL particles and hepatic lipid accumulation.`,
        actionProtocol: 'Reduce liquid fructose, avoid alcoholic evening beverages, and incorporate 30g of daily soluble prebiotic fiber.',
        relatedBiomarkers: ['triglycerides', 'hdl_c', 'ldl_c']
      });
    }
  }

  // Check Lifestyle Correlation with HRV & Sleep
  if (dailyLogs.length >= 3) {
    const avgSleep = dailyLogs.slice(0, 3).reduce((acc, l) => acc + l.sleepHours, 0) / 3;
    const avgStress = dailyLogs.slice(0, 3).reduce((acc, l) => acc + l.stressLevel, 0) / 3;
    
    if (avgSleep < 6.8 || avgStress >= 3.5) {
      insights.push({
        id: 'ins-lifestyle-sleep',
        type: 'recommendation',
        category: 'lifestyle',
        priority: 'high',
        title: 'Circadian Recovery Window Sub-Optimal',
        message: `Your average sleep over the past 3 days is ${avgSleep.toFixed(1)} hours with elevated stress indices (${avgStress.toFixed(1)}/5). Sleep restriction directly impairs morning cortisol curve and insulin sensitivity.`,
        actionProtocol: 'Establish a strict 60-minute digital sundown before bed, keep the bedroom below 67°F (19°C), and take 300mg Magnesium Bisglycinate 45 minutes before sleep.',
        relatedBiomarkers: ['cortisol_am', 'hrv']
      });
    }
  }

  // Fallback general guidance if no custom triggers
  if (insights.length === 0) {
    insights.push({
      id: 'ins-general-longevity',
      type: 'success',
      category: 'lifestyle',
      priority: 'low',
      title: 'Biological Equilibrium Well-Maintained',
      message: 'All evaluated biomarker metrics and daily lifestyle pillars remain aligned with longevity reference thresholds.',
      actionProtocol: 'Continue your balanced routine of hydration, daily step counts, and regular routine lab testing every 6 months.'
    });
  }

  return insights;
}
