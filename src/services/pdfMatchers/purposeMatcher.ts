/**
 * Purpose & Methodology Pattern Matcher
 * 
 * This matcher extracts information about the assessment's purpose,
 * objectives, and referral questions.
 */

import { PatternMatcher } from '../pdfInterfaces';
import { extractListItems } from '../pdfExtraction';

/**
 * Get pattern matcher for purpose section
 */
export function getPurposeMatcher(): PatternMatcher {
  return {
    section: 'purpose',
    patterns: [
      /(?:purpose|objective)s?\s*of\s*(?:assessment|evaluation)/i,
      /(?:reason|rationale)\s*for\s*(?:referral|assessment)/i,
      /assessment\s*(?:purpose|goals)/i
    ],
    extract: (text: string) => {
      const purpose: any = {
        primaryPurpose: '',
        assessmentObjectives: [],
        referralQuestions: []
      };
      
      // Extract primary purpose
      const purposePatterns = [
        /(?:purpose|objective)s?\s*of\s*(?:assessment|evaluation)[:\s]+([^\n]+)/i,
        /(?:reason|rationale)\s*for\s*(?:referral|assessment)[:\s]+([^\n]+)/i,
        /(?:this|the)\s*(?:assessment|evaluation|report)\s*(?:was|is)\s*(?:conducted|completed|prepared)\s*to\s*([^\n.]+)/i
      ];
      
      for (const pattern of purposePatterns) {
        const match = text.match(pattern);
        if (match && match[1]) {
          purpose.primaryPurpose = match[1].trim();
          break;
        }
      }
      
      // Extract objectives section
      const objectivePatterns = [
        /(?:assessment\s*objectives|objectives\s*of\s*assessment)\s*[:;]([^]*?)(?:(?:methodology|referral\s*questions|assessment)|\n\s*\n)/i,
        /(?:goals|aims|objectives)\s*[:;]([^]*?)(?:(?:methodology|referral\s*questions|assessment)|\n\s*\n)/i,
        /(?:specific\s*objectives|assessment\s*goals)\s*[:;]([^]*?)(?:(?:methodology|referral\s*questions|assessment)|\n\s*\n)/i
      ];
      
      for (const pattern of objectivePatterns) {
        const match = text.match(pattern);
        if (match && match[1]) {
          const objectivesText = match[1].trim();
          const objectiveItems = extractListItems(objectivesText);
          
          if (objectiveItems.length > 0) {
            purpose.assessmentObjectives = objectiveItems.map(item => item.trim());
            break;
          }
        }
      }
      
      // Extract referral questions
      const questionPatterns = [
        /(?:referral\s*questions|questions\s*to\s*address)\s*[:;]([^]*?)(?:(?:methodology|assessment|results)|\n\s*\n)/i,
        /(?:key\s*questions|issues\s*to\s*address)\s*[:;]([^]*?)(?:(?:methodology|assessment|results)|\n\s*\n)/i,
        /(?:specific\s*questions|areas\s*of\s*focus)\s*[:;]([^]*?)(?:(?:methodology|assessment|results)|\n\s*\n)/i
      ];
      
      for (const pattern of questionPatterns) {
        const match = text.match(pattern);
        if (match && match[1]) {
          const questionsText = match[1].trim();
          
          // Try to split by question marks first
          let questions = questionsText.split(/\?/).filter(q => q.trim().length > 0).map(q => q.trim() + '?');
          
          // If no questions with question marks, try to get list items
          if (questions.length === 0 || questions[0] === '?') {
            questions = extractListItems(questionsText);
          }
          
          if (questions.length > 0) {
            purpose.referralQuestions = questions;
            break;
          }
        }
      }
      
      return purpose;
    },
    confidence: (result: any) => {
      // Calculate confidence based on presence and quality of data
      let score = 0;
      
      // Primary purpose is important
      if (result.primaryPurpose) {
        const wordCount = result.primaryPurpose.split(/\s+/).length;
        score += 0.3 * Math.min(1, wordCount / 5); // More detailed = higher confidence, max at 5 words
      }
      
      // Assessment objectives
      if (result.assessmentObjectives && result.assessmentObjectives.length > 0) {
        score += 0.35 * Math.min(1, result.assessmentObjectives.length / 3); // More objectives = higher confidence, max at 3
      }
      
      // Referral questions
      if (result.referralQuestions && result.referralQuestions.length > 0) {
        score += 0.35 * Math.min(1, result.referralQuestions.length / 3); // More questions = higher confidence, max at 3
      }
      
      return score;
    }
  };
}

/**
 * Get pattern matcher for methodology section
 */
export function getMethodologyMatcher(): PatternMatcher {
  return {
    section: 'methodology',
    patterns: [
      /methodology/i,
      /assessment\s*(?:method|approach|procedure)/i,
      /(?:evaluation|assessment)\s*(?:process|methodology)/i
    ],
    extract: (text: string) => {
      const methodology: any = {
        methods: [],
        instruments: [],
        interviews: [],
        observations: []
      };
      
      // Extract methodology section
      const methodPatterns = [
        /(?:methodology|methods)\s*[:;]([^]*?)(?:(?:findings|results|assessment|summary)|\n\s*\n)/i,
        /(?:assessment|evaluation)\s*(?:methods|approach|procedure)\s*[:;]([^]*?)(?:(?:findings|results|assessment|summary)|\n\s*\n)/i
      ];
      
      let methodsText = '';
      for (const pattern of methodPatterns) {
        const match = text.match(pattern);
        if (match && match[1]) {
          methodsText = match[1].trim();
          break;
        }
      }
      
      if (methodsText) {
        // Extract general methods
        const methodItems = extractListItems(methodsText);
        if (methodItems.length > 0) {
          methodology.methods = methodItems.map(item => item.trim());
        }
        
        // Extract assessment instruments
        const instrumentPatterns = [
          /(?:assessment\s*instruments|standardized\s*(?:tests|measures|assessments))\s*(?:used|administered|include)?\s*[:;]([^]*?)(?:(?:interview|observation|procedure)|\n\s*\n)/i,
          /(?:tests|measures|assessments)\s*(?:used|administered|include)?\s*[:;]([^]*?)(?:(?:interview|observation|procedure)|\n\s*\n)/i
        ];
        
        for (const pattern of instrumentPatterns) {
          const match = methodsText.match(pattern);
          if (match && match[1]) {
            const instrumentText = match[1].trim();
            const instrumentItems = extractListItems(instrumentText);
            
            if (instrumentItems.length > 0) {
              methodology.instruments = instrumentItems.map(item => ({
                name: item.trim()
              }));
              break;
            }
          }
        }
        
        // Extract interviews
        if (methodsText.match(/interview/i)) {
          // Extract who was interviewed
          const intervieweePatterns = [
            /interview(?:ed|s)?\s*(?:with|of)?\s*([^.,;:]+)/i,
            /([^.,;:]+)\s*(?:was|were)\s*interviewed/i
          ];
          
          for (const pattern of intervieweePatterns) {
            const match = methodsText.match(pattern);
            if (match && match[1]) {
              methodology.interviews.push({
                person: match[1].trim()
              });
            }
          }
        }
        
        // Extract observations
        if (methodsText.match(/observ/i)) {
          // Extract what was observed
          const observationPatterns = [
            /observation(?:s)?\s*(?:of|in)?\s*([^.,;:]+)/i,
            /([^.,;:]+)\s*(?:was|were)\s*observed/i
          ];
          
          for (const pattern of observationPatterns) {
            const match = methodsText.match(pattern);
            if (match && match[1]) {
              methodology.observations.push({
                activity: match[1].trim()
              });
            }
          }
        }
      }
      
      return methodology;
    },
    confidence: (result: any) => {
      // Calculate confidence based on presence and quality of data
      let score = 0;
      
      // General methods
      if (result.methods && result.methods.length > 0) {
        score += 0.4 * Math.min(1, result.methods.length / 3); // More methods = higher confidence, max at 3
      }
      
      // Assessment instruments
      if (result.instruments && result.instruments.length > 0) {
        score += 0.3 * Math.min(1, result.instruments.length / 2); // More instruments = higher confidence, max at 2
      }
      
      // Interviews
      if (result.interviews && result.interviews.length > 0) {
        score += 0.15 * Math.min(1, result.interviews.length); // More interviews = higher confidence
      }
      
      // Observations
      if (result.observations && result.observations.length > 0) {
        score += 0.15 * Math.min(1, result.observations.length); // More observations = higher confidence
      }
      
      return score;
    }
  };
}
