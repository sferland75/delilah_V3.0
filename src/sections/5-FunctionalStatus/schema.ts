import { z } from 'zod';

// Helper functions for Range of Motion
const createMovementSchema = () => z.object({
  value: z.number().nullable().refine(
    (val) => val === null || (val >= 0 && val <= 180),
    { message: "Value must be between 0 and 180 degrees" }
  ),
  limitationType: z.string().optional(),
  notes: z.string().optional()
});

const createRegionSchema = (movements) => {
  const movementFields = {};
  movements.forEach(movement => {
    movementFields[movement] = createMovementSchema();
  });
  
  return z.object({
    isExpanded: z.boolean().default(false),
    ...movementFields,
    generalNotes: z.string().optional()
  });
};

// Define movement lists for each region
const cervicalMovements = ['flexion', 'extension', 'leftLateralFlexion', 'rightLateralFlexion', 'leftRotation', 'rightRotation'];
const shoulderMovements = ['leftFlexion', 'rightFlexion', 'leftExtension', 'rightExtension', 'leftAbduction', 'rightAbduction', 
                         'leftAdduction', 'rightAdduction', 'leftInternalRotation', 'rightInternalRotation', 
                         'leftExternalRotation', 'rightExternalRotation'];
const elbowMovements = ['leftFlexion', 'rightFlexion', 'leftExtension', 'rightExtension', 
                      'leftPronation', 'rightPronation', 'leftSupination', 'rightSupination'];
const wristMovements = ['leftFlexion', 'rightFlexion', 'leftExtension', 'rightExtension', 
                      'leftRadialDeviation', 'rightRadialDeviation', 'leftUlnarDeviation', 'rightUlnarDeviation'];
const thoracicAndLumbarMovements = ['flexion', 'extension', 'leftLateralFlexion', 'rightLateralFlexion', 'leftRotation', 'rightRotation'];
const hipMovements = ['leftFlexion', 'rightFlexion', 'leftExtension', 'rightExtension', 'leftAbduction', 'rightAbduction', 
                    'leftAdduction', 'rightAdduction', 'leftInternalRotation', 'rightInternalRotation', 
                    'leftExternalRotation', 'rightExternalRotation'];
const kneeMovements = ['leftFlexion', 'rightFlexion', 'leftExtension', 'rightExtension'];
const ankleMovements = ['leftDorsiflexion', 'rightDorsiflexion', 'leftPlantarflexion', 'rightPlantarflexion', 
                       'leftInversion', 'rightInversion', 'leftEversion', 'rightEversion'];

// Create range of motion schema
const rangeOfMotionSchema = z.object({
  cervical: createRegionSchema(cervicalMovements),
  shoulder: createRegionSchema(shoulderMovements),
  elbow: createRegionSchema(elbowMovements),
  wrist: createRegionSchema(wristMovements),
  thoracicAndLumbar: createRegionSchema(thoracicAndLumbarMovements),
  hip: createRegionSchema(hipMovements),
  knee: createRegionSchema(kneeMovements),
  ankle: createRegionSchema(ankleMovements)
});

// Helper functions for Manual Muscle Testing
const createMuscleSchema = () => z.object({
  right: z.string(),
  left: z.string(),
  painWithResistance: z.boolean().default(false),
  notes: z.string().optional()
});

const createMuscleGroupSchema = (muscles) => {
  const muscleFields = {};
  muscles.forEach(muscle => {
    muscleFields[muscle] = createMuscleSchema();
  });
  
  return z.object({
    isExpanded: z.boolean().default(false),
    ...muscleFields,
    generalNotes: z.string().optional()
  });
};

// Define muscle lists for each group
const shoulderMuscles = ['flexion', 'extension', 'abduction', 'adduction', 'internalRotation', 'externalRotation'];
const elbowMuscles = ['flexion', 'extension', 'pronation', 'supination'];
const wristMuscles = ['flexion', 'extension', 'radialDeviation', 'ulnarDeviation'];
const handMuscles = ['gripStrength', 'pinchStrength', 'fingerFlexion', 'fingerExtension', 'thumbOpposition'];
const hipMuscles = ['flexion', 'extension', 'abduction', 'adduction', 'internalRotation', 'externalRotation'];
const kneeMuscles = ['flexion', 'extension'];
const ankleMuscles = ['dorsiflexion', 'plantarflexion', 'inversion', 'eversion', 'toeFlexion', 'toeExtension'];
const trunkMuscles = ['flexion', 'extension', 'rotation', 'lateralFlexion'];

// Create manual muscle schema
const manualMuscleSchema = z.object({
  shoulder: createMuscleGroupSchema(shoulderMuscles),
  elbow: createMuscleGroupSchema(elbowMuscles),
  wrist: createMuscleGroupSchema(wristMuscles),
  hand: createMuscleGroupSchema(handMuscles),
  hip: createMuscleGroupSchema(hipMuscles),
  knee: createMuscleGroupSchema(kneeMuscles),
  ankle: createMuscleGroupSchema(ankleMuscles),
  trunk: createMuscleGroupSchema(trunkMuscles)
});

// Helper function for Berg Balance items
const createBergItemSchema = () => z.object({
  score: z.number().min(0).max(4),
  notes: z.string().optional()
});

// Full Berg Balance Schema
const bergBalanceSchema = z.object({
  sittingToStanding: createBergItemSchema(),
  standingUnsupported: createBergItemSchema(),
  sittingUnsupported: createBergItemSchema(),
  standingToSitting: createBergItemSchema(),
  transfers: createBergItemSchema(),
  standingWithEyesClosed: createBergItemSchema(),
  standingWithFeetTogether: createBergItemSchema(),
  reachingForwardWithOutstretchedArm: createBergItemSchema(),
  pickingUpObject: createBergItemSchema(),
  turningToLookBehind: createBergItemSchema(),
  turning360Degrees: createBergItemSchema(),
  placingAlternateFoot: createBergItemSchema(),
  standingWithOneFootAhead: createBergItemSchema(),
  standingOnOneLeg: createBergItemSchema(),
  completedItems: z.boolean().default(false),
  generalNotes: z.string().optional()
});

// Helper schema for limiting factors in postural assessment
const posturalLimitingFactorsSchema = z.object({
  pain: z.boolean().default(false),
  fatigue: z.boolean().default(false),
  weakness: z.boolean().default(false),
  balance: z.boolean().default(false),
  endurance: z.boolean().default(false),
  dizziness: z.boolean().default(false),
  breathlessness: z.boolean().default(false),
  fear: z.boolean().default(false)
});

// Helper schema for postural items
const createPosturalItemSchema = () => z.object({
  toleranceLevel: z.enum(['normal', 'mildlyLimited', 'moderatelyLimited', 'severelyLimited', 'unableToPerform']),
  limitingFactors: posturalLimitingFactorsSchema,
  duration: z.string().optional(),
  unit: z.enum(['seconds', 'minutes', 'hours', 'repetitions']),
  assistiveDevice: z.string().optional(),
  notes: z.string().optional()
});

// Helper function to create postural category schema
const createPosturalCategorySchema = (items) => {
  const itemFields = {};
  items.forEach(item => {
    itemFields[item] = createPosturalItemSchema();
  });
  
  return z.object({
    isExpanded: z.boolean().default(false),
    ...itemFields,
    generalNotes: z.string().optional()
  });
};

// Define postural items for each category
const staticItems = ['sitting', 'standing', 'squatting', 'kneeling'];
const dynamicItems = ['walking', 'stairClimbing', 'uneven', 'carrying'];
const transitionItems = ['sitToStand', 'standToSit', 'floorToStand', 'supineToSit'];

// Create postural tolerances schema
const posturalTolerancesSchema = z.object({
  static: createPosturalCategorySchema(staticItems),
  dynamic: createPosturalCategorySchema(dynamicItems),
  transitions: createPosturalCategorySchema(transitionItems)
});

// Helper schema for limiting factors in transfers assessment
const transferLimitingFactorsSchema = z.object({
  pain: z.boolean().default(false),
  strength: z.boolean().default(false),
  balance: z.boolean().default(false),
  coordination: z.boolean().default(false),
  endurance: z.boolean().default(false),
  cognition: z.boolean().default(false),
  fear: z.boolean().default(false),
  rangeOfMotion: z.boolean().default(false)
});

// Helper schema for transfer items
const createTransferItemSchema = () => z.object({
  independence: z.enum(['independent', 'setup', 'supervision', 'minimalAssist', 'moderateAssist', 'maximalAssist', 'dependent', 'notAssessed']),
  limitingFactors: transferLimitingFactorsSchema,
  assistiveDevice: z.string().optional(),
  assistRequired: z.string().optional(),
  notes: z.string().optional()
});

// Helper function to create transfer category schema
const createTransferCategorySchema = (items) => {
  const itemFields = {};
  items.forEach(item => {
    itemFields[item] = createTransferItemSchema();
  });
  
  return z.object({
    isExpanded: z.boolean().default(false),
    ...itemFields,
    generalNotes: z.string().optional()
  });
};

// Define transfer items for each category
const basicTransferItems = ['bedMobility', 'supineToSit', 'sitToStand', 'standToSit'];
const functionalTransferItems = ['chairToChair', 'toiletTransfer', 'carTransfer', 'tub'];
const specialtyTransferItems = ['floorToChair', 'bedToWC', 'slidingBoard', 'dependentLift'];

// Create transfers schema
const transfersSchema = z.object({
  basic: createTransferCategorySchema(basicTransferItems),
  functional: createTransferCategorySchema(functionalTransferItems),
  specialty: createTransferCategorySchema(specialtyTransferItems)
});

export const functionalStatusSchema = z.object({
  data: z.object({
    rangeOfMotion: rangeOfMotionSchema,
    manualMuscle: manualMuscleSchema,
    bergBalance: bergBalanceSchema,
    posturalTolerances: posturalTolerancesSchema,
    transfers: transfersSchema
  })
});

export type FunctionalStatus = z.infer<typeof functionalStatusSchema>;

// Helper functions for default values
// Range of Motion defaults
const createDefaultMovement = () => ({
  value: null,
  limitationType: "",
  notes: ""
});

const createDefaultRegion = (movements) => {
  const defaults = {
    isExpanded: false,
    generalNotes: ""
  };
  
  movements.forEach(movement => {
    defaults[movement] = createDefaultMovement();
  });
  
  return defaults;
};

// Manual Muscle Testing defaults
const createDefaultMuscle = () => ({
  right: "5",
  left: "5",
  painWithResistance: false,
  notes: ""
});

const createDefaultMuscleGroup = (muscles) => {
  const defaults = {
    isExpanded: false,
    generalNotes: ""
  };
  
  muscles.forEach(muscle => {
    defaults[muscle] = createDefaultMuscle();
  });
  
  return defaults;
};

// Berg Balance Assessment defaults
const createDefaultBergItem = () => ({
  score: 4,
  notes: ""
});

// Postural Tolerances defaults
const createDefaultPosturalLimitingFactors = () => ({
  pain: false,
  fatigue: false,
  weakness: false,
  balance: false,
  endurance: false,
  dizziness: false,
  breathlessness: false,
  fear: false
});

const createDefaultPosturalItem = () => ({
  toleranceLevel: 'normal',
  limitingFactors: createDefaultPosturalLimitingFactors(),
  duration: '',
  unit: 'minutes',
  assistiveDevice: '',
  notes: ''
});

const createDefaultPosturalCategory = (items) => {
  const defaults = {
    isExpanded: false,
    generalNotes: ""
  };
  
  items.forEach(item => {
    defaults[item] = createDefaultPosturalItem();
  });
  
  return defaults;
};

// Transfer Assessment defaults
const createDefaultTransferLimitingFactors = () => ({
  pain: false,
  strength: false,
  balance: false,
  coordination: false,
  endurance: false,
  cognition: false,
  fear: false,
  rangeOfMotion: false
});

const createDefaultTransferItem = () => ({
  independence: 'independent',
  limitingFactors: createDefaultTransferLimitingFactors(),
  assistiveDevice: '',
  assistRequired: '',
  notes: ''
});

const createDefaultTransferCategory = (items) => {
  const defaults = {
    isExpanded: false,
    generalNotes: ""
  };
  
  items.forEach(item => {
    defaults[item] = createDefaultTransferItem();
  });
  
  return defaults;
};

export const defaultFormState = {
  data: {
    rangeOfMotion: {
      cervical: createDefaultRegion(cervicalMovements),
      shoulder: createDefaultRegion(shoulderMovements),
      elbow: createDefaultRegion(elbowMovements),
      wrist: createDefaultRegion(wristMovements),
      thoracicAndLumbar: createDefaultRegion(thoracicAndLumbarMovements),
      hip: createDefaultRegion(hipMovements),
      knee: createDefaultRegion(kneeMovements),
      ankle: createDefaultRegion(ankleMovements)
    },
    manualMuscle: {
      shoulder: createDefaultMuscleGroup(shoulderMuscles),
      elbow: createDefaultMuscleGroup(elbowMuscles),
      wrist: createDefaultMuscleGroup(wristMuscles),
      hand: createDefaultMuscleGroup(handMuscles),
      hip: createDefaultMuscleGroup(hipMuscles),
      knee: createDefaultMuscleGroup(kneeMuscles),
      ankle: createDefaultMuscleGroup(ankleMuscles),
      trunk: createDefaultMuscleGroup(trunkMuscles)
    },
    bergBalance: {
      sittingToStanding: createDefaultBergItem(),
      standingUnsupported: createDefaultBergItem(),
      sittingUnsupported: createDefaultBergItem(),
      standingToSitting: createDefaultBergItem(),
      transfers: createDefaultBergItem(),
      standingWithEyesClosed: createDefaultBergItem(),
      standingWithFeetTogether: createDefaultBergItem(),
      reachingForwardWithOutstretchedArm: createDefaultBergItem(),
      pickingUpObject: createDefaultBergItem(),
      turningToLookBehind: createDefaultBergItem(),
      turning360Degrees: createDefaultBergItem(),
      placingAlternateFoot: createDefaultBergItem(),
      standingWithOneFootAhead: createDefaultBergItem(),
      standingOnOneLeg: createDefaultBergItem(),
      completedItems: true,
      generalNotes: ""
    },
    posturalTolerances: {
      static: createDefaultPosturalCategory(staticItems),
      dynamic: createDefaultPosturalCategory(dynamicItems),
      transitions: createDefaultPosturalCategory(transitionItems)
    },
    transfers: {
      basic: createDefaultTransferCategory(basicTransferItems),
      functional: createDefaultTransferCategory(functionalTransferItems),
      specialty: createDefaultTransferCategory(specialtyTransferItems)
    }
  }
};