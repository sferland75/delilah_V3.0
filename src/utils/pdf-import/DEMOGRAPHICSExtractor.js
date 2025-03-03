// Demographics Section Extractor
// Auto-generated on 2025-02-28
// Part of Delilah V3.0 PDF Import Pattern Recognition

class DEMOGRAPHICSExtractor {
  /**
   * Extract demographics data from text
   * @param {string} text - Section text content
   * @returns {Object} Extracted demographics data
   */
  static extract(text) {
    const data = {
      name: '',
      dob: '',
      age: null,
      gender: '',
      address: '',
      phone: '',
      referralSource: '',
      insuranceInfo: '',
      confidence: {}
    };
    
    // Extract name
    const nameMatches = [
      ...text.matchAll(/(?:name|client|patient)(?:\s*name)?(?:\s*is)?(?:\s*:|\s*-|\s*–|\s*\*)?\s*([^,\n.]+)/gi),
      ...text.matchAll(/(?:mr\.|mrs\.|ms\.|miss|dr\.)\s+([^,\n.]+)/gi)
    ];
    
    if (nameMatches.length > 0) {
      // Use the first match that doesn't look like a field label
      for (const match of nameMatches) {
        const potentialName = match[1].trim();
        // Check if this looks like a real name (not another field label)
        if (potentialName.length > 3 && 
            !/(?:address|phone|gender|sex|male|female|birth)/i.test(potentialName)) {
          data.name = potentialName;
          data.confidence.name = 0.8;
          break;
        }
      }
    }
    
    // Extract date of birth
    const dobMatches = [
      ...text.matchAll(/(?:dob|date\s+of\s+birth|birth\s*date|born)(?:\s*:|\s*-|\s*–|\s*\*)?\s*([^,\n.]+)/gi),
      ...text.matchAll(/(?:born\s+on)(?:\s*:|\s*-|\s*–|\s*\*)?\s*([^,\n.]+)/gi)
    ];
    
    if (dobMatches.length > 0) {
      data.dob = dobMatches[0][1].trim();
      data.confidence.dob = 0.8;
    }
    
    // Extract age
    const ageMatches = [
      ...text.matchAll(/(?:age|years\s+old)(?:\s*:|\s*-|\s*–|\s*\*)?\s*(\d+)/gi),
      ...text.matchAll(/(\d+)(?:\s*-|\s*–)?\s*(?:years?\s+old|yo|y\.o\.|years?\s+of\s+age)/gi)
    ];
    
    if (ageMatches.length > 0) {
      const parsedAge = parseInt(ageMatches[0][1].trim());
      if (!isNaN(parsedAge) && parsedAge > 0 && parsedAge < 120) {
        data.age = parsedAge;
        data.confidence.age = 0.9;
      }
    }
    
    // Extract gender
    const genderMatches = [
      ...text.matchAll(/(?:gender|sex)(?:\s*:|\s*-|\s*–|\s*\*)?\s*([^,\n.]+)/gi),
      ...text.matchAll(/(?:male|female|non-binary|transgender)(?:\s+individual|\s+person|\s+client|\s+patient)?/gi)
    ];
    
    if (genderMatches.length > 0) {
      const genderText = genderMatches[0][0].toLowerCase();
      
      if (genderText.includes('male') && !genderText.includes('female')) {
        data.gender = 'Male';
        data.confidence.gender = 0.9;
      } else if (genderText.includes('female')) {
        data.gender = 'Female';
        data.confidence.gender = 0.9;
      } else {
        data.gender = genderMatches[0][1] ? genderMatches[0][1].trim() : genderMatches[0][0].trim();
        data.confidence.gender = 0.7;
      }
    }
    
    // Extract address
    const addressMatches = [
      ...text.matchAll(/(?:address|residence|location|resides\s+at)(?:\s*:|\s*-|\s*–|\s*\*)?\s*([^,\n.]{3,}(?:[^.]*?(?:street|avenue|drive|road|lane|ave\.|st\.|dr\.|rd\.)[^.]*)?)/gi)
    ];
    
    if (addressMatches.length > 0) {
      data.address = addressMatches[0][1].trim();
      data.confidence.address = 0.7;
    }
    
    // Extract phone number
    const phoneMatches = [
      ...text.matchAll(/(?:phone|telephone|cell|mobile|contact)(?:\s*:|\s*-|\s*–|\s*\*)?\s*([0-9()\s\-+.]{7,20})/gi),
      ...text.matchAll(/([0-9]{3}[\s\-.]?[0-9]{3}[\s\-.]?[0-9]{4})/g)
    ];
    
    if (phoneMatches.length > 0) {
      data.phone = phoneMatches[0][1] ? phoneMatches[0][1].trim() : phoneMatches[0][0].trim();
      data.confidence.phone = 0.8;
    }
    
    // Extract referral source
    const referralMatches = [
      ...text.matchAll(/(?:referr(?:al|ed)\s+(?:by|from|source)|referred\s+by)(?:\s*:|\s*-|\s*–|\s*\*)?\s*([^,\n.]{3,}(?:[^\n.]*)?)/gi)
    ];
    
    if (referralMatches.length > 0) {
      data.referralSource = referralMatches[0][1].trim();
      data.confidence.referralSource = 0.7;
    }
    
    // Extract insurance information
    const insuranceMatches = [
      ...text.matchAll(/(?:insurance|insurer|coverage|policy)(?:\s*:|\s*-|\s*–|\s*\*)?\s*([^,\n.]{3,}(?:[^\n.]*)?)/gi)
    ];
    
    if (insuranceMatches.length > 0) {
      data.insuranceInfo = insuranceMatches[0][1].trim();
      data.confidence.insuranceInfo = 0.7;
    }
    
    return data;
  }
}

module.exports = DEMOGRAPHICSExtractor;
