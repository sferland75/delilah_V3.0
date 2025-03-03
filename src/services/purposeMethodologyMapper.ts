/**
 * Purpose & Methodology Data Mapping Service
 * 
 * This service handles bidirectional mapping between:
 * 1. Context data structure (as used in AssessmentContext)
 * 2. Form data structure (as used in React Hook Form)
 */

// Default form values
export const defaultValues = {
  purpose: {
    primaryPurpose: '',
    assessmentObjectives: [],
    referralQuestions: []
  },
  methodology: {
    assessmentMethods: [],
    documentsReviewed: [],
    standardsCompliance: '',
    limitations: '',
    methodologyNotes: ''
  }
};

/**
 * Maps context data to form data structure
 * @param contextData Purpose & methodology data from the assessment context
 * @returns Object containing form data and hasData flag
 */
export function mapContextToForm(contextData: any) {
  try {
    console.log("Purpose & Methodology Mapper - Context Data:", contextData);
    
    // Start with default values
    const formData = JSON.parse(JSON.stringify(defaultValues));
    let hasData = false;
    
    // Early return if no data
    if (!contextData || Object.keys(contextData).length === 0) {
      return { formData, hasData };
    }

    // Map purpose data
    try {
      if (contextData.purpose) {
        hasData = true;
        
        formData.purpose.primaryPurpose = contextData.purpose.primaryPurpose || '';
        
        // Map assessment objectives
        if (Array.isArray(contextData.purpose.assessmentObjectives)) {
          formData.purpose.assessmentObjectives = contextData.purpose.assessmentObjectives.map((obj: any) => {
            return typeof obj === 'string' ? obj : obj.objective || obj.description || '';
          });
        } else if (typeof contextData.purpose.assessmentObjectives === 'string') {
          formData.purpose.assessmentObjectives = contextData.purpose.assessmentObjectives
            .split(/[.,;]/)
            .map((item: string) => item.trim())
            .filter((item: string) => item.length > 0);
        }
        
        // Map referral questions
        if (Array.isArray(contextData.purpose.referralQuestions)) {
          formData.purpose.referralQuestions = contextData.purpose.referralQuestions.map((q: any) => {
            return typeof q === 'string' ? q : q.question || q.description || '';
          });
        } else if (typeof contextData.purpose.referralQuestions === 'string') {
          formData.purpose.referralQuestions = contextData.purpose.referralQuestions
            .split(/[?]/)
            .map((item: string) => item.trim())
            .filter((item: string) => item.length > 0)
            .map((item: string) => item + '?');
        }
      }
    } catch (error) {
      console.error("Purpose & Methodology Mapper - Error mapping purpose:", error);
    }
    
    // Map methodology data
    try {
      if (contextData.methodology) {
        hasData = true;
        
        // Map assessment methods
        if (Array.isArray(contextData.methodology.assessmentMethods)) {
          formData.methodology.assessmentMethods = contextData.methodology.assessmentMethods.map((method: any) => {
            return typeof method === 'string' ? method : method.method || method.description || '';
          });
        } else if (typeof contextData.methodology.assessmentMethods === 'string') {
          formData.methodology.assessmentMethods = contextData.methodology.assessmentMethods
            .split(/[.,;]/)
            .map((item: string) => item.trim())
            .filter((item: string) => item.length > 0);
        }
        
        // Map documents reviewed
        if (Array.isArray(contextData.methodology.documentsReviewed)) {
          formData.methodology.documentsReviewed = contextData.methodology.documentsReviewed.map((doc: any) => {
            return typeof doc === 'string' ? doc : doc.document || doc.title || doc.description || '';
          });
        } else if (typeof contextData.methodology.documentsReviewed === 'string') {
          formData.methodology.documentsReviewed = contextData.methodology.documentsReviewed
            .split(/[.,;]/)
            .map((item: string) => item.trim())
            .filter((item: string) => item.length > 0);
        }
        
        formData.methodology.standardsCompliance = contextData.methodology.standardsCompliance || '';
        formData.methodology.limitations = contextData.methodology.limitations || '';
        formData.methodology.methodologyNotes = contextData.methodology.methodologyNotes || 
                                                contextData.methodology.notes || '';
      }
    } catch (error) {
      console.error("Purpose & Methodology Mapper - Error mapping methodology:", error);
    }
    
    console.log("Purpose & Methodology Mapper - Mapped Form Data:", formData);
    return { formData, hasData };
  } catch (error) {
    console.error("Purpose & Methodology Mapper - Error mapping context data:", error);
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
      purpose: {
        primaryPurpose: formData.purpose.primaryPurpose,
        assessmentObjectives: formData.purpose.assessmentObjectives,
        referralQuestions: formData.purpose.referralQuestions
      },
      methodology: {
        assessmentMethods: formData.methodology.assessmentMethods,
        documentsReviewed: formData.methodology.documentsReviewed,
        standardsCompliance: formData.methodology.standardsCompliance,
        limitations: formData.methodology.limitations,
        methodologyNotes: formData.methodology.methodologyNotes
      }
    };
    
    console.log("Purpose & Methodology Mapper - Mapped Context Data:", contextData);
    return contextData;
  } catch (error) {
    console.error("Purpose & Methodology Mapper - Error mapping to context:", error);
    return {};
  }
}

/**
 * Creates a JSON export of the purpose & methodology data
 * @param contextData The context data from AssessmentContext
 * @returns String representation of the JSON data
 */
export function exportToJson(contextData: any) {
  try {
    return JSON.stringify(contextData, null, 2);
  } catch (error) {
    console.error("Purpose & Methodology Mapper - Error exporting to JSON:", error);
    return '';
  }
}

/**
 * Imports purpose & methodology data from JSON
 * @param jsonString JSON string representation of purpose & methodology data
 * @returns Parsed purpose & methodology data
 */
export function importFromJson(jsonString: string) {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("Purpose & Methodology Mapper - Error importing from JSON:", error);
    return null;
  }
}
