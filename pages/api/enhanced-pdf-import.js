import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import { initializeEnhancedSystem } from '../@/utils/pdf-import/index-enhanced';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Parse form data
    const form = formidable({
      uploadDir: path.join(process.cwd(), 'tmp'),
      keepExtensions: true,
      maxFileSize: 10 * 1024 * 1024, // 10MB
    });

    const [fields, files] = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) return reject(err);
        resolve([fields, files]);
      });
    });

    // Get uploaded file
    const file = files.file[0];

    // Read file content
    let documentText;
    const filePath = file.filepath;
    const fileExt = path.extname(file.originalFilename).toLowerCase();

    if (fileExt === '.pdf') {
      // For PDF files, use pdfjs-dist
      // This would need to be implemented to extract text from PDFs
      // For simplicity, we'll just read the file as text in this example
      documentText = await fs.promises.readFile(filePath, 'utf8');
    } else {
      // For text files
      documentText = await fs.promises.readFile(filePath, 'utf8');
    }

    // Initialize the enhanced system
    const enhancedSystem = await initializeEnhancedSystem();

    // Process the document
    const result = enhancedSystem.processDocument(documentText);

    // Enhance with NLP
    const enhancedResult = enhancedSystem.enhanceWithNLP(result);

    // Clean up the temporary file
    await fs.promises.unlink(filePath);

    // Return the extraction result
    return res.status(200).json(enhancedResult);
    
  } catch (error) {
    console.error('Error processing PDF:', error);
    return res.status(500).json({ message: 'Error processing PDF', error: error.message });
  }
}
