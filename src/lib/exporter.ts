import { ForensicReport } from '../types';

/**
 * Generates a downloadable JSON file of the forensic report
 */
export function exportReportToJson(report: ForensicReport) {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(report, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', `deeptruth-forensic-${report.id}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

/**
 * Generates a CSV export of forensic metrics & segment regions
 */
export function exportReportToCsv(report: ForensicReport) {
  const rows = [
    ['DeepTruth AI Forensic Analysis Report'],
    ['Report ID', report.id],
    ['Timestamp', report.timestamp],
    ['File Name', report.fileName],
    ['Verdict', report.verdict],
    ['Confidence Percentage', `${report.confidencePercentage}%`],
    ['Analysis Mode', report.analysisMode],
    ['Summary', `"${report.summary.replace(/"/g, '""')}"`],
    [],
    ['Forensic Category Breakdown'],
    ['Category Name', 'Score (0-100 Anomaly)', 'Risk Level', 'Details'],
    ...report.categories.map((c) => [c.name, c.score, c.riskLevel, `"${c.detail.replace(/"/g, '""')}"`]),
    [],
    ['Segment Analysis Regions'],
    ['Region Label', 'Type', 'Anomaly Score', 'Bounding Box [ymin, xmin, ymax, xmax]', '12th Grade Explanation'],
    ...report.segments.map((s) => [
      s.label,
      s.anomalyType,
      s.anomalyScore,
      `"[${s.box2d.join(', ')}]"` ,
      `"${s.explanation12thGrade.replace(/"/g, '""')}"`,
    ]),
  ];

  const csvContent = 'data:text/csv;charset=utf-8,' + rows.map((e) => e.join(',')).join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `deeptruth-forensic-${report.id}.csv`);
  document.body.appendChild(link);
  link.click();
  link.remove();
}

/**
 * Triggers a formatted browser print view configured specifically as a PDF report
 */
export function printFormattedPdfReport(report: ForensicReport) {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Please allow popups to generate the printable PDF report.');
    return;
  }

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>DeepTruth Forensic Lab Report - ${report.id}</title>
        <style>
          body { font-family: system-ui, -apple-system, sans-serif; color: #0f172a; padding: 40px; margin: 0; background: #ffffff; }
          .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #e2e8f0; padding-bottom: 20px; margin-bottom: 30px; }
          .logo { font-size: 24px; font-weight: 800; color: #1e1b4b; }
          .badge { background: #e0e7ff; color: #3730a3; padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 700; }
          .verdict-box { background: ${
            report.verdict === 'AI_GENERATED' ? '#fef2f2' : report.verdict === 'AI_ALTERED' ? '#fffbe1' : '#f0fdf4'
          }; border: 1px solid ${
            report.verdict === 'AI_GENERATED' ? '#fca5a5' : report.verdict === 'AI_ALTERED' ? '#fde047' : '#86efac'
          }; padding: 20px; border-radius: 12px; margin-bottom: 30px; }
          .verdict-title { font-size: 20px; font-weight: 800; color: ${
            report.verdict === 'AI_GENERATED' ? '#991b1b' : report.verdict === 'AI_ALTERED' ? '#854d0e' : '#166534'
          }; }
          .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px; }
          .card { border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; }
          .card-title { font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em; color: #64748b; font-weight: 700; margin-bottom: 8px; }
          table { width: 100%; border-collapse: collapse; margin-top: 15px; }
          th, td { border: 1px solid #e2e8f0; padding: 10px; text-align: left; font-size: 13px; }
          th { background: #f8fafc; font-weight: 700; }
          .footer { margin-top: 40px; border-top: 1px solid #e2e8f0; padding-top: 20px; font-size: 12px; color: #94a3b8; text-align: center; }
          @media print { body { padding: 0; } }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="logo">DeepTruth AI Forensic Lab</div>
            <div style="font-size: 13px; color: #64748b; margin-top: 4px;">Grade 12 Computer Science Forensic Diagnostic</div>
          </div>
          <div>
            <span class="badge">${report.analysisMode}</span>
          </div>
        </div>

        <div class="verdict-box">
          <div class="verdict-title">VERDICT: ${report.verdict.replace('_', ' ')} (${report.confidencePercentage}% Confidence)</div>
          <p style="margin: 8px 0 0 0; font-size: 14px; line-height: 1.5; color: #334155;">${report.summary}</p>
        </div>

        <div class="grid">
          <div class="card">
            <div class="card-title">File Metadata</div>
            <div style="font-size: 13px; line-height: 1.6;">
              <strong>File Name:</strong> ${report.fileName}<br/>
              <strong>Date Analyzed:</strong> ${report.timestamp}<br/>
              <strong>Dimensions:</strong> ${report.dimensions.width} x ${report.dimensions.height} px<br/>
              ${report.exifData?.cameraModel ? `<strong>Camera Model:</strong> ${report.exifData.cameraModel}<br/>` : ''}
              ${report.exifData?.software ? `<strong>Software Tag:</strong> ${report.exifData.software}<br/>` : ''}
            </div>
          </div>
          <div class="card">
            <div class="card-title">Forensic Category Scores</div>
            <div style="font-size: 13px; line-height: 1.6;">
              ${report.categories.map((c) => `<div><strong>${c.name}:</strong> ${c.score}/100 (${c.riskLevel})</div>`).join('')}
            </div>
          </div>
        </div>

        <h3>Segment Region Analysis (${report.segments.length} Regions Tagged)</h3>
        <table>
          <thead>
            <tr>
              <th>Region</th>
              <th>Anomaly Type</th>
              <th>Score</th>
              <th>12th Grade CS Explanation</th>
            </tr>
          </thead>
          <tbody>
            ${report.segments
              .map(
                (s) => `
              <tr>
                <td><strong>${s.label}</strong></td>
                <td>${s.anomalyType}</td>
                <td>${s.anomalyScore}/100</td>
                <td>${s.explanation12thGrade}</td>
              </tr>
            `
              )
              .join('')}
          </tbody>
        </table>

        <h3>Educational Computer Science Insights</h3>
        <ul style="font-size: 13px; line-height: 1.6; color: #334155;">
          ${report.educationalNotes
            .map(
              (n) => `
            <li><strong>${n.concept} (${n.technicalTerm}):</strong> ${n.explanation}</li>
          `
            )
            .join('')}
        </ul>

        <div class="footer">
          Generated by DeepTruth AI Deepfake Forensic System &bull; 12th Grade STEM Curriculum Standard
        </div>

        <script>
          window.onload = function() {
            setTimeout(function() { window.print(); }, 500);
          }
        </script>
      </body>
    </html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
}

/**
 * Copies a neat summary card text to clipboard
 */
export async function copyReportSummaryToClipboard(report: ForensicReport): Promise<boolean> {
  const text = `🔍 DeepTruth Forensic Report
Verdict: ${report.verdict.replace('_', ' ')} (${report.confidencePercentage}% Confidence)
File: ${report.fileName}
Mode: ${report.analysisMode}

Summary: ${report.summary}

Top Category Scores:
${report.categories.map((c) => `• ${c.name}: ${c.score}/100 (${c.riskLevel})`).join('\n')}

Segment Regions Tagged: ${report.segments.length}
Analyzed via DeepTruth Forensic Lab (12th Grade CS Tool)`;

  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    return false;
  }
}
