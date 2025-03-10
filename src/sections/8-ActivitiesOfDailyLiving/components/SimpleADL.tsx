'use client';

import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { Alert, AlertDescription } from '@/components/ui/alert';
import { InfoIcon } from 'lucide-react';

// Simplified ADL field component that doesn't rely on complex form dependencies
const SimpleADLField = ({ title, subtitle }) => {
  const [independenceLevel, setIndependenceLevel] = useState('');
  const [notes, setNotes] = useState('');
  
  const independenceLevels = [
    { value: "independent", label: "Independent (7) - Complete independence" },
    { value: "modified_independent", label: "Modified Independent (6) - Uses devices/adaptations" },
    { value: "supervision", label: "Supervision (5) - Supervision/setup only" },
    { value: "minimal_assistance", label: "Minimal Assistance (4) - >75% independent" },
    { value: "moderate_assistance", label: "Moderate Assistance (3) - 50-75% independent" },
    { value: "maximal_assistance", label: "Maximal Assistance (2) - 25-49% independent" },
    { value: "total_assistance", label: "Total Assistance (1) - <25% independent" },
    { value: "not_applicable", label: "Activity Not Applicable" }
  ];

  return (
    <Card className="p-4 border rounded-md hover:border-gray-300 transition-colors">
      <div className="space-y-4">
        <div>
          <h3 className="font-medium">{title}</h3>
          {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Independence Level</Label>
            <select 
              className="w-full p-2 border rounded-md" 
              value={independenceLevel}
              onChange={(e) => setIndependenceLevel(e.target.value)}
            >
              <option value="">Select independence level</option>
              {independenceLevels.map((level) => (
                <option key={level.value} value={level.value}>
                  {level.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Details & Observations</Label>
            <Textarea
              placeholder="Enter details about performance, challenges, and assistance needed..."
              className="min-h-[80px]"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </div>
      </div>
    </Card>
  );
};

// Simplified category data for basic ADLs
const adlCategories = {
  bathing: {
    title: "Bathing & Hygiene",
    items: [
      { id: "shower", title: "Bathing/Showering" },
      { id: "grooming", title: "Grooming" },
      { id: "oral_care", title: "Oral Care" },
      { id: "toileting", title: "Toileting" }
    ]
  },
  dressing: {
    title: "Dressing",
    items: [
      { id: "upper_body", title: "Upper Body Dressing" },
      { id: "lower_body", title: "Lower Body Dressing" },
      { id: "footwear", title: "Footwear Management" }
    ]
  },
  feeding: {
    title: "Feeding",
    items: [
      { id: "eating", title: "Eating" },
      { id: "setup", title: "Meal Setup" },
      { id: "drinking", title: "Drinking" }
    ]
  },
  transfers: {
    title: "Functional Mobility",
    items: [
      { id: "bed_transfer", title: "Bed Transfers", subtitle: "Moving in bed, getting in/out of bed" },
      { id: "toilet_transfer", title: "Toilet Transfers" },
      { id: "shower_transfer", title: "Shower/Tub Transfers" },
      { id: "position_changes", title: "Position Changes", subtitle: "Sit to stand, chair transfers" }
    ]
  }
};

// Simplified category data for IADLs
const iadlCategories = {
  household: {
    title: "Household Management",
    items: [
      { id: "cleaning", title: "House Cleaning" },
      { id: "laundry", title: "Laundry" },
      { id: "meal_prep", title: "Meal Preparation" },
      { id: "home_maintenance", title: "Home Maintenance", subtitle: "Basic repairs, yard work" }
    ]
  },
  community: {
    title: "Community Integration",
    items: [
      { id: "transportation", title: "Transportation", subtitle: "Driving, public transit use" },
      { id: "shopping", title: "Shopping" },
      { id: "money_management", title: "Financial Management" },
      { id: "communication", title: "Communication", subtitle: "Phone, mail, email" }
    ]
  }
};

// Simplified category data for health management
const healthCategories = {
  management: {
    title: "Health Management",
    items: [
      { id: "medications", title: "Medication Management" },
      { id: "appointments", title: "Medical Appointments" },
      { id: "monitoring", title: "Health Monitoring", subtitle: "Vitals, symptoms, etc." },
      { id: "exercise", title: "Exercise/Activity" }
    ]
  },
  routine: {
    title: "Health Routine",
    items: [
      { id: "sleep", title: "Sleep Management" },
      { id: "stress", title: "Stress Management" },
      { id: "nutrition", title: "Nutrition Management" }
    ]
  }
};

// Simplified category data for work
const workCategories = {
  status: {
    title: "Work Status",
    items: [
      { id: "current_status", title: "Current Work Status" },
      { id: "workplace_accommodations", title: "Workplace Accommodations" },
      { id: "training_needs", title: "Training/Education Needs" },
      { id: "barriers", title: "Return to Work Barriers" }
    ]
  }
};

// Simplified category data for leisure
const leisureCategories = {
  sports: {
    title: "Physical Activities & Sports",
    items: [
      { id: "fitness", title: "Fitness Activities", subtitle: "Gym, running, swimming, etc." },
      { id: "team_sports", title: "Team Sports", subtitle: "Basketball, soccer, volleyball, etc." },
      { id: "individual_sports", title: "Individual Sports", subtitle: "Tennis, golf, cycling, etc." },
      { id: "outdoor", title: "Outdoor Activities", subtitle: "Hiking, fishing, gardening, etc." }
    ]
  },
  social: {
    title: "Social & Leisure Activities",
    items: [
      { id: "family", title: "Family Activities", subtitle: "Time spent with family members" },
      { id: "friends", title: "Social Gatherings", subtitle: "Meeting friends, parties, etc." },
      { id: "hobbies", title: "Hobbies", subtitle: "Arts, crafts, music, reading, etc." },
      { id: "entertainment", title: "Entertainment", subtitle: "Movies, concerts, theater, etc." }
    ]
  }
};

export function SimpleADL() {
  // State for the active tab
  const [activeTab, setActiveTab] = useState('basic');
  
  // State for expanded accordion items
  const [expandedItems, setExpandedItems] = useState({
    basic: Object.keys(adlCategories),
    iadl: Object.keys(iadlCategories),
    health: Object.keys(healthCategories),
    work: Object.keys(workCategories),
    leisure: Object.keys(leisureCategories)
  });
  
  // Toggle accordion items
  const toggleAccordionItem = (tab, item) => {
    setExpandedItems(prev => {
      const currentItems = [...prev[tab]];
      if (currentItems.includes(item)) {
        return { ...prev, [tab]: currentItems.filter(i => i !== item) };
      } else {
        return { ...prev, [tab]: [...currentItems, item] };
      }
    });
  };
  
  // Check if an item is expanded
  const isItemExpanded = (tab, item) => {
    return expandedItems[tab]?.includes(item) || false;
  };

  // Render Basic ADLs content
  const renderBasicContent = () => (
    <div className="space-y-4">
      <div className="p-4 border rounded-md bg-blue-50">
        <h3 className="font-medium text-blue-800">Basic Activities of Daily Living</h3>
        <p className="text-sm text-blue-700 mt-1">
          These activities are essential for self-care and independent living. Assess the client's ability in each area.
        </p>
      </div>
      
      <div className="space-y-4">
        {Object.entries(adlCategories).map(([category, { title, items }]) => (
          <div key={category} className="border rounded-md overflow-hidden">
            <div 
              className="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-50"
              onClick={() => toggleAccordionItem('basic', category)}
            >
              <h3 className="font-medium">{title}</h3>
              <span>{isItemExpanded('basic', category) ? '▲' : '▼'}</span>
            </div>
            
            {isItemExpanded('basic', category) && (
              <div className="p-4 space-y-4 border-t">
                {items.map((item) => (
                  <SimpleADLField
                    key={item.id}
                    title={item.title}
                    subtitle={item.subtitle}
                  />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  // Render IADL content
  const renderIADLContent = () => (
    <div className="space-y-4">
      <div className="p-4 border rounded-md bg-blue-50">
        <h3 className="font-medium text-blue-800">Instrumental Activities of Daily Living</h3>
        <p className="text-sm text-blue-700 mt-1">
          These activities support independent living in the community and typically require more complex skills.
        </p>
      </div>
      
      <div className="space-y-4">
        {Object.entries(iadlCategories).map(([category, { title, items }]) => (
          <div key={category} className="border rounded-md overflow-hidden">
            <div 
              className="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-50"
              onClick={() => toggleAccordionItem('iadl', category)}
            >
              <h3 className="font-medium">{title}</h3>
              <span>{isItemExpanded('iadl', category) ? '▲' : '▼'}</span>
            </div>
            
            {isItemExpanded('iadl', category) && (
              <div className="p-4 space-y-4 border-t">
                {items.map((item) => (
                  <SimpleADLField
                    key={item.id}
                    title={item.title}
                    subtitle={item.subtitle}
                  />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  // Render Health content
  const renderHealthContent = () => (
    <div className="space-y-4">
      <div className="p-4 border rounded-md bg-blue-50">
        <h3 className="font-medium text-blue-800">Health Management</h3>
        <p className="text-sm text-blue-700 mt-1">
          Activities related to managing health conditions, medications, and maintaining wellness.
        </p>
      </div>
      
      <div className="space-y-4">
        {Object.entries(healthCategories).map(([category, { title, items }]) => (
          <div key={category} className="border rounded-md overflow-hidden">
            <div 
              className="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-50"
              onClick={() => toggleAccordionItem('health', category)}
            >
              <h3 className="font-medium">{title}</h3>
              <span>{isItemExpanded('health', category) ? '▲' : '▼'}</span>
            </div>
            
            {isItemExpanded('health', category) && (
              <div className="p-4 space-y-4 border-t">
                {items.map((item) => (
                  <SimpleADLField
                    key={item.id}
                    title={item.title}
                    subtitle={item.subtitle}
                  />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  // Render Work content
  const renderWorkContent = () => (
    <div className="space-y-4">
      <div className="p-4 border rounded-md bg-blue-50">
        <h3 className="font-medium text-blue-800">Work Status</h3>
        <p className="text-sm text-blue-700 mt-1">
          Assessment of work-related activities, accommodations, and return-to-work considerations.
        </p>
      </div>
      
      <div className="space-y-4">
        {Object.entries(workCategories).map(([category, { title, items }]) => (
          <div key={category} className="border rounded-md overflow-hidden">
            <div 
              className="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-50"
              onClick={() => toggleAccordionItem('work', category)}
            >
              <h3 className="font-medium">{title}</h3>
              <span>{isItemExpanded('work', category) ? '▲' : '▼'}</span>
            </div>
            
            {isItemExpanded('work', category) && (
              <div className="p-4 space-y-4 border-t">
                {items.map((item) => (
                  <SimpleADLField
                    key={item.id}
                    title={item.title}
                    subtitle={item.subtitle}
                  />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  // Render Leisure content
  const renderLeisureContent = () => (
    <div className="space-y-4">
      <div className="p-4 border rounded-md bg-blue-50">
        <h3 className="font-medium text-blue-800">Leisure & Recreation</h3>
        <p className="text-sm text-blue-700 mt-1">
          Activities related to leisure, recreation, social participation, and community involvement.
        </p>
      </div>
      
      <div className="space-y-4">
        {Object.entries(leisureCategories).map(([category, { title, items }]) => (
          <div key={category} className="border rounded-md overflow-hidden">
            <div 
              className="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-50"
              onClick={() => toggleAccordionItem('leisure', category)}
            >
              <h3 className="font-medium">{title}</h3>
              <span>{isItemExpanded('leisure', category) ? '▲' : '▼'}</span>
            </div>
            
            {isItemExpanded('leisure', category) && (
              <div className="p-4 space-y-4 border-t">
                {items.map((item) => (
                  <SimpleADLField
                    key={item.id}
                    title={item.title}
                    subtitle={item.subtitle}
                  />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  try {
    return (
      <div className="space-y-6">
        <div className="mb-4">
          <h2 className="text-2xl font-semibold text-slate-800">Activities of Daily Living</h2>
          <p className="text-sm text-muted-foreground mt-1">
            This section assesses the client's ability to perform activities of daily living before and after the accident.
          </p>
        </div>
  
        <div className="w-full">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full border-b p-0 h-auto">
              <TabsTrigger 
                value="basic" 
                className="py-2 rounded-none flex-1 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 data-[state=inactive]:border-b data-[state=inactive]:border-gray-200 data-[state=inactive]:text-gray-600"
              >
                Basic ADLs
              </TabsTrigger>
              <TabsTrigger 
                value="iadl" 
                className="py-2 rounded-none flex-1 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 data-[state=inactive]:border-b data-[state=inactive]:border-gray-200 data-[state=inactive]:text-gray-600"
              >
                IADLs
              </TabsTrigger>
              <TabsTrigger 
                value="health" 
                className="py-2 rounded-none flex-1 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 data-[state=inactive]:border-b data-[state=inactive]:border-gray-200 data-[state=inactive]:text-gray-600"
              >
                Health Management
              </TabsTrigger>
              <TabsTrigger 
                value="work" 
                className="py-2 rounded-none flex-1 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 data-[state=inactive]:border-b data-[state=inactive]:border-gray-200 data-[state=inactive]:text-gray-600"
              >
                Work Status
              </TabsTrigger>
              <TabsTrigger 
                value="leisure" 
                className="py-2 rounded-none flex-1 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 data-[state=inactive]:border-b data-[state=inactive]:border-gray-200 data-[state=inactive]:text-gray-600"
              >
                Leisure
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="basic" className="p-6">
              {renderBasicContent()}
            </TabsContent>
            
            <TabsContent value="iadl" className="p-6">
              {renderIADLContent()}
            </TabsContent>
            
            <TabsContent value="health" className="p-6">
              {renderHealthContent()}
            </TabsContent>
            
            <TabsContent value="work" className="p-6">
              {renderWorkContent()}
            </TabsContent>
            
            <TabsContent value="leisure" className="p-6">
              {renderLeisureContent()}
            </TabsContent>
          </Tabs>
  
          <div className="flex justify-end space-x-2 mt-4">
            <Button 
              variant="outline"
              type="button"
            >
              Reset
            </Button>
            <Button 
              className="bg-blue-600 hover:bg-blue-700 text-white"
              type="button"
            >
              Save Activities of Daily Living
            </Button>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error rendering SimpleADL:", error);
    return (
      <Alert className="mb-6 bg-red-50 text-red-800 border-red-200">
        <InfoIcon className="h-4 w-4 text-red-800" />
        <AlertDescription>
          An error occurred while rendering the Activities of Daily Living component. Please try refreshing the page.
        </AlertDescription>
      </Alert>
    );
  }
}

export default SimpleADL;