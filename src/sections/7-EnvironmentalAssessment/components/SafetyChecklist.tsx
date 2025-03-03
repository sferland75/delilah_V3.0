import React from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface SafetyChecklistProps {
  value: {
    hazards: string[];
    modifications: string[];
    recommendations: string[];
  };
  onChange: (value: any) => void;
}

const SafetyChecklist: React.FC<SafetyChecklistProps> = ({ value, onChange }) => {
  const [newHazard, setNewHazard] = React.useState('');
  const [newModification, setNewModification] = React.useState('');
  const [newRecommendation, setNewRecommendation] = React.useState('');

  const addItem = (field: 'hazards' | 'modifications' | 'recommendations', item: string) => {
    if (item.trim()) {
      onChange({
        ...value,
        [field]: [...value[field], item.trim()]
      });
      // Clear the input field
      switch (field) {
        case 'hazards':
          setNewHazard('');
          break;
        case 'modifications':
          setNewModification('');
          break;
        case 'recommendations':
          setNewRecommendation('');
          break;
      }
    }
  };

  const removeItem = (field: 'hazards' | 'modifications' | 'recommendations', index: number) => {
    onChange({
      ...value,
      [field]: value[field].filter((_, i) => i !== index)
    });
  };

  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold">Safety Assessment</h3>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Hazards Section */}
        <div className="space-y-2">
          <h4 className="font-medium">Safety Hazards</h4>
          <div className="flex space-x-2">
            <Input
              id="new-hazard"
              value={newHazard}
              onChange={(e) => setNewHazard(e.target.value)}
              placeholder="Enter safety hazard"
            />
            <Button 
              onClick={() => addItem('hazards', newHazard)}
              className="whitespace-nowrap"
            >
              Add Hazard
            </Button>
          </div>
          <ul className="list-disc list-inside space-y-1">
            {value.hazards.map((hazard, index) => (
              <li key={index} className="flex justify-between items-center">
                <span>{hazard}</span>
                <Button 
                  onClick={() => removeItem('hazards', index)}
                  variant="ghost"
                  size="sm"
                >
                  Remove
                </Button>
              </li>
            ))}
          </ul>
        </div>

        {/* Modifications Section */}
        <div className="space-y-2">
          <h4 className="font-medium">Existing Modifications</h4>
          <div className="flex space-x-2">
            <Input
              id="new-modification"
              value={newModification}
              onChange={(e) => setNewModification(e.target.value)}
              placeholder="Enter existing modification"
            />
            <Button 
              onClick={() => addItem('modifications', newModification)}
              className="whitespace-nowrap"
            >
              Add Modification
            </Button>
          </div>
          <ul className="list-disc list-inside space-y-1">
            {value.modifications.map((mod, index) => (
              <li key={index} className="flex justify-between items-center">
                <span>{mod}</span>
                <Button 
                  onClick={() => removeItem('modifications', index)}
                  variant="ghost"
                  size="sm"
                >
                  Remove
                </Button>
              </li>
            ))}
          </ul>
        </div>

        {/* Recommendations Section */}
        <div className="space-y-2">
          <h4 className="font-medium">Safety Recommendations</h4>
          <div className="flex space-x-2">
            <Input
              id="new-recommendation"
              value={newRecommendation}
              onChange={(e) => setNewRecommendation(e.target.value)}
              placeholder="Enter safety recommendation"
            />
            <Button 
              onClick={() => addItem('recommendations', newRecommendation)}
              className="whitespace-nowrap"
            >
              Add Recommendation
            </Button>
          </div>
          <ul className="list-disc list-inside space-y-1">
            {value.recommendations.map((rec, index) => (
              <li key={index} className="flex justify-between items-center">
                <span>{rec}</span>
                <Button 
                  onClick={() => removeItem('recommendations', index)}
                  variant="ghost"
                  size="sm"
                >
                  Remove
                </Button>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export { SafetyChecklist };
export default SafetyChecklist;