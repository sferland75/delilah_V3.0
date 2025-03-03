/**
 * Cross-Section Validator
 * 
 * This service validates data across different assessment sections to identify
 * inconsistencies and potential errors in extracted data.
 */

export interface ValidationResult {
  isValid: boolean;
  section: string;
  field?: string;
  message: string;
  severity: 'low' | 'medium' | 'high';
  suggestedFix?: any;
}

export class CrossSectionValidator {
  /**
   * Validate extracted data across different sections
   * @param extractedData The extracted assessment data
   * @returns Array of validation results
   */
  validateData(extractedData: any): ValidationResult[] {
    if (!extractedData) return [];
    
    const results: ValidationResult[] = [];
    
    // Demographic and medical history consistency
    this.validateDemographicsWithMedical(extractedData, results);
    
    // Symptoms and functional status consistency
    this.validateSymptomsWithFunctional(extractedData, results);
    
    // Typical day and ADLs consistency
    this.validateTypicalDayWithADLs(extractedData, results);
    
    // Functional status and attendant care consistency
    this.validateFunctionalWithAttendantCare(extractedData, results);
    
    return results;
  }
  
  /**
   * Validate demographic data with medical history
   */
  private validateDemographicsWithMedical(data: any, results: ValidationResult[]): void {
    const demographics = data.demographics;
    const medicalHistory = data.pastMedicalHistory || data.medicalHistory;
    
    if (!demographics || !medicalHistory) return;
    
    // Check age against conditions
    if (demographics.personalInfo?.dateOfBirth) {
      const age = this.calculateAge(demographics.personalInfo.dateOfBirth);
      
      if (age > 0 && medicalHistory.conditions && medicalHistory.conditions.length > 0) {
        // Find age-inappropriate conditions
        const conditions = medicalHistory.conditions.map((c: any) => 
          typeof c === 'string' ? c : c.condition);
        
        const ageInappropriateConditions = this.findAgeInappropriateConditions(age, conditions);
        
        if (ageInappropriateConditions.length > 0) {
          results.push({
            isValid: false,
            section: 'medicalHistory',
            field: 'conditions',
            message: `Some medical conditions may be inconsistent with the patient's age (${age}): ${ageInappropriateConditions.join(', ')}`,
            severity: 'medium',
            suggestedFix: {
              action: 'verify',
              conditions: ageInappropriateConditions
            }
          });
        }
      }
    }
  }
  
  /**
   * Validate symptoms with functional status
   */
  private validateSymptomsWithFunctional(data: any, results: ValidationResult[]): void {
    const symptoms = data.symptoms;
    const functionalStatus = data.functionalStatus;
    
    if (!symptoms || !functionalStatus) return;
    
    // Check mobility symptoms against functional mobility limitations
    const physicalSymptoms = symptoms.physical || [];
    const mobilityLimitations = functionalStatus.mobility?.limitations || [];
    
    const mobilitySymptoms = physicalSymptoms.filter((s: any) => {
      const symptomName = typeof s === 'string' ? s : s.symptom;
      return this.isRelatedToMobility(symptomName);
    });
    
    // If mobility symptoms exist but no mobility limitations are recorded
    if (mobilitySymptoms.length > 0 && mobilityLimitations.length === 0) {
      results.push({
        isValid: false,
        section: 'functionalStatus',
        field: 'mobility.limitations',
        message: 'Patient reports mobility-related symptoms but no mobility limitations are documented',
        severity: 'high',
        suggestedFix: {
          action: 'add',
          field: 'mobility.limitations',
          value: mobilitySymptoms.map((s: any) => 
            `Limitation due to ${typeof s === 'string' ? s : s.symptom}`)
        }
      });
    }
    
    // Check for pain symptoms but no pain location
    const painSymptoms = physicalSymptoms.filter((s: any) => {
      const symptomName = typeof s === 'string' ? s : s.symptom;
      return symptomName.toLowerCase().includes('pain');
    });
    
    if (painSymptoms.length > 0) {
      painSymptoms.forEach((symptom: any) => {
        const painSymptom = typeof symptom === 'string' ? symptom : symptom.symptom;
        if (!symptom.location && !symptom.area) {
          results.push({
            isValid: false,
            section: 'symptoms',
            field: 'physical',
            message: `Pain symptom "${painSymptom}" has no location specified`,
            severity: 'medium',
            suggestedFix: {
              action: 'complete',
              field: 'physical.location',
              symptom: painSymptom
            }
          });
        }
      });
    }
  }
  
  /**
   * Validate typical day with ADLs
   */
  private validateTypicalDayWithADLs(data: any, results: ValidationResult[]): void {
    const typicalDay = data.typicalDay;
    const adls = data.adls;
    
    if (!typicalDay || !adls) return;
    
    // Check morning routines against bathing ADL
    const morningRoutines = typicalDay.morning?.routines || [];
    const bathingAdl = adls.basic?.bathing;
    
    const hasBathingRoutine = morningRoutines.some((r: string) => 
      this.isRelatedToBathing(r)
    );
    
    if (hasBathingRoutine && bathingAdl && bathingAdl.level === 'dependent') {
      results.push({
        isValid: false,
        section: 'adls',
        field: 'basic.bathing.level',
        message: 'Typical day includes independent showering/bathing but ADL assessment shows dependent bathing',
        severity: 'medium',
        suggestedFix: {
          action: 'change',
          field: 'basic.bathing.level',
          value: 'modified_independent',
          reason: 'Morning routine indicates some bathing independence'
        }
      });
    }
    
    // Check meal preparation
    const allRoutines = [
      ...(typicalDay.morning?.routines || []),
      ...(typicalDay.afternoon?.routines || []),
      ...(typicalDay.evening?.routines || [])
    ];
    
    const hasMealPrep = allRoutines.some((r: string) => 
      this.isRelatedToMealPrep(r)
    );
    
    const mealPrepAdl = adls.instrumental?.mealPrep;
    
    if (hasMealPrep && mealPrepAdl && mealPrepAdl.level === 'dependent') {
      results.push({
        isValid: false,
        section: 'adls',
        field: 'instrumental.mealPrep.level',
        message: 'Typical day includes meal preparation but ADL assessment shows dependent meal preparation',
        severity: 'medium',
        suggestedFix: {
          action: 'change',
          field: 'instrumental.mealPrep.level',
          value: 'modified_independent',
          reason: 'Daily routine indicates some meal preparation independence'
        }
      });
    }
  }
  
  /**
   * Validate functional status with attendant care
   */
  private validateFunctionalWithAttendantCare(data: any, results: ValidationResult[]): void {
    const functionalStatus = data.functionalStatus;
    const attendantCare = data.attendantCare;
    const adls = data.adls; // Get ADLs from the data parameter
    
    if (!functionalStatus || !attendantCare) return;
    
    // Check functional mobility limitations against attendant care needs
    const mobilityLimitations = functionalStatus.mobility?.limitations || [];
    const selfCareNeeds = attendantCare.selfCare?.needs || [];
    
    const hasSevereMobilityLimitations = mobilityLimitations.some((limitation: string) =>
      limitation.toLowerCase().includes('unable') ||
      limitation.toLowerCase().includes('severe') ||
      limitation.toLowerCase().includes('dependent')
    );
    
    const hasMobilitySupport = selfCareNeeds.some((need: string) =>
      need.toLowerCase().includes('mobility') ||
      need.toLowerCase().includes('walking') ||
      need.toLowerCase().includes('transfer')
    );
    
    if (hasSevereMobilityLimitations && !hasMobilitySupport) {
      results.push({
        isValid: false,
        section: 'attendantCare',
        field: 'selfCare.needs',
        message: 'Patient has severe mobility limitations but no mobility assistance is listed in attendant care needs',
        severity: 'high',
        suggestedFix: {
          action: 'add',
          field: 'selfCare.needs',
          value: 'Assistance with mobility and transfers'
        }
      });
    }
    
    // Check if assistance hours seem insufficient for documented limitations
    // Only perform this check if ADLs data is available
    if (adls) {
      const totalLimitations = (
        (functionalStatus.mobility?.limitations?.length || 0) +
        Object.keys(adls?.basic || {}).filter(k => 
          adls.basic[k]?.level === 'dependent' || 
          adls.basic[k]?.level === 'maximal_assistance'
        ).length
      );
      
      const totalHours = (
        (attendantCare.selfCare?.hours || 0) +
        (attendantCare.homecare?.hours || 0) +
        (attendantCare.supervision?.hours || 0)
      );
      
      if (totalLimitations > 5 && totalHours < 4) {
        results.push({
          isValid: false,
          section: 'attendantCare',
          message: 'Patient has multiple functional limitations but recommended attendant care hours appear insufficient',
          severity: 'medium',
          suggestedFix: {
            action: 'review',
            reason: 'Consider increasing recommended hours based on documented limitations'
          }
        });
      }
    }
  }
  
  /**
   * Calculate age from date of birth
   */
  private calculateAge(dob: string): number {
    if (!dob) return 0;
    
    try {
      const birthDate = new Date(dob);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      
      return age;
    } catch (e) {
      return 0;
    }
  }
  
  /**
   * Find conditions that are inappropriate for the patient's age
   */
  private findAgeInappropriateConditions(age: number, conditions: string[]): string[] {
    if (!conditions || !Array.isArray(conditions)) return [];
    
    const inappropriate: string[] = [];
    
    conditions.forEach(condition => {
      const conditionLower = condition.toLowerCase();
      
      // Age-specific condition checks
      if (age < 10 && conditionLower.includes('dementia')) {
        inappropriate.push(condition);
      }
      
      if (age < 40 && (
        conditionLower.includes('alzheimer') || 
        conditionLower.includes('parkinson')
      )) {
        inappropriate.push(condition);
      }
      
      if (age > 80 && conditionLower.includes('juvenile')) {
        inappropriate.push(condition);
      }
      
      if (age < 30 && conditionLower.includes('osteoarthritis')) {
        inappropriate.push(condition);
      }
    });
    
    return inappropriate;
  }
  
  /**
   * Check if a symptom is related to mobility
   */
  private isRelatedToMobility(symptom: string): boolean {
    if (!symptom) return false;
    
    const mobilityTerms = [
      'walk', 'mobility', 'balance', 'gait', 'stand', 'falls', 
      'ambulat', 'transfer', 'leg', 'foot', 'feet', 'knee'
    ];
    
    const symptomLower = symptom.toLowerCase();
    return mobilityTerms.some(term => symptomLower.includes(term));
  }
  
  /**
   * Check if a routine is related to bathing
   */
  private isRelatedToBathing(routine: string): boolean {
    if (!routine) return false;
    
    const bathingTerms = [
      'shower', 'bath', 'wash', 'hygiene', 'clean'
    ];
    
    const routineLower = routine.toLowerCase();
    return bathingTerms.some(term => routineLower.includes(term));
  }
  
  /**
   * Check if a routine is related to meal preparation
   */
  private isRelatedToMealPrep(routine: string): boolean {
    if (!routine) return false;
    
    const mealPrepTerms = [
      'cook', 'prepare', 'meal', 'breakfast', 'lunch', 'dinner',
      'supper', 'food', 'kitchen'
    ];
    
    const routineLower = routine.toLowerCase();
    return mealPrepTerms.some(term => routineLower.includes(term));
  }
}