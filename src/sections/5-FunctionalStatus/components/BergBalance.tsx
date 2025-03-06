'use client';

import React, { useState, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export function BergBalance() {
  const form = useFormContext();
  
  if (!form) {
    return (
      <div className="p-4 border rounded-md bg-red-50 text-red-500">
        Form context is missing. Please ensure this component is used within a FormProvider.
      </div>
    );
  }
  
  const { getValues } = form;
  
  // Create a local state to manage the component data
  const [localData, setLocalData] = useState({});
  
  // Initialize from form values
  useEffect(() => {
    // Get the current form values
    const formValues = getValues();
    if (formValues?.data?.bergBalance) {
      setLocalData(formValues.data.bergBalance);
    }
  }, [getValues]);
  
  // Function to safely update form data without direct mutation
  const updateFormData = (path, value) => {
    try {
      // Create a new form values object by cloning the current values
      const currentValues = getValues();
      const newValues = JSON.parse(JSON.stringify(currentValues));
      
      // Ensure data object exists
      if (!newValues.data) {
        newValues.data = {};
      }
      
      // Ensure bergBalance object exists
      if (!newValues.data.bergBalance) {
        newValues.data.bergBalance = {};
      }
      
      // Parse the path and update the value
      const pathParts = path.split('.');
      let current = newValues;
      
      // Navigate to the parent object
      for (let i = 0; i < pathParts.length - 1; i++) {
        const part = pathParts[i];
        if (!current[part]) {
          current[part] = {};
        }
        current = current[part];
      }
      
      // Set the value on the last part
      current[pathParts[pathParts.length - 1]] = value;
      
      // Update the form with the modified values
      form.reset(newValues);
      
      // Also update our local state
      setLocalData(newValues.data.bergBalance);
    } catch (error) {
      console.error(`Error updating form data at path ${path}:`, error);
    }
  };
  
  const bergItems = [
    {
      id: 'sittingToStanding',
      title: '1. Sitting to Standing',
      instructions: 'Please stand up. Try not to use your hands for support.',
      scores: [
        { value: '0', label: '0 - Needs moderate or maximal assist to stand' },
        { value: '1', label: '1 - Needs minimal aid to stand or stabilize' },
        { value: '2', label: '2 - Able to stand using hands after several tries' },
        { value: '3', label: '3 - Able to stand independently using hands' },
        { value: '4', label: '4 - Able to stand without using hands and stabilize independently' }
      ]
    },
    {
      id: 'standingUnsupported',
      title: '2. Standing Unsupported',
      instructions: 'Please stand for two minutes without holding on.',
      scores: [
        { value: '0', label: '0 - Unable to stand 30 seconds unassisted' },
        { value: '1', label: '1 - Needs several tries to stand 30 seconds unsupported' },
        { value: '2', label: '2 - Able to stand 30 seconds unsupported' },
        { value: '3', label: '3 - Able to stand 2 minutes with supervision' },
        { value: '4', label: '4 - Able to stand safely for 2 minutes' }
      ]
    },
    {
      id: 'sittingUnsupported',
      title: '3. Sitting Unsupported',
      instructions: 'Sit with arms folded for 2 minutes.',
      scores: [
        { value: '0', label: '0 - Unable to sit without support for 10 seconds' },
        { value: '1', label: '1 - Able to sit for 10 seconds' },
        { value: '2', label: '2 - Able to sit for 30 seconds' },
        { value: '3', label: '3 - Able to sit for 2 minutes with supervision' },
        { value: '4', label: '4 - Able to sit safely and securely for 2 minutes' }
      ]
    },
    {
      id: 'standingToSitting',
      title: '4. Standing to Sitting',
      instructions: 'Please sit down.',
      scores: [
        { value: '0', label: '0 - Needs assistance to sit' },
        { value: '1', label: '1 - Sits independently but has uncontrolled descent' },
        { value: '2', label: '2 - Uses back of legs against chair to control descent' },
        { value: '3', label: '3 - Controls descent by using hands' },
        { value: '4', label: '4 - Sits safely with minimal use of hands' }
      ]
    },
    {
      id: 'transfers',
      title: '5. Transfers',
      instructions: 'Arrange chair(s) for pivot transfer. Ask subject to transfer one way toward a seat with armrests and one way toward a seat without armrests.',
      scores: [
        { value: '0', label: '0 - Needs two people to assist or supervise to be safe' },
        { value: '1', label: '1 - Needs one person to assist' },
        { value: '2', label: '2 - Able to transfer with verbal cueing and/or supervision' },
        { value: '3', label: '3 - Able to transfer safely with definite use of hands' },
        { value: '4', label: '4 - Able to transfer safely with minor use of hands' }
      ]
    },
    {
      id: 'standingWithEyesClosed',
      title: '6. Standing with Eyes Closed',
      instructions: 'Close your eyes and stand still for 10 seconds.',
      scores: [
        { value: '0', label: '0 - Needs help to keep from falling' },
        { value: '1', label: '1 - Unable to keep eyes closed 3 seconds but stays steady' },
        { value: '2', label: '2 - Able to stand 3 seconds' },
        { value: '3', label: '3 - Able to stand 10 seconds with supervision' },
        { value: '4', label: '4 - Able to stand 10 seconds safely' }
      ]
    },
    {
      id: 'standingWithFeetTogether',
      title: '7. Standing with Feet Together',
      instructions: 'Place your feet together and stand without holding on.',
      scores: [
        { value: '0', label: '0 - Needs help to attain position and unable to hold for 15 seconds' },
        { value: '1', label: '1 - Needs help to attain position but able to stand 15 seconds with feet together' },
        { value: '2', label: '2 - Able to place feet together independently but unable to hold for 30 seconds' },
        { value: '3', label: '3 - Able to place feet together independently and stand for 1 minute with supervision' },
        { value: '4', label: '4 - Able to place feet together independently and stand 1 minute safely' }
      ]
    },
    {
      id: 'reachingForwardWithOutstretchedArm',
      title: '8. Reaching Forward with Outstretched Arm',
      instructions: 'Lift arm to 90 degrees. Stretch out your fingers and reach forward as far as you can.',
      scores: [
        { value: '0', label: '0 - Needs help to keep from falling' },
        { value: '1', label: '1 - Reaches forward but needs supervision' },
        { value: '2', label: '2 - Can reach forward >5 cm safely (2 inches)' },
        { value: '3', label: '3 - Can reach forward >12.5 cm safely (5 inches)' },
        { value: '4', label: '4 - Can reach forward confidently >25 cm (10 inches)' }
      ]
    },
    {
      id: 'pickingUpObject',
      title: '9. Picking Up Object from Floor',
      instructions: 'Pick up the shoe/slipper placed in front of your feet.',
      scores: [
        { value: '0', label: '0 - Unable to try/needs assist to keep from falling' },
        { value: '1', label: '1 - Unable to pick up and needs supervision while trying' },
        { value: '2', label: '2 - Unable to pick up but reaches 2-5 cm from slipper and keeps balance' },
        { value: '3', label: '3 - Able to pick up slipper but needs supervision' },
        { value: '4', label: '4 - Able to pick up slipper safely and easily' }
      ]
    },
    {
      id: 'turningToLookBehind',
      title: '10. Turning to Look Behind',
      instructions: 'Turn to look behind you over your left shoulder. Repeat to the right.',
      scores: [
        { value: '0', label: '0 - Needs assist to keep from falling' },
        { value: '1', label: '1 - Needs supervision when turning' },
        { value: '2', label: '2 - Turns sideways only but maintains balance' },
        { value: '3', label: '3 - Looks behind one side only; other side shows less weight shift' },
        { value: '4', label: '4 - Looks behind from both sides and weight shifts well' }
      ]
    },
    {
      id: 'turning360Degrees',
      title: '11. Turning 360 Degrees',
      instructions: 'Turn completely around in a full circle. Pause. Then turn a full circle in the other direction.',
      scores: [
        { value: '0', label: '0 - Needs assistance while turning' },
        { value: '1', label: '1 - Needs close supervision or verbal cueing' },
        { value: '2', label: '2 - Able to turn 360 degrees safely but slowly' },
        { value: '3', label: '3 - Able to turn 360 degrees safely one side only in 4 seconds or less' },
        { value: '4', label: '4 - Able to turn 360 degrees safely in 4 seconds or less both ways' }
      ]
    },
    {
      id: 'placingAlternateFoot',
      title: '12. Placing Alternate Foot on Step/Stool',
      instructions: 'Place each foot alternately on the step/stool. Continue until each foot has touched the step/stool four times.',
      scores: [
        { value: '0', label: '0 - Needs assistance to keep from falling / unable to try' },
        { value: '1', label: '1 - Able to complete <2 steps, needs minimal assist' },
        { value: '2', label: '2 - Able to complete 4 steps without aid with supervision' },
        { value: '3', label: '3 - Able to stand independently and complete 8 steps >20 seconds' },
        { value: '4', label: '4 - Able to stand independently and safely complete 8 steps in 20 seconds' }
      ]
    },
    {
      id: 'standingWithOneFootAhead',
      title: '13. Standing with One Foot in Front',
      instructions: 'Place one foot directly in front of the other. If you feel that you cannot place your foot directly in front, try to step far enough ahead that the heel of your forward foot is ahead of the toes of the other foot.',
      scores: [
        { value: '0', label: '0 - Loses balance while stepping or standing' },
        { value: '1', label: '1 - Needs help to step but can hold 15 seconds' },
        { value: '2', label: '2 - Able to take small step independently and hold 30 seconds' },
        { value: '3', label: '3 - Able to place foot ahead of other independently and hold 30 seconds' },
        { value: '4', label: '4 - Able to place feet in tandem position independently and hold 30 seconds' }
      ]
    },
    {
      id: 'standingOnOneLeg',
      title: '14. Standing on One Leg',
      instructions: 'Stand on one leg as long as you can without holding on.',
      scores: [
        { value: '0', label: '0 - Unable to try or needs assist to prevent fall' },
        { value: '1', label: '1 - Tries to lift leg; unable to hold 3 seconds but remains standing' },
        { value: '2', label: '2 - Able to lift leg independently and hold up to 3 seconds' },
        { value: '3', label: '3 - Able to lift leg independently and hold 5-10 seconds' },
        { value: '4', label: '4 - Able to lift leg independently and hold >10 seconds' }
      ]
    }
  ];

  // Calculate total score by watching all values
  const calculateTotalScore = () => {
    let total = 0;
    bergItems.forEach(item => {
      const score = localData[item.id]?.score;
      if (score !== undefined && score !== null) {
        total += Number(score);
      }
    });
    return total;
  };

  const totalScore = calculateTotalScore();
  
  // Get risk assessment based on total score
  const getFallRiskAssessment = (score) => {
    if (score >= 0 && score <= 20) {
      return {
        risk: "High Fall Risk",
        description: "Wheelchair bound - needs assistance with all transfers"
      };
    } else if (score >= 21 && score <= 40) {
      return {
        risk: "Medium Fall Risk",
        description: "Walking with assistance - independent with transfers and some mobility"
      };
    } else if (score >= 41 && score <= 56) {
      return {
        risk: "Low Fall Risk",
        description: "Independent - may use assistive device but otherwise independent"
      };
    } else {
      return {
        risk: "Incomplete Assessment",
        description: "Complete all items to get an accurate risk assessment"
      };
    }
  };

  const riskAssessment = getFallRiskAssessment(totalScore);

  return (
    <div className="space-y-6">
      <Card className="bg-blue-50">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Berg Balance Scale</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm space-y-2">
            <p>The Berg Balance Scale (BBS) is a 14-item objective measure designed to assess static balance and fall risk in adult populations.</p>
            <p>Each item is scored from 0-4 (0 = unable to perform, 4 = normal performance), with a maximum total score of 56.</p>
            <div className="p-3 bg-white rounded-md mt-2">
              <div className="font-semibold mb-1">Current Total Score: {totalScore}/56</div>
              <div className="font-semibold text-sm">{riskAssessment.risk}</div>
              <div className="text-xs">{riskAssessment.description}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        {bergItems.map((item) => {
          const itemBasePath = `data.bergBalance.${item.id}`;
          const scorePath = `${itemBasePath}.score`;
          const notesPath = `${itemBasePath}.notes`;
          const itemData = localData[item.id] || {};

          return (
            <Card key={item.id} className="border">
              <CardHeader className="pb-2">
                <CardTitle className="text-md">{item.title}</CardTitle>
                <p className="text-sm text-gray-500">
                  <strong>Instructions:</strong> {item.instructions}
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label htmlFor={scorePath} className="block mb-2">Score</label>
                  <select 
                    id={scorePath}
                    value={itemData.score?.toString() || ''}
                    onChange={(e) => updateFormData(`${itemBasePath}.score`, Number(e.target.value))}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="">Select score</option>
                    {item.scores.map((score) => (
                      <option key={score.value} value={score.value}>
                        {score.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor={notesPath} className="block mb-2">Notes</label>
                  <textarea
                    id={notesPath}
                    value={itemData.notes || ''}
                    onChange={(e) => updateFormData(`${itemBasePath}.notes`, e.target.value)}
                    placeholder="Add observations or special considerations..."
                    className="min-h-[60px] w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      <div className="border p-4 rounded-md">
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="data.bergBalance.completedItems"
            checked={localData.completedItems || false}
            onChange={(e) => updateFormData("data.bergBalance.completedItems", e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <div className="space-y-0.5">
            <label htmlFor="data.bergBalance.completedItems" className="block font-medium">
              Assessment Complete
            </label>
            <p className="text-sm text-gray-500">
              Check when the Berg Balance assessment has been fully completed
            </p>
          </div>
        </div>
      </div>
      
      <div>
        <label htmlFor="data.bergBalance.generalNotes" className="block font-medium mb-2">
          General Notes for Berg Balance Assessment
        </label>
        <textarea
          id="data.bergBalance.generalNotes"
          value={localData.generalNotes || ''}
          onChange={(e) => updateFormData("data.bergBalance.generalNotes", e.target.value)}
          placeholder="Add general observations about balance, testing conditions, etc..."
          className="min-h-[100px] w-full p-2 border border-gray-300 rounded-md"
        />
      </div>
    </div>
  );
}