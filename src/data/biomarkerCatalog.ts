import { BiomarkerDefinition, BiomarkerStatus, BiomarkerCategory } from '../types';

export const BIOMARKER_CATALOG: BiomarkerDefinition[] = [
  // METABOLIC
  {
    id: 'fasting_glucose',
    name: 'Fasting Glucose',
    shortName: 'Glucose',
    category: 'metabolic',
    standardUnit: 'mg/dL',
    alternativeUnit: 'mmol/L',
    unitMultiplier: 0.0555,
    optimalMin: 72,
    optimalMax: 90,
    warningLowMin: 65,
    warningHighMax: 99,
    criticalLowMin: 55,
    criticalHighMax: 125,
    description: 'Blood sugar level after at least 8 hours of fasting.',
    clinicalMeaning: 'Core indicator of glycemic regulation, insulin sensitivity, and metabolic fitness.',
    lifestyleTip: 'Minimize refined carbohydrates and walk for 10-15 minutes after meals to stabilize glucose.',
    tags: ['metabolic', 'energy', 'longevity']
  },
  {
    id: 'hba1c',
    name: 'Hemoglobin A1c',
    shortName: 'HbA1c',
    category: 'metabolic',
    standardUnit: '%',
    alternativeUnit: 'mmol/mol',
    unitMultiplier: 10.93,
    optimalMin: 4.8,
    optimalMax: 5.4,
    warningLowMin: 4.5,
    warningHighMax: 5.7,
    criticalLowMin: 4.0,
    criticalHighMax: 6.4,
    description: 'Average blood glucose levels over the preceding 2 to 3 months.',
    clinicalMeaning: 'Gold standard for long-term glycemic balance and glycation damage risk.',
    lifestyleTip: 'Incorporate resistance training and intermittent fasting to improve cellular glucose uptake.',
    tags: ['metabolic', 'glycemic', 'longevity']
  },
  {
    id: 'fasting_insulin',
    name: 'Fasting Insulin',
    shortName: 'Insulin',
    category: 'metabolic',
    standardUnit: 'µIU/mL',
    alternativeUnit: 'pmol/L',
    unitMultiplier: 6.945,
    optimalMin: 2.0,
    optimalMax: 5.5,
    warningLowMin: 1.5,
    warningHighMax: 9.0,
    criticalLowMin: 1.0,
    criticalHighMax: 19.0,
    description: 'Resting concentration of insulin hormone produced by beta cells.',
    clinicalMeaning: 'Early warning biomarker for hyperinsulinemia and metabolic resistance years before glucose rises.',
    lifestyleTip: 'Optimize sleep hygiene and reduce late-night eating to maintain low baseline insulin.',
    tags: ['metabolic', 'hormone', 'insulin']
  },
  {
    id: 'homa_ir',
    name: 'HOMA-IR (Insulin Resistance Index)',
    shortName: 'HOMA-IR',
    category: 'metabolic',
    standardUnit: 'score',
    optimalMin: 0.5,
    optimalMax: 1.4,
    warningLowMin: 0.3,
    warningHighMax: 1.9,
    criticalLowMin: 0.1,
    criticalHighMax: 2.9,
    description: 'Homeostatic Model Assessment score computed from fasting glucose and insulin.',
    clinicalMeaning: 'Quantitative score of biological insulin resistance.',
    lifestyleTip: 'Zone 2 aerobic exercise combined with polyphenol-rich nutrition optimizes HOMA-IR.',
    tags: ['metabolic', 'calculation', 'longevity']
  },

  // LIPID PANEL
  {
    id: 'total_cholesterol',
    name: 'Total Cholesterol',
    shortName: 'Cholesterol',
    category: 'lipids',
    standardUnit: 'mg/dL',
    alternativeUnit: 'mmol/L',
    unitMultiplier: 0.0259,
    optimalMin: 150,
    optimalMax: 199,
    warningLowMin: 130,
    warningHighMax: 225,
    criticalLowMin: 110,
    criticalHighMax: 260,
    description: 'Total measure of circulating cholesterol particles in the blood.',
    clinicalMeaning: 'Essential building block for cellular membranes, steroid hormones, and bile salts.',
    lifestyleTip: 'Ensure a diet rich in monounsaturated fats (extra virgin olive oil, avocados) and soluble fiber.',
    tags: ['lipids', 'cardiovascular']
  },
  {
    id: 'ldl_c',
    name: 'LDL Cholesterol',
    shortName: 'LDL-C',
    category: 'lipids',
    standardUnit: 'mg/dL',
    alternativeUnit: 'mmol/L',
    unitMultiplier: 0.0259,
    optimalMin: 60,
    optimalMax: 99,
    warningLowMin: 50,
    warningHighMax: 129,
    criticalLowMin: 40,
    criticalHighMax: 160,
    description: 'Low-density lipoprotein cholesterol particle carrying lipids to peripheral tissues.',
    clinicalMeaning: 'Key metric assessed for atherosclerotic cardiovascular plaque risk.',
    lifestyleTip: 'Increase soluble prebiotic fibers like psyllium husk and oat beta-glucan.',
    tags: ['lipids', 'cardiovascular', 'heart']
  },
  {
    id: 'hdl_c',
    name: 'HDL Cholesterol',
    shortName: 'HDL-C',
    category: 'lipids',
    standardUnit: 'mg/dL',
    alternativeUnit: 'mmol/L',
    unitMultiplier: 0.0259,
    optimalMin: 55,
    optimalMax: 85,
    warningLowMin: 45,
    warningHighMax: 95,
    criticalLowMin: 35,
    criticalHighMax: 110,
    description: 'High-density lipoprotein involved in reverse cholesterol transport to the liver.',
    clinicalMeaning: 'Protective vascular carrier; higher values indicate efficient lipid clearance.',
    lifestyleTip: 'Engage in regular aerobic exercise and consume cold-water fatty fish rich in EPA/DHA.',
    tags: ['lipids', 'cardiovascular', 'protective']
  },
  {
    id: 'triglycerides',
    name: 'Triglycerides',
    shortName: 'Triglycerides',
    category: 'lipids',
    standardUnit: 'mg/dL',
    alternativeUnit: 'mmol/L',
    unitMultiplier: 0.0113,
    optimalMin: 45,
    optimalMax: 85,
    warningLowMin: 35,
    warningHighMax: 130,
    criticalLowMin: 25,
    criticalHighMax: 200,
    description: 'Circulating storage fats in the bloodstream derived from excess calories.',
    clinicalMeaning: 'Highly sensitive proxy for hepatic fat processing and metabolic efficiency.',
    lifestyleTip: 'Limit alcohol intake, eliminate high-fructose corn syrup, and maintain daily movement.',
    tags: ['lipids', 'metabolic', 'dietary']
  },
  {
    id: 'apob',
    name: 'Apolipoprotein B (ApoB)',
    shortName: 'ApoB',
    category: 'lipids',
    standardUnit: 'mg/dL',
    alternativeUnit: 'g/L',
    unitMultiplier: 0.01,
    optimalMin: 50,
    optimalMax: 75,
    warningLowMin: 40,
    warningHighMax: 90,
    criticalLowMin: 30,
    criticalHighMax: 120,
    description: 'Direct particle count of all atherogenic lipoproteins in circulation.',
    clinicalMeaning: 'Considered by modern preventive cardiologists as the superior cardiovascular risk predictor.',
    lifestyleTip: 'Work with a clinical provider on dietary lipid balance and botanical phytosterols.',
    tags: ['lipids', 'cardiovascular', 'advanced']
  },

  // HORMONES & THYROID
  {
    id: 'total_testosterone',
    name: 'Total Testosterone',
    shortName: 'Testosterone',
    category: 'hormones',
    standardUnit: 'ng/dL',
    alternativeUnit: 'nmol/L',
    unitMultiplier: 0.0347,
    optimalMin: 550,
    optimalMax: 950,
    warningLowMin: 400,
    warningHighMax: 1100,
    criticalLowMin: 250,
    criticalHighMax: 1300,
    description: 'Primary androgen hormone modulating muscle synthesis, bone density, and vitality.',
    clinicalMeaning: 'Crucial for metabolic rate, cognitive drive, body composition, and recovery.',
    lifestyleTip: 'Prioritize 7-8.5 hours of deep sleep, heavy compound lifting, and adequate dietary zinc.',
    tags: ['hormones', 'vitality', 'strength']
  },
  {
    id: 'cortisol_am',
    name: 'Cortisol (Morning 8 AM)',
    shortName: 'AM Cortisol',
    category: 'hormones',
    standardUnit: 'µg/dL',
    alternativeUnit: 'nmol/L',
    unitMultiplier: 27.59,
    optimalMin: 12,
    optimalMax: 19,
    warningLowMin: 8,
    warningHighMax: 22,
    criticalLowMin: 5,
    criticalHighMax: 28,
    description: 'Peak morning glucocorticoid hormone regulating circadian wakefulness and stress response.',
    clinicalMeaning: 'Reflects hypothalamic-pituitary-adrenal (HPA) axis balance and diurnal rhythm.',
    lifestyleTip: 'Get natural morning sunlight within 30 minutes of waking and practice breathwork.',
    tags: ['hormones', 'stress', 'circadian']
  },
  {
    id: 'tsh',
    name: 'Thyroid Stimulating Hormone (TSH)',
    shortName: 'TSH',
    category: 'hormones',
    standardUnit: 'µIU/mL',
    alternativeUnit: 'mIU/L',
    unitMultiplier: 1.0,
    optimalMin: 1.0,
    optimalMax: 2.5,
    warningLowMin: 0.4,
    warningHighMax: 3.8,
    criticalLowMin: 0.2,
    criticalHighMax: 5.5,
    description: 'Pituitary signal regulating thyroid gland hormone production.',
    clinicalMeaning: 'Central governor of systemic basal metabolic rate and cellular energy production.',
    lifestyleTip: 'Ensure adequate dietary iodine (kelp/seafood) and selenium (brazil nuts) without oversupplementing.',
    tags: ['hormones', 'thyroid', 'metabolism']
  },
  {
    id: 'free_t3',
    name: 'Free Triiodothyronine (Free T3)',
    shortName: 'Free T3',
    category: 'hormones',
    standardUnit: 'pg/mL',
    alternativeUnit: 'pmol/L',
    unitMultiplier: 1.536,
    optimalMin: 3.1,
    optimalMax: 4.2,
    warningLowMin: 2.5,
    warningHighMax: 4.6,
    criticalLowMin: 2.0,
    criticalHighMax: 5.2,
    description: 'Active biological thyroid hormone driving mitochondrial metabolism.',
    clinicalMeaning: 'Reflects peripheral conversion of T4 to active T3 in the liver and gut.',
    lifestyleTip: 'Manage chronic caloric deprivation and gut microbiome health to maintain strong T3 conversion.',
    tags: ['hormones', 'thyroid', 'energy']
  },
  {
    id: 'dhea_s',
    name: 'DHEA-Sulfate',
    shortName: 'DHEA-S',
    category: 'hormones',
    standardUnit: 'µg/dL',
    alternativeUnit: 'µmol/L',
    unitMultiplier: 0.0271,
    optimalMin: 200,
    optimalMax: 450,
    warningLowMin: 130,
    warningHighMax: 550,
    criticalLowMin: 80,
    criticalHighMax: 650,
    description: 'Most abundant circulating steroid pro-hormone produced by adrenal cortices.',
    clinicalMeaning: 'Adrenal reserve indicator and precursor for testosterone and estrogens.',
    lifestyleTip: 'Engage in active restorative practices like sauna therapy and meditation.',
    tags: ['hormones', 'longevity', 'adrenal']
  },

  // VITAMINS & MINERALS
  {
    id: 'vitamin_d',
    name: 'Vitamin D (25-Hydroxy)',
    shortName: 'Vitamin D',
    category: 'vitamins',
    standardUnit: 'ng/mL',
    alternativeUnit: 'nmol/L',
    unitMultiplier: 2.496,
    optimalMin: 50,
    optimalMax: 80,
    warningLowMin: 30,
    warningHighMax: 90,
    criticalLowMin: 20,
    criticalHighMax: 110,
    description: 'Circulating secosteroid pre-hormone vital for immunity, bone matrix, and mood.',
    clinicalMeaning: 'Regulates hundreds of genes governing immune defense, calcium homeostasis, and cognitive health.',
    lifestyleTip: 'Get midday sun exposure or supplement with Vitamin D3 paired with Vitamin K2 (MK-7) and dietary fats.',
    tags: ['vitamins', 'immunity', 'bone']
  },
  {
    id: 'vitamin_b12',
    name: 'Vitamin B12 (Cobalamin)',
    shortName: 'Vitamin B12',
    category: 'vitamins',
    standardUnit: 'pg/mL',
    alternativeUnit: 'pmol/L',
    unitMultiplier: 0.738,
    optimalMin: 550,
    optimalMax: 1100,
    warningLowMin: 350,
    warningHighMax: 1300,
    criticalLowMin: 200,
    criticalHighMax: 1600,
    description: 'Essential cofactor for neural myelination, DNA synthesis, and red blood cell maturation.',
    clinicalMeaning: 'Prevents neurological fatigue, cognitive fog, and macrocytic anemia.',
    lifestyleTip: 'Include pasture-raised meats, eggs, or bioavailable methylcobalamin/adenosylcobalamin forms.',
    tags: ['vitamins', 'neural', 'energy']
  },
  {
    id: 'ferritin',
    name: 'Serum Ferritin',
    shortName: 'Ferritin',
    category: 'vitamins',
    standardUnit: 'ng/mL',
    alternativeUnit: 'µg/L',
    unitMultiplier: 1.0,
    optimalMin: 60,
    optimalMax: 180,
    warningLowMin: 30,
    warningHighMax: 250,
    criticalLowMin: 15,
    criticalHighMax: 350,
    description: 'Primary intracellular iron storage protein complex.',
    clinicalMeaning: 'Measures biological iron reserves without diurnal fluctuations of serum iron.',
    lifestyleTip: 'Pair iron-rich foods with Vitamin C and avoid consuming tea/coffee with meals.',
    tags: ['minerals', 'blood', 'energy']
  },
  {
    id: 'magnesium_rbc',
    name: 'Magnesium (RBC)',
    shortName: 'Magnesium',
    category: 'vitamins',
    standardUnit: 'mg/dL',
    alternativeUnit: 'mmol/L',
    unitMultiplier: 0.4114,
    optimalMin: 5.5,
    optimalMax: 6.8,
    warningLowMin: 4.8,
    warningHighMax: 7.2,
    criticalLowMin: 4.0,
    criticalHighMax: 8.0,
    description: 'Intracellular erythrocyte magnesium levels (more accurate than serum).',
    clinicalMeaning: 'Cofactor for 300+ enzymatic reactions including ATP production, muscle relaxation, and cardiac rhythm.',
    lifestyleTip: 'Supplement with Magnesium Glycinate or Threonate in the evening for neuromuscular calming.',
    tags: ['minerals', 'cellular', 'recovery']
  },
  {
    id: 'zinc_serum',
    name: 'Serum Zinc',
    shortName: 'Zinc',
    category: 'vitamins',
    standardUnit: 'µg/dL',
    alternativeUnit: 'µmol/L',
    unitMultiplier: 0.153,
    optimalMin: 90,
    optimalMax: 130,
    warningLowMin: 70,
    warningHighMax: 150,
    criticalLowMin: 55,
    criticalHighMax: 180,
    description: 'Trace mineral crucial for cellular repair, testosterone synthesis, and immune competence.',
    clinicalMeaning: 'Maintains epithelial integrity, mucosal immunity, and hormonal receptor sensitivity.',
    lifestyleTip: 'Consume pumpkin seeds, oysters, and lentils or bioavailable zinc picolinate.',
    tags: ['minerals', 'immunity', 'repair']
  },

  // INFLAMMATION & IMMUNE
  {
    id: 'hs_crp',
    name: 'hs-CRP (High Sensitivity C-Reactive Protein)',
    shortName: 'hs-CRP',
    category: 'inflammation',
    standardUnit: 'mg/L',
    optimalMin: 0.1,
    optimalMax: 0.7,
    warningLowMin: 0.05,
    warningHighMax: 1.5,
    criticalLowMin: 0.01,
    criticalHighMax: 3.0,
    description: 'Acute-phase hepatic protein signaling microvascular and systemic inflammation.',
    clinicalMeaning: 'Potent biomarker of arterial inflammation, metabolic stress, and chronic immune activation.',
    lifestyleTip: 'Adopt an anti-inflammatory Mediterranean dietary pattern with curcumin and rich polyphenols.',
    tags: ['inflammation', 'cardiovascular', 'immune']
  },
  {
    id: 'homocysteine',
    name: 'Homocysteine',
    shortName: 'Homocysteine',
    category: 'inflammation',
    standardUnit: 'µmol/L',
    optimalMin: 5.0,
    optimalMax: 8.5,
    warningLowMin: 4.0,
    warningHighMax: 11.0,
    criticalLowMin: 3.0,
    criticalHighMax: 15.0,
    description: 'Sulfur-containing intermediate amino acid produced during methionine metabolism.',
    clinicalMeaning: 'Elevations indicate suboptimal methylation pathways and endothelial vascular stress.',
    lifestyleTip: 'Ensure adequate methylated B-vitamins (L-Methylfolate, Methylcobalamin, P-5-P).',
    tags: ['inflammation', 'methylation', 'vascular']
  },
  {
    id: 'wbc_count',
    name: 'White Blood Cell Count (WBC)',
    shortName: 'WBC Count',
    category: 'inflammation',
    standardUnit: 'k/µL',
    optimalMin: 4.5,
    optimalMax: 7.5,
    warningLowMin: 3.8,
    warningHighMax: 9.5,
    criticalLowMin: 3.0,
    criticalHighMax: 11.5,
    description: 'Total leukocyte count defending the body against pathogens and tissue injury.',
    clinicalMeaning: 'Baseline immune readiness and indicator of acute infection vs chronic low-grade activation.',
    lifestyleTip: 'Maintain balanced gut flora with fermented foods and manage psychological stressors.',
    tags: ['immune', 'blood', 'inflammation']
  },

  // CARDIOVASCULAR & VITALS
  {
    id: 'resting_hr',
    name: 'Resting Heart Rate (RHR)',
    shortName: 'Resting HR',
    category: 'cardio',
    standardUnit: 'bpm',
    optimalMin: 48,
    optimalMax: 62,
    warningLowMin: 42,
    warningHighMax: 72,
    criticalLowMin: 38,
    criticalHighMax: 85,
    description: 'Baseline resting cardiac contractions per minute during quiet wakefulness.',
    clinicalMeaning: 'Direct measure of autonomic nervous system tone and cardiovascular efficiency.',
    lifestyleTip: 'Build a solid aerobic base with low-intensity Zone 2 cardio (3-4x per week).',
    tags: ['cardio', 'vitals', 'recovery']
  },
  {
    id: 'systolic_bp',
    name: 'Systolic Blood Pressure',
    shortName: 'Systolic BP',
    category: 'cardio',
    standardUnit: 'mmHg',
    optimalMin: 105,
    optimalMax: 118,
    warningLowMin: 95,
    warningHighMax: 128,
    criticalLowMin: 85,
    criticalHighMax: 140,
    description: 'Pressure exerted in arteries when the left ventricle contracts.',
    clinicalMeaning: 'Key metric for arterial compliance, vascular elasticity, and stroke volume.',
    lifestyleTip: 'Ensure balanced potassium-to-sodium ratio and consume dietary nitrates (beetroot, arugula).',
    tags: ['cardio', 'vitals', 'vascular']
  },
  {
    id: 'diastolic_bp',
    name: 'Diastolic Blood Pressure',
    shortName: 'Diastolic BP',
    category: 'cardio',
    standardUnit: 'mmHg',
    optimalMin: 68,
    optimalMax: 78,
    warningLowMin: 60,
    warningHighMax: 84,
    criticalLowMin: 55,
    criticalHighMax: 90,
    description: 'Arterial resistance pressure when the heart relaxes between beats.',
    clinicalMeaning: 'Reflects systemic peripheral vascular resistance and endothelial nitric oxide tone.',
    lifestyleTip: 'Incorporate slow diaphragmatic box breathing to stimulate the parasympathetic vagus nerve.',
    tags: ['cardio', 'vitals', 'vascular']
  },
  {
    id: 'hrv',
    name: 'Heart Rate Variability (rMSSD)',
    shortName: 'HRV',
    category: 'cardio',
    standardUnit: 'ms',
    optimalMin: 55,
    optimalMax: 110,
    warningLowMin: 35,
    warningHighMax: 140,
    criticalLowMin: 20,
    criticalHighMax: 160,
    description: 'Variation in time intervals between consecutive heartbeats.',
    clinicalMeaning: 'Gold standard biomarker of autonomic flexibility, nervous system balance, and biological recovery.',
    lifestyleTip: 'Avoid heavy meals or alcohol 3 hours before sleep to prevent night-time sympathetic spikes.',
    tags: ['cardio', 'recovery', 'nervous_system']
  },

  // ORGAN FUNCTION
  {
    id: 'alt',
    name: 'Alanine Aminotransferase (ALT)',
    shortName: 'ALT',
    category: 'organ_function',
    standardUnit: 'U/L',
    optimalMin: 10,
    optimalMax: 24,
    warningLowMin: 8,
    warningHighMax: 35,
    criticalLowMin: 5,
    criticalHighMax: 55,
    description: 'Enzyme primarily localized in hepatocytes involved in amino acid metabolism.',
    clinicalMeaning: 'Sensitive marker of liver cell integrity and metabolic hepatic stress.',
    lifestyleTip: 'Limit processed sugars, avoid acetaminophen with alcohol, and consume cruciferous greens.',
    tags: ['organ', 'liver', 'detox']
  },
  {
    id: 'egfr',
    name: 'Estimated Glomerular Filtration Rate (eGFR)',
    shortName: 'eGFR',
    category: 'organ_function',
    standardUnit: 'mL/min/1.73m²',
    optimalMin: 95,
    optimalMax: 130,
    warningLowMin: 85,
    warningHighMax: 140,
    criticalLowMin: 60,
    criticalHighMax: 150,
    description: 'Calculated efficiency of renal filtration based on serum creatinine.',
    clinicalMeaning: 'Fundamental assessment of kidney function and glomerular clearance capability.',
    lifestyleTip: 'Maintain continuous optimal hydration and moderate excess NSAID painkiller usage.',
    tags: ['organ', 'kidney', 'filtration']
  }
];

export const CATEGORY_METADATA: Record<BiomarkerCategory, { label: string; description: string; color: string; bgLight: string; border: string; iconName: string }> = {
  metabolic: {
    label: 'Metabolic & Glycemic',
    description: 'Insulin sensitivity, glucose dynamics, and cellular energy production',
    color: 'text-amber-700',
    bgLight: 'bg-amber-50',
    border: 'border-amber-200',
    iconName: 'Zap'
  },
  lipids: {
    label: 'Lipid & Vascular',
    description: 'Atherogenic particles, cholesterol transport, and cardiovascular plaque risk',
    color: 'text-rose-700',
    bgLight: 'bg-rose-50',
    border: 'border-rose-200',
    iconName: 'HeartPulse'
  },
  hormones: {
    label: 'Hormones & Thyroid',
    description: 'Endocrine equilibrium, stress axes, metabolic rate, and cellular recovery',
    color: 'text-indigo-700',
    bgLight: 'bg-indigo-50',
    border: 'border-indigo-200',
    iconName: 'Activity'
  },
  vitamins: {
    label: 'Vitamins & Minerals',
    description: 'Essential micronutrient cofactors, oxygenation, and enzymatic building blocks',
    color: 'text-emerald-700',
    bgLight: 'bg-emerald-50',
    border: 'border-emerald-200',
    iconName: 'Sparkles'
  },
  inflammation: {
    label: 'Inflammation & Immune',
    description: 'Systemic cytokine response, endothelial irritation, and methylation',
    color: 'text-orange-700',
    bgLight: 'bg-orange-50',
    border: 'border-orange-200',
    iconName: 'ShieldAlert'
  },
  cardio: {
    label: 'Cardiovascular & Vitals',
    description: 'Resting pulse, blood pressure, autonomic HRV, and cardiovascular strain',
    color: 'text-cyan-700',
    bgLight: 'bg-cyan-50',
    border: 'border-cyan-200',
    iconName: 'Heart'
  },
  organ_function: {
    label: 'Organ Performance',
    description: 'Hepatic enzyme integrity, kidney filtration, and biological detoxification',
    color: 'text-teal-700',
    bgLight: 'bg-teal-50',
    border: 'border-teal-200',
    iconName: 'Sliders'
  }
};

/**
 * Calculates the biological status of a biomarker value against catalog ranges
 */
export function calculateBiomarkerStatus(biomarkerId: string, value: number): BiomarkerStatus {
  const definition = BIOMARKER_CATALOG.find(b => b.id === biomarkerId);
  if (!definition) return 'optimal';

  if (value >= definition.optimalMin && value <= definition.optimalMax) {
    return 'optimal';
  }

  // Check critical thresholds
  if (definition.criticalLowMin !== undefined && value < definition.criticalLowMin) {
    return 'critical_low';
  }
  if (definition.criticalHighMax !== undefined && value > definition.criticalHighMax) {
    return 'critical_high';
  }

  // Check warning thresholds
  if (value < definition.optimalMin) {
    return 'borderline_low';
  }
  if (value > definition.optimalMax) {
    return 'borderline_high';
  }

  return 'optimal';
}

export function getStatusColor(status: BiomarkerStatus): { badge: string; text: string; bg: string; border: string; label: string } {
  switch (status) {
    case 'optimal':
      return {
        badge: 'bg-emerald-100 text-emerald-800 border-emerald-300',
        text: 'text-emerald-700',
        bg: 'bg-emerald-500',
        border: 'border-emerald-200',
        label: 'Optimal'
      };
    case 'borderline_low':
      return {
        badge: 'bg-amber-100 text-amber-800 border-amber-300',
        text: 'text-amber-700',
        bg: 'bg-amber-500',
        border: 'border-amber-200',
        label: 'Borderline Low'
      };
    case 'borderline_high':
      return {
        badge: 'bg-amber-100 text-amber-800 border-amber-300',
        text: 'text-amber-700',
        bg: 'bg-amber-500',
        border: 'border-amber-200',
        label: 'Borderline High'
      };
    case 'critical_low':
      return {
        badge: 'bg-rose-100 text-rose-800 border-rose-300',
        text: 'text-rose-700',
        bg: 'bg-rose-500',
        border: 'border-rose-200',
        label: 'Attention Low'
      };
    case 'critical_high':
      return {
        badge: 'bg-rose-100 text-rose-800 border-rose-300',
        text: 'text-rose-700',
        bg: 'bg-rose-500',
        border: 'border-rose-200',
        label: 'Attention High'
      };
  }
}
