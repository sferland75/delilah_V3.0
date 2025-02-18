import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { InjuriesSection } from './InjuriesSection';
import './__mocks__/setup';

// Import test utilities
import { renderWithForm } from '@/test/test-utils';

const mockSubmit = jest.fn();

describe('InjuriesSection', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders initial form elements', () => {
    renderWithForm(<InjuriesSection />);
    expect(screen.getByText(/date of injury/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add injury/i })).toBeInTheDocument();
  });

  it('validates required fields', () => {
    renderWithForm(<InjuriesSection />);
    const dateInput = screen.getByLabelText(/date of injury/i);
    expect(dateInput).toBeRequired();
  });
});