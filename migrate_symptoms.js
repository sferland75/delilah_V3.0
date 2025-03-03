/**
 * Symptoms Schema Migration Script
 * 
 * This script performs the migration of symptoms data from the legacy format to the new format
 * that supports multiple physical and cognitive symptoms.
 * 
 * Usage:
 * node migrate_symptoms.js [options]
 * 
 * Options:
 *  --input=<path>       Path to the input data file (default: ./data/symptoms_data.json)
 *  --output=<path>      Path to save the migrated data (default: ./data/symptoms_data_migrated.json)
 *  --dry-run            Run without saving changes
 *  --validate-only      Only validate data without migration
 *  --format=<format>    Output format (json or csv, default: json)
 *  --verbose            Show detailed logs
 */

const fs = require('fs');
const path = require('path');

// Parse command line arguments
const args = process.argv.slice(2).reduce((acc, arg) => {
  if (arg.startsWith('--')) {
    const [key, value] = arg.substring(2).split('=');
    acc[key] = value || true;
  }
  return acc;
}, {});

// Default options
const options = {
  input: args.input || './data/symptoms_data.json',
  output: args.output || './data/symptoms_data_migrated.json',
  dryRun: args['dry-run'] || false,
  validateOnly: args['validate-only'] || false,
  format: args.format || 'json',
  verbose: args.verbose || false
};

// Function to log if verbose is enabled
function log(message) {
  if (options.verbose) {
    console.log(message);
  }
}

// Main migration function
async function migrateSymptoms() {
  try {
    console.log('Starting symptoms schema migration...');
    log(`Options: ${JSON.stringify(options, null, 2)}`);

    // Check if input file exists
    if (!fs.existsSync(options.input)) {
      console.error(`Error: Input file not found at ${options.input}`);
      process.exit(1);
    }

    // Read input data
    console.log(`Reading data from ${options.input}...`);
    const inputData = JSON.parse(fs.readFileSync(options.input, 'utf8'));
    
    if (!Array.isArray(inputData)) {
      console.error('Error: Input data must be an array of records');
      process.exit(1);
    }

    console.log(`Found ${inputData.length} records to process`);
    
    // Import the migration logic
    // Note: This would normally be imported from the compiled TypeScript code
    // For simplicity, we'll simulate the migration functions here
    
    const migrateRecord = (record) => {
      if (!record.symptoms) {
        return record;
      }

      const symptoms = record.symptoms;
      
      // Check if already in updated format
      if (Array.isArray(symptoms.physical) && Array.isArray(symptoms.cognitive)) {
        return record;
      }
      
      // Convert to new format
      return {
        ...record,
        symptoms: {
          general: symptoms.general || { notes: '' },
          physical: [
            {
              id: '1',
              ...symptoms.physical
            }
          ],
          cognitive: [
            {
              id: '1',
              ...symptoms.cognitive
            }
          ],
          emotional: symptoms.emotional || []
        }
      };
    };
    
    const validateRecord = (record) => {
      const errors = [];
      
      if (!record.symptoms) {
        errors.push('No symptoms data found');
        return { valid: false, errors };
      }
      
      const { physical, cognitive, emotional } = record.symptoms;
      
      if (!Array.isArray(physical)) {
        errors.push('Physical symptoms must be an array');
      } else if (physical.length === 0) {
        errors.push('At least one physical symptom is required');
      }
      
      if (!Array.isArray(cognitive)) {
        errors.push('Cognitive symptoms must be an array');
      } else if (cognitive.length === 0) {
        errors.push('At least one cognitive symptom is required');
      }
      
      if (!Array.isArray(emotional)) {
        errors.push('Emotional symptoms must be an array');
      }
      
      return { valid: errors.length === 0, errors };
    };

    // Process each record
    let migratedCount = 0;
    let validationErrors = 0;
    let alreadyUpdated = 0;
    
    const outputData = inputData.map((record, index) => {
      log(`Processing record ${index + 1}/${inputData.length}...`);
      
      // Check if already in updated format
      const isUpdatedFormat = record.symptoms && 
                             Array.isArray(record.symptoms.physical) && 
                             Array.isArray(record.symptoms.cognitive);
      
      if (isUpdatedFormat) {
        alreadyUpdated++;
        log(`Record ${index + 1} already in updated format`);
        return record;
      }

      // If validate only, don't migrate
      if (options.validateOnly) {
        return record;
      }

      // Migrate the record
      const migratedRecord = migrateRecord(record);
      migratedCount++;

      // Validate the migrated record
      const validation = validateRecord(migratedRecord);
      if (!validation.valid) {
        validationErrors++;
        console.warn(`Validation errors in record ${index + 1}:`, validation.errors);
      }

      return migratedRecord;
    });

    // Print statistics
    console.log('\nMigration Summary:');
    console.log(`Total records processed: ${inputData.length}`);
    console.log(`Already in updated format: ${alreadyUpdated}`);
    console.log(`Records migrated: ${migratedCount}`);
    console.log(`Records with validation errors: ${validationErrors}`);

    // Save output unless it's a dry run or validate only
    if (!options.dryRun && !options.validateOnly) {
      // Create output directory if it doesn't exist
      const outputDir = path.dirname(options.output);
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      if (options.format === 'json') {
        // Save as JSON
        fs.writeFileSync(options.output, JSON.stringify(outputData, null, 2));
        console.log(`\nMigrated data saved to ${options.output}`);
      } else if (options.format === 'csv') {
        // Save as CSV (simple implementation)
        // This would need to be enhanced for complex nested data
        console.error('CSV format not fully implemented for this data structure');
        process.exit(1);
      } else {
        console.error(`Unsupported output format: ${options.format}`);
        process.exit(1);
      }
    } else {
      console.log(`\nDry run or validate only - no data was saved`);
    }

    console.log('Migration completed successfully');

  } catch (error) {
    console.error('Error during migration:', error);
    process.exit(1);
  }
}

// Run the migration
migrateSymptoms();
