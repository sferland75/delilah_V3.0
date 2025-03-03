# Pattern Recognition Analysis Report

**Generated on:** 2025-03-01T21:15:36.173Z
**Files Analyzed:** 91
**Processing Time:** 606 seconds

## Section Detection

| Section | Occurrences | Avg. Confidence | Min | Max |
|---------|-------------|----------------|-----|-----|
| SYMPTOMS | 1406 | 33.9% | 33.3% | 86.7% |
| ATTENDANT_CARE | 439 | 34.1% | 33.3% | 66.7% |
| ADLS | 197 | 36.6% | 33.3% | 86.7% |
| MEDICAL_HISTORY | 165 | 34.8% | 33.3% | 66.7% |
| TYPICAL_DAY | 140 | 36.8% | 33.3% | 66.7% |
| ENVIRONMENTAL | 121 | 35.3% | 33.3% | 53.3% |
| FUNCTIONAL_STATUS | 111 | 37.5% | 33.3% | 86.7% |
| DEMOGRAPHICS | 83 | 38.6% | 33.3% | 50.0% |

## Field Extraction Success

| Field | Successful Extractions | Success Rate |
|-------|------------------------|-------------|
| SYMPTOMS.symptomNotes | 1406 | 1545.1% |
| SYMPTOMS.reportedSymptoms | 779 | 856.0% |
| SYMPTOMS.functionalImpact | 440 | 483.5% |
| ATTENDANT_CARE.caregiverInfo | 439 | 482.4% |
| ATTENDANT_CARE.careNeeds | 439 | 482.4% |
| ATTENDANT_CARE.careHours | 439 | 482.4% |
| ATTENDANT_CARE.notes | 439 | 482.4% |
| SYMPTOMS.painLocation | 309 | 339.6% |
| SYMPTOMS.symptomOnset | 307 | 337.4% |
| ADLS.selfCare | 197 | 216.5% |
| ADLS.mobility | 197 | 216.5% |
| ADLS.instrumental | 197 | 216.5% |
| ADLS.adlNotes | 197 | 216.5% |
| MEDICAL_HISTORY.medicalNotes | 165 | 181.3% |
| SYMPTOMS.symptomProgression | 156 | 171.4% |
| TYPICAL_DAY.routineNotes | 140 | 153.8% |
| ENVIRONMENTAL.access | 121 | 133.0% |
| ENVIRONMENTAL.environmentalNotes | 121 | 133.0% |
| FUNCTIONAL_STATUS.safety | 111 | 122.0% |
| FUNCTIONAL_STATUS.notes | 111 | 122.0% |
| SYMPTOMS.painIntensity | 97 | 106.6% |
| SYMPTOMS.painDescription | 88 | 96.7% |
| SYMPTOMS.relievingFactors | 76 | 83.5% |
| SYMPTOMS.aggravatingFactors | 74 | 81.3% |
| TYPICAL_DAY.morningRoutine | 74 | 81.3% |
| DEMOGRAPHICS.name | 56 | 61.5% |
| DEMOGRAPHICS.insuranceInfo | 55 | 60.4% |
| DEMOGRAPHICS.address | 53 | 58.2% |
| FUNCTIONAL_STATUS.assistiveDevices | 49 | 53.8% |
| ENVIRONMENTAL.homeType | 47 | 51.6% |
| ENVIRONMENTAL.livingArrangement | 40 | 44.0% |
| ADLS.summary | 39 | 42.9% |
| ENVIRONMENTAL.homeLayout | 31 | 34.1% |
| FUNCTIONAL_STATUS.mobilityStatus | 29 | 31.9% |
| DEMOGRAPHICS.dob | 28 | 30.8% |
| DEMOGRAPHICS.phone | 26 | 28.6% |
| FUNCTIONAL_STATUS.functionalLimitations | 26 | 28.6% |
| TYPICAL_DAY.eveningRoutine | 26 | 28.6% |
| MEDICAL_HISTORY.diagnoses | 24 | 26.4% |
| MEDICAL_HISTORY.primaryDiagnosis | 23 | 25.3% |
| TYPICAL_DAY.afternoonRoutine | 21 | 23.1% |
| TYPICAL_DAY.nightRoutine | 20 | 22.0% |
| FUNCTIONAL_STATUS.endurance | 19 | 20.9% |
| FUNCTIONAL_STATUS.transferStatus | 15 | 16.5% |
| FUNCTIONAL_STATUS.balanceStatus | 6 | 6.6% |
| DEMOGRAPHICS.referralSource | 5 | 5.5% |
| MEDICAL_HISTORY.secondaryDiagnoses | 5 | 5.5% |
| DEMOGRAPHICS.gender | 3 | 3.3% |
| TYPICAL_DAY.dailyActivities | 1 | 1.1% |
| DEMOGRAPHICS.age | 0 | 0.0% |
| ENVIRONMENTAL.barriers | 0 | 0.0% |
| ENVIRONMENTAL.recommendations | 0 | 0.0% |
| ENVIRONMENTAL.safetyRisks | 0 | 0.0% |
| MEDICAL_HISTORY.conditions | 0 | 0.0% |
| MEDICAL_HISTORY.surgeries | 0 | 0.0% |
| MEDICAL_HISTORY.medications | 0 | 0.0% |
| MEDICAL_HISTORY.allergies | 0 | 0.0% |
| ATTENDANT_CARE.recommendations | 0 | 0.0% |
| ATTENDANT_CARE.currentServices | 0 | 0.0% |
| FUNCTIONAL_STATUS.functionalGoals | 0 | 0.0% |
| TYPICAL_DAY.weeklyActivities | 0 | 0.0% |
| TYPICAL_DAY.leisureActivities | 0 | 0.0% |
| ADLS.recommendations | 0 | 0.0% |

## Most Effective Patterns


## Recommendations

### Improve Pattern Recognition For:

- DEMOGRAPHICS
- SYMPTOMS
- ENVIRONMENTAL
- MEDICAL_HISTORY
- ATTENDANT_CARE
- FUNCTIONAL_STATUS
- TYPICAL_DAY
- ADLS

### Improve Data Extraction For:

- DEMOGRAPHICS.dob
- DEMOGRAPHICS.age
- DEMOGRAPHICS.gender
- DEMOGRAPHICS.phone
- DEMOGRAPHICS.referralSource
- ENVIRONMENTAL.livingArrangement
- ENVIRONMENTAL.homeLayout
- ENVIRONMENTAL.barriers
- ENVIRONMENTAL.recommendations
- ENVIRONMENTAL.safetyRisks
- ...and 23 more fields
