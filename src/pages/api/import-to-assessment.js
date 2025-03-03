import { useAssessmentContext } from '@/contexts/AssessmentContext';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { extractionResult } = req.body;

    // Validate required data
    if (!extractionResult) {
      return res.status(400).json({ message: 'Missing extraction result' });
    }

    // Here we would normally update the assessment context with the extracted data
    // This is a simplified example
    
    // Map extracted data to assessment context structure
    const assessmentData = mapExtractionToAssessment(extractionResult);

    // In a real implementation, you would update the assessment context
    // const { dispatch } = useAssessmentContext();
    // dispatch({ type: 'IMPORT_DATA', payload: assessmentData });

    // Return success
    return res.status(200).json({
      message: 'Data imported successfully',
      sections: Object.keys(assessmentData).length
    });
    
  } catch (error) {
    console.error('Error importing to assessment:', error);
    return res.status(500).json({ message: 'Error importing to assessment', error: error.message });
  }
}

/**
 * Map extracted data to assessment context structure
 * @param {Object} extractionResult - Extraction result from pattern recognition
 * @returns {Object} - Data in assessment context format
 */
function mapExtractionToAssessment(extractionResult) {
  const assessment = {};

  // Map demographics
  if (extractionResult.DEMOGRAPHICS) {
    assessment.demographics = {
      personalInfo: {
        name: extractionResult.DEMOGRAPHICS.name,
        address: extractionResult.DEMOGRAPHICS.address,
        phone: extractionResult.DEMOGRAPHICS.telephone,
        dateOfBirth: extractionResult.DEMOGRAPHICS.dateOfBirth
      },
      claimInfo: {
        claimNumber: extractionResult.DEMOGRAPHICS.claimNumber,
        dateOfLoss: extractionResult.DEMOGRAPHICS.dateOfLoss,
        dateOfAssessment: extractionResult.DEMOGRAPHICS.dateOfAssessment
      }
    };
  }

  // Map medical history
  if (extractionResult.MEDICAL_HISTORY) {
    assessment.medicalHistory = {
      preAccidentConditions: extractionResult.MEDICAL_HISTORY.preAccidentConditions,
      injuries: Array.isArray(extractionResult.MEDICAL_HISTORY.injuries) 
        ? extractionResult.MEDICAL_HISTORY.injuries.join('\n') 
        : extractionResult.MEDICAL_HISTORY.injuries,
      medications: extractionResult.MEDICAL_HISTORY.medications
    };
  }

  // Map functional status
  if (extractionResult.FUNCTIONAL_STATUS) {
    assessment.functionalStatus = {
      mobilityStatus: extractionResult.FUNCTIONAL_STATUS.mobilityStatus,
      selfCareLimitations: extractionResult.FUNCTIONAL_STATUS.selfCareLimitations,
      adlLimitations: extractionResult.FUNCTIONAL_STATUS.adlLimitations
    };
  }

  // Map attendant care
  if (extractionResult.ATTENDANT_CARE) {
    assessment.attendantCare = {
      hoursPerWeek: extractionResult.ATTENDANT_CARE.hoursPerWeek,
      monthlyCost: extractionResult.ATTENDANT_CARE.monthlyCost,
      careType: extractionResult.ATTENDANT_CARE.careType
    };
  }

  // Map recommendations
  if (extractionResult.RECOMMENDATIONS) {
    assessment.recommendations = {
      therapyRecommendations: Array.isArray(extractionResult.RECOMMENDATIONS.therapyRecommendations)
        ? extractionResult.RECOMMENDATIONS.therapyRecommendations.join('\n')
        : extractionResult.RECOMMENDATIONS.therapyRecommendations,
      equipmentRecommendations: extractionResult.RECOMMENDATIONS.equipmentRecommendations,
      otherRecommendations: extractionResult.RECOMMENDATIONS.otherRecommendations
    };
  }

  return assessment;
}
