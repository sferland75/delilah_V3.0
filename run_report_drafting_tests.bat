@echo off
echo Running Report Drafting Module Tests...
echo.
echo ==============================================
echo Integration Tests for Report Drafting Module
echo ==============================================
echo.

npm test -- src/components/ReportDrafting/__tests__/integration/ReportDraftingFlow.test.tsx --verbose

echo.
echo ==============================================
echo Component Tests for Report Drafting Module
echo ==============================================
echo.

npm test -- src/components/ReportDrafting/__tests__/TemplateSelection.test.tsx src/components/ReportDrafting/__tests__/TemplateManagement.test.tsx src/components/ReportDrafting/__tests__/ConfigureReport.test.tsx src/components/ReportDrafting/__tests__/ReportPreview.test.tsx src/components/ReportDrafting/__tests__/ExportReport.test.tsx --verbose

echo.
echo ==============================================
echo Context Tests for Report Drafting Module
echo ==============================================
echo.

npm test -- src/contexts/ReportDrafting/__tests__/ReportDraftingContext.test.tsx --verbose

echo.
echo Testing complete!
