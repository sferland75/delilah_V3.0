import '../src/styles/globals.css';
import { AssessmentProvider } from '../src/contexts/AssessmentContext';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '../src/store';
import ReduxBridge from '../src/components/ReduxBridge';
import { Toaster } from '@/components/ui/toaster';
import { ReduxToastProvider } from '@/components/ui/ReduxToastProvider';

// Updated version with Redux Provider, Bridge, and Toast Provider
function MyApp({ Component, pageProps }) {
  try {
    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <AssessmentProvider>
            <ReduxBridge>
              <Component {...pageProps} />
              <Toaster />
              <ReduxToastProvider />
            </ReduxBridge>
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
