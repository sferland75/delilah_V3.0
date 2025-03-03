/**
 * Attendant Care Data Mapping Service - Simplified Version
 * 
 * This service handles bidirectional mapping between:
 * 1. Context data structure (as used in AssessmentContext)
 * 2. Form data structure (as used in React Hook Form)
 */

import { nanoid } from 'nanoid';

// Default form values - simplifying to reduce size
export const defaultValues = {
  selfCare: {
    feeding: { needsAssistance: false, careProvided: '', minutesPerDay: 0, frequency: 'daily', notes: '' },
    bathing: { needsAssistance: false, careProvided: '', minutesPerDay: 0, frequency: 'daily', notes: '' },
    grooming: { needsAssistance: false, careProvided: '', minutesPerDay: 0, frequency: 'daily', notes: '' },
    dressing: { needsAssistance: false, careProvided: '', minutesPerDay: 0, frequency: 'daily', notes: '' },
    toileting: { needsAssistance: false, careProvided: '', minutesPerDay: 0, frequency: 'daily', notes: '' },
    transfers: { needsAssistance: false, careProvided: '', minutesPerDay: 0, frequency: 'daily', notes: '' },
    medication: { needsAssistance: false, careProvided: '', minutesPerDay: 0, frequency: 'daily', notes: '' }
  },
  homecare: {
    mealPreparation: { needsAssistance: false, careProvided: '', minutesPerDay: 0, frequency: 'daily', notes: '' },
    housekeeping: { needsAssistance: false, careProvided: '', minutesPerDay: 0, frequency: 'weekly', notes: '' },
    laundry: { needsAssistance: false, careProvided: '', minutesPerDay: 0, frequency: 'weekly', notes: '' },
    shopping: { needsAssistance: false, careProvided: '', minutesPerDay: 0, frequency: 'weekly', notes: '' },
    finances: { needsAssistance: false, careProvided: '', minutesPerDay: 0, frequency: 'monthly', notes: '' }
  },
  supervision: {
    cognitive: { needsSupervision: false, details: '', hoursPerDay: 0, notes: '' },
    behavioral: { needsSupervision: false, details: '', hoursPerDay: 0, notes: '' },
    safety: { needsSupervision: false, details: '', hoursPerDay: 0, notes: '' }
  },
  currentCare: {
    providers: [],
    summary: ''
  },
  recommendations: {
    selfCareHours: 0,
    homecareHours: 0,
    supervisionHours: 0,
    totalHours: 0,
    rationale: '',
    otherConsiderations: ''
  }
};

/**
 * Maps context data to form data structure (simplified)
 */
export function mapContextToForm(contextData: any) {
  try {
    console.log("Attendant Care Mapper - Context Data:", contextData);
    const formData = JSON.parse(JSON.stringify(defaultValues));
    let hasData = false;
    
    if (!contextData || Object.keys(contextData).length === 0) {
      return { formData, hasData };
    }

    // Map essential data
    if (contextData.selfCare || (contextData.attendantCare && contextData.attendantCare.selfCare)) {
      const selfCareData = contextData.selfCare || contextData.attendantCare?.selfCare || {};
      hasData = true;
      mapSelfCareData(selfCareData, formData);
    }
    
    if (contextData.homecare || (contextData.attendantCare && contextData.attendantCare.homecare)) {
      const homecareData = contextData.homecare || contextData.attendantCare?.homecare || {};
      hasData = true;
      mapHomecareData(homecareData, formData);
    }
    
    if (contextData.supervision || (contextData.attendantCare && contextData.attendantCare.supervision)) {
      const supervisionData = contextData.supervision || contextData.attendantCare?.supervision || {};
      hasData = true;
      mapSupervisionData(supervisionData, formData);
    }
    
    if (contextData.currentCare || (contextData.attendantCare && contextData.attendantCare.currentCare)) {
      const currentCareData = contextData.currentCare || contextData.attendantCare?.currentCare || {};
      hasData = true;
      mapCurrentCareData(currentCareData, formData);
    }
    
    if (contextData.recommendations || (contextData.attendantCare && contextData.attendantCare.recommendations)) {
      const recommendationsData = contextData.recommendations || contextData.attendantCare?.recommendations || {};
      hasData = true;
      mapRecommendationsData(recommendationsData, formData);
    }
    
    console.log("Attendant Care Mapper - Mapped Form Data:", formData);
    return { formData, hasData };
  } catch (error) {
    console.error("Attendant Care Mapper - Error mapping context data:", error);
    return { formData: defaultValues, hasData: false };
  }
}

/**
 * Maps form data to context structure (simplified)
 */
export function mapFormToContext(formData: any) {
  try {
    const contextData = {
      selfCare: createSelfCareContext(formData),
      homecare: createHomecareContext(formData),
      supervision: createSupervisionContext(formData),
      currentCare: createCurrentCareContext(formData),
      recommendations: createRecommendationsContext(formData)
    };
    
    console.log("Attendant Care Mapper - Mapped Context Data:", contextData);
    return contextData;
  } catch (error) {
    console.error("Attendant Care Mapper - Error mapping to context:", error);
    return {};
  }
}

/**
 * Creates a JSON export of the attendant care data
 */
export function exportToJson(contextData: any) {
  try {
    return JSON.stringify(contextData, null, 2);
  } catch (error) {
    console.error("Attendant Care Mapper - Error exporting to JSON:", error);
    return '';
  }
}

/**
 * Imports attendant care data from JSON
 */
export function importFromJson(jsonString: string) {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("Attendant Care Mapper - Error importing from JSON:", error);
    return null;
  }
}

// Helper functions 
function mapSelfCareData(selfCareData: any, formData: any) {
  const categories = ['feeding', 'bathing', 'grooming', 'dressing', 'toileting', 'transfers', 'medication'];
  
  categories.forEach(category => {
    if (selfCareData[category]) {
      if (typeof selfCareData[category] === 'string') {
        const description = selfCareData[category];
        if (description.trim()) {
          formData.selfCare[category].needsAssistance = true;
          formData.selfCare[category].careProvided = description;
          formData.selfCare[category].minutesPerDay = estimateMinutesFromDescription(description);
        }
      } else {
        formData.selfCare[category].needsAssistance = 
          selfCareData[category].needsAssistance || 
          selfCareData[category].assistance || 
          false;
        
        formData.selfCare[category].careProvided = 
          selfCareData[category].careProvided || 
          selfCareData[category].description || 
          '';
        
        formData.selfCare[category].minutesPerDay = 
          parseInt(selfCareData[category].minutesPerDay) || 
          estimateMinutesFromDescription(formData.selfCare[category].careProvided);
        
        formData.selfCare[category].frequency = 
          selfCareData[category].frequency || 'daily';
        
        formData.selfCare[category].notes = 
          selfCareData[category].notes || '';
      }
    }
  });
}

function mapHomecareData(homecareData: any, formData: any) {
  const categories = ['mealPreparation', 'housekeeping', 'laundry', 'shopping', 'finances'];
  
  categories.forEach(category => {
    if (homecareData[category]) {
      if (typeof homecareData[category] === 'string') {
        const description = homecareData[category];
        if (description.trim()) {
          formData.homecare[category].needsAssistance = true;
          formData.homecare[category].careProvided = description;
          formData.homecare[category].minutesPerDay = estimateMinutesFromDescription(description);
        }
      } else {
        formData.homecare[category].needsAssistance = 
          homecareData[category].needsAssistance || 
          homecareData[category].assistance || 
          false;
        
        formData.homecare[category].careProvided = 
          homecareData[category].careProvided || 
          homecareData[category].description || 
          '';
        
        formData.homecare[category].minutesPerDay = 
          parseInt(homecareData[category].minutesPerDay) || 
          estimateMinutesFromDescription(formData.homecare[category].careProvided);
        
        formData.homecare[category].frequency = 
          homecareData[category].frequency || 
          (category === 'mealPreparation' ? 'daily' : 
           category === 'finances' ? 'monthly' : 'weekly');
        
        formData.homecare[category].notes = 
          homecareData[category].notes || '';
      }
    }
  });
}

function mapSupervisionData(supervisionData: any, formData: any) {
  const categories = ['cognitive', 'behavioral', 'safety'];
  
  categories.forEach(category => {
    if (supervisionData[category]) {
      if (typeof supervisionData[category] === 'string') {
        const description = supervisionData[category];
        if (description.trim()) {
          formData.supervision[category].needsSupervision = true;
          formData.supervision[category].details = description;
          formData.supervision[category].hoursPerDay = estimateSupervisionHours(description);
        }
      } else {
        formData.supervision[category].needsSupervision = 
          supervisionData[category].needsSupervision || 
          supervisionData[category].required || 
          false;
        
        formData.supervision[category].details = 
          supervisionData[category].details || 
          supervisionData[category].description || 
          '';
        
        formData.supervision[category].hoursPerDay = 
          parseFloat(supervisionData[category].hoursPerDay) || 
          estimateSupervisionHours(formData.supervision[category].details);
        
        formData.supervision[category].notes = 
          supervisionData[category].notes || '';
      }
    }
  });
}

function mapCurrentCareData(currentCareData: any, formData: any) {
  // Map providers
  if (currentCareData.providers && Array.isArray(currentCareData.providers)) {
    formData.currentCare.providers = currentCareData.providers.map((provider: any) => ({
      id: provider.id || nanoid(),
      type: provider.type || '',
      name: provider.name || '',
      relationship: provider.relationship || '',
      servicesProvided: provider.servicesProvided || '',
      hoursPerWeek: provider.hoursPerWeek || 0,
      notes: provider.notes || ''
    }));
  } else if (currentCareData.currentProviders && Array.isArray(currentCareData.currentProviders)) {
    formData.currentCare.providers = currentCareData.currentProviders.map((provider: any) => ({
      id: provider.id || nanoid(),
      type: provider.type || '',
      name: provider.name || '',
      relationship: provider.relationship || '',
      servicesProvided: provider.servicesProvided || provider.services || '',
      hoursPerWeek: provider.hoursPerWeek || provider.hours || 0,
      notes: provider.notes || ''
    }));
  }
  
  // Map summary
  formData.currentCare.summary = currentCareData.summary || '';
}

function mapRecommendationsData(recommendationsData: any, formData: any) {
  // Map hours
  formData.recommendations.selfCareHours = parseFloat(recommendationsData.selfCareHours) || 0;
  formData.recommendations.homecareHours = parseFloat(recommendationsData.homecareHours) || 0;
  formData.recommendations.supervisionHours = parseFloat(recommendationsData.supervisionHours) || 0;
  
  // Map total hours or calculate from components
  formData.recommendations.totalHours = 
    parseFloat(recommendationsData.totalHours) || 
    (formData.recommendations.selfCareHours + 
     formData.recommendations.homecareHours + 
     formData.recommendations.supervisionHours);
  
  // Map rationale and other considerations
  formData.recommendations.rationale = recommendationsData.rationale || '';
  formData.recommendations.otherConsiderations = recommendationsData.otherConsiderations || '';
}

function estimateMinutesFromDescription(description: string): number {
  if (!description) return 0;
  
  const lowerDesc = description.toLowerCase();
  
  // Try to extract direct time mentions
  const minutesPattern = /(\d+)\s*min/;
  const minutesMatch = lowerDesc.match(minutesPattern);
  if (minutesMatch && minutesMatch[1]) {
    return parseInt(minutesMatch[1]);
  }
  
  const hoursPattern = /(\d+(?:\.\d+)?)\s*hour/;
  const hoursMatch = lowerDesc.match(hoursPattern);
  if (hoursMatch && hoursMatch[1]) {
    return Math.round(parseFloat(hoursMatch[1]) * 60);
  }
  
  // Simple estimation based on keywords
  if (lowerDesc.includes('complete') || lowerDesc.includes('full assist')) {
    return 30;
  } else if (lowerDesc.includes('moderate') || lowerDesc.includes('partial')) {
    return 20;
  } else if (lowerDesc.includes('minimal') || lowerDesc.includes('setup')) {
    return 10;
  } else if (lowerDesc.includes('assist') || lowerDesc.includes('help')) {
    return 15;
  }
  
  return 0;
}

function estimateSupervisionHours(description: string): number {
  if (!description) return 0;
  
  const lowerDesc = description.toLowerCase();
  
  // Try to extract direct time mentions
  const hoursPattern = /(\d+(?:\.\d+)?)\s*hour/;
  const hoursMatch = lowerDesc.match(hoursPattern);
  if (hoursMatch && hoursMatch[1]) {
    return parseFloat(hoursMatch[1]);
  }
  
  // Simple estimation based on keywords
  if (lowerDesc.includes('24 hour') || lowerDesc.includes('24/7') || 
      lowerDesc.includes('constant') || lowerDesc.includes('continuous')) {
    return 24;
  } else if (lowerDesc.includes('overnight')) {
    return 8;
  } else if (lowerDesc.includes('extensive') || lowerDesc.includes('maximum')) {
    return 12;
  } else if (lowerDesc.includes('moderate') || lowerDesc.includes('intermittent')) {
    return 6;
  } else if (lowerDesc.includes('minimal') || lowerDesc.includes('occasional')) {
    return 2;
  } else if (lowerDesc.includes('supervision') || lowerDesc.includes('monitor')) {
    return 4;
  }
  
  return 0;
}

function createSelfCareContext(formData: any) {
  const categories = ['feeding', 'bathing', 'grooming', 'dressing', 'toileting', 'transfers', 'medication'];
  const result: any = {};
  
  categories.forEach(category => {
    result[category] = {
      needsAssistance: formData.selfCare[category].needsAssistance,
      careProvided: formData.selfCare[category].careProvided,
      minutesPerDay: parseInt(formData.selfCare[category].minutesPerDay) || 0,
      frequency: formData.selfCare[category].frequency,
      notes: formData.selfCare[category].notes
    };
  });
  
  return result;
}

function createHomecareContext(formData: any) {
  const categories = ['mealPreparation', 'housekeeping', 'laundry', 'shopping', 'finances'];
  const result: any = {};
  
  categories.forEach(category => {
    result[category] = {
      needsAssistance: formData.homecare[category].needsAssistance,
      careProvided: formData.homecare[category].careProvided,
      minutesPerDay: parseInt(formData.homecare[category].minutesPerDay) || 0,
      frequency: formData.homecare[category].frequency,
      notes: formData.homecare[category].notes
    };
  });
  
  return result;
}

function createSupervisionContext(formData: any) {
  const categories = ['cognitive', 'behavioral', 'safety'];
  const result: any = {};
  
  categories.forEach(category => {
    result[category] = {
      needsSupervision: formData.supervision[category].needsSupervision,
      details: formData.supervision[category].details,
      hoursPerDay: parseFloat(formData.supervision[category].hoursPerDay) || 0,
      notes: formData.supervision[category].notes
    };
  });
  
  return result;
}

function createCurrentCareContext(formData: any) {
  return {
    providers: formData.currentCare.providers.map((provider: any) => ({
      id: provider.id,
      type: provider.type,
      name: provider.name,
      relationship: provider.relationship,
      servicesProvided: provider.servicesProvided,
      hoursPerWeek: provider.hoursPerWeek,
      notes: provider.notes
    })),
    summary: formData.currentCare.summary
  };
}

function createRecommendationsContext(formData: any) {
  return {
    selfCareHours: parseFloat(formData.recommendations.selfCareHours) || 0,
    homecareHours: parseFloat(formData.recommendations.homecareHours) || 0,
    supervisionHours: parseFloat(formData.recommendations.supervisionHours) || 0,
    totalHours: parseFloat(formData.recommendations.totalHours) || 0,
    rationale: formData.recommendations.rationale,
    otherConsiderations: formData.recommendations.otherConsiderations
  };
}
