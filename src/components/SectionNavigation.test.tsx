import { render, screen, fireEvent } from '@testing-library/react';
import { SectionNavigation, sections } from './SectionNavigation';
import { useRouter, usePathname } from 'next/navigation';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(),
}));

describe('SectionNavigation', () => {
  const mockRouter = {
    push: jest.fn(),
  };

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (usePathname as jest.Mock).mockReturnValue('/assessment/demographics');
  });

  it('renders all section buttons', () => {
    render(<SectionNavigation />);
    
    sections.forEach(section => {
      expect(screen.getByText(section.name)).toBeInTheDocument();
      expect(screen.getByText(section.id + '.')).toBeInTheDocument();
    });
  });

  it('highlights the current section', () => {
    render(<SectionNavigation />);
    
    const currentSection = sections[0]; // Demographics
    const currentButton = screen.getByText(currentSection.name).closest('button');
    
    expect(currentButton).toHaveClass('bg-accent');
  });

  it('navigates to the correct route when clicking a section', () => {
    render(<SectionNavigation />);
    
    const targetSection = sections[1]; // Purpose & Methodology
    fireEvent.click(screen.getByText(targetSection.name));
    
    expect(mockRouter.push).toHaveBeenCalledWith(targetSection.path);
  });
});