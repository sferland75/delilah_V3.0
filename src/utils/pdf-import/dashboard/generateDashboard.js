/**
 * Pattern Recognition Dashboard Generator
 * 
 * Creates a visualization dashboard to monitor pattern effectiveness
 * and success rates for field extraction.
 */

const fs = require('fs');
const path = require('path');

// Paths
const META_ANALYSIS_PATH = path.resolve(__dirname, '../../../../pattern_repository/expanded_dataset/meta_analysis.json');
const SUMMARY_REPORT_PATH = path.resolve(__dirname, '../../../../pattern_repository/expanded_dataset/summary_report.md');
const DASHBOARD_OUTPUT_PATH = path.resolve(__dirname, '../../../../pattern_repository/dashboard');
const DASHBOARD_HTML_PATH = path.resolve(DASHBOARD_OUTPUT_PATH, 'index.html');

/**
 * Generate the HTML dashboard
 */
function generateDashboard() {
  console.log('Generating pattern recognition dashboard...');
  
  // Create output directory if it doesn't exist
  if (!fs.existsSync(DASHBOARD_OUTPUT_PATH)) {
    fs.mkdirSync(DASHBOARD_OUTPUT_PATH, { recursive: true });
  }
  
  // Load meta analysis data
  const metaAnalysis = require(META_ANALYSIS_PATH);
  console.log(`Loaded analysis data for ${metaAnalysis.totalFiles} files`);
  
  // Generate section confidence chart data
  const sectionConfidenceData = generateSectionConfidenceData(metaAnalysis);
  
  // Generate field extraction success data
  const fieldExtractionData = generateFieldExtractionData(metaAnalysis);
  
  // Generate pattern effectiveness data
  const patternEffectivenessData = generatePatternEffectivenessData(metaAnalysis);
  
  // Generate document processing data
  const processingData = generateProcessingData(metaAnalysis);
  
  // Generate HTML
  const html = generateHtml(
    sectionConfidenceData,
    fieldExtractionData,
    patternEffectivenessData,
    processingData,
    metaAnalysis
  );
  
  // Write HTML to file
  fs.writeFileSync(DASHBOARD_HTML_PATH, html);
  console.log(`Dashboard generated at: ${DASHBOARD_HTML_PATH}`);
}

/**
 * Generate section confidence data for charting
 * @param {Object} metaAnalysis - Meta analysis data
 * @returns {Object} Chart data
 */
function generateSectionConfidenceData(metaAnalysis) {
  const sections = [];
  const avgConfidence = [];
  const minConfidence = [];
  const maxConfidence = [];
  
  Object.entries(metaAnalysis.confidenceScores)
    .sort((a, b) => b[1].average - a[1].average)
    .forEach(([section, data]) => {
      sections.push(section);
      avgConfidence.push((data.average * 100).toFixed(1));
      minConfidence.push((data.min * 100).toFixed(1));
      maxConfidence.push((data.max * 100).toFixed(1));
    });
  
  return {
    sections,
    avgConfidence,
    minConfidence,
    maxConfidence
  };
}

/**
 * Generate field extraction success data for charting
 * @param {Object} metaAnalysis - Meta analysis data
 * @returns {Object} Chart data
 */
function generateFieldExtractionData(metaAnalysis) {
  const fieldData = Object.entries(metaAnalysis.fieldExtraction)
    .map(([field, count]) => {
      const [section, fieldName] = field.split('.');
      const sectionCount = metaAnalysis.sectionOccurrences[section] || 1;
      const successRate = (count / sectionCount * 100).toFixed(1);
      
      return {
        field,
        section,
        fieldName,
        count,
        successRate,
        sectionCount
      };
    })
    .sort((a, b) => b.successRate - a.successRate);
  
  // Top performing fields
  const topFields = fieldData.slice(0, 15);
  
  // Group by section
  const sectionGroups = {};
  fieldData.forEach(item => {
    if (!sectionGroups[item.section]) {
      sectionGroups[item.section] = [];
    }
    sectionGroups[item.section].push(item);
  });
  
  // Calculate section averages
  const sectionAverages = {};
  Object.entries(sectionGroups).forEach(([section, fields]) => {
    const total = fields.reduce((sum, field) => sum + parseFloat(field.successRate), 0);
    sectionAverages[section] = (total / fields.length).toFixed(1);
  });
  
  return {
    topFields,
    sectionGroups,
    sectionAverages,
    allFields: fieldData
  };
}

/**
 * Generate pattern effectiveness data for charting
 * @param {Object} metaAnalysis - Meta analysis data
 * @returns {Object} Chart data
 */
function generatePatternEffectivenessData(metaAnalysis) {
  // This is a placeholder - in a real implementation, 
  // we would analyze individual pattern matches from the pattern files
  return {
    patterns: [],
    effectiveness: []
  };
}

/**
 * Generate document processing data for charting
 * @param {Object} metaAnalysis - Meta analysis data
 * @returns {Object} Chart data
 */
function generateProcessingData(metaAnalysis) {
  return {
    totalFiles: metaAnalysis.totalFiles,
    processingTime: (metaAnalysis.processingTime / 1000).toFixed(1),
    avgTimePerFile: (metaAnalysis.processingTime / metaAnalysis.totalFiles / 1000).toFixed(1)
  };
}

/**
 * Generate HTML dashboard
 * @param {Object} sectionConfidenceData - Section confidence chart data
 * @param {Object} fieldExtractionData - Field extraction success data
 * @param {Object} patternEffectivenessData - Pattern effectiveness data
 * @param {Object} processingData - Document processing data
 * @param {Object} metaAnalysis - Full meta analysis data
 * @returns {string} HTML content
 */
function generateHtml(
  sectionConfidenceData,
  fieldExtractionData,
  patternEffectivenessData,
  processingData,
  metaAnalysis
) {
  // Convert data to JSON strings for embedding in JavaScript
  const sectionDataJson = JSON.stringify(sectionConfidenceData);
  const fieldDataJson = JSON.stringify(fieldExtractionData);
  const patternDataJson = JSON.stringify(patternEffectivenessData);
  const processingDataJson = JSON.stringify(processingData);
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Pattern Recognition Dashboard</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      padding: 20px;
      background-color: #f8f9fa;
    }
    .dashboard-header {
      margin-bottom: 30px;
      border-bottom: 1px solid #dee2e6;
      padding-bottom: 15px;
    }
    .card {
      margin-bottom: 20px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    .card-header {
      font-weight: 600;
      background-color: #f1f4f9;
    }
    .stats-box {
      text-align: center;
      padding: 20px;
      border-radius: 5px;
      background-color: #fff;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    .stats-value {
      font-size: 24px;
      font-weight: bold;
      color: #2c3e50;
    }
    .stats-label {
      color: #7b8a8b;
      font-size: 14px;
    }
    .table-container {
      max-height: 400px;
      overflow-y: auto;
    }
    .field-success-high {
      background-color: #d4edda;
    }
    .field-success-medium {
      background-color: #fff3cd;
    }
    .field-success-low {
      background-color: #f8d7da;
    }
  </style>
</head>
<body>
  <div class="container-fluid">
    <div class="dashboard-header">
      <h1>Pattern Recognition Dashboard</h1>
      <p class="text-muted">Analysis of ${processingData.totalFiles} documents - Generated on ${new Date().toLocaleString()}</p>
    </div>
    
    <!-- Stats Overview Row -->
    <div class="row mb-4">
      <div class="col-md-3">
        <div class="stats-box">
          <div class="stats-value">${processingData.totalFiles}</div>
          <div class="stats-label">Documents Analyzed</div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="stats-box">
          <div class="stats-value">${Object.keys(metaAnalysis.sectionOccurrences).length}</div>
          <div class="stats-label">Section Types</div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="stats-box">
          <div class="stats-value">${processingData.processingTime} s</div>
          <div class="stats-label">Total Processing Time</div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="stats-box">
          <div class="stats-value">${processingData.avgTimePerFile} s</div>
          <div class="stats-label">Avg. Time Per Document</div>
        </div>
      </div>
    </div>
    
    <div class="row">
      <!-- Section Confidence Chart -->
      <div class="col-md-6">
        <div class="card">
          <div class="card-header">
            Section Confidence Scores
          </div>
          <div class="card-body">
            <canvas id="sectionConfidenceChart"></canvas>
          </div>
        </div>
      </div>
      
      <!-- Top Field Extraction Success -->
      <div class="col-md-6">
        <div class="card">
          <div class="card-header">
            Top Field Extraction Success Rates
          </div>
          <div class="card-body">
            <canvas id="fieldExtractionChart"></canvas>
          </div>
        </div>
      </div>
    </div>
    
    <div class="row">
      <!-- Section Average Success Rates -->
      <div class="col-md-6">
        <div class="card">
          <div class="card-header">
            Section Average Success Rates
          </div>
          <div class="card-body">
            <canvas id="sectionAverageChart"></canvas>
          </div>
        </div>
      </div>
      
      <!-- Processing Time Analysis -->
      <div class="col-md-6">
        <div class="card">
          <div class="card-header">
            Section Occurrences
          </div>
          <div class="card-body">
            <canvas id="sectionOccurrencesChart"></canvas>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Field Extraction Details Table -->
    <div class="card mt-4">
      <div class="card-header">
        Field Extraction Details
      </div>
      <div class="card-body">
        <div class="table-container">
          <table class="table table-striped table-hover">
            <thead>
              <tr>
                <th>Field</th>
                <th>Section</th>
                <th>Successful Extractions</th>
                <th>Success Rate</th>
              </tr>
            </thead>
            <tbody id="fieldDetailsTable">
              <!-- Field rows will be inserted here by JavaScript -->
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>

  <script>
    // Section confidence chart
    const sectionConfidenceData = ${sectionDataJson};
    const fieldExtractionData = ${fieldDataJson};
    const patternData = ${patternDataJson};
    const processingData = ${processingDataJson};
    
    // Create section confidence chart
    const sectionCtx = document.getElementById('sectionConfidenceChart').getContext('2d');
    new Chart(sectionCtx, {
      type: 'bar',
      data: {
        labels: sectionConfidenceData.sections,
        datasets: [
          {
            label: 'Average Confidence (%)',
            data: sectionConfidenceData.avgConfidence,
            backgroundColor: 'rgba(54, 162, 235, 0.7)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
          },
          {
            label: 'Min Confidence (%)',
            data: sectionConfidenceData.minConfidence,
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1
          },
          {
            label: 'Max Confidence (%)',
            data: sectionConfidenceData.maxConfidence,
            backgroundColor: 'rgba(75, 192, 192, 0.5)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
          }
        ]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            title: {
              display: true,
              text: 'Confidence (%)'
            }
          }
        },
        plugins: {
          title: {
            display: true,
            text: 'Section Confidence Scores'
          }
        }
      }
    });
    
    // Create field extraction success chart
    const fieldCtx = document.getElementById('fieldExtractionChart').getContext('2d');
    new Chart(fieldCtx, {
      type: 'bar',
      data: {
        labels: fieldExtractionData.topFields.map(f => f.field),
        datasets: [{
          label: 'Success Rate (%)',
          data: fieldExtractionData.topFields.map(f => f.successRate),
          backgroundColor: fieldExtractionData.topFields.map(f => {
            const rate = parseFloat(f.successRate);
            if (rate > 100) return 'rgba(40, 167, 69, 0.7)';
            if (rate > 50) return 'rgba(23, 162, 184, 0.7)';
            if (rate > 10) return 'rgba(255, 193, 7, 0.7)';
            return 'rgba(220, 53, 69, 0.7)';
          }),
          borderWidth: 1
        }]
      },
      options: {
        indexAxis: 'y',
        scales: {
          x: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Success Rate (%)'
            }
          }
        },
        plugins: {
          title: {
            display: true,
            text: 'Top 15 Field Extraction Success Rates'
          }
        }
      }
    });
    
    // Create section average chart
    const sectionAvgCtx = document.getElementById('sectionAverageChart').getContext('2d');
    const sectionLabels = Object.keys(fieldExtractionData.sectionAverages);
    const sectionAvgs = sectionLabels.map(s => fieldExtractionData.sectionAverages[s]);
    
    new Chart(sectionAvgCtx, {
      type: 'bar',
      data: {
        labels: sectionLabels,
        datasets: [{
          label: 'Average Success Rate (%)',
          data: sectionAvgs,
          backgroundColor: 'rgba(153, 102, 255, 0.7)',
          borderColor: 'rgba(153, 102, 255, 1)',
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Avg. Success Rate (%)'
            }
          }
        },
        plugins: {
          title: {
            display: true,
            text: 'Section Average Field Extraction Success'
          }
        }
      }
    });
    
    // Create section occurrences chart
    const occurrencesCtx = document.getElementById('sectionOccurrencesChart').getContext('2d');
    
    // Get section occurrences data from meta analysis
    const sectionOccurrences = ${JSON.stringify(Object.entries(metaAnalysis.sectionOccurrences))};
    
    new Chart(occurrencesCtx, {
      type: 'pie',
      data: {
        labels: sectionOccurrences.map(item => item[0]),
        datasets: [{
          data: sectionOccurrences.map(item => item[1]),
          backgroundColor: [
            'rgba(255, 99, 132, 0.7)',
            'rgba(54, 162, 235, 0.7)',
            'rgba(255, 206, 86, 0.7)',
            'rgba(75, 192, 192, 0.7)',
            'rgba(153, 102, 255, 0.7)',
            'rgba(255, 159, 64, 0.7)',
            'rgba(199, 199, 199, 0.7)',
            'rgba(83, 102, 255, 0.7)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        plugins: {
          title: {
            display: true,
            text: 'Section Occurrences in Documents'
          }
        }
      }
    });
    
    // Populate field details table
    const tableBody = document.getElementById('fieldDetailsTable');
    fieldExtractionData.allFields.forEach(field => {
      const row = document.createElement('tr');
      
      // Add CSS class based on success rate
      const successRate = parseFloat(field.successRate);
      if (successRate > 70) {
        row.classList.add('field-success-high');
      } else if (successRate > 20) {
        row.classList.add('field-success-medium');
      } else {
        row.classList.add('field-success-low');
      }
      
      row.innerHTML = \`
        <td>\${field.fieldName}</td>
        <td>\${field.section}</td>
        <td>\${field.count}</td>
        <td>\${field.successRate}%</td>
      \`;
      
      tableBody.appendChild(row);
    });
  </script>
</body>
</html>`;
}

// Run the generator
try {
  generateDashboard();
} catch (error) {
  console.error('Error generating dashboard:', error);
  process.exit(1);
}

module.exports = { generateDashboard };
