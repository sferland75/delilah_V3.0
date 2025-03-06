import '../styles/globals.css';
import { AssessmentProvider } from '../contexts/AssessmentContext';

// A simplified version that only adds the assessment context
function MyApp({ Component, pageProps }) {
  try {
    return (
      <AssessmentProvider>
        <Component {...pageProps} />
      </AssessmentProvider>
    );
  } catch (error) {
    console.error("Error in MyApp:", error);
    // Fallback to render without context if there's an error
    return <Component {...pageProps} />;
  }
}

export default MyApp;
