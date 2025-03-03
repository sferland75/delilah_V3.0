/**
 * Attendant Care Pattern Matcher
 * 
 * This matcher extracts information about attendant care needs, current care,
 * and care recommendations from PDF text content.
 */

import { PatternMatcher } from '../pdfInterfaces';
import { extractListItems } from '../pdfExtraction';
import { 
  extractSelfCare,
  extractHomeCare,
  extractSupervision,
  extractCurrentCare,
  extractRecommendations
} from './attendantCareExtractors';

/**
 * Get pattern matcher for attendant care section
 */
export function getAttendantCareMatcher(): PatternMatcher {
  return {
    section: 'attendantCare',
    patterns: [
      /attendant\s*care/i,
      /(?:care|caregiving|assistance)\s*(?:needs|requirements)/i,
      /(?:care\s*plan|care\s*assessment|care\s*needs\s*assessment)/i,
      /(?:personal|attendant|care)\s*(?:assistance|support|services)/i,
      /attendant\s*care\s*needs\s*assessment/i,  // Added for your document format
      /form\s*1/i                                // Added for your document format
    ],
    extract: (text: string) => {
      console.log("DEBUG - Attendant Care matcher running extraction");
      
      const attendantCare: any = {
        selfCare: {
          needs: [],
          frequency: '',
          duration: '',
          notes: ''
        },
        homecare: {
          needs: [],
          frequency: '',
          duration: '',
          notes: ''
        },
        supervision: {
          needs: [],
          frequency: '',
          duration: '',
          notes: ''
        },
        currentCare: {
          providers: [],
          schedule: '',
          hours: '',
          notes: ''
        },
        recommendations: {
          care_level: '',
          providers: [],
          hours: '',
          equipment: [],
          notes: ''
        }
      };
      
      // Check if document is an assessment instruction for attendant care
      const isAssessmentInstruction = /assessment.*?attendant\s*care/i.test(text) ||
                                      /attendant\s*care.*?assessment/i.test(text);
      
      if (isAssessmentInstruction) {
        console.log("DEBUG - Detected Attendant Care Assessment Instructions");
        
        // Extract assessment instruction details
        const assessmentDetails = {
          assessmentType: '',
          requester: '',
          provider: '',
          format: '',
          dueDate: '',
          location: '',
          instructions: ''
        };
        
        // Extract assessment type
        const typePatterns = [
          /(?:assessment|evaluation)\s*type\s*[:\s]+([^\n,]+)/i,
          /type\s*of\s*assessment\s*[:\s]+([^\n,]+)/i,
          /attendant\s*care\s*needs\s*assessment\s*with\s*form\s*1/i
        ];
        
        for (const pattern of typePatterns) {
          const match = text.match(pattern);
          if (match) {
            assessmentDetails.assessmentType = match[1] ? match[1].trim() : "Attendant Care Needs Assessment with Form 1";
            break;
          }
        }
        
        // Extract requester
        const requesterPatterns = [
          /on\s*behalf\s*of\s*([^\n,\.]+)/i,
          /for\s*([^\n,\.]+)/i,
          /referred\s*by\s*([^\n,\.]+)/i
        ];
        
        for (const pattern of requesterPatterns) {
          const match = text.match(pattern);
          if (match && match[1]) {
            assessmentDetails.requester = match[1].trim();
            break;
          }
        }
        
        // Extract instructions
        const instructionPatterns = [
          /instructions[^]*?(?:please|you will)[^]*?(?:addressing|conduct)[^]*?(?:impairments|assessment)([^]*?)(?:please|fee|below)/i,
          /you\s*will\s*be\s*conducting[^]*?(?:impairments|assessment)([^]*?)(?:please|fee|below)/i
        ];
        
        for (const pattern of instructionPatterns) {
          const match = text.match(pattern);
          if (match && match[1]) {
            assessmentDetails.instructions = match[1].trim();
            break;
          }
        }
        
        // Extract due date
        const dueDatePatterns = [
          /report\s*due\s*[:\s]+([^\n,]+)/i,
          /due\s*date\s*[:\s]+([^\n,]+)/i,
          /due\s*by\s*[:\s]+([^\n,]+)/i
        ];
        
        for (const pattern of dueDatePatterns) {
          const match = text.match(pattern);
          if (match && match[1]) {
            assessmentDetails.dueDate = match[1].trim();
            break;
          }
        }
        
        // Extract location
        const locationPatterns = [
          /location[:\s]+([^\n]+)/i,
          /client's\s*home\s*[:\s]+([^\n]+)/i,
          /assessment\s*location\s*[:\s]+([^\n]+)/i
        ];
        
        for (const pattern of locationPatterns) {
          const match = text.match(pattern);
          if (match && match[1]) {
            assessmentDetails.location = match[1].trim();
            break;
          }
        }
        
        // Add assessment details to attendant care data
        attendantCare.assessmentDetails = assessmentDetails;
        
        // Add some basic expected needs based on the document type
        if (/physical.*?cognitive.*?psych/i.test(text)) {
          attendantCare.selfCare.needs.push("Assessment of physical impairments");
          attendantCare.selfCare.needs.push("Assessment of cognitive impairments");
          attendantCare.selfCare.needs.push("Assessment of psychological impairments");
          attendantCare.selfCare.notes = "Comprehensive assessment addressing all impairment types required";
        }
        
        console.log("DEBUG - Extracted assessment details:", assessmentDetails);
      } else {
        // Process regular attendant care data if not an assessment instruction
        // Extract general attendant care section
        let attendantCareText = '';
        const attendantCarePatterns = [
          /attendant\s*care\s*[:;]([^]*?)(?:(?:assessment|evaluation|treatment|plan|recommendations)|\n\s*\n\s*\n)/i,
          /(?:care|caregiving|assistance)\s*(?:needs|requirements)\s*[:;]([^]*?)(?:(?:assessment|evaluation|treatment|plan|recommendations)|\n\s*\n\s*\n)/i,
          /(?:care\s*plan|care\s*assessment|care\s*needs)\s*[:;]([^]*?)(?:(?:assessment|evaluation|treatment|plan|recommendations)|\n\s*\n\s*\n)/i
        ];
        
        for (const pattern of attendantCarePatterns) {
          const match = text.match(pattern);
          if (match && match[1]) {
            attendantCareText = match[1].trim();
            break;
          }
        }
        
        // If no overall section, use the entire text
        if (!attendantCareText) {
          attendantCareText = text;
        }
        
        // Process each section using the respective extractors
        attendantCare.selfCare = extractSelfCare(attendantCareText, attendantCare.selfCare);
        attendantCare.homecare = extractHomeCare(attendantCareText, attendantCare.homecare);
        attendantCare.supervision = extractSupervision(attendantCareText, attendantCare.supervision);
        attendantCare.currentCare = extractCurrentCare(attendantCareText, attendantCare.currentCare);
        attendantCare.recommendations = extractRecommendations(attendantCareText, attendantCare.recommendations);
      }
      
      console.log("DEBUG - Attendant Care extraction complete");
      return attendantCare;
    },
    confidence: (result: any) => {
      console.log("DEBUG - Attendant Care calculating confidence score");
      
      // Check if this is an assessment instruction
      if (result.assessmentDetails) {
        console.log("DEBUG - Calculating confidence for assessment instructions");
        let instructionScore = 0;
        
        // Base score for having assessment details
        instructionScore += 0.3;
        
        // Add points for each populated field
        if (result.assessmentDetails.assessmentType) instructionScore += 0.1;
        if (result.assessmentDetails.requester) instructionScore += 0.1;
        if (result.assessmentDetails.instructions) instructionScore += 0.2;
        if (result.assessmentDetails.dueDate) instructionScore += 0.1;
        if (result.assessmentDetails.location) instructionScore += 0.2;
        
        // If document clearly mentions attendant care assessment
        if (/attendant\s*care\s*needs\s*assessment/i.test(result.assessmentDetails.assessmentType)) {
          instructionScore += 0.2;
        }
        
        const finalScore = Math.min(instructionScore, 1);
        console.log(`DEBUG - Attendant Care instruction confidence score: ${finalScore}`);
        return finalScore;
      }
      
      // Regular attendant care assessment confidence calculation
      let score = 0;
      const selfCareWeight = 0.2;
      const homecareWeight = 0.2;
      const supervisionWeight = 0.2;
      const currentCareWeight = 0.2;
      const recommendationsWeight = 0.2;
      
      // Calculate self care score
      let selfCareScore = 0;
      if (result.selfCare.needs && result.selfCare.needs.length > 0) {
        selfCareScore += 0.6 * Math.min(1, result.selfCare.needs.length / 3);
      }
      if (result.selfCare.frequency) selfCareScore += 0.2;
      if (result.selfCare.duration) selfCareScore += 0.2;
      
      // Calculate home care score
      let homecareScore = 0;
      if (result.homecare.needs && result.homecare.needs.length > 0) {
        homecareScore += 0.6 * Math.min(1, result.homecare.needs.length / 3);
      }
      if (result.homecare.frequency) homecareScore += 0.2;
      if (result.homecare.duration) homecareScore += 0.2;
      
      // Calculate supervision score
      let supervisionScore = 0;
      if (result.supervision.needs && result.supervision.needs.length > 0) {
        supervisionScore += 0.6 * Math.min(1, result.supervision.needs.length / 3);
      }
      if (result.supervision.frequency) supervisionScore += 0.2;
      if (result.supervision.duration) supervisionScore += 0.2;
      
      // Calculate current care score
      let currentCareScore = 0;
      if (result.currentCare.providers && result.currentCare.providers.length > 0) {
        currentCareScore += 0.4 * Math.min(1, result.currentCare.providers.length / 2);
      }
      if (result.currentCare.schedule) currentCareScore += 0.3;
      if (result.currentCare.hours) currentCareScore += 0.3;
      
      // Calculate recommendations score
      let recommendationsScore = 0;
      if (result.recommendations.care_level) recommendationsScore += 0.2;
      if (result.recommendations.providers && result.recommendations.providers.length > 0) {
        recommendationsScore += 0.3 * Math.min(1, result.recommendations.providers.length / 2);
      }
      if (result.recommendations.hours) recommendationsScore += 0.2;
      if (result.recommendations.equipment && result.recommendations.equipment.length > 0) {
        recommendationsScore += 0.3 * Math.min(1, result.recommendations.equipment.length / 2);
      }
      
      // Calculate total score
      score = (selfCareScore * selfCareWeight) + 
              (homecareScore * homecareWeight) + 
              (supervisionScore * supervisionWeight) + 
              (currentCareScore * currentCareWeight) + 
              (recommendationsScore * recommendationsWeight);
      
      console.log(`DEBUG - Attendant Care regular confidence score: ${score}`);
      return score;
    }
  };
}
