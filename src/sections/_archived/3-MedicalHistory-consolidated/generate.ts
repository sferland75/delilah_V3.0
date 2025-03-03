import { generateWithClaude } from '../../services/claude';
import { MedicalHistory } from '../../types';

function formatMedications(medications: MedicalHistory['medications']) {
  return medications.map(med => 
    `${med.name} ${med.dosage} ${med.frequency} for ${med.purpose}`
  ).join('\n');
}

function formatTreatments(treatments: MedicalHistory['treatments']) {
  return treatments.map(treatment =>
    `${treatment.type} with ${treatment.provider}, ${treatment.frequency}${treatment.notes ? ` - ${treatment.notes}` : ''}`
  ).join('\n');
}

export async function generateMedicalHistoryNarrative(data: MedicalHistory) {
  const prompt = `
    As an occupational therapist, write a professional medical history section for an OT report using this data:

    Pre-existing Conditions: ${data.preExisting}
    Current Conditions: ${data.currentConditions}
    Injury Details:
    - Type: ${data.injury.type}
    - Mechanism: ${data.injury.mechanism}
    - Initial Symptoms: ${data.injury.immediateSymptoms}
    
    Medications: ${formatMedications(data.medications)}
    Treatments: ${formatTreatments(data.treatments)}

    Please:
    1. Synthesize a coherent medical history narrative
    2. Highlight functional impacts
    3. Note relevant precautions
    4. Include clinical reasoning
    5. Use professional OT terminology
  `;

  return await generateWithClaude(prompt, {
    cacheKey: `medical-history-${JSON.stringify(data)}`
  });
}