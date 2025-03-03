import React from 'react';
import { render, screen } from '../tests/utils';
import { Display } from './Display';
import { mockMedicalHistory } from '../tests/utils';

describe('Display Component', () => {
  it('renders all sections', () => {
    render(<Display />, {
      formValues: { data: mockMedicalHistory }
    });

    // Verify pre-existing conditions
    expect(screen.getByText(/hypertension/i)).toBeInTheDocument();
    expect(screen.getByText(/controlled with medication/i)).toBeInTheDocument();

    // Verify injury details
    expect(screen.getByText(/slip and fall/i)).toBeInTheDocument();
    expect(screen.getByText(/back pain/i)).toBeInTheDocument();

    // Verify treatments
    expect(screen.getByText(/physical therapy/i)).toBeInTheDocument();
    expect(screen.getByText(/making good progress/i)).toBeInTheDocument();

    // Verify medications
    expect(screen.getByText(/ibuprofen/i)).toBeInTheDocument();
    expect(screen.getByText(/800mg/i)).toBeInTheDocument();
  });

  it('displays pre-existing conditions correctly', () => {
    render(<Display />, {
      formValues: { data: mockMedicalHistory }
    });

    const preText = screen.getByText(/hypertension.*managed.*controlled with medication/i);
    expect(preText).toBeInTheDocument();
  });

  it('displays injury details correctly', () => {
    render(<Display />, {
      formValues: { data: mockMedicalHistory }
    });

    const injuryText = screen.getByText(/slip and fall.*workplace injury.*back pain.*right leg numbness/is);
    expect(injuryText).toBeInTheDocument();
  });

  it('displays treatments correctly', () => {
    render(<Display />, {
      formValues: { data: mockMedicalHistory }
    });

    const treatmentText = screen.getByText(/physical therapy.*dr\. smith.*2x per week.*making good progress/is);
    expect(treatmentText).toBeInTheDocument();
  });

  it('displays medications correctly', () => {
    render(<Display />, {
      formValues: { data: mockMedicalHistory }
    });

    const medText = screen.getByText(/ibuprofen.*800mg.*as needed.*pain management/is);
    expect(medText).toBeInTheDocument();
  });

  it('handles empty data gracefully', () => {
    render(<Display />, {
      formValues: {
        data: {
          preExistingConditions: [],
          surgeries: [],
          familyHistory: '',
          allergies: [],
          injury: null,
          currentMedications: [],
          currentTreatments: []
        }
      }
    });

    expect(screen.getByText(/no pre-existing conditions/i)).toBeInTheDocument();
    expect(screen.getByText(/no current medications/i)).toBeInTheDocument();
    expect(screen.getByText(/no current treatments/i)).toBeInTheDocument();
  });

  it('handles missing injury data gracefully', () => {
    const dataWithoutInjury = { ...mockMedicalHistory };
    delete dataWithoutInjury.injury;

    render(<Display />, {
      formValues: { data: dataWithoutInjury }
    });

    expect(screen.queryByText(/slip and fall/i)).not.toBeInTheDocument();
    expect(screen.getByText(/no injury details/i)).toBeInTheDocument();
  });

  it('handles missing fields in injury data', () => {
    const incompleteData = {
      ...mockMedicalHistory,
      injury: {
        date: '2023-12-01',
        impactType: 'Slip and fall'
        // Other fields missing
      }
    };

    render(<Display />, {
      formValues: { data: incompleteData }
    });

    expect(screen.getByText(/slip and fall/i)).toBeInTheDocument();
    expect(screen.getByText(/2023-12-01/i)).toBeInTheDocument();
    // Check that missing fields don't cause errors
    expect(screen.queryByText(/undefined/i)).not.toBeInTheDocument();
  });
});