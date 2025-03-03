/**
 * DEMOGRAPHICSExtractor.js
 * 
 * Specialized extractor for the DEMOGRAPHICS section with enhanced pattern recognition
 * based on statistical analysis of successful extractions.
 */

const BaseExtractor = require('./BaseExtractor');

class DEMOGRAPHICSExtractor extends BaseExtractor {
  constructor() {
    super('DEMOGRAPHICS');
    
    // Additional patterns specific to DEMOGRAPHICS section
    this.demographicsPatterns = {
      name: [
        { regex: /(?:client|patient|name)(?:\s*:|:?\s+)(.*?)(?:\s{2,}|\n|$)/i, confidence: 0.8 },
        { regex: /name of (?:client|patient)(?:\s*:|:?\s+)(.*?)(?:\s{2,}|\n|$)/i, confidence: 0.85 },
        { regex: /(?:mr\.|mrs\.|ms\.|miss|dr\.)\s+([a-z\s\-'.]+)/i, confidence: 0.7 }
      ],
      dob: [
        { regex: /(?:date of birth|dob|birth date)(?:\s*:|:?\s+)(?:\s*)([0-9]{1,4}[-./][0-9]{1,2}[-./][0-9]{1,4})/i, confidence: 0.8 },
        { regex: /(?:date of birth|dob|birth date):?\s*([a-z]+ [0-9]{1,2},? [0-9]{4})/i, confidence: 0.75 },
        { regex: /born (?:on|in)(?:\s*)([0-9]{1,4}[-./][0-9]{1,2}[-./][0-9]{1,4})/i, confidence: 0.7 }
      ],
      age: [
        { regex: /(?:age|years old)(?:\s*:|:?\s+)(?:\s*)([0-9]+)/i, confidence: 0.8 },
        { regex: /([0-9]+)(?:\s*|\-)year(?:\-|\s*)old/i, confidence: 0.75 },
        { regex: /age:?\s*([0-9]+)/i, confidence: 0.7 }
      ],
      gender: [
        { regex: /(?:gender|sex)(?:\s*:|:?\s+)(?:\s*)([a-z]+)/i, confidence: 0.8 },
        { regex: /(?:male|female|non-binary|transgender|other)/i, confidence: 0.6 }
      ],
      address: [
        { regex: /(?:address|residence|home address)(?:\s*:|:?\s+)(.*?)(?:\s{2,}|\n|$)/i, confidence: 0.8 },
        { regex: /(?:lives at|residing at|resides at|domiciled at)(?:\s+)(.*?)(?:\s{2,}|\n|$)/i, confidence: 0.75 },
        { regex: /(?:[0-9]+\s+[a-z0-9\s.,-]+(?:road|street|avenue|ave|drive|dr|court|lane|blvd|boulevard|way|place|pl|crescent|circle))/i, confidence: 0.7 }
      ],
      phone: [
        { regex: /(?:phone|telephone|tel|contact|cell|mobile)(?:\s*:|:?\s+)(?:\s*)([0-9()\-. +]{7,})/i, confidence: 0.8 },
        { regex: /(?:phone|telephone|tel|contact|cell|mobile)(?:\s*#|number)(?:\s*:|:?\s+)(?:\s*)([0-9()\-. +]{7,})/i, confidence: 0.85 },
        { regex: /(?:reached at|contacted at)(?:\s+)([0-9()\-. +]{7,})/i, confidence: 0.7 }
      ],
      referralSource: [
        { regex: /(?:referr(?:al|ed) (?:source|by|from)|source of referr?al)(?:\s*:|:?\s+)(.*?)(?:\s{2,}|\n|$)/i, confidence: 0.8 },
        { regex: /(?:referr?al(?:\s*:|:?\s+))(.*?)(?:\s{2,}|\n|$)/i, confidence: 0.7 }
      ],
      insuranceInfo: [
        { regex: /(?:insurance|insurer|policy)(?:\s*:|:?\s+)(.*?)(?:\s{2,}|\n|$)/i, confidence: 0.8 },
        { regex: /(?:claim|file)(?:\s*#|number|no|num)(?:\s*:|:?\s+)(?:\s*)([a-z0-9\-]+)/i, confidence: 0.85 },
        { regex: /(?:policy|member)(?:\s*#|number|no|num)(?:\s*:|:?\s+)(?:\s*)([a-z0-9\-]+)/i, confidence: 0.8 }
      ]
    };
  }
  
  /**
   * Extract data from DEMOGRAPHICS section text using enhanced pattern recognition
   * @param {string} text - DEMOGRAPHICS section text
   * @param {Object} allSections - All sections in the document
   * @returns {Object} Extracted data with confidence scores
   */
  extract(text, allSections = {}) {
    // Use base extractor first
    const result = super.extract(text, allSections);
    
    // Apply enhanced extraction techniques specific to DEMOGRAPHICS
    this.extractName(text, result);
    this.extractDateOfBirth(text, result);
    this.extractAge(text, result);
    this.extractGender(text, result);
    this.extractAddress(text, result);
    this.extractPhone(text, result);
    this.extractReferralSource(text, result);
    this.extractInsuranceInfo(text, result);
    
    // Apply section-specific validations
    this.validateDemographicsData(result);
    
    return result;
  }
  
  /**
   * Extract client/patient name
   * @param {string} text - Section text
   * @param {Object} result - Result object to update
   */
  extractName(text, result) {
    // Skip if already extracted with high confidence
    if (result.name && result.confidence.name > 0.7) {
      return;
    }
    
    // Try patterns from demographicsPatterns
    for (const pattern of this.demographicsPatterns.name) {
      const match = text.match(pattern.regex);
      if (match && match[1]) {
        const candidateName = match[1].trim();
        
        // Validate - names usually have at least two parts and are not too long
        if (candidateName.split(/\s+/).length >= 2 && candidateName.length < 50) {
          result.name = candidateName;
          result.confidence.name = pattern.confidence;
          result.name_method = 'namePattern';
          return;
        }
      }
    }
    
    // Try to find name in the first few lines of the document
    const firstLines = text.split('\n').slice(0, 10);
    for (const line of firstLines) {
      // Look for lines with "Name:" or similar patterns
      if (line.match(/\b(?:client|patient|customer|name)\s*:/i)) {
        const cleanLine = line.replace(/\b(?:client|patient|customer|name)\s*:/i, '').trim();
        if (cleanLine && cleanLine.split(/\s+/).length >= 2 && cleanLine.length < 50) {
          result.name = cleanLine;
          result.confidence.name = 0.6;
          result.name_method = 'firstLines';
          return;
        }
      }
    }
  }
  
  /**
   * Extract date of birth
   * @param {string} text - Section text
   * @param {Object} result - Result object to update
   */
  extractDateOfBirth(text, result) {
    // Skip if already extracted with high confidence
    if (result.dob && result.confidence.dob > 0.7) {
      return;
    }
    
    // Try patterns from demographicsPatterns
    for (const pattern of this.demographicsPatterns.dob) {
      const match = text.match(pattern.regex);
      if (match && match[1]) {
        result.dob = match[1].trim();
        result.confidence.dob = pattern.confidence;
        result.dob_method = 'dobPattern';
        return;
      }
    }
    
    // Look for date formats in the text
    const dateRegex = /\b(\d{1,4}[-./]\d{1,2}[-./]\d{1,4})\b/g;
    const dateMatches = text.match(dateRegex);
    
    if (dateMatches) {
      // Find dates near keywords like "birth", "born", "dob"
      for (const date of dateMatches) {
        const dateIndex = text.indexOf(date);
        const contextStart = Math.max(0, dateIndex - 30);
        const contextEnd = Math.min(text.length, dateIndex + 30);
        const context = text.substring(contextStart, contextEnd).toLowerCase();
        
        if (context.includes('birth') || context.includes('born') || context.includes('dob')) {
          result.dob = date;
          result.confidence.dob = 0.65;
          result.dob_method = 'contextDate';
          return;
        }
      }
      
      // If no birth-related context found, use the first date with lower confidence
      result.dob = dateMatches[0];
      result.confidence.dob = 0.5;
      result.dob_method = 'firstDate';
    }
  }
  
  /**
   * Extract client/patient age
   * @param {string} text - Section text
   * @param {Object} result - Result object to update
   */
  extractAge(text, result) {
    // Skip if already extracted with high confidence
    if (result.age && result.confidence.age > 0.7) {
      return;
    }
    
    // Try patterns from demographicsPatterns
    for (const pattern of this.demographicsPatterns.age) {
      const match = text.match(pattern.regex);
      if (match && match[1]) {
        const age = parseInt(match[1].trim(), 10);
        // Validate - age should be reasonable
        if (age > 0 && age < 120) {
          result.age = age;
          result.confidence.age = pattern.confidence;
          result.age_method = 'agePattern';
          return;
        }
      }
    }
    
    // If we have DOB, calculate age
    if (result.dob) {
      try {
        const dobMatch = result.dob.match(/(\d{1,4})[-./](\d{1,2})[-./](\d{1,4})/);
        if (dobMatch) {
          // Determine year, month, day from the match
          // The format could be YYYY-MM-DD or DD-MM-YYYY or MM-DD-YYYY
          let year, month, day;
          
          // If first number is 4 digits, it's likely the year (YYYY-MM-DD)
          if (dobMatch[1].length === 4) {
            year = parseInt(dobMatch[1], 10);
            month = parseInt(dobMatch[2], 10) - 1; // JavaScript months are 0-indexed
            day = parseInt(dobMatch[3], 10);
          } 
          // If last number is 4 digits, it's likely the year (DD-MM-YYYY or MM-DD-YYYY)
          else if (dobMatch[3].length === 4) {
            year = parseInt(dobMatch[3], 10);
            // Ambiguous case - could be DD-MM-YYYY or MM-DD-YYYY
            // For simplicity, we'll assume MM-DD-YYYY for American format
            month = parseInt(dobMatch[1], 10) - 1;
            day = parseInt(dobMatch[2], 10);
          } else {
            // Unable to determine format reliably
            return;
          }
          
          const dob = new Date(year, month, day);
          const today = new Date();
          let age = today.getFullYear() - dob.getFullYear();
          
          // Adjust age if birthday hasn't occurred yet this year
          if (today.getMonth() < dob.getMonth() || 
              (today.getMonth() === dob.getMonth() && today.getDate() < dob.getDate())) {
            age--;
          }
          
          // Validate - age should be reasonable
          if (age > 0 && age < 120) {
            result.age = age;
            result.confidence.age = 0.7;
            result.age_method = 'calculatedFromDob';
          }
        }
      } catch (error) {
        // Error parsing DOB, ignore
      }
    }
  }
  
  /**
   * Extract client/patient gender
   * @param {string} text - Section text
   * @param {Object} result - Result object to update
   */
  extractGender(text, result) {
    // Skip if already extracted with high confidence
    if (result.gender && result.confidence.gender > 0.7) {
      return;
    }
    
    // Try patterns from demographicsPatterns
    for (const pattern of this.demographicsPatterns.gender) {
      const match = text.match(pattern.regex);
      if (match) {
        let gender;
        
        if (match[1]) {
          gender = match[1].trim().toLowerCase();
        } else {
          // Extract the matched gender term
          gender = match[0].trim().toLowerCase();
        }
        
        // Normalize gender values
        if (gender.includes('male') && !gender.includes('female')) {
          gender = 'Male';
        } else if (gender.includes('female')) {
          gender = 'Female';
        } else if (gender.includes('non-binary')) {
          gender = 'Non-binary';
        } else if (gender.includes('other')) {
          gender = 'Other';
        } else {
          // Unknown gender format
          continue;
        }
        
        result.gender = gender;
        result.confidence.gender = pattern.confidence;
        result.gender_method = 'genderPattern';
        return;
      }
    }
    
    // Look for gender indicators in the text
    const textLower = text.toLowerCase();
    if (textLower.includes(' he ') || textLower.includes(' his ') || 
        textLower.includes('male ') || textLower.includes(' man ')) {
      result.gender = 'Male';
      result.confidence.gender = 0.5;
      result.gender_method = 'pronounInference';
    } else if (textLower.includes(' she ') || textLower.includes(' her ') || 
               textLower.includes('female ') || textLower.includes(' woman ')) {
      result.gender = 'Female';
      result.confidence.gender = 0.5;
      result.gender_method = 'pronounInference';
    }
  }
  
  /**
   * Extract client/patient address
   * @param {string} text - Section text
   * @param {Object} result - Result object to update
   */
  extractAddress(text, result) {
    // Skip if already extracted with high confidence
    if (result.address && result.confidence.address > 0.7) {
      return;
    }
    
    // Try patterns from demographicsPatterns
    for (const pattern of this.demographicsPatterns.address) {
      const match = text.match(pattern.regex);
      if (match && match[1]) {
        const address = match[1].trim();
        // Validate - addresses usually contain numbers and street names
        if (address.match(/\d+/) && address.length > 5) {
          result.address = address;
          result.confidence.address = pattern.confidence;
          result.address_method = 'addressPattern';
          return;
        }
      }
    }
    
    // Look for address formats in the text
    const addressRegex = /\b\d+\s+[A-Za-z0-9\s.,-]+(?:road|street|avenue|drive|lane|court|blvd|boulevard|way|circle|crescent|terrace|ave|dr|st|ln|ct|pl|tr|cir)\b/i;
    const addressMatch = text.match(addressRegex);
    
    if (addressMatch) {
      result.address = addressMatch[0].trim();
      result.confidence.address = 0.6;
      result.address_method = 'addressFormat';
    }
  }
  
  /**
   * Extract client/patient phone number
   * @param {string} text - Section text
   * @param {Object} result - Result object to update
   */
  extractPhone(text, result) {
    // Skip if already extracted with high confidence
    if (result.phone && result.confidence.phone > 0.7) {
      return;
    }
    
    // Try patterns from demographicsPatterns
    for (const pattern of this.demographicsPatterns.phone) {
      const match = text.match(pattern.regex);
      if (match && match[1]) {
        const phone = match[1].trim();
        // Validate - phone numbers should have at least 7 digits
        if (phone.replace(/\D/g, '').length >= 7) {
          result.phone = phone;
          result.confidence.phone = pattern.confidence;
          result.phone_method = 'phonePattern';
          return;
        }
      }
    }
    
    // Look for phone number formats in the text
    const phoneRegex = /\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g;
    const phoneMatches = text.match(phoneRegex);
    
    if (phoneMatches) {
      result.phone = phoneMatches[0].trim();
      result.confidence.phone = 0.6;
      result.phone_method = 'phoneFormat';
    }
  }
  
  /**
   * Extract referral source information
   * @param {string} text - Section text
   * @param {Object} result - Result object to update
   */
  extractReferralSource(text, result) {
    // Skip if already extracted with high confidence
    if (result.referralSource && result.confidence.referralSource > 0.7) {
      return;
    }
    
    // Try patterns from demographicsPatterns
    for (const pattern of this.demographicsPatterns.referralSource) {
      const match = text.match(pattern.regex);
      if (match && match[1]) {
        result.referralSource = match[1].trim();
        result.confidence.referralSource = pattern.confidence;
        result.referralSource_method = 'referralPattern';
        return;
      }
    }
    
    // Look for referral keywords in the text
    const referralKeywords = ['referred by', 'referral source', 'referrer', 'referring'];
    
    for (const keyword of referralKeywords) {
      const keywordIndex = text.toLowerCase().indexOf(keyword);
      if (keywordIndex !== -1) {
        // Extract text after the keyword
        const afterKeyword = text.substring(keywordIndex + keyword.length).trim();
        // Get the first line or sentence
        const referralSource = afterKeyword.split(/[.:\n]/)[0].trim();
        
        if (referralSource.length > 0 && referralSource.length < 100) {
          result.referralSource = referralSource;
          result.confidence.referralSource = 0.5;
          result.referralSource_method = 'keywordContext';
          return;
        }
      }
    }
  }
  
  /**
   * Extract insurance information
   * @param {string} text - Section text
   * @param {Object} result - Result object to update
   */
  extractInsuranceInfo(text, result) {
    // Skip if already extracted with high confidence
    if (result.insuranceInfo && result.confidence.insuranceInfo > 0.7) {
      return;
    }
    
    // Try patterns from demographicsPatterns
    for (const pattern of this.demographicsPatterns.insuranceInfo) {
      const match = text.match(pattern.regex);
      if (match && match[1]) {
        result.insuranceInfo = match[1].trim();
        result.confidence.insuranceInfo = pattern.confidence;
        result.insuranceInfo_method = 'insurancePattern';
        return;
      }
    }
    
    // Look for insurance and claim keywords in the text
    const insuranceRegex = /(?:insurance|insurer|policy|claim|file).{1,30}?([A-Za-z0-9\s.,-]+)/i;
    const insuranceMatch = text.match(insuranceRegex);
    
    if (insuranceMatch && insuranceMatch[1]) {
      result.insuranceInfo = insuranceMatch[1].trim();
      result.confidence.insuranceInfo = 0.5;
      result.insuranceInfo_method = 'insuranceContext';
    }
  }
  
  /**
   * Validate and refine demographics data
   * @param {Object} result - Result object to validate
   */
  validateDemographicsData(result) {
    // Format phone number consistently if present
    if (result.phone) {
      // Remove all non-numeric characters to standardize
      const digits = result.phone.replace(/\D/g, '');
      
      // If we have 10 digits (North American number), format as (XXX) XXX-XXXX
      if (digits.length === 10) {
        result.phone = `(${digits.substring(0, 3)}) ${digits.substring(3, 6)}-${digits.substring(6)}`;
      }
      // If we have 11 digits starting with 1, format as 1-XXX-XXX-XXXX
      else if (digits.length === 11 && digits[0] === '1') {
        result.phone = `1-${digits.substring(1, 4)}-${digits.substring(4, 7)}-${digits.substring(7)}`;
      }
    }
    
    // Format DOB consistently if present
    if (result.dob) {
      // Try to standardize date format to YYYY-MM-DD
      const dateMatch = result.dob.match(/(\d{1,4})[-./](\d{1,2})[-./](\d{1,4})/);
      if (dateMatch) {
        let year, month, day;
        
        // If first number is 4 digits, it's likely the year (YYYY-MM-DD)
        if (dateMatch[1].length === 4) {
          year = dateMatch[1];
          month = dateMatch[2].padStart(2, '0');
          day = dateMatch[3].padStart(2, '0');
        } 
        // If last number is 4 digits, it's likely the year (DD-MM-YYYY or MM-DD-YYYY)
        else if (dateMatch[3].length === 4) {
          year = dateMatch[3];
          // Ambiguous case - could be DD-MM-YYYY or MM-DD-YYYY
          // For simplicity, we'll assume MM-DD-YYYY for American format
          month = dateMatch[1].padStart(2, '0');
          day = dateMatch[2].padStart(2, '0');
        } else {
          // Can't determine format reliably, leave as is
          return;
        }
        
        result.dob = `${year}-${month}-${day}`;
      }
    }
    
    // Ensure name is properly capitalized
    if (result.name) {
      result.name = result.name
        .split(' ')
        .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
        .join(' ');
    }
  }
  
  /**
   * Check if the section appears to be a DEMOGRAPHICS section
   * @param {Object} result - Extraction result
   * @returns {boolean} True if likely a DEMOGRAPHICS section
   */
  isCorrectSectionType(result) {
    // DEMOGRAPHICS sections typically have client information and several demographic fields
    let demographicFieldsPresent = 0;
    
    if (result.name && result.confidence.name > 0.5) demographicFieldsPresent++;
    if (result.dob && result.confidence.dob > 0.5) demographicFieldsPresent++;
    if (result.age && result.confidence.age > 0.5) demographicFieldsPresent++;
    if (result.gender && result.confidence.gender > 0.5) demographicFieldsPresent++;
    if (result.address && result.confidence.address > 0.5) demographicFieldsPresent++;
    if (result.phone && result.confidence.phone > 0.5) demographicFieldsPresent++;
    if (result.referralSource && result.confidence.referralSource > 0.5) demographicFieldsPresent++;
    if (result.insuranceInfo && result.confidence.insuranceInfo > 0.5) demographicFieldsPresent++;
    
    // If we have at least 3 demographic fields, it's likely a DEMOGRAPHICS section
    return demographicFieldsPresent >= 3 || result.overallConfidence > 0.4;
  }
}

module.exports = DEMOGRAPHICSExtractor;
