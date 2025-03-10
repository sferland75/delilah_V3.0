import '../styles/globals.css';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '../store';
import { AssessmentProvider } from '../contexts/AssessmentContext';
import { Toaster } from '../components/ui/toaster';
import { ReduxToastProvider } from '../components/ui/ReduxToastProvider';

// No imports for field trial components - we'll add them conditionally

function MyApp({ Component, pageProps }) {
  // Check if we're in field trial mode
  const isFieldTrial = process.env.NEXT_PUBLIC_FIELD_TRIAL === 'true';
  
  try {
    // Use standard providers regardless of field trial mode
    // This ensures we only have one version of the context in use
    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <AssessmentProvider>
            <Component {...pageProps} />
            <Toaster />
            <ReduxToastProvider />
          </AssessmentProvider>
        </PersistGate>
      </Provider>
    );
  } catch (error) {
    console.error("Error in MyApp:", error);
    // Fallback to render without context if there's an error
    return <Component {...pageProps} />;
  }
}

export default MyApp;