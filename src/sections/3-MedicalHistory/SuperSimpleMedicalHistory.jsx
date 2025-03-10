import React, { useState } from 'react';
import { PlusCircle, MinusCircle, InfoIcon } from 'lucide-react';

/**
 * Super Simple Medical History Component
 * This component uses only essential dependencies and inline styling
 * to ensure it works correctly in the Pages Router context.
 */
function SuperSimpleMedicalHistory() {
  console.log("SuperSimple Medical History Component Rendering");
  
  // Basic state for managing form data
  const [activeTab, setActiveTab] = useState('preExisting');
  const [preExistingConditions, setPreExistingConditions] = useState([
    { 
      condition: 'Type 2 Diabetes', 
      status: 'active', 
      diagnosisDate: '2020-05-15', 
      details: 'Managed with oral medication' 
    }
  ]);
  
  // Debug panel to show component is rendering
  const DebugPanel = () => (
    <div style={{
      backgroundColor: '#ffcccb',
      padding: '10px',
      margin: '10px 0',
      border: '2px solid red',
      borderRadius: '4px'
    }}>
      <h3 style={{color: 'red', fontWeight: 'bold'}}>Super Simple Medical History is rendering</h3>
      <p>This simplified component uses minimal dependencies and inline styles.</p>
      <p>Current tab: {activeTab}</p>
      <p>Number of pre-existing conditions: {preExistingConditions.length}</p>
    </div>
  );
  
  // Tab navigation
  const TabNavigation = () => (
    <div style={{
      display: 'flex',
      borderBottom: '1px solid #ccc',
      marginBottom: '20px'
    }}>
      <button
        onClick={() => setActiveTab('preExisting')}
        style={{
          padding: '10px 20px',
          border: 'none',
          background: 'none',
          borderBottom: activeTab === 'preExisting' ? '2px solid blue' : 'none',
          color: activeTab === 'preExisting' ? 'blue' : 'grey',
          fontWeight: activeTab === 'preExisting' ? 'bold' : 'normal',
          cursor: 'pointer'
        }}
      >
        Pre-Existing Conditions
      </button>
      <button
        onClick={() => setActiveTab('injury')}
        style={{
          padding: '10px 20px',
          border: 'none',
          background: 'none',
          borderBottom: activeTab === 'injury' ? '2px solid blue' : 'none',
          color: activeTab === 'injury' ? 'blue' : 'grey',
          fontWeight: activeTab === 'injury' ? 'bold' : 'normal',
          cursor: 'pointer'
        }}
      >
        Injury Details
      </button>
      <button
        onClick={() => setActiveTab('medications')}
        style={{
          padding: '10px 20px',
          border: 'none',
          background: 'none',
          borderBottom: activeTab === 'medications' ? '2px solid blue' : 'none',
          color: activeTab === 'medications' ? 'blue' : 'grey',
          fontWeight: activeTab === 'medications' ? 'bold' : 'normal',
          cursor: 'pointer'
        }}
      >
        Medications
      </button>
    </div>
  );
  
  // Add a pre-existing condition
  const addCondition = () => {
    setPreExistingConditions([
      ...preExistingConditions,
      { condition: '', status: 'active', diagnosisDate: '', details: '' }
    ]);
  };
  
  // Remove a pre-existing condition
  const removeCondition = (index) => {
    const updated = [...preExistingConditions];
    updated.splice(index, 1);
    setPreExistingConditions(updated);
  };
  
  // Update a pre-existing condition
  const updateCondition = (index, field, value) => {
    const updated = [...preExistingConditions];
    updated[index] = {
      ...updated[index],
      [field]: value
    };
    setPreExistingConditions(updated);
  };
  
  // Pre-existing conditions tab content
  const PreExistingConditionsContent = () => (
    <div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <h3 style={{fontSize: '18px', fontWeight: 'bold'}}>Pre-Existing Conditions</h3>
        <button
          onClick={addCondition}
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '8px 12px',
            backgroundColor: 'white',
            border: '1px solid #ccc',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          <PlusCircle size={16} style={{marginRight: '5px'}} />
          Add Condition
        </button>
      </div>
      
      {preExistingConditions.map((condition, index) => (
        <div key={index} style={{
          border: '1px solid #ccc',
          borderRadius: '4px',
          padding: '15px',
          marginBottom: '15px',
          position: 'relative'
        }}>
          <button
            onClick={() => removeCondition(index)}
            style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#666'
            }}
          >
            <MinusCircle size={16} />
          </button>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '15px',
            marginBottom: '15px'
          }}>
            <div>
              <label style={{display: 'block', marginBottom: '5px', fontWeight: 'bold'}}>
                Condition *
              </label>
              <input
                type="text"
                value={condition.condition}
                onChange={(e) => updateCondition(index, 'condition', e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ccc',
                  borderRadius: '4px'
                }}
                placeholder="Enter condition name"
              />
            </div>
            
            <div>
              <label style={{display: 'block', marginBottom: '5px', fontWeight: 'bold'}}>
                Status
              </label>
              <select
                value={condition.status}
                onChange={(e) => updateCondition(index, 'status', e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ccc',
                  borderRadius: '4px'
                }}
              >
                <option value="active">Active</option>
                <option value="managed">Managed</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>
            
            <div>
              <label style={{display: 'block', marginBottom: '5px', fontWeight: 'bold'}}>
                Diagnosis Date
              </label>
              <input
                type="date"
                value={condition.diagnosisDate}
                onChange={(e) => updateCondition(index, 'diagnosisDate', e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ccc',
                  borderRadius: '4px'
                }}
              />
            </div>
          </div>
          
          <div>
            <label style={{display: 'block', marginBottom: '5px', fontWeight: 'bold'}}>
              Details
            </label>
            <textarea
              value={condition.details}
              onChange={(e) => updateCondition(index, 'details', e.target.value)}
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                minHeight: '80px'
              }}
              placeholder="Add additional details about this condition"
            />
          </div>
        </div>
      ))}
    </div>
  );
  
  // Injury details tab content (simplified)
  const InjuryDetailsContent = () => (
    <div>
      <h3 style={{fontSize: '18px', fontWeight: 'bold', marginBottom: '20px'}}>Injury Details</h3>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '15px',
        marginBottom: '20px'
      }}>
        <div>
          <label style={{display: 'block', marginBottom: '5px', fontWeight: 'bold'}}>
            Date of Injury *
          </label>
          <input
            type="date"
            defaultValue="2023-01-10"
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '4px'
            }}
          />
        </div>
        
        <div>
          <label style={{display: 'block', marginBottom: '5px', fontWeight: 'bold'}}>
            Time of Injury
          </label>
          <input
            type="time"
            defaultValue="08:30"
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '4px'
            }}
          />
        </div>
      </div>
      
      <div style={{marginBottom: '15px'}}>
        <label style={{display: 'block', marginBottom: '5px', fontWeight: 'bold'}}>
          Mechanism of Injury *
        </label>
        <input
          type="text"
          defaultValue="Motor Vehicle Accident"
          style={{
            width: '100%',
            padding: '8px',
            border: '1px solid #ccc',
            borderRadius: '4px'
          }}
          placeholder="Describe how the injury occurred"
        />
      </div>
      
      <div style={{marginBottom: '15px'}}>
        <label style={{display: 'block', marginBottom: '5px', fontWeight: 'bold'}}>
          Circumstances
        </label>
        <textarea
          defaultValue="Rear-ended at a stop light"
          style={{
            width: '100%',
            padding: '8px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            minHeight: '80px'
          }}
          placeholder="Provide additional details about how the injury occurred"
        />
      </div>
    </div>
  );
  
  // Medications tab content (simplified)
  const MedicationsContent = () => (
    <div>
      <h3 style={{fontSize: '18px', fontWeight: 'bold', marginBottom: '20px'}}>Current Medications</h3>
      
      <div style={{
        border: '1px solid #ccc',
        borderRadius: '4px',
        padding: '15px',
        marginBottom: '15px'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '15px',
          marginBottom: '15px'
        }}>
          <div>
            <label style={{display: 'block', marginBottom: '5px', fontWeight: 'bold'}}>
              Medication Name *
            </label>
            <input
              type="text"
              defaultValue="Metformin"
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ccc',
                borderRadius: '4px'
              }}
              placeholder="Enter medication name"
            />
          </div>
          
          <div>
            <label style={{display: 'block', marginBottom: '5px', fontWeight: 'bold'}}>
              Dosage
            </label>
            <input
              type="text"
              defaultValue="500mg"
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ccc',
                borderRadius: '4px'
              }}
              placeholder="E.g., 10mg, 500mg"
            />
          </div>
          
          <div>
            <label style={{display: 'block', marginBottom: '5px', fontWeight: 'bold'}}>
              Frequency
            </label>
            <input
              type="text"
              defaultValue="Twice daily"
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ccc',
                borderRadius: '4px'
              }}
              placeholder="E.g., Once daily, Twice daily"
            />
          </div>
          
          <div>
            <label style={{display: 'block', marginBottom: '5px', fontWeight: 'bold'}}>
              Prescribed For
            </label>
            <input
              type="text"
              defaultValue="Diabetes"
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ccc',
                borderRadius: '4px'
              }}
              placeholder="E.g., Diabetes, Pain management"
            />
          </div>
        </div>
      </div>
      
      <button
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '8px 12px',
          backgroundColor: 'white',
          border: '1px solid #ccc',
          borderRadius: '4px',
          cursor: 'pointer',
          marginBottom: '20px'
        }}
      >
        <PlusCircle size={16} style={{marginRight: '5px'}} />
        Add Medication
      </button>
    </div>
  );
  
  // Form submission handler
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted with data:', {
      preExistingConditions
    });
    alert('Medical History saved successfully!');
  };
  
  return (
    <div style={{padding: '20px'}}>
      {/* Debug panel to show component is rendering */}
      <DebugPanel />
      
      <div style={{marginBottom: '20px'}}>
        <h2 style={{fontSize: '24px', fontWeight: 'bold', marginBottom: '5px'}}>Medical History</h2>
        <p style={{color: '#666'}}>Pre-existing conditions, injury details, and current treatments</p>
      </div>
      
      <form onSubmit={handleSubmit} style={{width: '100%'}}>
        <div style={{
          border: '1px solid #ccc',
          borderRadius: '4px',
          overflow: 'hidden',
          marginBottom: '20px'
        }}>
          <TabNavigation />
          
          <div style={{padding: '20px'}}>
            {activeTab === 'preExisting' && <PreExistingConditionsContent />}
            {activeTab === 'injury' && <InjuryDetailsContent />}
            {activeTab === 'medications' && <MedicationsContent />}
          </div>
        </div>
        
        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '10px'
        }}>
          <button
            type="button"
            style={{
              padding: '10px 15px',
              backgroundColor: 'white',
              border: '1px solid #ccc',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Reset
          </button>
          
          <button
            type="submit"
            style={{
              padding: '10px 15px',
              backgroundColor: '#1E40AF',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Save Medical History
          </button>
        </div>
      </form>
    </div>
  );
}

export default SuperSimpleMedicalHistory;