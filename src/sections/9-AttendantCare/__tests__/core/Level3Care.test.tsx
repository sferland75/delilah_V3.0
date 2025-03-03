import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import { Level3Care } from '../../components/Level3Care';
import { renderWithForm, createTestActivity } from '../utils/test-utils';
import { careCategories } from '../../constants';

describe('Level3Care Core Functionality', () => {
  it('renders basic structure correctly', () => {
    renderWithForm(<Level3Care />);

    // Check for level title and description
    expect(screen.getByText('Level 3 Attendant Care')).toBeInTheDocument();
    expect(screen.getByText(/Level 3 attendant care is for complex health\/care and hygiene functions/)).toBeInTheDocument();

    // Check all category headers are present
    Object.values(careCategories.level3).forEach(category => {
      expect(screen.getByText(category.title)).toBeInTheDocument();
    });
  });

  it('handles complex care specific activities', async () => {
    const { user } = renderWithForm(<Level3Care />);

    // Expand complex care category
    const categoryTitle = Object.values(careCategories.level3)[0].title;
    await user.click(screen.getByText(categoryTitle));

    // Check specific complex care activities
    const complexActivities = careCategories.level3.complexCare.items;
    complexActivities.forEach(activity => {
      expect(screen.getByText(activity.title)).toBeVisible();
      expect(screen.getByText(activity.description)).toBeVisible();
    });
  });

  it('handles detailed notes for complex care', async () => {
    const { user } = renderWithForm(<Level3Care />);

    // Expand complex care category
    const categoryTitle = Object.values(careCategories.level3)[0].title;
    await user.click(screen.getByText(categoryTitle));

    // Enter detailed notes for wound care
    const notesInputs = screen.getAllByPlaceholderText(/Enter details about assistance/i);
    const detailedNote = 'Wound requires daily cleaning and dressing change. Use sterile technique.';
    
    await user.type(notesInputs[0], detailedNote);
    
    expect(notesInputs[0]).toHaveValue(detailedNote);
  });

  it('calculates complex care time requirements', async () => {
    const { user } = renderWithForm(<Level3Care />);

    // Expand complex care category
    const categoryTitle = Object.values(careCategories.level3)[0].title;
    await user.click(screen.getByText(categoryTitle));

    // Enter time requirements for first activity
    const minutesInput = screen.getAllByLabelText(/Minutes per Activity/i)[0];
    const timesInput = screen.getAllByLabelText(/Times per Week/i)[0];

    await user.type(minutesInput, '45');  // Complex care often requires more time
    await user.type(timesInput, '14');    // Twice daily

    // Check total calculation (45 mins × 14 times = 630 mins per week)
    await waitFor(() => {
      expect(screen.getByText('630')).toBeInTheDocument();
    });
  });

  it('loads complex care initial values', async () => {
    const initialData = {
      level3: {
        complexCare: {
          woundCare: createTestActivity(45, 14, 'Requires sterile technique'),
          catheter: createTestActivity(30, 21, 'Three times daily care')
        }
      }
    };

    renderWithForm(<Level3Care />, initialData);

    // Expand complex care category
    const categoryTitle = Object.values(careCategories.level3)[0].title;
    await screen.getByText(categoryTitle).click();

    await waitFor(() => {
      // Check wound care values
      const minutesInputs = screen.getAllByLabelText(/Minutes per Activity/i);
      const timesInputs = screen.getAllByLabelText(/Times per Week/i);
      const notes = screen.getAllByPlaceholderText(/Enter details about assistance/i);

      expect(minutesInputs[0]).toHaveValue(45);
      expect(timesInputs[0]).toHaveValue(14);
      expect(notes[0]).toHaveValue('Requires sterile technique');

      // Check catheter care values
      expect(minutesInputs[1]).toHaveValue(30);
      expect(timesInputs[1]).toHaveValue(21);
      expect(notes[1]).toHaveValue('Three times daily care');
    });
  });

  it('maintains complex care state across category toggles', async () => {
    const { user } = renderWithForm(<Level3Care />);

    // Expand complex care category
    const categoryTitle = Object.values(careCategories.level3)[0].title;
    await user.click(screen.getByText(categoryTitle));

    // Enter data for wound care
    const minutesInput = screen.getAllByLabelText(/Minutes per Activity/i)[0];
    const timesInput = screen.getAllByLabelText(/Times per Week/i)[0];
    const notesInput = screen.getAllByPlaceholderText(/Enter details about assistance/i)[0];

    await user.type(minutesInput, '45');
    await user.type(timesInput, '14');
    await user.type(notesInput, 'Complex wound care procedure');

    // Collapse and re-expand category
    await user.click(screen.getByText(categoryTitle));
    await user.click(screen.getByText(categoryTitle));

    // Verify data persists
    await waitFor(() => {
      expect(minutesInput).toHaveValue(45);
      expect(timesInput).toHaveValue(14);
      expect(notesInput).toHaveValue('Complex wound care procedure');
      expect(screen.getByText('630')).toBeInTheDocument();
    });
  });

  it('validates complex care time requirements', async () => {
    const { user } = renderWithForm(<Level3Care />);

    // Expand complex care category
    const categoryTitle = Object.values(careCategories.level3)[0].title;
    await user.click(screen.getByText(categoryTitle));

    const minutesInput = screen.getAllByLabelText(/Minutes per Activity/i)[0];
    const timesInput = screen.getAllByLabelText(/Times per Week/i)[0];

    // Test reasonable maximum values for complex care
    await user.type(minutesInput, '120'); // 2 hours per session
    await user.type(timesInput, '21');    // 3 times per day

    await waitFor(() => {
      expect(minutesInput).toHaveValue(120);
      expect(timesInput).toHaveValue(21);
    });

    // Test unreasonable values
    await user.clear(minutesInput);
    await user.type(minutesInput, '1000'); // Unreasonably long session

    await waitFor(() => {
      expect(minutesInput).not.toHaveValue(1000);
    });
  });
});