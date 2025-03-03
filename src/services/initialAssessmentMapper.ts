/**
 * Initial Assessment Data Mapping Service
 * 
 * This service handles bidirectional mapping between:
 * 1. Context data structure (as used in AssessmentContext)
 * 2. Form data structure (as used in React Hook Form)
 */

// Default form values
export const defaultValues = {
  demographics: {
    clientName: '',
    clientDOB: '',
    clientAddress: '',
    clientPhone: '',
    clientEmail: '',
    caseManager: '',
    insurance: '',
    claimNumber: '',
    dateOfInjury: '',
    dateOfAssessment: '',
    assessor: '',
    referralSource: '',
    referralReason: ''
  },
  assessmentDetails: {
    primaryLanguage: '',
    interpreter: false,
    interpreterDetails: '',
    assessmentLocation: '',
    personsPresent: '',
    assessmentType: '',
    assessmentNotes: ''
  }
};

/**
 * Maps context data to form data structure
 * @param contextData Initial assessment data from the assessment context
 * @returns Object containing form data and hasData flag
 */
export function mapContextToForm(contextData: any) {
  try {
    console.log("Initial Assessment Mapper - Context Data:", contextData);
    
    // Start with default values
    const formData = JSON.parse(JSON.stringify(defaultValues));
    let hasData = false;
    
    // Early return if no data
    if (!contextData || Object.keys(contextData).length === 0) {
      return { formData, hasData };
    }

    // Map demographics data
    if (contextData.demographics || contextData.clientInfo) {
      hasData = true;
      const clientData = contextData.demographics || contextData.clientInfo || {};
      
      formData.demographics.clientName = clientData.name || clientData.clientName || '';
      formData.demographics.clientDOB = clientData.dob || clientData.clientDOB || clientData.dateOfBirth || '';
      formData.demographics.clientAddress = clientData.address || clientData.clientAddress || '';
      formData.demographics.clientPhone = clientData.phone || clientData.clientPhone || '';
      formData.demographics.clientEmail = clientData.email || clientData.clientEmail || '';
      formData.demographics.caseManager = clientData.caseManager || '';
      formData.demographics.insurance = clientData.insurance || clientData.insurer || '';
      formData.demographics.claimNumber = clientData.claimNumber || '';
      formData.demographics.dateOfInjury = clientData.dateOfInjury || clientData.injuryDate || '';
      formData.demographics.dateOfAssessment = clientData.dateOfAssessment || clientData.assessmentDate || '';
      formData.demographics.assessor = clientData.assessor || clientData.assessorName || '';
      formData.demographics.referralSource = clientData.referralSource || '';
      formData.demographics.referralReason = clientData.referralReason || '';
    }
    
    // Map assessment details
    if (contextData.assessmentDetails) {
      hasData = true;
      
      formData.assessmentDetails.primaryLanguage = contextData.assessmentDetails.primaryLanguage || '';
      formData.assessmentDetails.interpreter = 
        contextData.assessmentDetails.interpreter === true || 
        contextData.assessmentDetails.interpreter === 'Yes' || 
        false;
      formData.assessmentDetails.interpreterDetails = contextData.assessmentDetails.interpreterDetails || '';
      formData.assessmentDetails.assessmentLocation = contextData.assessmentDetails.assessmentLocation || '';
      formData.assessmentDetails.personsPresent = contextData.assessmentDetails.personsPresent || '';
      formData.assessmentDetails.assessmentType = contextData.assessmentDetails.assessmentType || '';
      formData.assessmentDetails.assessmentNotes = contextData.assessmentDetails.assessmentNotes || '';
    }
    
    console.log("Initial Assessment Mapper - Mapped Form Data:", formData);
    return { formData, hasData };
  } catch (error) {
    console.error("Initial Assessment Mapper - Error mapping context data:", error);
    return { formData: defaultValues, hasData: false };
  }
}

/**
 * Maps form data to context structure
 * @param formData Form data from React Hook Form
 * @returns Context-structured data
 */
export function mapFormToContext(formData: any) {
  try {
    // Convert form data to the structure expected by the context
    const contextData = {
      demographics: {
        name: formData.demographics.clientName,
        dob: formData.demographics.clientDOB,
        address: formData.demographics.clientAddress,
        phone: formData.demographics.clientPhone,
        email: formData.demographics.clientEmail,
        caseManager: formData.demographics.caseManager,
        insurance: formData.demographics.insurance,
        claimNumber: formData.demographics.claimNumber,
        dateOfInjury: formData.demographics.dateOfInjury,
        dateOfAssessment: formData.demographics.dateOfAssessment,
        assessor: formData.demographics.assessor,
        referralSource: formData.demographics.referralSource,
        referralReason: formData.demographics.referralReason
      },
      assessmentDetails: {
        primaryLanguage: formData.assessmentDetails.primaryLanguage,
        interpreter: formData.assessmentDetails.interpreter,
        interpreterDetails: formData.assessmentDetails.interpreterDetails,
        assessmentLocation: formData.assessmentDetails.assessmentLocation,
        personsPresent: formData.assessmentDetails.personsPresent,
        assessmentType: formData.assessmentDetails.assessmentType,
        assessmentNotes: formData.assessmentDetails.assessmentNotes
      }
    };
    
    console.log("Initial Assessment Mapper - Mapped Context Data:", contextData);
    return contextData;
  } catch (error) {
    console.error("Initial Assessment Mapper - Error mapping to context:", error);
    return {};
  }
}

/**
 * Creates a JSON export of the initial assessment data
 * @param contextData The context data from AssessmentContext
 * @returns String representation of the JSON data
 */
export function exportToJson(contextData: any) {
  try {
    return JSON.stringify(contextData, null, 2);
  } catch (error) {
    console.error("Initial Assessment Mapper - Error exporting to JSON:", error);
    return '';
  }
}

/**
 * Imports initial assessment data from JSON
 * @param jsonString JSON string representation of initial assessment data
 * @returns Parsed initial assessment data
 */
export function importFromJson(jsonString: string) {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("Initial Assessment Mapper - Error importing from JSON:", error);
    return null;
  }
}
