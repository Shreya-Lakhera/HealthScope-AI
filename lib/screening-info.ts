export type ScreeningInfo = {
  id: "heart" | "liver" | "kidney" | "stroke";
  name: string;
  shortName: string;
  accent: string;
  overview: string;
  symptoms: string[];
  urgent?: string;
  model: {
    algorithm: string;
    summary: string;
    preprocessing: string[];
    parameters: { name: string; meaning: string }[];
  };
  source: { label: string; url: string };
};

export const screeningInfo: ScreeningInfo[] = [
  {
    id: "heart",
    name: "Heart disease",
    shortName: "Heart",
    accent: "#ef476f",
    overview: "Heart disease describes several conditions affecting the heart. Coronary artery disease is a common form and can reduce blood flow to the heart muscle. Symptoms and urgency vary by condition.",
    symptoms: ["Chest pain, pressure, or discomfort", "Shortness of breath", "Pain in the neck, jaw, throat, upper abdomen, or back", "Unusual tiredness, nausea, or light-headedness"],
    urgent: "Call emergency services for new or severe chest pressure, trouble breathing, fainting, or other possible heart-attack symptoms.",
    model: {
      algorithm: "Logistic regression",
      summary: "A class-balanced linear classifier that estimates the probability of the positive heart-disease class.",
      preprocessing: ["Median imputation for missing numeric values", "Standard scaling for continuous measurements", "Most-frequent imputation and one-hot encoding for coded categories"],
      parameters: [
        { name: "age", meaning: "Age" }, { name: "sex", meaning: "Sex code" }, { name: "cp", meaning: "Chest-pain type" }, { name: "trestbps", meaning: "Resting blood pressure" }, { name: "chol", meaning: "Serum cholesterol" }, { name: "fbs", meaning: "Fasting blood sugar over 120 mg/dL" }, { name: "restecg", meaning: "Resting ECG result" }, { name: "thalach", meaning: "Maximum heart rate" }, { name: "exang", meaning: "Exercise-induced angina" }, { name: "oldpeak", meaning: "Exercise-induced ST depression" }, { name: "slope", meaning: "Peak ST-segment slope" }, { name: "ca", meaning: "Major vessels seen by fluoroscopy" }, { name: "thal", meaning: "Thallium stress-test category" },
      ],
    },
    source: { label: "CDC: About Heart Disease", url: "https://www.cdc.gov/heart-disease/about/index.html" },
  },
  {
    id: "liver",
    name: "Liver disease",
    shortName: "Liver",
    accent: "#7c6ee6",
    overview: "Liver disease is an umbrella term for conditions that damage the liver or affect how it works. Causes include infections, inherited conditions, immune disorders, alcohol, and metabolic disease.",
    symptoms: ["Fatigue or weakness", "Nausea or loss of appetite", "Pain or swelling in the abdomen", "Yellow skin or eyes, dark urine, pale stool, or itching"],
    model: {
      algorithm: "Extra Trees classifier",
      summary: "An ensemble of 400 randomized decision trees trained with balanced class weights.",
      preprocessing: ["Median imputation for missing laboratory values", "No separate scaling is required by the tree-based model", "The website uses the same nine-feature order as training"],
      parameters: [
        { name: "Age", meaning: "Age" }, { name: "Total_Bilirubin", meaning: "Total bilirubin" }, { name: "Direct_Bilirubin", meaning: "Direct bilirubin" }, { name: "Alkaline_Phosphotase", meaning: "Alkaline phosphatase" }, { name: "Alamine_Aminotransferase", meaning: "Alanine aminotransferase (ALT)" }, { name: "Aspartate_Aminotransferase", meaning: "Aspartate aminotransferase (AST)" }, { name: "Total_Protiens", meaning: "Total proteins" }, { name: "Albumin", meaning: "Albumin" }, { name: "Albumin_and_Globulin_Ratio", meaning: "Albumin-to-globulin ratio" },
      ],
    },
    source: { label: "MedlinePlus: Liver Diseases", url: "https://medlineplus.gov/liverdiseases.html" },
  },
  {
    id: "kidney",
    name: "Chronic kidney disease",
    shortName: "Kidney",
    accent: "#13a8a8",
    overview: "Chronic kidney disease means the kidneys are damaged or cannot filter blood as well as they should. It often develops gradually and may have no symptoms until it is advanced.",
    symptoms: ["Swelling in the feet, ankles, hands, or face", "Tiredness, weakness, or trouble sleeping", "Nausea, vomiting, or reduced appetite", "Changes in urination, itching, or muscle cramps"],
    model: {
      algorithm: "Random forest classifier",
      summary: "An ensemble of 500 class-balanced decision trees, with leaves constrained to at least two training examples.",
      preprocessing: ["Median imputation for numeric measurements", "Most-frequent imputation for categories", "One-hot encoding with safe handling of unseen categories"],
      parameters: [
        { name: "age", meaning: "Age" }, { name: "bp", meaning: "Blood pressure" }, { name: "sg", meaning: "Urine specific gravity" }, { name: "al", meaning: "Urine albumin" }, { name: "su", meaning: "Urine sugar" }, { name: "bgr", meaning: "Random blood glucose" }, { name: "bu", meaning: "Blood urea" }, { name: "sc", meaning: "Serum creatinine" }, { name: "sod", meaning: "Sodium" }, { name: "pot", meaning: "Potassium" }, { name: "hemo", meaning: "Hemoglobin" }, { name: "pcv", meaning: "Packed cell volume" }, { name: "wc", meaning: "White blood-cell count" }, { name: "rc", meaning: "Red blood-cell count" }, { name: "rbc", meaning: "Urine red-blood-cell appearance" }, { name: "pc", meaning: "Pus cells" }, { name: "pcc", meaning: "Pus-cell clumps" }, { name: "ba", meaning: "Bacteria" }, { name: "htn", meaning: "Hypertension" }, { name: "dm", meaning: "Diabetes mellitus" }, { name: "cad", meaning: "Coronary artery disease" }, { name: "appet", meaning: "Appetite" }, { name: "pe", meaning: "Pedal edema" }, { name: "ane", meaning: "Anemia" },
      ],
    },
    source: { label: "NIDDK: CKD Symptoms & Causes", url: "https://www.niddk.nih.gov/health-information/kidney-disease/chronic-kidney-disease-ckd/symptoms-causes" },
  },
  {
    id: "stroke",
    name: "Stroke",
    shortName: "Stroke",
    accent: "#f59e55",
    overview: "A stroke occurs when blood flow to part of the brain is blocked or when a blood vessel in the brain bursts. It is a medical emergency, and rapid treatment can reduce brain damage.",
    symptoms: ["Sudden numbness or weakness, especially on one side", "Sudden confusion or trouble speaking", "Sudden vision or walking problems", "Sudden severe headache with no known cause"],
    urgent: "If any stroke sign appears, call emergency services immediately. Do not wait for this model or drive yourself to the hospital.",
    model: {
      algorithm: "Logistic regression",
      summary: "A class-balanced linear classifier designed to account for the dataset’s relatively rare positive stroke examples.",
      preprocessing: ["Median imputation and standard scaling for age, glucose, and BMI", "Most-frequent imputation for binary and categorical values", "One-hot encoding with safe handling of unseen categories"],
      parameters: [
        { name: "gender", meaning: "Gender category" }, { name: "age", meaning: "Age" }, { name: "hypertension", meaning: "Hypertension history" }, { name: "heart_disease", meaning: "Heart-disease history" }, { name: "ever_married", meaning: "Marital-history category" }, { name: "work_type", meaning: "Work category" }, { name: "Residence_type", meaning: "Urban or rural residence" }, { name: "avg_glucose_level", meaning: "Average glucose level" }, { name: "bmi", meaning: "Body mass index" }, { name: "smoking_status", meaning: "Smoking-history category" },
      ],
    },
    source: { label: "CDC: Signs and Symptoms of Stroke", url: "https://www.cdc.gov/stroke/signs-symptoms/index.html" },
  },
];

export function getScreeningInfo(id: string) {
  return screeningInfo.find((screening) => screening.id === id);
}

export type ParameterGuidance = { reference: string; enter: string };

// General educational references only. Clinical laboratories may use different
// ranges, units, and interpretation rules, so the user's own report takes priority.
export const parameterGuidance: Record<string, Record<string, ParameterGuidance>> = {
  heart: {
    sex: { reference: "No healthy category", enter: "Select the code used on the clinical record." },
    cp: { reference: "No healthy range; this describes a symptom pattern", enter: "Choose the chest-pain category assigned by a clinician." },
    trestbps: { reference: "A normal adult systolic pressure is generally below 120 mm Hg", enter: "Enter the resting systolic (top) blood-pressure number." },
    chol: { reference: "Desirable adult total cholesterol is generally below 200 mg/dL", enter: "Enter total cholesterol from the lipid panel." },
    fbs: { reference: "0 means fasting glucose was not above 120 mg/dL", enter: "Choose Yes only when the fasting result exceeded 120 mg/dL." },
    restecg: { reference: "0 represents the model's normal ECG category", enter: "Use the category stated on the ECG report." },
    thalach: { reference: "No single healthy value; it depends strongly on age and test effort", enter: "Enter the maximum heart rate recorded during the exercise test." },
    exang: { reference: "No exercise-induced angina is the lower-risk category", enter: "Choose what was observed during exercise testing." },
    oldpeak: { reference: "0 means no measured ST depression", enter: "Copy the ST-depression value from the exercise ECG report." },
    slope: { reference: "No universal healthy code", enter: "Use the peak ST-slope category from the exercise ECG report." },
    ca: { reference: "0 means no major vessels were colored by fluoroscopy", enter: "Copy the vessel count from the imaging report." },
    thal: { reference: "1 is the model's normal category", enter: "Use the thallium stress-test category from the report." },
  },
  liver: {
    Total_Bilirubin: { reference: "Often about 0.1–1.2 mg/dL", enter: "Copy total bilirubin from the liver panel." },
    Direct_Bilirubin: { reference: "Often below about 0.3 mg/dL", enter: "Copy direct (conjugated) bilirubin from the report." },
    Alkaline_Phosphotase: { reference: "Often about 44–147 IU/L in adults", enter: "Copy the ALP result and confirm the unit is IU/L." },
    Alamine_Aminotransferase: { reference: "Often about 7–56 IU/L", enter: "Copy the ALT result from the liver panel." },
    Aspartate_Aminotransferase: { reference: "Often about 10–40 IU/L", enter: "Copy the AST result from the liver panel." },
    Total_Protiens: { reference: "Often about 6.0–8.3 g/dL", enter: "Copy total protein from the report." },
    Albumin: { reference: "Often about 3.4–5.4 g/dL", enter: "Copy serum albumin from the report." },
    Albumin_and_Globulin_Ratio: { reference: "Often about 1.1–2.5", enter: "Copy the A/G ratio, or use the ratio calculated by the laboratory." },
  },
  kidney: {
    bp: { reference: "Normal adult blood pressure is generally below 120/80 mm Hg", enter: "Enter the diastolic (bottom) number used by this dataset." },
    sg: { reference: "Often about 1.005–1.030", enter: "Copy urine specific gravity from urinalysis." },
    al: { reference: "0 is the model's normal/absent category", enter: "Enter the urine albumin category shown on urinalysis." },
    su: { reference: "0 is the model's normal/absent category", enter: "Enter the urine sugar category shown on urinalysis." },
    bgr: { reference: "No single reference without knowing meal timing", enter: "Copy the random blood-glucose result in mg/dL." },
    bu: { reference: "Ranges depend on whether the report states urea or BUN", enter: "Copy the blood-urea value only after matching the report's unit." },
    sc: { reference: "Often about 0.6–1.3 mg/dL in adults", enter: "Copy serum creatinine from the kidney panel." },
    sod: { reference: "Often about 135–145 mEq/L", enter: "Copy serum sodium from the report." },
    pot: { reference: "Often about 3.5–5.0 mEq/L", enter: "Copy serum potassium from the report." },
    hemo: { reference: "Common adult ranges are roughly 12–17 g/dL and vary by sex and lab", enter: "Copy hemoglobin from the complete blood count." },
    pcv: { reference: "Common adult ranges are roughly 36–50% and vary by sex and lab", enter: "Copy packed cell volume or hematocrit from the report." },
    wc: { reference: "Often about 4,500–11,000 cells/cmm", enter: "Copy the total white blood-cell count." },
    rc: { reference: "Common adult ranges are roughly 4.2–6.1 million/cmm", enter: "Copy the red blood-cell count from the report." },
    rbc: { reference: "Normal", enter: "Choose the urine RBC appearance stated on microscopy." },
    pc: { reference: "Normal", enter: "Choose the pus-cell appearance stated on urinalysis." },
    pcc: { reference: "Not present", enter: "Choose whether pus-cell clumps were reported." },
    ba: { reference: "Not present", enter: "Choose whether bacteria were reported." },
    htn: { reference: "No", enter: "Choose Yes only for a diagnosed history of hypertension." },
    dm: { reference: "No", enter: "Choose Yes only for a diagnosed history of diabetes." },
    cad: { reference: "No", enter: "Choose Yes only for a diagnosed history of coronary artery disease." },
    appet: { reference: "Good", enter: "Choose the option that describes the person's current appetite." },
    pe: { reference: "No", enter: "Choose Yes only when pedal edema is present or documented." },
    ane: { reference: "No", enter: "Choose Yes only when anemia is diagnosed or documented." },
  },
  stroke: {
    hypertension: { reference: "No", enter: "Choose Yes only for a diagnosed history of hypertension." },
    heart_disease: { reference: "No", enter: "Choose Yes only for a diagnosed history of heart disease." },
    ever_married: { reference: "No healthy category", enter: "Select the person's actual marital-history category." },
    work_type: { reference: "No healthy category", enter: "Select the person's current work category." },
    Residence_type: { reference: "No healthy category", enter: "Select the person's current residence type." },
    avg_glucose_level: { reference: "Interpretation depends on whether the test was fasting, random, or averaged", enter: "Copy the average glucose value in mg/dL from the record." },
    bmi: { reference: "A general adult reference category is 18.5–24.9 kg/m²", enter: "Enter the measured or clinically calculated BMI." },
    smoking_status: { reference: "Never smoked is the unexposed category", enter: "Select the person's actual smoking history; do not choose an ideal answer." },
  },
};
