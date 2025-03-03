import { SymptomsFormState } from '../types';

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