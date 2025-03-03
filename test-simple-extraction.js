/**
 * Simple test for referral extraction
 */

const sampleText = `
255 Consumers Road, Suite 100
North York, ON M2J 1R4
Tel: 416-489-0711 Fax: 416-489-7009
www.omegamedical.ca
March 1, 2025

ASSESSOR INSTRUCTIONS
Medical Legal Assessment

Sebastien Ferland

RE:                    CLIENT:             John Smith
                       DOB:                March 15, 1980
                       DATE OF LOSS:       January 10, 2025 
                       OMEGA FILE NO.:     234567

You will be conducting an In-home assessment, Attendant Care Needs assessment and Functional assessment of the above client on behalf of Omega Medical Associates addressing all impairments (physical, cognitive, and psych).

Please see the letter of instructions set out by the referral source to assist you in your report preparation. 

Report Types: 
1: Attendant Care Needs Assessment
2: Functional Abilities Evaluation

Please confirm if you've previously seen the client in any capacity or if there is a conflict of interest. If any 
concerns are identified, please contact Angelica (angelica@omegamedical.ca).

Fee: $1250 + .50/km                       Report Due: March 25, 2025

Please address the following:
• Assess ability to perform self-care tasks
• Evaluate need for home modifications
• Determine if client can safely prepare meals
• Assess mobility within the home environment

CAT - Criterion 3: Please assess the domains:
• Personal care
• Home management
• Mobility and transfers
• Safety in the home

Below is your appointment information, and if applicable, other appointments scheduled for this client. 

Assessor                           Type                 Location                         Date/Time/Duration
Sebastien Ferland,                 Attendant            Client's Home:                  March 10, 2025
OT Reg (ON) Occupational           Care Needs          123 Main Street                  9:00 AM-11:00 AM
Therapist                          Assessment          Ottawa, ON K2P 1M2
sebastien@ferlandassociates.com                        Phone: 613-555-1234
                                                       Mobile: 613-555-4321
                                                       Email: john.smith@example.com
                                                       
INTERP/LANGUAGE: No

Should you have any clinical questions please contact Danielle Villalta (dvillalta@omegamedical.ca).

Report & Invoice Guidelines:
• Use proper AMA citation format
• Include all test results in appendices
• Report must be submitted in PDF format
• Submit invoice separately

Please use the attached report templates and submit your report & invoice to reports@omegamedical.ca

Yours sincerely,

Angelica McClimond
Assessment Services Coordinator
`;

// Define the CONFIDENCE object
const CONFIDENCE = {
  VERY_HIGH: 0.95,
  HIGH: 0.85,
  MEDIUM: 0.7,
  LOW: 0.5,
  VERY_LOW: 0.3,
  NONE: 0
};

// Extract client information
function extractClientInfo(text) {
  const clientInfo = {
    name: { value: '', confidence: 0 },
    dateOfBirth: { value: '', confidence: 0 },
    dateOfLoss: { value: '', confidence: 0 },
    fileNumber: { value: '', confidence: 0 }
  };
  
  // Extract client name
  const namePattern = /CLIENT:?\s*([A-Za-z\s\-']+)/i;
  const nameMatch = text.match(namePattern);
  if (nameMatch && nameMatch[1]) {
    clientInfo.name.value = nameMatch[1].trim();
    clientInfo.name.confidence = CONFIDENCE.HIGH;
  }
  
  // Extract date of birth
  const dobPattern = /DOB:?\s*((?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},\s+\d{4}|\d{1,2}\/\d{1,2}\/\d{4}|\d{4}-\d{2}-\d{2})/i;
  const dobMatch = text.match(dobPattern);
  if (dobMatch && dobMatch[1]) {
    clientInfo.dateOfBirth.value = dobMatch[1].trim();
    clientInfo.dateOfBirth.confidence = CONFIDENCE.HIGH;
  }
  
  // Extract date of loss
  const dolPattern = /DATE OF LOSS:?\s*((?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},\s+\d{4}|\d{1,2}\/\d{1,2}\/\d{4}|\d{4}-\d{2}-\d{2})/i;
  const dolMatch = text.match(dolPattern);
  if (dolMatch && dolMatch[1]) {
    clientInfo.dateOfLoss.value = dolMatch[1].trim();
    clientInfo.dateOfLoss.confidence = CONFIDENCE.HIGH;
  }
  
  // Extract file number
  const fileNumberPattern = /FILE NO\.?:?\s*(\d+)/i;
  const fileNumberMatch = text.match(fileNumberPattern);
  if (fileNumberMatch && fileNumberMatch[1]) {
    clientInfo.fileNumber.value = fileNumberMatch[1].trim();
    clientInfo.fileNumber.confidence = CONFIDENCE.HIGH;
  }
  
  return clientInfo;
}

// Extract assessment requirements
function extractAssessmentRequirements(text) {
  const requirements = {
    assessmentTypes: { value: [], confidence: 0 },
    specificRequirements: { value: [], confidence: 0 }
  };
  
  // Extract assessment types
  const assessmentTypePatterns = [
    /In-home assessment/i,
    /Attendant Care Needs/i,
    /Functional assessment/i
  ];
  
  const assessmentTypes = [];
  assessmentTypePatterns.forEach(pattern => {
    if (pattern.test(text)) {
      const match = text.match(pattern);
      if (match) {
        assessmentTypes.push(match[0]);
      }
    }
  });
  
  if (assessmentTypes.length > 0) {
    requirements.assessmentTypes.value = assessmentTypes;
    requirements.assessmentTypes.confidence = CONFIDENCE.HIGH;
  }
  
  // Extract specific requirements list items
  const specificRequirementsPattern = /Please address the following:[^\n]*((?:\n\s*•\s*[^\n]+)+)/i;
  const specificMatch = text.match(specificRequirementsPattern);
  
  if (specificMatch && specificMatch[1]) {
    const requirementLines = specificMatch[1].match(/•\s*([^\n]+)/g);
    if (requirementLines) {
      requirements.specificRequirements.value = requirementLines.map(line => 
        line.replace(/•\s*/, '').trim()
      );
      requirements.specificRequirements.confidence = CONFIDENCE.HIGH;
    }
  }
  
  return requirements;
}

// Extract scheduling information
function extractSchedulingInfo(text) {
  const scheduling = {
    appointments: { value: [], confidence: 0 }
  };
  
  // Extract appointments from table format
  const tablePattern = /Assessor\s+Type\s+Location\s+Date\/Time\/Duration\s+((?:[^\n]+\n){1,20})/gi;
  const tableMatch = text.match(tablePattern);
  
  if (tableMatch) {
    const appointments = [];
    
    // Split by rows (assuming multi-line rows)
    const rows = tableMatch[0].split(/\n(?=[A-Za-z])/);
    
    rows.forEach(row => {
      if (!/^Assessor|^Type|^Location|^Date/.test(row)) {
        // Try to separate the row into column data
        const rowParts = row.split(/(?<=\w)\s{2,}(?=\w)/);
        
        if (rowParts.length >= 3) {
          // Extract appointment details
          const appointmentType = rowParts.length > 1 ? rowParts[1].trim() : '';
          const location = rowParts.length > 2 ? rowParts[2].trim() : '';
          
          let dateTime = '';
          
          if (rowParts.length > 3) {
            const dateTimePart = rowParts[3].trim();
            const dateMatch = dateTimePart.match(/([A-Za-z]+ \d+, \d{4})/);
            const timeMatch = dateTimePart.match(/(\d{1,2}:\d{2} [AP]M)/);
            
            if (dateMatch) dateTime = dateMatch[1];
            if (timeMatch) {
              dateTime += ' ' + timeMatch[1];
            }
          }
          
          appointments.push({
            type: appointmentType,
            location: location,
            dateTime: dateTime
          });
        }
      }
    });
    
    if (appointments.length > 0) {
      scheduling.appointments.value = appointments;
      scheduling.appointments.confidence = CONFIDENCE.MEDIUM;
    }
  }
  
  return scheduling;
}

// Main extraction function
function extractReferralData(text) {
  const clientInfo = extractClientInfo(text);
  const assessmentRequirements = extractAssessmentRequirements(text);
  const schedulingInfo = extractSchedulingInfo(text);
  
  return {
    clientInfo,
    assessmentRequirements,
    schedulingInfo
  };
}

// Run the extraction
const result = extractReferralData(sampleText);
console.log(JSON.stringify(result, null, 2));
