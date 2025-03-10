import '../src/styles/globals.css';
import { AssessmentProvider } from '../src/contexts/AssessmentContext';
import { EnhancedAssessmentProvider } from '../src/contexts/EnhancedAssessmentContext';
import { Provider } from 'react-redux';
import { store, persistor } from '../src/store';
import { PersistGate } from 'redux-persist/integration/react';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import the FieldTestPanel to prevent SSR issues
const FieldTestPanel = dynamic(
  () => import('../src/components/FieldTestPanel'),
  { ssr: false }
);

function MyApp({ Component, pageProps }) {
  const [fieldTestEnabled, setFieldTestEnabled] = useState(false);
  const [showPanel, setShowPanel] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Check if field testing is enabled via env var or localStorage
      const isFieldTestMode = 
        process.env.NEXT_PUBLIC_FIELD_TRIAL === 'true' || 
        localStorage.getItem('field_test_mode') === 'true';
      
      setFieldTestEnabled(isFieldTestMode);
      
      if (isFieldTestMode) {
        // Create field test indicator
        const testElement = document.createElement('div');
        testElement.id = "field-test-indicator";
        testElement.innerHTML = `
          <div style="
            position: fixed;
            top: 10px;
            right: 10px;
            background-color: #f44336;
            color: white;
            padding: 10px;
            border-radius: 5px;
            z-index: 9999;
            font-weight: bold;
            box-shadow: 0 2px 10px rgba(0,0,0,0.5);
            cursor: pointer;
          ">
            FIELD TESTING MODE ACTIVE
          </div>
        `;
        document.body.appendChild(testElement);
        
        // Make indicator toggle the panel when clicked
        testElement.onclick = () => {
          setShowPanel(prev => !prev);
        };
        
        // Initialize field test service
        try {
          const fieldTestService = require('../src/services/field-test-service');
          fieldTestService.initFieldTestService();
          
          // Add field testing global methods
          window.fieldTesting = {
            togglePanel: () => setShowPanel(prev => !prev),
            getBackups: (assessmentId) => {
              if (assessmentId) {
                return fieldTestService.getBackups(assessmentId);
              } else {
                const state = store.getState();
                return fieldTestService.getBackups(state.assessments.currentId);
              }
            },
            createBackup: () => {
              const state = store.getState();
              if (state.assessments.currentId) {
                try {
                  const backupKey = fieldTestService.createBackup(
                    state.assessments.currentId, 
                    state.assessments.currentData
                  );
                  alert('Backup created successfully!');
                  console.log('Backup created with key:', backupKey);
                  return true;
                } catch (error) {
                  console.error('Failed to create backup:', error);
                  alert('Failed to create backup');
                  return false;
                }
              } else {
                alert('No assessment loaded to backup');
                return false;
              }
            },
            restoreBackup: (backupKey) => {
              try {
                const data = fieldTestService.restoreFromBackup(backupKey);
                if (data) {
                  alert('Backup restored successfully!');
                  return true;
                } else {
                  alert('Failed to restore backup');
                  return false;
                }
              } catch (error) {
                console.error('Failed to restore backup:', error);
                alert('Failed to restore backup: ' + error.message);
                return false;
              }
            },
            syncOfflineChanges: async () => {
              try {
                const result = await fieldTestService.syncOfflineChanges();
                if (result) {
                  alert('Sync completed successfully!');
                } else {
                  alert('Sync failed');
                }
                return result;
              } catch (error) {
                console.error('Sync error:', error);
                alert('Sync error: ' + error.message);
                return false;
              }
            }
          };
          
          // Create a manual backup button
          const backupBtn = document.createElement('button');
          backupBtn.textContent = 'Create Manual Backup';
          backupBtn.style = 'position: fixed; bottom: 10px; right: 10px; z-index: 9999; padding: 10px; background: blue; color: white; border-radius: 5px; border: none; cursor: pointer;';
          backupBtn.onclick = window.fieldTesting.createBackup;
          document.body.appendChild(backupBtn);
          
          console.log('Field testing mode initialized successfully');
        } catch (error) {
          console.error('Failed to initialize field testing:', error);
        }
      }
    }
  }, []);
  
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AssessmentProvider>
          <EnhancedAssessmentProvider>
            <Component {...pageProps} />
            
            {/* Render the field test panel if enabled and showing */}
            {fieldTestEnabled && showPanel && (
              <div style={{
                position: 'fixed',
                top: '60px',
                right: '10px',
                width: '350px',
                zIndex: 9998,
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                borderRadius: '8px',
                overflow: 'hidden'
              }}>
                <FieldTestPanel onClose={() => setShowPanel(false)} />
              </div>
            )}
          </EnhancedAssessmentProvider>
        </AssessmentProvider>
      </PersistGate>
    </Provider>
  );
}

export default MyApp;