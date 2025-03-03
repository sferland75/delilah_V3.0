// Test script for the Medical History fix
// This demonstrates how the revised Medical History component handles data properly

// Sample context data structure
const contextData = {
  medicalHistory: {
    pastMedicalHistory: {
      conditions: [
        {
          condition: "Hypertension",
          diagnosisDate: "2018-03-15",
          status: "managed",
          treatment: "Lisinopril 10mg daily"
        },
        {
          condition: "Type 2 Diabetes",
          diagnosisDate: "2019-06-10",
          status: "managed",
          treatment: "Metformin 500mg twice daily, diet management"
        }
      ],
      surgeries: [
        {
          procedure: "Appendectomy",
          date: "2005-11-20",
          surgeon: "Dr. Robert Taylor",
          facility: "Springfield General Hospital",
          outcome: "Full recovery, no complications"
        }
      ],
      allergies: [
        "Penicillin - causes rash",
        "Sulfa drugs - causes difficulty breathing"
      ]
    }
  }
};

// Original problematic mapping function (for demonstration)
function originalMapContextDataToForm() {
  const formData = {};
  
  // This would cause the error: Cannot set properties of undefined (setting 'conditions')
  formData.preExistingConditions.conditions = 
    contextData.medicalHistory.pastMedicalHistory.conditions.map((condition) => ({
      name: condition.condition || '',
      diagnosisDate: condition.diagnosisDate || '',
      treatment: condition.treatment || ''
    }));
    
  return formData;
}

// Fixed mapping function with proper initialization and error handling
function fixedMapContextDataToForm() {
  // Create a deep copy of a default form state (simplified for demonstration)
  const formData = { preExistingConditions: {} };
  
  try {
    // Safely check if medicalHistory exists in contextData
    if (!contextData.medicalHistory) {
      console.log("No medical history data found in context");
      return formData;
    }
    
    const medicalHistory = contextData.medicalHistory;
    
    // Map the conditions array if it exists
    if (medicalHistory.pastMedicalHistory?.conditions) {
      // Initialize the preExistingConditions object if it doesn't exist
      if (!formData.preExistingConditions) {
        formData.preExistingConditions = {};
      }
      
      formData.preExistingConditions.conditions = 
        medicalHistory.pastMedicalHistory.conditions.map((condition) => ({
          name: condition.condition || '',
          diagnosisDate: condition.diagnosisDate || '',
          treatment: condition.treatment || ''
        }));
    }
    
    // Map the surgeries array if it exists
    if (medicalHistory.pastMedicalHistory?.surgeries) {
      // Initialize the preExistingConditions object if it doesn't exist
      if (!formData.preExistingConditions) {
        formData.preExistingConditions = {};
      }
      
      formData.preExistingConditions.surgeries = 
        medicalHistory.pastMedicalHistory.surgeries.map((surgery) => ({
          procedure: surgery.procedure || '',
          date: surgery.date || '',
          surgeon: surgery.surgeon || ''
        }));
    }
    
    return formData;
  } catch (error) {
    console.error("Error mapping medical history data:", error);
    return { preExistingConditions: {} };
  }
}

// Test the functions
console.log("Testing mapping functions...");

try {
  console.log("Original function would cause error");
  // Uncomment to see the error:
  // const originalResult = originalMapContextDataToForm();
  // console.log("Original result:", originalResult);
} catch (error) {
  console.error("Original function error:", error.message);
}

try {
  console.log("\nFixed function handles data properly:");
  const fixedResult = fixedMapContextDataToForm();
  console.log("Fixed result:", JSON.stringify(fixedResult, null, 2));
} catch (error) {
  console.error("Fixed function error:", error.message);
}

console.log("\nKey improvements in the fixed version:");
console.log("1. Properly initializes objects before setting properties");
console.log("2. Uses optional chaining (?.) for safe property access");
console.log("3. Implements try/catch for error handling");
console.log("4. Provides fallback defaults for missing data");
