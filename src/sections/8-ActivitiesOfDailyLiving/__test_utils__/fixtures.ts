import type { ADLData } from '../types';

export const mockADLData: ADLData = {
  basic: {
    bathing: {
      shower: { independence: 'independent', notes: 'No issues' },
      grooming: { independence: 'modified_independent', notes: 'Uses adaptive equipment' },
      oral_care: { independence: 'independent', notes: '' },
      toileting: { independence: 'independent', notes: '' }
    },
    dressing: {
      upper_body: { independence: 'independent', notes: '' },
      lower_body: { independence: 'minimal_assistance', notes: 'Some difficulty with socks' },
      footwear: { independence: 'minimal_assistance', notes: 'Uses long-handled shoe horn' }
    },
    feeding: {
      eating: { independence: 'independent', notes: '' },
      setup: { independence: 'independent', notes: '' },
      drinking: { independence: 'independent', notes: '' }
    },
    transfers: {
      bed_transfer: { independence: 'supervision', notes: 'Needs standby assistance' },
      toilet_transfer: { independence: 'supervision', notes: '' },
      shower_transfer: { independence: 'minimal_assistance', notes: 'Uses grab bars' },
      position_changes: { independence: 'supervision', notes: '' }
    }
  },
  iadl: {
    household: {
      cleaning: { independence: 'moderate_assistance', notes: 'Limited by endurance' },
      laundry: { independence: 'minimal_assistance', notes: '' },
      meal_prep: { independence: 'modified_independent', notes: 'Uses adapted equipment' },
      home_maintenance: { independence: 'maximal_assistance', notes: 'Unable to do heavy tasks' }
    },
    community: {
      transportation: { independence: 'modified_independent', notes: 'Uses accessible transit' },
      shopping: { independence: 'minimal_assistance', notes: 'Online shopping preferred' },
      money_management: { independence: 'independent', notes: '' },
      communication: { independence: 'independent', notes: '' }
    }
  },
  health: {
    management: {
      medications: { independence: 'modified_independent', notes: 'Uses pill organizer' },
      appointments: { independence: 'independent', notes: '' },
      monitoring: { independence: 'independent', notes: '' },
      exercise: { independence: 'supervision', notes: 'Has home exercise program' }
    },
    routine: {
      sleep: { independence: 'independent', notes: '' },
      stress: { independence: 'independent', notes: '' },
      nutrition: { independence: 'independent', notes: '' }
    }
  },
  work: {
    status: {
      current_status: { independence: 'modified_independent', notes: 'Working with accommodations' },
      workplace_accommodations: { independence: 'minimal_assistance', notes: 'Ergonomic setup needed' },
      training_needs: { independence: 'independent', notes: '' },
      barriers: { independence: 'not_applicable', notes: 'No significant barriers identified' }
    }
  }
};