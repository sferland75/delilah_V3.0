import { 
  Shirt, 
  Bath, 
  Bed, 
  Stethoscope, 
  Glasses, 
  Utensils, 
  PersonStanding,
  ArrowUpDown,
  Brush,
  Clipboard,
  Home,
  Heart,
  Activity
} from 'lucide-react';

export const CARE_RATES = {
  LEVEL_1: 14.90, // Routine personal care
  LEVEL_2: 14.00, // Basic supervision
  LEVEL_3: 21.11, // Complex care
} as const;

export const WEEKLY_TO_MONTHLY = 4.3; // Conversion factor for weekly to monthly hours

export const DEFAULT_ACTIVITY = {
  minutes: 0,
  timesPerWeek: 0,
  totalMinutes: 0,
  notes: '',
};

export const LEVEL_DESCRIPTIONS = {
  LEVEL_1: "Level 1 attendant care is for routine personal care. Please assess the care requirements of the applicant for each activity listed. Estimate the time it takes to perform each activity, and the number of times each week it should be performed.",
  LEVEL_2: "Level 2 Attendant Care is for basic supervisory functions. Please assess the care requirements of the applicant for each activity listed. Estimate the time it takes to perform each activity, and the number of times each week it should be performed.",
  LEVEL_3: "Level 3 attendant care is for complex health/care and hygiene functions. Please assess the care requirements of the applicant for each activity listed. Estimate the time it takes to perform each activity, and the number of times each week it should be performed.",
} as const;

// Categories match exactly with Form 1 Assessment of Attendant Care Needs PDF
export const careCategories = {
  level1: {
    dressing: {
      title: "Dress",
      icon: Shirt,
      items: [
        { id: "upperBody", title: "Upper Body", description: "underwear, shirt/blouse, sweater, tie, jacket, gloves, jewelry" },
        { id: "lowerBody", title: "Lower Body", description: "underwear, disposable briefs, skirt/pants, socks, panty hose, slippers shoes" }
      ]
    },
    undressing: {
      title: "Undress",
      icon: Shirt,
      items: [
        { id: "upperBody", title: "Upper Body", description: "underwear, shirt/blouse, sweater, tie, jacket, gloves, jewelry" },
        { id: "lowerBody", title: "Lower Body", description: "underwear, disposable briefs, skirt/pants, socks, panty hose, slippers shoes" }
      ]
    },
    prosthetics: {
      title: "Prosthetics",
      icon: Stethoscope,
      items: [
        { id: "appliesLimb", title: "applies to upper/lower limb prosthesis and stump sock(s)" },
        { id: "exchangesDevices", title: "exchanges terminal devices and adjusts prosthesis as required" },
        { id: "ensuresMaintained", title: "ensures prosthesis is properly maintained and in good working condition" }
      ]
    },
    orthotics: {
      title: "Orthotics",
      icon: Stethoscope,
      items: [
        { id: "assistsDressing", title: "assists dressing applicant using prescribed orthotics", description: "burn garment(s), brace(s), support(s), splints, elastic stockings" }
      ]
    },
    grooming: {
      title: "Grooming",
      icon: Brush,
      items: [
        { id: "face", title: "Face", description: "wash, rinse, dry, morning and evening" },
        { id: "hands", title: "Hands", description: "wash, rinse, dry, morning and evening, before and after meals, and after elimination" },
        { id: "shaving", title: "Shaving", description: "shaves applicant using electric/safety razor" },
        { id: "cosmetics", title: "Cosmetics", description: "applies makeup as desired or required" },
        { id: "hairBrushing", title: "Hair: brushes/combs as required" },
        { id: "hairWashing", title: "Hair: shampoos, blow/towel dries" },
        { id: "hairStyling", title: "Hair: performs styling, set and comb-out" },
        { id: "fingernails", title: "Fingernails", description: "cleans and manicures as required" },
        { id: "toenails", title: "Toenails", description: "cleans and trims as required" }
      ]
    },
    feeding: {
      title: "Feeding",
      icon: Utensils,
      items: [
        { id: "prepMeals", title: "prepares applicant for meals", description: "includes transfer to appropriate location" },
        { id: "assistMeals", title: "provides assistance, either in whole or in part, in preparing serving and feeding meals" }
      ]
    },
    mobility: {
      title: "Mobility (location change)",
      icon: PersonStanding,
      items: [
        { id: "sitting", title: "assists applicant from sitting position", description: "wheelchair, chair, sofa" },
        { id: "walking", title: "supervises/assists in walking" },
        { id: "transfers", title: "performs transfer needs as required", description: "bed to wheelchair, wheelchair to bed" }
      ]
    },
    laundering: {
      title: "Extra Laundering",
      icon: Home,
      items: [
        { id: "bedding", title: "launders applicant's bedding and clothing as a result of incontinence/spillage" },
        { id: "orthoticSupplies", title: "launders/cleans orthotic supplies that require special care" }
      ]
    }
  },
  level2: {
    hygiene: {
      title: "Hygiene",
      icon: Bath,
      items: [
        { id: "bathroom", title: "Bathroom", description: "cleans tub/shower/sink/toilet after applicant's use" },
        { id: "bedroom", title: "Bedroom", description: "changes applicant's bedding, makes bed, cleans bedroom, including Hoyer lifts, overhead bars, bedside tables" },
        { id: "comfort", title: "ensures comfort, safety and security in this environment" },
        { id: "apparel", title: "Clothing Care: assists in preparing daily wearing apparel" },
        { id: "laundry", title: "Clothing Care: hangs clothes and sorts clothing to be laundered/cleaned" }
      ]
    },
    supervision: {
      title: "Basic Supervisory Care",
      icon: Clipboard,
      items: [
        { id: "trachea", title: "applicant lacks the capacity to reattach tubing if it becomes detached from trachea" },
        { id: "transfers", title: "applicant requires assistance to transfer from wheelchair, periodic turning, genitourinary care" },
        { id: "independence", title: "applicant lacks the ability to independently get in and out of a wheelchair or to be self-sufficient in an emergency" },
        { id: "emergency", title: "applicant lacks the ability to respond to an emergency or needs custodial care due to changes in behaviour" }
      ]
    },
    coordination: {
      title: "Co-ordination of Attendant Care",
      icon: Clipboard,
      items: [
        { id: "scheduling", title: "applicant requires assistance in co-ordinating/scheduling attendant care", description: "maximum 1 hour per week" }
      ]
    }
  },
  level3: {
    genitourinary: {
      title: "Genitourinary Tracts",
      icon: Stethoscope,
      items: [
        { id: "catheterization", title: "performs catheterizations" },
        { id: "drainage", title: "positions, empties and cleans drainage systems" },
        { id: "cleaning", title: "cleans applicant and equipment after procedure/incontinence" },
        { id: "briefs", title: "uses disposable briefs as required" },
        { id: "menstrual", title: "attends to menstrual cycle needs as required" },
        { id: "residuals", title: "monitors residuals" }
      ]
    },
    bowel: {
      title: "Bowel Care",
      icon: Stethoscope,
      items: [
        { id: "enemas", title: "administers enemas or suppositories and performs stimulation or disimpaction" },
        { id: "colostomy", title: "performs colostomy and/or ileostomy care" },
        { id: "drainageSystems", title: "positions, empties and cleans drainage systems, including ilio-conduits" },
        { id: "disposableBriefs", title: "uses disposable briefs as required" },
        { id: "cleaningAfter", title: "cleans applicant and equipment after procedure/evacuation" }
      ]
    },
    tracheostomy: {
      title: "Tracheostomy Care",
      icon: Stethoscope,
      items: [
        { id: "cannulae", title: "changes and cleans inner and outer cannulae as needed" },
        { id: "tapes", title: "changes tapes as required" },
        { id: "suctioning", title: "performs suctioning as required" },
        { id: "suction", title: "cleans and maintains suction equipment" }
      ]
    },
    ventilator: {
      title: "Ventilator Care",
      icon: Stethoscope,
      items: [
        { id: "volume", title: "ensures volume rate and pressure are maintained as prescribed" },
        { id: "humidification", title: "maintains humidification as specified" },
        { id: "tubing", title: "changes and cleans tubing and filters as required" },
        { id: "cleaning", title: "cleans humidification system as required" },
        { id: "settings", title: "adjusts settings according to client needs", description: "colds, congestion" },
        { id: "reattaches", title: "reattaches tubing if it becomes detached" }
      ]
    },
    exercise: {
      title: "Exercise",
      icon: Activity,
      items: [
        { id: "program", title: "assists applicant with prescribed exercise/stretching program" },
        { id: "walking", title: "assists applicant with walking activities using crutches, canes, braces and/or walker" }
      ]
    },
    skinCare: {
      title: "Skin Care (excluding bathing)",
      icon: Stethoscope,
      items: [
        { id: "wounds", title: "attends to skin care needs – wounds, sores, eruptions", description: "amputees, severe burns, spinal cord injuries, etc." },
        { id: "medication", title: "applies medication and prescribed dressings" },
        { id: "creams", title: "applies creams, lotions, pastes, ointments, powders as prescribed or required" },
        { id: "checks", title: "checks body area(s) for evidence of pressure sores, skin breakdown or eruptions" },
        { id: "turning", title: "periodic turning to prevent or minimize pressure sores and skin breakdown/shearing" }
      ]
    },
    medication: {
      title: "Medication",
      icon: Stethoscope,
      items: [
        { id: "oralAdministers", title: "Oral: administers prescribed medications" },
        { id: "oralMonitors", title: "Oral: monitors medication intake and effect" },
        { id: "oralMaintains", title: "Oral: maintains and controls medication supply" },
        { id: "injectionsAdministers", title: "Injections: administers prescribed medications" },
        { id: "injectionsMonitors", title: "Injections: monitors medication intake and effect" },
        { id: "injectionsMaintains", title: "Injections: maintains and controls medication supply" },
        { id: "inhalationAdministers", title: "Inhalation/Oxygen Therapy: administers prescribed dosage as required" },
        { id: "inhalationMaintains", title: "Inhalation/Oxygen Therapy: maintains and controls inhalation supplies" },
        { id: "inhalationCleans", title: "Inhalation/Oxygen Therapy: cleans and maintains equipment" }
      ]
    },
    bathing: {
      title: "Bathing",
      icon: Bath,
      items: [
        { id: "tubTransfers", title: "Bathtub or Shower: transfers applicant to and from bed, wheelchair or Hoyer lifts to bathtub or shower" },
        { id: "tubBathes", title: "Bathtub or Shower: bathes and dries client" },
        { id: "tubApplies", title: "Bathtub or Shower: applies creams, lotions, pastes, ointments, powders as prescribed or required" },
        { id: "bedPrepares", title: "Bed Bath: prepares equipment" },
        { id: "bedBathes", title: "Bed Bath: bathes and dries applicant" },
        { id: "bedApplies", title: "Bed Bath: applies creams, lotions, pastes, ointments, powders as prescribed or required" },
        { id: "bedCleans", title: "Bed Bath: cleans and maintains bed/bath equipment" },
        { id: "oralBrushes", title: "Oral Hygiene: brushes and flosses" },
        { id: "oralCleanses", title: "Oral Hygiene: cleanses mouth as required" },
        { id: "oralDentures", title: "Oral Hygiene: cleans dentures as required" }
      ]
    },
    otherTherapy: {
      title: "Other Therapy",
      icon: Activity,
      items: [
        { id: "tensPrepares", title: "Transcutaneous Electrical Nerve Stimulation (TENS): prepares equipment" },
        { id: "tensAdministers", title: "Transcutaneous Electrical Nerve Stimulation (TENS): administers treatment as prescribed or required" },
        { id: "dcsMonitors", title: "Dorsal Column Stimulation (DCS): monitors skin" },
        { id: "dcsMaintains", title: "Dorsal Column Stimulation (DCS): maintains equipment" }
      ]
    },
    maintenance: {
      title: "Maintenance of Supplies and Equipment",
      icon: Clipboard,
      items: [
        { id: "monitors", title: "monitors, orders and maintains required supplies/equipment" },
        { id: "ensures", title: "ensures wheelchairs, prosthetic devices, Hoyer lifts, shower commodes and other specialized medical equipment and assistive devices are safe and secure" }
      ]
    },
    skilledCare: {
      title: "Skilled Supervisory Care",
      icon: Heart,
      items: [
        { id: "violent", title: "applicant requires skilled supervisory care for violent behaviour that may result in physical harm to themselves or others" }
      ]
    }
  }
} as const;