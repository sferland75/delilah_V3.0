/**
 * PDF Pattern Matchers Index
 * 
 * This file exports all pattern matchers used by the PDF processing service.
 */

import { PatternMatcher } from '../pdfInterfaces';
import { getDemographicsMatcher } from './demographicsMatcher';
import { getMedicalHistoryMatcher } from './medicalHistoryMatcher';
import { getPurposeMatcher, getMethodologyMatcher } from './purposeMatcher';
import { getSymptomsMatcher } from './symptomsMatcher';
import { getFunctionalStatusMatcher } from './functionalStatusMatcher';
import { getTypicalDayMatcher } from './typicalDayMatcher';
import { getEnvironmentMatcher } from './environmentMatcher';
import { getADLsMatcher } from './adlsMatcher';
import { getAttendantCareMatcher } from './attendantCareMatcher';

/**
 * Get all pattern matchers for different sections of the assessment
 * @returns Array of pattern matchers
 */
export function getAllPatternMatchers(): PatternMatcher[] {
  return [
    getDemographicsMatcher(),
    getMedicalHistoryMatcher(),
    getPurposeMatcher(),
    getMethodologyMatcher(),
    getSymptomsMatcher(),
    getFunctionalStatusMatcher(),
    getTypicalDayMatcher(),
    getEnvironmentMatcher(),
    getADLsMatcher(),
    getAttendantCareMatcher()
  ];
}
