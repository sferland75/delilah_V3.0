"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { useAssessmentContext } from "@/contexts/AssessmentContext";
import { FileUp, FileDown } from "lucide-react";

// Sample cases data
const sampleCases = [
  {
    id: "case-001",
    name: "John Smith",
    description: "45-year-old male with motor vehicle accident injuries",
    filename: "john-smith-assessment.json"
  },
  {
    id: "case-002",
    name: "Maria Garcia",
    description: "68-year-old female with post-stroke rehabilitation needs",
    filename: "maria-garcia-assessment.json"
  }
];

export default function LoadAssessment() {
  const { setAssessmentData } = useAssessmentContext();
  const { toast } = useToast();
  const [selectedCase, setSelectedCase] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleLoadSampleCase = async () => {
    if (!selectedCase) return;

    setIsLoading(true);
    try {
      const caseData = sampleCases.find(c => c.id === selectedCase);
      if (!caseData) throw new Error("Sample case not found");

      // For now, directly use the mock data to avoid file-loading issues in development
      // This will be replaced with proper file loading in production
      const assessmentData = await mockLoadAssessmentData(caseData.filename);
      
      console.log("Loading assessment data:", assessmentData);
      
      // Update the assessment context with the loaded data
      setAssessmentData(assessmentData);
      
      toast({
        title: "Sample Case Loaded",
        description: `Successfully loaded assessment data for ${caseData.name}`,
        variant: "success"
      });
    } catch (error) {
      console.error("Error loading sample case:", error);
      toast({
        title: "Error Loading Sample Case",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Mock function to load assessment data (embedded within the component for now)
  const mockLoadAssessmentData = async (filename: string) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (filename === "john-smith-assessment.json") {
      return {
        demographics: {
          personalInfo: {
            firstName: "John",
            lastName: "Smith",
            dateOfBirth: "1980-05-15",
            gender: "male",
            address: "123 Main Street, Anytown, CA 90210",
            phone: "555-123-4567",
            email: "john.smith@example.com"
          },
          referralInfo: {
            referralSource: "Dr. Jane Williams, Neurologist",
            referralDate: "2025-01-10",
            primaryDiagnosis: "Cervical strain, right rotator cuff tear, mild traumatic brain injury",
            secondaryDiagnosis: "Hypertension, Type 2 diabetes",
            reasonForReferral: "In-home assessment following motor vehicle accident"
          }
        },
        medicalHistory: {
          pastMedicalHistory: {
            conditions: [
              { condition: "Hypertension", diagnosisDate: "2020-03-15", treatment: "Lisinopril 10mg daily" },
              { condition: "Type 2 Diabetes", diagnosisDate: "2018-11-02", treatment: "Metformin 500mg twice daily" }
            ],
            surgeries: [
              { procedure: "Arthroscopic repair of right shoulder", date: "2025-02-01", surgeon: "Dr. Robert Chen" }
            ],
            allergies: "No known drug allergies",
            medications: [
              { name: "Lisinopril", dosage: "10mg", frequency: "Daily", reason: "Hypertension" },
              { name: "Metformin", dosage: "500mg", frequency: "Twice daily", reason: "Type 2 Diabetes" },
              { name: "Hydrocodone/Acetaminophen", dosage: "5/325mg", frequency: "As needed for pain", reason: "Post-accident pain" },
              { name: "Cyclobenzaprine", dosage: "5mg", frequency: "At bedtime", reason: "Muscle spasm" }
            ]
          },
          functionalHistory: {
            priorLevelOfFunction: "Independent in all ADLs and IADLs. Employed full-time as construction supervisor. Regular physical activity including gym 3x weekly and recreational soccer.",
            priorLivingArrangement: "Two-story home with spouse and two children (ages 10 and 12).",
            priorMobilityStatus: "Independent ambulation without assistive devices. Able to navigate stairs, uneven terrain, and drive without limitations.",
            recentChanges: "Since the motor vehicle accident (2025-01-15), unable to work, limited in ADLs due to right shoulder and neck pain, difficulty with stairs due to occasional dizziness, and limited in driving to short distances only."
          }
        },
        symptomsAssessment: {
          physicalSymptoms: [
            {
              symptom: "Neck pain",
              intensity: "6/10",
              description: "Constant aching with intermittent sharp pain",
              aggravatingFactors: "Prolonged sitting or standing, looking up",
              alleviatingFactors: "Heat, gentle stretching, medication",
              impactOnFunction: "Limits computer use, driving, and overhead activities"
            },
            {
              symptom: "Right shoulder pain",
              intensity: "7/10",
              description: "Throbbing pain with limited range of motion",
              aggravatingFactors: "Overhead activities, lifting more than 5 pounds",
              alleviatingFactors: "Ice, rest, medication",
              impactOnFunction: "Unable to reach overhead shelves, difficulty with dressing upper body"
            },
            {
              symptom: "Headaches",
              intensity: "5/10",
              description: "Pressure across forehead and temples",
              aggravatingFactors: "Screen time, noise, stress",
              alleviatingFactors: "Dark room, cold compress, medication",
              impactOnFunction: "Difficulty concentrating for extended periods"
            }
          ],
          cognitiveSymptoms: [
            {
              symptom: "Difficulty concentrating",
              severity: "Moderate",
              description: "Trouble maintaining focus on tasks",
              frequency: "Daily",
              impactOnFunction: "Reduced work productivity, difficulty reading for extended periods"
            },
            {
              symptom: "Short-term memory issues",
              severity: "Mild to moderate",
              description: "Forgets recent conversations or where items were placed",
              frequency: "Several times daily",
              impactOnFunction: "Needs to use reminder notes, misplaces items frequently"
            }
          ],
          emotionalSymptoms: [
            {
              type: "anxiety",
              severity: "moderate",
              frequency: "daily",
              impact: "Worried about future employment and ability to support family",
              management: "Deep breathing exercises, talking with spouse"
            },
            {
              type: "frustration",
              severity: "moderate",
              frequency: "daily",
              impact: "Becomes irritable when unable to complete previously easy tasks",
              management: "Taking breaks, using reminder system"
            }
          ]
        },
        functionalStatus: {
          mobilityAssessment: {
            bedMobility: "Independent",
            transfers: "Independent",
            ambulation: "Independent but with occasional dizziness on stairs",
            balance: "Occasional loss of balance with quick position changes",
            endurance: "Fatigue after 15-20 minutes of physical activity",
            assistiveDevices: "None currently"
          },
          upperExtremityFunction: {
            dominance: "Right-handed",
            rightShoulderROM: "Flexion 110°, Abduction 90°, External rotation 45°",
            leftShoulderROM: "Within normal limits",
            rightGripStrength: "65% compared to left side",
            leftGripStrength: "Normal",
            fineMotorSkills: "Intact bilaterally, but limited endurance with right hand"
          }
        },
        typicalDay: {
          morningRoutine: "Wakes at 7:00 AM with increased pain and stiffness. Takes 10-15 minutes to loosen up before getting out of bed. Morning routines (shower, dressing, breakfast) take approximately 45 minutes, which is longer than pre-injury baseline of 20 minutes.",
          daytimeActivities: "Spends most mornings resting or doing light household activities with frequent breaks due to fatigue and pain. Afternoons typically include medical or therapy appointments. Takes a 1-2 hour rest period mid-afternoon due to increased pain and fatigue.",
          eveningRoutine: "Evenings spent with family with minimal participation in household management tasks. Takes evening medications around 9:00 PM and goes to bed by 10:00 PM. Sleep is disturbed by pain, requiring position changes 3-4 times per night."
        },
        environmentalAssessment: {
          homeLayout: {
            typeOfResidence: "Two-story single family home",
            entryAccess: "Three steps to front door with handrail on left side. Ramp at back entrance.",
            bedroomLocation: "Master bedroom on second floor, 14 steps with handrail on right side",
            bathroomLocation: "Full bathrooms on both floors",
            kitchenAccess: "First floor, standard height countertops and cabinets"
          },
          safetyAssessment: {
            trippingHazards: "Area rug in living room, cluttered children's toys",
            lightingAdequacy: "Good lighting throughout, nightlights in hallways",
            bathroomSafety: "Grab bars installed in first floor shower and beside toilet",
            smokeDetectors: "Present and functional",
            emergencyPlan: "Has medical alert system but not consistently worn"
          }
        },
        activitiesDailyLiving: {
          basicADLs: {
            feeding: "Independent",
            bathing: "Independent but requires increased time and experiences moderate pain",
            grooming: "Independent with modified techniques",
            dressing: "Independent with lower body; requires minimal assistance or adaptive techniques for upper body dressing",
            toileting: "Independent"
          },
          instrumentalADLs: {
            mealPreparation: "Capable of simple meal preparation but avoids complex cooking due to fatigue and pain with prolonged standing",
            householdManagement: "Limited participation; spouse has assumed majority of household responsibilities",
            financialManagement: "Independent",
            medicationManagement: "Independent",
            communityMobility: "Independent for short distances; avoids driving during peak traffic hours due to concentration difficulties"
          },
          leisureRecreation: {
            physicalActivities: "Short walks around neighborhood (15-20 minutes), light gardening with frequent breaks",
            socialActivities: "Reduced participation in community groups; maintains weekly dinner with friends",
            hobbiesInterests: "Reading (limited by concentration), listening to podcasts, watching TV"
          }
        },
        attendantCare: {
          personalCare: {
            bathing: "Setup assistance and standby supervision",
            dressing: "Minimal assistance with upper body clothing",
            grooming: "Setup for shaving and hair care",
            toileting: "Independent"
          },
          homeManagement: {
            mealPreparation: "Assistance with complex meals and meal planning",
            cleaning: "Moderate assistance with heavy cleaning tasks",
            laundry: "Assistance with carrying laundry baskets"
          },
          communityAccess: {
            transportation: "Accompaniment to medical appointments",
            shopping: "Assistance with grocery shopping"
          },
          recommendedHours: {
            personalCare: 7,
            homeManagement: 4,
            communityAccess: 2,
            total: 13
          }
        }
      };
    } else if (filename === "maria-garcia-assessment.json") {
      return {
        demographics: {
          personalInfo: {
            firstName: "Maria",
            lastName: "Garcia",
            dateOfBirth: "1957-11-23",
            gender: "female",
            address: "456 Elm Avenue, Apt 302, Riverside, CA 92507",
            phone: "555-987-6543",
            email: "maria.garcia@example.com"
          },
          referralInfo: {
            referralSource: "Dr. Michael Chen, Neurologist",
            referralDate: "2025-01-05",
            primaryDiagnosis: "Left CVA with right-sided hemiparesis",
            secondaryDiagnosis: "Hypertension, Hyperlipidemia, Type 2 Diabetes",
            reasonForReferral: "Post-stroke rehabilitation assessment and home modification recommendations"
          }
        },
        medicalHistory: {
          pastMedicalHistory: {
            conditions: [
              { condition: "Hypertension", diagnosisDate: "2015-04-12", treatment: "Lisinopril 20mg daily" },
              { condition: "Type 2 Diabetes", diagnosisDate: "2016-07-18", treatment: "Metformin 1000mg twice daily" },
              { condition: "Hyperlipidemia", diagnosisDate: "2015-04-12", treatment: "Atorvastatin 40mg daily" }
            ],
            surgeries: [
              { procedure: "Cholecystectomy", date: "2010-03-10", surgeon: "Dr. Sarah Johnson" }
            ],
            allergies: "Penicillin (hives), Sulfa drugs (rash)",
            medications: [
              { name: "Lisinopril", dosage: "20mg", frequency: "Daily", reason: "Hypertension" },
              { name: "Metformin", dosage: "1000mg", frequency: "Twice daily", reason: "Type 2 Diabetes" },
              { name: "Atorvastatin", dosage: "40mg", frequency: "Daily", reason: "Hyperlipidemia" },
              { name: "Aspirin", dosage: "81mg", frequency: "Daily", reason: "Stroke prevention" },
              { name: "Clopidogrel", dosage: "75mg", frequency: "Daily", reason: "Stroke prevention" }
            ]
          },
          functionalHistory: {
            priorLevelOfFunction: "Independent in all ADLs and IADLs. Retired elementary school teacher. Active with community senior center and church activities. Enjoyed cooking, gardening, and visiting with grandchildren.",
            priorLivingArrangement: "Lived alone in third-floor apartment with elevator access.",
            priorMobilityStatus: "Independent ambulation without assistive devices. Used public transportation or drove personal vehicle.",
            recentChanges: "Following CVA on December 28, 2024, experienced right-sided weakness, aphasia, and balance impairments. Hospitalized for 5 days followed by 2 weeks of inpatient rehabilitation. Daughter (45) has temporarily moved in to provide assistance."
          }
        },
        symptomsAssessment: {
          physicalSymptoms: [
            {
              symptom: "Right arm weakness",
              intensity: "Moderate to severe",
              description: "Significant weakness in right arm with limited active range of motion",
              aggravatingFactors: "Fatigue, attempting fine motor tasks",
              alleviatingFactors: "Rest, supported positioning",
              impactOnFunction: "Unable to use right arm for functional activities including dressing, grooming, and meal preparation"
            },
            {
              symptom: "Right leg weakness",
              intensity: "Moderate",
              description: "Weakness most notable with hip flexion and ankle dorsiflexion",
              aggravatingFactors: "Extended walking, stair climbing, fatigue",
              alleviatingFactors: "Rest, elevation of leg",
              impactOnFunction: "Requires front-wheeled walker for ambulation, unable to navigate stairs independently"
            },
            {
              symptom: "Balance difficulties",
              intensity: "Moderate",
              description: "Unsteadiness with standing and walking",
              aggravatingFactors: "Uneven surfaces, crowded environments, quick movements",
              alleviatingFactors: "Using walker, moving slowly",
              impactOnFunction: "High fall risk, requires supervision for all mobility"
            }
          ],
          cognitiveSymptoms: [
            {
              symptom: "Expressive aphasia",
              severity: "Moderate",
              description: "Difficulty finding words and forming complete sentences",
              frequency: "Constant",
              impactOnFunction: "Frustration with communication, unable to have complex conversations"
            },
            {
              symptom: "Mild memory issues",
              severity: "Mild",
              description: "Occasionally forgets recent conversations or misplaces items",
              frequency: "Several times daily",
              impactOnFunction: "Needs reminders for medications and appointments"
            }
          ],
          emotionalSymptoms: [
            {
              type: "depression",
              severity: "moderate",
              frequency: "daily",
              impact: "Tearful episodes, loss of interest in previous activities",
              management: "Scheduled pleasant activities, family support"
            },
            {
              type: "grief",
              severity: "moderate",
              frequency: "daily",
              impact: "Mourning loss of independence and previous abilities",
              management: "Support group, discussions with therapist"
            },
            {
              type: "frustration",
              severity: "severe",
              frequency: "daily",
              impact: "Becomes upset when unable to communicate needs effectively",
              management: "Communication cards, breathing techniques"
            }
          ]
        },
        functionalStatus: {
          mobilityAssessment: {
            bedMobility: "Requires minimal assistance for rolling and supine-to-sit",
            transfers: "Moderate assistance for sit-to-stand transfers",
            ambulation: "Ambulates with front-wheeled walker with contact guard assistance for 100 feet before requiring rest",
            balance: "Poor standing balance with eyes closed, moderate sitting balance",
            endurance: "Fatigue after 5-10 minutes of activity",
            assistiveDevices: "Front-wheeled walker, bedside commode, shower chair"
          },
          upperExtremityFunction: {
            dominance: "Right-handed (affected side)",
            rightShoulderROM: "Limited to 90° flexion and abduction due to weakness",
            leftShoulderROM: "Within normal limits",
            rightGripStrength: "2/5 strength (significantly impaired)",
            leftGripStrength: "Normal",
            fineMotorSkills: "Unable to perform fine motor tasks with right hand, learning to use left hand for basic activities"
          }
        },
        typicalDay: {
          morningRoutine: "Awakens at 6:30 AM. Daughter helps with transfer to bedside commode. Requires moderate assistance for dressing and grooming. Morning routine takes approximately 90 minutes with rest breaks.",
          daytimeActivities: "Spends majority of day in living room recliner with positioned right arm. Attends outpatient therapy three times weekly. Practices speech exercises and does simple arm and leg exercises as tolerated. Daughter prepares all meals.",
          eveningRoutine: "Evening routine begins at 8:00 PM with assistance for hygiene and changing into night clothes. Takes evening medications at 9:00 PM. Sleep is interrupted 2-3 times nightly for toileting needs."
        },
        environmentalAssessment: {
          homeLayout: {
            typeOfResidence: "Third-floor apartment with elevator access",
            entryAccess: "No steps at building entrance, apartment has threshold at door",
            bedroomLocation: "Single-level apartment with bedroom adjacent to living room",
            bathroomLocation: "One bathroom off the main hallway with step-in shower/tub combination",
            kitchenAccess: "Galley-style kitchen with narrow clearance"
          },
          safetyAssessment: {
            trippingHazards: "Multiple area rugs, cluttered pathways, electrical cords",
            lightingAdequacy: "Poor lighting in bathroom and hallway",
            bathroomSafety: "No grab bars installed in shower/tub or near toilet",
            smokeDetectors: "Present but battery needs replacement",
            emergencyPlan: "Daughter stays with client, has emergency contact list on refrigerator"
          }
        },
        activitiesDailyLiving: {
          basicADLs: {
            feeding: "Requires setup assistance, uses left hand for self-feeding",
            bathing: "Requires moderate assistance for shower with shower chair",
            grooming: "Moderate assistance for grooming tasks",
            dressing: "Moderate assistance for all dressing tasks",
            toileting: "Minimal assistance for transfers to/from toilet, needs help with clothing management"
          },
          instrumentalADLs: {
            mealPreparation: "Unable to prepare meals independently due to weakness and balance issues",
            householdManagement: "Unable to perform household tasks independently",
            financialManagement: "Needs assistance with bill paying and banking due to cognitive and motor limitations",
            medicationManagement: "Requires setup and reminders for medications",
            communityMobility: "Unable to use public transportation or drive independently"
          },
          leisureRecreation: {
            physicalActivities: "Limited to prescribed therapeutic exercises",
            socialActivities: "Phone calls with friends, limited visitors due to fatigue",
            hobbiesInterests: "Listening to audiobooks, watching television, short periods of looking at photo albums"
          }
        },
        attendantCare: {
          personalCare: {
            bathing: "Moderate assistance daily",
            dressing: "Moderate assistance twice daily",
            grooming: "Moderate assistance daily",
            toileting: "Minimal assistance with clothing management"
          },
          homeManagement: {
            mealPreparation: "Maximum assistance three times daily",
            cleaning: "Maximum assistance for all household cleaning",
            laundry: "Maximum assistance weekly"
          },
          communityAccess: {
            transportation: "Maximum assistance for medical appointments",
            shopping: "Maximum assistance for all shopping needs"
          },
          recommendedHours: {
            personalCare: 14,
            homeManagement: 21,
            communityAccess: 8,
            total: 43
          }
        }
      };
    } else {
      // Default empty data structure
      return {
        demographics: {
          personalInfo: {
            firstName: "Sample",
            lastName: "Client"
          }
        }
      };
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Load Sample Assessment</CardTitle>
        <CardDescription>
          Select a sample case to populate the assessment form with pre-defined data
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Select Sample Case</label>
            <Select value={selectedCase} onValueChange={setSelectedCase}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a sample case" />
              </SelectTrigger>
              <SelectContent>
                {sampleCases.map(caseItem => (
                  <SelectItem key={caseItem.id} value={caseItem.id}>
                    {caseItem.name} - {caseItem.description}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">
          <FileUp className="h-4 w-4 mr-2" />
          Upload Assessment File
        </Button>
        <Button 
          onClick={handleLoadSampleCase} 
          disabled={!selectedCase || isLoading}
        >
          {isLoading ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-white mr-2"></div>
              Loading...
            </>
          ) : (
            <>
              <FileDown className="h-4 w-4 mr-2" />
              Load Case
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}