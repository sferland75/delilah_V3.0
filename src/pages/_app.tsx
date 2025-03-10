import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { useEffect } from 'react';
import { AssessmentProvider } from '@/contexts/AssessmentContext';
import { EnhancedAssessmentProvider } from '@/contexts/EnhancedAssessmentContext';
import { Provider } from 'react-redux';
import { store, persistor } from '@/store';
import { PersistGate } from 'redux-persist/integration/react';

function MyApp({ Component, pageProps }: AppProps) {
  // Initialize auto backup system on client side
  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('../utils/autoBackup').then(module => {
        module.initAutoBackup();
      });
    }
  }, []);
  
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AssessmentProvider>
          <EnhancedAssessmentProvider>
            <Component {...pageProps} />
          </EnhancedAssessmentProvider>
        </AssessmentProvider>
      </PersistGate>
    </Provider>
  );
}

export default MyApp;
