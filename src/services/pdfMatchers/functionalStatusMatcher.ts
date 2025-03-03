/**
 * Functional Status Pattern Matcher
 * 
 * This matcher extracts functional status information from PDF text content,
 * including mobility, upper extremity function, and posture details.
 */

import { PatternMatcher } from '../pdfInterfaces';
import { extractListItems } from '../pdfExtraction';

/**
 * Get pattern matcher for functional status section
 */
export function getFunctionalStatusMatcher(): PatternMatcher {
  return {
    section: 'functionalStatus',
    patterns: [
      /functional\s*(?:status|assessment|evaluation)/i,
      /(?:mobility|physical\s*function)\s*assessment/i,
      /(?:physical|functional)\s*(?:abilities|capabilities|limitations)/i,
      /(?:current\s*|present\s*)?function(?:ing|al\s*status)/i
    ],
    extract: (text: string) => {
      const functionalStatus: any = {
        mobility: {
          ambulation: '',
          assistiveDevices: [],
          transferStatus: '',
          balance: '',
          endurance: '',
          limitations: []
        },
        upperExtremity: {
          dominance: '',
          range: '',
          strength: '',
          coordination: '',
          grip: '',
          limitations: []
        },
        posture: {
          sitting: '',
          standing: '',
          issues: [],
          notes: ''
        }
      };
      
      // Extract general functional status section
      let functionalText = '';
      const functionalPatterns = [
        /functional\s*(?:status|assessment|evaluation)\s*[:;]([^]*?)(?:(?:symptoms|treatment|plan|recommendation)|\n\s*\n)/i,
        /(?:physical|functional)\s*(?:abilities|capabilities|limitations)\s*[:;]([^]*?)(?:(?:symptoms|treatment|plan|recommendation)|\n\s*\n)/i,
        /(?:current\s*|present\s*)?function(?:ing|al\s*status)\s*[:;]([^]*?)(?:(?:symptoms|treatment|plan|recommendation)|\n\s*\n)/i
      ];
      
      for (const pattern of functionalPatterns) {
        const match = text.match(pattern);
        if (match && match[1]) {
          functionalText = match[1].trim();
          break;
        }
      }
      
      // If we didn't find a dedicated section, use the entire text
      if (!functionalText) {
        functionalText = text;
      }
      
      // Extract mobility information
      let mobilityText = '';
      const mobilityPatterns = [
        /(?:mobility|ambulation|gait)\s*[:;]([^]*?)(?:(?:upper\s*extremity|posture|sitting|treatment)|\n\s*\n)/i,
        /(?:walking|mobility|movement)\s*(?:ability|function|status)\s*[:;]([^]*?)(?:(?:upper\s*extremity|posture|sitting|treatment)|\n\s*\n)/i
      ];
      
      for (const pattern of mobilityPatterns) {
        const match = functionalText.match(pattern);
        if (match && match[1]) {
          mobilityText = match[1].trim();
          break;
        }
      }
      
      // Process mobility text if found
      if (mobilityText) {
        // Extract ambulation description
        const ambulationPatterns = [
          /(?:ambulates|walks)\s+([^.,;]+)/i,
          /(?:ambulation|gait)\s*[:;]\s*([^.,;]+)/i,
          /(?:ambulation|gait)\s+(?:is|was)\s+([^.,;]+)/i
        ];
        
        for (const pattern of ambulationPatterns) {
          const match = mobilityText.match(pattern);
          if (match && match[1]) {
            functionalStatus.mobility.ambulation = match[1].trim();
            break;
          }
        }
        
        // Extract assistive devices
        const devicePatterns = [
          /(?:uses|requires|with)\s+(?:a|an)?\s*([^.,;]+(?:walker|cane|wheelchair|crutch|brace)[^.,;]*)/i,
          /(?:assistive\s*devices?|mobility\s*aids?)\s*[:;]\s*([^.,;]+)/i,
          /(?:ambulates|moves|walks)\s+with\s+(?:a|an)?\s*([^.,;]+)/i
        ];
        
        for (const pattern of devicePatterns) {
          const matches = mobilityText.match(new RegExp(pattern, 'gi'));
          if (matches && matches.length > 0) {
            matches.forEach(matchText => {
              const deviceMatch = matchText.match(pattern);
              if (deviceMatch && deviceMatch[1]) {
                functionalStatus.mobility.assistiveDevices.push(deviceMatch[1].trim());
              }
            });
          }
        }
        
        // Remove duplicates
        functionalStatus.mobility.assistiveDevices = [...new Set(functionalStatus.mobility.assistiveDevices)];
        
        // Extract transfer status
        const transferPatterns = [
          /transfers\s+([^.,;]+)/i,
          /transfer(?:s|ring)?\s*(?:ability|status|function)\s*[:;]\s*([^.,;]+)/i,
          /(?:able|unable)\s+to\s+transfer\s+([^.,;]+)/i
        ];
        
        for (const pattern of transferPatterns) {
          const match = mobilityText.match(pattern);
          if (match && match[1]) {
            functionalStatus.mobility.transferStatus = match[1].trim();
            break;
          }
        }
        
        // Extract balance information
        const balancePatterns = [
          /balance\s+(?:is|was|appears|shows)\s+([^.,;]+)/i,
          /balance\s*[:;]\s*([^.,;]+)/i,
          /(?:presents|demonstrates)\s+with\s+([^.,;]+balance[^.,;]*)/i
        ];
        
        for (const pattern of balancePatterns) {
          const match = mobilityText.match(pattern);
          if (match && match[1]) {
            functionalStatus.mobility.balance = match[1].trim();
            break;
          }
        }
        
        // Extract endurance information
        const endurancePatterns = [
          /endurance\s+(?:is|was|appears|shows)\s+([^.,;]+)/i,
          /endurance\s*[:;]\s*([^.,;]+)/i,
          /(?:able|unable)\s+to\s+([^.,;]+without\s+fatigue[^.,;]*)/i,
          /(?:fatigues|tires)\s+(?:after|with|during)\s+([^.,;]+)/i
        ];
        
        for (const pattern of endurancePatterns) {
          const match = mobilityText.match(pattern);
          if (match && match[1]) {
            functionalStatus.mobility.endurance = match[1].trim();
            break;
          }
        }
        
        // Extract mobility limitations
        const limitationPatterns = [
          /(?:limited|difficulty|unable)\s+(?:in|with)\s+([^.,;]+)/i,
          /limitations?\s*(?:include|are|with)\s*[:;]?\s*([^.,;]+)/i,
          /(?:presents|demonstrates)\s+with\s+([^.,;]+limitation[^.,;]*)/i
        ];
        
        for (const pattern of limitationPatterns) {
          const matches = mobilityText.match(new RegExp(pattern, 'gi'));
          if (matches && matches.length > 0) {
            matches.forEach(matchText => {
              const limitMatch = matchText.match(pattern);
              if (limitMatch && limitMatch[1]) {
                functionalStatus.mobility.limitations.push(limitMatch[1].trim());
              }
            });
          }
        }
      }
      
      // Extract upper extremity information
      let upperExtremityText = '';
      const upperExtremityPatterns = [
        /(?:upper\s*extremity|arm|hand)\s*(?:function|status|ability)\s*[:;]([^]*?)(?:(?:mobility|posture|sitting|treatment)|\n\s*\n)/i,
        /(?:upper\s*extremity|arm|hand)\s*[:;]([^]*?)(?:(?:mobility|posture|sitting|treatment)|\n\s*\n)/i
      ];
      
      for (const pattern of upperExtremityPatterns) {
        const match = functionalText.match(pattern);
        if (match && match[1]) {
          upperExtremityText = match[1].trim();
          break;
        }
      }
      
      // Process upper extremity text if found
      if (upperExtremityText) {
        // Extract hand dominance
        const dominancePatterns = [
          /(?:right|left)\s*(?:hand)?\s*dominant/i,
          /dominance\s*[:;]\s*([^.,;]+)/i,
          /dominant\s*(?:hand|side|upper\s*extremity)\s*[:;]?\s*([^.,;]+)/i
        ];
        
        for (const pattern of dominancePatterns) {
          const match = upperExtremityText.match(pattern);
          if (match) {
            if (match[1]) {
              functionalStatus.upperExtremity.dominance = match[1].trim();
            } else {
              functionalStatus.upperExtremity.dominance = match[0].trim();
            }
            break;
          }
        }
        
        // Extract range of motion
        const rangePatterns = [
          /(?:range\s*of\s*motion|ROM)\s*[:;]\s*([^.,;]+)/i,
          /(?:range\s*of\s*motion|ROM)\s+(?:is|was|appears|shows)\s+([^.,;]+)/i,
          /(?:demonstrates|presents\s*with)\s+([^.,;]+(?:ROM|range\s*of\s*motion)[^.,;]*)/i
        ];
        
        for (const pattern of rangePatterns) {
          const match = upperExtremityText.match(pattern);
          if (match && match[1]) {
            functionalStatus.upperExtremity.range = match[1].trim();
            break;
          }
        }
        
        // Extract strength
        const strengthPatterns = [
          /(?:strength|muscle\s*strength)\s*[:;]\s*([^.,;]+)/i,
          /(?:strength|muscle\s*strength)\s+(?:is|was|appears|shows)\s+([^.,;]+)/i,
          /(?:demonstrates|presents\s*with)\s+([^.,;]+strength[^.,;]*)/i
        ];
        
        for (const pattern of strengthPatterns) {
          const match = upperExtremityText.match(pattern);
          if (match && match[1]) {
            functionalStatus.upperExtremity.strength = match[1].trim();
            break;
          }
        }
        
        // Extract coordination
        const coordinationPatterns = [
          /(?:coordination|dexterity)\s*[:;]\s*([^.,;]+)/i,
          /(?:coordination|dexterity)\s+(?:is|was|appears|shows)\s+([^.,;]+)/i,
          /(?:demonstrates|presents\s*with)\s+([^.,;]+(?:coordination|dexterity)[^.,;]*)/i
        ];
        
        for (const pattern of coordinationPatterns) {
          const match = upperExtremityText.match(pattern);
          if (match && match[1]) {
            functionalStatus.upperExtremity.coordination = match[1].trim();
            break;
          }
        }
        
        // Extract grip
        const gripPatterns = [
          /(?:grip|grasp)\s*(?:strength)?\s*[:;]\s*([^.,;]+)/i,
          /(?:grip|grasp)\s*(?:strength)?\s+(?:is|was|appears|shows)\s+([^.,;]+)/i,
          /(?:demonstrates|presents\s*with)\s+([^.,;]+(?:grip|grasp)[^.,;]*)/i
        ];
        
        for (const pattern of gripPatterns) {
          const match = upperExtremityText.match(pattern);
          if (match && match[1]) {
            functionalStatus.upperExtremity.grip = match[1].trim();
            break;
          }
        }
        
        // Extract upper extremity limitations
        const limitationPatterns = [
          /(?:limited|difficulty|unable)\s+(?:in|with)\s+([^.,;]+)/i,
          /limitations?\s*(?:include|are|with)\s*[:;]?\s*([^.,;]+)/i,
          /(?:presents|demonstrates)\s+with\s+([^.,;]+limitation[^.,;]*)/i
        ];
        
        for (const pattern of limitationPatterns) {
          const matches = upperExtremityText.match(new RegExp(pattern, 'gi'));
          if (matches && matches.length > 0) {
            matches.forEach(matchText => {
              const limitMatch = matchText.match(pattern);
              if (limitMatch && limitMatch[1]) {
                functionalStatus.upperExtremity.limitations.push(limitMatch[1].trim());
              }
            });
          }
        }
      }
      
      // Extract posture information
      let postureText = '';
      const posturePatterns = [
        /(?:posture|body\s*alignment)\s*[:;]([^]*?)(?:(?:mobility|upper\s*extremity|treatment)|\n\s*\n)/i,
        /(?:sitting|standing)\s*posture\s*[:;]([^]*?)(?:(?:mobility|upper\s*extremity|treatment)|\n\s*\n)/i
      ];
      
      for (const pattern of posturePatterns) {
        const match = functionalText.match(pattern);
        if (match && match[1]) {
          postureText = match[1].trim();
          break;
        }
      }
      
      // Process posture text if found
      if (postureText) {
        // Extract sitting posture
        const sittingPatterns = [
          /sitting\s*(?:posture)?\s*[:;]\s*([^.,;]+)/i,
          /(?:while|when)\s+sitting\s+([^.,;]+)/i,
          /(?:demonstrates|presents\s*with)\s+([^.,;]+sitting\s*posture[^.,;]*)/i
        ];
        
        for (const pattern of sittingPatterns) {
          const match = postureText.match(pattern);
          if (match && match[1]) {
            functionalStatus.posture.sitting = match[1].trim();
            break;
          }
        }
        
        // Extract standing posture
        const standingPatterns = [
          /standing\s*(?:posture)?\s*[:;]\s*([^.,;]+)/i,
          /(?:while|when)\s+standing\s+([^.,;]+)/i,
          /(?:demonstrates|presents\s*with)\s+([^.,;]+standing\s*posture[^.,;]*)/i
        ];
        
        for (const pattern of standingPatterns) {
          const match = postureText.match(pattern);
          if (match && match[1]) {
            functionalStatus.posture.standing = match[1].trim();
            break;
          }
        }
        
        // Extract posture issues
        const issuePatterns = [
          /(?:demonstrates|shows|exhibits|has)\s+([^.,;]+(?:kyphosis|lordosis|scoliosis|slouching|leaning)[^.,;]*)/i,
          /(?:postural|alignment)\s+(?:issues|problems|deviations)\s*[:;]?\s*([^.,;]+)/i,
          /(?:poor|abnormal|impaired)\s+(?:posture|alignment)\s+([^.,;]+)/i
        ];
        
        for (const pattern of issuePatterns) {
          const matches = postureText.match(new RegExp(pattern, 'gi'));
          if (matches && matches.length > 0) {
            matches.forEach(matchText => {
              const issueMatch = matchText.match(pattern);
              if (issueMatch && issueMatch[1]) {
                functionalStatus.posture.issues.push(issueMatch[1].trim());
              }
            });
          }
        }
      }
      
      return functionalStatus;
    },
    confidence: (result: any) => {
      // Calculate confidence based on presence of data in each category
      let score = 0;
      
      // Mobility section (weighted 40%)
      let mobilityScore = 0;
      if (result.mobility.ambulation) mobilityScore += 0.25;
      if (result.mobility.assistiveDevices && result.mobility.assistiveDevices.length > 0) mobilityScore += 0.2;
      if (result.mobility.transferStatus) mobilityScore += 0.2;
      if (result.mobility.balance) mobilityScore += 0.15;
      if (result.mobility.endurance) mobilityScore += 0.1;
      if (result.mobility.limitations && result.mobility.limitations.length > 0) mobilityScore += 0.1;
      
      // Upper extremity section (weighted 40%)
      let upperExtremityScore = 0;
      if (result.upperExtremity.dominance) upperExtremityScore += 0.1;
      if (result.upperExtremity.range) upperExtremityScore += 0.2;
      if (result.upperExtremity.strength) upperExtremityScore += 0.2;
      if (result.upperExtremity.coordination) upperExtremityScore += 0.2;
      if (result.upperExtremity.grip) upperExtremityScore += 0.2;
      if (result.upperExtremity.limitations && result.upperExtremity.limitations.length > 0) upperExtremityScore += 0.1;
      
      // Posture section (weighted 20%)
      let postureScore = 0;
      if (result.posture.sitting) postureScore += 0.4;
      if (result.posture.standing) postureScore += 0.4;
      if (result.posture.issues && result.posture.issues.length > 0) postureScore += 0.2;
      
      // Calculate total confidence score
      score = (mobilityScore * 0.4) + (upperExtremityScore * 0.4) + (postureScore * 0.2);
      
      return score;
    }
  };
}
