# Irregular Sleep Schedule Feature Documentation

## Overview
We've added support for irregular sleep schedules in the Typical Day assessment section to accommodate patients with non-standard sleep patterns (shift workers, variable schedules, etc.).

## Implementation Details

### Data Structure
The `sleepSchedule` object now includes an `irregularScheduleDetails` field:

```typescript
interface SleepScheduleData {
  wakeTime?: string;
  bedTime?: string;
  sleepQuality?: string;
  irregularScheduleDetails?: string; // New field for irregular schedules
}
```

### User Interface
A direct approach is implemented at the top of each tab (pre/post-accident):

1. Button labeled "Add Irregular Schedule"
2. When clicked, opens a prompt to enter details
3. Displays entered details in a highlighted notification box
4. Regular wake/bed time fields are hidden when irregular schedule is active
5. Sleep quality field remains available for all patients

### Context Integration
- Data is properly saved to assessment context
- Wake/bed time fields are cleared when irregular schedule is active
- Irregular schedule details are preserved between sessions

### Backward Compatibility
The implementation maintains compatibility with existing data:
- Pre-existing wake/bed times continue to work
- Old records without irregular schedule support display normally
- Data export properly handles both formats

## How to Use
To mark a sleep schedule as irregular:
1. Click "Add Irregular Schedule" button at top of sleep section
2. Enter details in the prompt (shift patterns, variable schedules, etc.)
3. Details will display in amber notification box
4. Sleep quality can still be documented separately

To clear irregular schedule:
1. Click "Edit Irregular Schedule" button
2. Confirm deletion when prompted
3. Regular wake/bed time fields will reappear

## Developer Notes
- The implementation is in the main form, not requiring separate components
- We use standard browser prompts for simplicity
- Changes are tracked and saved with existing form persistence

## Future Enhancements
- Replace browser prompts with custom modals
- Add structured fields for common irregular patterns
- Support multiple irregular schedules
- Improve validation for schedule details
