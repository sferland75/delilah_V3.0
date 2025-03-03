# Delilah V3.0 Route Mapping

This document provides a comprehensive mapping between App Router paths and their corresponding Pages Router implementations. This is part of our restoration strategy to ensure consistent routing and proper component utilization.

## App Router to Pages Router Mapping

| App Router Path | Pages Router Path | Component Source | Notes |
|-----------------|-------------------|------------------|-------|
| /assessment | /assessment | src/pages/assessment/index.tsx | Assessment dashboard |
| /assessment/initial | /full-assessment?section=initial | src/sections/1-InitialAssessment | Using section parameter |
| /assessment/symptoms | /full-assessment?section=symptoms | src/sections/4-SymptomsAssessment | Using section parameter |
| /assessment/medical | /full-assessment?section=medical | src/sections/3-MedicalHistory | Using section parameter |
| /assessment/purpose | /full-assessment?section=purpose | src/sections/2-PurposeAndMethodology | Using section parameter |
| /assessment/functional | /full-assessment?section=functional | src/sections/5-FunctionalStatus | Using section parameter |
| /assessment/typical-day | /full-assessment?section=typical-day | src/sections/6-TypicalDay | Using section parameter |
| /assessment/environment | /full-assessment?section=environment | src/sections/7-EnvironmentalAssessment | Using section parameter |
| /assessment/adl | /full-assessment?section=adl | src/sections/8-ActivitiesOfDailyLiving | Using section parameter |
| /assessment/attendant-care | /full-assessment?section=attendant-care | src/sections/9-AttendantCare | Using section parameter |
| /assessment/ama-guides | /full-assessment?section=ama-guides | src/sections/11-AMAGuidesAssessment | Using section parameter |
| /import-pdf | /import-pdf | src/pages/import-pdf.tsx | PDF import functionality |
| /report-drafting | /report-drafting | src/pages/report-drafting/index.tsx | Report drafting functionality |

## Direct Section Access Routes

For direct access to specific sections without loading the full assessment:

| Section | Direct Access Route |
|---------|---------------------|
| Symptoms Assessment | /emergency-symptoms |
| Medical History | /medical-full |
| Typical Day | /typical-day |
| All Sections Menu | /assessment-sections |

## Implementation Notes

1. All navigation should direct users to the Pages Router paths
2. The App Router paths should temporarily redirect to their corresponding Pages Router paths
3. No new implementations should be created in the App Router
4. All future development should enhance existing functionality in the Pages Router
