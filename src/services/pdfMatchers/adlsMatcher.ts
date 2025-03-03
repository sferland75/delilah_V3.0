/**
 * Activities of Daily Living (ADLs) Pattern Matcher
 * 
 * This matcher extracts information about basic ADLs, instrumental ADLs,
 * and leisure/recreation activities from PDF text content.
 */

import { PatternMatcher } from '../pdfInterfaces';
import { extractListItems } from '../pdfExtraction';
import { extractBasicADLs } from './adlsExtractors/basicADLsExtractor';
import { extractInstrumentalADLs } from './adlsExtractors/instrumentalADLsExtractor';
import { extractLeisureActivities } from './adlsExtractors/leisureExtractor';

/**
 * Get pattern matcher for ADLs section
 */
export function getADLsMatcher(): PatternMatcher {
  return {
    section: 'adls',
    patterns: [
      /activities\s*of\s*daily\s*living|ADLs/i,
      /(?:basic|instrumental)\s*(?:activities|ADLs)/i,
      /(?:self-care|self\s*care)\s*(?:activities|assessment|evaluation)/i,
      /(?:functional|daily)\s*(?:activities|tasks)/i
    ],
    extract: (text: string) => {
      const adls: any = {
        basic: {
          feeding: { status: '', notes: '' },
          bathing: { status: '', notes: '' },
          grooming: { status: '', notes: '' },
          dressing: { status: '', notes: '' },
          toileting: { status: '', notes: '' },
          transfers: { status: '', notes: '' },
          mobility: { status: '', notes: '' },
          other: []
        },
        instrumental: {
          meal_preparation: { status: '', notes: '' },
          medication_management: { status: '', notes: '' },
          money_management: { status: '', notes: '' },
          phone_use: { status: '', notes: '' },
          housekeeping: { status: '', notes: '' },
          laundry: { status: '', notes: '' },
          transportation: { status: '', notes: '' },
          shopping: { status: '', notes: '' },
          other: []
        },
        leisure: {
          activities: [],
          interests: [],
          barriers: [],
          notes: ''
        }
      };
      
      // Extract general ADLs section
      let adlsText = '';
      const adlsPatterns = [
        /activities\s*of\s*daily\s*living\s*[:;]([^]*?)(?:(?:assessment|evaluation|treatment|plan|care)|\n\s*\n\s*\n)/i,
        /(?:ADLs|ADL\s*status)\s*[:;]([^]*?)(?:(?:assessment|evaluation|treatment|plan|care)|\n\s*\n\s*\n)/i,
        /(?:functional|daily)\s*(?:activities|tasks)\s*[:;]([^]*?)(?:(?:assessment|evaluation|treatment|plan|care)|\n\s*\n\s*\n)/i
      ];
      
      for (const pattern of adlsPatterns) {
        const match = text.match(pattern);
        if (match && match[1]) {
          adlsText = match[1].trim();
          break;
        }
      }
      
      // If no overall section, use the entire text
      if (!adlsText) {
        adlsText = text;
      }
      
      // Extract basic ADLs information
      let basicADLsText = '';
      const basicADLsPatterns = [
        /basic\s*(?:activities\s*of\s*daily\s*living|ADLs|self-care|self\s*care)\s*[:;]([^]*?)(?:(?:instrumental|iadl|leisure|recreation|assessment)|\n\s*\n)/i,
        /(?:BADLs|basic\s*ADLs)\s*[:;]([^]*?)(?:(?:instrumental|iadl|leisure|recreation|assessment)|\n\s*\n)/i,
        /self(?:-|\s*)?care\s*(?:activities|tasks|status)\s*[:;]([^]*?)(?:(?:instrumental|iadl|leisure|recreation|assessment)|\n\s*\n)/i
      ];
      
      for (const pattern of basicADLsPatterns) {
        const match = adlsText.match(pattern);
        if (match && match[1]) {
          basicADLsText = match[1].trim();
          break;
        }
      }
      
      // If no specific basic ADLs section is found, use the general text
      if (!basicADLsText) {
        basicADLsText = adlsText;
      }
      
      // Extract instrumental ADLs information
      let instrumentalADLsText = '';
      const instrumentalADLsPatterns = [
        /instrumental\s*(?:activities\s*of\s*daily\s*living|ADLs)\s*[:;]([^]*?)(?:(?:basic|badl|leisure|recreation|assessment)|\n\s*\n)/i,
        /(?:IADLs|instrumental\s*ADLs)\s*[:;]([^]*?)(?:(?:basic|badl|leisure|recreation|assessment)|\n\s*\n)/i,
        /(?:household|community|home\s*management)\s*(?:activities|tasks|functions)\s*[:;]([^]*?)(?:(?:basic|badl|leisure|recreation|assessment)|\n\s*\n)/i
      ];
      
      for (const pattern of instrumentalADLsPatterns) {
        const match = adlsText.match(pattern);
        if (match && match[1]) {
          instrumentalADLsText = match[1].trim();
          break;
        }
      }
      
      // If no specific instrumental ADLs section is found, use the general text
      if (!instrumentalADLsText) {
        instrumentalADLsText = adlsText;
      }
      
      // Extract leisure and recreation information
      let leisureText = '';
      const leisurePatterns = [
        /(?:leisure|recreation|hobby|hobbies|interest|leisure\s*activities)\s*[:;]([^]*?)(?:(?:basic|badl|instrumental|iadl|assessment)|\n\s*\n|$)/i,
        /(?:leisure|recreation|hobby|pastimes)\s*(?:status|activities|interests|pursuits)\s*[:;]([^]*?)(?:(?:basic|badl|instrumental|iadl|assessment)|\n\s*\n|$)/i
      ];
      
      for (const pattern of leisurePatterns) {
        const match = adlsText.match(pattern);
        if (match && match[1]) {
          leisureText = match[1].trim();
          break;
        }
      }
      
      // If no specific leisure section is found, check for relevant keywords in the general text
      if (!leisureText) {
        leisureText = adlsText;
      }
      
      // Process each section using their respective extractors
      adls.basic = extractBasicADLs(basicADLsText, adls.basic);
      adls.instrumental = extractInstrumentalADLs(instrumentalADLsText, adls.instrumental);
      adls.leisure = extractLeisureActivities(leisureText, adls.leisure);
      
      return adls;
    },
    confidence: (result: any) => {
      // Calculate confidence based on presence and quantity of data
      let score = 0;
      const basicWeight = 0.4;
      const instrumentalWeight = 0.4;
      const leisureWeight = 0.2;
      
      // Calculate basic ADLs score
      let basicScore = 0;
      const basicFields = ['feeding', 'bathing', 'grooming', 'dressing', 'toileting', 'transfers', 'mobility'];
      let filledBasicFields = 0;
      
      for (const field of basicFields) {
        if (result.basic[field] && result.basic[field].status) {
          filledBasicFields++;
        }
      }
      
      basicScore = filledBasicFields / basicFields.length;
      
      // Calculate instrumental ADLs score
      let instrumentalScore = 0;
      const instrumentalFields = [
        'meal_preparation', 'medication_management', 'money_management', 
        'phone_use', 'housekeeping', 'laundry', 'transportation', 'shopping'
      ];
      let filledInstrumentalFields = 0;
      
      for (const field of instrumentalFields) {
        if (result.instrumental[field] && result.instrumental[field].status) {
          filledInstrumentalFields++;
        }
      }
      
      instrumentalScore = filledInstrumentalFields / instrumentalFields.length;
      
      // Calculate leisure score
      let leisureScore = 0;
      if (result.leisure.activities && result.leisure.activities.length > 0) {
        leisureScore += 0.5 * Math.min(1, result.leisure.activities.length / 2);
      }
      if (result.leisure.interests && result.leisure.interests.length > 0) {
        leisureScore += 0.3 * Math.min(1, result.leisure.interests.length / 2);
      }
      if (result.leisure.barriers && result.leisure.barriers.length > 0) {
        leisureScore += 0.2 * Math.min(1, result.leisure.barriers.length / 2);
      }
      
      // Calculate total score
      score = (basicScore * basicWeight) + 
              (instrumentalScore * instrumentalWeight) + 
              (leisureScore * leisureWeight);
      
      return score;
    }
  };
}
