/**
 * Tests for the ReportDrafting component exports
 */

import * as ReportDrafting from '../index';

describe('ReportDrafting Component Exports', () => {
  test('should export all required components', () => {
    // Check that all components are exported
    expect(ReportDrafting).toHaveProperty('TemplateSelection');
    expect(ReportDrafting).toHaveProperty('ConfigureReport');
    expect(ReportDrafting).toHaveProperty('ReportPreview');
    expect(ReportDrafting).toHaveProperty('ExportReport');
  });
});
