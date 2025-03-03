import { CascadeTestConfig } from '../../../../test/cascade/CascadeTestRunner';
import { SymptomsStateManager } from '../../../../test/cascade/StateManager';
import { act } from '@testing-library/react';
import { useRouter } from 'next/navigation';

const stateManager = new SymptomsStateManager();

// Helper to mock router navigation
const mockNavigation = async (path: string) => {
  await act(async () => {
    const router = useRouter();
    router.push(path);
  });
};

export const symptomsConfig: CascadeTestConfig = {
  workflow: {
    steps: [
      {
        name: 'cognitive',
        recoveryPoint: async () => {
          await mockNavigation('/assessment/symptoms/physical');
        },
        stateValidation: async () => {
          const state = await stateManager.load('cognitive');
          return state?.selectedSymptoms?.length > 0;
        },
        requiredForNext: false
      },
      {
        name: 'physical',
        dependencies: ['cognitive'],
        recoveryPoint: async () => {
          await mockNavigation('/assessment/symptoms/emotional');
        },
        stateValidation: async () => {
          const state = await stateManager.load('physical');
          return state?.locations?.length > 0;
        },
        requiredForNext: true
      },
      {
        name: 'emotional',
        dependencies: ['physical'],
        stateValidation: async () => {
          const state = await stateManager.load('emotional');
          return typeof state?.intensity === 'number';
        },
        requiredForNext: false
      }
    ],
    fallbackStrategy: 'skip'
  }
};
