'use client';

import { FunctionalStatus } from './components/FunctionalStatus';
import { FunctionalStatusRedux } from './components/FunctionalStatus.redux';
import { SimpleRangeOfMotion } from './components/SimpleRangeOfMotion';

// Export components
export { FunctionalStatus, FunctionalStatusRedux, SimpleRangeOfMotion };

// Default export for page components
export default function FunctionalStatusPage() {
  return <FunctionalStatusRedux />;
}