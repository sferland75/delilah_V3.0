import { combineReducers } from '@reduxjs/toolkit';
import assessmentReducer from './slices/assessmentSlice';
import uiReducer from './slices/uiSlice';

const rootReducer = combineReducers({
  assessments: assessmentReducer,
  ui: uiReducer
});

export default rootReducer;
