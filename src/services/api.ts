import { SymptomsFormState } from '../sections/3-SymptomsAssessment/types';

export const enhanceSymptoms = async (symptoms: SymptomsFormState) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        ...symptoms,
        enhanced: true
      });
    }, 500);
  });
};

export const validateSymptoms = async (symptoms: SymptomsFormState) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        valid: true,
        errors: []
      });
    }, 300);
  });
};

export const analyzeConcurrency = async (symptoms: SymptomsFormState) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        analyzed: true,
        metrics: {
          responseTime: Math.random() * 100,
          concurrent: true
        }
      });
    }, 600);
  });
};