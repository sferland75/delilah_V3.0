'use client';

// This file provides a more robust export for the RangeOfMotion component
// It ensures that the component is available regardless of import method

import { SimpleRangeOfMotion } from './SimpleRangeOfMotion';

// Named export
export { SimpleRangeOfMotion as RangeOfMotion };

// Default export (for import RangeOfMotion from './RangeOfMotion')
const RangeOfMotion = SimpleRangeOfMotion;
export default RangeOfMotion;
