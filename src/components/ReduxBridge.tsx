import React, { useEffect } from 'react';
import { useAssessment } from '@/contexts/AssessmentContext';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { 
  setCurrentAssessment, 
  updateSection,
  saveCurrentAssessmentThunk,
  fetchAssessmentById,
  fetchAllAssessments
} from '@/store/slices/assessmentSlice';

/**
 * Bridge component to sync data between the Context API and Redux
 * during the transition period.
 */
export const ReduxBridge: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const contextAssessment = useAssessment();
  const dispatch = useAppDispatch();
  const currentId = useAppSelector(state => state.assessments.currentId);
  
  // Sync context data to Redux on initial load
  useEffect(() => {
    if (contextAssessment.currentAssessmentId && !currentId) {
      console.log('[ReduxBridge] Syncing initial assessment ID:', contextAssessment.currentAssessmentId);
      dispatch(setCurrentAssessment(contextAssessment.currentAssessmentId));
      dispatch(fetchAssessmentById(contextAssessment.currentAssessmentId));
    }
  }, [contextAssessment.currentAssessmentId, currentId, dispatch]);
  
  // Sync context data changes to Redux
  useEffect(() => {
    if (contextAssessment.data && Object.keys(contextAssessment.data).length > 0) {
      console.log('[ReduxBridge] Syncing assessment data to Redux');
      
      // Sync each section individually
      Object.entries(contextAssessment.data).forEach(([section, data]) => {
        if (section !== 'metadata') { // Skip metadata as it's handled differently
          dispatch(updateSection({ section, data }));
        }
      });
      
      // Sync metadata separately if it exists
      if (contextAssessment.data.metadata) {
        dispatch(updateSection({ 
          section: 'metadata', 
          data: contextAssessment.data.metadata 
        }));
      }
    }
  }, [contextAssessment.data, dispatch]);
  
  // Load all assessments on mount
  useEffect(() => {
    console.log('[ReduxBridge] Loading all assessments');
    dispatch(fetchAllAssessments());
  }, [dispatch]);
  
  return <>{children}</>;
};

export default ReduxBridge;
