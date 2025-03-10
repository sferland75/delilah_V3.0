import MedicalHistorySimple from './components/MedicalHistorySimple';
import SuperSimpleMedicalHistory from './SuperSimpleMedicalHistory';

// Export the SuperSimple version as the primary component
export { SuperSimpleMedicalHistory as SimpleMedicalHistory };

// Also provide it as the default MedicalHistory
export { SuperSimpleMedicalHistory as MedicalHistory };