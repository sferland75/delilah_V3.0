# Prompt Engineering Guide for Delilah Report Drafting

## Overview

The Report Drafting module uses carefully engineered prompts to generate high-quality, professional occupational therapy report content. This guide explains the prompt engineering approach, design principles, and testing methodology.

## Prompt Structure

Each prompt follows a structured format:

1. **Role and Purpose Definition**
   - Sets the context for the LLM (e.g., "You are an experienced occupational therapist...")
   - Establishes the purpose of the content being generated
   - Defines the audience and use case

2. **Writing Style Instructions**
   - Provides specific guidance on tone, terminology, and language use
   - Varies based on selected style (clinical, conversational, simplified)
   - Sets expectations for professionalism and documentation standards

3. **Detail Level Instructions**
   - Defines expectations for content length and comprehensiveness
   - Provides guidance on what to include/exclude based on detail level
   - Sets structure for content organization

4. **Professional Standards**
   - Establishes requirements for maintaining ethical documentation practices
   - Ensures content adheres to professional guidelines
   - Promotes client-centered, respectful language

5. **Evidence-Based Practice Guidelines**
   - Provides section-specific best practices based on professional literature
   - Ensures content follows current standards of practice
   - Guides clinical reasoning and documentation approaches

6. **Section-Specific Content Requirements**
   - Lists required components for each section
   - Structures content into logical organization
   - Provides guidance on information prioritization

7. **Available Information**
   - Presents client data in structured format
   - Only provides factual information that should be included in the report
   - Formatted for easy reference by the LLM

8. **Critical Reminders**
   - Emphasizes key guidelines that must be followed
   - Addresses common pitfalls in report writing
   - Reinforces professional standards

## Style Variations

### Clinical Style

Designed for professional healthcare audiences:
- Formal, objective language
- Appropriate medical terminology
- Third-person perspective
- Structured, concise presentation
- Evidence-based reasoning

### Conversational Style

Designed for clients and families:
- Professional but accessible language
- Plain language explanations of technical terms
- Warm, supportive tone
- Practical focus on implications for daily life
- Balances clinical information with understandable explanations

### Simplified Style

Designed for maximum accessibility:
- Basic language (8th-grade reading level)
- Very limited medical terminology
- Short, direct sentences
- Concrete examples instead of abstract concepts
- Focus on practical implications

## Detail Level Variations

### Brief

- 100-300 words
- Essential information only
- Focus on key findings and implications
- Limited examples and background
- Core clinical reasoning only

### Standard

- 250-600 words
- Comprehensive but concise
- Balanced level of detail
- Selected supporting examples
- Clear clinical reasoning connections

### Comprehensive

- 500-1500 words
- Exhaustive detail
- Multiple specific examples
- Thorough clinical reasoning
- Addresses nuances and special considerations

## Section-Specific Approach

Each section has customized prompting that includes:

1. **Content Requirements**
   - Required components specific to that section
   - Key clinical information to include
   - Analysis expectations

2. **Organization Structure**
   - Paragraph-by-paragraph outline
   - Content sequencing guidelines
   - Logical flow directions

3. **Critical Reminders**
   - Section-specific pitfalls to avoid
   - Professional guidance for that section type
   - Client-centered approach specific to section content

## Testing and Evaluation Framework

### Automated Testing

The prompt testing framework evaluates:

1. **Content Length**
   - Appropriate for detail level
   - Neither too brief nor excessive

2. **Style Conformity**
   - Adheres to selected style guidelines
   - Uses appropriate terminology and language
   - Maintains consistent tone

3. **Professional Standards**
   - Avoids judgmental or unprofessional language
   - Uses person-first terminology
   - Balances strengths and challenges

4. **Section-Specific Requirements**
   - Includes required content components
   - Addresses key areas relevant to section
   - Follows section-specific organization

5. **Client-Centered Language**
   - Uses strength-based language
   - Avoids overly deficit-focused approach
   - Maintains respect and dignity

### Test Cases

The framework includes:

1. **Comprehensive Coverage**
   - Tests all section types
   - Tests all style variations
   - Tests all detail levels

2. **Edge Cases**
   - Handling incomplete data
   - Handling contradictory information
   - Handling complex cases

3. **Integration Testing**
   - Testing full report assembly
   - Ensuring section coherence and transitions
   - Validating overall report quality

## Best Practices for Prompt Refinement

When modifying prompts:

1. **Make Incremental Changes**
   - Test one change at a time
   - Document the impact of each change
   - Maintain a version history

2. **Balance Constraints and Creativity**
   - Provide enough structure for consistency
   - Allow room for appropriate variations
   - Avoid overly rigid formatting requirements

3. **Use Testing Framework**
   - Run comprehensive tests after changes
   - Compare before and after metrics
   - Check for unintended consequences

4. **Review with Experts**
   - Have occupational therapists review outputs
   - Validate against professional standards
   - Get feedback on clinical accuracy

## Implementation Examples

### Example: Clinical Style with Standard Detail

```
You are an experienced occupational therapist with 15+ years of clinical experience, writing a formal clinical assessment report.

ROLE AND PURPOSE:
- You are creating a section of a professional clinical documentation that will be reviewed by healthcare professionals, insurance providers, and potentially legal entities.
- Your writing should reflect the highest standards of professional clinical documentation.
- This documentation may be used for treatment planning, insurance approval, or legal proceedings.

WRITING STYLE:
...

# DETAIL LEVEL: STANDARD

Your content should be comprehensively informative while maintaining clarity:
...

# PROFESSIONAL DOCUMENTATION STANDARDS
...

# FUNCTIONAL STATUS BEST PRACTICES
...

# FUNCTIONAL STATUS SECTION

## AVAILABLE FUNCTIONAL INFORMATION:
mobilityStatus: Independent household ambulation; uses cane for community distances > 400m
...

## SPECIFIC CONTENT REQUIREMENTS:
...

## CONTENT ORGANIZATION:
...

## CRITICAL REMINDERS:
...
```

## Conclusion

Effective prompt engineering is essential for generating high-quality, professional report content. The structured approach described in this guide ensures consistency, accuracy, and adherence to professional standards across all report sections, while allowing for appropriate variations in style and detail level.

By following these guidelines and using the testing framework, you can maintain and improve the quality of generated report content over time.
