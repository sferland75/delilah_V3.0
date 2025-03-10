# Typical Day Section

## Quick Start
The Typical Day section allows documenting a patient's daily activities before and after an accident.

### Key Features
- Pre-accident and post-accident routine tabs
- Time-based activity documentation
- Sleep schedule information
- Support for irregular sleep patterns

## Irregular Sleep Schedule
We've added a direct UI for documenting irregular sleep schedules (shift work, inconsistent patterns, etc.).

### How to Use
```typescript
// To access irregular schedule information
const irregularDetails = watchForm(`typicalDay.${routineType}.sleepSchedule.irregularScheduleDetails`);
const hasIrregularSchedule = irregularDetails && irregularDetails.trim() !== '';

// To set irregular schedule
methods.setValue(
  `typicalDay.${routineType}.sleepSchedule.irregularScheduleDetails`, 
  "Patient works rotating shifts: 2 weeks day (7am-7pm), 2 weeks night (7pm-7am)"
);

// Clear regular schedule fields when irregular is set
methods.setValue(`typicalDay.${routineType}.sleepSchedule.wakeTime`, '');
methods.setValue(`typicalDay.${routineType}.sleepSchedule.bedTime`, '');
```

### Implementation Note
The feature is directly implemented in the main form without requiring separate components to avoid UI integration issues. See `IRREGULAR_SLEEP_DOCUMENTATION.md` for details.

## Development Tips
To modify the sleep schedule section, edit the alert/prompt section at the top of the form:

```jsx
<div className="mb-8 border p-4 rounded-md bg-blue-50">
  <div className="flex justify-between items-start mb-4">
    <div>
      <h3 className="text-lg font-semibold text-blue-800">Sleep Schedule</h3>
      <p className="text-sm text-blue-600">Enter times or mark as irregular</p>
    </div>
    <button 
      type="button"
      onClick={handleIrregularSchedule}
      className="px-3 py-1 bg-blue-600 text-white rounded-md flex items-center"
    >
      <Moon className="h-4 w-4 mr-2" />
      {hasIrregularSchedule ? "Edit Irregular" : "Add Irregular Schedule"}
    </button>
  </div>
  
  {/* Conditional rendering based on irregular schedule */}
  {hasIrregularSchedule ? (
    <div className="bg-amber-50 border-l-4 border-amber-400 p-3 mb-4">
      {/* Irregular schedule display */}
    </div>
  ) : (
    <div className="grid grid-cols-2 gap-4 mb-4">
      {/* Regular wake/bed time fields */}
    </div>
  )}
</div>
```

## Testing Prompts
To test if irregular sleep schedule is working properly, try these prompts:

1. **Simple shift work**: "Patient works night shift from 10pm to 6am"
2. **Rotating schedule**: "Rotating shifts: 2 weeks days, 2 weeks nights"
3. **On-call schedule**: "On-call physician with irregular sleep times"
4. **Insomnia pattern**: "Chronic insomnia with unpredictable sleep onset, typically 2-4am"
5. **Multiple jobs**: "Works two jobs with variable schedules between 6am-midnight"
