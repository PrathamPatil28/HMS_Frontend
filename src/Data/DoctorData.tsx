
export const specializationOptions = [
  "Cardiology",
  "Neurology",
  "Dermatology",
  "Pediatrics",
  "Orthopedics",
  "Oncology",
  "Radiology",
  "General Medicine",
];


export const departments = [
  "Cardiology",
  "Dermatology",
  "Endocrinology",
  "Gastroenterology",
  "General Surgery",
  "Gynecology",
  "Neurology",
  "Nephrology",
  "Oncology",
  "Ophthalmology",
  "Orthopedics",
  "Pediatrics",
  "Psychiatry",
  "Pulmonology",
  "Radiology",
  "Urology"
];

export const symptoms = [
  "Fever",
  "Cough",
  "Headache",
  "Fatigue",
  "Sore throat",
  "Body pain",
  "Loss of appetite",
  "Cold or congestion",
  "Nausea",
  "Shortness of breath"
];
export const dosageFrequencies = [
  { value: "1-0-1", label: "1-0-1 (Morning: 1, Noon: 0, Night: 1)" },
  { value: "1-1-1", label: "1-1-1 (Morning: 1, Noon: 1, Night: 1)" },
  { value: "0-1-0", label: "0-1-0 (Morning: 0, Noon: 1, Night: 0)" },
  { value: "1-0-0", label: "1-0-0 (Morning: 1, Noon: 0, Night: 0)" },
  { value: "0-0-1", label: "0-0-1 (Morning: 0, Noon: 0, Night: 1)" },
  { value: "1-1-0", label: "1-1-0 (Morning: 1, Noon: 1, Night: 0)" },
  { value: "0-1-1", label: "0-1-1 (Morning: 0, Noon: 1, Night: 1)" },
  { value: "0-0-0", label: "0-0-0 (Morning: 0, Noon: 0, Night: 0)" },
  {value : "1-0-0.5", label: "1-0-0.5 (Morning: 1, Noon: 0, Night half: 0.5)"},
  { value: "1-0-1-alt", label: "Alternate day (1-0-1 pattern)" } // ✅ unique

];


export const frequenciesMap : Record<string, number>={
   "1-0-0":1,
   "0-1-0":1,
   "0-0-1":1,
   "1-1-0":2,
   "1-0-1":2,
   "0-1-1":2,
   "1-1-1":3,
   "1-0-0.5":1.5,
   "1-0-0 (Sos)":0.5,
   "1-0-1 (alternate day)":1
}




export const tests = [
  "Blood Test",
  "Urine Test",
  "X-Ray",
  "MRI Scan",
  "CT Scan",
  "ECG",
  "Liver Function Test (LFT)",
  "Kidney Function Test (KFT)",
  "Thyroid Test",
  "COVID-19 Test",
  "Blood Sugar (Glucose) Test",
  "Cholesterol Test",
  "Hemoglobin (Hb) Test",
  "Vitamin D Test",
  "Allergy Test",
  "Pregnancy Test",
  "HIV Test",
  "Eye Examination",
  "Ultrasound",
  "Bone Density Test",
    "CBC",
    "Malaria Test"
];

export const medicineRoutes = [
  "Oral",         // tablets, capsules, syrup
  "Intravenous",  // IV injection
  "Intramuscular",// IM injection
  "Subcutaneous", // SC injection
  "Topical",      // creams, ointments, gels
  "Inhalation",   // inhalers, nebulizers
  "Sublingual",   // under the tongue
  "Rectal",       // suppositories
  "Buccal",       // between gum and cheek
  "Nasal"         // nasal sprays
];

export const medicineTypes = [
  "Tablet",
  "Capsule",
  "Syrup",
  "Suspension",
  "Injection",
  "Cream",
  "Ointment",
  "Gel",
  "Drops",
  "Inhaler",
  "Suppository",
  "Patch"
];

export const chronicDiseases = [
  "Hypertension",
  "Diabetes",
  "Asthma",
  "Cancer",
  "Arthritis",
  "Chronic Obstructive Pulmonary Disease (COPD)",
  "Heart Disease",
  "Kidney Disease"
];

 export const appointmentReasons = [
  "General Checkup",
  "Follow-up Visit",
  "Fever or Infection",
  "Cold and Cough",
  "Headache or Migraine",
  "Stomach Pain",
  "Back Pain",
  "Joint Pain",
  "Skin Rash or Allergy",
  "Blood Pressure Check",
  "Diabetes Management",
  "Thyroid Consultation",
  "Routine Blood Test",
  "Prescription Refill",
  "Physical Examination",
  "Vaccination",
  "Eye Irritation",
  "Ear Pain or Infection",
  "Throat Infection",
  "Menstrual Problems",
  "Pregnancy Consultation",
  "Chest Pain",
  "Breathing Issues",
  "Sleep Disorders",
  "Mental Health Counseling",
  "Depression or Anxiety",
  "Hair Fall or Scalp Issues",
  "Weight Management",
  "Nutritional Advice",
  "Second Medical Opinion"
];





