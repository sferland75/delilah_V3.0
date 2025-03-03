import { Demographics, ProcessedDemographics } from './types';

// Process demographics data for narrative generation
export function processDemographicsData(demographics: Demographics): ProcessedDemographics {
  const birthDate = new Date(demographics.dateOfBirth);
  const today = new Date();
  const age = today.getFullYear() - birthDate.getFullYear();

  return {
    valid: true,
    fullName: `${demographics.firstName} ${demographics.lastName}`,
    age,
    contact: {
      phone: demographics.phone,
      email: demographics.email,
      address: demographics.address
    },
    insurance: {
      provider: demographics.insuranceProvider,
      claimNumber: demographics.claimNumber,
      adjustor: {
        name: demographics.adjustorName,
        phone: demographics.adjustorPhone
      }
    },
    legal: {
      representative: demographics.legalRepName,
      firm: demographics.legalFirm,
      fileNumber: demographics.fileNumber
    },
    family: {
      maritalStatus: demographics.maritalStatus,
      children: demographics.children,
      householdMembers: demographics.householdMembers
    }
  };
}

// Prepare prompt for Claude API
export function prepareDemographicsPrompt(data: ProcessedDemographics, detail: 'brief' | 'standard' | 'detailed'): string {
  // Structure the data in a clear format for Claude
  const context = `
Please generate a professional occupational therapy report section for the following client demographics:

Client Information:
- Name: ${data.fullName}
- Age: ${data.age}
- Contact: ${data.contact.phone || 'Not provided'} / ${data.contact.email || 'Not provided'}
- Address: ${data.contact.address || 'Not provided'}

Insurance Information:
- Provider: ${data.insurance.provider || 'Not provided'}
- Claim #: ${data.insurance.claimNumber || 'Not provided'}
- Adjustor: ${data.insurance.adjustor.name || 'Not provided'} (${data.insurance.adjustor.phone || 'No phone'})

Legal Information:
- Representative: ${data.legal.representative || 'Not provided'}
- Firm: ${data.legal.firm || 'Not provided'}
- File #: ${data.legal.fileNumber || 'Not provided'}

Family Information:
- Marital Status: ${data.family.maritalStatus || 'Not provided'}
${data.family.children?.length ? 
  '- Children:\n' + data.family.children.map(child => 
    `  * ${child.name}${child.age ? ` (${child.age} years)` : ''}${child.notes ? `: ${child.notes}` : ''}`
  ).join('\n')
  : '- No children reported'
}
${data.family.householdMembers?.length ?
  '- Household Members:\n' + data.family.householdMembers.map(member =>
    `  * ${member.name} (${member.relationship})${member.notes ? `: ${member.notes}` : ''}`
  ).join('\n')
  : '- No additional household members reported'
}`;

  const detailInstructions = {
    brief: 'Please provide a brief 1-2 sentence overview focusing only on the client\'s basic information and the referral source.',
    standard: 'Please provide a standard summary including client information, insurance details, and legal representation. Use a professional tone and organize in clear paragraphs.',
    detailed: 'Please provide a detailed report section including all available information. Organize in clear paragraphs with appropriate subheadings. Include family context and living situation where provided.'
  };

  return `${context}

${detailInstructions[detail]}

Use clear, professional language appropriate for a medical-legal occupational therapy report. Maintain a formal tone throughout.`;
}

// Generate narrative using Claude
export async function generateDemographicsNarrative(
  data: Demographics, 
  detail: 'brief' | 'standard' | 'detailed' = 'standard'
): Promise<string> {
  try {
    const processedData = processDemographicsData(data);
    const prompt = prepareDemographicsPrompt(processedData, detail);
    
    // Here you would make the actual call to Claude API
    // For now, we'll use a placeholder that would be replaced with actual implementation
    // return await generateWithClaude(prompt);
    
    return 'Demographics narrative will be generated using Claude API';
  } catch (error) {
    console.error('Error generating demographics narrative:', error);
    throw new Error('Failed to generate demographics narrative');
  }
}