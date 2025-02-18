jest.mock('@/hooks/useFormPersistence', () => ({
  useFormPersistence: () => ({
    persist: jest.fn(),
    loading: false,
    error: null
  })
}));

jest.mock('@/contexts/AssessmentContext', () => ({
  useAssessment: () => ({
    mode: 'edit',
    setMode: jest.fn()
  })
}));