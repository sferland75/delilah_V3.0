import { initializeEnhancedSystem } from '../../utils/pdf-import/index-enhanced';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { originalExtraction, correctedData, documentType } = req.body;

    // Validate required data
    if (!originalExtraction || !correctedData) {
      return res.status(400).json({ message: 'Missing required data' });
    }

    // Initialize the enhanced system
    const enhancedSystem = await initializeEnhancedSystem();

    // Train the system
    const trainingRecord = await enhancedSystem.trainWithCorrection(
      originalExtraction,
      correctedData,
      documentType || 'OT_ASSESSMENT'
    );

    // Return success
    return res.status(200).json({
      message: 'Training successful',
      trainingId: trainingRecord.id,
      fieldsImproved: Object.keys(trainingRecord.differences || {}).length
    });
    
  } catch (error) {
    console.error('Error training pattern recognition:', error);
    return res.status(500).json({ message: 'Error training pattern recognition', error: error.message });
  }
}
