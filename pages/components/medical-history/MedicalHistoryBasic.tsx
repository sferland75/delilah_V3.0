import React from 'react';

export const MedicalHistoryBasic = () => {
  console.log('MedicalHistoryBasic component rendering');
  
  return (
    <div className="p-6 space-y-4 bg-white">
      <h2 className="text-2xl font-semibold">Medical History Basic</h2>
      <p>This is a minimal version of the Medical History component with no dependencies.</p>
      
      <div className="bg-blue-100 p-4 rounded border border-blue-300">
        <h3 className="font-medium text-blue-800">Pre-Existing Conditions</h3>
        <p className="text-blue-700">Example: Type 2 Diabetes, diagnosed 2020</p>
      </div>
      
      <div className="bg-green-100 p-4 rounded border border-green-300">
        <h3 className="font-medium text-green-800">Injury Details</h3>
        <p className="text-green-700">Example: Motor Vehicle Accident, January 2023</p>
      </div>
      
      <div className="bg-purple-100 p-4 rounded border border-purple-300">
        <h3 className="font-medium text-purple-800">Current Treatments</h3>
        <p className="text-purple-700">Example: Physical Therapy, twice weekly</p>
      </div>
      
      <div className="bg-yellow-100 p-4 rounded border border-yellow-300">
        <h3 className="font-medium text-yellow-800">Current Medications</h3>
        <p className="text-yellow-700">Example: Metformin 500mg, twice daily</p>
      </div>
      
      <div className="flex justify-end mt-6">
        <button 
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={() => console.log('Save button clicked')}
        >
          Save Medical History
        </button>
      </div>
    </div>
  );
};

export default MedicalHistoryBasic;