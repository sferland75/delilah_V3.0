import { DetailLevel, ReportStyle } from './types';
import { contentGenerators } from './content-generators';

// Add more section generators to the contentGenerators object
Object.assign(contentGenerators, {
  'medical-history': (detailLevel, style) => {
    if (style === 'conversational') {
      return `You told us that your main medical condition is [primary condition]. You mentioned that this started on [date].

You also mentioned some other health conditions that affect you, including [list conditions].

You're currently taking these medications:
- [Medication 1]
- [Medication 2]
- [Medication 3]`;
    }

    const baseContent = `The client reports a primary diagnosis of [diagnosis] following an incident on [date].

Relevant medical history includes:
- [Condition 1]
- [Condition 2]
- [Condition 3]

Current medications:
- [Medication 1]: [dosage and frequency]
- [Medication 2]: [dosage and frequency]
- [Medication 3]: [dosage and frequency]`;

    if (detailLevel === 'brief') {
      return baseContent;
    }
    
    if (detailLevel === 'comprehensive') {
      return `${baseContent}

Prior to the incident, the client reports they were independent in all activities of daily living and instrumental activities of daily living. They were employed full-time as [occupation] and regularly participated in [recreational activities].

The client reports the following progression of symptoms since onset:
- Initial presentation: [describe]
- Changes over time: [describe]
- Current status: [describe]

Previous interventions have included:
- [Treatment 1]: [dates] - [outcome]
- [Treatment 2]: [dates] - [outcome]
- [Treatment 3]: [dates] - [outcome]

Relevant surgical history:
- [Surgery 1]: [date]
- [Surgery 2]: [date]

Family medical history significant for:
- [Family condition 1]
- [Family condition 2]

The client reports allergies to:
- [Allergy 1]
- [Allergy 2]

Social history:
- Marital status: [status]
- Living situation: [describe]
- Substance use: [describe]
- Support system: [describe]

Review of medical records indicates [describe relevant findings from records review].`;
    }
    
    return `${baseContent}

Prior to the incident, the client reports they were independent in all activities of daily living and employed as [occupation].

Previous interventions have included:
- [Treatment 1]: [outcome]
- [Treatment 2]: [outcome]

The client lives [living situation] and has [level of support] available.

Review of medical records confirms the diagnosis and treatment history.`;
  },
  
  'symptoms-assessment': (detailLevel, style) => {
    if (style === 'conversational') {
      return `You told us you're experiencing several symptoms that are affecting your daily life:

Physical symptoms:
- Pain in your [location], which you rated as [x/10]
- Difficulty with [specific movements]
- Fatigue that gets worse as the day goes on

Cognitive symptoms:
- Trouble concentrating for long periods
- Difficulty remembering appointments

These symptoms seem to be worse when you [triggers] and better when you [relieving factors].`;
    }

    const baseContent = `The client reports the following symptoms:

Physical symptoms:
- Pain: [location], [severity]/10, [frequency]
- Decreased range of motion: [joints affected]
- Fatigue: [severity], [pattern]
- [Other physical symptoms]

Cognitive symptoms:
- [Cognitive symptom 1]
- [Cognitive symptom 2]

Emotional symptoms:
- [Emotional symptom 1]
- [Emotional symptom 2]

Reported aggravating factors:
- [Factor 1]
- [Factor 2]

Reported alleviating factors:
- [Factor 1]
- [Factor 2]`;

    if (detailLevel === 'brief') {
      return baseContent;
    }
    
    if (detailLevel === 'comprehensive') {
      return `${baseContent}

Symptom Impact Analysis:

Pain:
The client reports that pain significantly impacts their ability to [specific activities]. Pain is rated [x/10] at rest and increases to [y/10] with activity. The quality of the pain is described as [quality] and [pattern]. The client uses [pain management strategies] for relief, with [effectiveness].

Fatigue:
Fatigue impacts the client's stamina for activities, with reported capacity for [duration] of continuous activity before requiring rest. The client reports that fatigue is more pronounced in the [time of day] and after [specific activities]. Recovery time following fatigue is approximately [time].

Cognitive Symptoms:
Cognitive symptoms manifest primarily as [specific manifestations]. These symptoms impact the client's ability to [specific activities] and are more pronounced when [circumstances]. The client compensates by [strategies].

Emotional Symptoms:
The client reports [emotional symptoms] which they attribute to [causes]. These symptoms impact their [specific areas of life] and are managed through [coping strategies].

Objective Assessment Findings:

Physical Examination:
- Range of motion testing reveals [findings]
- Muscle strength assessment shows [findings]
- Coordination testing indicates [findings]
- Sensory testing demonstrates [findings]

Cognitive Assessment:
- Attention and concentration: [findings]
- Memory: [findings]
- Executive functioning: [findings]

The symptom profile indicates [pattern] consistent with [diagnosis/condition]. Symptom presentation suggests [implications for function].`;
    }
    
    return `${baseContent}

The client reports that these symptoms primarily impact their ability to [specific activities]. Pain is rated [x/10] at rest and increases to [y/10] with activity.

Fatigue impacts the client's stamina for activities, with reported capacity for [duration] of continuous activity before requiring rest.

Cognitive symptoms manifest as [specific manifestations] and impact the client's ability to [specific activities].

Objective assessment findings are consistent with the reported symptoms and indicate [implications for function].`;
  },
  
  'functional-status': (detailLevel, style) => {
    if (style === 'conversational') {
      return `Here's a summary of what we observed about your current abilities:

You're able to:
- [Ability 1]
- [Ability 2]
- [Ability 3]

You're having difficulty with:
- [Difficulty 1]
- [Difficulty 2]
- [Difficulty 3]

These challenges appear to be mainly because of your [specific symptoms].`;
    }

    const baseContent = `Functional Assessment Summary:

The client demonstrates the following functional capacities and limitations:

Mobility:
- Ambulation: [status]
- Transfers: [status]
- Balance: [status]
- Stairs: [status]

Upper Extremity Function:
- Reach: [status]
- Grasp: [status]
- Fine motor: [status]
- Lifting/carrying: [status]

Self-Care:
- Dressing: [status]
- Bathing: [status]
- Grooming: [status]
- Toileting: [status]
- Feeding: [status]

Instrumental Activities:
- Meal preparation: [status]
- Housekeeping: [status]
- Laundry: [status]
- Shopping: [status]
- Transportation: [status]`;

    if (detailLevel === 'brief') {
      return baseContent;
    }
    
    if (detailLevel === 'comprehensive') {
      return `${baseContent}

Detailed Functional Analysis:

Mobility:
The client demonstrates [gait pattern] with [assistive device if applicable]. Observed impairments include [specific impairments]. Maximum walking distance is approximately [distance] before requiring rest. Transfers require [level of assistance] with the following observed strategies: [strategies]. The client manages [number] stairs with [handrail use] and [level of difficulty/assistance].

Upper Extremity Function:
Right upper extremity function is characterized by [description] with limitations in [specific movements/activities]. Left upper extremity demonstrates [description]. The client shows difficulty with [specific tasks] and has developed the following compensatory strategies: [strategies]. Maximum lifting capacity is estimated at [weight] from floor to waist and [weight] from waist to overhead.

Self-Care Activities:
The client requires [level of assistance] for dressing, with particular difficulty noted in [specific aspects]. Bathing requires [level of assistance] with [specific challenges]. Grooming tasks such as [specific tasks] are performed [independence level]. Toileting is [independence level] with [adaptations if any]. Feeding is [independence level].

Instrumental Activities:
The client currently manages meal preparation with [adaptations/assistance], limited to [complexity level] meals. Housekeeping is performed with [level of assistance] and limited to [specific tasks]. The client reports [management strategy] for laundry, shopping, and transportation.

Formal Assessment Results:
- Functional Independence Measure (FIM): [score]/126
- Canadian Occupational Performance Measure (COPM): Performance: [score]/10, Satisfaction: [score]/10
- Assessment of Motor and Process Skills (AMPS): Motor: [score], Process: [score]
- Berg Balance Scale: [score]/56
- [Other relevant assessment scores]

Functional Prognosis:
Based on the assessment findings, the client's functional prognosis is [prognosis] with appropriate interventions and accommodations. Factors supporting improvement include [positive factors]. Factors that may limit progress include [limiting factors].`;
    }
    
    return `${baseContent}

The client demonstrates [gait pattern] with [assistive device if applicable]. Maximum walking distance is approximately [distance] before requiring rest.

Upper extremity function shows limitations in [specific movements/activities] with noted difficulty in [specific tasks].

Self-care activities require [level of assistance] with particular difficulty in [specific aspects].

Instrumental activities are currently managed with [adaptations/assistance], limited to [complexity level] tasks.

Functional Assessment Scores:
- Functional Independence Measure (FIM): [score]/126
- Canadian Occupational Performance Measure (COPM): Performance: [score]/10, Satisfaction: [score]/10

Based on these findings, the client's functional prognosis is [prognosis] with appropriate interventions.`;
  }
});
