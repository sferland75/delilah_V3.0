import { render } from '@testing-library/react';
import { CognitiveSymptoms } from '../../components/cognitive-symptoms';
import { PhysicalSymptoms } from '../../components/physical-symptoms';
import { EmotionalSymptoms } from '../../components/emotional-symptoms';

console.log('Component Accessibility Check:');

try {
  const cognitive = render(<CognitiveSymptoms />);
  console.log('✓ CognitiveSymptoms renders');
} catch (e) {
  console.log('✗ CognitiveSymptoms error:', e.message);
}

try {
  const physical = render(<PhysicalSymptoms />);
  console.log('✓ PhysicalSymptoms renders');
} catch (e) {
  console.log('✗ PhysicalSymptoms error:', e.message);
}

try {
  const emotional = render(<EmotionalSymptoms />);
  console.log('✓ EmotionalSymptoms renders');
} catch (e) {
  console.log('✗ EmotionalSymptoms error:', e.message);
}