import React, { useState } from 'react';
import { UploadZone } from './components/UploadZone';
import { ScanningOverlay } from './components/ScanningOverlay';
import { AnalysisDashboard } from './components/AnalysisDashboard';
import { ForensicReport, AnalysisStatus } from './types';
import { performOfflineForensicAnalysis } from './lib/offlineDetector';

export default function App() {
  const [status, setStatus] = useState<AnalysisStatus>('idle');
  const [activeReport, setActiveReport] = useState<ForensicReport | null>(null);
  const [currentScanningImage, setCurrentScanningImage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Primary image processing handler
  const processImageAnalysis = async (file: File, dataUrl: string) => {
    setStatus('analyzing');
    setCurrentScanningImage(dataUrl);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/analyze-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: dataUrl,
          fileName: file.name,
          fileSize: file.size,
          mimeType: file.type || 'image/jpeg',
        }),
      });

      const data = await response.json();

      if (data.success && data.report) {
        try {
          const offlineELA = await performOfflineForensicAnalysis(file, dataUrl);
          data.report.elaCanvasDataUrl = offlineELA.elaCanvasDataUrl;
          data.report.exifData = offlineELA.exifData;
        } catch (e) {
          // ignore ELA enhancement if canvas blocked
        }

        setActiveReport(data.report);
        setStatus('completed');
      } else {
        throw new Error(data.error || 'Server analysis error');
      }
    } catch (err: any) {
      console.warn('Online analysis failed, triggering fallback:', err);
      try {
        const fallbackReport = await performOfflineForensicAnalysis(file, dataUrl);
        setActiveReport(fallbackReport);
        setStatus('completed');
      } catch (fallbackErr) {
        setErrorMessage('Failed to analyze image. Please try again.');
        setStatus('error');
      }
    }
  };

  const handleNewScan = () => {
    setActiveReport(null);
    setStatus('idle');
    setCurrentScanningImage(null);
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Main Content Body */}
      <main className="flex-1 pb-16 pt-8">
        {status === 'idle' && !activeReport && (
          <UploadZone
            onFileSelect={processImageAnalysis}
          />
        )}

        {status === 'analyzing' && currentScanningImage && (
          <ScanningOverlay
            imageDataUrl={currentScanningImage}
          />
        )}

        {status === 'completed' && activeReport && (
          <AnalysisDashboard report={activeReport} onNewScan={handleNewScan} />
        )}

        {status === 'error' && (
          <div className="max-w-md mx-auto my-16 p-6 text-center rounded-3xl bg-white border border-rose-200 shadow-xl">
            <h3 className="text-lg font-bold text-rose-600 mb-2">Analysis Error</h3>
            <p className="text-xs text-slate-600 mb-4">{errorMessage || 'Something went wrong.'}</p>
            <button
              onClick={handleNewScan}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-2xl transition shadow-md shadow-indigo-100"
            >
              Try Again
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
        <p>AI Deepfake & Image Forensic Detector</p>
      </footer>
    </div>
  );
}
