export type ServiceCategory = string;
export type ServiceSeed = { id:string; name:string; category:ServiceCategory; description:string; price:string; duration:string; active:boolean; consultationRequired?:boolean; assessmentNote?:string };
export type ServiceCategoryRecord = { id:string; name:string; active:boolean; order:number };
export const trippleSCategorySeed: ServiceCategoryRecord[] = [
  {
    "id": "facials-skin-treatments",
    "name": "Facials & Skin Treatments",
    "active": true,
    "order": 1
  },
  {
    "id": "advanced-skin-rejuvenation-pigmentation",
    "name": "Advanced Skin Rejuvenation & Pigmentation",
    "active": true,
    "order": 2
  },
  {
    "id": "acne-treatments",
    "name": "Acne Treatments",
    "active": true,
    "order": 3
  },
  {
    "id": "body-contouring-weight-management",
    "name": "Body Contouring & Weight Management",
    "active": true,
    "order": 4
  },
  {
    "id": "hair-restoration",
    "name": "Hair Restoration",
    "active": true,
    "order": 5
  },
  {
    "id": "wellness-treatments",
    "name": "Wellness Treatments",
    "active": true,
    "order": 6
  },
  {
    "id": "advanced-medical-aesthetics",
    "name": "Advanced Medical Aesthetics",
    "active": true,
    "order": 7
  },
  {
    "id": "other-beauty-treatments",
    "name": "Other Beauty Treatments",
    "active": true,
    "order": 8
  }
];
export const trippleSServiceSeed: ServiceSeed[] = [
  {
    "id": "deep-cleansing-facial",
    "name": "Deep Cleansing Facial",
    "category": "Facials & Skin Treatments",
    "description": "A professional facial treatment. Details and suitability are confirmed by the Tripple S clinical team.",
    "price": "P250",
    "duration": "30 min (confirm)",
    "active": true,
    "assessmentNote": "Appointment duration is provisional and requires clinic confirmation."
  },
  {
    "id": "hydrafacial-hydro-jelly-mask",
    "name": "Hydrafacial + Hydro Jelly Mask",
    "category": "Facials & Skin Treatments",
    "description": "A professional facial treatment. Details and suitability are confirmed by the Tripple S clinical team.",
    "price": "P400",
    "duration": "30 min (confirm)",
    "active": true,
    "consultationRequired": true,
    "assessmentNote": "Appointment duration is provisional and requires clinic confirmation."
  },
  {
    "id": "dermaplaning",
    "name": "Dermaplaning",
    "category": "Facials & Skin Treatments",
    "description": "A professional facial treatment. Details and suitability are confirmed by the Tripple S clinical team.",
    "price": "P350",
    "duration": "30 min",
    "active": true
  },
  {
    "id": "led-light-therapy",
    "name": "LED Light Therapy",
    "category": "Facials & Skin Treatments",
    "description": "A professional facial treatment. Details and suitability are confirmed by the Tripple S clinical team.",
    "price": "P200",
    "duration": "30 min (confirm)",
    "active": true,
    "assessmentNote": "Appointment duration is provisional and requires clinic confirmation."
  },
  {
    "id": "brightening-facial",
    "name": "Brightening Facial",
    "category": "Facials & Skin Treatments",
    "description": "A professional facial treatment. Details and suitability are confirmed by the Tripple S clinical team.",
    "price": "P450",
    "duration": "30 min (confirm)",
    "active": true,
    "assessmentNote": "Appointment duration is provisional and requires clinic confirmation."
  },
  {
    "id": "anti-acne-facial",
    "name": "Anti-Acne Facial",
    "category": "Facials & Skin Treatments",
    "description": "A professional facial treatment. Details and suitability are confirmed by the Tripple S clinical team.",
    "price": "P350",
    "duration": "30 min (confirm)",
    "active": true,
    "consultationRequired": true,
    "assessmentNote": "Appointment duration is provisional and requires clinic confirmation."
  },
  {
    "id": "chemical-peels",
    "name": "Chemical Peels",
    "category": "Facials & Skin Treatments",
    "description": "A professional facial treatment. Details and suitability are confirmed by the Tripple S clinical team.",
    "price": "from P950",
    "duration": "30 min (confirm)",
    "active": true,
    "consultationRequired": true,
    "assessmentNote": "Appointment duration is provisional and requires clinic confirmation."
  },
  {
    "id": "hydrating-facial",
    "name": "Hydrating Facial",
    "category": "Facials & Skin Treatments",
    "description": "A professional facial treatment. Details and suitability are confirmed by the Tripple S clinical team.",
    "price": "P350",
    "duration": "30 min (confirm)",
    "active": true,
    "assessmentNote": "Appointment duration is provisional and requires clinic confirmation."
  },
  {
    "id": "sensitive-skin-facial",
    "name": "Sensitive Skin Facial",
    "category": "Facials & Skin Treatments",
    "description": "A professional facial treatment. Details and suitability are confirmed by the Tripple S clinical team.",
    "price": "P300",
    "duration": "30 min (confirm)",
    "active": true,
    "consultationRequired": true,
    "assessmentNote": "Appointment duration is provisional and requires clinic confirmation."
  },
  {
    "id": "microneedling",
    "name": "Microneedling",
    "category": "Advanced Skin Rejuvenation & Pigmentation",
    "description": "An advanced skin treatment option, selected following clinical assessment.",
    "price": "P1,400",
    "duration": "45 min",
    "active": true,
    "consultationRequired": true
  },
  {
    "id": "microneedling-exosomes",
    "name": "Microneedling + Exosomes",
    "category": "Advanced Skin Rejuvenation & Pigmentation",
    "description": "An advanced skin treatment option, selected following clinical assessment.",
    "price": "P2,000",
    "duration": "30 min (confirm)",
    "active": true,
    "consultationRequired": true,
    "assessmentNote": "Appointment duration is provisional and requires clinic confirmation."
  },
  {
    "id": "prp-skin-rejuvenation",
    "name": "PRP Skin Rejuvenation",
    "category": "Advanced Skin Rejuvenation & Pigmentation",
    "description": "An advanced skin treatment option, selected following clinical assessment.",
    "price": "P1,800",
    "duration": "30 min (confirm)",
    "active": true,
    "consultationRequired": true,
    "assessmentNote": "Appointment duration is provisional and requires clinic confirmation."
  },
  {
    "id": "nano-needling",
    "name": "Nano-Needling",
    "category": "Advanced Skin Rejuvenation & Pigmentation",
    "description": "An advanced skin treatment option, selected following clinical assessment.",
    "price": "P1,200",
    "duration": "30 min (confirm)",
    "active": true,
    "consultationRequired": true,
    "assessmentNote": "Appointment duration is provisional and requires clinic confirmation."
  },
  {
    "id": "advanced-anti-acne-peel",
    "name": "Anti-Acne Peel",
    "category": "Advanced Skin Rejuvenation & Pigmentation",
    "description": "An advanced skin treatment option, selected following clinical assessment.",
    "price": "P900",
    "duration": "30 min",
    "active": true,
    "consultationRequired": true
  },
  {
    "id": "pigmentation-treatments",
    "name": "Pigmentation Treatments",
    "category": "Advanced Skin Rejuvenation & Pigmentation",
    "description": "An advanced skin treatment option, selected following clinical assessment.",
    "price": "from P950",
    "duration": "30 min (confirm)",
    "active": true,
    "consultationRequired": true,
    "assessmentNote": "Appointment duration is provisional and requires clinic confirmation."
  },
  {
    "id": "melasma-management",
    "name": "Melasma Management",
    "category": "Advanced Skin Rejuvenation & Pigmentation",
    "description": "An advanced skin treatment option, selected following clinical assessment.",
    "price": "P1,200",
    "duration": "30 min (confirm)",
    "active": true,
    "consultationRequired": true,
    "assessmentNote": "Appointment duration is provisional and requires clinic confirmation."
  },
  {
    "id": "acne-scar-treatments",
    "name": "Acne Scar Treatments",
    "category": "Advanced Skin Rejuvenation & Pigmentation",
    "description": "An advanced skin treatment option, selected following clinical assessment.",
    "price": "P1,400",
    "duration": "30 min (confirm)",
    "active": true,
    "consultationRequired": true,
    "assessmentNote": "Appointment duration is provisional and requires clinic confirmation."
  },
  {
    "id": "fine-lines-wrinkle-treatments",
    "name": "Fine Lines & Wrinkle Treatments",
    "category": "Advanced Skin Rejuvenation & Pigmentation",
    "description": "An advanced skin treatment option, selected following clinical assessment.",
    "price": "P1,200",
    "duration": "30 min (confirm)",
    "active": true,
    "consultationRequired": true,
    "assessmentNote": "Appointment duration is provisional and requires clinic confirmation."
  },
  {
    "id": "skin-texture-improvement",
    "name": "Skin Texture Improvement",
    "category": "Advanced Skin Rejuvenation & Pigmentation",
    "description": "An advanced skin treatment option, selected following clinical assessment.",
    "price": "P1,200",
    "duration": "30 min (confirm)",
    "active": true,
    "consultationRequired": true,
    "assessmentNote": "Appointment duration is provisional and requires clinic confirmation."
  },
  {
    "id": "skin-rejuvenation-packages",
    "name": "Skin Rejuvenation Packages",
    "category": "Advanced Skin Rejuvenation & Pigmentation",
    "description": "An advanced skin treatment option, selected following clinical assessment.",
    "price": "from P2,000",
    "duration": "30 min (confirm)",
    "active": true,
    "consultationRequired": true,
    "assessmentNote": "Appointment duration is provisional and requires clinic confirmation."
  },
  {
    "id": "anti-acne-chemical-peel",
    "name": "Anti-Acne Chemical Peel",
    "category": "Acne Treatments",
    "description": "An acne-focused treatment option. Suitability is determined by the Tripple S clinical team.",
    "price": "P900",
    "duration": "30 min",
    "active": true,
    "consultationRequired": true
  },
  {
    "id": "acne-consultation-skin-assessment",
    "name": "Acne Consultation & Skin Assessment",
    "category": "Acne Treatments",
    "description": "An acne-focused treatment option. Suitability is determined by the Tripple S clinical team.",
    "price": "P400",
    "duration": "30 min",
    "active": true,
    "consultationRequired": true
  },
  {
    "id": "acne-facial",
    "name": "Acne Facial",
    "category": "Acne Treatments",
    "description": "An acne-focused treatment option. Suitability is determined by the Tripple S clinical team.",
    "price": "P350",
    "duration": "30 min (confirm)",
    "active": true,
    "consultationRequired": true,
    "assessmentNote": "Appointment duration is provisional and requires clinic confirmation."
  },
  {
    "id": "post-acne-dark-mark-treatment",
    "name": "Post-Acne Dark Mark Treatment",
    "category": "Acne Treatments",
    "description": "An acne-focused treatment option. Suitability is determined by the Tripple S clinical team.",
    "price": "P800",
    "duration": "30 min (confirm)",
    "active": true,
    "consultationRequired": true,
    "assessmentNote": "Appointment duration is provisional and requires clinic confirmation."
  },
  {
    "id": "professional-acne-homecare-plans",
    "name": "Professional Acne Homecare Plans",
    "category": "Acne Treatments",
    "description": "An acne-focused treatment option. Suitability is determined by the Tripple S clinical team.",
    "price": "from P600",
    "duration": "30 min (confirm)",
    "active": true,
    "consultationRequired": true,
    "assessmentNote": "Appointment duration is provisional and requires clinic confirmation."
  },
  {
    "id": "acne-scar-management",
    "name": "Acne Scar Management",
    "category": "Acne Treatments",
    "description": "An acne-focused treatment option. Suitability is determined by the Tripple S clinical team.",
    "price": "P1,200",
    "duration": "30 min (confirm)",
    "active": true,
    "consultationRequired": true,
    "assessmentNote": "Appointment duration is provisional and requires clinic confirmation."
  },
  {
    "id": "body-contouring-non-invasive",
    "name": "Body Contouring (non-invasive)",
    "category": "Body Contouring & Weight Management",
    "description": "A body contouring or weight-management service, subject to assessment.",
    "price": "P1,500",
    "duration": "30 min (confirm)",
    "active": true,
    "consultationRequired": true,
    "assessmentNote": "Appointment duration is provisional and requires clinic confirmation."
  },
  {
    "id": "fat-reduction-treatments",
    "name": "Fat Reduction Treatments",
    "category": "Body Contouring & Weight Management",
    "description": "A body contouring or weight-management service, subject to assessment.",
    "price": "from P1,200",
    "duration": "30 min (confirm)",
    "active": true,
    "consultationRequired": true,
    "assessmentNote": "Appointment duration is provisional and requires clinic confirmation."
  },
  {
    "id": "body-firming-treatments",
    "name": "Body Firming Treatments",
    "category": "Body Contouring & Weight Management",
    "description": "A body contouring or weight-management service, subject to assessment.",
    "price": "P1,200",
    "duration": "30 min (confirm)",
    "active": true,
    "consultationRequired": true,
    "assessmentNote": "Appointment duration is provisional and requires clinic confirmation."
  },
  {
    "id": "cellulite-treatments",
    "name": "Cellulite Treatments",
    "category": "Body Contouring & Weight Management",
    "description": "A body contouring or weight-management service, subject to assessment.",
    "price": "P1,000",
    "duration": "30 min (confirm)",
    "active": true,
    "consultationRequired": true,
    "assessmentNote": "Appointment duration is provisional and requires clinic confirmation."
  },
  {
    "id": "tummy-contouring",
    "name": "Tummy Contouring",
    "category": "Body Contouring & Weight Management",
    "description": "A body contouring or weight-management service, subject to assessment.",
    "price": "P1,500",
    "duration": "30 min (confirm)",
    "active": true,
    "consultationRequired": true,
    "assessmentNote": "Appointment duration is provisional and requires clinic confirmation."
  },
  {
    "id": "weight-management-consultations",
    "name": "Weight Management Consultations",
    "category": "Body Contouring & Weight Management",
    "description": "A body contouring or weight-management service, subject to assessment.",
    "price": "P400",
    "duration": "30 min",
    "active": true,
    "consultationRequired": true
  },
  {
    "id": "body-measurements-progress-monitoring",
    "name": "Body Measurements & Progress Monitoring",
    "category": "Body Contouring & Weight Management",
    "description": "A body contouring or weight-management service, subject to assessment.",
    "price": "P300",
    "duration": "30 min (confirm)",
    "active": true,
    "consultationRequired": true,
    "assessmentNote": "Appointment duration is provisional and requires clinic confirmation."
  },
  {
    "id": "personalised-nutrition-plans",
    "name": "Personalised Nutrition Plans",
    "category": "Body Contouring & Weight Management",
    "description": "A body contouring or weight-management service, subject to assessment.",
    "price": "P800",
    "duration": "30 min (confirm)",
    "active": true,
    "consultationRequired": true,
    "assessmentNote": "Appointment duration is provisional and requires clinic confirmation."
  },
  {
    "id": "prp-hair-restoration",
    "name": "PRP Hair Restoration",
    "category": "Hair Restoration",
    "description": "A hair and scalp service delivered following assessment by the clinical team.",
    "price": "P1,800",
    "duration": "30 min (confirm)",
    "active": true,
    "consultationRequired": true,
    "assessmentNote": "Appointment duration is provisional and requires clinic confirmation."
  },
  {
    "id": "prp-microneedling-hair",
    "name": "PRP + Microneedling",
    "category": "Hair Restoration",
    "description": "A hair and scalp service delivered following assessment by the clinical team.",
    "price": "P2,200",
    "duration": "30 min (confirm)",
    "active": true,
    "consultationRequired": true,
    "assessmentNote": "Appointment duration is provisional and requires clinic confirmation."
  },
  {
    "id": "hairline-restoration",
    "name": "Hairline Restoration",
    "category": "Hair Restoration",
    "description": "A hair and scalp service delivered following assessment by the clinical team.",
    "price": "P1,800",
    "duration": "30 min (confirm)",
    "active": true,
    "consultationRequired": true,
    "assessmentNote": "Appointment duration is provisional and requires clinic confirmation."
  },
  {
    "id": "scalp-assessment",
    "name": "Scalp Assessment",
    "category": "Hair Restoration",
    "description": "A hair and scalp service delivered following assessment by the clinical team.",
    "price": "P400",
    "duration": "30 min",
    "active": true,
    "consultationRequired": true
  },
  {
    "id": "hair-thinning-management",
    "name": "Hair Thinning Management",
    "category": "Hair Restoration",
    "description": "A hair and scalp service delivered following assessment by the clinical team.",
    "price": "P1,200",
    "duration": "30 min (confirm)",
    "active": true,
    "consultationRequired": true,
    "assessmentNote": "Appointment duration is provisional and requires clinic confirmation."
  },
  {
    "id": "medical-hair-restoration-plans",
    "name": "Medical Hair Restoration Plans",
    "category": "Hair Restoration",
    "description": "A hair and scalp service delivered following assessment by the clinical team.",
    "price": "from P2,500",
    "duration": "30 min (confirm)",
    "active": true,
    "consultationRequired": true,
    "assessmentNote": "Appointment duration is provisional and requires clinic confirmation."
  },
  {
    "id": "iv-hydration-therapy",
    "name": "IV Hydration Therapy",
    "category": "Wellness Treatments",
    "description": "A wellness service subject to clinical suitability review.",
    "price": "P800",
    "duration": "30 min (confirm)",
    "active": true,
    "consultationRequired": true,
    "assessmentNote": "Appointment duration is provisional and requires clinic confirmation."
  },
  {
    "id": "vitamin-infusions",
    "name": "Vitamin Infusions",
    "category": "Wellness Treatments",
    "description": "A wellness service subject to clinical suitability review.",
    "price": "from P800",
    "duration": "30 min (confirm)",
    "active": true,
    "consultationRequired": true,
    "assessmentNote": "Appointment duration is provisional and requires clinic confirmation."
  },
  {
    "id": "wellness-drips",
    "name": "Wellness Drips",
    "category": "Wellness Treatments",
    "description": "A wellness service subject to clinical suitability review.",
    "price": "from P800",
    "duration": "30 min (confirm)",
    "active": true,
    "consultationRequired": true,
    "assessmentNote": "Appointment duration is provisional and requires clinic confirmation."
  },
  {
    "id": "glutathione-infusions",
    "name": "Glutathione Infusions (where appropriate)",
    "category": "Wellness Treatments",
    "description": "A wellness service subject to clinical suitability review.",
    "price": "P1,200",
    "duration": "30 min (confirm)",
    "active": true,
    "consultationRequired": true,
    "assessmentNote": "Appointment duration is provisional and requires clinic confirmation."
  },
  {
    "id": "wellness-consultations",
    "name": "Wellness Consultations",
    "category": "Wellness Treatments",
    "description": "A wellness service subject to clinical suitability review.",
    "price": "P400",
    "duration": "30 min",
    "active": true,
    "consultationRequired": true
  },
  {
    "id": "sauna-therapy",
    "name": "Sauna Therapy",
    "category": "Wellness Treatments",
    "description": "A wellness service subject to clinical suitability review.",
    "price": "P350",
    "duration": "30 min (confirm)",
    "active": true,
    "consultationRequired": true,
    "assessmentNote": "Appointment duration is provisional and requires clinic confirmation."
  },
  {
    "id": "anti-wrinkle-injections",
    "name": "Anti-Wrinkle Injections",
    "category": "Advanced Medical Aesthetics",
    "description": "An advanced medical aesthetics service available only with appropriate practitioner training and legal authorisation.",
    "price": "from P1,800",
    "duration": "30 min (confirm)",
    "active": true,
    "consultationRequired": true,
    "assessmentNote": "Appointment duration is provisional and requires clinic confirmation."
  },
  {
    "id": "dermal-fillers",
    "name": "Dermal Fillers",
    "category": "Advanced Medical Aesthetics",
    "description": "An advanced medical aesthetics service available only with appropriate practitioner training and legal authorisation.",
    "price": "from P2,500",
    "duration": "30 min (confirm)",
    "active": true,
    "consultationRequired": true,
    "assessmentNote": "Appointment duration is provisional and requires clinic confirmation."
  },
  {
    "id": "prp-treatments",
    "name": "PRP Treatments",
    "category": "Advanced Medical Aesthetics",
    "description": "An advanced medical aesthetics service available only with appropriate practitioner training and legal authorisation.",
    "price": "P1,800",
    "duration": "30 min (confirm)",
    "active": true,
    "consultationRequired": true,
    "assessmentNote": "Appointment duration is provisional and requires clinic confirmation."
  },
  {
    "id": "medical-grade-chemical-peels",
    "name": "Medical-Grade Chemical Peels",
    "category": "Advanced Medical Aesthetics",
    "description": "An advanced medical aesthetics service available only with appropriate practitioner training and legal authorisation.",
    "price": "P1,200",
    "duration": "30 min (confirm)",
    "active": true,
    "consultationRequired": true,
    "assessmentNote": "Appointment duration is provisional and requires clinic confirmation."
  },
  {
    "id": "skin-tag-removal",
    "name": "Skin Tag Removal",
    "category": "Advanced Medical Aesthetics",
    "description": "An advanced medical aesthetics service available only with appropriate practitioner training and legal authorisation.",
    "price": "P800",
    "duration": "30 min",
    "active": true,
    "consultationRequired": true
  },
  {
    "id": "prescription-based-skin-treatments",
    "name": "Prescription-Based Skin Treatments",
    "category": "Advanced Medical Aesthetics",
    "description": "An advanced medical aesthetics service available only with appropriate practitioner training and legal authorisation.",
    "price": "from P1,000",
    "duration": "30 min (confirm)",
    "active": true,
    "consultationRequired": true,
    "assessmentNote": "Appointment duration is provisional and requires clinic confirmation."
  },
  {
    "id": "medical-weight-management",
    "name": "Medical Weight Management",
    "category": "Advanced Medical Aesthetics",
    "description": "An advanced medical aesthetics service available only with appropriate practitioner training and legal authorisation.",
    "price": "P1,200",
    "duration": "30 min (confirm)",
    "active": true,
    "consultationRequired": true,
    "assessmentNote": "Appointment duration is provisional and requires clinic confirmation."
  },
  {
    "id": "eyebrow-shaping",
    "name": "Eyebrow Shaping",
    "category": "Other Beauty Treatments",
    "description": "A beauty treatment provided by the Tripple S team.",
    "price": "P200",
    "duration": "30 min (confirm)",
    "active": true,
    "assessmentNote": "Appointment duration is provisional and requires clinic confirmation."
  },
  {
    "id": "lash-treatments",
    "name": "Lash Treatments",
    "category": "Other Beauty Treatments",
    "description": "A beauty treatment provided by the Tripple S team.",
    "price": "P350",
    "duration": "30 min (confirm)",
    "active": true,
    "assessmentNote": "Appointment duration is provisional and requires clinic confirmation."
  },
  {
    "id": "lip-care-treatments",
    "name": "Lip Care Treatments",
    "category": "Other Beauty Treatments",
    "description": "A beauty treatment provided by the Tripple S team.",
    "price": "P300",
    "duration": "30 min (confirm)",
    "active": true,
    "assessmentNote": "Appointment duration is provisional and requires clinic confirmation."
  },
  {
    "id": "hand-foot-care",
    "name": "Hand & Foot Care",
    "category": "Other Beauty Treatments",
    "description": "A beauty treatment provided by the Tripple S team.",
    "price": "P300",
    "duration": "30 min (confirm)",
    "active": true,
    "assessmentNote": "Appointment duration is provisional and requires clinic confirmation."
  },
  {
    "id": "back-facial",
    "name": "Back Facial",
    "category": "Other Beauty Treatments",
    "description": "A beauty treatment provided by the Tripple S team.",
    "price": "P400",
    "duration": "30 min (confirm)",
    "active": true,
    "assessmentNote": "Appointment duration is provisional and requires clinic confirmation."
  },
  {
    "id": "decolletage-treatments",
    "name": "Décolletage Treatments",
    "category": "Other Beauty Treatments",
    "description": "A beauty treatment provided by the Tripple S team.",
    "price": "P450",
    "duration": "30 min (confirm)",
    "active": true,
    "assessmentNote": "Appointment duration is provisional and requires clinic confirmation."
  }
];
export const legacyTrippleSServiceSeedIds: string[] = ["hydration-drip","weight-management-drip","clear-complexion-drip","lumiglow-skin-brightening","premium-glow-drip","ultimate-beauty-wellness","anti-sweat-injection","skin-boosters","prp-facial","microneedling","skin-repair-microneedling","pigmentation-peel","hydra-facial","deep-cleansing-led","anti-acne-peel","glow-up-peel","blemish-peel","dermaplaning","skin-tag-removal","lipolytic-10","lipolytic-20","lipolytic-30","sauna-45","sauna-60","skin-consultation"];
export const trippleSProductSeed = [
  { id: "dark-spot-serum", name: "Dark Spot Serum", description: "30ml · Product information from the official Tripple S website.", size: "30ml", price: "P1,200", active: true, purchaseMethod: "Enquire with Tripple S" },
  { id: "vitamin-c-serum", name: "Vitamin C Serum", description: "30ml · Product information from the official Tripple S website.", size: "30ml", price: "P950", active: true, purchaseMethod: "Enquire with Tripple S" },
  { id: "complexion-corrector-cream", name: "Complexion Corrector Cream", description: "100ml · Product information from the official Tripple S website.", size: "100ml", price: "P2,000", active: true, purchaseMethod: "Enquire with Tripple S" },
  { id: "anti-acne-serum", name: "Anti-Acne Serum", description: "30ml · Product information from the official Tripple S website.", size: "30ml", price: "P950", active: true, purchaseMethod: "Enquire with Tripple S" },
  { id: "retinol-serum", name: "Retinol Serum", description: "Product information from the official Tripple S website.", size: "—", price: "P1,300", active: true, purchaseMethod: "Enquire with Tripple S" },
];
