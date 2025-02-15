import { Demographics } from './schema';

export const defaultPrompts = {
  brief: `
Please provide a brief 1-2 sentence introduction for an occupational therapy report based on the following client demographics:

[Client Demographics]
{data}

Guidelines:
- Focus on identifying information and referral source
- Keep it concise and professional
- Use medical-legal terminology
- Avoid interpretations or diagnoses
`,

  standard: `
Please generate a standard demographics section for an occupational therapy report based on the following client information:

[Client Demographics]
{data}

Guidelines:
- Begin with a professional introduction
- Include all relevant client identification details
- Include insurance and legal representation details
- Maintain a formal, medical-legal writing style
- Organize information in clear paragraphs
- Do not include interpretations or diagnoses
`,

  detailed: `
Please generate a comprehensive demographics section for an occupational therapy report based on the following client information:

[Client Demographics]
{data}

Guidelines:
- Begin with a thorough professional introduction
- Include all available client identification details
- Detail insurance coverage and claims information
- Include complete legal representation information
- Include family/household context where provided
- Address any special circumstances or considerations
- Maintain a formal, medical-legal writing style
- Organize information in clear, logical sections
- Use appropriate medical-legal terminology
- Do not include interpretations or diagnoses
`
};

export function formatDemographicsData(data: Demographics): string {
  return `
Client Name: ${data.firstName} ${data.lastName}
Date of Birth: ${data.dateOfBirth}
Gender: ${data.gender}
Marital Status: ${data.maritalStatus || 'Not provided'}

Contact Information:
- Phone: ${data.contact.phone || 'Not provided'}
- Email: ${data.contact.email || 'Not provided'}
- Address: ${data.contact.address || 'Not provided'}

Emergency Contact:
${data.emergencyContact ? `
- Name: ${data.emergencyContact.name}
- Relationship: ${data.emergencyContact.relationship || 'Not provided'}
- Phone: ${data.emergencyContact.phone || 'Not provided'}
` : '- Not provided'}

Insurance Information:
- Provider: ${data.insurance.provider}
- Claim Number: ${data.insurance.claimNumber}
- Claims Adjustor: ${data.insurance.adjustorName}
- Adjustor Phone: ${data.insurance.adjustorPhone || 'Not provided'}
- Adjustor Email: ${data.insurance.adjustorEmail || 'Not provided'}

Legal Representative:
- Name: ${data.legalRep.name}
- Firm: ${data.legalRep.firm}
- Phone: ${data.legalRep.phone || 'Not provided'}
- Email: ${data.legalRep.email || 'Not provided'}
- Address: ${data.legalRep.address || 'Not provided'}
- File Number: ${data.legalRep.fileNumber}
`;
}

export function preparePrompt(data: Demographics, type: 'brief' | 'standard' | 'detailed'): string {
  const formattedData = formatDemographicsData(data);
  return defaultPrompts[type].replace('{data}', formattedData);
}