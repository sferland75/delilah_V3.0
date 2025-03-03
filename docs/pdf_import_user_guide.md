# PDF Import Feature User Guide

## Overview

The PDF Import feature in Delilah V3.0 allows you to extract data from existing PDF documents directly into your assessments. This powerful tool can save you significant time by automatically detecting and extracting relevant information from:

- Previous OT assessment reports
- Medical reports and records
- Client intake forms

## How to Access

1. From the main dashboard, click on **Import PDF** in the main navigation menu
2. Alternatively, when creating a new assessment, select the **Import from PDF** option

## Using the PDF Import Feature

### Step 1: Select a PDF File

1. Click the **Select PDF File** button or drag and drop a PDF into the designated area
2. The file will upload and the system will begin processing it

### Step 2: Review Extracted Data

Once processing is complete, you'll see a screen showing all the sections where data was extracted:

- Each section displays a **confidence score** indicating the reliability of the extracted data
- Higher confidence scores (70-100%) indicate the system is very confident in the extraction
- Medium confidence scores (40-70%) may require review
- Low confidence scores (below 40%) should be carefully verified

### Step 3: Select Sections to Import

1. Review each section by clicking on the section name to expand and view the extracted data
2. Check or uncheck the sections you want to import
3. By default, sections with high confidence scores are pre-selected

### Step 4: Import Data

1. Click the **Import Selected** button to import the data into your assessment
2. The data will be merged with any existing information in your assessment
3. You can always edit the imported data later

## Understanding Confidence Scores

The system analyzes your PDF and assigns confidence scores based on:

- **Text clarity** - How clearly the text can be read
- **Section organization** - How well-defined the sections are
- **Data completeness** - How much of the expected data is present
- **Pattern recognition** - How well the content matches expected patterns

| Score Range | Indicator | Recommendation |
|-------------|-----------|----------------|
| 80-100% | Green | High confidence - can generally be trusted |
| 60-79% | Blue | Good confidence - quick review recommended |
| 40-59% | Yellow | Medium confidence - review before using |
| 0-39% | Red | Low confidence - careful verification needed |

## Tips for Best Results

1. **Use structured reports** - PDFs with clear section headings work best
2. **Text-based PDFs** - Searchable PDFs extract better than scanned documents
3. **Common terminology** - Standard medical and OT terminology is better recognized
4. **Complete information** - More comprehensive reports yield better results
5. **Document quality** - High-quality PDFs without artifacts or formatting issues work best

## Troubleshooting

### No Data Extracted

If no data is extracted from your PDF, check:

- The PDF is text-based and not just an image
- The PDF is not password protected
- The content uses standard OT assessment terminology
- The PDF isn't corrupted or damaged

### Low Confidence Scores

If you see low confidence scores:

- Check if the PDF has clear section headings
- Verify the text is searchable (you can select and copy text)
- Confirm the document contains the expected information
- Try another format if available

### Incorrect Extraction

If data is extracted into the wrong sections:

1. Uncheck those sections before importing
2. Manually add the information to the correct sections
3. Let us know so we can improve the extraction algorithms

## Getting Help

If you encounter any issues with the PDF import feature:

- Click the **Help** button in the import interface for contextual guidance
- Contact technical support at support@delilah.example.com
- Check the knowledge base for known issues and solutions

---

*Note: The PDF import feature is designed to assist with data entry but should not replace professional judgment. Always review imported data for accuracy and completeness before finalizing your assessment.*
