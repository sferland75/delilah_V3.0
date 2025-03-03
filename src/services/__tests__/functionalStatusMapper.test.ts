/**
 * Functional Status Mapper Service Tests
 * 
 * Tests for the bidirectional mapping functionality between
 * context data and form data structures for the Functional Status section.
 */

import { 
  mapContextToForm, 
  mapFormToContext,
  exportFunctionalStatusToJson,
  importFunctionalStatusFromJson
} from '../functionalStatusMapper';

// Mock console methods to avoid cluttering test output
global.console.log = jest.fn();
global.console.error = jest.fn();

describe('Functional Status Mapper Service', () => {
  // Define default mock data structures
  const mockInitialFormState = {
    data: {
      mobilityAssessment: {
        walkingStatus: '',
        assistiveDevices: [],
        transferStatus: '',
        balanceStatus: '',
        balanceTestScores: {
          bergBalance: {
            totalScore: 0,
            scores: Array(14).fill(0)
          },
          tinetti: {
            totalScore: 0,
            balanceScore: 0,
            gaitScore: 0
          }
        },
        stairStatus: '',
        fallHistory: '',
        distanceCapacity: '',
        notes: ''
      },
      upperExtremityFunction: {
        rightUE: {
          dominance: false,
          strength: '',
          rom: '',
          sensation: '',
          coordination: '',
          notes: ''
        },
        leftUE: {
          dominance: false,
          strength: '',
          rom: '',
          sensation: '',
          coordination: '',
          notes: ''
        }
      },
      posturalTolerances: {
        sitting: {
          tolerance: '',
          limitations: '',
          assistiveDevices: []
        },
        standing: {
          tolerance: '',
          limitations: '',
          assistiveDevices: []
        },
        lying: {
          tolerance: '',
          limitations: '',
          assistiveDevices: []
        }
      }
    }
  };

  const mockContextData = {
    functionalStatus: {
      mobility: {
        ambulation: {
          status: 'Modified Independent',
          assistiveDevices: ['Single Point Cane', 'Walker'],
          distanceCapacity: '500 meters',
          limitations: 'Slower pace, requires rest after 300 meters'
        },
        transfers: {
          bedMobility: 'Independent',
          sitToStand: 'Modified Independent',
          toiletTransfers: 'Modified Independent with grab bars',
          tubTransfers: 'Requires moderate assistance',
          carTransfers: 'Requires minimal assistance'
        },
        balance: {
          static: 'Fair',
          dynamic: 'Poor',
          bergBalance: {
            score: 35,
            interpretation: 'Medium fall risk',
            details: [3, 3, 2, 2, 3, 2, 1, 2, 2, 2, 3, 3, 4, 3] // Individual item scores
          },
          tinettiScore: {
            total: 19,
            balance: 10,
            gait: 9
          }
        },
        stairs: {
          status: 'Modified Independent',
          technique: 'Step-to pattern with railing',
          limitations: 'Limited to 1 flight maximum'
        },
        fallHistory: {
          recent: 'Two falls in past 6 months',
          circumstances: 'Both occurred when turning quickly, one in bathroom',
          injuries: 'Minor bruising from first fall'
        }
      },
      upperExtremity: {
        rightArm: {
          dominance: true,
          strength: 'Good (4/5)',
          rangeOfMotion: 'WFL except for shoulder flexion limited to 160 degrees',
          sensation: 'Intact',
          coordination: 'Within normal limits',
          grip: '35 kg'
        },
        leftArm: {
          dominance: false,
          strength: 'Good (4/5)',
          rangeOfMotion: 'Within functional limits',
          sensation: 'Intact',
          coordination: 'Within normal limits',
          grip: '32 kg'
        }
      },
      posturalTolerances: {
        sitting: {
          duration: 'Up to 45 minutes',
          limitations: 'Requires lumbar support and frequent position changes',
          equipment: ['Ergonomic chair', 'Lumbar cushion']
        },
        standing: {
          duration: 'Up to 20 minutes',
          limitations: 'Increased pain with prolonged standing',
          equipment: ['Compression stockings']
        },
        lying: {
          duration: 'Up to 6 hours',
          limitations: 'Requires position changes every 2 hours',
          equipment: ['Adjustable bed', 'Body pillow']
        }
      }
    }
  };

  // Test mapping from context to form
  describe('mapContextToForm', () => {
    it('should correctly map context data to form structure', () => {
      const { formData, hasData } = mapContextToForm(mockContextData, mockInitialFormState);
      
      // Check hasData flag
      expect(hasData).toBe(true);
      
      // Check mobility mapping
      expect(formData.data.mobilityAssessment.walkingStatus).toBe('Modified Independent');
      expect(formData.data.mobilityAssessment.assistiveDevices).toContain('Single Point Cane');
      expect(formData.data.mobilityAssessment.assistiveDevices).toContain('Walker');
      expect(formData.data.mobilityAssessment.distanceCapacity).toBe('500 meters');
      
      // Check transfer status mapping
      expect(formData.data.mobilityAssessment.transferStatus).toContain('bedMobility: Independent');
      expect(formData.data.mobilityAssessment.transferStatus).toContain('sitToStand: Modified Independent');
      
      // Check Berg Balance Score mapping
      expect(formData.data.mobilityAssessment.balanceTestScores.bergBalance.totalScore).toBe(35);
      expect(formData.data.mobilityAssessment.balanceTestScores.bergBalance.scores).toEqual(
        [3, 3, 2, 2, 3, 2, 1, 2, 2, 2, 3, 3, 4, 3]
      );
      
      // Check Tinetti score mapping
      expect(formData.data.mobilityAssessment.balanceTestScores.tinetti.totalScore).toBe(19);
      expect(formData.data.mobilityAssessment.balanceTestScores.tinetti.balanceScore).toBe(10);
      expect(formData.data.mobilityAssessment.balanceTestScores.tinetti.gaitScore).toBe(9);
      
      // Check stair status mapping
      expect(formData.data.mobilityAssessment.stairStatus).toBe('Modified Independent');
      
      // Check fall history mapping
      expect(formData.data.mobilityAssessment.fallHistory).toContain('Two falls in past 6 months');
      
      // Check upper extremity mapping
      expect(formData.data.upperExtremityFunction.rightUE.dominance).toBe(true);
      expect(formData.data.upperExtremityFunction.rightUE.strength).toBe('Good (4/5)');
      expect(formData.data.upperExtremityFunction.rightUE.rom).toBe('WFL except for shoulder flexion limited to 160 degrees');
      
      expect(formData.data.upperExtremityFunction.leftUE.dominance).toBe(false);
      expect(formData.data.upperExtremityFunction.leftUE.strength).toBe('Good (4/5)');
      
      // Check postural tolerances mapping
      expect(formData.data.posturalTolerances.sitting.tolerance).toBe('Up to 45 minutes');
      expect(formData.data.posturalTolerances.sitting.limitations).toBe('Requires lumbar support and frequent position changes');
      expect(formData.data.posturalTolerances.sitting.assistiveDevices).toContain('Ergonomic chair');
      expect(formData.data.posturalTolerances.sitting.assistiveDevices).toContain('Lumbar cushion');
      
      expect(formData.data.posturalTolerances.standing.tolerance).toBe('Up to 20 minutes');
      expect(formData.data.posturalTolerances.lying.assistiveDevices).toContain('Adjustable bed');
    });
    
    it('should return empty form data when context data is empty', () => {
      const { formData, hasData } = mapContextToForm({}, mockInitialFormState);
      
      expect(hasData).toBe(false);
      expect(formData).toEqual(mockInitialFormState);
    });
    
    it('should handle missing sections gracefully', () => {
      const partialContextData = {
        functionalStatus: {
          mobility: {
            ambulation: {
              status: 'Independent',
              assistiveDevices: []
            }
          }
          // Missing other sections
        }
      };
      
      const { formData, hasData } = mapContextToForm(partialContextData, mockInitialFormState);
      
      expect(hasData).toBe(true);
      expect(formData.data.mobilityAssessment.walkingStatus).toBe('Independent');
      
      // Other sections should be initialized with defaults
      expect(formData.data.upperExtremityFunction).toBeDefined();
      expect(formData.data.posturalTolerances).toBeDefined();
    });
    
    it('should handle malformed data without crashing', () => {
      const malformedData = {
        functionalStatus: {
          mobility: {
            ambulation: "Not an object" // Incorrect type
          }
        }
      };
      
      // Should not throw an error
      const { formData, hasData } = mapContextToForm(malformedData, mockInitialFormState);
      
      expect(hasData).toBe(false);
      expect(formData).toEqual(mockInitialFormState);
      expect(console.error).toHaveBeenCalled();
    });
  });
  
  // Test mapping from form to context
  describe('mapFormToContext', () => {
    it('should correctly map form data to context structure', () => {
      const formData = {
        data: {
          mobilityAssessment: {
            walkingStatus: 'Independent with walker',
            assistiveDevices: ['Walker', 'AFO'],
            transferStatus: 'Independent for bed mobility, Modified Independent for toilet transfers',
            balanceStatus: 'Fair static, Poor dynamic',
            balanceTestScores: {
              bergBalance: {
                totalScore: 40,
                scores: [3, 3, 3, 3, 3, 3, 3, 3, 2, 3, 3, 3, 2, 3] // Individual item scores
              },
              tinetti: {
                totalScore: 22,
                balanceScore: 12,
                gaitScore: 10
              }
            },
            stairStatus: 'Requires standby assistance',
            fallHistory: 'One fall in past year, no injuries',
            distanceCapacity: '100 meters with walker',
            notes: 'Patient's ambulation improves with regular exercise'
          },
          upperExtremityFunction: {
            rightUE: {
              dominance: true,
              strength: 'Good (4/5) throughout',
              rom: 'Within functional limits',
              sensation: 'Intact to light touch',
              coordination: 'No deficits',
              notes: 'Occasional pain with overhead reaching'
            },
            leftUE: {
              dominance: false,
              strength: 'Good (4/5) throughout',
              rom: 'Wrist extension limited to -10 degrees',
              sensation: 'Intact to light touch',
              coordination: 'Mild difficulty with fine motor tasks',
              notes: 'Previous wrist fracture'
            }
          },
          posturalTolerances: {
            sitting: {
              tolerance: '1 hour maximum',
              limitations: 'Needs to stand and stretch after 30 minutes',
              assistiveDevices: ['Lumbar support cushion']
            },
            standing: {
              tolerance: '15 minutes maximum',
              limitations: 'Pain increases after 10 minutes',
              assistiveDevices: ['Compression stockings', 'Supportive shoes']
            },
            lying: {
              tolerance: '4 hours maximum',
              limitations: 'Needs to change positions frequently',
              assistiveDevices: ['Cervical pillow', 'Adjustable bed']
            }
          }
        }
      };
      
      const contextData = mapFormToContext(formData);
      
      // Check mobility mapping
      expect(contextData.functionalStatus.mobility.ambulation.status).toBe('Independent with walker');
      expect(contextData.functionalStatus.mobility.ambulation.assistiveDevices).toContain('Walker');
      expect(contextData.functionalStatus.mobility.ambulation.assistiveDevices).toContain('AFO');
      expect(contextData.functionalStatus.mobility.ambulation.distanceCapacity).toBe('100 meters with walker');
      
      // Check transfers mapping
      expect(contextData.functionalStatus.mobility.transfers.bedMobility).toBe('Independent');
      expect(contextData.functionalStatus.mobility.transfers.toiletTransfers).toBe('Modified Independent');
      
      // Check balance mapping
      expect(contextData.functionalStatus.mobility.balance.static).toBe('Fair');
      expect(contextData.functionalStatus.mobility.balance.dynamic).toBe('Poor');
      expect(contextData.functionalStatus.mobility.balance.bergBalance.score).toBe(40);
      expect(contextData.functionalStatus.mobility.balance.bergBalance.details).toEqual(
        [3, 3, 3, 3, 3, 3, 3, 3, 2, 3, 3, 3, 2, 3]
      );
      
      // Check Tinetti mapping
      expect(contextData.functionalStatus.mobility.balance.tinettiScore.total).toBe(22);
      expect(contextData.functionalStatus.mobility.balance.tinettiScore.balance).toBe(12);
      expect(contextData.functionalStatus.mobility.balance.tinettiScore.gait).toBe(10);
      
      // Check stairs mapping
      expect(contextData.functionalStatus.mobility.stairs.status).toBe('Requires standby assistance');
      
      // Check fall history mapping
      expect(contextData.functionalStatus.mobility.fallHistory.recent).toBe('One fall in past year, no injuries');
      
      // Check upper extremity mapping
      expect(contextData.functionalStatus.upperExtremity.rightArm.dominance).toBe(true);
      expect(contextData.functionalStatus.upperExtremity.rightArm.strength).toBe('Good (4/5) throughout');
      expect(contextData.functionalStatus.upperExtremity.rightArm.rangeOfMotion).toBe('Within functional limits');
      
      expect(contextData.functionalStatus.upperExtremity.leftArm.dominance).toBe(false);
      expect(contextData.functionalStatus.upperExtremity.leftArm.rangeOfMotion).toBe('Wrist extension limited to -10 degrees');
      
      // Check postural tolerances mapping
      expect(contextData.functionalStatus.posturalTolerances.sitting.duration).toBe('1 hour maximum');
      expect(contextData.functionalStatus.posturalTolerances.sitting.limitations).toBe('Needs to stand and stretch after 30 minutes');
      expect(contextData.functionalStatus.posturalTolerances.sitting.equipment).toContain('Lumbar support cushion');
      
      expect(contextData.functionalStatus.posturalTolerances.standing.duration).toBe('15 minutes maximum');
      expect(contextData.functionalStatus.posturalTolerances.standing.equipment).toContain('Compression stockings');
      expect(contextData.functionalStatus.posturalTolerances.standing.equipment).toContain('Supportive shoes');
    });
    
    it('should preserve existing context data not covered by the form', () => {
      const existingContextData = {
        functionalStatus: {
          additionalNotes: 'Patient motivated to improve',
          previousLevel: 'Fully independent'
        },
        customField: 'This should be preserved'
      };
      
      const formData = {
        data: {
          mobilityAssessment: {
            walkingStatus: 'Modified Independent',
            assistiveDevices: [],
            transferStatus: '',
            balanceStatus: '',
            balanceTestScores: {
              bergBalance: {
                totalScore: 0,
                scores: Array(14).fill(0)
              },
              tinetti: {
                totalScore: 0,
                balanceScore: 0,
                gaitScore: 0
              }
            },
            stairStatus: '',
            fallHistory: '',
            distanceCapacity: '',
            notes: ''
          },
          upperExtremityFunction: {
            rightUE: {
              dominance: false,
              strength: '',
              rom: '',
              sensation: '',
              coordination: '',
              notes: ''
            },
            leftUE: {
              dominance: false,
              strength: '',
              rom: '',
              sensation: '',
              coordination: '',
              notes: ''
            }
          },
          posturalTolerances: {
            sitting: {
              tolerance: '',
              limitations: '',
              assistiveDevices: []
            },
            standing: {
              tolerance: '',
              limitations: '',
              assistiveDevices: []
            },
            lying: {
              tolerance: '',
              limitations: '',
              assistiveDevices: []
            }
          }
        }
      };
      
      const contextData = mapFormToContext(formData, existingContextData);
      
      // Check that existing data is preserved
      expect(contextData.functionalStatus.additionalNotes).toBe('Patient motivated to improve');
      expect(contextData.functionalStatus.previousLevel).toBe('Fully independent');
      expect(contextData.customField).toBe('This should be preserved');
      
      // Check that new data is added
      expect(contextData.functionalStatus.mobility.ambulation.status).toBe('Modified Independent');
    });
    
    it('should handle empty form data gracefully', () => {
      const emptyFormData = {
        data: {
          mobilityAssessment: {
            walkingStatus: '',
            assistiveDevices: [],
            transferStatus: '',
            balanceStatus: '',
            balanceTestScores: {
              bergBalance: {
                totalScore: 0,
                scores: Array(14).fill(0)
              },
              tinetti: {
                totalScore: 0,
                balanceScore: 0,
                gaitScore: 0
              }
            },
            stairStatus: '',
            fallHistory: '',
            distanceCapacity: '',
            notes: ''
          },
          upperExtremityFunction: {
            rightUE: {
              dominance: false,
              strength: '',
              rom: '',
              sensation: '',
              coordination: '',
              notes: ''
            },
            leftUE: {
              dominance: false,
              strength: '',
              rom: '',
              sensation: '',
              coordination: '',
              notes: ''
            }
          },
          posturalTolerances: {
            sitting: {
              tolerance: '',
              limitations: '',
              assistiveDevices: []
            },
            standing: {
              tolerance: '',
              limitations: '',
              assistiveDevices: []
            },
            lying: {
              tolerance: '',
              limitations: '',
              assistiveDevices: []
            }
          }
        }
      };
      
      const existingContextData = { someField: 'value' };
      const contextData = mapFormToContext(emptyFormData, existingContextData);
      
      // Should still return a properly structured object
      expect(contextData.functionalStatus).toBeDefined();
      expect(contextData.functionalStatus.mobility).toBeDefined();
      expect(contextData.someField).toBe('value');
    });
    
    it('should handle malformed form data without crashing', () => {
      const malformedFormData = {
        data: {
          // Missing required fields
        }
      };
      
      // Should not throw an error
      const contextData = mapFormToContext(malformedFormData);
      
      // Should return a minimal valid object
      expect(contextData.functionalStatus).toBeDefined();
      expect(contextData.functionalStatus.mobility).toBeDefined();
      expect(contextData.functionalStatus.upperExtremity).toBeDefined();
      expect(contextData.functionalStatus.posturalTolerances).toBeDefined();
      expect(console.error).toHaveBeenCalled();
    });
  });
  
  // Test JSON import/export functionality
  describe('JSON import/export', () => {
    it('should properly export context data to JSON', () => {
      const jsonString = exportFunctionalStatusToJson(mockContextData);
      
      // Should be a valid JSON string
      expect(() => JSON.parse(jsonString)).not.toThrow();
      
      // Should contain the original data
      const parsedData = JSON.parse(jsonString);
      expect(parsedData.functionalStatus.mobility.ambulation.status).toBe('Modified Independent');
      expect(parsedData.functionalStatus.upperExtremity.rightArm.dominance).toBe(true);
    });
    
    it('should properly import JSON to context data', () => {
      const jsonString = JSON.stringify(mockContextData);
      const importedData = importFunctionalStatusFromJson(jsonString);
      
      // Should match the original data
      expect(importedData).toEqual(mockContextData);
    });
    
    it('should handle invalid JSON during import', () => {
      const invalidJsonString = '{ this is not valid JSON }';
      
      // Should return null for invalid JSON
      const importedData = importFunctionalStatusFromJson(invalidJsonString);
      expect(importedData).toBeNull();
      expect(console.error).toHaveBeenCalled();
    });
  });
  
  // Test bidirectional mapping consistency
  describe('Bidirectional mapping', () => {
    it('should maintain data integrity through bidirectional mapping', () => {
      // Start with context data
      const { formData, hasData } = mapContextToForm(mockContextData, mockInitialFormState);
      
      // Map back to context format
      const mappedContextData = mapFormToContext(formData);
      
      // Check key fields for data integrity
      expect(mappedContextData.functionalStatus.mobility.ambulation.status).toBe(
        mockContextData.functionalStatus.mobility.ambulation.status
      );
      
      expect(mappedContextData.functionalStatus.mobility.ambulation.assistiveDevices).toEqual(
        mockContextData.functionalStatus.mobility.ambulation.assistiveDevices
      );
      
      expect(mappedContextData.functionalStatus.mobility.balance.bergBalance.score).toBe(
        mockContextData.functionalStatus.mobility.balance.bergBalance.score
      );
      
      expect(mappedContextData.functionalStatus.upperExtremity.rightArm.dominance).toBe(
        mockContextData.functionalStatus.upperExtremity.rightArm.dominance
      );
      
      expect(mappedContextData.functionalStatus.posturalTolerances.sitting.duration).toBe(
        mockContextData.functionalStatus.posturalTolerances.sitting.duration
      );
    });
  });
});
