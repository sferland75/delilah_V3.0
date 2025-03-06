import { DetailLevel, ReportStyle } from './types';
import { contentGenerators } from './content-generators';

// Add more section generators to the contentGenerators object
Object.assign(contentGenerators, {
  'typical-day': (detailLevel, style) => {
    if (style === 'conversational') {
      return `You described your typical day to us. Here's what we learned:

Before your injury, you would:
- Wake up at [time]
- [Morning routine]
- Work from [time] to [time] as a [job]
- [Evening activities]
- Go to bed around [time]

Now, your day looks more like:
- Wake up at [time]
- [Current morning routine]
- [Daytime activities]
- [Evening activities]
- Go to bed around [time]

The main differences we noticed are [key differences].`;
    }

    const baseContent = `Typical Day Analysis:

Pre-Injury/Illness:
The client reports their typical day prior to injury/illness included:
- Morning routine: [describe]
- Work activities: [describe]
- Leisure activities: [describe]
- Evening routine: [describe]
- Sleep pattern: [describe]

Current:
The client's current typical day includes:
- Morning routine: [describe]
- Daytime activities: [describe]
- Leisure activities: [describe]
- Evening routine: [describe]
- Sleep pattern: [describe]

Key differences noted between pre-injury/illness and current typical day include:
- [Difference 1]
- [Difference 2]
- [Difference 3]`;

    if (detailLevel === 'brief') {
      return baseContent;
    }
    
    if (detailLevel === 'comprehensive') {
      return `${baseContent}

Current Typical Day - Detailed Analysis:

Morning Routine (Time: [time range])
The client awakens at approximately [time]. They report [quality of sleep] and [morning symptoms]. Morning self-care requires approximately [time] and includes the following activities and challenges:
- [Activity 1]: [independence level/challenges]
- [Activity 2]: [independence level/challenges]
- [Activity 3]: [independence level/challenges]
The client typically has [type of breakfast] prepared by [self/other] and takes medications at [time].

Daytime Activities (Time: [time range])
During daytime hours, the client typically engages in:
- [Activity 1]: [duration] with [challenges]
- [Activity 2]: [duration] with [challenges]
- [Activity 3]: [duration] with [challenges]
Rest breaks are taken [frequency] for [duration]. The client reports [symptom changes] throughout the day. Meal preparation and consumption at lunch involves [description].

Afternoon Activities (Time: [time range])
Afternoon activities include:
- [Activity 1]: [duration] with [challenges]
- [Activity 2]: [duration] with [challenges]
The client reports energy levels are typically [level] during this time period.

Evening Routine (Time: [time range])
Evening meal is [prepared by whom] and consists of [complexity level] meals. Evening activities include:
- [Activity 1]: [duration] with [challenges]
- [Activity 2]: [duration] with [challenges]
Evening self-care routine takes approximately [time] with [assistance level] required.

Sleep (Time: [time range])
The client retires at approximately [time] and reports [sleep quality]. Sleep is interrupted [frequency] due to [reasons]. Sleep positioning requires [adaptations] and [comfort level] is reported.

Weekend Variations:
The client reports the following variations to their routine on weekends:
- [Variation 1]
- [Variation 2]

Activity Analysis:
The typical day analysis reveals the following key insights:
1. The client's activity tolerance is limited to [duration] before requiring rest
2. Self-care activities require approximately [time] longer than pre-injury
3. The client has eliminated [activities] from their routine due to [reasons]
4. The client requires assistance with [activities] that were previously independent
5. Symptom pattern throughout the day suggests [pattern]`;
    }
    
    return `${baseContent}

Morning Routine:
The client awakens at approximately [time] and reports [quality of sleep]. Morning self-care requires approximately [time] with particular difficulty in [specific tasks].

Daytime Activities:
During daytime hours, the client typically engages in [activities] with rest breaks taken [frequency]. The client reports energy levels are typically [level] by mid-day.

Evening Routine:
Evening activities include [activities]. Evening self-care takes approximately [time] with [assistance level] required.

Activity Analysis:
The typical day analysis reveals that the client's activity tolerance is limited to [duration] before requiring rest. The client has eliminated [activities] from their routine that were previously enjoyed. Symptom pattern throughout the day suggests [pattern].`;
  },
  
  'recommendations': (detailLevel, style) => {
    if (style === 'conversational') {
      return `Based on our assessment, here are our recommendations to help you:

1. Exercise Program:
   We recommend you try these specific exercises to help with your [specific issues]:
   - [Exercise 1]
   - [Exercise 2]
   - [Exercise 3]

2. Equipment that might help:
   - [Equipment 1] to help with [specific task]
   - [Equipment 2] to help with [specific task]

3. Changes to your home:
   We suggest making these adjustments to make your home safer and easier to navigate:
   - [Modification 1]
   - [Modification 2]`;
    }

    const baseContent = `Based on the assessment findings, the following recommendations are made:

Therapeutic Interventions:
1. Home Exercise Program:
   - [Exercise 1]: [frequency], [duration]
   - [Exercise 2]: [frequency], [duration]
   - [Exercise 3]: [frequency], [duration]

2. Adaptive Equipment:
   - [Equipment 1] for [purpose]
   - [Equipment 2] for [purpose]
   - [Equipment 3] for [purpose]

3. Environmental Modifications:
   - [Modification 1]
   - [Modification 2]
   - [Modification 3]

4. Activity Modifications:
   - [Modification 1]
   - [Modification 2]
   - [Modification 3]

5. Follow-up:
   - Reassessment in [timeframe]
   - Referral to [specialists] for [purpose]`;

    if (detailLevel === 'brief') {
      return baseContent;
    }
    
    if (detailLevel === 'comprehensive') {
      return `${baseContent}

Detailed Recommendations:

1. Home Exercise Program:
   The following exercises are recommended to address [specific impairments]:
   
   a) [Exercise 1]:
      - Purpose: To improve [specific function]
      - Method: [detailed description]
      - Frequency: [frequency]
      - Duration: [duration]
      - Progression: [progression parameters]
      
   b) [Exercise 2]:
      - Purpose: To improve [specific function]
      - Method: [detailed description]
      - Frequency: [frequency]
      - Duration: [duration]
      - Progression: [progression parameters]
      
   c) [Exercise 3]:
      - Purpose: To improve [specific function]
      - Method: [detailed description]
      - Frequency: [frequency]
      - Duration: [duration]
      - Progression: [progression parameters]

2. Adaptive Equipment:
   The following equipment is recommended to enhance independence and safety:
   
   a) [Equipment 1]:
      - Purpose: To assist with [specific task]
      - Specifications: [specifications]
      - Usage instructions: [instructions]
      - Funding options: [options]
      
   b) [Equipment 2]:
      - Purpose: To assist with [specific task]
      - Specifications: [specifications]
      - Usage instructions: [instructions]
      - Funding options: [options]
      
   c) [Equipment 3]:
      - Purpose: To assist with [specific task]
      - Specifications: [specifications]
      - Usage instructions: [instructions]
      - Funding options: [options]

3. Environmental Modifications:
   The following home modifications are recommended to enhance accessibility and safety:
   
   a) [Modification 1]:
      - Purpose: To address [specific barrier]
      - Specifications: [specifications]
      - Implementation considerations: [considerations]
      - Priority level: [priority]
      
   b) [Modification 2]:
      - Purpose: To address [specific barrier]
      - Specifications: [specifications]
      - Implementation considerations: [considerations]
      - Priority level: [priority]
      
   c) [Modification 3]:
      - Purpose: To address [specific barrier]
      - Specifications: [specifications]
      - Implementation considerations: [considerations]
      - Priority level: [priority]`;
    }
    
    return `${baseContent}

Home Exercise Program Rationale:
These exercises are designed to improve [specific functions] which will enhance the client's ability to perform [specific activities] with reduced symptoms.

Adaptive Equipment Rationale:
The recommended equipment will compensate for current limitations in [specific functions] and enable safer and more independent performance of [specific activities].

Environmental Modifications Rationale:
These modifications address identified hazards and barriers in the client's home environment that currently limit [specific activities] and pose safety risks.

Activity Modifications Rationale:
These strategies will enable the client to continue participating in valued activities while managing symptoms and preventing further functional decline.

With consistent implementation of recommendations, the client is expected to demonstrate improved independence and reduced symptoms within [timeframe].`;
  },
  
  'conclusion': (detailLevel, style) => {
    if (style === 'conversational') {
      return `To summarize what we've discussed in this report:

You're currently experiencing [main challenges] because of your [condition/injury].

The main areas where we think we can help are:
- [Area 1]
- [Area 2]
- [Area 3]

We believe that with the right support and by following the recommendations in this report, you can make good progress toward your goals.

Please don't hesitate to contact us if you have any questions about this report or our recommendations.`;
    }

    const baseContent = `This occupational therapy assessment identified several functional limitations that impact the client's ability to perform their usual activities independently and safely. The limitations are primarily due to [primary causes].

The client demonstrates good potential for functional improvement with appropriate interventions, including adaptive equipment, environmental modifications, and therapeutic exercise.

Implementation of the recommendations outlined in this report will assist the client in achieving greater independence, safety, and participation in meaningful activities.

Follow-up occupational therapy services are recommended to monitor progress and adjust interventions as needed.`;

    if (detailLevel === 'brief') {
      return baseContent;
    }
    
    if (detailLevel === 'comprehensive') {
      return `${baseContent}

Key Findings Summary:
1. The client's primary functional limitations are in the areas of [specific areas], which significantly impact their ability to [specific activities].

2. These limitations represent a substantial change from the client's pre-injury/illness status and affect their ability to fulfill their roles as [roles].

3. Current symptoms of [symptoms] and impairments in [impairments] are the primary contributors to functional limitations.

4. The client demonstrates strong motivation to improve and has already implemented some effective compensatory strategies.

5. Environmental factors that support recovery include [supportive factors], while barriers include [barriers].

Future Considerations:
The client's long-term prognosis for functional recovery is [prognosis] based on [factors]. Future rehabilitation efforts should focus on [focus areas] and consider [considerations].

Additional Services:
In addition to the recommendations outlined previously, consideration should be given to the following services:
- [Service 1]
- [Service 2]
- [Service 3]

Final Recommendations:
It is strongly recommended that the client proceed with implementing the interventions outlined in this report, beginning with [priority interventions], to maximize functional outcomes and quality of life.

This report represents the professional opinion of the assessing occupational therapist based on the findings at the time of assessment. Any significant changes in the client's status may necessitate reassessment and modification of recommendations.`;
    }
    
    return `${baseContent}

Key Findings Summary:
1. The client's primary functional limitations are in the areas of [specific areas].
2. These limitations represent a change from the client's pre-injury/illness status.
3. Current symptoms of [symptoms] are the primary contributors to functional limitations.

Future Considerations:
The client's prognosis for functional recovery is [prognosis] based on [factors]. 

It is recommended that the client proceed with implementing the interventions outlined in this report to maximize functional outcomes and quality of life.`;
  }
});
