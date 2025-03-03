import { generateWithClaude } from '../../services/claude';
import { InjuryData } from './types';

export async function generateInjuriesNarrative(data: InjuryData) {
  const prompt = generatePrompt(data);
  return await generateWithClaude(prompt, {
    cacheKey: `section-${JSON.stringify(data)}`
  });
}

function generatePrompt(data: InjuryData): string {
  let prompt = 'Generate a narrative description of the injuries listed below:\n\n';

  prompt += `Date of Injury: ${data.date || 'Not specified'}\n\n`;

  if (data.injuries && data.injuries.length > 0) {
    data.injuries.forEach((injury, index) => {
      prompt += `Injury ${index + 1}:\n`;
      prompt += `Category: ${injury.category}\n`;
      prompt += `Type: ${injury.type}\n`;
      prompt += `Description: ${injury.description}\n`;
      prompt += injury.resolved ? `Resolved: Yes (${injury.resolutionDate})\n` : 'Resolved: No\n';
      prompt += '\n';
    });
  } else {
    prompt += 'No injuries provided\n';
  }

  return prompt;
}
