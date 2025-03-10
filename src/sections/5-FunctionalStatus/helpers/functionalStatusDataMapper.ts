/**
 * Helper functions for mapping data between context and form in the Functional Status section
 */

import { FormState } from '../types';
import { defaultFormState } from '../schema';

/**
 * Maps context data to form structure
 * @param contextData The data from the assessment context
 * @returns Form state data
 */
export function mapAndPrepareContextData(contextData: any): { formData: FormState, hasData: boolean } {
  try {
    // Start with default form state
    const formData = JSON.parse(JSON.stringify(defaultFormState));
    
    if (!contextData || Object.keys(contextData).length === 0) {
      return { formData, hasData: false };
    }
    
    console.log("Mapping functional status context data:", contextData);
    let hasData = false;
    
    // Map mobility assessment if it exists
    if (contextData.mobilityAssessment) {
      hasData = true;
      
      try {
        if (contextData.mobilityAssessment.bedMobility) {
          formData.data.transfers.basic.bedMobility.independence = 
            mapMobilityToIndependence(contextData.mobilityAssessment.bedMobility);
          formData.data.transfers.basic.bedMobility.notes = 
            `Context: ${contextData.mobilityAssessment.bedMobility}`;
        }
        
        if (contextData.mobilityAssessment.transfers) {
          formData.data.transfers.basic.sitToStand.independence = 
            mapMobilityToIndependence(contextData.mobilityAssessment.transfers);
          formData.data.transfers.basic.sitToStand.notes = 
            `Context: ${contextData.mobilityAssessment.transfers}`;
        }
        
        if (contextData.mobilityAssessment.ambulation) {
          formData.data.posturalTolerances.dynamic.walking.toleranceLevel = 
            contextData.mobilityAssessment.ambulation.includes('limited') ? 'moderatelyLimited' : 'normal';
          formData.data.posturalTolerances.dynamic.walking.notes = 
            `Context: ${contextData.mobilityAssessment.ambulation}`;
        }
        
        if (contextData.mobilityAssessment.balance) {
          formData.data.bergBalance.generalNotes = 
            `Context balance assessment: ${contextData.mobilityAssessment.balance}`;
        }
        
        if (contextData.mobilityAssessment.endurance) {
          formData.data.posturalTolerances.dynamic.generalNotes = 
            `Context endurance assessment: ${contextData.mobilityAssessment.endurance}`;
        }
        
        if (contextData.mobilityAssessment.assistiveDevices) {
          const devices = contextData.mobilityAssessment.assistiveDevices;
          formData.data.transfers.basic.sitToStand.assistiveDevice = devices;
          formData.data.posturalTolerances.dynamic.walking.assistiveDevice = devices;
        }
      } catch (error) {
        console.error("Error mapping mobility assessment:", error);
      }
    }
    
    // Map upper extremity function if it exists
    if (contextData.upperExtremityFunction) {
      hasData = true;
      
      try {
        if (contextData.upperExtremityFunction.rightShoulderROM) {
          const shoulderData = contextData.upperExtremityFunction.rightShoulderROM;
          if (formData.data.rangeOfMotion.upperExtremity) {
            formData.data.rangeOfMotion.upperExtremity.rightShoulderFlexion = {
              range: mapROMDescription(shoulderData),
              painLimited: shoulderData.toLowerCase().includes('pain'),
              weakness: false
            };
            formData.data.rangeOfMotion.upperExtremity.rightShoulderAbduction = {
              range: mapROMDescription(shoulderData),
              painLimited: shoulderData.toLowerCase().includes('pain'),
              weakness: false
            };
          }
        }
        
        if (contextData.upperExtremityFunction.leftShoulderROM) {
          const shoulderData = contextData.upperExtremityFunction.leftShoulderROM;
          if (formData.data.rangeOfMotion.upperExtremity) {
            formData.data.rangeOfMotion.upperExtremity.leftShoulderFlexion = {
              range: mapROMDescription(shoulderData),
              painLimited: shoulderData.toLowerCase().includes('pain'),
              weakness: false
            };
            formData.data.rangeOfMotion.upperExtremity.leftShoulderAbduction = {
              range: mapROMDescription(shoulderData),
              painLimited: shoulderData.toLowerCase().includes('pain'),
              weakness: false
            };
          }
        }
        
        if (contextData.upperExtremityFunction.rightGripStrength || 
            contextData.upperExtremityFunction.leftGripStrength) {
          if (formData.data.manualMuscle && formData.data.manualMuscle.hand) {
            formData.data.manualMuscle.hand.isExpanded = true;
            formData.data.manualMuscle.hand.gripStrength = formData.data.manualMuscle.hand.gripStrength || {};
            formData.data.manualMuscle.hand.gripStrength.notes = 
              `Right: ${contextData.upperExtremityFunction.rightGripStrength || 'N/A'}, ` +
              `Left: ${contextData.upperExtremityFunction.leftGripStrength || 'N/A'}`;
              
            if (contextData.upperExtremityFunction.rightGripStrength) {
              const rightMatch = contextData.upperExtremityFunction.rightGripStrength.match(/(\d+)/);
              if (rightMatch && rightMatch[1]) {
                formData.data.manualMuscle.hand.gripStrength.right = mapMMTValue(rightMatch[1]);
              }
            }
            
            if (contextData.upperExtremityFunction.leftGripStrength) {
              const leftMatch = contextData.upperExtremityFunction.leftGripStrength.match(/(\d+)/);
              if (leftMatch && leftMatch[1]) {
                formData.data.manualMuscle.hand.gripStrength.left = mapMMTValue(leftMatch[1]);
              }
            }
          }
        }
        
        if (contextData.upperExtremityFunction.fineMotorSkills) {
          if (formData.data.manualMuscle && formData.data.manualMuscle.hand) {
            formData.data.manualMuscle.hand.generalNotes = 
              `Fine motor skills: ${contextData.upperExtremityFunction.fineMotorSkills}`;
          }
        }
      } catch (error) {
        console.error("Error mapping upper extremity function:", error);
      }
    }
    
    return { formData, hasData };
  } catch (error) {
    console.error("Error in mapAndPrepareContextData:", error);
    return { formData: defaultFormState, hasData: false };
  }
}

/**
 * Prepares form data for context update
 * @param formData The data from the form
 * @returns Data structured for the assessment context
 */
export function prepareDataForContext(formData: FormState): any {
  try {
    // Create the context structure
    return {
      mobilityAssessment: {
        bedMobility: getBedMobilityFromForm(formData),
        transfers: getTransfersFromForm(formData),
        ambulation: getAmbulationFromForm(formData),
        balance: getBalanceFromForm(formData),
        endurance: getEnduranceFromForm(formData),
        assistiveDevices: getAssistiveDevicesFromForm(formData)
      },
      upperExtremityFunction: {
        dominance: "Right-handed", // Default for now, could be user-configurable
        rightShoulderROM: getRightShoulderROMFromForm(formData),
        leftShoulderROM: getLeftShoulderROMFromForm(formData),
        rightGripStrength: getRightGripStrengthFromForm(formData),
        leftGripStrength: getLeftGripStrengthFromForm(formData),
        fineMotorSkills: getFineMotorSkillsFromForm(formData)
      },
      posturalTolerances: {
        sitting: getSittingToleranceFromForm(formData),
        standing: getStandingToleranceFromForm(formData),
        walking: getWalkingToleranceFromForm(formData)
      },
      balanceAssessment: {
        bergBalanceScore: getBergBalanceScoreFromForm(formData),
        standingBalance: getStandingBalanceFromForm(formData),
        sittingBalance: getSittingBalanceFromForm(formData),
        dynamicBalance: getDynamicBalanceFromForm(formData)
      }
    };
  } catch (error) {
    console.error("Error in prepareDataForContext:", error);
    return {};
  }
}

// Helper function to map mobility descriptions to independence levels
function mapMobilityToIndependence(mobilityDescription: string): string {
  try {
    const lowerDesc = mobilityDescription.toLowerCase();
    
    if (lowerDesc.includes('independent')) return 'independent';
    if (lowerDesc.includes('supervision')) return 'supervision';
    if (lowerDesc.includes('minimal')) return 'minimalAssist';
    if (lowerDesc.includes('moderate')) return 'moderateAssist';
    if (lowerDesc.includes('maximal')) return 'maximalAssist';
    if (lowerDesc.includes('dependent')) return 'dependent';
    if (lowerDesc.includes('setup')) return 'setup';
    
    return 'independent'; // Default
  } catch (error) {
    console.error("Error in mapMobilityToIndependence:", error);
    return 'independent';
  }
}

// Helper function to map ROM descriptions to range values
function mapROMDescription(description: string): string {
  try {
    const lowerDesc = description.toLowerCase();
    
    if (lowerDesc.includes('normal') || lowerDesc.includes('wnl')) return 'WNL';
    if (lowerDesc.includes('severe')) return '25';
    if (lowerDesc.includes('moderate')) return '50';
    if (lowerDesc.includes('mild')) return '75';
    
    return 'WNL';
  } catch (error) {
    console.error("Error in mapROMDescription:", error);
    return 'WNL';
  }
}

// Helper function to map numerical values to MMT grades
function mapMMTValue(value: string): string {
  try {
    const numValue = parseInt(value);
    if (numValue >= 90) return '5';
    if (numValue >= 75) return '4+';
    if (numValue >= 65) return '4';
    if (numValue >= 50) return '3+';
    if (numValue >= 35) return '3';
    if (numValue >= 20) return '2';
    if (numValue >= 5) return '1';
    return '0';
  } catch (error) {
    console.error("Error in mapMMTValue:", error);
    return '5';
  }
}

// Extraction functions with error handling
function getBedMobilityFromForm(formData: FormState): string {
  try {
    const bedMobility = formData.data.transfers.basic.bedMobility;
    return `${bedMobility.independence}${bedMobility.notes ? ': ' + bedMobility.notes : ''}`;
  } catch (error) {
    console.error("Error in getBedMobilityFromForm:", error);
    return "Not assessed";
  }
}

function getTransfersFromForm(formData: FormState): string {
  try {
    const sitToStand = formData.data.transfers.basic.sitToStand;
    return `${sitToStand.independence}${sitToStand.notes ? ': ' + sitToStand.notes : ''}`;
  } catch (error) {
    console.error("Error in getTransfersFromForm:", error);
    return "Not assessed";
  }
}

function getAmbulationFromForm(formData: FormState): string {
  try {
    const walking = formData.data.posturalTolerances.dynamic.walking;
    return `${walking.toleranceLevel}${walking.notes ? ': ' + walking.notes : ''}`;
  } catch (error) {
    console.error("Error in getAmbulationFromForm:", error);
    return "Not assessed";
  }
}

function getBalanceFromForm(formData: FormState): string {
  try {
    return formData.data.bergBalance.generalNotes || 'Not specifically assessed';
  } catch (error) {
    console.error("Error in getBalanceFromForm:", error);
    return "Not assessed";
  }
}

function getEnduranceFromForm(formData: FormState): string {
  try {
    return formData.data.posturalTolerances.dynamic.generalNotes || 'Not specifically assessed';
  } catch (error) {
    console.error("Error in getEnduranceFromForm:", error);
    return "Not assessed";
  }
}

function getAssistiveDevicesFromForm(formData: FormState): string {
  try {
    const devices = [];
    
    // Check for assistive devices in transfers
    if (formData.data.transfers && formData.data.transfers.basic) {
      Object.entries(formData.data.transfers.basic).forEach(([key, value]: [string, any]) => {
        if (typeof value === 'object' && value && value.assistiveDevice) {
          devices.push(value.assistiveDevice);
        }
      });
    }
    
    if (formData.data.transfers && formData.data.transfers.functional) {
      Object.entries(formData.data.transfers.functional).forEach(([key, value]: [string, any]) => {
        if (typeof value === 'object' && value && value.assistiveDevice) {
          devices.push(value.assistiveDevice);
        }
      });
    }
    
    // Check for assistive devices in postural tolerances
    if (formData.data.posturalTolerances && formData.data.posturalTolerances.dynamic) {
      Object.entries(formData.data.posturalTolerances.dynamic).forEach(([key, value]: [string, any]) => {
        if (typeof value === 'object' && value && value.assistiveDevice) {
          devices.push(value.assistiveDevice);
        }
      });
    }
    
    return devices.length > 0 ? [...new Set(devices)].join(', ') : 'None currently';
  } catch (error) {
    console.error("Error in getAssistiveDevicesFromForm:", error);
    return "Not documented";
  }
}

function getRightShoulderROMFromForm(formData: FormState): string {
  try {
    const upperExtremity = formData.data.rangeOfMotion.upperExtremity;
    if (!upperExtremity) return "WNL";
    
    // Get relevant ROM values with fallbacks
    const flexion = upperExtremity.rightShoulderFlexion?.range || 'WNL';
    const abduction = upperExtremity.rightShoulderAbduction?.range || 'WNL';
    const externalRotation = upperExtremity.rightShoulderExternalRotation?.range || 'WNL';
    
    return `Flexion: ${flexion}, Abduction: ${abduction}, External rotation: ${externalRotation}`;
  } catch (error) {
    console.error("Error in getRightShoulderROMFromForm:", error);
    return "WNL";
  }
}

function getLeftShoulderROMFromForm(formData: FormState): string {
  try {
    const upperExtremity = formData.data.rangeOfMotion.upperExtremity;
    if (!upperExtremity) return "WNL";
    
    // Get relevant ROM values with fallbacks
    const flexion = upperExtremity.leftShoulderFlexion?.range || 'WNL';
    const abduction = upperExtremity.leftShoulderAbduction?.range || 'WNL';
    const externalRotation = upperExtremity.leftShoulderExternalRotation?.range || 'WNL';
    
    return `Flexion: ${flexion}, Abduction: ${abduction}, External rotation: ${externalRotation}`;
  } catch (error) {
    console.error("Error in getLeftShoulderROMFromForm:", error);
    return "WNL";
  }
}

function getRightGripStrengthFromForm(formData: FormState): string {
  try {
    if (!formData.data.manualMuscle?.hand?.gripStrength?.right) {
      return "Normal";
    }
    return formData.data.manualMuscle.hand.gripStrength.right;
  } catch (error) {
    console.error("Error in getRightGripStrengthFromForm:", error);
    return "Normal";
  }
}

function getLeftGripStrengthFromForm(formData: FormState): string {
  try {
    if (!formData.data.manualMuscle?.hand?.gripStrength?.left) {
      return "Normal";
    }
    return formData.data.manualMuscle.hand.gripStrength.left;
  } catch (error) {
    console.error("Error in getLeftGripStrengthFromForm:", error);
    return "Normal";
  }
}

function getFineMotorSkillsFromForm(formData: FormState): string {
  try {
    if (!formData.data.manualMuscle?.hand?.generalNotes) {
      return "Intact bilaterally";
    }
    return formData.data.manualMuscle.hand.generalNotes;
  } catch (error) {
    console.error("Error in getFineMotorSkillsFromForm:", error);
    return "Intact bilaterally";
  }
}

function getSittingToleranceFromForm(formData: FormState): string {
  try {
    const sitting = formData.data.posturalTolerances?.static?.sitting;
    if (!sitting) return "Not assessed";
    
    return `${sitting.toleranceLevel}${sitting.duration ? ', ' + sitting.duration + ' ' + sitting.unit : ''}`;
  } catch (error) {
    console.error("Error in getSittingToleranceFromForm:", error);
    return "Not assessed";
  }
}

function getStandingToleranceFromForm(formData: FormState): string {
  try {
    const standing = formData.data.posturalTolerances?.static?.standing;
    if (!standing) return "Not assessed";
    
    return `${standing.toleranceLevel}${standing.duration ? ', ' + standing.duration + ' ' + standing.unit : ''}`;
  } catch (error) {
    console.error("Error in getStandingToleranceFromForm:", error);
    return "Not assessed";
  }
}

function getWalkingToleranceFromForm(formData: FormState): string {
  try {
    const walking = formData.data.posturalTolerances?.dynamic?.walking;
    if (!walking) return "Not assessed";
    
    return `${walking.toleranceLevel}${walking.duration ? ', ' + walking.duration + ' ' + walking.unit : ''}`;
  } catch (error) {
    console.error("Error in getWalkingToleranceFromForm:", error);
    return "Not assessed";
  }
}

function getBergBalanceScoreFromForm(formData: FormState): number {
  try {
    // Calculate total Berg Balance score
    let totalScore = 0;
    const bergBalance = formData.data.bergBalance;
    if (!bergBalance) return 0;
    
    // Add up all item scores
    Object.entries(bergBalance).forEach(([key, value]: [string, any]) => {
      if (typeof value === 'object' && value && typeof value.score === 'number') {
        totalScore += value.score;
      }
    });
    
    return totalScore;
  } catch (error) {
    console.error("Error in getBergBalanceScoreFromForm:", error);
    return 0;
  }
}

function getStandingBalanceFromForm(formData: FormState): string {
  try {
    const standingUnsupported = formData.data.bergBalance?.standingUnsupported;
    if (!standingUnsupported) return "Not assessed";
    
    const score = standingUnsupported.score;
    
    if (score === 4) return "Good";
    if (score === 3) return "Fair";
    if (score <= 2) return "Poor";
    
    return "Not assessed";
  } catch (error) {
    console.error("Error in getStandingBalanceFromForm:", error);
    return "Not assessed";
  }
}

function getSittingBalanceFromForm(formData: FormState): string {
  try {
    const sittingUnsupported = formData.data.bergBalance?.sittingUnsupported;
    if (!sittingUnsupported) return "Not assessed";
    
    const score = sittingUnsupported.score;
    
    if (score === 4) return "Good";
    if (score === 3) return "Fair";
    if (score <= 2) return "Poor";
    
    return "Not assessed";
  } catch (error) {
    console.error("Error in getSittingBalanceFromForm:", error);
    return "Not assessed";
  }
}

function getDynamicBalanceFromForm(formData: FormState): string {
  try {
    const bergBalance = formData.data.bergBalance;
    if (!bergBalance) return "Not assessed";
    
    // Average scores from dynamic balance tasks
    const items = [
      bergBalance.turning360Degrees,
      bergBalance.placingAlternateFoot,
      bergBalance.standingWithOneFootAhead
    ];
    
    const validItems = items.filter(item => item && typeof item.score === 'number');
    if (validItems.length === 0) return "Not assessed";
    
    const average = validItems.reduce((sum, item) => sum + item.score, 0) / validItems.length;
    
    if (average >= 3.5) return "Good";
    if (average >= 2) return "Fair";
    return "Poor";
  } catch (error) {
    console.error("Error in getDynamicBalanceFromForm:", error);
    return "Not assessed";
  }
}