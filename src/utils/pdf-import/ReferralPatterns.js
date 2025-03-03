/**
 * ReferralPatterns.js
 * 
 * Contains pattern definitions for identifying referral documents
 * and their sections in Delilah V3.0
 */

const REFERRAL_PATTERNS = {
  // Strong patterns - highest confidence direct matches
  strong: [
    /ASSESSOR INSTRUCTIONS/i,
    /ASSESSOR\/CLIENT SCHEDULE/i,
    /(?:RE|RE:)\s*CLIENT:/i,
    /You will be conducting an (?:In-home|functional|Attendant Care Needs) assessment/i,
    /Omega Medical Associates/i,
    /Assessment Services Coordinator/i,
    /Medical Legal Assessment/i
  ],
  
  // Context patterns - medium confidence contextual matches
  context: [
    /Please address the following:/i,
    /Please note that the collateral information\/family form/i,
    /Report (?:Due|Guidelines):/i,
    /CAT - Criterion \d+:/i,
    /Attendant Care Needs:/i,
    /Assessment Protocols:/i,
    /DATE OF LOSS:/i,
    /INTERP\/LANGUAGE:/i,
    /OMEGA FILE NO\.:/i,
    /For In-home assessments, please e-mail or call/i,
    /Please see the letter of instructions set out by the referral source/i
  ],
  
  // Weak patterns - lower confidence general indicators
  weak: [
    /Please confirm if you've previously seen the client/i,
    /Password protect your report/i,
    /reports@omegamedical\.ca/i,
    /assessment was completed/i,
    /CAT reports are due within/i,
    /assessor/i,
    /client/i,
    /assessment/i,
    /report/i,
    /Fee: \$\d+/i
  ],
  
  // Section headers - patterns to identify sections within referral documents
  sections: {
    CLIENT_INFO: [
      /CLIENT:/i,
      /DATE OF LOSS:/i,
      /FILE NO\.:/i,
      /OMEGA FILE NO\.:/i,
      /DOB:/i,
      /INTERP\/LANGUAGE:/i
    ],
    
    ASSESSMENT_REQUIREMENTS: [
      /Please address the following:/i,
      /Report \d+:/i,
      /CAT - Criterion \d+:/i,
      /Mental\/Behavioural Impairment/i,
      /Attendant Care Needs:/i,
      /You will be conducting an (?:In-home|functional|Attendant Care Needs) assessment/i,
      /addressing all impairments/i
    ],
    
    SCHEDULING_INFO: [
      /ASSESSOR\/CLIENT SCHEDULE/i,
      /Location/i,
      /Date\/Time\/Duration/i,
      /Client's Home:/i,
      /Below is your appointment information/i
    ],
    
    REPORTING_REQUIREMENTS: [
      /Report(?:s)?(?: &)? Invoice Guidelines:/i,
      /Report Due:/i,
      /Please submit your report & invoice to/i,
      /Fee: \$\d+/i
    ],
    
    REFERRAL_SOURCE: [
      /Please see the letter of instructions set out by the referral source/i,
      /on behalf of Omega Medical Associates/i,
      /Angelica McClimond/i,
      /Assessment Services Coordinator/i
    ]
  },
  
  // Confidence weights for pattern matching
  weights: {
    strong: 1.0,
    context: 0.7,
    weak: 0.4,
    sections: {
      CLIENT_INFO: 0.9,
      ASSESSMENT_REQUIREMENTS: 0.8,
      SCHEDULING_INFO: 0.7,
      REPORTING_REQUIREMENTS: 0.6,
      REFERRAL_SOURCE: 0.5
    }
  },
  
  // Threshold for identifying a document as a referral
  referralThreshold: 0.7,
  
  // Map section types to extractor functions
  sectionToExtractor: {
    CLIENT_INFO: 'extractClientInfo',
    ASSESSMENT_REQUIREMENTS: 'extractAssessmentRequirements',
    SCHEDULING_INFO: 'extractSchedulingInfo',
    REPORTING_REQUIREMENTS: 'extractReportingRequirements',
    REFERRAL_SOURCE: 'extractReferralSource'
  }
};

module.exports = {
  REFERRAL_PATTERNS
};
