import React, { useMemo } from 'react';
import { useAssessmentContext } from '@/contexts/AssessmentContext';
import { cn } from '@/lib/utils';

interface ProgressIndicatorProps {
  className?: string;
  showDetailedBreakdown?: boolean;
}

export function ProgressIndicator({ 
  className, 
  showDetailedBreakdown = false 
}: ProgressIndicatorProps) {
  // Use the standard assessment context - this will work regardless of field trial mode
  const { data } = useAssessmentContext();
  
  // Define a function to calculate completion percentage for each section
  const calculateSectionCompletion = (sectionKey: string, sectionData: any) => {
    if (!sectionData) return 0;
    
    switch (sectionKey) {
      case 'demographics':
        // Check for required fields in demographics
        const personalInfo = sectionData.personalInfo || {};
        const requirementsMet = [
          !!personalInfo.firstName,
          !!personalInfo.lastName,
          !!personalInfo.dateOfBirth,
          !!personalInfo.gender
        ];
        return (requirementsMet.filter(Boolean).length / requirementsMet.length) * 100;
        
      case 'medicalHistory':
        // Check if we have conditions, medications, and relevant history
        const hasMedicalConditions = !!(sectionData.conditions && sectionData.conditions.length > 0);
        const hasMedications = !!(sectionData.medications && sectionData.medications.length > 0);
        const hasHistory = !!sectionData.medicalHistory;
        const hasAllergies = !!sectionData.allergies;
        
        const requirements = [hasMedicalConditions, hasMedications, hasHistory, hasAllergies];
        return (requirements.filter(Boolean).length / requirements.length) * 100;
        
      case 'symptomsAssessment':
        // Check if pain and other symptoms are assessed
        const hasPain = !!(sectionData.pain && Object.keys(sectionData.pain).length > 0);
        const hasSymptoms = !!(sectionData.symptoms && sectionData.symptoms.length > 0);
        
        const symptomRequirements = [hasPain, hasSymptoms];
        return (symptomRequirements.filter(Boolean).length / symptomRequirements.length) * 100;
        
      case 'functionalStatus':
        // Check ROM, MMT, and functional abilities
        const hasROM = !!(sectionData.rangeOfMotion && Object.keys(sectionData.rangeOfMotion).length > 0);
        const hasMMT = !!(sectionData.manualMuscleTest && Object.keys(sectionData.manualMuscleTest).length > 0);
        const hasAbilities = !!(sectionData.functionalAbilities && Object.keys(sectionData.functionalAbilities).length > 0);
        
        const functionalRequirements = [hasROM, hasMMT, hasAbilities];
        return (functionalRequirements.filter(Boolean).length / functionalRequirements.length) * 100;
        
      case 'typicalDay':
        // Check if typical day narrative exists
        return sectionData.dailyRoutine ? 100 : 0;
        
      case 'environmentalAssessment':
        // Check home and work environments
        const hasHome = !!(sectionData.homeEnvironment && Object.keys(sectionData.homeEnvironment).length > 0);
        const hasWork = !!(sectionData.workEnvironment && Object.keys(sectionData.workEnvironment).length > 0);
        
        const envRequirements = [hasHome, hasWork];
        return (envRequirements.filter(Boolean).length / envRequirements.length) * 100;
        
      case 'activitiesDailyLiving':
        // Check if ADL assessments are present
        const hasDailyActivities = !!(sectionData.dailyActivities && Object.keys(sectionData.dailyActivities).length > 0);
        const hasIADL = !!(sectionData.instrumentalActivities && Object.keys(sectionData.instrumentalActivities).length > 0);
        
        const adlRequirements = [hasDailyActivities, hasIADL];
        return (adlRequirements.filter(Boolean).length / adlRequirements.length) * 100;
        
      case 'attendantCare':
        // Check if attendant care needs are documented
        const hasLevel1 = !!(sectionData.level1 && Object.keys(sectionData.level1).length > 0);
        const hasLevel2 = !!(sectionData.level2 && Object.keys(sectionData.level2).length > 0);
        const hasLevel3 = !!(sectionData.level3 && Object.keys(sectionData.level3).length > 0);
        
        const careRequirements = [hasLevel1, hasLevel2, hasLevel3];
        return (careRequirements.filter(Boolean).length / careRequirements.length) * 100;
        
      default:
        // For unknown sections, return 0% or check if any data exists
        return Object.keys(sectionData || {}).length > 0 ? 50 : 0;
    }
  };
  
  // Define sections to track
  const sections = useMemo(() => [
    { id: 'demographics', label: 'Demographics', completion: calculateSectionCompletion('demographics', data.demographics) },
    { id: 'medicalHistory', label: 'Medical History', completion: calculateSectionCompletion('medicalHistory', data.medicalHistory) },
    { id: 'symptomsAssessment', label: 'Symptoms', completion: calculateSectionCompletion('symptomsAssessment', data.symptomsAssessment) },
    { id: 'functionalStatus', label: 'Functional Status', completion: calculateSectionCompletion('functionalStatus', data.functionalStatus) },
    { id: 'typicalDay', label: 'Typical Day', completion: calculateSectionCompletion('typicalDay', data.typicalDay) },
    { id: 'environmentalAssessment', label: 'Environment', completion: calculateSectionCompletion('environmentalAssessment', data.environmentalAssessment) },
    { id: 'activitiesDailyLiving', label: 'ADL', completion: calculateSectionCompletion('activitiesDailyLiving', data.activitiesDailyLiving) },
    { id: 'attendantCare', label: 'Attendant Care', completion: calculateSectionCompletion('attendantCare', data.attendantCare) },
  ], [data]);
  
  // Calculate overall completion
  const overallCompletion = useMemo(() => {
    const completedSections = sections.filter(s => s.completion > 0);
    if (completedSections.length === 0) return 0;
    
    return sections.reduce((sum, section) => sum + section.completion, 0) / sections.length;
  }, [sections]);
  
  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium">Overall Progress</span>
        <span className="text-sm font-medium">{Math.round(overallCompletion)}%</span>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
        <div 
          className="bg-blue-600 h-2.5 rounded-full transition-all duration-500" 
          style={{ width: `${overallCompletion}%` }}
        ></div>
      </div>
      
      {showDetailedBreakdown && (
        <div className="space-y-2 mt-4">
          {sections.map(section => (
            <div key={section.id} className="grid grid-cols-8 gap-2 text-sm items-center">
              <span className="col-span-2 truncate">{section.label}</span>
              <div className="col-span-5 w-full bg-gray-200 rounded-full h-1.5 mt-0 dark:bg-gray-700">
                <div 
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-500",
                    section.completion === 0 ? "bg-gray-400" :
                    section.completion < 50 ? "bg-yellow-500" :
                    section.completion < 100 ? "bg-blue-500" : "bg-green-500"
                  )}
                  style={{ width: `${section.completion}%` }}
                ></div>
              </div>
              <span className="col-span-1 text-right text-xs">{Math.round(section.completion)}%</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
