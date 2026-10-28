import React from 'react';
import { ForensicReport } from '../types';
import { ShieldAlert, ShieldCheck, AlertTriangle, RotateCcw, Sparkles } from 'lucide-react';

interface AnalysisDashboardProps {
  report: ForensicReport;
  onNewScan: () => void;
}

export const AnalysisDashboard: React.FC<AnalysisDashboardProps> = ({ report, onNewScan }) => {
  // Calculate AI probability vs Real probability
  let aiPercentage = 0;
  let realPercentage = 0;

  if (report.verdict === 'AI_GENERATED') {
    aiPercentage = report.confidencePercentage;
    realPercentage = 100 - aiPercentage;
  } else if (report.verdict === 'AI_ALTERED') {
    aiPercentage = report.confidencePercentage;
    realPercentage = 100 - aiPercentage;
  } else {
    realPercentage = report.confidencePercentage;
    aiPercentage = 100 - realPercentage;
  }

  const isAi = report.verdict !== 'REAL_PHOTOGRAPH';

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-8 space-y-6">
      {/* Primary Result Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm text-center">
        {/* Badge */}
        <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full text-xs font-bold mb-6 bg-indigo-50 text-indigo-700 border border-indigo-100">
          <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
          <span>Analysis Outcome</span>
        </div>

        {/* Large Image Preview with Percentage Overlay */}
        <div className="relative w-full max-w-sm mx-auto aspect-square rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 shadow-sm mb-6 flex items-center justify-center">
          <img
            src={report.imageDataUrl}
            alt="Analyzed subject"
            className="w-full h-full object-contain"
          />

          {/* Floating Pill Badge */}
          <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 px-4 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-slate-200 text-xs font-extrabold text-slate-800 shadow-md">
            {isAi ? `${aiPercentage}% AI Generated` : `${realPercentage}% Real Photograph`}
          </div>
        </div>

        {/* Main Big Percentage Heading */}
        <div className="space-y-2 mb-6">
          <div className="text-5xl sm:text-6xl font-black font-mono tracking-tight text-slate-900">
            {isAi ? `${aiPercentage}%` : `${realPercentage}%`}
          </div>
          <div
            className={`text-lg sm:text-xl font-bold tracking-tight ${
              report.verdict === 'AI_GENERATED'
                ? 'text-rose-600'
                : report.verdict === 'AI_ALTERED'
                ? 'text-amber-600'
                : 'text-emerald-600'
            }`}
          >
            {report.verdict === 'AI_GENERATED'
              ? 'Likely AI Generated'
              : report.verdict === 'AI_ALTERED'
              ? 'Likely AI Altered / Deepfake'
              : 'Likely Authentic Real Photo'}
          </div>
        </div>

        {/* Comparison Bar */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 mb-6 text-left">
          <div className="flex justify-between text-xs font-bold text-slate-600 mb-2">
            <span className="text-rose-600">AI Generated: {aiPercentage}%</span>
            <span className="text-emerald-600">Real Photo: {realPercentage}%</span>
          </div>

          <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden flex">
            <div
              className="h-full bg-gradient-to-r from-rose-400 to-pink-500 transition-all duration-700"
              style={{ width: `${aiPercentage}%` }}
            />
            <div
              className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 transition-all duration-700"
              style={{ width: `${realPercentage}%` }}
            />
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={onNewScan}
          className="w-full py-3.5 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-2xl transition shadow-md shadow-indigo-100 flex items-center justify-center space-x-2"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Analyze Another Picture</span>
        </button>
      </div>
    </div>
  );
};
