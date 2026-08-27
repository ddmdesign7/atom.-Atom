import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  signInWithPopup, 
  GoogleAuthProvider,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile,
  User
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  deleteDoc, 
  updateDoc 
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { BiomarkerReading, LabDocument, DailyBioLog, UserProfile } from '../types';
import { calculateBiomarkerStatus } from '../data/biomarkerCatalog';

// Initialize Firebase App instance safely
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);

// Initialize Firestore (pass custom firestoreDatabaseId if configured)
export const db = firebaseConfig.firestoreDatabaseId 
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

const googleProvider = new GoogleAuthProvider();

// Local Storage Fallback Keys for resilient demo/offline support
const STORAGE_PREFIX = 'bio_balance_';

// Helper to get local data
function getLocal<T>(key: string, defaultVal: T): T {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + key);
    return raw ? JSON.parse(raw) : defaultVal;
  } catch (e) {
    return defaultVal;
  }
}

// Helper to save local data
function setLocal<T>(key: string, value: T): void {
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
  } catch (e) {
    console.warn('Storage quota or error', e);
  }
}

// Demo Initial Sample Biomarkers Generator
export function getInitialDemoBiomarkers(userId: string): BiomarkerReading[] {
  const now = new Date();
  const dateStr = (daysAgo: number) => {
    const d = new Date(now);
    d.setDate(d.getDate() - daysAgo);
    return d.toISOString();
  };

  const seed: Array<Omit<BiomarkerReading, 'id' | 'userId' | 'status'>> = [
    { biomarkerId: 'fasting_glucose', biomarkerName: 'Fasting Glucose', category: 'metabolic', value: 84, unit: 'mg/dL', timestamp: dateStr(3), labName: 'Quest Diagnostics' },
    { biomarkerId: 'hba1c', biomarkerName: 'Hemoglobin A1c', category: 'metabolic', value: 5.2, unit: '%', timestamp: dateStr(3), labName: 'Quest Diagnostics' },
    { biomarkerId: 'fasting_insulin', biomarkerName: 'Fasting Insulin', category: 'metabolic', value: 4.8, unit: 'µIU/mL', timestamp: dateStr(3), labName: 'Quest Diagnostics' },
    { biomarkerId: 'total_cholesterol', biomarkerName: 'Total Cholesterol', category: 'lipids', value: 178, unit: 'mg/dL', timestamp: dateStr(3), labName: 'Quest Diagnostics' },
    { biomarkerId: 'ldl_c', biomarkerName: 'LDL Cholesterol', category: 'lipids', value: 88, unit: 'mg/dL', timestamp: dateStr(3), labName: 'Quest Diagnostics' },
    { biomarkerId: 'hdl_c', biomarkerName: 'HDL Cholesterol', category: 'lipids', value: 68, unit: 'mg/dL', timestamp: dateStr(3), labName: 'Quest Diagnostics' },
    { biomarkerId: 'triglycerides', biomarkerName: 'Triglycerides', category: 'lipids', value: 62, unit: 'mg/dL', timestamp: dateStr(3), labName: 'Quest Diagnostics' },
    { biomarkerId: 'apob', biomarkerName: 'Apolipoprotein B (ApoB)', category: 'lipids', value: 65, unit: 'mg/dL', timestamp: dateStr(3), labName: 'Quest Diagnostics' },
    { biomarkerId: 'vitamin_d', biomarkerName: 'Vitamin D (25-Hydroxy)', category: 'vitamins', value: 58, unit: 'ng/mL', timestamp: dateStr(3), labName: 'Quest Diagnostics' },
    { biomarkerId: 'vitamin_b12', biomarkerName: 'Vitamin B12', category: 'vitamins', value: 720, unit: 'pg/mL', timestamp: dateStr(3), labName: 'Quest Diagnostics' },
    { biomarkerId: 'ferritin', biomarkerName: 'Serum Ferritin', category: 'vitamins', value: 110, unit: 'ng/mL', timestamp: dateStr(3), labName: 'Quest Diagnostics' },
    { biomarkerId: 'magnesium_rbc', biomarkerName: 'Magnesium (RBC)', category: 'vitamins', value: 5.9, unit: 'mg/dL', timestamp: dateStr(3), labName: 'Quest Diagnostics' },
    { biomarkerId: 'hs_crp', biomarkerName: 'hs-CRP', category: 'inflammation', value: 0.4, unit: 'mg/L', timestamp: dateStr(3), labName: 'Quest Diagnostics' },
    { biomarkerId: 'homocysteine', biomarkerName: 'Homocysteine', category: 'inflammation', value: 7.2, unit: 'µmol/L', timestamp: dateStr(3), labName: 'Quest Diagnostics' },
    { biomarkerId: 'cortisol_am', biomarkerName: 'Cortisol (AM)', category: 'hormones', value: 15.4, unit: 'µg/dL', timestamp: dateStr(3), labName: 'Quest Diagnostics' },
    { biomarkerId: 'tsh', biomarkerName: 'TSH', category: 'hormones', value: 1.65, unit: 'µIU/mL', timestamp: dateStr(3), labName: 'Quest Diagnostics' },
    { biomarkerId: 'free_t3', biomarkerName: 'Free T3', category: 'hormones', value: 3.4, unit: 'pg/mL', timestamp: dateStr(3), labName: 'Quest Diagnostics' },
    { biomarkerId: 'total_testosterone', biomarkerName: 'Total Testosterone', category: 'hormones', value: 740, unit: 'ng/dL', timestamp: dateStr(3), labName: 'Quest Diagnostics' },
    { biomarkerId: 'resting_hr', biomarkerName: 'Resting Heart Rate', category: 'cardio', value: 54, unit: 'bpm', timestamp: dateStr(1), labName: 'Wearable Sync' },
    { biomarkerId: 'systolic_bp', biomarkerName: 'Systolic Blood Pressure', category: 'cardio', value: 114, unit: 'mmHg', timestamp: dateStr(1), labName: 'Omron Monitor' },
    { biomarkerId: 'diastolic_bp', biomarkerName: 'Diastolic Blood Pressure', category: 'cardio', value: 72, unit: 'mmHg', timestamp: dateStr(1), labName: 'Omron Monitor' },
    { biomarkerId: 'hrv', biomarkerName: 'Heart Rate Variability', category: 'cardio', value: 78, unit: 'ms', timestamp: dateStr(1), labName: 'Wearable Sync' },
    { biomarkerId: 'alt', biomarkerName: 'ALT (Liver)', category: 'organ_function', value: 18, unit: 'U/L', timestamp: dateStr(3), labName: 'Quest Diagnostics' },
    { biomarkerId: 'egfr', biomarkerName: 'eGFR (Kidney)', category: 'organ_function', value: 112, unit: 'mL/min/1.73m²', timestamp: dateStr(3), labName: 'Quest Diagnostics' }
  ];

  return seed.map((item, idx) => ({
    ...item,
    id: `seed-bio-${idx}-${Date.now()}`,
    userId,
    status: calculateBiomarkerStatus(item.biomarkerId, item.value)
  }));
}

// Initial Sample Lab Documents Generator
export function getInitialDemoLabDocs(userId: string): LabDocument[] {
  const now = new Date();
  return [
    {
      id: `seed-doc-1-${userId}`,
      userId,
      fileName: 'Comprehensive_Metabolic_Lipid_Panel_Q3.pdf',
      originalName: 'Comprehensive_Metabolic_Lipid_Panel_Q3.pdf',
      fileSize: 482910,
      fileType: 'application/pdf',
      uploadDate: new Date(now.getTime() - 3 * 86400000).toISOString(),
      testDate: new Date(now.getTime() - 4 * 86400000).toISOString().split('T')[0],
      labClinic: 'Quest Diagnostics - Precision Longevity Lab',
      category: 'Blood Panel',
      notes: 'Fasting blood draw at 07:45 AM. 12-hour fast observed. All critical biomarkers within optimal ranges.',
      extractedBiomarkersCount: 16,
      tags: ['Annual Checkup', 'Fasting', 'Full Panel']
    },
    {
      id: `seed-doc-2-${userId}`,
      userId,
      fileName: 'Thyroid_and_Hormonal_Assessment.pdf',
      originalName: 'Thyroid_and_Hormonal_Assessment.pdf',
      fileSize: 312450,
      fileType: 'application/pdf',
      uploadDate: new Date(now.getTime() - 28 * 86400000).toISOString(),
      testDate: new Date(now.getTime() - 30 * 86400000).toISOString().split('T')[0],
      labClinic: 'LabCorp Clinical Services',
      category: 'Hormone Profile',
      notes: 'Full endocrine workup including AM Cortisol, Free T3, TSH, and Total Testosterone.',
      extractedBiomarkersCount: 6,
      tags: ['Hormones', 'Endocrine']
    }
  ];
}

// Initial Sample Daily Logs Generator
export function getInitialDemoDailyLogs(userId: string): DailyBioLog[] {
  const logs: DailyBioLog[] = [];
  const now = new Date();

  for (let i = 0; i < 7; i++) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];

    logs.push({
      id: `seed-log-${i}-${userId}`,
      userId,
      date: dateStr,
      sleepHours: Number((7.2 + (Math.sin(i) * 0.8)).toFixed(1)),
      sleepQuality: Math.min(5, Math.max(3, Math.round(4 + Math.sin(i)))),
      hydrationOz: Math.round(85 + Math.cos(i) * 15),
      restingHeartRate: Math.round(54 + Math.sin(i * 2) * 3),
      stressLevel: Math.min(5, Math.max(1, Math.round(2 + Math.cos(i)))),
      steps: Math.round(9200 + Math.sin(i) * 2400),
      energyLevel: Math.min(5, Math.max(3, Math.round(4.2 + Math.sin(i * 1.5)))),
      fastingHours: 14 + (i % 2 === 0 ? 2 : 0),
      notes: i === 0 ? 'Felt energized after Zone 2 morning cardio and cold plunge.' : undefined,
      createdAt: d.toISOString()
    });
  }

  return logs;
}

// --- AUTH FUNCTIONS ---

export async function loginWithEmail(email: string, pass: string) {
  return signInWithEmailAndPassword(auth, email, pass);
}

export async function signupWithEmail(email: string, pass: string, name: string) {
  const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
  if (userCredential.user) {
    await updateProfile(userCredential.user, { displayName: name });
  }
  return userCredential;
}

export async function loginWithGoogle() {
  return signInWithPopup(auth, googleProvider);
}

export async function logoutUser() {
  return signOut(auth);
}

export async function resetPassword(email: string) {
  return sendPasswordResetEmail(auth, email);
}

// --- USER PROFILE FIRESTORE FUNCTIONS ---

export async function saveUserProfile(profile: UserProfile): Promise<void> {
  try {
    const userRef = doc(db, 'users', profile.uid);
    await setDoc(userRef, profile, { merge: true });
  } catch (err) {
    console.warn('Firestore profile save warning (fallback to local):', err);
  }
  // Keep local backup in sync
  setLocal(`profile_${profile.uid}`, profile);
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  try {
    const userRef = doc(db, 'users', uid);
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      return snap.data() as UserProfile;
    }
  } catch (err) {
    console.warn('Firestore profile fetch fallback:', err);
  }
  return getLocal<UserProfile | null>(`profile_${uid}`, null);
}

// --- BIOMARKER READINGS FIRESTORE FUNCTIONS ---

export async function getBiomarkerReadings(userId: string): Promise<BiomarkerReading[]> {
  try {
    const colRef = collection(db, 'users', userId, 'biomarkers');
    const snap = await getDocs(colRef);
    if (!snap.empty) {
      const items: BiomarkerReading[] = [];
      snap.forEach(docSnap => {
        items.push({ id: docSnap.id, ...(docSnap.data() as Omit<BiomarkerReading, 'id'>) });
      });
      // Sort newest first
      items.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      setLocal(`biomarkers_${userId}`, items);
      return items;
    }
  } catch (err) {
    console.warn('Firestore biomarkers fetch fallback:', err);
  }

  // Local fallback
  const local = getLocal<BiomarkerReading[]>(`biomarkers_${userId}`, []);
  if (local.length > 0) return local;

  // Generate initial seed if totally empty
  const initial = getInitialDemoBiomarkers(userId);
  setLocal(`biomarkers_${userId}`, initial);
  return initial;
}

export async function addBiomarkerReading(reading: Omit<BiomarkerReading, 'id'>): Promise<BiomarkerReading> {
  const status = calculateBiomarkerStatus(reading.biomarkerId, reading.value);
  const fullReading: BiomarkerReading = {
    ...reading,
    id: `bio_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    status
  };

  try {
    const colRef = collection(db, 'users', reading.userId, 'biomarkers');
    const docRef = await addDoc(colRef, {
      ...reading,
      status
    });
    fullReading.id = docRef.id;
  } catch (err) {
    console.warn('Firestore add biomarker fallback:', err);
  }

  // Update local list
  const list = getLocal<BiomarkerReading[]>(`biomarkers_${reading.userId}`, []);
  list.unshift(fullReading);
  setLocal(`biomarkers_${reading.userId}`, list);

  return fullReading;
}

export async function deleteBiomarkerReading(userId: string, readingId: string): Promise<void> {
  try {
    const docRef = doc(db, 'users', userId, 'biomarkers', readingId);
    await deleteDoc(docRef);
  } catch (err) {
    console.warn('Firestore delete biomarker fallback:', err);
  }

  const list = getLocal<BiomarkerReading[]>(`biomarkers_${userId}`, []);
  const filtered = list.filter(item => item.id !== readingId);
  setLocal(`biomarkers_${userId}`, filtered);
}

// --- LAB DOCUMENTS FIRESTORE FUNCTIONS ---

export async function getLabDocuments(userId: string): Promise<LabDocument[]> {
  try {
    const colRef = collection(db, 'users', userId, 'lab_documents');
    const snap = await getDocs(colRef);
    if (!snap.empty) {
      const items: LabDocument[] = [];
      snap.forEach(docSnap => {
        items.push({ id: docSnap.id, ...(docSnap.data() as Omit<LabDocument, 'id'>) });
      });
      items.sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime());
      setLocal(`lab_docs_${userId}`, items);
      return items;
    }
  } catch (err) {
    console.warn('Firestore lab documents fetch fallback:', err);
  }

  const local = getLocal<LabDocument[]>(`lab_docs_${userId}`, []);
  if (local.length > 0) return local;

  const initial = getInitialDemoLabDocs(userId);
  setLocal(`lab_docs_${userId}`, initial);
  return initial;
}

export async function saveLabDocument(docData: Omit<LabDocument, 'id'>): Promise<LabDocument> {
  const fullDoc: LabDocument = {
    ...docData,
    id: `doc_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`
  };

  try {
    const colRef = collection(db, 'users', docData.userId, 'lab_documents');
    // Save metadata to Firestore (strip heavy fileDataUrl if large to avoid Firestore document limits)
    const { fileDataUrl, ...firestoreData } = fullDoc;
    const docRef = await addDoc(colRef, firestoreData);
    fullDoc.id = docRef.id;
  } catch (err) {
    console.warn('Firestore save lab document fallback:', err);
  }

  // Save complete document with preview Data URL in local storage
  const list = getLocal<LabDocument[]>(`lab_docs_${docData.userId}`, []);
  list.unshift(fullDoc);
  setLocal(`lab_docs_${docData.userId}`, list);

  return fullDoc;
}

export async function deleteLabDocument(userId: string, documentId: string): Promise<void> {
  try {
    const docRef = doc(db, 'users', userId, 'lab_documents', documentId);
    await deleteDoc(docRef);
  } catch (err) {
    console.warn('Firestore delete lab document fallback:', err);
  }

  const list = getLocal<LabDocument[]>(`lab_docs_${userId}`, []);
  const filtered = list.filter(d => d.id !== documentId);
  setLocal(`lab_docs_${userId}`, filtered);
}

// --- DAILY BIO LOGS FIRESTORE FUNCTIONS ---

export async function getDailyBioLogs(userId: string): Promise<DailyBioLog[]> {
  try {
    const colRef = collection(db, 'users', userId, 'daily_logs');
    const snap = await getDocs(colRef);
    if (!snap.empty) {
      const items: DailyBioLog[] = [];
      snap.forEach(docSnap => {
        items.push({ id: docSnap.id, ...(docSnap.data() as Omit<DailyBioLog, 'id'>) });
      });
      items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setLocal(`daily_logs_${userId}`, items);
      return items;
    }
  } catch (err) {
    console.warn('Firestore daily logs fetch fallback:', err);
  }

  const local = getLocal<DailyBioLog[]>(`daily_logs_${userId}`, []);
  if (local.length > 0) return local;

  const initial = getInitialDemoDailyLogs(userId);
  setLocal(`daily_logs_${userId}`, initial);
  return initial;
}

export async function saveDailyBioLog(log: Omit<DailyBioLog, 'id'>): Promise<DailyBioLog> {
  const fullLog: DailyBioLog = {
    ...log,
    id: `log_${log.date}_${log.userId}`
  };

  try {
    const colRef = collection(db, 'users', log.userId, 'daily_logs');
    await setDoc(doc(colRef, fullLog.id), fullLog, { merge: true });
  } catch (err) {
    console.warn('Firestore save daily log fallback:', err);
  }

  const list = getLocal<DailyBioLog[]>(`daily_logs_${log.userId}`, []);
  const existingIdx = list.findIndex(l => l.date === log.date);
  if (existingIdx >= 0) {
    list[existingIdx] = fullLog;
  } else {
    list.unshift(fullLog);
  }
  list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  setLocal(`daily_logs_${log.userId}`, list);

  return fullLog;
}
