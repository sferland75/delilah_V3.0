/**
 * Functional Status Data Mapping Service
 * 
 * This service handles bidirectional mapping between:
 * 1. Context data structure (as used in AssessmentContext)
 * 2. Form data structure (as used in React Hook Form)
 */

import { nanoid } from 'nanoid';

// Default form values
export const defaultValues = {
  mobilityAssessment: {
    walkingAids: {
      usesMobilityAids: false,
      aids: [],
      other: ''
    },
    walkingCapacity: {
      indoorWalkingDistance: '',
      outdoorWalkingDistance: '',
      stairsCapacity: '',
      terrainCapacity: ''
    },
    balance: {
      bergBalance: {
        total: '',
        sitToStand: '',
        standingUnsupported: '',
        sittingUnsupported: '',
        standToSit: '',
        transfers: '',
        standingEyesClosed: '',
        standingFeetTogether: '',
        reachingForward: '',
        retrievingObject: '',
        turningToLookBehind: '',
        turning360: '',
        placingFootOnStool: '',
        standingOnOneFoot: ''
      },
      additionalNotes: ''
    }
  },
  upperExtremityFunction: {
    dominance: 'right',
    rangeOfMotion: {
      left: {
        shoulder: {
          flexion: '',
          abduction: '',
          externalRotation: '',
          internalRotation: ''
        },
        elbow: {
          flexion: '',
          extension: ''
        },
        wrist: {
          flexion: '',
          extension: ''
        },
        limitations: ''
      },
      right: {
        shoulder: {
          flexion: '',
          abduction: '',
          externalRotation: '',
          internalRotation: ''
        },
        elbow: {
          flexion: '',
          extension: ''
        },
        wrist: {
          flexion: '',
          extension: ''
        },
        limitations: ''
      }
    },
    grip: {
      left: '',
      right: '',
      normative: ''
    },
    pinch: {
      left: '',
      right: '',
      normative: ''
    },
    coordination: {
      grossCoordination: '',
      fineCoordination: ''
    },
    functionalNotes: ''
  },
  posture: {
    posturalTolerance: {
      sitting: '',
      standing: '',
      sittingActivities: '',
      standingActivities: ''
    },
    posturalAssessment: {
      notes: '',
      headPosition: '',
      shoulderPosition: '',
      spineCurvature: '',
      pelvisPosition: '',
      kneePosition: '',
      footPosition: ''
    }
  }
};

/**
 * Maps context data to form data structure
 * @param contextData Functional status data from the assessment context
 * @returns Object containing form data and hasData flag
 */
export function mapContextToForm(contextData: any) {
  try {
    console.log("Functional Status Mapper - Context Data:", contextData);
    
    // Start with default values
    const formData = JSON.parse(JSON.stringify(defaultValues));
    let hasData = false;
    
    // Early return if no data
    if (!contextData || Object.keys(contextData).length === 0) {
      return { formData, hasData };
    }

    // 1. Map Mobility Assessment data
    try {
      if (contextData.mobilityAssessment) {
        hasData = true;
        
        // Map walking aids
        if (contextData.mobilityAssessment.walkingAids) {
          formData.mobilityAssessment.walkingAids.usesMobilityAids = 
            contextData.mobilityAssessment.walkingAids.usesMobilityAids === true || 
            (contextData.mobilityAssessment.walkingAids.aids && 
             contextData.mobilityAssessment.walkingAids.aids.length > 0);
          
          if (contextData.mobilityAssessment.walkingAids.aids) {
            formData.mobilityAssessment.walkingAids.aids = 
              Array.isArray(contextData.mobilityAssessment.walkingAids.aids) ?
              contextData.mobilityAssessment.walkingAids.aids :
              [contextData.mobilityAssessment.walkingAids.aids];
          }
          
          formData.mobilityAssessment.walkingAids.other = 
            contextData.mobilityAssessment.walkingAids.other || '';
        } else if (typeof contextData.mobilityAssessment === 'string' && 
                  (contextData.mobilityAssessment.includes('cane') || 
                   contextData.mobilityAssessment.includes('walker') || 
                   contextData.mobilityAssessment.includes('wheelchair'))) {
          // Try to extract mobility aids from a string description
          formData.mobilityAssessment.walkingAids.usesMobilityAids = true;
          const aids = [];
          if (contextData.mobilityAssessment.includes('cane')) aids.push('cane');
          if (contextData.mobilityAssessment.includes('walker')) aids.push('walker');
          if (contextData.mobilityAssessment.includes('wheelchair')) aids.push('wheelchair');
          if (contextData.mobilityAssessment.includes('crutches')) aids.push('crutches');
          formData.mobilityAssessment.walkingAids.aids = aids;
        }
        
        // Map walking capacity
        if (contextData.mobilityAssessment.walkingCapacity) {
          formData.mobilityAssessment.walkingCapacity.indoorWalkingDistance = 
            contextData.mobilityAssessment.walkingCapacity.indoorWalkingDistance || '';
          formData.mobilityAssessment.walkingCapacity.outdoorWalkingDistance = 
            contextData.mobilityAssessment.walkingCapacity.outdoorWalkingDistance || '';
          formData.mobilityAssessment.walkingCapacity.stairsCapacity = 
            contextData.mobilityAssessment.walkingCapacity.stairsCapacity || '';
          formData.mobilityAssessment.walkingCapacity.terrainCapacity = 
            contextData.mobilityAssessment.walkingCapacity.terrainCapacity || '';
        }
        
        // Map Berg Balance assessment
        if (contextData.mobilityAssessment.balance) {
          if (contextData.mobilityAssessment.balance.bergBalance) {
            Object.keys(formData.mobilityAssessment.balance.bergBalance).forEach(key => {
              if (contextData.mobilityAssessment.balance.bergBalance[key]) {
                formData.mobilityAssessment.balance.bergBalance[key] = 
                  contextData.mobilityAssessment.balance.bergBalance[key].toString();
              }
            });
          }
          
          formData.mobilityAssessment.balance.additionalNotes = 
            contextData.mobilityAssessment.balance.additionalNotes || 
            contextData.mobilityAssessment.balance.notes || '';
        }
      }
    } catch (error) {
      console.error("Functional Status Mapper - Error mapping mobility assessment:", error);
    }
    
    // 2. Map Upper Extremity Function data
    try {
      if (contextData.upperExtremityFunction) {
        hasData = true;
        
        // Map hand dominance
        formData.upperExtremityFunction.dominance = 
          contextData.upperExtremityFunction.dominance || 'right';
        
        // Map Range of Motion data
        if (contextData.upperExtremityFunction.rangeOfMotion) {
          // Map left side ROM
          if (contextData.upperExtremityFunction.rangeOfMotion.left) {
            // Shoulder
            if (contextData.upperExtremityFunction.rangeOfMotion.left.shoulder) {
              formData.upperExtremityFunction.rangeOfMotion.left.shoulder.flexion = 
                contextData.upperExtremityFunction.rangeOfMotion.left.shoulder.flexion?.toString() || '';
              formData.upperExtremityFunction.rangeOfMotion.left.shoulder.abduction = 
                contextData.upperExtremityFunction.rangeOfMotion.left.shoulder.abduction?.toString() || '';
              formData.upperExtremityFunction.rangeOfMotion.left.shoulder.externalRotation = 
                contextData.upperExtremityFunction.rangeOfMotion.left.shoulder.externalRotation?.toString() || '';
              formData.upperExtremityFunction.rangeOfMotion.left.shoulder.internalRotation = 
                contextData.upperExtremityFunction.rangeOfMotion.left.shoulder.internalRotation?.toString() || '';
            }
            
            // Elbow
            if (contextData.upperExtremityFunction.rangeOfMotion.left.elbow) {
              formData.upperExtremityFunction.rangeOfMotion.left.elbow.flexion = 
                contextData.upperExtremityFunction.rangeOfMotion.left.elbow.flexion?.toString() || '';
              formData.upperExtremityFunction.rangeOfMotion.left.elbow.extension = 
                contextData.upperExtremityFunction.rangeOfMotion.left.elbow.extension?.toString() || '';
            }
            
            // Wrist
            if (contextData.upperExtremityFunction.rangeOfMotion.left.wrist) {
              formData.upperExtremityFunction.rangeOfMotion.left.wrist.flexion = 
                contextData.upperExtremityFunction.rangeOfMotion.left.wrist.flexion?.toString() || '';
              formData.upperExtremityFunction.rangeOfMotion.left.wrist.extension = 
                contextData.upperExtremityFunction.rangeOfMotion.left.wrist.extension?.toString() || '';
            }
            
            // Limitations
            formData.upperExtremityFunction.rangeOfMotion.left.limitations = 
              contextData.upperExtremityFunction.rangeOfMotion.left.limitations || '';
          }
          
          // Map right side ROM
          if (contextData.upperExtremityFunction.rangeOfMotion.right) {
            // Shoulder
            if (contextData.upperExtremityFunction.rangeOfMotion.right.shoulder) {
              formData.upperExtremityFunction.rangeOfMotion.right.shoulder.flexion = 
                contextData.upperExtremityFunction.rangeOfMotion.right.shoulder.flexion?.toString() || '';
              formData.upperExtremityFunction.rangeOfMotion.right.shoulder.abduction = 
                contextData.upperExtremityFunction.rangeOfMotion.right.shoulder.abduction?.toString() || '';
              formData.upperExtremityFunction.rangeOfMotion.right.shoulder.externalRotation = 
                contextData.upperExtremityFunction.rangeOfMotion.right.shoulder.externalRotation?.toString() || '';
              formData.upperExtremityFunction.rangeOfMotion.right.shoulder.internalRotation = 
                contextData.upperExtremityFunction.rangeOfMotion.right.shoulder.internalRotation?.toString() || '';
            }
            
            // Elbow
            if (contextData.upperExtremityFunction.rangeOfMotion.right.elbow) {
              formData.upperExtremityFunction.rangeOfMotion.right.elbow.flexion = 
                contextData.upperExtremityFunction.rangeOfMotion.right.elbow.flexion?.toString() || '';
              formData.upperExtremityFunction.rangeOfMotion.right.elbow.extension = 
                contextData.upperExtremityFunction.rangeOfMotion.right.elbow.extension?.toString() || '';
            }
            
            // Wrist
            if (contextData.upperExtremityFunction.rangeOfMotion.right.wrist) {
              formData.upperExtremityFunction.rangeOfMotion.right.wrist.flexion = 
                contextData.upperExtremityFunction.rangeOfMotion.right.wrist.flexion?.toString() || '';
              formData.upperExtremityFunction.rangeOfMotion.right.wrist.extension = 
                contextData.upperExtremityFunction.rangeOfMotion.right.wrist.extension?.toString() || '';
            }
            
            // Limitations
            formData.upperExtremityFunction.rangeOfMotion.right.limitations = 
              contextData.upperExtremityFunction.rangeOfMotion.right.limitations || '';
          }
        }
        
        // Map Grip and Pinch strength
        if (contextData.upperExtremityFunction.grip) {
          formData.upperExtremityFunction.grip.left = 
            contextData.upperExtremityFunction.grip.left?.toString() || '';
          formData.upperExtremityFunction.grip.right = 
            contextData.upperExtremityFunction.grip.right?.toString() || '';
          formData.upperExtremityFunction.grip.normative = 
            contextData.upperExtremityFunction.grip.normative?.toString() || '';
        }
        
        if (contextData.upperExtremityFunction.pinch) {
          formData.upperExtremityFunction.pinch.left = 
            contextData.upperExtremityFunction.pinch.left?.toString() || '';
          formData.upperExtremityFunction.pinch.right = 
            contextData.upperExtremityFunction.pinch.right?.toString() || '';
          formData.upperExtremityFunction.pinch.normative = 
            contextData.upperExtremityFunction.pinch.normative?.toString() || '';
        }
        
        // Map coordination
        if (contextData.upperExtremityFunction.coordination) {
          formData.upperExtremityFunction.coordination.grossCoordination = 
            contextData.upperExtremityFunction.coordination.grossCoordination || '';
          formData.upperExtremityFunction.coordination.fineCoordination = 
            contextData.upperExtremityFunction.coordination.fineCoordination || '';
        }
        
        // Map functional notes
        formData.upperExtremityFunction.functionalNotes = 
          contextData.upperExtremityFunction.functionalNotes || 
          contextData.upperExtremityFunction.notes || '';
      }
    } catch (error) {
      console.error("Functional Status Mapper - Error mapping upper extremity function:", error);
    }
    
    // 3. Map Posture data
    try {
      if (contextData.posture) {
        hasData = true;
        
        // Map postural tolerance
        if (contextData.posture.posturalTolerance) {
          formData.posture.posturalTolerance.sitting = 
            contextData.posture.posturalTolerance.sitting || '';
          formData.posture.posturalTolerance.standing = 
            contextData.posture.posturalTolerance.standing || '';
          formData.posture.posturalTolerance.sittingActivities = 
            contextData.posture.posturalTolerance.sittingActivities || '';
          formData.posture.posturalTolerance.standingActivities = 
            contextData.posture.posturalTolerance.standingActivities || '';
        }
        
        // Map postural assessment
        if (contextData.posture.posturalAssessment) {
          formData.posture.posturalAssessment.notes = 
            contextData.posture.posturalAssessment.notes || '';
          formData.posture.posturalAssessment.headPosition = 
            contextData.posture.posturalAssessment.headPosition || '';
          formData.posture.posturalAssessment.shoulderPosition = 
            contextData.posture.posturalAssessment.shoulderPosition || '';
          formData.posture.posturalAssessment.spineCurvature = 
            contextData.posture.posturalAssessment.spineCurvature || '';
          formData.posture.posturalAssessment.pelvisPosition = 
            contextData.posture.posturalAssessment.pelvisPosition || '';
          formData.posture.posturalAssessment.kneePosition = 
            contextData.posture.posturalAssessment.kneePosition || '';
          formData.posture.posturalAssessment.footPosition = 
            contextData.posture.posturalAssessment.footPosition || '';
        }
      }
    } catch (error) {
      console.error("Functional Status Mapper - Error mapping posture:", error);
    }
    
    console.log("Functional Status Mapper - Mapped Form Data:", formData);
    return { formData, hasData };
  } catch (error) {
    console.error("Functional Status Mapper - Error mapping context data:", error);
    return { formData: defaultValues, hasData: false };
  }
}

/**
 * Maps form data to context structure
 * @param formData Form data from React Hook Form
 * @returns Context-structured data
 */
export function mapFormToContext(formData: any) {
  try {
    // Convert form data to the structure expected by the context
    const contextData = {
      mobilityAssessment: {
        walkingAids: {
          usesMobilityAids: formData.mobilityAssessment.walkingAids.usesMobilityAids,
          aids: formData.mobilityAssessment.walkingAids.aids || [],
          other: formData.mobilityAssessment.walkingAids.other || ''
        },
        walkingCapacity: {
          indoorWalkingDistance: formData.mobilityAssessment.walkingCapacity.indoorWalkingDistance || '',
          outdoorWalkingDistance: formData.mobilityAssessment.walkingCapacity.outdoorWalkingDistance || '',
          stairsCapacity: formData.mobilityAssessment.walkingCapacity.stairsCapacity || '',
          terrainCapacity: formData.mobilityAssessment.walkingCapacity.terrainCapacity || ''
        },
        balance: {
          bergBalance: {
            total: parseFloat(formData.mobilityAssessment.balance.bergBalance.total) || 0,
            sitToStand: parseInt(formData.mobilityAssessment.balance.bergBalance.sitToStand) || 0,
            standingUnsupported: parseInt(formData.mobilityAssessment.balance.bergBalance.standingUnsupported) || 0,
            sittingUnsupported: parseInt(formData.mobilityAssessment.balance.bergBalance.sittingUnsupported) || 0,
            standToSit: parseInt(formData.mobilityAssessment.balance.bergBalance.standToSit) || 0,
            transfers: parseInt(formData.mobilityAssessment.balance.bergBalance.transfers) || 0,
            standingEyesClosed: parseInt(formData.mobilityAssessment.balance.bergBalance.standingEyesClosed) || 0,
            standingFeetTogether: parseInt(formData.mobilityAssessment.balance.bergBalance.standingFeetTogether) || 0,
            reachingForward: parseInt(formData.mobilityAssessment.balance.bergBalance.reachingForward) || 0,
            retrievingObject: parseInt(formData.mobilityAssessment.balance.bergBalance.retrievingObject) || 0,
            turningToLookBehind: parseInt(formData.mobilityAssessment.balance.bergBalance.turningToLookBehind) || 0,
            turning360: parseInt(formData.mobilityAssessment.balance.bergBalance.turning360) || 0,
            placingFootOnStool: parseInt(formData.mobilityAssessment.balance.bergBalance.placingFootOnStool) || 0,
            standingOnOneFoot: parseInt(formData.mobilityAssessment.balance.bergBalance.standingOnOneFoot) || 0
          },
          additionalNotes: formData.mobilityAssessment.balance.additionalNotes || ''
        }
      },
      upperExtremityFunction: {
        dominance: formData.upperExtremityFunction.dominance || 'right',
        rangeOfMotion: {
          left: {
            shoulder: {
              flexion: parseFloat(formData.upperExtremityFunction.rangeOfMotion.left.shoulder.flexion) || 0,
              abduction: parseFloat(formData.upperExtremityFunction.rangeOfMotion.left.shoulder.abduction) || 0,
              externalRotation: parseFloat(formData.upperExtremityFunction.rangeOfMotion.left.shoulder.externalRotation) || 0,
              internalRotation: parseFloat(formData.upperExtremityFunction.rangeOfMotion.left.shoulder.internalRotation) || 0
            },
            elbow: {
              flexion: parseFloat(formData.upperExtremityFunction.rangeOfMotion.left.elbow.flexion) || 0,
              extension: parseFloat(formData.upperExtremityFunction.rangeOfMotion.left.elbow.extension) || 0
            },
            wrist: {
              flexion: parseFloat(formData.upperExtremityFunction.rangeOfMotion.left.wrist.flexion) || 0,
              extension: parseFloat(formData.upperExtremityFunction.rangeOfMotion.left.wrist.extension) || 0
            },
            limitations: formData.upperExtremityFunction.rangeOfMotion.left.limitations || ''
          },
          right: {
            shoulder: {
              flexion: parseFloat(formData.upperExtremityFunction.rangeOfMotion.right.shoulder.flexion) || 0,
              abduction: parseFloat(formData.upperExtremityFunction.rangeOfMotion.right.shoulder.abduction) || 0,
              externalRotation: parseFloat(formData.upperExtremityFunction.rangeOfMotion.right.shoulder.externalRotation) || 0,
              internalRotation: parseFloat(formData.upperExtremityFunction.rangeOfMotion.right.shoulder.internalRotation) || 0
            },
            elbow: {
              flexion: parseFloat(formData.upperExtremityFunction.rangeOfMotion.right.elbow.flexion) || 0,
              extension: parseFloat(formData.upperExtremityFunction.rangeOfMotion.right.elbow.extension) || 0
            },
            wrist: {
              flexion: parseFloat(formData.upperExtremityFunction.rangeOfMotion.right.wrist.flexion) || 0,
              extension: parseFloat(formData.upperExtremityFunction.rangeOfMotion.right.wrist.extension) || 0
            },
            limitations: formData.upperExtremityFunction.rangeOfMotion.right.limitations || ''
          }
        },
        grip: {
          left: parseFloat(formData.upperExtremityFunction.grip.left) || 0,
          right: parseFloat(formData.upperExtremityFunction.grip.right) || 0,
          normative: formData.upperExtremityFunction.grip.normative || ''
        },
        pinch: {
          left: parseFloat(formData.upperExtremityFunction.pinch.left) || 0,
          right: parseFloat(formData.upperExtremityFunction.pinch.right) || 0,
          normative: formData.upperExtremityFunction.pinch.normative || ''
        },
        coordination: {
          grossCoordination: formData.upperExtremityFunction.coordination.grossCoordination || '',
          fineCoordination: formData.upperExtremityFunction.coordination.fineCoordination || ''
        },
        functionalNotes: formData.upperExtremityFunction.functionalNotes || ''
      },
      posture: {
        posturalTolerance: {
          sitting: formData.posture.posturalTolerance.sitting || '',
          standing: formData.posture.posturalTolerance.standing || '',
          sittingActivities: formData.posture.posturalTolerance.sittingActivities || '',
          standingActivities: formData.posture.posturalTolerance.standingActivities || ''
        },
        posturalAssessment: {
          notes: formData.posture.posturalAssessment.notes || '',
          headPosition: formData.posture.posturalAssessment.headPosition || '',
          shoulderPosition: formData.posture.posturalAssessment.shoulderPosition || '',
          spineCurvature: formData.posture.posturalAssessment.spineCurvature || '',
          pelvisPosition: formData.posture.posturalAssessment.pelvisPosition || '',
          kneePosition: formData.posture.posturalAssessment.kneePosition || '',
          footPosition: formData.posture.posturalAssessment.footPosition || ''
        }
      }
    };
    
    console.log("Functional Status Mapper - Mapped Context Data:", contextData);
    return contextData;
  } catch (error) {
    console.error("Functional Status Mapper - Error mapping to context:", error);
    return {};
  }
}

/**
 * Creates a JSON export of the functional status data
 * @param contextData The context data from AssessmentContext
 * @returns String representation of the JSON data
 */
export function exportToJson(contextData: any) {
  try {
    return JSON.stringify(contextData, null, 2);
  } catch (error) {
    console.error("Functional Status Mapper - Error exporting to JSON:", error);
    return '';
  }
}

/**
 * Imports functional status from JSON
 * @param jsonString JSON string representation of functional status data
 * @returns Parsed functional status data
 */
export function importFromJson(jsonString: string) {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("Functional Status Mapper - Error importing from JSON:", error);
    return null;
  }
}
