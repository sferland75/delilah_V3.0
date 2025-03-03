/**
 * Symptoms Pattern Matcher
 * 
 * This matcher extracts symptoms information from PDF text content,
 * including physical, cognitive, and emotional symptoms.
 */

import { PatternMatcher } from '../pdfInterfaces';
import { extractListItems, extractSeverity, extractImpact } from '../pdfExtraction';

/**
 * Get pattern matcher for symptoms section
 */
export function getSymptomsMatcher(): PatternMatcher {
  return {
    section: 'symptoms',
    patterns: [
      /(?:symptoms|complaints|presenting\s*concerns)/i,
      /(?:physical|cognitive|emotional)\s*symptoms/i,
      /(?:reported|presenting|current)\s*(?:symptoms|problems)/i,
      /(?:chief\s*complaint|primary\s*concern)/i
    ],
    extract: (text: string) => {
      const symptoms: any = {
        physical: [],
        cognitive: [],
        emotional: []
      };
      
      // Extract physical symptoms
      const physicalPatterns = [
        /(?:physical\s*symptoms|physical\s*complaints|somatic\s*symptoms)\s*[:;]([^]*?)(?:(?:cognitive|emotional|assessment|treatment)|\n\s*\n)/i,
        /(?:pain|discomfort|physical\s*limitations)\s*[:;]([^]*?)(?:(?:cognitive|emotional|assessment|treatment)|\n\s*\n)/i
      ];
      
      for (const pattern of physicalPatterns) {
        const match = text.match(pattern);
        if (match && match[1]) {
          const physicalText = match[1].trim();
          const physicalItems = extractListItems(physicalText);
          
          if (physicalItems.length > 0) {
            symptoms.physical = physicalItems.map(item => ({
              symptom: item.trim(),
              severity: extractSeverity(item),
              impact: extractImpact(item)
            }));
            break;
          }
        }
      }
      
      // If no specific physical symptoms section found, try to find pain descriptions
      if (symptoms.physical.length === 0) {
        const painPatterns = [
          /(?:reports|complains\s*of)\s*(?:pain|discomfort)\s*(?:in|at|with)\s*([^.]*)/i,
          /pain\s*(?:rated|described\s*as)\s*([^.]*)/i,
          /experiences\s*(?:pain|discomfort)\s*(?:in|at|with)\s*([^.]*)/i
        ];
        
        for (const pattern of painPatterns) {
          const matches = text.match(new RegExp(pattern, 'gi'));
          if (matches && matches.length > 0) {
            matches.forEach(matchText => {
              const match = matchText.match(pattern);
              if (match && match[1]) {
                symptoms.physical.push({
                  symptom: `Pain: ${match[1].trim()}`,
                  severity: extractSeverity(matchText),
                  impact: extractImpact(matchText)
                });
              }
            });
          }
        }
      }
      
      // Extract cognitive symptoms
      const cognitivePatterns = [
        /(?:cognitive\s*symptoms|cognitive\s*complaints|cognitive\s*issues)\s*[:;]([^]*?)(?:(?:physical|emotional|assessment|treatment)|\n\s*\n)/i,
        /(?:memory|concentration|attention|cognitive)\s*(?:issues|problems|deficits)\s*[:;]([^]*?)(?:(?:physical|emotional|assessment|treatment)|\n\s*\n)/i,
        /(?:cognitive|mental)\s*(?:status|function|functioning)\s*[:;]([^]*?)(?:(?:physical|emotional|assessment|treatment)|\n\s*\n)/i
      ];
      
      for (const pattern of cognitivePatterns) {
        const match = text.match(pattern);
        if (match && match[1]) {
          const cognitiveText = match[1].trim();
          const cognitiveItems = extractListItems(cognitiveText);
          
          if (cognitiveItems.length > 0) {
            symptoms.cognitive = cognitiveItems.map(item => ({
              symptom: item.trim(),
              impact: extractImpact(item)
            }));
            break;
          }
        }
      }
      
      // If no specific cognitive section, look for common cognitive issues
      if (symptoms.cognitive.length === 0) {
        const cognitionKeywords = [
          'memory', 'concentration', 'attention', 'focus', 'processing',
          'planning', 'organization', 'problem solving', 'confusion',
          'disorientation', 'thinking', 'judgment', 'decision'
        ];
        
        for (const keyword of cognitionKeywords) {
          const pattern = new RegExp(`(?:difficulty|problem|issue|impairment)\\s+(?:with|in)\\s+${keyword}`, 'i');
          const matches = text.match(new RegExp(pattern, 'gi'));
          
          if (matches && matches.length > 0) {
            matches.forEach(matchText => {
              symptoms.cognitive.push({
                symptom: matchText.trim(),
                impact: extractImpact(matchText)
              });
            });
          }
        }
      }
      
      // Extract emotional symptoms
      const emotionalPatterns = [
        /(?:emotional\s*symptoms|emotional\s*state|mood|psychological\s*symptoms)\s*[:;]([^]*?)(?:(?:physical|cognitive|assessment|treatment)|\n\s*\n)/i,
        /(?:anxiety|depression|mental\s*health)\s*(?:issues|symptoms|concerns)\s*[:;]([^]*?)(?:(?:physical|cognitive|assessment|treatment)|\n\s*\n)/i,
        /(?:mood|affect|psychological\s*status)\s*[:;]([^]*?)(?:(?:physical|cognitive|assessment|treatment)|\n\s*\n)/i
      ];
      
      for (const pattern of emotionalPatterns) {
        const match = text.match(pattern);
        if (match && match[1]) {
          const emotionalText = match[1].trim();
          const emotionalItems = extractListItems(emotionalText);
          
          if (emotionalItems.length > 0) {
            symptoms.emotional = emotionalItems.map(item => ({
              symptom: item.trim(),
              impact: extractImpact(item)
            }));
            break;
          }
        }
      }
      
      // If no specific emotional section, look for common emotional terms
      if (symptoms.emotional.length === 0) {
        const emotionKeywords = [
          'anxiety', 'depression', 'mood', 'stress', 'irritability',
          'frustration', 'anger', 'sadness', 'grief', 'emotional',
          'worry', 'fear', 'panic', 'hopelessness'
        ];
        
        for (const keyword of emotionKeywords) {
          const pattern = new RegExp(`(?:reports|experiences|shows|exhibits|presents\\s+with)\\s+(?:symptoms\\s+of\\s+)?${keyword}`, 'i');
          const matches = text.match(new RegExp(pattern, 'gi'));
          
          if (matches && matches.length > 0) {
            matches.forEach(matchText => {
              symptoms.emotional.push({
                symptom: matchText.trim(),
                impact: extractImpact(matchText)
              });
            });
          }
        }
      }
      
      return symptoms;
    },
    confidence: (result: any) => {
      // Calculate confidence based on presence and quantity of data
      let score = 0;
      const physicalWeight = 0.6; // Physical symptoms weight
      const cognitiveWeight = 0.2; // Cognitive symptoms weight
      const emotionalWeight = 0.2; // Emotional symptoms weight
      
      // Check physical symptoms
      if (result.physical && result.physical.length > 0) {
        score += physicalWeight * Math.min(1, result.physical.length / 2); // More physical symptoms = higher confidence, max at 2
      }
      
      // Check cognitive symptoms
      if (result.cognitive && result.cognitive.length > 0) {
        score += cognitiveWeight * Math.min(1, result.cognitive.length / 2); // More cognitive symptoms = higher confidence, max at 2
      }
      
      // Check emotional symptoms
      if (result.emotional && result.emotional.length > 0) {
        score += emotionalWeight * Math.min(1, result.emotional.length / 2); // More emotional symptoms = higher confidence, max at 2
      }
      
      return score;
    }
  };
}
