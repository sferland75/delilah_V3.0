/**
 * Missing Information Detector
 * 
 * This service identifies missing critical information in the assessment data.
 */

export interface MissingInformation {
  id: string;
  section: string;
  field: string;
  importance: 'low' | 'medium' | 'high';
  reason: string;
}

export class MissingInformationDetector {
  /**
   * Detect missing information in the extracted data
   * @param extractedData The extracted assessment data
   * @returns Array of missing information items
   */
  detectMissingInfo(extractedData: any): MissingInformation[] {
    if (!extractedData) return [];
    
    const missing: MissingInformation[] = [];
    
    // Check demographics
    this.checkDemographics(extractedData, missing);
    
    // Check medical history
    this.checkMedicalHistory(extractedData, missing);
    
    // Check symptoms
    this.checkSymptoms(extractedData, missing);
    
    // Check functional status
    this.checkFunctionalStatus(extractedData, missing);
    
    // Check ADLs
    this.checkADLs(extractedData, missing);
    
    // Check attendant care
    this.checkAttendantCare(extractedData, missing);
    
    return missing;
  }
  
  /**
   * Check for missing demographic information
   */
  private checkDemographics(data: any, missing: MissingInformation[]): void {
    const demographics = data.demographics;
    if (!demographics) {
      missing.push({
        id: `missing-demographics-${Date.now()}`,
        section: 'demographics',
        field: '',
        importance: 'high',
        reason: 'Demographics section is required for patient identification'
      });
      return;
    }
    
    const personalInfo = demographics.personalInfo || {};
    
    // Name is required
    if (!personalInfo.firstName || !personalInfo.lastName) {
      missing.push({
        id: `missing-name-${Date.now()}`,
        section: 'demographics',
        field: 'personalInfo.firstName/lastName',
        importance: 'high',
        reason: 'Patient name is a required identifier'
      });
    }
    
    // Date of birth is required
    if (!personalInfo.dateOfBirth) {
      missing.push({
        id: `missing-dob-${Date.now()}`,
        section: 'demographics',
        field: 'personalInfo.dateOfBirth',
        importance: 'high',
        reason: 'Date of birth is required for age calculation and medical context'
      });
    }
    
    // Contact information
    if (!personalInfo.phone && !personalInfo.email) {
      missing.push({
        id: `missing-contact-${Date.now()}`,
        section: 'demographics',
        field: 'personalInfo.phone/email',
        importance: 'medium',
        reason: 'At least one contact method should be documented'
      });
    }
    
    // Address
    if (!personalInfo.address) {
      missing.push({
        id: `missing-address-${Date.now()}`,
        section: 'demographics',
        field: 'personalInfo.address',
        importance: 'medium',
        reason: 'Address is important for home visit planning and environmental context'
      });
    }
  }
  
  /**
   * Check for missing medical history information
   */
  private checkMedicalHistory(data: any, missing: MissingInformation[]): void {
    const medicalHistory = data.pastMedicalHistory || data.medicalHistory;
    
    if (!medicalHistory) {
      missing.push({
        id: `missing-medical-${Date.now()}`,
        section: 'medicalHistory',
        field: '',
        importance: 'high',
        reason: 'Medical history is required for clinical context'
      });
      return;
    }
    
    // Primary diagnosis
    if (!medicalHistory.primaryDiagnosis && 
        !medicalHistory.injuryDetails?.description) {
      missing.push({
        id: `missing-diagnosis-${Date.now()}`,
        section: 'medicalHistory',
        field: 'primaryDiagnosis',
        importance: 'high',
        reason: 'Primary diagnosis or injury description is required for assessment context'
      });
    }
    
    // Check for empty conditions list
    if (!medicalHistory.conditions || medicalHistory.conditions.length === 0) {
      missing.push({
        id: `missing-conditions-${Date.now()}`,
        section: 'medicalHistory',
        field: 'conditions',
        importance: 'medium',
        reason: 'Medical conditions provide important health context'
      });
    }
    
    // Medications
    if (!medicalHistory.medications || medicalHistory.medications.length === 0) {
      missing.push({
        id: `missing-medications-${Date.now()}`,
        section: 'medicalHistory',
        field: 'medications',
        importance: 'medium',
        reason: 'Current medications provide important treatment context'
      });
    }
  }
  
  /**
   * Check for missing symptoms information
   */
  private checkSymptoms(data: any, missing: MissingInformation[]): void {
    const symptoms = data.symptoms;
    
    if (!symptoms) {
      missing.push({
        id: `missing-symptoms-${Date.now()}`,
        section: 'symptoms',
        field: '',
        importance: 'high',
        reason: 'Symptoms section is required for functional assessment'
      });
      return;
    }
    
    // Check for empty symptoms
    if (!symptoms.physical || symptoms.physical.length === 0) {
      missing.push({
        id: `missing-physical-symptoms-${Date.now()}`,
        section: 'symptoms',
        field: 'physical',
        importance: 'high',
        reason: 'Physical symptoms are key to functional assessment'
      });
    }
    
    // For each symptom, check if severity or impact is missing
    if (symptoms.physical && symptoms.physical.length > 0) {
      const symptomsWithoutSeverity = symptoms.physical.filter((s: any) => 
        !s.severity || s.severity === ''
      );
      
      if (symptomsWithoutSeverity.length > 0) {
        missing.push({
          id: `missing-symptom-severity-${Date.now()}`,
          section: 'symptoms',
          field: 'physical.severity',
          importance: 'medium',
          reason: 'Symptom severity is important for understanding impact'
        });
      }
      
      const symptomsWithoutImpact = symptoms.physical.filter((s: any) => 
        !s.impact || s.impact === ''
      );
      
      if (symptomsWithoutImpact.length > 0) {
        missing.push({
          id: `missing-symptom-impact-${Date.now()}`,
          section: 'symptoms',
          field: 'physical.impact',
          importance: 'medium',
          reason: 'Symptom impact on function is a key assessment area'
        });
      }
    }
    
    // Check for cognitive symptoms for certain conditions
    const medicalHistory = data.pastMedicalHistory || data.medicalHistory;
    if (medicalHistory && medicalHistory.conditions) {
      const conditions = medicalHistory.conditions.map((c: any) => 
        typeof c === 'string' ? c.toLowerCase() : c.condition.toLowerCase()
      );
      
      const hasNeurologicalCondition = conditions.some((c: string) => 
        c.includes('brain') || 
        c.includes('neuro') || 
        c.includes('concussion') ||
        c.includes('cognitive') ||
        c.includes('head injury')
      );
      
      if (hasNeurologicalCondition && 
          (!symptoms.cognitive || symptoms.cognitive.length === 0)) {
        missing.push({
          id: `missing-cognitive-symptoms-${Date.now()}`,
          section: 'symptoms',
          field: 'cognitive',
          importance: 'high',
          reason: 'Cognitive symptoms should be documented for neurological conditions'
        });
      }
    }
  }
  
  /**
   * Check for missing functional status information
   */
  private checkFunctionalStatus(data: any, missing: MissingInformation[]): void {
    const functionalStatus = data.functionalStatus;
    
    if (!functionalStatus) {
      missing.push({
        id: `missing-functional-${Date.now()}`,
        section: 'functionalStatus',
        field: '',
        importance: 'high',
        reason: 'Functional status is a core component of OT assessment'
      });
      return;
    }
    
    // Mobility status
    if (!functionalStatus.mobility || !functionalStatus.mobility.ambulation) {
      missing.push({
        id: `missing-mobility-${Date.now()}`,
        section: 'functionalStatus',
        field: 'mobility.ambulation',
        importance: 'high',
        reason: 'Mobility status is fundamental to functional assessment'
      });
    }
    
    // Limitations
    if (functionalStatus.mobility && (!functionalStatus.mobility.limitations || functionalStatus.mobility.limitations.length === 0)) {
      missing.push({
        id: `missing-limitations-${Date.now()}`,
        section: 'functionalStatus',
        field: 'mobility.limitations',
        importance: 'medium',
        reason: 'Functional limitations should be documented when present'
      });
    }
    
    // Assistive devices if mobility issues exist
    if (functionalStatus.mobility && 
        functionalStatus.mobility.ambulation && 
        functionalStatus.mobility.ambulation.toLowerCase().includes('assist') && 
        (!functionalStatus.mobility.assistiveDevices || functionalStatus.mobility.assistiveDevices.length === 0)) {
      missing.push({
        id: `missing-devices-${Date.now()}`,
        section: 'functionalStatus',
        field: 'mobility.assistiveDevices',
        importance: 'medium',
        reason: 'Assistive devices should be documented for patients with mobility assistance'
      });
    }
  }
  
  /**
   * Check for missing ADL information
   */
  private checkADLs(data: any, missing: MissingInformation[]): void {
    const adls = data.adls;
    
    if (!adls) {
      missing.push({
        id: `missing-adls-${Date.now()}`,
        section: 'adls',
        field: '',
        importance: 'high',
        reason: 'ADL assessment is a core component of OT evaluation'
      });
      return;
    }
    
    // Basic ADLs
    if (!adls.basic || Object.keys(adls.basic).length === 0) {
      missing.push({
        id: `missing-basic-adls-${Date.now()}`,
        section: 'adls',
        field: 'basic',
        importance: 'high',
        reason: 'Basic ADLs must be assessed for functional evaluation'
      });
    } else {
      // Check for core basic ADLs
      const coreADLs = ['bathing', 'dressing', 'toileting', 'feeding', 'mobility'];
      
      const missingCoreADLs = coreADLs.filter(adl => 
        !adls.basic[adl] || adls.basic[adl].level === 'unknown'
      );
      
      if (missingCoreADLs.length > 0) {
        missing.push({
          id: `missing-core-adls-${Date.now()}`,
          section: 'adls',
          field: `basic.${missingCoreADLs.join('/')}`,
          importance: 'high',
          reason: 'Core basic ADLs (bathing, dressing, toileting, feeding, mobility) must be assessed'
        });
      }
    }
    
    // Instrumental ADLs
    if (!adls.instrumental || Object.keys(adls.instrumental).length === 0) {
      missing.push({
        id: `missing-iadls-${Date.now()}`,
        section: 'adls',
        field: 'instrumental',
        importance: 'medium',
        reason: 'Instrumental ADLs are important for community independence'
      });
    }
  }
  
  /**
   * Check for missing attendant care information
   */
  private checkAttendantCare(data: any, missing: MissingInformation[]): void {
    const adls = data.adls;
    const functionalStatus = data.functionalStatus;
    const attendantCare = data.attendantCare;
    
    // If ADLs indicate dependence but no attendant care section
    if (adls && adls.basic) {
      const dependentADLs = Object.entries(adls.basic).filter(([_, details]: [string, any]) => 
        details.level === 'dependent' || 
        details.level === 'maximal_assistance'
      );
      
      if (dependentADLs.length > 0 && !attendantCare) {
        missing.push({
          id: `missing-attendant-care-${Date.now()}`,
          section: 'attendantCare',
          field: '',
          importance: 'high',
          reason: 'Attendant care needs should be documented for dependent ADLs'
        });
        return;
      }
    }
    
    // Mobility status indicates assistance but no attendant care section
    if (functionalStatus && 
        functionalStatus.mobility && 
        functionalStatus.mobility.ambulation && 
        functionalStatus.mobility.ambulation.toLowerCase().includes('assist') && 
        !attendantCare) {
      missing.push({
        id: `missing-mobility-care-${Date.now()}`,
        section: 'attendantCare',
        field: '',
        importance: 'high',
        reason: 'Attendant care needs should be documented for mobility assistance'
      });
      return;
    }
    
    // Check attendant care section for required fields if it exists
    if (attendantCare) {
      // Self-care needs
      if (!attendantCare.selfCare || !attendantCare.selfCare.needs || attendantCare.selfCare.needs.length === 0) {
        missing.push({
          id: `missing-selfcare-needs-${Date.now()}`,
          section: 'attendantCare',
          field: 'selfCare.needs',
          importance: 'high',
          reason: 'Self-care needs must be documented in attendant care assessment'
        });
      }
      
      // Hours
      if (!attendantCare.selfCare || typeof attendantCare.selfCare.hours !== 'number') {
        missing.push({
          id: `missing-care-hours-${Date.now()}`,
          section: 'attendantCare',
          field: 'selfCare.hours',
          importance: 'high',
          reason: 'Attendant care hours must be documented'
        });
      }
      
      // Current care
      if (!attendantCare.currentCare || !attendantCare.currentCare.provider) {
        missing.push({
          id: `missing-current-care-${Date.now()}`,
          section: 'attendantCare',
          field: 'currentCare.provider',
          importance: 'medium',
          reason: 'Current care arrangements should be documented'
        });
      }
    }
  }
}