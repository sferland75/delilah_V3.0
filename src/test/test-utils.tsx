import React from 'react'
import { render as defaultRender } from '@testing-library/react'
import { FormProvider, useForm } from 'react-hook-form'
import { AssessmentProvider } from '@/contexts/AssessmentContext'

// Custom render for components that need form context
export function renderWithForm(ui: React.ReactElement) {
  function Wrapper({ children }: { children: React.ReactNode }) {
    const methods = useForm()
    return <FormProvider {...methods}>{children}</FormProvider>
  }
  return defaultRender(ui, { wrapper: Wrapper })
}

// Custom render for components that need assessment context
export function renderWithAssessment(ui: React.ReactElement) {
  return defaultRender(ui, { wrapper: AssessmentProvider })
}

// Custom render for components that need both form and assessment context
export function renderWithFormAndAssessment(ui: React.ReactElement) {
  function Wrapper({ children }: { children: React.ReactNode }) {
    const methods = useForm()
    return (
      <AssessmentProvider>
        <FormProvider {...methods}>{children}</FormProvider>
      </AssessmentProvider>
    )
  }
  return defaultRender(ui, { wrapper: Wrapper })
}

// Mock data generators
export const mockDemographicsData = {
  firstName: 'John',
  lastName: 'Doe',
  dateOfBirth: '1990-01-01',
  gender: 'male',
  phone: '(555) 555-5555',
  email: 'john.doe@example.com',
  address: '123 Main St',
  insuranceProvider: 'Test Insurance',
  claimNumber: 'CLM123456',
  adjustorName: 'Jane Smith',
  adjustorPhone: '(555) 555-5556',
}

// Mock event handlers
export const mockHandlers = {
  onSubmit: jest.fn(),
  onChange: jest.fn(),
  onBlur: jest.fn(),
  onClick: jest.fn(),
}

// Mock API responses
export const mockApiResponses = {
  claudeSuccess: {
    content: 'Generated content from Claude',
    error: undefined,
    cached: false,
  },
  claudeError: {
    content: '',
    error: 'An error occurred',
    cached: false,
  },
}