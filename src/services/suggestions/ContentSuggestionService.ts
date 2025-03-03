/**
 * Content Suggestion Service
 * 
 * This service generates intelligent suggestions to improve assessment data
 * based on patterns, field relationships, and domain knowledge.
 */

export interface ContentSuggestion {
  id: string;
  section: string;
  field: string;
  currentValue: any;
  suggestedValue: any;
  confidence: number;
  reason: string;
  source: 'pattern' | 'relationship' | 'domain';
}

export class ContentSuggestionService {
  /**
   * Generate suggestions for improving extracted data
   * @param extractedData The extracted assessment data
   * @returns Array of content suggestions
   */
  generateSuggestions(extractedData: any): ContentSuggestion[] {
    if (!extractedData) return [];
    
    const suggestions: ContentSuggestion[] = [];
    
    // Generate demographic suggestions
    this.generateDemographicSuggestions(extractedData, suggestions);
    
    // Generate medical history suggestions
    this.generateMedicalHistorySuggestions(extractedData, suggestions);
    
    // Generate symptoms suggestions
    this.generateSymptomsSuggestions(extractedData, suggestions);
    
    // Generate functional status suggestions
    this.generateFunctionalStatusSuggestions(extractedData, suggestions);
    
    // Generate typical day suggestions
    this.generateTypicalDaySuggestions(extractedData, suggestions);
    
    // Generate ADL suggestions
    this.generateADLSuggestions(extractedData, suggestions);
    
    // Generate attendant care suggestions
    this.generateAttendantCareSuggestions(extractedData, suggestions);
    
    return suggestions;
  }
  
  /**
   * Generate demographic suggestions
   */
  private generateDemographicSuggestions(data: any, suggestions: ContentSuggestion[]): void {
    const demographics = data.demographics;
    if (!demographics) return;
    
    const personalInfo = demographics.personalInfo || {};
    
    // Suggest province/state based on postal code
    if (!personalInfo.province && personalInfo.postalCode) {
      const suggestedProvince = this.inferProvinceFromPostalCode(personalInfo.postalCode);
      if (suggestedProvince) {
        suggestions.push({
          id: `demo-province-${Date.now()}`,
          section: 'demographics',
          field: 'personalInfo.province',
          currentValue: personalInfo.province || '',
          suggestedValue: suggestedProvince,
          confidence: 0.85,
          reason: 'Inferred from postal code pattern',
          source: 'pattern'
        });
      }
    }
    
    // Extract city from address if address contains city but city field is empty
    if (personalInfo.address && !personalInfo.city) {
      const suggestedCity = this.extractCityFromAddress(personalInfo.address);
      if (suggestedCity) {
        suggestions.push({
          id: `demo-city-${Date.now()}`,
          section: 'demographics',
          field: 'personalInfo.city',
          currentValue: personalInfo.city || '',
          suggestedValue: suggestedCity,
          confidence: 0.7,
          reason: 'Extracted from address string',
          source: 'pattern'
        });
      }
    }
  }
  
  /**
   * Generate medical history suggestions
   */
  private generateMedicalHistorySuggestions(data: any, suggestions: ContentSuggestion[]): void {
    const medicalHistory = data.pastMedicalHistory || data.medicalHistory;
    if (!medicalHistory) return;
    
    const symptoms = data.symptoms;
    
    // Suggest conditions based on symptoms if no conditions are provided
    if (symptoms && symptoms.physical && 
        (!medicalHistory.conditions || medicalHistory.conditions.length === 0)) {
      
      const suggestedConditions = this.inferConditionsFromSymptoms(symptoms.physical);
      
      if (suggestedConditions.length > 0) {
        suggestions.push({
          id: `med-conditions-${Date.now()}`,
          section: 'medicalHistory',
          field: 'conditions',
          currentValue: medicalHistory.conditions || [],
          suggestedValue: suggestedConditions.map(condition => ({
            condition,
            diagnosisDate: '',
            currentStatus: 'Active',
            notes: 'Suggested based on reported symptoms'
          })),
          confidence: 0.6,
          reason: 'Inferred from reported symptoms',
          source: 'relationship'
        });
      }
    }
  }
  
  /**
   * Generate symptoms suggestions
   */
  private generateSymptomsSuggestions(data: any, suggestions: ContentSuggestion[]): void {
    const symptoms = data.symptoms;
    if (!symptoms) return;
    
    // If only physical symptoms exist, but patient likely has psychological symptoms too
    if (symptoms.physical && symptoms.physical.length > 0 && 
        (!symptoms.cognitive || symptoms.cognitive.length === 0) &&
        (!symptoms.emotional || symptoms.emotional.length === 0)) {
      
      // Check for conditions that commonly have psychological components
      const medicalHistory = data.pastMedicalHistory || data.medicalHistory;
      if (medicalHistory && medicalHistory.conditions) {
        const conditions = medicalHistory.conditions.map((c: any) => 
          typeof c === 'string' ? c.toLowerCase() : c.condition.toLowerCase()
        );
        
        const hasTraumaticCondition = conditions.some((c: string) => 
          c.includes('trauma') || 
          c.includes('concussion') || 
          c.includes('accident') ||
          c.includes('ptsd')
        );
        
        if (hasTraumaticCondition) {
          // Suggest common cognitive symptoms
          suggestions.push({
            id: `symp-cognitive-${Date.now()}`,
            section: 'symptoms',
            field: 'cognitive',
            currentValue: symptoms.cognitive || [],
            suggestedValue: [
              { symptom: 'Memory difficulties', severity: '', frequency: '', impact: 'Moderate', notes: 'Common with traumatic injuries' },
              { symptom: 'Difficulty concentrating', severity: '', frequency: '', impact: 'Moderate', notes: 'Common with traumatic injuries' }
            ],
            confidence: 0.65,
            reason: 'Patients with traumatic injuries often experience cognitive symptoms',
            source: 'domain'
          });
        }
      }
    }
  }
  
  /**
   * Generate functional status suggestions
   */
  private generateFunctionalStatusSuggestions(data: any, suggestions: ContentSuggestion[]): void {
    const functionalStatus = data.functionalStatus;
    if (!functionalStatus) return;
    
    // If mobility status doesn't have limitations but symptoms suggest limitations
    if (functionalStatus.mobility && (!functionalStatus.mobility.limitations || functionalStatus.mobility.limitations.length === 0)) {
      const symptoms = data.symptoms;
      
      if (symptoms && symptoms.physical) {
        const mobilitySymptoms = symptoms.physical.filter((s: any) => {
          const symptomName = typeof s === 'string' ? s : s.symptom;
          return this.isRelatedToMobility(symptomName);
        });
        
        if (mobilitySymptoms.length > 0) {
          const suggestedLimitations = mobilitySymptoms.map((s: any) => {
            const symptom = typeof s === 'string' ? s : s.symptom;
            return `Limited due to ${symptom}`;
          });
          
          suggestions.push({
            id: `func-limitations-${Date.now()}`,
            section: 'functionalStatus',
            field: 'mobility.limitations',
            currentValue: functionalStatus.mobility.limitations || [],
            suggestedValue: suggestedLimitations,
            confidence: 0.7,
            reason: 'Based on reported mobility-related symptoms',
            source: 'relationship'
          });
        }
      }
    }
  }
  
  /**
   * Generate typical day suggestions
   */
  private generateTypicalDaySuggestions(data: any, suggestions: ContentSuggestion[]): void {
    const typicalDay = data.typicalDay;
    const adls = data.adls;
    
    if (!typicalDay || !adls) return;
    
    // If typical day doesn't mention bathing but ADLs indicate bathing is performed
    const morningRoutines = typicalDay.morning?.routines || [];
    const hasBathingInRoutine = morningRoutines.some((r: string) => this.isRelatedToBathing(r));
    
    if (!hasBathingInRoutine && adls.basic?.bathing) {
      const bathingLevel = adls.basic.bathing.level;
      
      if (bathingLevel && bathingLevel !== 'dependent') {
        const suggestedRoutine = bathingLevel === 'independent' 
          ? 'Takes shower independently'
          : 'Takes shower with assistance';
        
        suggestions.push({
          id: `typical-morning-${Date.now()}`,
          section: 'typicalDay',
          field: 'morning.routines',
          currentValue: morningRoutines,
          suggestedValue: [...morningRoutines, suggestedRoutine],
          confidence: 0.8,
          reason: 'ADLs indicate bathing activity not reflected in morning routine',
          source: 'relationship'
        });
      }
    }
  }
  
  /**
   * Generate ADL suggestions
   */
  private generateADLSuggestions(data: any, suggestions: ContentSuggestion[]): void {
    const adls = data.adls;
    if (!adls) return;
    
    // Check for consistency with symptoms
    const symptoms = data.symptoms;
    if (symptoms && symptoms.physical) {
      // Upper extremity symptoms should affect self-care ADLs
      const upperExtremitySymptoms = symptoms.physical.filter((s: any) => {
        const symptomName = typeof s === 'string' ? s : s.symptom;
        return this.isRelatedToUpperExtremity(symptomName);
      });
      
      if (upperExtremitySymptoms.length > 0) {
        // Check bathing ADL
        if (!adls.basic?.bathing || adls.basic.bathing.level === 'independent' || adls.basic.bathing.level === 'unknown') {
          suggestions.push({
            id: `adl-bathing-${Date.now()}`,
            section: 'adls',
            field: 'basic.bathing',
            currentValue: adls.basic?.bathing || { level: 'unknown', notes: '' },
            suggestedValue: { 
              level: 'modified_independent', 
              notes: 'Upper extremity symptoms likely affect bathing' 
            },
            confidence: 0.7,
            reason: 'Upper extremity symptoms typically impact bathing activities',
            source: 'relationship'
          });
        }
      }
    }
  }
  
  /**
   * Generate attendant care suggestions
   */
  private generateAttendantCareSuggestions(data: any, suggestions: ContentSuggestion[]): void {
    const attendantCare = data.attendantCare;
    if (!attendantCare) return;
    
    // Check for needed self-care support based on ADLs
    const adls = data.adls;
    
    if (adls && adls.basic) {
      const dependentAdls = Object.entries(adls.basic).filter(([_, details]: [string, any]) => 
        details.level === 'dependent' || 
        details.level === 'maximal_assistance'
      );
      
      if (dependentAdls.length > 0 && 
          (!attendantCare.selfCare?.needs || attendantCare.selfCare.needs.length === 0)) {
        
        const suggestedNeeds = dependentAdls.map(([adl, _]: [string, any]) => 
          `Assistance with ${adl}`
        );
        
        suggestions.push({
          id: `care-selfcare-${Date.now()}`,
          section: 'attendantCare',
          field: 'selfCare.needs',
          currentValue: attendantCare.selfCare?.needs || [],
          suggestedValue: suggestedNeeds,
          confidence: 0.8,
          reason: 'Dependent ADLs require attendant care support',
          source: 'relationship'
        });
      }
    }
  }
  
  /**
   * Infer province from postal code
   */
  private inferProvinceFromPostalCode(postalCode: string): string | null {
    if (!postalCode) return null;
    
    // Canadian postal code pattern
    const firstLetter = postalCode.trim().charAt(0).toUpperCase();
    if (/^[A-Z]\d[A-Z] ?\d[A-Z]\d$/.test(postalCode.trim())) {
      const provinceMap: {[key: string]: string} = {
        'A': 'Newfoundland and Labrador',
        'B': 'Nova Scotia',
        'C': 'Prince Edward Island',
        'E': 'New Brunswick',
        'G': 'Quebec',
        'H': 'Quebec',
        'J': 'Quebec',
        'K': 'Ontario',
        'L': 'Ontario',
        'M': 'Ontario',
        'N': 'Ontario',
        'P': 'Ontario',
        'R': 'Manitoba',
        'S': 'Saskatchewan',
        'T': 'Alberta',
        'V': 'British Columbia',
        'X': 'Northwest Territories or Nunavut',
        'Y': 'Yukon'
      };
      
      return provinceMap[firstLetter] || null;
    }
    
    return null;
  }
  
  /**
   * Extract city from address
   */
  private extractCityFromAddress(address: string): string | null {
    if (!address) return null;
    
    // Simple pattern detection for city in address
    const cityPattern = /(?:,\s+)([A-Za-z\s]+)(?:,\s+[A-Z]{2}|\s+[A-Z][0-9][A-Z]\s+[0-9][A-Z][0-9])/;
    const match = address.match(cityPattern);
    
    return match ? match[1].trim() : null;
  }
  
  /**
   * Infer potential conditions from symptoms
   */
  private inferConditionsFromSymptoms(symptoms: any[]): string[] {
    if (!symptoms || !Array.isArray(symptoms)) return [];
    
    const suggestedConditions: string[] = [];
    const symptomTexts = symptoms.map((s: any) => 
      typeof s === 'string' ? s.toLowerCase() : s.symptom.toLowerCase()
    );
    
    // Simple rule-based condition inference
    const hasHeadache = symptomTexts.some(s => s.includes('headache'));
    const hasDizziness = symptomTexts.some(s => s.includes('dizz'));
    const hasNausea = symptomTexts.some(s => s.includes('nausea'));
    const hasMemoryIssues = symptomTexts.some(s => s.includes('memory'));
    const hasFatigue = symptomTexts.some(s => s.includes('fatigue') || s.includes('tired'));
    const hasBackPain = symptomTexts.some(s => s.includes('back') && s.includes('pain'));
    const hasNeckPain = symptomTexts.some(s => s.includes('neck') && s.includes('pain'));
    
    // Concussion pattern
    if ((hasHeadache && hasDizziness) || (hasHeadache && hasMemoryIssues)) {
      suggestedConditions.push('Post-Concussion Syndrome');
    }
    
    // Whiplash pattern
    if (hasNeckPain && (hasDizziness || hasHeadache)) {
      suggestedConditions.push('Whiplash Associated Disorder');
    }
    
    // Chronic pain pattern
    if ((hasBackPain || hasNeckPain) && hasFatigue) {
      suggestedConditions.push('Chronic Pain Syndrome');
    }
    
    return suggestedConditions;
  }
  
  /**
   * Infer pain location from symptom description
   */
  private inferPainLocationFromSymptom(symptom: string): string {
    if (!symptom) return 'Not specified';
    
    const symptomLower = symptom.toLowerCase();
    
    if (symptomLower.includes('back')) return 'Back';
    if (symptomLower.includes('neck')) return 'Neck';
    if (symptomLower.includes('shoulder')) return 'Shoulder';
    if (symptomLower.includes('knee')) return 'Knee';
    if (symptomLower.includes('hip')) return 'Hip';
    if (symptomLower.includes('head')) return 'Head';
    if (symptomLower.includes('leg')) return 'Leg';
    if (symptomLower.includes('arm')) return 'Arm';
    
    return 'Not specified';
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
   * Check if a symptom is related to upper extremity
   */
  private isRelatedToUpperExtremity(symptom: string): boolean {
    if (!symptom) return false;
    
    const upperExtremityTerms = [
      'arm', 'hand', 'finger', 'wrist', 'elbow', 'shoulder', 'grip'
    ];
    
    const symptomLower = symptom.toLowerCase();
    return upperExtremityTerms.some(term => symptomLower.includes(term));
  }
  
  /**
   * Check if a symptom is related to lower extremity
   */
  private isRelatedToLowerExtremity(symptom: string): boolean {
    if (!symptom) return false;
    
    const lowerExtremityTerms = [
      'leg', 'foot', 'feet', 'ankle', 'knee', 'hip', 'toe'
    ];
    
    const symptomLower = symptom.toLowerCase();
    return lowerExtremityTerms.some(term => symptomLower.includes(term));
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