export type ServiceCategory = "IV Wellness Drips" | "Medical Aesthetics" | "Skin Treatments" | "Body Contouring" | "Wellness" | "Consultations";

export type ServiceSeed = {
  id: string; name: string; category: ServiceCategory; description: string; price: string; duration: string; active: boolean;
  consultationRequired?: boolean; assessmentNote?: string;
};

export const trippleSServiceSeed: ServiceSeed[] = [
  { id: "hydration-drip", name: "Hydration Drip", category: "IV Wellness Drips", description: "IV wellness treatment focused on hydration.", price: "P600", duration: "60 min", active: true },
  { id: "weight-management-drip", name: "Weight Management Drip", category: "IV Wellness Drips", description: "IV wellness treatment for clients exploring weight-management support.", price: "P850", duration: "60 min", active: true, consultationRequired: true },
  { id: "clear-complexion-drip", name: "Clear Complexion Drip", category: "IV Wellness Drips", description: "IV wellness treatment focused on complexion support.", price: "P1,200", duration: "60 min", active: true },
  { id: "lumiglow-skin-brightening", name: "LumiGlow Skin Brightening", category: "IV Wellness Drips", description: "IV wellness treatment positioned around skin brightening and glow.", price: "P1,500", duration: "60 min", active: true },
  { id: "premium-glow-drip", name: "Premium Glow Drip", category: "IV Wellness Drips", description: "Premium IV wellness treatment for a glow-focused visit.", price: "P1,500", duration: "60 min", active: true },
  { id: "ultimate-beauty-wellness", name: "Ultimate Beauty & Wellness", category: "IV Wellness Drips", description: "Combined beauty and wellness IV experience.", price: "P1,800", duration: "60 min", active: true },
  { id: "anti-sweat-injection", name: "Anti-Sweat Injection", category: "Medical Aesthetics", description: "Medical aesthetic injection treatment for excessive sweating concerns.", price: "P5,000", duration: "45 min", active: true, consultationRequired: true },
  { id: "skin-boosters", name: "Skin Boosters", category: "Medical Aesthetics", description: "Medical aesthetic skin booster treatment.", price: "P2,900", duration: "45 min", active: true, consultationRequired: true },
  { id: "prp-facial", name: "PRP Facial", category: "Medical Aesthetics", description: "PRP-based facial treatment delivered by the clinical team.", price: "P3,800", duration: "60 min", active: true, consultationRequired: true },
  { id: "microneedling", name: "Microneedling", category: "Skin Treatments", description: "Precision microneedling treatment for skin concerns.", price: "P1,400", duration: "45 min", active: true, consultationRequired: true },
  { id: "skin-repair-microneedling", name: "Skin Repair Microneedling", category: "Skin Treatments", description: "Microneedling treatment focused on skin repair.", price: "P1,200", duration: "45 min", active: true, consultationRequired: true },
  { id: "pigmentation-peel", name: "Pigmentation Peel", category: "Skin Treatments", description: "Peel treatment for pigmentation-focused skin care.", price: "P850", duration: "30 min", active: true, consultationRequired: true },
  { id: "hydra-facial", name: "Hydra Facial", category: "Skin Treatments", description: "Hydra facial treatment for refreshed skin.", price: "P500", duration: "45 min", active: true },
  { id: "deep-cleansing-led", name: "Deep Cleansing with LED", category: "Skin Treatments", description: "Deep cleansing facial with LED treatment.", price: "P350", duration: "45 min", active: true },
  { id: "anti-acne-peel", name: "Anti-Acne Peel", category: "Skin Treatments", description: "Peel treatment for acne-focused skin care.", price: "P600", duration: "30 min", active: true, consultationRequired: true },
  { id: "glow-up-peel", name: "Glow Up Peel", category: "Skin Treatments", description: "Glow-focused peel treatment.", price: "P500", duration: "30 min", active: true },
  { id: "blemish-peel", name: "Blemish Peel", category: "Skin Treatments", description: "Peel treatment for blemish-focused skin care.", price: "P750", duration: "30 min", active: true, consultationRequired: true },
  { id: "dermaplaning", name: "Dermaplaning", category: "Skin Treatments", description: "Professional dermaplaning treatment.", price: "P500", duration: "30 min", active: true },
  { id: "skin-tag-removal", name: "Skin Tag Removal", category: "Skin Treatments", description: "Skin tag removal following clinical assessment.", price: "P500 – P1,800", duration: "30 min", active: true, consultationRequired: true, assessmentNote: "Priced per assessment." },
  { id: "lipolytic-10", name: "Lipolytic Injections — 10 Injections", category: "Body Contouring", description: "Body contouring injection treatment.", price: "P1,500", duration: "45 min", active: true, consultationRequired: true },
  { id: "lipolytic-20", name: "Lipolytic Injections — 20 Injections", category: "Body Contouring", description: "Body contouring injection treatment.", price: "P2,000", duration: "45 min", active: true, consultationRequired: true },
  { id: "lipolytic-30", name: "Lipolytic Injections — 30 Injections", category: "Body Contouring", description: "Body contouring injection treatment.", price: "P3,000", duration: "45 min", active: true, consultationRequired: true },
  { id: "sauna-45", name: "Sauna Blanket — 45 minutes", category: "Wellness", description: "45-minute sauna blanket wellness session.", price: "P300", duration: "45 min", active: true },
  { id: "sauna-60", name: "Sauna Blanket — 1 hour", category: "Wellness", description: "One-hour sauna blanket wellness session.", price: "P650", duration: "60 min", active: true },
  { id: "skin-consultation", name: "Skin Consultation", category: "Consultations", description: "Professional skin consultation with the Tripple S clinical team.", price: "P400", duration: "30 min", active: true }
];

export const trippleSProductSeed: never[] = [];
