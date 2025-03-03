import { TypicalDayFormData } from '../../types';

export const generateMockTypicalDayData = (): TypicalDayFormData => ({
  typicalDay: {
    preAccident: {
      dailyRoutine: {
        morning: [],
        afternoon: [],
        evening: [],
        night: []
      }
    },
    postAccident: {
      dailyRoutine: {
        morning: [],
        afternoon: [],
        evening: [],
        night: []
      }
    }
  }
});