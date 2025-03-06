import { DetailLevel, ReportStyle } from './types';

// Content generators for each section
export const contentGenerators: Record<string, (detailLevel: DetailLevel, style: ReportStyle) => string> = {
  'executive-summary': (detailLevel, style) => {
    if (style === 'conversational') {
      return `This report summarizes our assessment of your current abilities and challenges. 
      
We found that you're experiencing some difficulties with daily activities due to your symptoms. You mentioned having pain and limited movement, which is affecting how you go about your day.

Based on our assessment, we believe you would benefit from some specific strategies and supports to help you manage your daily activities better and improve your quality of life.

The rest of this report goes into more detail about our findings and recommendations.`;
    }

    const baseContent = `This report presents the findings of a comprehensive occupational therapy assessment conducted to evaluate the client's functional status and determine appropriate interventions.

The assessment reveals that the client is experiencing significant functional limitations that impact their ability to perform activities of daily living independently. These limitations are primarily due to reported symptoms including pain, decreased range of motion, and fatigue.

Based on the findings, recommendations include a home exercise program, adaptive equipment for daily activities, and environmental modifications to improve safety and accessibility.`;

    if (detailLevel === 'brief') {
      return baseContent;
    }
    
    if (detailLevel === 'comprehensive') {
      return `${baseContent}

The client demonstrates particular difficulty with mobility tasks, self-care activities, and household management. Their current level of function represents a significant change from their pre-injury status and impacts both their vocational and leisure participation.

A detailed analysis of the client's functional capacity indicates that they would benefit from a graduated return to activities with appropriate supports and accommodations. The recommended interventions aim to maximize independence while ensuring safety and preventing further decline in function.

Follow-up assessment is recommended in 3 months to evaluate progress and adjust interventions as needed.`;
    }
    
    return baseContent;
  },
  
  'demographics': (detailLevel, style) => {
    const baseContent = `Client Name: [Client Name]
Date of Birth: [DOB]
Age: [Age] years
Gender: [Gender]
Assessment Date: ${new Date().toLocaleDateString()}
Referral Source: [Referral Source]`;

    if (style === 'conversational') {
      return `This report was prepared for you on ${new Date().toLocaleDateString()}.

Your assessment was requested by [Referral Source].`;
    }

    if (detailLevel === 'brief') {
      return baseContent;
    }
    
    return `${baseContent}
Contact Information: [Phone/Email]
Address: [Address]
Primary Language: [Language]
Occupation: [Occupation]
Employer: [Employer]
Insurance Provider: [Insurance Provider]
Policy Number: [Policy Number]
File Number: [File Number]
Date of Injury/Onset: [Date]`;
  },
  
  'purpose-methodology': (detailLevel, style) => {
    if (style === 'conversational') {
      return `We completed this assessment to understand how your injury or condition is affecting your day-to-day life and to identify ways to help you manage better.

During our assessment, we talked about your symptoms, observed how you perform various activities, and discussed your home environment and daily routine.`;
    }

    const baseContent = `This occupational therapy assessment was conducted to evaluate the client's functional status, identify limitations in activities of daily living, and determine appropriate interventions to maximize independence and quality of life.

The assessment methodology included:
- Clinical interview
- Standardized functional assessments
- Observation of task performance
- Review of medical records`;

    if (detailLevel === 'brief') {
      return baseContent;
    }
    
    if (detailLevel === 'comprehensive') {
      return `${baseContent}
- Home environment evaluation
- Collateral information from family members/caregivers
- Analysis of occupational performance
- Evaluation of safety concerns

Standardized assessments administered included:
1. Canadian Occupational Performance Measure (COPM)
2. Assessment of Motor and Process Skills (AMPS)
3. Berg Balance Scale
4. Functional Independence Measure (FIM)
5. Pain Visual Analog Scale

The assessment was conducted over two sessions on [dates] at [locations]. The client was collaborative throughout the assessment process and provided informed consent for all procedures.

This assessment was requested by [referral source] to address the following specific questions:
1. What is the client's current functional status relative to pre-injury/illness level?
2. What supports and services are required to maximize independence?
3. What prognosis can be anticipated with appropriate interventions?`;
    }
    
    return `${baseContent}
- Home environment evaluation
- Collateral information from family members
- Analysis of occupational performance

The assessment was conducted on [date] at [location]. The client provided informed consent for all procedures.

This assessment was requested by [referral source] to determine functional status and appropriate interventions.`;
  },
  
  // More generators to be added in other files
};
