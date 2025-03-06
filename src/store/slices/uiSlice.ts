import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

interface UiState {
  toasts: ToastMessage[];
  currentSection: string;
  isLoading: boolean;
  activeDialogs: {
    confirmDelete: boolean;
    saveReminder: boolean;
    exportOptions: boolean;
  };
}

const initialState: UiState = {
  toasts: [],
  currentSection: 'initial',
  isLoading: false,
  activeDialogs: {
    confirmDelete: false,
    saveReminder: false,
    exportOptions: false
  }
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    addToast(state, action: PayloadAction<Omit<ToastMessage, 'id'>>) {
      const id = Date.now().toString();
      state.toasts.push({
        ...action.payload,
        id
      });
    },
    
    removeToast(state, action: PayloadAction<string>) {
      state.toasts = state.toasts.filter(toast => toast.id !== action.payload);
    },
    
    setCurrentSection(state, action: PayloadAction<string>) {
      state.currentSection = action.payload;
    },
    
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    
    setDialogState(state, action: PayloadAction<{dialog: keyof UiState['activeDialogs'], isOpen: boolean}>) {
      const { dialog, isOpen } = action.payload;
      state.activeDialogs[dialog] = isOpen;
    }
  }
});

export const {
  addToast,
  removeToast,
  setCurrentSection,
  setLoading,
  setDialogState
} = uiSlice.actions;

export default uiSlice.reducer;
