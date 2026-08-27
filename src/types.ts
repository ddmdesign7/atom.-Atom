export type BiomarkerCategory = 
  | 'metabolic'
  | 'lipids'
  | 'hormones'
  | 'vitamins'
  | 'inflammation'
  | 'cardio'
  | 'organ_function';

export type BiomarkerStatus = 
  | 'optimal'
  | 'borderline_low'
  | 'borderline_high'
  | 'critical_low'
  | 'critical_high';

export interface BiomarkerDefinition {
  id: string;
  name: string;
  shortName: string;
  category: BiomarkerCategory;
  standardUnit: string;
  alternativeUnit?: string;
  unitMultiplier?: number; // Multiply standard to get alt
  optimalMin: number;
  optimalMax: number;
  warningLowMin?: number;
  warningHighMax?: number;
  criticalLowMin?: number;
  criticalHighMax?: number;
  description: string;
  clinicalMeaning: string;
  lifestyleTip: string;
  tags: string[];
}

export interface BiomarkerReading {
  id: string;
  userId: string;
  biomarkerId: string;
  biomarkerName: string;
  category: BiomarkerCategory;
  value: number;
  unit: string;
  status: BiomarkerStatus;
  timestamp: string; // ISO date
  labName?: string;
  notes?: string;
  fileId?: string; // Linked lab document
}

export interface LabDocument {
  id: string;
  userId: string;
  fileName: string;
  originalName: string;
  fileSize: number; // in bytes
  fileType: string; // e.g. application/pdf, image/jpeg, image/png
  uploadDate: string; // ISO date
  testDate: string; // ISO date
  labClinic: string;
  category: 'Blood Panel' | 'Hormone Profile' | 'Cardiometabolic' | 'DNA & Genetics' | 'Urinalysis' | 'General Lab';
  notes?: string;
  extractedBiomarkersCount: number;
  fileDataUrl?: string; // For client preview & download
  tags: string[];
}

export interface DailyBioLog {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD
  sleepHours: number;
  sleepQuality: number; // 1 to 5
  hydrationOz: number;
  restingHeartRate?: number;
  stressLevel: number; // 1 to 5 (1 lowest stress, 5 high)
  steps: number;
  energyLevel: number; // 1 to 5
  fastingHours?: number;
  notes?: string;
  createdAt: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  age?: number;
  biologicalSex?: 'male' | 'female' | 'other';
  bloodType?: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-' | 'Unknown';
  weightLbs?: number;
  heightInches?: number;
  primaryHealthGoal?: 'Metabolic Longevity' | 'Hormonal Balance' | 'Cardiovascular Health' | 'Energy & Vitality' | 'Athletic Performance' | 'Inflammation Reduction';
  unitSystem: 'standard' | 'metric';
  bioBalanceScore: number;
  createdAt: string;
  lastUpdated: string;
}

export interface BioBalanceInsight {
  id: string;
  type: 'success' | 'warning' | 'alert' | 'recommendation';
  category: BiomarkerCategory | 'lifestyle';
  title: string;
  message: string;
  actionProtocol: string;
  relatedBiomarkers?: string[];
  priority: 'high' | 'medium' | 'low';
}

export interface SystemScoreBreakdown {
  metabolic: number;
  lipids: number;
  hormones: number;
  vitamins: number;
  inflammation: number;
  cardio: number;
  lifestyle: number;
  overall: number;
}
