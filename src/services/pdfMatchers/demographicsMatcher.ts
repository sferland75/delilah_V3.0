/**
 * Demographics Pattern Matcher
 * 
 * This matcher extracts demographic information from PDF text content,
 * including name, date of birth, address, and contact information.
 */

import { PatternMatcher } from '../pdfInterfaces';

/**
 * Get pattern matcher for demographics section
 */
export function getDemographicsMatcher(): PatternMatcher {
  return {
    section: 'demographics',
    patterns: [
      /client\s*(?:name|information)/i,
      /personal\s*(?:information|details)/i,
      /patient\s*(?:information|details)/i,
      /demographic[s]?\s*(?:information|details|data)/i,
      /assessor\s*instructions/i,  // Added for assessment instruction documents
      /medical\s*legal\s*assessment/i,  // Added for assessment instruction documents
      /file\s*no/i,  // Added for assessment instruction documents
      /date\s*of\s*loss/i,  // Added for assessment instruction documents
      /dear\s*[:;]/i,  // Added for full assessment reports
      /report\s*(?:for|on)\s*:/i,  // Added for full assessment reports
      /assessment\s*(?:for|of)\s*:/i,  // Added for full assessment reports
      /client\s*(?:name|details)\s*:/i  // Added for full assessment reports
    ],
    extract: (text: string) => {
      const demographics: any = {};
      
      console.log("DEBUG - Demographics matcher running extraction");
      
      // Extract name (with improved pattern matching)
      const namePatterns = [
        /(?:client|patient)\s*name\s*[:\s]+([^\n,]+)/i,
        /(?:name|full\s*name)\s*[:\s]+([^\n,]+)/i,
        /name\s*:\s*([^\n,]+)/i,
        /(?:client|patient)\s*:\s*([^\n,]+)/i,  // For assessment instruction format
        /RE:\s*CLIENT:\s*([^\n,]+)/i,           // For assessment instruction format
        /CLIENT:\s*([^\n,]+)/i,                 // For assessment instruction format
        /dear\s*:\s*([^\n,]+)/i,                // For full assessment reports
        /report\s*(?:for|on)\s*:\s*([^\n,]+)/i, // For full assessment reports
        /assessment\s*(?:for|of)\s*:\s*([^\n,]+)/i, // For full assessment reports
        /(?:^|\n)([A-Z][a-z]+\s+[A-Z][a-z]+)(?=\s*,|\s*\n|\s*(?:is|was))/  // For names at the beginning of paragraphs
      ];
      
      for (const pattern of namePatterns) {
        const match = text.match(pattern);
        if (match && match[1]) {
          demographics.name = match[1].trim().replace(/^(?:Mr\.|Mrs\.|Ms\.|Dr\.)\s+/, '');
          console.log(`DEBUG - Demographics matcher found name: ${demographics.name}`);
          break;
        }
      }
      
      // Fallback if name not found but "Dear:" is present
      if (!demographics.name && text.includes("Dear:")) {
        const dearSection = text.split("Dear:")[1];
        if (dearSection) {
          const endOfName = dearSection.indexOf(",");
          if (endOfName > 0) {
            demographics.name = dearSection.substring(0, endOfName).trim();
            console.log(`DEBUG - Demographics matcher found name from Dear section: ${demographics.name}`);
          } else {
            // If no comma, take the first line
            const firstLine = dearSection.split("\n")[0];
            if (firstLine && firstLine.length < 50) { // Reasonable name length
              demographics.name = firstLine.trim();
              console.log(`DEBUG - Demographics matcher found name from Dear first line: ${demographics.name}`);
            }
          }
        }
      }
      
      // Extract DOB (with improved pattern matching)
      const dobPatterns = [
        /(?:date\s*of\s*birth|dob|birth\s*date)\s*[:\s]+([^\n,]+)/i,
        /(?:born|birth)\s*[:\s]+([^\n,]+)/i,
        /dob\s*:\s*([^\n,]+)/i,
        /DOB:\s*([^\n,]+)/i,
        /born\s*(?:on|in)\s+([A-Za-z]+\s+\d{1,2},?\s+\d{4})/i,
        /born\s*(?:on|in)\s+(\d{1,2}[-/]\d{1,2}[-/]\d{2,4})/i,
        /\b((?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},?\s+\d{4})\b/i
      ];
      
      for (const pattern of dobPatterns) {
        const match = text.match(pattern);
        if (match && match[1]) {
          demographics.dob = match[1].trim();
          console.log(`DEBUG - Demographics matcher found DOB: ${demographics.dob}`);
          break;
        }
      }
      
      // Extract age
      const agePatterns = [
        /(?:age|aged)\s*[:\s]+(\d+)/i,
        /(?:age|aged)\s*(\d+)\s*(?:years|yrs)/i,
        /(\d+)\s*(?:year|yr)s?\s*(?:old|of\s*age)/i,
        /(\d+)\s*y(?:\.o\.?|ears?\s*old)/i
      ];
      
      for (const pattern of agePatterns) {
        const match = text.match(pattern);
        if (match && match[1]) {
          demographics.age = match[1].trim();
          console.log(`DEBUG - Demographics matcher found age: ${demographics.age}`);
          break;
        }
      }
      
      // Extract date of loss (specific to medical-legal assessments)
      const dateOfLossPatterns = [
        /date\s*of\s*loss\s*[:\s]+([^\n,]+)/i,
        /loss\s*date\s*[:\s]+([^\n,]+)/i,
        /DATE\s*OF\s*LOSS:\s*([^\n,]+)/i,
        /(?:accident|incident|injury)\s*date\s*[:\s]+([^\n,]+)/i,
        /(?:mva|motor\s*vehicle\s*accident)\s*(?:on|date)\s*[:\s]+([^\n,]+)/i,
        /(?:occurred|happened)\s*(?:on|at)\s+([A-Za-z]+\s+\d{1,2},?\s+\d{4})/i,
        /(?:occurred|happened)\s*(?:on|at)\s+(\d{1,2}[-/]\d{1,2}[-/]\d{2,4})/i
      ];
      
      for (const pattern of dateOfLossPatterns) {
        const match = text.match(pattern);
        if (match && match[1]) {
          demographics.dateOfLoss = match[1].trim();
          console.log(`DEBUG - Demographics matcher found date of loss: ${demographics.dateOfLoss}`);
          break;
        }
      }
      
      // Extract file number
      const fileNumberPatterns = [
        /file\s*(?:number|no|#)\s*[:\s]+([^\n,]+)/i,
        /case\s*(?:number|no|#)\s*[:\s]+([^\n,]+)/i,
        /omega\s*file\s*no.?\s*:\s*([^\n,]+)/i,
        /FILE\s*NO.?\s*:\s*([^\n,]+)/i,
        /reference\s*(?:number|no|#)\s*[:\s]+([^\n,]+)/i,
        /claim\s*(?:number|no|#)\s*[:\s]+([^\n,]+)/i
      ];
      
      for (const pattern of fileNumberPatterns) {
        const match = text.match(pattern);
        if (match && match[1]) {
          demographics.fileNumber = match[1].trim();
          console.log(`DEBUG - Demographics matcher found file number: ${demographics.fileNumber}`);
          break;
        }
      }
      
      // Extract address
      const addressPatterns = [
        /(?:address|residence)\s*[:\s]+([^\n]+)/i,
        /(?:home|residential)\s*address\s*[:\s]+([^\n]+)/i,
        /address\s*:\s*([^\n]+)/i,
        /client's\s*home\s*:\s*([^\n]+)/i,
        /location[\s\S]+?Client's\s*Home:\s*([^\n]+)/i,
        /(?:resides|lives)\s*(?:at|in)\s+([^\n,\.]+)/i,
        /(?:residing|living)\s*(?:at|in)\s+([^\n,\.]+)/i
      ];
      
      for (const pattern of addressPatterns) {
        const match = text.match(pattern);
        if (match && match[1]) {
          demographics.address = match[1].trim();
          console.log(`DEBUG - Demographics matcher found address: ${demographics.address}`);
          break;
        }
      }
      
      // Extract phone
      const phonePatterns = [
        /(?:phone|telephone|contact)\s*(?:number)?\s*[:\s]+([^\n,]+)/i,
        /(?:cell|mobile)\s*(?:phone|number)?\s*[:\s]+([^\n,]+)/i,
        /phone\s*:\s*([^\n,]+)/i,
        /phone:\s*([0-9-]+)/i,
        /(?:contacted|reached)\s*(?:at|by)\s*(?:phone|telephone)\s*[:\s]+([^\n,]+)/i,
        /(?:\+\d{1,3}|\(\d{3}\)|\d{3})[-.\s]?\d{3}[-.\s]?\d{4}/
      ];
      
      for (const pattern of phonePatterns) {
        const match = text.match(pattern);
        if (match && match[1]) {
          demographics.phone = match[1].trim();
          console.log(`DEBUG - Demographics matcher found phone: ${demographics.phone}`);
          break;
        }
      }
      
      // Extract email
      const emailPatterns = [
        /(?:email|e-mail)\s*[:\s]+([^\n,]+)/i,
        /email\s*:\s*([^\n,]+)/i,
        /email:\s*([^\s,]+@[^\s,]+)/i,
        /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/
      ];
      
      for (const pattern of emailPatterns) {
        const match = text.match(pattern);
        if (match && match[1]) {
          demographics.email = match[1].trim();
          console.log(`DEBUG - Demographics matcher found email: ${demographics.email}`);
          break;
        }
      }
      
      // Extract gender
      const genderPatterns = [
        /(?:gender|sex)\s*[:\s]+([^\n,]+)/i,
        /(?:gender|sex)\s*:\s*([^\n,]+)/i,
        /\b(?:client|patient|individual)\s+is\s+a\s+(\d+)(?:-|\s*)(?:year|yr)(?:-|\s*)old\s+(male|female)/i,
        /\b(male|female)\s+(?:client|patient|individual)/i
      ];
      
      for (const pattern of genderPatterns) {
        const match = text.match(pattern);
        if (match) {
          if (pattern.toString().includes("client|patient|individual") && match[2]) {
            demographics.gender = match[2].trim();
          } else if (match[1]) {
            demographics.gender = match[1].trim();
          }
          console.log(`DEBUG - Demographics matcher found gender: ${demographics.gender}`);
          break;
        }
      }
      
      // Extract occupation
      const occupationPatterns = [
        /(?:occupation|profession|job)\s*[:\s]+([^\n,\.]+)/i,
        /(?:occupation|profession|job)\s*:\s*([^\n,\.]+)/i,
        /(?:works|worked)\s*as\s+(?:a|an)\s+([^\n,\.]+)/i,
        /(?:employed|working)\s*as\s+(?:a|an)\s+([^\n,\.]+)/i
      ];
      
      for (const pattern of occupationPatterns) {
        const match = text.match(pattern);
        if (match && match[1]) {
          demographics.occupation = match[1].trim();
          console.log(`DEBUG - Demographics matcher found occupation: ${demographics.occupation}`);
          break;
        }
      }
      
      // Look for assessment type in text
      const assessmentTypePatterns = [
        /(?:assessment|evaluation)\s*type\s*[:\s]+([^\n,]+)/i,
        /type\s*of\s*assessment\s*[:\s]+([^\n,]+)/i,
        /Type[\s\S]+?Attendant[\s\S]+?Care[\s\S]+?([^\n]+)/i,
        /in-home\s+assessment/i,
        /(?:occupational\s+therapy|ot)\s+assessment/i,
        /functional\s+assessment/i,
        /attendant\s+care\s+(?:needs\s+)?assessment/i
      ];
      
      for (const pattern of assessmentTypePatterns) {
        const match = text.match(pattern);
        if (match) {
          if (match[1]) {
            demographics.assessmentType = match[1].trim();
          } else {
            // For patterns without capture groups, use the whole match
            demographics.assessmentType = match[0].trim();
          }
          console.log(`DEBUG - Demographics matcher found assessment type: ${demographics.assessmentType}`);
          break;
        }
      }
      
      console.log("DEBUG - Demographics extraction complete, found fields:", Object.keys(demographics));
      return demographics;
    },
    confidence: (result: any) => {
      // Calculate confidence based on how many fields were extracted
      const fields = [
        'name', 'dob', 'age', 'address', 'phone', 'email', 
        'dateOfLoss', 'fileNumber', 'assessmentType', 'gender',
        'occupation'
      ];
      const extractedFields = fields.filter(field => result[field]);
      
      console.log(`DEBUG - Demographics confidence calculation - extracted ${extractedFields.length} of ${fields.length} fields`);
      console.log(`DEBUG - Demographics extracted fields: ${extractedFields.join(', ')}`);
      
      // Weight fields based on importance
      let score = 0;
      if (result.name) score += 0.25;
      if (result.dob || result.age) score += 0.15;
      if (result.dateOfLoss) score += 0.15;
      if (result.fileNumber) score += 0.15;
      
      // Add remaining fields with equal weight
      const remainingFields = extractedFields.filter(f => 
        !['name', 'dob', 'age', 'dateOfLoss', 'fileNumber'].includes(f)
      );
      score += remainingFields.length * (0.3 / (fields.length - 5));
      
      // Increase confidence slightly if we have address since that's important
      if (result.address) score += 0.05;
      
      console.log(`DEBUG - Demographics confidence score: ${score}`);
      return Math.min(score, 1); // Ensure score doesn't exceed 1
    }
  };
}
