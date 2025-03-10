@echo off
echo Applying EMERGENCY DIRECT FIX...

echo.
echo Stopping any running servers...
taskkill /f /im node.exe >nul 2>&1

echo.
echo Clearing Next.js cache completely...
rmdir /s /q .next
rmdir /s /q node_modules\.cache

echo.
echo Creating direct component fix files...

echo.
echo Creating simplified MedicalHistory component...
copy /Y src\sections\3-MedicalHistory\components\MedicalHistorySelfContained.jsx src\sections\3-MedicalHistory\MedicalHistory.jsx

echo.
echo Creating direct references in full-assessment.tsx...
(
echo /* EMERGENCY FIX to prevent component rendering errors */
echo import React, { useState, useEffect, useRef } from 'react';
echo import { useRouter } from 'next/router';
echo import { Card, CardContent } from '@/components/ui/card';
echo import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
echo import { Button } from '@/components/ui/button';
echo import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
echo import { InfoIcon, Save, Loader, Home, LayoutDashboard, PenTool } from 'lucide-react';
echo import Link from 'next/link';
echo import MainNavigation from '@/components/navigation/main';
echo import { useAssessment } from '@/contexts/AssessmentContext';
echo import { useToast } from "@/components/ui/use-toast";
echo.
echo // For emergency purposes only:
echo // Directly import the working self-contained component
echo import { MedicalHistorySelfContained } from '@/sections/3-MedicalHistory/components/MedicalHistorySelfContained';
echo.
echo // Define simplified fallback for all sections
echo const FallbackComponent = ^({ name ^}) =^> ^(
echo   ^<div className="p-6 border-2 border-orange-200 bg-orange-50 rounded-md"^>
echo     ^<h3 className="text-lg font-medium text-orange-800 mb-2"^>Simple {name} Interface^</h3^>
echo     ^<p className="text-orange-700"^>This is a simplified version of the section due to rendering issues.^</p^>
echo   ^</div^>
echo ^);
echo.
echo // Define tab labels and component mapping
echo const sectionTabs = [
echo   { value: 'initial', label: 'Initial Assessment', component: FallbackComponent },
echo   { value: 'purpose', label: 'Purpose ^& Methodology', component: FallbackComponent },
echo   { value: 'medical', label: 'Medical History', component: MedicalHistorySelfContained },
echo   { value: 'symptoms', label: 'Symptoms Assessment', component: MedicalHistorySelfContained },
echo   { value: 'functional', label: 'Functional Status', component: FallbackComponent },
echo   { value: 'typical-day', label: 'Typical Day', component: FallbackComponent },
echo   { value: 'environment', label: 'Environmental Assessment', component: FallbackComponent },
echo   { value: 'adl', label: 'Activities of Daily Living', component: FallbackComponent },
echo   { value: 'attendant-care', label: 'Attendant Care', component: FallbackComponent },
echo ];
echo.
echo export default function FullAssessment() {
echo   const router = useRouter();
echo   const { section, id } = router.query;
echo   const { toast } = useToast();
echo   const { currentAssessmentId, saveCurrentAssessment, hasUnsavedChanges } = useAssessment();
echo   
echo   // Start with medical history as the default tab
echo   const [activeTab, setActiveTab] = useState('medical');
echo   const [isSaving, setIsSaving] = useState(false);
echo   const [saveSuccess, setSaveSuccess] = useState(null);
echo 
echo   // Handle tab change
echo   const handleTabChange = (value) => {
echo     setActiveTab(value);
echo   };
echo   
echo   // Simplified save handler
echo   const handleSave = async () => {
echo     setIsSaving(true);
echo     
echo     try {
echo       const success = saveCurrentAssessment();
echo       
echo       if (success) {
echo         setSaveSuccess(true);
echo         toast({
echo           title: "Assessment Saved",
echo           description: "Your assessment has been saved successfully.",
echo         });
echo         setTimeout(() => setSaveSuccess(null), 3000);
echo       } else {
echo         setSaveSuccess(false);
echo         toast({
echo           title: "Save Failed",
echo           description: "Failed to save assessment. Please try again.",
echo           variant: "destructive"
echo         });
echo       }
echo     } catch (error) {
echo       console.error("Error saving assessment:", error);
echo       setSaveSuccess(false);
echo     } finally {
echo       setIsSaving(false);
echo     }
echo   };
echo 
echo   return (
echo     ^<div className="flex min-h-screen bg-gray-50"^>
echo       ^<div className="w-64 p-4 bg-white border-r"^>
echo         ^<MainNavigation /^>
echo       ^</div^>
echo       
echo       ^<div className="flex-1 p-8"^>
echo         ^<div className="flex justify-between items-center mb-6"^>
echo           ^<div^>
echo             ^<h1 className="text-2xl font-bold"^>Assessment^</h1^>
echo             ^<p className="text-gray-600"^>Emergency Fixed Version^</p^>
echo           ^</div^>
echo           ^<div className="flex space-x-3"^>
echo             {hasUnsavedChanges ^&^& (
echo               ^<Alert className="py-2 px-3 h-10 flex items-center bg-amber-50 border-amber-200"^>
echo                 ^<span className="text-amber-800 text-sm"^>Unsaved changes^</span^>
echo               ^</Alert^>
echo             )}
echo             
echo             ^<Button 
echo               variant="outline" 
echo               className="flex items-center gap-2"
echo               onClick={handleSave}
echo               disabled={isSaving}
echo             ^>
echo               {isSaving ? (
echo                 ^<^>
echo                   ^<Loader className="h-4 w-4 animate-spin" /^>
echo                   Saving...
echo                 ^</^>
echo               ) : (
echo                 ^<^>
echo                   ^<Save className="h-4 w-4" /^>
echo                   Save
echo                 ^</^>
echo               )}
echo             ^</Button^>
echo             
echo             ^<Link href="/assessment"^>
echo               ^<Button variant="outline" className="flex items-center gap-2"^>
echo                 ^<LayoutDashboard className="h-4 w-4" /^>
echo                 Assessment List
echo               ^</Button^>
echo             ^</Link^>
echo           ^</div^>
echo         ^</div^>
echo         
echo         {saveSuccess === true ^&^& (
echo           ^<Alert className="mb-4 bg-green-50 border-green-200"^>
echo             ^<AlertTitle className="text-green-800"^>Saved Successfully^</AlertTitle^>
echo             ^<AlertDescription className="text-green-700"^>
echo               Your assessment has been saved successfully.
echo             ^</AlertDescription^>
echo           ^</Alert^>
echo         )}
echo         
echo         ^<Card className="mb-6"^>
echo           ^<CardContent className="p-0"^>
echo             ^<Tabs 
echo               value={activeTab} 
echo               onValueChange={handleTabChange}
echo               className="w-full"
echo             ^>
echo               ^<TabsList className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 p-2 bg-white border-b rounded-none overflow-x-auto"^>
echo                 {sectionTabs.map(tab =^> (
echo                   ^<TabsTrigger 
echo                     key={tab.value} 
echo                     value={tab.value}
echo                     className="rounded-md"
echo                   ^>
echo                     {tab.label}
echo                   ^</TabsTrigger^>
echo                 ))}
echo               ^</TabsList^>
echo               
echo               {sectionTabs.map(tab =^> (
echo                 ^<TabsContent key={tab.value} value={tab.value} className="p-6"^>
echo                   {React.createElement(tab.component, { name: tab.label })}
echo                 ^</TabsContent^>
echo               ))}
echo             ^</Tabs^>
echo           ^</CardContent^>
echo         ^</Card^>
echo       ^</div^>
echo     ^</div^>
echo   );
echo }
) > pages\emergency-assessment.js

echo.
echo Creating navigation link to emergency page...
(
echo /* EMERGENCY NAVIGATION */
echo import { useRouter } from 'next/router';
echo import { Button } from '@/components/ui/button';
echo import Link from 'next/link';
echo.
echo export default function EmergencyNav() {
echo   return (
echo     ^<div className="min-h-screen bg-gray-50 flex items-center justify-center p-4"^>
echo       ^<div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full"^>
echo         ^<h1 className="text-2xl font-bold text-center mb-6"^>Delilah Assessment^</h1^>
echo         
echo         ^<div className="space-y-4"^>
echo           ^<div className="border-l-4 border-yellow-400 bg-yellow-50 p-4 mb-6"^>
echo             ^<p className="text-yellow-800"^>
echo               Some components are experiencing rendering issues. 
echo               Use the emergency assessment view for a simplified but working interface.
echo             ^</p^>
echo           ^</div^>
echo           
echo           ^<Link href="/emergency-assessment" className="w-full"^>
echo             ^<Button className="w-full"^>Open Emergency Assessment View^</Button^>
echo           ^</Link^>
echo           
echo           ^<Link href="/full-assessment" className="w-full"^>
echo             ^<Button variant="outline" className="w-full"^>Try Normal Assessment View^</Button^>
echo           ^</Link^>
echo           
echo           ^<Link href="/assessment" className="w-full"^>
echo             ^<Button variant="outline" className="w-full"^>Assessment List^</Button^>
echo           ^</Link^>
echo         ^</div^>
echo       ^</div^>
echo     ^</div^>
echo   );
echo }
) > pages\index.js

echo.
echo Starting the application with emergency fix...
npm run dev