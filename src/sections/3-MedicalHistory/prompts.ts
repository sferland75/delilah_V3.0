import { type MedicalHistory } from './types';

const PROMPT_TEMPLATES = {
  brief: `
You are drafting a brief medical history summary based on the provided data:

DEMOGRAPHICS:
[Patient Demographics]

MEDICAL HISTORY:
[Medical History Data]

Create a concise 2-3 sentence summary focusing on key conditions and injury details.
  `,
  
  standard: `
You are writing a comprehensive medical history section for an assessment report based on the provided data:

DEMOGRAPHICS:
[Patient Demographics]

MEDICAL HISTORY DATA:
[Medical History Data]

Create a professional medical-legal report section that includes:
1. Pre-existing conditions and their impact
2. Injury mechanism and immediate response
3. Current treatments and progress
4. Medication regimen and compliance

Use a formal, objective tone appropriate for a medical-legal report.
  `,
  
  detailed: `
You are writing a detailed medical history analysis for a comprehensive assessment report based on the provided data:

DEMOGRAPHICS:
[Patient Demographics]

MEDICAL HISTORY DATA:
[Medical History Data]

Create a thorough medical-legal report section that addresses:

1. Pre-existing Medical Status:
   - Detailed analysis of each condition
   - Treatment history and management
   - Impact on daily function pre-incident

2. Injury Mechanism:
   - Comprehensive accident/injury analysis
   - Biomechanical considerations
   - Initial presentation and symptoms

3. Post-Incident Care:
   - Emergency response and initial care
   - Treatment progression
   - Healthcare provider involvement

4. Current Status:
   - Ongoing treatments and response
   - Medication management
   - Treatment compliance and barriers

Use formal medical-legal terminology and maintain an objective, analytical tone throughout.
  `
};

export function formatMedicalHistory(data: MedicalHistory): string {
  const formatPreExisting = () => {
    if (data.preExistingConditions.length === 0) return "No pre-existing conditions reported.";
    
    return data.preExistingConditions.map(condition => `
      Condition: ${condition.condition}
      Diagnosis Date: ${condition.diagnosisDate || 'Not specified'}
      Status: ${condition.status}
      Details: ${condition.details}
    `).join('\n');
  };

  const formatInjury = () => `
    Date/Time: ${data.injury.date} ${data.injury.time || ''}
    Position: ${data.injury.position}
    Impact Type: ${data.injury.impactType}
    Circumstances: ${data.injury.circumstance}
    Preparation: ${data.injury.preparedForImpact}
    Immediate Symptoms: ${data.injury.immediateSymptoms}
    Immediate Response: ${data.injury.immediateResponse}
  `;

  const formatTreatments = () => {
    if (data.currentTreatments.length === 0) return "No current treatments reported.";
    
    return data.currentTreatments.map(treatment => `
      Provider: ${treatment.provider}
      Type: ${treatment.type}
      Facility: ${treatment.facility}
      Started: ${treatment.startDate}
      Frequency: ${treatment.frequency}
      Status: ${treatment.status}
      Notes: ${treatment.notes}
    `).join('\n');
  };

  const formatMedications = () => {
    if (data.currentMedications.length === 0) return "No current medications reported.";
    
    return data.currentMedications.map(med => `
      Medication: ${med.name}
      Dosage: ${med.dosage}
      Frequency: ${med.frequency}
      Prescribed For: ${med.prescribedFor}
      Prescribed By: ${med.prescribedBy || 'Not specified'}
      Status: ${med.status}
    `).join('\n');
  };

  return `
PRE-EXISTING CONDITIONS:
${formatPreExisting()}

INJURY DETAILS:
${formatInjury()}

CURRENT TREATMENTS:
${formatTreatments()}

CURRENT MEDICATIONS:
${formatMedications()}
  `.trim();
}

export function preparePrompt(data: MedicalHistory, type: keyof typeof PROMPT_TEMPLATES = 'standard'): string {
  const formattedData = formatMedicalHistory(data);
  const template = PROMPT_TEMPLATES[type];
  
  return template.replace('[Medical History Data]', formattedData);
}