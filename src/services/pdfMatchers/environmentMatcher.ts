/**
 * Environment Pattern Matcher
 * 
 * This matcher extracts environmental assessment information from PDF text content,
 * including home layout, safety issues, accessibility concerns, and adaptive equipment.
 */

import { PatternMatcher } from '../pdfInterfaces';
import { extractListItems } from '../pdfExtraction';

/**
 * Get pattern matcher for environmental assessment section
 */
export function getEnvironmentMatcher(): PatternMatcher {
  return {
    section: 'environment',
    patterns: [
      /(?:environmental|home)\s*assessment/i,
      /(?:home|housing|living)\s*(?:evaluation|environment)/i,
      /(?:environmental|home)\s*(?:factors|concerns|issues)/i,
      /(?:residential|dwelling)\s*(?:assessment|evaluation)/i
    ],
    extract: (text: string) => {
      const environment: any = {
        dwelling: {
          type: '',
          layout: '',
          access: '',
          floors: 0,
          bedrooms: 0,
          bathrooms: 0,
          notes: []
        },
        safety: {
          concerns: [],
          recommendations: []
        },
        accessibility: {
          barriers: [],
          modifications: []
        },
        equipment: {
          current: [],
          recommended: []
        }
      };
      
      // Extract general environmental section
      let environmentText = '';
      const environmentPatterns = [
        /(?:environmental|home)\s*assessment\s*[:;]([^]*?)(?:(?:adls|treatments|recommendations|plan)|\n\s*\n\s*\n)/i,
        /(?:home|housing|living)\s*(?:evaluation|environment)\s*[:;]([^]*?)(?:(?:adls|treatments|recommendations|plan)|\n\s*\n\s*\n)/i,
        /(?:environmental|home)\s*(?:factors|concerns|issues)\s*[:;]([^]*?)(?:(?:adls|treatments|recommendations|plan)|\n\s*\n\s*\n)/i
      ];
      
      for (const pattern of environmentPatterns) {
        const match = text.match(pattern);
        if (match && match[1]) {
          environmentText = match[1].trim();
          break;
        }
      }
      
      // If no overall section, use the entire text
      if (!environmentText) {
        environmentText = text;
      }
      
      // Extract dwelling information
      let dwellingText = '';
      const dwellingPatterns = [
        /(?:residence|home|dwelling|housing)\s*(?:type|information|details)\s*[:;]([^]*?)(?:(?:safety|accessibility|equipment|barriers)|\n\s*\n)/i,
        /(?:housing|living\s*arrangement|dwelling)\s*[:;]([^]*?)(?:(?:safety|accessibility|equipment|barriers)|\n\s*\n)/i,
        /(?:type\s*of\s*home|residential\s*setting)\s*[:;]([^]*?)(?:(?:safety|accessibility|equipment|barriers)|\n\s*\n)/i
      ];
      
      for (const pattern of dwellingPatterns) {
        const match = environmentText.match(pattern);
        if (match && match[1]) {
          dwellingText = match[1].trim();
          break;
        }
      }
      
      // Process dwelling text if found
      if (dwellingText) {
        // Extract dwelling type
        const typePatterns = [
          /(?:type|style)\s*(?:of)?\s*(?:residence|dwelling|home)\s*[:;]\s*([^.,;]+)/i,
          /(?:residence|dwelling|home)\s*(?:is|consists\s*of)\s*(?:a|an)?\s*([^.,;]+)/i,
          /(?:lives|resides)\s*in\s*(?:a|an)?\s*([^.,;]+)/i
        ];
        
        for (const pattern of typePatterns) {
          const match = dwellingText.match(pattern);
          if (match && match[1]) {
            environment.dwelling.type = match[1].trim();
            break;
          }
        }
        
        // Extract number of floors
        const floorPatterns = [
          /(\d+)(?:-|\s*)(?:story|floor|level)/i,
          /(?:story|floor|level)s?\s*[:;]\s*(\d+)/i,
          /(?:home|residence|dwelling)\s*has\s*(\d+)\s*(?:story|floor|level)/i
        ];
        
        for (const pattern of floorPatterns) {
          const match = dwellingText.match(pattern);
          if (match && match[1]) {
            environment.dwelling.floors = parseInt(match[1], 10);
            break;
          }
        }
        
        // Extract number of bedrooms
        const bedroomPatterns = [
          /(\d+)\s*(?:bedroom|bed)/i,
          /(?:bedroom|bed)s?\s*[:;]\s*(\d+)/i,
          /(?:home|residence|dwelling)\s*has\s*(\d+)\s*(?:bedroom|bed)/i
        ];
        
        for (const pattern of bedroomPatterns) {
          const match = dwellingText.match(pattern);
          if (match && match[1]) {
            environment.dwelling.bedrooms = parseInt(match[1], 10);
            break;
          }
        }
        
        // Extract number of bathrooms
        const bathroomPatterns = [
          /(\d+(?:\.\d+)?)\s*(?:bathroom|bath)/i,
          /(?:bathroom|bath)s?\s*[:;]\s*(\d+(?:\.\d+)?)/i,
          /(?:home|residence|dwelling)\s*has\s*(\d+(?:\.\d+)?)\s*(?:bathroom|bath)/i
        ];
        
        for (const pattern of bathroomPatterns) {
          const match = dwellingText.match(pattern);
          if (match && match[1]) {
            environment.dwelling.bathrooms = parseFloat(match[1]);
            break;
          }
        }
        
        // Extract home layout information
        const layoutPatterns = [
          /(?:layout|floor\s*plan)\s*[:;]\s*([^.]+)/i,
          /(?:layout|floor\s*plan)\s*(?:is|consists\s*of)\s*([^.]+)/i,
          /(?:home|residence|dwelling)\s*(?:layout|arranged|organized)\s*([^.]+)/i
        ];
        
        for (const pattern of layoutPatterns) {
          const match = dwellingText.match(pattern);
          if (match && match[1]) {
            environment.dwelling.layout = match[1].trim();
            break;
          }
        }
        
        // Extract access information
        const accessPatterns = [
          /(?:access|entry|entrance)\s*[:;]\s*([^.]+)/i,
          /(?:access|entry|entrance)\s*(?:is|consists\s*of)\s*([^.]+)/i,
          /(?:home|residence|dwelling)\s*(?:is\s*accessed|entered)\s*(?:via|through|by)\s*([^.]+)/i
        ];
        
        for (const pattern of accessPatterns) {
          const match = dwellingText.match(pattern);
          if (match && match[1]) {
            environment.dwelling.access = match[1].trim();
            break;
          }
        }
        
        // Extract additional notes about dwelling
        const notePatterns = [
          /(?:note|observation|remark)\s*[:;]\s*([^.]+)/i,
          /(?:it\s*is|there\s*is|inspector|assessor)\s*(?:noted|observed|remarked)\s*that\s*([^.]+)/i
        ];
        
        for (const pattern of notePatterns) {
          const matches = dwellingText.match(new RegExp(pattern, 'gi'));
          if (matches && matches.length > 0) {
            matches.forEach(matchText => {
              const noteMatch = matchText.match(pattern);
              if (noteMatch && noteMatch[1]) {
                environment.dwelling.notes.push(noteMatch[1].trim());
              }
            });
          }
        }
      }
      
      // Extract safety information
      let safetyText = '';
      const safetyPatterns = [
        /(?:safety|hazard|risk)\s*(?:concerns|issues|assessment)\s*[:;]([^]*?)(?:(?:accessibility|equipment|modifications)|\n\s*\n)/i,
        /(?:safety|hazard|risk)\s*[:;]([^]*?)(?:(?:accessibility|equipment|modifications)|\n\s*\n)/i,
        /(?:home|environmental)\s*(?:safety|hazards|risks)\s*[:;]([^]*?)(?:(?:accessibility|equipment|modifications)|\n\s*\n)/i
      ];
      
      for (const pattern of safetyPatterns) {
        const match = environmentText.match(pattern);
        if (match && match[1]) {
          safetyText = match[1].trim();
          break;
        }
      }
      
      // Process safety text if found
      if (safetyText) {
        // Extract safety concerns
        const concernItems = extractListItems(safetyText);
        if (concernItems.length > 0) {
          environment.safety.concerns = concernItems.map(item => item.trim());
        } else {
          // If no list items found, look for specific safety issues
          const safetyIssuePatterns = [
            /(?:hazard|risk|concern|issue|unsafe|danger)\s*[:;]?\s*([^.,;]+)/i,
            /(?:identified|observed|noted|found)\s*(?:hazard|risk|concern|issue|unsafe|danger)\s*[:;]?\s*([^.,;]+)/i,
            /(?:trip|fall|burn|fire|electrical|gas|smoke|carbon\s*monoxide|medication)\s*(?:hazard|risk|concern|issue|unsafe|danger)\s*[:;]?\s*([^.,;]+)/i
          ];
          
          for (const pattern of safetyIssuePatterns) {
            const matches = safetyText.match(new RegExp(pattern, 'gi'));
            if (matches && matches.length > 0) {
              matches.forEach(matchText => {
                const issueMatch = matchText.match(pattern);
                if (issueMatch && issueMatch[1]) {
                  environment.safety.concerns.push(issueMatch[1].trim());
                }
              });
            }
          }
        }
        
        // Extract safety recommendations
        const recommendationPatterns = [
          /(?:recommend|suggest|advise|proposal)\s*[:;]?\s*([^.,;]+)/i,
          /(?:recommended|suggested|advised|proposed)\s*(?:that|to)\s*([^.,;]+)/i,
          /(?:recommendation|suggestion|advice)\s*[:;]?\s*([^.,;]+)/i
        ];
        
        for (const pattern of recommendationPatterns) {
          const matches = safetyText.match(new RegExp(pattern, 'gi'));
          if (matches && matches.length > 0) {
            matches.forEach(matchText => {
              const recMatch = matchText.match(pattern);
              if (recMatch && recMatch[1]) {
                environment.safety.recommendations.push(recMatch[1].trim());
              }
            });
          }
        }
      }
      
      // Extract accessibility information
      let accessibilityText = '';
      const accessibilityPatterns = [
        /(?:accessibility|barrier|access)\s*(?:concerns|issues|assessment)\s*[:;]([^]*?)(?:(?:safety|equipment|recommendations)|\n\s*\n)/i,
        /(?:accessibility|barrier|access)\s*[:;]([^]*?)(?:(?:safety|equipment|recommendations)|\n\s*\n)/i,
        /(?:home|environmental)\s*(?:accessibility|barriers|access)\s*[:;]([^]*?)(?:(?:safety|equipment|recommendations)|\n\s*\n)/i
      ];
      
      for (const pattern of accessibilityPatterns) {
        const match = environmentText.match(pattern);
        if (match && match[1]) {
          accessibilityText = match[1].trim();
          break;
        }
      }
      
      // Process accessibility text if found
      if (accessibilityText) {
        // Extract accessibility barriers
        const barrierItems = extractListItems(accessibilityText);
        if (barrierItems.length > 0) {
          environment.accessibility.barriers = barrierItems.map(item => item.trim());
        } else {
          // If no list items found, look for specific barrier mentions
          const barrierPatterns = [
            /(?:barrier|inaccessible|difficult\s*to\s*access|challenging|obstacle)\s*[:;]?\s*([^.,;]+)/i,
            /(?:identified|observed|noted|found)\s*(?:barrier|inaccessible|difficult\s*to\s*access)\s*[:;]?\s*([^.,;]+)/i,
            /(?:stairs|steps|narrow|doorway|bathroom|kitchen|bedroom|threshold|carpet|flooring)\s*(?:barrier|inaccessible|difficult\s*to\s*access)\s*[:;]?\s*([^.,;]+)/i
          ];
          
          for (const pattern of barrierPatterns) {
            const matches = accessibilityText.match(new RegExp(pattern, 'gi'));
            if (matches && matches.length > 0) {
              matches.forEach(matchText => {
                const barrierMatch = matchText.match(pattern);
                if (barrierMatch && barrierMatch[1]) {
                  environment.accessibility.barriers.push(barrierMatch[1].trim());
                }
              });
            }
          }
        }
        
        // Extract accessibility modifications
        const modificationPatterns = [
          /(?:modification|adaptation|renovation|alteration)\s*[:;]?\s*([^.,;]+)/i,
          /(?:modified|adapted|renovated|altered)\s*(?:to|for|by)\s*([^.,;]+)/i,
          /(?:recommended|suggested|advised|proposed)\s*(?:modification|adaptation|renovation|alteration)\s*[:;]?\s*([^.,;]+)/i
        ];
        
        for (const pattern of modificationPatterns) {
          const matches = accessibilityText.match(new RegExp(pattern, 'gi'));
          if (matches && matches.length > 0) {
            matches.forEach(matchText => {
              const modMatch = matchText.match(pattern);
              if (modMatch && modMatch[1]) {
                environment.accessibility.modifications.push(modMatch[1].trim());
              }
            });
          }
        }
      }
      
      // Extract equipment information
      let equipmentText = '';
      const equipmentPatterns = [
        /(?:equipment|device|aid)\s*(?:assessment|evaluation|inventory)\s*[:;]([^]*?)(?:(?:safety|accessibility|recommendations)|\n\s*\n)/i,
        /(?:equipment|device|aid)\s*[:;]([^]*?)(?:(?:safety|accessibility|recommendations)|\n\s*\n)/i,
        /(?:adaptive|assistive|durable\s*medical)\s*(?:equipment|device|aid)\s*[:;]([^]*?)(?:(?:safety|accessibility|recommendations)|\n\s*\n)/i
      ];
      
      for (const pattern of equipmentPatterns) {
        const match = environmentText.match(pattern);
        if (match && match[1]) {
          equipmentText = match[1].trim();
          break;
        }
      }
      
      // Process equipment text if found
      if (equipmentText) {
        // Extract current equipment
        const currentPatterns = [
          /(?:current|existing|present|in\s*use|in\s*place|available)\s*(?:equipment|device|aid)\s*[:;]([^]*?)(?:(?:recommended|suggested|needed)|\n\s*\n)/i,
          /(?:client|patient|individual)\s*(?:currently|presently)\s*(?:uses|has|utilizes)\s*[:;]?([^]*?)(?:(?:recommended|suggested|needed)|\n\s*\n)/i,
          /(?:equipment|device|aid)\s*(?:currently|presently)\s*(?:used|in\s*place|available)\s*[:;]([^]*?)(?:(?:recommended|suggested|needed)|\n\s*\n)/i
        ];
        
        let currentEquipmentText = '';
        for (const pattern of currentPatterns) {
          const match = equipmentText.match(pattern);
          if (match && match[1]) {
            currentEquipmentText = match[1].trim();
            break;
          }
        }
        
        if (currentEquipmentText) {
          const equipmentItems = extractListItems(currentEquipmentText);
          if (equipmentItems.length > 0) {
            environment.equipment.current = equipmentItems.map(item => item.trim());
          }
        } else {
          // If no specific current equipment section, look for mentions of equipment
          const equipmentMentionPatterns = [
            /(?:uses|has|utilizes)\s*(?:a|an)?\s*([^.,;]+(?:walker|cane|wheelchair|commode|bath\s*chair|grab\s*bar|rail)[^.,;]*)/i,
            /(?:a|an)?\s*([^.,;]+(?:walker|cane|wheelchair|commode|bath\s*chair|grab\s*bar|rail)[^.,;]*)\s*(?:is|are)\s*(?:used|utilized|in\s*place|available)/i
          ];
          
          for (const pattern of equipmentMentionPatterns) {
            const matches = equipmentText.match(new RegExp(pattern, 'gi'));
            if (matches && matches.length > 0) {
              matches.forEach(matchText => {
                const equipMatch = matchText.match(pattern);
                if (equipMatch && equipMatch[1]) {
                  environment.equipment.current.push(equipMatch[1].trim());
                }
              });
            }
          }
        }
        
        // Extract recommended equipment
        const recommendedPatterns = [
          /(?:recommended|suggested|needed|required)\s*(?:equipment|device|aid)\s*[:;]([^]*?)(?:(?:current|existing|present)|\n\s*\n|$)/i,
          /(?:recommend|suggest|need|require)\s*(?:the\s*following|these)?\s*(?:equipment|device|aid)\s*[:;]?([^]*?)(?:(?:current|existing|present)|\n\s*\n|$)/i,
          /(?:equipment|device|aid)\s*(?:recommendation|suggestion|need|requirement)\s*[:;]([^]*?)(?:(?:current|existing|present)|\n\s*\n|$)/i
        ];
        
        let recommendedEquipmentText = '';
        for (const pattern of recommendedPatterns) {
          const match = equipmentText.match(pattern);
          if (match && match[1]) {
            recommendedEquipmentText = match[1].trim();
            break;
          }
        }
        
        if (recommendedEquipmentText) {
          const equipmentItems = extractListItems(recommendedEquipmentText);
          if (equipmentItems.length > 0) {
            environment.equipment.recommended = equipmentItems.map(item => item.trim());
          }
        } else {
          // If no specific recommended equipment section, look for recommendations
          const recommendPatterns = [
            /(?:recommend|suggest|advise)\s*(?:a|an)?\s*([^.,;]+(?:walker|cane|wheelchair|commode|bath\s*chair|grab\s*bar|rail)[^.,;]*)/i,
            /(?:a|an)?\s*([^.,;]+(?:walker|cane|wheelchair|commode|bath\s*chair|grab\s*bar|rail)[^.,;]*)\s*(?:is|are)\s*(?:recommended|suggested|advised)/i
          ];
          
          for (const pattern of recommendPatterns) {
            const matches = equipmentText.match(new RegExp(pattern, 'gi'));
            if (matches && matches.length > 0) {
              matches.forEach(matchText => {
                const recMatch = matchText.match(pattern);
                if (recMatch && recMatch[1]) {
                  environment.equipment.recommended.push(recMatch[1].trim());
                }
              });
            }
          }
        }
      }
      
      return environment;
    },
    confidence: (result: any) => {
      // Calculate confidence based on presence and quantity of data
      let score = 0;
      const dwellingWeight = 0.25;
      const safetyWeight = 0.25;
      const accessibilityWeight = 0.25;
      const equipmentWeight = 0.25;
      
      // Calculate dwelling score
      let dwellingScore = 0;
      if (result.dwelling.type) dwellingScore += 0.2;
      if (result.dwelling.layout) dwellingScore += 0.15;
      if (result.dwelling.access) dwellingScore += 0.15;
      if (result.dwelling.floors > 0) dwellingScore += 0.1;
      if (result.dwelling.bedrooms > 0) dwellingScore += 0.1;
      if (result.dwelling.bathrooms > 0) dwellingScore += 0.1;
      if (result.dwelling.notes && result.dwelling.notes.length > 0) {
        dwellingScore += 0.2 * Math.min(1, result.dwelling.notes.length / 2);
      }
      
      // Calculate safety score
      let safetyScore = 0;
      if (result.safety.concerns && result.safety.concerns.length > 0) {
        safetyScore += 0.6 * Math.min(1, result.safety.concerns.length / 3);
      }
      if (result.safety.recommendations && result.safety.recommendations.length > 0) {
        safetyScore += 0.4 * Math.min(1, result.safety.recommendations.length / 2);
      }
      
      // Calculate accessibility score
      let accessibilityScore = 0;
      if (result.accessibility.barriers && result.accessibility.barriers.length > 0) {
        accessibilityScore += 0.6 * Math.min(1, result.accessibility.barriers.length / 3);
      }
      if (result.accessibility.modifications && result.accessibility.modifications.length > 0) {
        accessibilityScore += 0.4 * Math.min(1, result.accessibility.modifications.length / 2);
      }
      
      // Calculate equipment score
      let equipmentScore = 0;
      if (result.equipment.current && result.equipment.current.length > 0) {
        equipmentScore += 0.5 * Math.min(1, result.equipment.current.length / 3);
      }
      if (result.equipment.recommended && result.equipment.recommended.length > 0) {
        equipmentScore += 0.5 * Math.min(1, result.equipment.recommended.length / 3);
      }
      
      // Calculate total score
      score = (dwellingScore * dwellingWeight) + 
              (safetyScore * safetyWeight) + 
              (accessibilityScore * accessibilityWeight) + 
              (equipmentScore * equipmentWeight);
      
      return score;
    }
  };
}
