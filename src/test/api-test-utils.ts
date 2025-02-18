import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { Demographics } from '@/sections/1-DemographicsAndHeader/schema';

// Define API endpoints
const API_ENDPOINTS = {
  DEMOGRAPHICS: '/api/assessment/demographics',
  FORM_STATE: '/api/form-state',
  VALIDATION: '/api/validate'
};

// Mock responses
const mockResponses = {
  success: { status: 'success', message: 'Operation completed successfully' },
  error: { status: 'error', message: 'An error occurred' },
  validation: { status: 'error', errors: [] as string[] }
};

// Create MSW server
export const server = setupServer(
  // Demographics submission
  rest.post(API_ENDPOINTS.DEMOGRAPHICS, async (req, res, ctx) => {
    const body = await req.json();
    if (!body.firstName || !body.lastName) {
      return res(
        ctx.status(400),
        ctx.json({
          ...mockResponses.validation,
          errors: ['First name and last name are required']
        })
      );
    }
    return res(ctx.json(mockResponses.success));
  }),

  // Form state persistence
  rest.post(API_ENDPOINTS.FORM_STATE, async (req, res, ctx) => {
    return res(ctx.json(mockResponses.success));
  }),

  // Form state retrieval
  rest.get(API_ENDPOINTS.FORM_STATE, (req, res, ctx) => {
    return res(
      ctx.json({
        status: 'success',
        data: {
          firstName: 'John',
          lastName: 'Doe',
          dateOfBirth: '1990-01-01'
        }
      })
    );
  }),

  // Validation endpoint
  rest.post(API_ENDPOINTS.VALIDATION, async (req, res, ctx) => {
    const body = await req.json();
    const errors: string[] = [];
    
    if (!body.firstName) errors.push('First name is required');
    if (!body.lastName) errors.push('Last name is required');
    
    if (errors.length > 0) {
      return res(
        ctx.status(400),
        ctx.json({
          ...mockResponses.validation,
          errors
        })
      );
    }
    
    return res(ctx.json(mockResponses.success));
  })
);

// Helper functions for testing
export const apiTestUtils = {
  mockSuccessResponse: (endpoint: string, data: any) => {
    server.use(
      rest.post(endpoint, (req, res, ctx) => {
        return res(ctx.json({ status: 'success', data }));
      })
    );
  },

  mockErrorResponse: (endpoint: string, error: string, status = 400) => {
    server.use(
      rest.post(endpoint, (req, res, ctx) => {
        return res(
          ctx.status(status),
          ctx.json({ status: 'error', message: error })
        );
      })
    );
  },

  mockNetworkError: (endpoint: string) => {
    server.use(
      rest.post(endpoint, (req, res) => {
        return res.networkError('Failed to connect');
      })
    );
  },

  mockValidationError: (endpoint: string, errors: string[]) => {
    server.use(
      rest.post(endpoint, (req, res, ctx) => {
        return res(
          ctx.status(400),
          ctx.json({
            status: 'error',
            errors
          })
        );
      })
    );
  },

  // Helper for demographics data
  createMockDemographics: (overrides: Partial<Demographics> = {}): Demographics => ({
    firstName: 'John',
    lastName: 'Doe',
    dateOfBirth: '1990-01-01',
    gender: 'male',
    maritalStatus: 'single',
    contact: {
      phone: '(555) 555-5555',
      email: 'john.doe@example.com',
      address: '123 Main St'
    },
    insurance: {
      provider: 'Test Insurance',
      claimNumber: 'CLM123456',
      adjustorName: 'Jane Smith',
      adjustorPhone: '(555) 555-5556',
      adjustorEmail: 'jane.smith@insurance.com'
    },
    legalRep: {
      name: 'Bob Wilson',
      firm: 'Wilson Law',
      phone: '(555) 555-5557',
      email: 'bob@wilson.law',
      address: '456 Law St',
      fileNumber: 'FILE123'
    },
    ...overrides
  })
};

// Setup/teardown helpers
export const setupApiTests = () => {
  // Start MSW server before tests
  beforeAll(() => server.listen());
  
  // Reset handlers after each test
  afterEach(() => server.resetHandlers());
  
  // Close server after all tests
  afterAll(() => server.close());
};
