/**
 * PDF Processing Service
 * 
 * This service handles the extraction and mapping of data from PDF documents
 * into the Assessment Context structure. It uses the enhanced pattern recognition
 * system to accurately identify and extract data from different assessment sections.
 */

import * as pdfjs from 'pdfjs-dist';
import { processPdfText, mapToApplicationModel } from '@/utils/pdf-import';

/**
 * Processes a PDF document and extracts structured data
 * @param pdfBuffer The binary PDF data
 * @returns Extracted data structured for the Assessment Context
 */
export async function processPdf(pdfBuffer: ArrayBuffer): Promise<any> {
  try {
    // Extract text from PDF
    const text = await extractTextFromPdf(pdfBuffer);
    console.log("PDF Processing Service - Text extracted from PDF, length:", text.length);
    
    // Log first 200 characters of text for debugging
    console.log("PDF Text Sample:", text.substring(0, 200).replace(/\n/g, ' ') + "...");
    
    // Process the text with the enhanced pattern recognition system
    const processedData = processPdfText(text);
    console.log("PDF Processing Service - Text processed with pattern recognition");
    
    return processedData;
  } catch (error) {
    console.error("PDF Processing Service - Error processing PDF:", error);
    throw error;
  }
}

/**
 * Extract text from a PDF buffer
 * @param pdfBuffer The PDF buffer to extract text from
 * @returns The extracted text content
 */
async function extractTextFromPdf(pdfBuffer: ArrayBuffer): Promise<string> {
  try {
    // Create a typed array from the buffer
    const data = new Uint8Array(pdfBuffer);
    
    // Initialize PDF.js document
    const loadingTask = pdfjs.getDocument({ data });
    const pdf = await loadingTask.promise;
    
    console.log(`PDF Processing Service - PDF has ${pdf.numPages} pages`);
    
    // Extract text from all pages
    let fullText = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      console.log(`PDF Processing Service - Processing page ${i}/${pdf.numPages}`);
      
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      
      // Log item count for debugging
      console.log(`PDF Processing Service - Page ${i} has ${textContent.items.length} text items`);
      
      // Extract and join text with better spacing handling
      let pageText = '';
      let lastY = null;
      let lastX = null;
      
      for (const item of textContent.items) {
        if (item.str.trim() === '') continue; // Skip empty strings
        
        // Check if we should add a line break or space for better formatting
        if (lastY !== null && lastX !== null) {
          const transform = item.transform;
          const currentY = transform[5]; // Y position
          const currentX = transform[4]; // X position
          
          // Add a new line if Y position changed significantly
          if (Math.abs(currentY - lastY) > 5) {
            pageText += '\n';
          } 
          // Add a space if it's on the same line but not directly next to the last item
          else if (currentX - lastX > 5) {
            pageText += ' ';
          }
        }
        
        // Add the text
        pageText += item.str;
        
        // Update position
        if (item.transform && item.transform.length >= 6) {
          lastY = item.transform[5];
          lastX = item.transform[4] + (item.width || 0);
        }
      }
      
      fullText += pageText + '\n\n';
    }
    
    console.log(`PDF Processing Service - Extracted ${fullText.length} characters of text`);
    return fullText;
  } catch (error) {
    console.error("PDF Processing Service - Error extracting text:", error);
    throw error;
  }
}

/**
 * Helper function to check if the application data has valid content
 */
function hasValidExtractedData(appData: any): boolean {
  if (!appData) return false;
  
  // Check for at least one non-empty section
  return Object.entries(appData).some(([key, value]) => {
    // Skip confidence section for this check
    if (key === 'confidence') return false;
    
    if (typeof value === 'object' && value !== null) {
      return Object.values(value).some(fieldValue => {
        if (Array.isArray(fieldValue)) return fieldValue.length > 0;
        if (typeof fieldValue === 'object' && fieldValue !== null) {
          return Object.keys(fieldValue).length > 0 && 
            Object.values(fieldValue).some(v => !!v);
        }
        return !!fieldValue;
      });
    }
    
    return false;
  });
}

/**
 * Maps extracted PDF data to the Assessment Context format
 * @param extractedData Data extracted from the PDF
 * @returns Data structured for the Assessment Context
 */
export function mapToAssessmentContext(extractedData: any): any {
  try {
    console.log("PDF Processing Service - Mapping to Assessment Context");
    
    // Use the application model mapping from the pattern recognition system
    const appData = mapToApplicationModel(extractedData);
    console.log("PDF Processing Service - Application data mapped");
    
    // For debugging - log the extractedData and mapped appData
    console.log("PDF Processing Service - Original extracted data sections:", 
      Object.keys(extractedData.data || {}));
    console.log("PDF Processing Service - Mapped application data sections:", 
      Object.keys(appData));
    
    // Check if we have meaningful data or if extraction failed completely
    if (extractedData._noValidDataExtracted || 
        Object.keys(extractedData.data || {}).length === 0 ||
        !hasValidExtractedData(appData)) {
      
      console.warn("PDF Processing Service - No valid data was extracted from the PDF");
      
      // Return empty data with a failure flag instead of mock data
      return {
        _extractionFailed: true,
        _reason: "No valid data could be extracted from this document format"
      };
    }
    
    const context: any = {};
    
    // Map the application model to the assessment context format
    
    // Demographics
    if (appData.demographics) {
      console.log("PDF Processing Service - Processing demographics");
      context.demographics = {
        personalInfo: {
          firstName: appData.demographics.name?.split(' ')[0] || '',
          lastName: appData.demographics.name?.split(' ').slice(1).join(' ') || '',
          dateOfBirth: appData.demographics.dob || '',
          gender: appData.demographics.gender || '',
          healthCardNumber: '',
          phone: appData.demographics.phone || '',
          email: appData.demographics.email || '',
          address: appData.demographics.address || '',
          city: appData.demographics.city || '',
          province: appData.demographics.province || '',
          postalCode: appData.demographics.postalCode || ''
        },
        referralInfo: {
          insurance: {
            provider: appData.demographics.referralSource || '',
            claimNumber: '',
            adjustorName: '',
            adjustorPhone: '',
            adjustorEmail: ''
          },
          legal: {
            name: '',
            firm: '',
            phone: '',
            email: '',
            address: '',
            fileNumber: appData.demographics.fileNumber || ''
          }
        }
      };
    }
    
    // Medical History
    if (appData.medicalHistory) {
      console.log("PDF Processing Service - Processing medical history");
      context.pastMedicalHistory = {
        conditions: appData.medicalHistory.conditions?.map((condition: string) => ({
          condition,
          diagnosisDate: '',
          currentStatus: 'Active',
          notes: ''
        })) || [],
        surgeries: appData.medicalHistory.surgeries?.map((surgery: string) => ({
          procedure: surgery,
          date: '',
          reason: '',
          complications: '',
          notes: ''
        })) || [],
        medications: appData.medicalHistory.medications?.map((medication: string) => ({
          name: medication,
          dosage: '',
          frequency: '',
          reason: '',
          prescriber: '',
          startDate: '',
          endDate: '',
          status: 'current'
        })) || [],
        allergies: appData.medicalHistory.allergies || [],
        preExistingConditions: ''
      };
      
      context.medicalHistory = {
        pastMedicalHistory: context.pastMedicalHistory,
        injuryDetails: {
          diagnosisDate: '',
          mechanism: '',
          description: appData.medicalHistory.primaryDiagnosis || ''
        },
        treatmentHistory: {
          rehabilitationServices: [],
          hospitalizations: []
        }
      };
    }
    
    // Symptoms
    if (appData.symptoms) {
      console.log("PDF Processing Service - Processing symptoms");
      // Convert reported symptoms to the expected format
      const physicalSymptoms = appData.symptoms.reportedSymptoms?.map((symptom: string) => ({
        symptom,
        severity: '',
        frequency: '',
        location: Array.isArray(appData.symptoms.painLocation) 
          ? appData.symptoms.painLocation.join(', ') 
          : appData.symptoms.painLocation || '',
        aggravatingFactors: appData.symptoms.aggravatingFactors || [],
        alleviatingFactors: appData.symptoms.relievingFactors || [],
        impact: Array.isArray(appData.symptoms.functionalImpact)
          ? appData.symptoms.functionalImpact.join(', ')
          : appData.symptoms.functionalImpact || '',
        notes: appData.symptoms.painDescription || ''
      })) || [];
      
      context.symptoms = {
        physical: physicalSymptoms,
        cognitive: [],
        emotional: []
      };
      
      context.physicalSymptoms = physicalSymptoms;
      context.cognitiveSymptoms = [];
      context.emotionalSymptoms = [];
    }
    
    // Functional Status
    if (appData.functionalStatus) {
      console.log("PDF Processing Service - Processing functional status");
      context.functionalStatus = {
        mobility: {
          ambulation: appData.functionalStatus.mobilityStatus || '',
          transfers: appData.functionalStatus.transferAbility || '',
          balance: appData.functionalStatus.balanceStatus || '',
          limitations: appData.functionalStatus.limitations || 
                      appData.functionalStatus.functionalLimitations || [],
          assistiveDevices: appData.functionalStatus.assistiveDevices || [],
          safety: {
            fallRisk: appData.functionalStatus.safety?.fallRisk || '',
            fallHistory: appData.functionalStatus.safety?.fallHistory || '',
            precautions: appData.functionalStatus.safety?.safetyPrecautions || []
          }
        },
        upperExtremity: {},
        posture: {},
        endurance: appData.functionalStatus.endurance || '',
        goals: appData.functionalStatus.functionalGoals || []
      };
      
      context.mobilityAssessment = context.functionalStatus.mobility;
      context.upperExtremityFunction = context.functionalStatus.upperExtremity;
      context.posture = context.functionalStatus.posture;
    }
    
    // Typical Day
    if (appData.typicalDay) {
      console.log("PDF Processing Service - Processing typical day");
      context.typicalDay = {
        morning: {
          routines: appData.typicalDay.morningRoutine || [],
          notes: ''
        },
        afternoon: {
          routines: appData.typicalDay.afternoonRoutine || [],
          notes: ''
        },
        evening: {
          routines: appData.typicalDay.eveningRoutine || [],
          notes: ''
        },
        night: {
          routines: appData.typicalDay.nightRoutine || [],
          notes: ''
        },
        dailyActivities: appData.typicalDay.dailyActivities || [],
        weeklyActivities: appData.typicalDay.weeklyActivities || [],
        leisureActivities: appData.typicalDay.leisureActivities || []
      };
      
      context.morning = context.typicalDay.morning;
      context.afternoon = context.typicalDay.afternoon;
      context.evening = context.typicalDay.evening;
      context.night = context.typicalDay.night;
    }
    
    // Environmental Assessment
    if (appData.environment) {
      console.log("PDF Processing Service - Processing environmental assessment");
      context.environment = {
        dwelling: {
          homeType: appData.environment.homeType || '',
          livingArrangement: appData.environment.livingArrangement || '',
          layout: appData.environment.homeLayout || [],
          access: {
            entrance: appData.environment.access?.entrance || '',
            bathroom: appData.environment.access?.bathroom || '',
            bedroom: appData.environment.access?.bedroom || '',
            kitchen: appData.environment.access?.kitchen || ''
          }
        },
        safety: {
          hazards: appData.environment.safetyRisks || [],
          recommendations: appData.environment.recommendations?.filter((r: string) => 
            r.toLowerCase().includes('safety') || 
            r.toLowerCase().includes('hazard')) || []
        },
        accessibility: {
          barriers: appData.environment.barriers || [],
          recommendations: appData.environment.recommendations || []
        },
        equipment: {
          current: [],
          recommended: []
        }
      };
      
      context.homeLayout = context.environment.dwelling;
      context.safetyAssessment = context.environment.safety;
      context.accessibilityIssues = context.environment.accessibility;
      context.adaptiveEquipment = context.environment.equipment;
    }
    
    // ADLs
    if (appData.adls) {
      console.log("PDF Processing Service - Processing ADLs");
      // Extract all the ADL capabilities with their levels
      const selfCare = appData.adls.selfCare || {};
      const mobility = appData.adls.mobility || {};
      const instrumental = appData.adls.instrumental || {};
      
      context.adls = {
        basic: {
          bathing: { 
            level: selfCare.bathing?.level || 'unknown', 
            notes: selfCare.bathing?.notes || '' 
          },
          dressing: { 
            level: selfCare.dressing?.level || 'unknown', 
            notes: selfCare.dressing?.notes || '' 
          },
          toileting: { 
            level: selfCare.toileting?.level || 'unknown', 
            notes: selfCare.toileting?.notes || '' 
          },
          feeding: { 
            level: selfCare.feeding?.level || 'unknown', 
            notes: selfCare.feeding?.notes || '' 
          },
          grooming: { 
            level: selfCare.grooming?.level || 'unknown', 
            notes: selfCare.grooming?.notes || '' 
          },
          transfers: { 
            level: mobility.transfers?.level || 'unknown', 
            notes: mobility.transfers?.notes || '' 
          },
          mobility: { 
            level: mobility.ambulation?.level || 'unknown', 
            notes: mobility.ambulation?.notes || '' 
          }
        },
        instrumental: {
          mealPrep: { 
            level: instrumental.mealPrep?.level || 'unknown', 
            notes: instrumental.mealPrep?.notes || '' 
          },
          housekeeping: { 
            level: instrumental.housekeeping?.level || 'unknown', 
            notes: instrumental.housekeeping?.notes || '' 
          },
          shopping: { 
            level: instrumental.shopping?.level || 'unknown', 
            notes: instrumental.shopping?.notes || '' 
          },
          finances: { 
            level: instrumental.finances?.level || 'unknown', 
            notes: instrumental.finances?.notes || '' 
          },
          medication: { 
            level: instrumental.medication?.level || 'unknown', 
            notes: instrumental.medication?.notes || '' 
          }
        },
        leisure: {
          activities: appData.adls.leisureActivities || [],
          summary: appData.adls.summary || '',
          recommendations: appData.adls.recommendations || []
        }
      };
      
      context.basicADLs = context.adls.basic;
      context.instrumentalADLs = context.adls.instrumental;
      context.leisureRecreation = context.adls.leisure;
    }
    
    // Attendant Care
    if (appData.attendantCare) {
      console.log("PDF Processing Service - Processing attendant care");
      // Extract detailed attendant care needs and recommendations
      context.attendantCare = {
        selfCare: {
          needs: appData.attendantCare.careNeeds?.personalCare || [],
          hours: 0,
          frequency: '',
          provider: ''
        },
        homecare: {
          needs: [
            ...(appData.attendantCare.careNeeds?.housekeeping || []),
            ...(appData.attendantCare.careNeeds?.mealPrep || [])
          ],
          hours: 0,
          frequency: '',
          provider: ''
        },
        supervision: {
          needs: appData.attendantCare.careNeeds?.supervision || [],
          hours: 0,
          frequency: '',
          provider: ''
        },
        currentCare: {
          provider: appData.attendantCare.caregiverInfo?.type || '',
          providerName: appData.attendantCare.caregiverInfo?.name || '',
          relationship: appData.attendantCare.caregiverInfo?.relationship || '',
          availability: appData.attendantCare.caregiverInfo?.availability || '',
          services: appData.attendantCare.currentServices || []
        },
        recommendations: {
          summary: '',
          items: appData.attendantCare.recommendations || []
        }
      };
      
      // Extract and allocate hours if available
      if (appData.attendantCare.careHours?.daily) {
        const hoursMatch = appData.attendantCare.careHours.daily.match(/(\d+(\.\d+)?)/);
        if (hoursMatch) {
          const totalHours = parseFloat(hoursMatch[1]);
          // Allocate the hours based on breakdown if available or use standard distribution
          if (appData.attendantCare.careHours?.breakdown) {
            const breakdown = appData.attendantCare.careHours.breakdown;
            
            // Personal care - morning and evening
            const personalCareHours = 
              (parseFloat(breakdown.morning?.replace(/[^\d.]/g, '') || '0') || 0) +
              (parseFloat(breakdown.evening?.replace(/[^\d.]/g, '') || '0') || 0);
            
            // Homecare - mostly daytime
            const homecareHours = 
              (parseFloat(breakdown.afternoon?.replace(/[^\d.]/g, '') || '0') || 0) * 0.7;
            
            // Supervision - remainder with emphasis on night
            const supervisionHours = 
              totalHours - personalCareHours - homecareHours;
            
            context.attendantCare.selfCare.hours = personalCareHours || (totalHours * 0.4);
            context.attendantCare.homecare.hours = homecareHours || (totalHours * 0.4);
            context.attendantCare.supervision.hours = supervisionHours || (totalHours * 0.2);
          } else {
            // Standard distribution if no breakdown available
            context.attendantCare.selfCare.hours = totalHours * 0.4; // 40% for self-care
            context.attendantCare.homecare.hours = totalHours * 0.4; // 40% for homecare
            context.attendantCare.supervision.hours = totalHours * 0.2; // 20% for supervision
          }
        }
      } else if (appData.attendantCare.careHours?.weekly) {
        const hoursMatch = appData.attendantCare.careHours.weekly.match(/(\d+(\.\d+)?)/);
        if (hoursMatch) {
          const totalHours = parseFloat(hoursMatch[1]) / 7; // Convert to daily
          context.attendantCare.selfCare.hours = totalHours * 0.4;
          context.attendantCare.homecare.hours = totalHours * 0.4;
          context.attendantCare.supervision.hours = totalHours * 0.2;
        }
      }
      
      context.selfCare = context.attendantCare.selfCare;
      context.homecare = context.attendantCare.homecare;
      context.supervision = context.attendantCare.supervision;
      context.currentCare = context.attendantCare.currentCare;
      context.recommendations = context.attendantCare.recommendations;
    }
    
    // Purpose & Methodology
    if (appData.purpose) {
      console.log("PDF Processing Service - Processing purpose & methodology");
      context.purpose = {
        assessmentPurpose: appData.purpose.assessmentPurpose || '',
        referralSource: appData.purpose.referralSource || '',
        referralDate: appData.purpose.referralDate || '',
        assessmentDate: appData.purpose.assessmentDate || ''
      };
      
      context.methodology = {
        assessmentMethods: appData.purpose.methodologies || [],
        assessmentTools: appData.purpose.assessmentTools || [],
        locationOfAssessment: appData.purpose.locationOfAssessment || '',
        otherParticipants: appData.purpose.otherParticipants || []
      };
    }
    
    // Add confidence scores for both section detection and data fields
    context.confidence = {
      sections: extractedData.sectionConfidence || {},
      fields: {}
    };
    
    // Add field confidence scores if available
    ['demographics', 'medicalHistory', 'symptoms', 'functionalStatus', 
     'typicalDay', 'environmental', 'adls', 'attendantCare', 'purpose'].forEach(section => {
      if (extractedData.data[section.toUpperCase()] && 
          extractedData.data[section.toUpperCase()].confidence) {
        context.confidence.fields[section] = extractedData.data[section.toUpperCase()].confidence;
      }
    });
    
    console.log("PDF Processing Service - Context mapping complete");
    
    return context;
  } catch (error) {
    console.error("PDF Processing Service - Error mapping to context:", error);
    return {
      _extractionFailed: true,
      _reason: "Error during data mapping: " + error.message
    };
  }
}
