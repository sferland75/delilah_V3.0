import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { 
  saveAssessment, 
  loadAssessment, 
  getAllAssessments, 
  deleteAssessment, 
  createNewAssessment,
  updateAssessmentSection
} from '@/services/assessment-storage-service';

// Types
interface AssessmentSection {
  [key: string]: any;
}

export interface AssessmentData {
  demographics?: AssessmentSection;
  medicalHistory?: AssessmentSection;
  symptomsAssessment?: AssessmentSection;
  functionalStatus?: AssessmentSection;
  typicalDay?: AssessmentSection;
  environmentalAssessment?: AssessmentSection;
  activitiesDailyLiving?: AssessmentSection;
  attendantCare?: AssessmentSection;
  referral?: AssessmentSection;
  purposeAndMethodology?: AssessmentSection;
  metadata?: {
    id: string;
    created: string;
    lastSaved: string;
    assessmentDate?: string;
    title?: string;
  };
}

export interface AssessmentSummary {
  id: string;
  clientName: string;
  created: string;
  assessmentDate: string;
  lastSaved: string;
  data: AssessmentData;
}

interface AssessmentState {
  currentId: string | null;
  currentData: AssessmentData;
  assessmentList: AssessmentSummary[];
  loading: {
    current: 'idle' | 'loading' | 'succeeded' | 'failed';
    list: 'idle' | 'loading' | 'succeeded' | 'failed';
    save: 'idle' | 'loading' | 'succeeded' | 'failed';
  };
  error: {
    current: string | null;
    list: string | null;
    save: string | null;
  };
  hasUnsavedChanges: boolean;
}

// Initial state
const initialState: AssessmentState = {
  currentId: null,
  currentData: {},
  assessmentList: [],
  loading: {
    current: 'idle',
    list: 'idle',
    save: 'idle'
  },
  error: {
    current: null,
    list: null,
    save: null
  },
  hasUnsavedChanges: false
};

// Thunks
export const fetchAssessmentById = createAsyncThunk(
  'assessments/fetchById',
  async (id: string, { rejectWithValue }) => {
    try {
      const data = loadAssessment(id);
      if (!data) throw new Error(`Assessment with ID ${id} not found`);
      return { id, data };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchAllAssessments = createAsyncThunk(
  'assessments/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const assessments = getAllAssessments();
      return assessments;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const saveCurrentAssessmentThunk = createAsyncThunk(
  'assessments/saveCurrent',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { assessments: AssessmentState };
      const { currentId, currentData } = state.assessments;
      
      if (!currentId) throw new Error('No current assessment ID');
      
      // Ensure we have metadata with updated timestamp
      const assessmentToSave = {
        ...currentData,
        metadata: {
          ...(currentData.metadata || {}),
          id: currentId,
          lastSaved: new Date().toISOString(),
          assessmentDate: currentData.metadata?.assessmentDate || new Date().toISOString()
        }
      };
      
      // Update client name in metadata if demographics are available
      if (assessmentToSave.demographics?.personalInfo) {
        const firstName = assessmentToSave.demographics.personalInfo.firstName || '';
        const lastName = assessmentToSave.demographics.personalInfo.lastName || '';
        const clientName = `${lastName}, ${firstName}`.trim();
        
        if (clientName !== ',') {
          assessmentToSave.metadata.title = clientName;
        }
      }
      
      const success = saveAssessment(currentId, assessmentToSave);
      
      if (!success) throw new Error('Failed to save assessment');
      
      return { id: currentId, data: assessmentToSave };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateSectionThunk = createAsyncThunk(
  'assessments/updateSection',
  async ({ sectionName, sectionData }: { sectionName: string, sectionData: any }, 
         { getState, dispatch }) => {
    const state = getState() as { assessments: AssessmentState };
    const { currentId } = state.assessments;
    
    if (!currentId) throw new Error('No current assessment ID');
    
    try {
      // First update in the Redux store
      dispatch(assessmentSlice.actions.updateSection({ section: sectionName, data: sectionData }));
      
      // Then persist to storage
      updateAssessmentSection(currentId, sectionName, sectionData);
      
      return { section: sectionName, data: sectionData };
    } catch (error: any) {
      throw new Error(`Failed to update section ${sectionName}: ${error.message}`);
    }
  }
);

export const createNewAssessmentThunk = createAsyncThunk(
  'assessments/createNew',
  async (_, { rejectWithValue }) => {
    try {
      const newId = createNewAssessment();
      const initialData = {
        metadata: {
          id: newId,
          created: new Date().toISOString(),
          lastSaved: new Date().toISOString(),
          assessmentDate: new Date().toISOString()
        }
      };
      
      return { id: newId, data: initialData };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteAssessmentThunk = createAsyncThunk(
  'assessments/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      const success = deleteAssessment(id);
      if (!success) throw new Error(`Failed to delete assessment with ID ${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Slice
const assessmentSlice = createSlice({
  name: 'assessments',
  initialState,
  reducers: {
    updateSection(state, action: PayloadAction<{section: string, data: any}>) {
      const { section, data } = action.payload;
      state.currentData = {
        ...state.currentData,
        [section]: data
      };
      state.hasUnsavedChanges = true;
    },
    setCurrentAssessment(state, action: PayloadAction<string>) {
      state.currentId = action.payload;
    },
    clearCurrentAssessment(state) {
      state.currentId = null;
      state.currentData = {};
      state.hasUnsavedChanges = false;
    },
    resetUnsavedChanges(state) {
      state.hasUnsavedChanges = false;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch assessment by ID
      .addCase(fetchAssessmentById.pending, (state) => {
        state.loading.current = 'loading';
        state.error.current = null;
      })
      .addCase(fetchAssessmentById.fulfilled, (state, action) => {
        state.loading.current = 'succeeded';
        state.currentId = action.payload.id;
        state.currentData = action.payload.data;
        state.hasUnsavedChanges = false;
      })
      .addCase(fetchAssessmentById.rejected, (state, action) => {
        state.loading.current = 'failed';
        state.error.current = action.payload as string;
      })
      
      // Fetch all assessments
      .addCase(fetchAllAssessments.pending, (state) => {
        state.loading.list = 'loading';
        state.error.list = null;
      })
      .addCase(fetchAllAssessments.fulfilled, (state, action) => {
        state.loading.list = 'succeeded';
        state.assessmentList = action.payload;
      })
      .addCase(fetchAllAssessments.rejected, (state, action) => {
        state.loading.list = 'failed';
        state.error.list = action.payload as string;
      })
      
      // Save current assessment
      .addCase(saveCurrentAssessmentThunk.pending, (state) => {
        state.loading.save = 'loading';
        state.error.save = null;
      })
      .addCase(saveCurrentAssessmentThunk.fulfilled, (state, action) => {
        state.loading.save = 'succeeded';
        state.currentData = action.payload.data;
        state.hasUnsavedChanges = false;
        
        // Update the assessment in the list
        const index = state.assessmentList.findIndex(a => a.id === action.payload.id);
        if (index !== -1) {
          state.assessmentList[index] = {
            ...state.assessmentList[index],
            lastSaved: new Date().toISOString(),
            data: action.payload.data,
            clientName: getClientNameFromData(action.payload.data)
          };
        }
      })
      .addCase(saveCurrentAssessmentThunk.rejected, (state, action) => {
        state.loading.save = 'failed';
        state.error.save = action.payload as string;
      })
      
      // Create new assessment
      .addCase(createNewAssessmentThunk.fulfilled, (state, action) => {
        state.currentId = action.payload.id;
        state.currentData = action.payload.data;
        state.hasUnsavedChanges = false;
        
        // Add to assessment list
        state.assessmentList.push({
          id: action.payload.id,
          clientName: 'Untitled',
          created: action.payload.data.metadata?.created || new Date().toISOString(),
          lastSaved: action.payload.data.metadata?.lastSaved || new Date().toISOString(),
          assessmentDate: action.payload.data.metadata?.assessmentDate || new Date().toISOString(),
          data: action.payload.data
        });
      })
      
      // Delete assessment
      .addCase(deleteAssessmentThunk.fulfilled, (state, action) => {
        // Remove from list
        state.assessmentList = state.assessmentList.filter(a => a.id !== action.payload);
        
        // Clear current assessment if it's the one being deleted
        if (state.currentId === action.payload) {
          state.currentId = null;
          state.currentData = {};
          state.hasUnsavedChanges = false;
        }
      });
  }
});

// Helper function to extract client name from assessment data
function getClientNameFromData(data: AssessmentData): string {
  if (data.demographics?.personalInfo) {
    const firstName = data.demographics.personalInfo.firstName || '';
    const lastName = data.demographics.personalInfo.lastName || '';
    const clientName = `${lastName}, ${firstName}`.trim();
    
    if (clientName !== ',') {
      return clientName;
    }
  }
  
  return 'Untitled';
}

// Export actions and reducer
export const { 
  updateSection, 
  setCurrentAssessment, 
  clearCurrentAssessment,
  resetUnsavedChanges
} = assessmentSlice.actions;

export default assessmentSlice.reducer;
