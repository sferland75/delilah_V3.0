/**
 * Medical History Pattern Matcher
 * 
 * This matcher extracts medical history information from PDF text content,
 * including conditions, surgeries, medications, and allergies.
 */

import { PatternMatcher } from '../pdfInterfaces';
import { extractListItems } from '../pdfExtraction';

/**
 * Get pattern matcher for medical history section
 */
export function getMedicalHistoryMatcher(): PatternMatcher {
  return {
    section: 'medicalHistory',
    patterns: [
      /(?:medical|health)\s*history/i,
      /past\s*(?:medical|health)/i,
      /previous\s*(?:conditions|diagnoses)/i,
      /(?:current|chronic)\s*conditions/i,
      /(?:health|medical)\s*(?:status|condition)/i,
      /prior\s*to\s*the\s*accident/i,
      /pre-accident\s*(?:health|functioning|conditions)/i,
      /pre-existing\s*(?:health|conditions)/i,
      /relevant\s*medical\s*(?:information|background)/i,
      /pmh/i,  // Common abbreviation for Past Medical History
      /pertinent\s*medical\s*(?:history|information)/i,
      /medical\s*background/i,  // Additional common phrases
      /health\s*background/i,
      /medical\s*profile/i,
      /past\s*history/i,
      /history\s*of\s*present\s*illness/i,
      /diagnostic\s*history/i,
      /occupational\s*therapy/i,  // Common in OT assessment reports
      /assessment/i,  // More general pattern to catch assessment sections
      /evaluation/i,  // More general pattern
      /functional\s*history/i,  // Functional history often contains medical history
      /client\s*(?:profile|information)/i  // Client information sections
    ],
    extract: (text: string) => {
      console.log("DEBUG - Medical History matcher running extraction");
      
      const medicalHistory: any = {
        conditions: [],
        surgeries: [],
        medications: [],
        allergies: [],
        preAccidentStatus: ''
      };
      
      // Extract general pre-accident status section
      const preAccidentPatterns = [
        /pre-accident\s*(?:status|functioning|health|condition)(?:\s*:|[^\n]*?was)([^]*?)(?:(?:accident|injury|incident|post-accident)|\n\s*\n)/i,
        /prior\s*to\s*the\s*accident(?:\s*:|[^\n]*?was)([^]*?)(?:(?:accident|injury|incident|post-accident)|\n\s*\n)/i,
        /pre-existing\s*(?:health|conditions|status)(?:\s*:|[^\n]*?included)([^]*?)(?:(?:accident|injury|incident|post-accident)|\n\s*\n)/i,
        /(?:medical|health)\s*history\s*prior\s*to\s*(?:accident|incident|injury)(?:\s*:|[^\n]*?included)([^]*?)(?:(?:accident|injury|incident|post-accident)|\n\s*\n)/i,
        /before\s*the\s*accident([^]*?)(?:(?:accident|injury|incident|post-accident)|\n\s*\n)/i,
        /medical\s*history([^]*?)(?:accident|injury|incident)/i,
        /client\s*had(?:[^.]*?)history\s*of([^.]*?)\./i,  // Client had history of...
        /client\s*reports\s*(?:a\s*)?history\s*of([^.]*?)\./i,  // Client reports history of...
        /history:\s*([^]*?)(?:assessment|evaluation|treatment|plan)/i  // History: section
      ];
      
      for (const pattern of preAccidentPatterns) {
        const match = text.match(pattern);
        if (match && match[1]) {
          medicalHistory.preAccidentStatus = match[1].trim();
          console.log(`DEBUG - Medical History matcher found pre-accident status: ${medicalHistory.preAccidentStatus.substring(0, 50)}...`);
          break;
        }
      }
      
      // If no specific pre-accident status found, look for general medical history
      if (!medicalHistory.preAccidentStatus) {
        const medicalHistoryPatterns = [
          /medical\s*history.*?([^]*?)(?:(?:medications|surgeries|assessment|treatment)|\n\s*\n)/i,
          /past\s*medical\s*history.*?([^]*?)(?:(?:medications|surgeries|assessment|treatment)|\n\s*\n)/i,
          /health\s*history.*?([^]*?)(?:(?:medications|surgeries|assessment|treatment)|\n\s*\n)/i,
          /background:.*?([^]*?)(?:(?:assessment|evaluation|plan)|\n\s*\n)/i,
          /history:.*?([^]*?)(?:(?:assessment|evaluation|plan)|\n\s*\n)/i,
          /client\s*profile:.*?([^]*?)(?:(?:assessment|evaluation|plan)|\n\s*\n)/i,
          /client\s*information:.*?([^]*?)(?:(?:assessment|evaluation|plan)|\n\s*\n)/i
        ];
        
        for (const pattern of medicalHistoryPatterns) {
          const match = text.match(pattern);
          if (match && match[1]) {
            medicalHistory.preAccidentStatus = match[1].trim();
            console.log(`DEBUG - Medical History matcher found general medical history: ${medicalHistory.preAccidentStatus.substring(0, 50)}...`);
            break;
          }
        }
      }
      
      // If still no medical history found, try to find any medical-related content
      if (!medicalHistory.preAccidentStatus) {
        // Look for paragraphs that might contain medical information
        const paragraphs = text.split(/\n\s*\n/);
        for (const paragraph of paragraphs) {
          if (paragraph.match(/(?:diagnosis|condition|disease|disorder|treatment|medication|pain|symptoms|history)/i)) {
            medicalHistory.preAccidentStatus = paragraph.trim();
            console.log(`DEBUG - Medical History matcher found medical-related paragraph: ${medicalHistory.preAccidentStatus.substring(0, 50)}...`);
            break;
          }
        }
      }
      
      // Extract conditions section
      const conditionPatterns = [
        /(?:medical|health)\s*(?:history|conditions)\s*[:;]([^]*?)(?:(?:medications|surgeries|assessment|treatment)|\n\s*\n)/i,
        /(?:current|chronic|ongoing)\s*(?:conditions|diagnoses|problems)\s*[:;]([^]*?)(?:(?:medications|surgeries|assessment|treatment)|\n\s*\n)/i,
        /(?:past\s*medical\s*history|pmh)\s*[:;]([^]*?)(?:(?:medications|surgeries|assessment|treatment)|\n\s*\n)/i,
        /(?:diagnosed|suffered from|history of)\s*(?:the following|with)([^]*?)(?:(?:medication|surgery|treatment)|\n\s*\n)/i,
        /(?:relevant|pertinent)\s*(?:diagnoses|conditions|medical\s*issues)([^]*?)(?:(?:medication|surgery|treatment)|\n\s*\n)/i,
        /medical\s*conditions(?:\s*:|[^\n]*?include)([^]*?)(?:(?:medications|surgeries|assessment|treatment)|\n\s*\n)/i,
        /diagnos(?:is|ed)([^]*?)(?:medications|surgeries|assessment|treatment)/i,
        /client\s*has\s*been\s*diagnosed\s*with([^.]*)/i
      ];
      
      for (const pattern of conditionPatterns) {
        const match = text.match(pattern);
        if (match && match[1]) {
          const conditionsText = match[1].trim();
          const conditionItems = extractListItems(conditionsText);
          
          if (conditionItems.length > 0) {
            medicalHistory.conditions = conditionItems.map(item => ({
              condition: item.trim()
            }));
            console.log(`DEBUG - Medical History matcher found ${conditionItems.length} conditions`);
            break;
          }
        }
      }
      
      // If no conditions found through pattern matching, try to find conditions in paragraphs
      if (medicalHistory.conditions.length === 0) {
        // Search in pre-accident status or in the entire text
        const searchText = medicalHistory.preAccidentStatus || text;
        
        // Look for condition indicators
        const conditionIndicators = [
          /diagnosed\s*with\s*([^,\.;]+)/gi,
          /suffers?\s*from\s*([^,\.;]+)/gi,
          /history\s*of\s*([^,\.;]+)/gi,
          /(?:has|had)\s*([^,\.;]+)(?=\s*(?:condition|disorder|disease|syndrome))/gi,
          /experiences?\s*([^,\.;]+)/gi,
          /presents?\s*with\s*([^,\.;]+)/gi,
          /affected\s*by\s*([^,\.;]+)/gi,
          /reports?\s*(?:having|experiencing)\s*([^,\.;]+)/gi,
          /complains?\s*of\s*([^,\.;]+)/gi
        ];
        
        let extractedConditions = [];
        
        for (const pattern of conditionIndicators) {
          let match;
          while ((match = pattern.exec(searchText)) !== null) {
            if (match[1] && match[1].trim().length > 3) {
              extractedConditions.push(match[1].trim());
            }
          }
        }
        
        // Add any conditions found in paragraphs
        if (extractedConditions.length > 0) {
          medicalHistory.conditions = extractedConditions.map(item => ({
            condition: item.trim()
          }));
          console.log(`DEBUG - Medical History matcher found ${extractedConditions.length} conditions in paragraphs`);
        }
      }
      
      // If still no conditions found, look for common medical conditions in text
      if (medicalHistory.conditions.length === 0) {
        const commonConditions = [
          /(?:diabetes|hypertension|asthma|arthritis|depression|anxiety|COPD|heart\s*disease|cancer|stroke|obesity)/gi,
          /(?:fibromyalgia|migraine|epilepsy|multiple\s*sclerosis|parkinson|alzheimer)/gi,
          /(?:chronic\s*pain|back\s*pain|bipolar\s*disorder|schizophrenia|PTSD|thyroid)/gi,
          /(?:fracture|sprain|concussion|traumatic brain injury|tbi|whiplash)/gi,
          /(?:neuropathy|radiculopathy|herniated disc|stenosis|spondylosis)/gi
        ];
        
        let foundConditions = [];
        
        for (const pattern of commonConditions) {
          let match;
          while ((match = pattern.exec(text)) !== null) {
            if (match[0] && match[0].trim().length > 3) {
              foundConditions.push(match[0].trim());
            }
          }
        }
        
        // Add any common conditions found
        if (foundConditions.length > 0) {
          medicalHistory.conditions = foundConditions.map(item => ({
            condition: item.trim()
          }));
          console.log(`DEBUG - Medical History matcher found ${foundConditions.length} common conditions in text`);
        }
      }
      
      // Extract surgeries section
      const surgeryPatterns = [
        /(?:surgeries|surgical\s*history|operations|procedures)\s*[:;]([^]*?)(?:(?:medications|assessment|treatment|history|plan)|\n\s*\n)/i,
        /(?:past\s*surgeries|previous\s*operations)\s*[:;]([^]*?)(?:(?:medications|assessment|treatment|history|plan)|\n\s*\n)/i,
        /(?:underwent|had|received)\s*(?:surgery|procedure|operation)([^]*?)(?:(?:medication|assessment|treatment)|\n\s*\n)/i,
        /surgical\s*interventions(?:\s*:|[^\n]*?included)([^]*?)(?:(?:medication|assessment|treatment)|\n\s*\n)/i
      ];
      
      for (const pattern of surgeryPatterns) {
        const match = text.match(pattern);
        if (match && match[1]) {
          const surgeriesText = match[1].trim();
          const surgeryItems = extractListItems(surgeriesText);
          
          if (surgeryItems.length > 0) {
            medicalHistory.surgeries = surgeryItems.map(item => ({
              procedure: item.trim()
            }));
            console.log(`DEBUG - Medical History matcher found ${surgeryItems.length} surgeries`);
            break;
          }
        }
      }
      
      // If no surgeries found through pattern matching, look for surgery indicators in paragraphs
      if (medicalHistory.surgeries.length === 0) {
        const surgeryText = text;
        const surgeryIndicators = [
          /underwent\s*(?:a|an)?\s*([^,\.;]+?)\s*(?:surgery|procedure|operation)/gi,
          /(?:had|received)\s*(?:a|an)?\s*([^,\.;]+?)\s*(?:surgery|procedure|operation)/gi,
          /surgical\s*(?:history|intervention)\s*(?:includes?|consisted\s*of)\s*([^,\.;]+)/gi,
          /(?:surgery|operation|procedure)\s*for\s*([^,\.;]+)/gi,
          /surgically\s*(?:treated|corrected|repaired)\s*([^,\.;]+)/gi
        ];
        
        let extractedSurgeries = [];
        
        for (const pattern of surgeryIndicators) {
          let match;
          while ((match = pattern.exec(surgeryText)) !== null) {
            if (match[1] && match[1].trim().length > 3) {
              extractedSurgeries.push(match[1].trim());
            }
          }
        }
        
        // Add any surgeries found in paragraphs
        if (extractedSurgeries.length > 0) {
          medicalHistory.surgeries = extractedSurgeries.map(item => ({
            procedure: item.trim()
          }));
          console.log(`DEBUG - Medical History matcher found ${extractedSurgeries.length} surgeries in paragraphs`);
        }
      }
      
      // Extract medications section
      const medicationPatterns = [
        /(?:medications|medication\s*list|current\s*medications)\s*[:;]([^]*?)(?:(?:assessment|treatment|history|plan)|\n\s*\n)/i,
        /(?:prescribed\s*medications|prescriptions|meds)\s*[:;]([^]*?)(?:(?:assessment|treatment|history|plan)|\n\s*\n)/i,
        /(?:takes|taking|using|prescribed)\s*(?:the following|these)\s*medications([^]*?)(?:(?:assessment|treatment|history|plan)|\n\s*\n)/i,
        /(?:pharmacological|drug)\s*therapy(?:\s*:|[^\n]*?includes)([^]*?)(?:(?:assessment|treatment|history|plan)|\n\s*\n)/i,
        /medication\s*regimen(?:\s*:|[^\n]*?consists\s*of)([^]*?)(?:(?:assessment|treatment|history|plan)|\n\s*\n)/i
      ];
      
      for (const pattern of medicationPatterns) {
        const match = text.match(pattern);
        if (match && match[1]) {
          const medicationsText = match[1].trim();
          const medicationItems = extractListItems(medicationsText);
          
          if (medicationItems.length > 0) {
            medicalHistory.medications = medicationItems.map(item => ({
              name: item.trim()
            }));
            console.log(`DEBUG - Medical History matcher found ${medicationItems.length} medications`);
            break;
          }
        }
      }
      
      // If no medications found through pattern matching, look for medication indicators in paragraphs
      if (medicalHistory.medications.length === 0) {
        const medicationText = text;
        const medicationIndicators = [
          /prescribed\s*([^,\.;]+)/gi,
          /takes\s*([^,\.;]+)/gi,
          /taking\s*([^,\.;]+)/gi,
          /medicated\s*with\s*([^,\.;]+)/gi,
          /medications?\s*(?:include|includes|included|consisting\s*of)\s*([^,\.;]+)/gi,
          /(?:given|administered|started\s*on)\s*([^,\.;]+)/gi,
          /treatment\s*with\s*([^,\.;]+)/gi,
          /(?:is|was)\s*on\s*([^,\.;]+)/gi,  // is on medication X
          /client\s*reports\s*taking\s*([^,\.;]+)/gi,  // client reports taking X
          /currently\s*(?:taking|using)\s*([^,\.;]+)/gi  // currently taking X
        ];
        
        let extractedMedications = [];
        
        for (const pattern of medicationIndicators) {
          let match;
          while ((match = pattern.exec(medicationText)) !== null) {
            if (match[1] && match[1].trim().length > 3) {
              extractedMedications.push(match[1].trim());
            }
          }
        }
        
        // Add any medications found in paragraphs
        if (extractedMedications.length > 0) {
          medicalHistory.medications = extractedMedications.map(item => ({
            name: item.trim()
          }));
          console.log(`DEBUG - Medical History matcher found ${extractedMedications.length} medications in paragraphs`);
        }
      }
      
      // If still no medications found, look for common medication names
      if (medicalHistory.medications.length === 0) {
        const commonMedications = [
          /(?:lisinopril|metformin|levothyroxine|atorvastatin|simvastatin)/gi,
          /(?:omeprazole|amlodipine|metoprolol|albuterol|gabapentin)/gi,
          /(?:hydrochlorothiazide|losartan|acetaminophen|ibuprofen|aspirin)/gi,
          /(?:hydrocodone|oxycodone|tramadol|naproxen|diclofenac)/gi,
          /(?:sertraline|fluoxetine|escitalopram|duloxetine|venlafaxine)/gi,
          /(?:prednisone|montelukast|fluticasone|amoxicillin|azithromycin)/gi
        ];
        
        let foundMedications = [];
        
        for (const pattern of commonMedications) {
          let match;
          while ((match = pattern.exec(text)) !== null) {
            if (match[0] && match[0].trim().length > 3) {
              foundMedications.push(match[0].trim());
            }
          }
        }
        
        // Add any common medications found
        if (foundMedications.length > 0) {
          medicalHistory.medications = foundMedications.map(item => ({
            name: item.trim()
          }));
          console.log(`DEBUG - Medical History matcher found ${foundMedications.length} common medications in text`);
        }
      }
      
      // Extract allergies section
      const allergyPatterns = [
        /(?:allergies|allergy|allergic\s*to)\s*[:;]([^]*?)(?:(?:assessment|treatment|history|plan|medication)|\n\s*\n)/i,
        /(?:known|reported)\s*allergies\s*[:;]([^]*?)(?:(?:assessment|treatment|history|plan|medication)|\n\s*\n)/i,
        /allergic\s*(?:to|reactions?)(?:\s*:|[^\n]*?include)([^]*?)(?:(?:assessment|treatment|history|plan|medication)|\n\s*\n)/i
      ];
      
      for (const pattern of allergyPatterns) {
        const match = text.match(pattern);
        if (match && match[1]) {
          const allergiesText = match[1].trim();
          const allergyItems = extractListItems(allergiesText);
          
          if (allergyItems.length > 0) {
            medicalHistory.allergies = allergyItems.map(item => ({
              allergy: item.trim()
            }));
            console.log(`DEBUG - Medical History matcher found ${allergyItems.length} allergies`);
            break;
          }
        }
      }
      
      // If no allergies found, look for allergy indicators in text
      if (medicalHistory.allergies.length === 0) {
        const allergyIndicators = [
          /allergic\s*to\s*([^,\.;]+)/gi,
          /allergy\s*to\s*([^,\.;]+)/gi,
          /allergies\s*(?:include|includes|included)\s*([^,\.;]+)/gi
        ];
        
        let extractedAllergies = [];
        
        for (const pattern of allergyIndicators) {
          let match;
          while ((match = pattern.exec(text)) !== null) {
            if (match[1] && match[1].trim().length > 3) {
              extractedAllergies.push(match[1].trim());
            }
          }
        }
        
        // Add any allergies found
        if (extractedAllergies.length > 0) {
          medicalHistory.allergies = extractedAllergies.map(item => ({
            allergy: item.trim()
          }));
          console.log(`DEBUG - Medical History matcher found ${extractedAllergies.length} allergies in text`);
        }
      }
      
      // Handle "no known allergies" or similar statements
      if (medicalHistory.allergies.length === 0) {
        const noAllergiesPatterns = [
          /no\s*(?:known|reported)\s*allergies/i,
          /denies\s*(?:any|all)\s*allergies/i,
          /no\s*allergic\s*reactions/i,
          /nkda/i  // Common medical abbreviation for "No Known Drug Allergies"
        ];
        
        for (const pattern of noAllergiesPatterns) {
          if (pattern.test(text)) {
            medicalHistory.allergies = [{
              allergy: "No known allergies"
            }];
            console.log("DEBUG - Medical History matcher found 'No known allergies' statement");
            break;
          }
        }
      }
      
      // If there is pre-accident status text but no other data, extract at least one condition
      if (medicalHistory.conditions.length === 0 && 
          medicalHistory.medications.length === 0 && 
          medicalHistory.surgeries.length === 0 && 
          medicalHistory.preAccidentStatus) {
        // Create at least one placeholder condition
        medicalHistory.conditions = [{
          condition: "Medical history described in report"
        }];
        console.log("DEBUG - Added placeholder condition based on pre-accident status text");
      }
      
      // If we have any medical information at all, add a placeholder
      if (medicalHistory.conditions.length === 0 && 
          medicalHistory.medications.length === 0 && 
          medicalHistory.surgeries.length === 0 && 
          medicalHistory.allergies.length === 0 && 
          !medicalHistory.preAccidentStatus) {
        // If we have the word "history" or "medical" anywhere, create a placeholder
        if (text.match(/(?:history|medical|health|condition|symptom|pain|injury)/i)) {
          medicalHistory.conditions = [{
            condition: "See medical report for details"
          }];
          medicalHistory.preAccidentStatus = "Medical history information available in the full report.";
          console.log("DEBUG - Added placeholder condition based on medical keywords in text");
        }
      }
      
      console.log("DEBUG - Medical History extraction complete");
      return medicalHistory;
    },
    confidence: (result: any) => {
      console.log("DEBUG - Medical History calculating confidence score");
      
      // Base score just for matching patterns
      let score = 0.5;
      console.log(`DEBUG - Medical History base pattern match confidence: 0.5`);
      
      // Check pre-accident status
      if (result.preAccidentStatus && result.preAccidentStatus.length > 30) {
        // Longer descriptions get more confidence
        const preAccidentConfidence = Math.min(1, result.preAccidentStatus.length / 300);
        score += 0.2 * preAccidentConfidence;
        console.log(`DEBUG - Medical History pre-accident status confidence: ${0.2 * preAccidentConfidence}`);
      }
      
      // Check conditions
      if (result.conditions && result.conditions.length > 0) {
        const conditionsConfidence = Math.min(1, result.conditions.length / 3); // More conditions = higher confidence, max at 3
        score += 0.1 * conditionsConfidence;
        console.log(`DEBUG - Medical History conditions confidence: ${0.1 * conditionsConfidence}`);
      }
      
      // Check medications
      if (result.medications && result.medications.length > 0) {
        const medicationsConfidence = Math.min(1, result.medications.length / 3); // More medications = higher confidence, max at 3
        score += 0.1 * medicationsConfidence;
        console.log(`DEBUG - Medical History medications confidence: ${0.1 * medicationsConfidence}`);
      }
      
      // Check surgeries
      if (result.surgeries && result.surgeries.length > 0) {
        const surgeriesConfidence = Math.min(1, result.surgeries.length / 2); // More surgeries = higher confidence, max at 2
        score += 0.05 * surgeriesConfidence;
        console.log(`DEBUG - Medical History surgeries confidence: ${0.05 * surgeriesConfidence}`);
      }
      
      // Check allergies
      if (result.allergies && result.allergies.length > 0) {
        const allergiesConfidence = Math.min(1, result.allergies.length / 2); // More allergies = higher confidence, max at 2
        score += 0.05 * allergiesConfidence;
        console.log(`DEBUG - Medical History allergies confidence: ${0.05 * allergiesConfidence}`);
      }
      
      // Final confidence score
      const finalScore = Math.min(score, 1); // Ensure score doesn't exceed 1
      console.log(`DEBUG - Medical History final confidence score: ${finalScore}`);
      return finalScore;
    }
  };
}
