import React from 'react';
import { render, screen } from './test-utils';
import { FormState } from '../../types';
import { defaultFormState } from '../../schema';

const TestComponent = () => (
  <div>Test Component</div>
);

describe('Test Utilities', () => {
  describe('Custom Render', () => {
    it('renders components with form context', () => {
      render(<TestComponent />);
      expect(screen.getByText('Test Component')).toBeInTheDocument();
    });

    it('accepts initial values', () => {
      const formRef = React.createRef<any>();
      render(<TestComponent />, { 
        formRef,
        initialValues: {
          config: { mode: 'view', activeTab: 'mmt' }
        }
      });
      
      expect(formRef.current?.getValues('config.mode')).toBe('view');
      expect(formRef.current?.getValues('config.activeTab')).toBe('mmt');
    });
  });

  describe('Mock Data', () => {
    const mockData: FormState = {
      config: {
        mode: 'edit',
        activeTab: 'rom'
      },
      data: {
        posturalTolerances: {
          sitting: { duration: '45', unit: 'minutes', notes: 'Test' },
          standing: { duration: '30', unit: 'minutes', notes: 'Test' }
        },
        transfers: {
          bedMobility: { independence: 'modified', notes: 'Test' },
          toileting: { independence: 'supervised', notes: 'Test' }
        },
        rangeOfMotion: defaultFormState.data.rangeOfMotion,
        manualMuscle: defaultFormState.data.manualMuscle,
        bergBalance: defaultFormState.data.bergBalance
      }
    };

    it('provides valid posturalTolerances data', () => {
      expect(mockData.data.posturalTolerances).toHaveProperty('sitting');
      expect(mockData.data.posturalTolerances).toHaveProperty('standing');
    });

    it('provides valid transfers data', () => {
      expect(mockData.data.transfers).toHaveProperty('bedMobility');
      expect(mockData.data.transfers).toHaveProperty('toileting');
    });

    it('provides valid range of motion data', () => {
      expect(mockData.data.rangeOfMotion).toHaveProperty('cervical');
      expect(mockData.data.rangeOfMotion).toHaveProperty('lumbar');
    });

    it('provides valid manual muscle data', () => {
      expect(mockData.data.manualMuscle).toHaveProperty('upperExtremity');
      expect(mockData.data.manualMuscle).toHaveProperty('lowerExtremity');
    });

    it('provides valid berg balance data', () => {
      expect(mockData.data.bergBalance).toHaveProperty('sittingToStanding');
      expect(mockData.data.bergBalance).toHaveProperty('standingUnsupported');
    });
  });
});