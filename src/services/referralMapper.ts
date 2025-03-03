/**
 * referralMapper.ts
 * Mapper service for Referral documents in Delilah V3.0
 * 
 * This service maps between referral document data and the application's context model
 */

// Default form values for referral form
export const defaultValues = {
  client: {
    name: '',
    dateOfBirth: '',
    dateOfLoss: '',
    fileNumber: '',
    language: '',
    phoneNumbers: [],
    address: '',
    email: ''
  },
  assessmentTypes: [],
  reportTypes: [],
  specificRequirements: [],
  criteria: [],
  domains: [],
  appointments: [],
  reportDueDate: '',
  reportGuidelines: [],
  referralSource: {
    organization: '',
    contactPerson: '',
    contactInfo: ''
  }
};

/**
 * Maps referral context data to form data structure
 * @param contextData Data from the assessment context
 * @returns Object containing form data and hasData flag
 */
export function mapContextToForm(contextData: any) {
  try {
    // Logging for debugging
    console.log("ReferralMapper - Context Data:", contextData);
    
    // Start with default values
    const formData = JSON.parse(JSON.stringify(defaultValues));
    let hasData = false;
    
    // Early return if no data
    if (!contextData || !contextData.referral || Object.keys(contextData.referral).length === 0) {
      return { formData, hasData };
    }
    
    const referral = contextData.referral;
    
    // Map client information
    if (referral.client) {
      formData.client.name = referral.client.name || formData.client.name;
      formData.client.dateOfBirth = referral.client.dateOfBirth || formData.client.dateOfBirth;
      formData.client.dateOfLoss = referral.client.dateOfLoss || formData.client.dateOfLoss;
      formData.client.fileNumber = referral.client.fileNumber || formData.client.fileNumber;
      formData.client.language = referral.client.language || formData.client.language;
      formData.client.phoneNumbers = referral.client.phoneNumbers || formData.client.phoneNumbers;
      formData.client.address = referral.client.address || formData.client.address;
      formData.client.email = referral.client.email || formData.client.email;
      
      hasData = true;
    }
    
    // Map assessment types and requirements
    formData.assessmentTypes = referral.assessmentTypes || formData.assessmentTypes;
    formData.reportTypes = referral.reportTypes || formData.reportTypes;
    formData.specificRequirements = referral.specificRequirements || formData.specificRequirements;
    formData.criteria = referral.criteria || formData.criteria;
    formData.domains = referral.domains || formData.domains;
    
    // Map appointments
    formData.appointments = referral.appointments || formData.appointments;
    
    // Map report information
    formData.reportDueDate = referral.reportDueDate || formData.reportDueDate;
    formData.reportGuidelines = referral.reportGuidelines || formData.reportGuidelines;
    
    // Map referral source
    if (referral.referralSource) {
      formData.referralSource.organization = referral.referralSource.organization || formData.referralSource.organization;
      formData.referralSource.contactPerson = referral.referralSource.contactPerson || formData.referralSource.contactPerson;
      formData.referralSource.contactInfo = referral.referralSource.contactInfo || formData.referralSource.contactInfo;
    }
    
    // Final logging
    console.log("ReferralMapper - Mapped Form Data:", formData);
    return { formData, hasData };
  } catch (error) {
    // Error handling
    console.error("ReferralMapper - Error mapping context data:", error);
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
    // Transform form data to context format
    const contextData = {
      referral: {
        client: {
          name: formData.client.name,
          dateOfBirth: formData.client.dateOfBirth,
          dateOfLoss: formData.client.dateOfLoss,
          fileNumber: formData.client.fileNumber,
          language: formData.client.language,
          phoneNumbers: formData.client.phoneNumbers,
          address: formData.client.address,
          email: formData.client.email
        },
        assessmentTypes: formData.assessmentTypes,
        reportTypes: formData.reportTypes,
        specificRequirements: formData.specificRequirements,
        criteria: formData.criteria,
        domains: formData.domains,
        appointments: formData.appointments,
        reportDueDate: formData.reportDueDate,
        reportGuidelines: formData.reportGuidelines,
        referralSource: {
          organization: formData.referralSource.organization,
          contactPerson: formData.referralSource.contactPerson,
          contactInfo: formData.referralSource.contactInfo
        }
      }
    };
    
    // Logging
    console.log("ReferralMapper - Mapped Context Data:", contextData);
    return contextData;
  } catch (error) {
    // Error handling
    console.error("ReferralMapper - Error mapping to context:", error);
    return { referral: {} };
  }
}

/**
 * Creates a JSON export of the data
 * @param contextData Context data
 * @returns String representation of the JSON data
 */
export function exportToJson(contextData: any) {
  try {
    return JSON.stringify(contextData, null, 2);
  } catch (error) {
    console.error("ReferralMapper - Error exporting to JSON:", error);
    return '';
  }
}

/**
 * Imports data from JSON
 * @param jsonString JSON string representation of data
 * @returns Parsed data
 */
export function importFromJson(jsonString: string) {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("ReferralMapper - Error importing from JSON:", error);
    return null;
  }
}

/**
 * Synchronizes client data from referral to demographics
 * @param referralData Referral data from context
 * @returns Demographics data for context
 */
export function syncClientToDemographics(referralData: any) {
  try {
    if (!referralData || !referralData.client) {
      return null;
    }
    
    const client = referralData.client;
    
    // Map to demographics format
    return {
      clientName: client.name,
      dateOfBirth: client.dateOfBirth,
      dateOfLoss: client.dateOfLoss,
      fileNumber: client.fileNumber,
      contactPhone: client.phoneNumbers && client.phoneNumbers.length > 0 ? 
                   client.phoneNumbers[0] : '',
      address: client.address,
      email: client.email,
      language: client.language,
      interpreter: client.language && client.language !== 'English' ? 'Yes' : 'No'
    };
  } catch (error) {
    console.error("ReferralMapper - Error syncing to demographics:", error);
    return null;
  }
}

/**
 * Gets assessment requirements for the purpose section
 * @param referralData Referral data from context
 * @returns Purpose data for context
 */
export function getAssessmentRequirements(referralData: any) {
  try {
    if (!referralData) {
      return null;
    }
    
    // Combine assessment types and report types into a purpose statement
    const assessmentTypes = referralData.assessmentTypes || [];
    const reportTypes = referralData.reportTypes || [];
    const specificRequirements = referralData.specificRequirements || [];
    
    let purposeText = '';
    
    if (assessmentTypes.length > 0) {
      purposeText += `Assessment Types: ${assessmentTypes.join(', ')}\n\n`;
    }
    
    if (reportTypes.length > 0) {
      purposeText += `Report Types: ${reportTypes.map(rt => 
        typeof rt === 'object' ? `${rt.number}: ${rt.description}` : rt).join('; ')}\n\n`;
    }
    
    if (specificRequirements.length > 0) {
      purposeText += `Specific Requirements:\n• ${specificRequirements.join('\n• ')}\n\n`;
    }
    
    if (referralData.criteria && referralData.criteria.length > 0) {
      purposeText += `Criteria: ${referralData.criteria.join(', ')}\n\n`;
    }
    
    if (referralData.domains && referralData.domains.length > 0) {
      purposeText += `Domains to Address:\n• ${referralData.domains.join('\n• ')}\n\n`;
    }
    
    return purposeText.trim();
  } catch (error) {
    console.error("ReferralMapper - Error getting assessment requirements:", error);
    return null;
  }
}

/**
 * Check if referral contains specific requirement keywords
 * @param referralData Referral data from context
 * @param keyword Keyword to search for
 * @returns Boolean indicating if keyword is found
 */
export function hasRequirement(referralData: any, keyword: string) {
  try {
    if (!referralData) return false;
    
    const searchAreas = [
      referralData.assessmentTypes || [], 
      referralData.reportTypes || [],
      referralData.specificRequirements || [],
      referralData.criteria || [],
      referralData.domains || []
    ];
    
    const regex = new RegExp(keyword, 'i');
    
    // Search through each area
    for (const area of searchAreas) {
      for (const item of area) {
        if (typeof item === 'string' && regex.test(item)) {
          return true;
        } else if (typeof item === 'object' && item?.description && regex.test(item.description)) {
          return true;
        }
      }
    }
    
    return false;
  } catch (error) {
    console.error("ReferralMapper - Error checking requirements:", error);
    return false;
  }
}
