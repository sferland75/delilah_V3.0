/**
 * Sample Data for Prompt Testing
 * 
 * This module provides realistic sample data for testing prompt templates.
 * The data represents a variety of clinical scenarios with different levels of completeness.
 */

/**
 * Get sample data for a specific section
 */
export function getSampleData(sectionId: string): any {
  switch (sectionId) {
    case 'initial-assessment':
      return {
        firstName: 'John',
        lastName: 'Smith',
        dateOfBirth: '1980-01-15',
        gender: 'Male',
        address: '123 Main Street, Anytown, CA 12345',
        phoneNumber: '555-123-4567',
        email: 'john.smith@example.com',
        referralSource: 'Dr. Jane Williams, Neurologist',
        referralReason: 'Multiple Sclerosis management; evaluate home safety and daily function',
        referralDate: '2025-01-30',
        assessmentDate: '2025-02-24',
        assessmentLocation: "Client\'s home",
        primaryInsurance: 'Blue Cross Blue Shield',
        policyNumber: 'BCB123456789',
        secondaryInsurance: 'Medicare',
        occupation: 'Software Developer (currently working from home 30 hours/week)',
        maritalStatus: 'Married',
        livingArrangement: 'Lives with spouse in single-level home',
        primaryCareProvider: 'Dr. Robert Chen',
        emergencyContact: 'Sarah Smith (spouse), 555-987-6543'
      };
      
    case 'medical-history':
      return {
        primaryDiagnosis: 'Multiple Sclerosis, relapsing-remitting type',
        diagnosisDate: '2015-06-12',
        secondaryDiagnoses: [
          'Hypertension (well-controlled)',
          'Depression (mild)',
          'Chronic low back pain'
        ],
        allergies: [
          'Penicillin (hives)',
          'Sulfa drugs (rash)'
        ],
        currentMedications: [
          'Tecfidera (dimethyl fumarate) 240mg twice daily',
          'Lisinopril 10mg daily for hypertension',
          'Escitalopram 10mg daily for depression',
          'Ibuprofen 400mg as needed for pain'
        ],
        pastMedicalInterventions: [
          'IV methylprednisolone for MS flare (2019)',
          'Physical therapy for back pain (2018-2019)'
        ],
        pastSurgeries: [
          'Appendectomy (2010)',
          'Right knee arthroscopy (2008)'
        ],
        hospitalizations: [
          'Hospitalized for MS diagnosis workup (2015, 5 days)',
          'Hospitalized for severe MS flare (2019, 3 days)'
        ],
        medicalPrecautions: 'Heat sensitivity due to MS; avoid activities that increase core temperature',
        familyMedicalHistory: 'Father with hypertension, mother with rheumatoid arthritis',
        recentLabwork: 'CBC, comprehensive metabolic panel, and liver function tests within normal limits (January 2025)',
        visionHearing: 'Wears glasses for mild myopia; hearing intact',
        medicalEquipment: 'Uses cane for outdoor mobility during symptom flares'
      };
      
    case 'symptoms-assessment':
      return {
        primarySymptoms: [
          'Fatigue',
          'Lower extremity weakness',
          'Intermittent pain',
          'Balance difficulties',
          'Occasional cognitive issues'
        ],
        painLevel: '4/10 average, 6/10 at worst',
        painLocations: [
          'Lower back (constant, dull)',
          'Right leg (intermittent, sharp with activity)'
        ],
        painPatterns: 'Worse in afternoons and after physical activity; improves with rest and mild stretching',
        painManagement: 'Ibuprofen, heat therapy, rest breaks, gentle stretching',
        fatigue: 'Moderate; energy levels highest in morning, significant decline after noon',
        fatigueImpact: 'Limits work hours; requires afternoon rest period; reduces evening social activities',
        fatigueManagement: 'Scheduled rest periods, work from home arrangement, energy conservation techniques',
        sleepPatterns: 'Difficulty falling asleep; wakes 2-3 times nightly; averages 6 hours sleep',
        sleepImpact: 'Morning grogginess, increased daytime fatigue, occasional irritability',
        balance: 'Occasional loss of balance, especially when turning or in dim lighting',
        dizziness: 'Mild lightheadedness when standing quickly; no vertigo',
        sensorySymptoms: 'Intermittent numbness/tingling in fingertips and feet',
        cognition: 'Occasional word-finding difficulties; mild short-term memory issues; difficulty multitasking during fatigue periods',
        moodSymptoms: 'Mild depression; occasional anxiety about disease progression',
        symptomVariability: 'Symptoms worse with heat, stress, and fatigue; better with rest and cool environments',
        recentChanges: 'Increased fatigue and right leg weakness over past 3 weeks'
      };
      
    case 'functional-status':
      return {
        mobilityStatus: 'Independent household ambulation; uses cane for community distances > 400m',
        gaitPattern: 'Mildly widened base of support; right foot drop with fatigue',
        transferStatus: 'Independent in all transfers',
        standingTolerance: 'Limited to 15-20 minutes before fatigue',
        sittingTolerance: 'Can maintain 60-90 minutes with position changes',
        walkingDistance: '400m without assistive device; 800m with cane',
        stairManagement: 'Able to manage 8-10 stairs with handrail; increased effort and slower pace',
        balance: 'Berg Balance Scale score: 48/56 (mild impairment)',
        fallHistory: 'Two falls in past 6 months; both during MS symptom flares',
        upperExtremityFunction: 'Full active range of motion; mild weakness in fine motor skills when fatigued',
        grip: 'Right: 32 kg, Left: 30 kg (within normal limits)',
        dexterity: 'Mild slowing of fine motor tasks when fatigued; able to manage buttons, zippers',
        coordination: 'Occasional mild intention tremor in right hand with fatigue',
        strength: 'Upper extremities 5/5 throughout; lower extremities 4+/5 left, 4/5 right',
        endurance: 'Moderate limitation; requires rest after 30 minutes of activity',
        posture: 'Mildly stooped with slight forward head position when fatigued',
        sensoryFunction: 'Decreased light touch and proprioception in feet bilaterally',
        visualPerception: 'Intact',
        functionalLimitations: 'Difficulty with prolonged standing tasks, stair climbing, and activities requiring sustained attention during fatigue periods'
      };
      
    case 'typical-day':
      return {
        wakeTime: '6:30 AM on weekdays, 7:30 AM on weekends',
        morningRoutine: 'Wakes at 6:30 AM, completes self-care independently but at slower pace (approximately 45 minutes for shower and dressing), prepares simple breakfast, takes medications',
        morningActivities: 'Begins work from home at 8:00 AM, takes short breaks every 60-90 minutes',
        lunchRoutine: 'Takes 45-minute lunch break, prepares simple meal or leftovers',
        afternoonActivities: 'Continues work until 2:30 PM, takes scheduled 30-minute rest period, completes lighter work tasks until 4:00 PM',
        afternoonRest: 'Lies down from 2:30-3:00 PM to manage fatigue',
        eveningRoutine: 'Spouse assists with dinner preparation, eats dinner at 6:00 PM, engages in quiet leisure activities (reading, television)',
        bedtimeRoutine: 'Begins bedtime routine at 9:30 PM, including medications and self-care, in bed by 10:00 PM',
        weekdayDifferences: 'More structured schedule with work responsibilities',
        weekendDifferences: 'More rest periods, social activities in mornings when energy is highest',
        challengingActivities: 'Meal preparation while standing, household chores requiring sustained effort, evening social events',
        energyPatterns: 'Highest energy in morning, significant decline after 2:00 PM',
        assistanceNeeded: 'Independent in most activities; spouse assists with meal preparation, laundry, and heavier household tasks',
        adaptationsUsed: 'Shower chair, planned rest periods, work from home arrangement, prioritization of tasks based on energy levels',
        satisfactionWithRoutine: 'Generally satisfied but wishes for more energy for evening activities and social events'
      };
      
    case 'environmental-assessment':
      return {
        homeType: 'Single-level ranch home, approximately 1,800 square feet',
        homeAccess: 'Three 6-inch steps at front entrance with single handrail on right; level entry through garage',
        driveway: 'Paved driveway with slight incline',
        entryway: 'Clear path, adequate lighting, door width 36 inches',
        flooring: 'Hardwood in main living areas, low-pile carpet in bedrooms, tile in bathrooms',
        thresholds: 'Flat transitions between flooring surfaces',
        hazards: 'Three area rugs without non-slip backing in living room and hallway',
        hallways: 'Width 42 inches, clear of obstacles',
        lighting: 'Adequate in main areas; dim in hallway at night',
        bathroomAccessibility: 'Master bathroom: standard tub/shower combo with glass door, toilet height 15 inches, sink with cabinet underneath. Guest bathroom: step-in shower with 4-inch threshold, toilet height 15 inches',
        bathroomSafety: 'No grab bars installed; non-slip mat in shower',
        bathroomModifications: 'Shower chair being used in master bathroom',
        kitchenAccessibility: 'Standard height counters (36 inches), upper cabinets at 72 inches, side-by-side refrigerator, electric stove',
        kitchenSafety: 'Good lighting, adequate clear floor space',
        bedroomAccessibility: 'Queen bed at 25-inch height, adequate clearance around bed (36 inches on three sides)',
        bedroomSafety: 'Nightstand with adequate lighting, clear pathway to bathroom',
        laundryAccessibility: 'Front-loading washer and dryer in utility room off kitchen, standard height',
        stairsPresent: 'No interior stairs; three exterior entry steps',
        emergencyEgress: 'Clear paths to front and back doors',
        neighborhoodAccessibility: 'Suburban neighborhood, limited sidewalks, must drive to access community services',
        communityAccess: 'Drives personal vehicle independently for community access',
        homeModifications: 'None currently in place except shower chair',
        workEnvironment: 'Home office in spare bedroom: adjustable desk chair, standard height desk, dual monitor setup'
      };
      
    case 'activities-daily-living':
      return {
        bathing: 'Independent using shower chair; requires 30% more time than prior to diagnosis',
        bathingChallenges: 'Fatigue with upper body washing; difficulty with lower extremity washing due to balance',
        bathingEquipment: 'Uses shower chair and handheld shower attachment',
        grooming: 'Independent in all grooming tasks; performs seated at bathroom sink',
        groomingChallenges: 'Fine motor tasks (styling hair, nail care) more difficult when fatigued',
        dressing: 'Independent but requires 25% more time than prior to diagnosis',
        dressingChallenges: 'Difficulty with lower body dressing, especially socks and shoes; balance challenges when standing to dress',
        dressingAdaptations: 'Sits for lower body dressing; uses sock aid occasionally; prefers slip-on shoes',
        toileting: 'Independent in all aspects',
        toiletingChallenges: 'Occasional urgency; plans bathroom access when in community',
        feeding: 'Independent in all aspects',
        feedingChallenges: 'Occasional mild hand tremor affects liquid handling when very fatigued',
        mealPreparation: 'Independent with simple meals; spouse assists with complex meals and dinner preparation',
        mealPrepChallenges: 'Standing tolerance limits meal preparation to 15-20 minutes; fatigue with chopping and multi-step recipes',
        mealPrepAdaptations: 'Uses seated workstation for some tasks; pre-cuts vegetables in morning; uses prepared ingredients',
        homeManagement: 'Manages light housekeeping; spouse handles heavier tasks (vacuuming, laundry, taking out trash)',
        homeManagementChallenges: 'Limited endurance for sustained housework; difficulty with tasks requiring bending and lifting',
        financialManagement: 'Independent with bill paying and financial tasks; uses online banking',
        shopping: 'Independent with grocery shopping for small trips; uses online ordering for large orders',
        shoppingChallenges: 'Fatigue with lengthy shopping trips; difficulty carrying multiple or heavy items',
        medication: 'Independent with medication management; uses weekly pill organizer',
        communication: 'Independent with phone, email, and computer use',
        transportationStatus: 'Drives independently for local trips (< 30 minutes); avoids driving when fatigued',
        transportationChallenges: 'Fatigue with longer drives; avoids driving in bad weather or at night',
        communityMobility: 'Uses cane for longer community distances; plans rest breaks for extended outings',
        socialActivities: 'Participates in weekly book club and occasional dinner with friends; prefers morning/early afternoon activities',
        hobbies: 'Reading, photography, computer gaming',
        hobbyAdaptations: 'Rotates activities based on fatigue; uses adaptive photographic equipment (lighter weight)'
      };
      
    case 'attendant-care':
      return {
        currentCareProviders: 'Spouse provides assistance with meal preparation, laundry, and heavier housekeeping tasks',
        formalServices: 'No formal attendant care services currently in place',
        currentCareSchedule: 'Informal assistance; spouse works from home 3 days/week and provides help as needed',
        currentCareHours: 'Approximately 6-8 hours weekly of informal assistance from spouse',
        selfCareNeeds: 'Independent in basic self-care; requires additional time and occasional setup assistance when fatigued',
        mobilityNeeds: 'Uses cane for community mobility; independent in home',
        householdNeeds: 'Requires assistance with vacuuming, laundry, taking out trash, and other tasks requiring sustained effort or lifting',
        mealNeeds: 'Assistance with dinner preparation and complex meals; independent with breakfast and simple lunch preparation',
        healthcareNeeds: 'Independent with medication management; needs transportation to medical appointments when fatigued',
        safetyRisks: 'Fall risk particularly when fatigued; heat sensitivity that can worsen symptoms',
        caregiverStress: 'Spouse reports mild stress balancing work and caregiving responsibilities',
        caregiverTraining: 'No formal training; spouse has learned through experience and information from healthcare providers',
        recommendedCareLevel: 'Recommend 8 hours weekly of formal attendant care services to supplement spouse assistance and reduce caregiver burden',
        recommendedCareSchedule: 'Two 4-hour sessions weekly, focused on housekeeping, meal preparation, and laundry',
        justification: 'Client demonstrates good independence in self-care but has limited endurance for household tasks. Formal assistance would maintain home environment, reduce client fatigue, and decrease caregiver burden.',
        futureConsiderations: 'Care needs may increase during MS flares; plan should include contingency for additional hours during symptom exacerbations'
      };
      
    default:
      return {
        note: 'No specific sample data available for this section',
        basicInfo: 'John Smith, 45-year-old male with multiple sclerosis',
        generalStatus: 'Independent with most self-care but requires assistance with some household tasks',
        generalLimitations: 'Fatigue, balance difficulties, and occasional cognitive issues impact daily function'
      };
  }
}

/**
 * Get a sample dataset with varying completeness (for testing quality handling of incomplete data)
 */
export function getPartialSampleData(sectionId: string, completeness: 'high' | 'medium' | 'low'): any {
  // Get the full sample data
  const fullData = getSampleData(sectionId);
  
  // Create a new object to hold partial data
  const partialData: Record<string, any> = {};
  
  // Get all keys from the full data
  const keys = Object.keys(fullData);
  
  // Determine how many keys to include based on completeness level
  let keyPercentage = 0;
  switch (completeness) {
    case 'high':
      keyPercentage = 0.8; // Include 80% of data
      break;
    case 'medium':
      keyPercentage = 0.5; // Include 50% of data
      break;
    case 'low':
      keyPercentage = 0.3; // Include 30% of data
      break;
  }
  
  // Calculate how many keys to include
  const keysToInclude = Math.round(keys.length * keyPercentage);
  
  // Randomly select keys to include
  const selectedKeys = keys
    .sort(() => 0.5 - Math.random()) // Shuffle keys
    .slice(0, keysToInclude); // Take the first keysToInclude keys
  
  // Copy selected data to partial data object
  selectedKeys.forEach(key => {
    partialData[key] = fullData[key];
  });
  
  return partialData;
}

/**
 * Get sample data for special scenarios (to test edge cases)
 */
export function getSpecialCaseData(sectionId: string, scenario: 'contradictory' | 'minimal' | 'complex'): any {
  switch (scenario) {
    case 'contradictory':
      // Create data with internal contradictions to test how LLM handles inconsistent information
      return createContradictoryData(sectionId);
      
    case 'minimal':
      // Create very minimal data to test how LLM handles sparse information
      return createMinimalData(sectionId);
      
    case 'complex':
      // Create complex case data to test how LLM handles unusual or complicated scenarios
      return createComplexData(sectionId);
      
    default:
      return getSampleData(sectionId);
  }
}

/**
 * Create data with internal contradictions for testing
 */
function createContradictoryData(sectionId: string): any {
  const baseData = getSampleData(sectionId);
  
  switch (sectionId) {
    case 'functional-status':
      return {
        ...baseData,
        mobilityStatus: 'Requires wheelchair for all mobility',
        walkingDistance: '1 mile without assistive device', // Contradicts mobility status
        transferStatus: 'Maximum assistance required for all transfers',
        dexterity: 'No limitations in fine motor skills', // Contradicts MS diagnosis implications
        stairManagement: 'Independent with stairs' // Contradicts mobility status
      };
      
    case 'activities-daily-living':
      return {
        ...baseData,
        bathing: 'Requires maximum assistance for bathing',
        bathingChallenges: 'No difficulties with bathing', // Contradicts above
        dressing: 'Independent with all clothing',
        dressingChallenges: 'Unable to manage any fasteners or lower body dressing', // Contradicts above
        mealPreparation: 'Unable to prepare any meals',
        mealPrepAdaptations: 'No adaptations needed for meal preparation' // Contradicts above
      };
      
    default:
      return baseData;
  }
}

/**
 * Create minimal data for testing
 */
function createMinimalData(sectionId: string): any {
  switch (sectionId) {
    case 'initial-assessment':
      return {
        firstName: 'John',
        lastName: 'Smith',
        referralReason: 'Multiple Sclerosis management'
      };
      
    case 'medical-history':
      return {
        primaryDiagnosis: 'Multiple Sclerosis, relapsing-remitting type'
      };
      
    case 'functional-status':
      return {
        mobilityStatus: 'Uses cane intermittently'
      };
      
    default:
      const fullData = getSampleData(sectionId);
      const keys = Object.keys(fullData);
      
      // Just include one key
      if (keys.length > 0) {
        const key = keys[0];
        return { [key]: fullData[key] };
      }
      
      return {};
  }
}

/**
 * Create complex case data for testing
 */
function createComplexData(sectionId: string): any {
  const baseData = getSampleData(sectionId);
  
  switch (sectionId) {
    case 'medical-history':
      return {
        ...baseData,
        primaryDiagnosis: 'Multiple Sclerosis, primary progressive type with recent conversion to relapsing pattern',
        secondaryDiagnoses: [
          ...baseData.secondaryDiagnoses,
          'Neuropathic pain syndrome',
          'Post-COVID fatigue syndrome',
          'Irritable bowel syndrome',
          'Fibromyalgia',
          'Migraines with visual aura'
        ],
        currentMedications: [
          ...baseData.currentMedications,
          'Gabapentin 300mg TID',
          'Amitriptyline 25mg QHS',
          'Sumatriptan 50mg PRN',
          'Baclofen 10mg TID',
          'Modafinil 200mg QAM',
          'Vitamin D 5000 IU daily',
          'CoQ10 200mg daily',
          'Alpha-lipoic acid 600mg daily'
        ],
        medicalComplexities: 'Conflicting medication side effects; multiple specialist involvement with limited coordination; difficulty determining symptom etiology between overlapping conditions'
      };
      
    case 'attendant-care':
      return {
        ...baseData,
        currentCareProviders: 'Spouse (primary), adult daughter (weekend support), neighbor (emergency backup)',
        caregiverComplexities: 'Spouse has recent back injury limiting lifting capacity; daughter lives 45 minutes away; complex caregiving schedule requiring coordination across multiple providers',
        careScheduleVariations: 'Weekday mornings: spouse assists before work; Weekday afternoons: client independent with rest periods; Weekday evenings: spouse assists after work; Weekends: daughter provides 4-6 hours Saturday; Spouse provides remaining weekend care',
        recommendedCareLevel: 'Tiered approach: 12 hours/week baseline with increase to 20 hours during symptom flares',
        specialConsiderations: 'Client has complex medication regimen requiring oversight; heat sensitivity requires specialized environmental management; cognitive fluctuations necessitate variable supervision levels throughout the day'
      };
      
    default:
      return baseData;
  }
}
