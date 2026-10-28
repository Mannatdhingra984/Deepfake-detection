import React, { useEffect, useState } from 'react';
import { Loader2, ShieldCheck, Cpu, Eye, Layers } from 'lucide-react';

interface ScanningOverlayProps {
  imageDataUrl: string;
}

const STEPS = [
  { icon: Layers, label: 'Matrix Downsampling & Color Space Normalization' },
  { icon: Cpu, label: 'Spatial Frequency & GAN Noise Feature Extraction' },
  { icon: Eye, label: 'Pupil Specular Highlight & Biometric Vector Test' },
  { icon: ShieldCheck, label: 'Generating AI Forensic Detection Score' },
];

export const ScanningOverlay: React.FC<ScanningOverlayProps> = ({
  imageDataUrl,
}) => {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev < STEPS.length - 1 ? prev + 1 : prev));
    }, 900);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-16 text-center">
      <div className="relative w-48 h-48 mx-auto mb-8 rounded-2xl overflow-hidden border-2 border-indigo-200 shadow-xl bg-slate-100">
        <img
          src={imageDataUrl}
          alt="Scanning target"
          className="w-full h-full object-cover opacity-80"
        />

        {/* Laser scanner line animation */}
        <div
          className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent shadow-[0_0_12px_rgba(99,102,241,0.8)] animate-pulse"
          style={{ animation: 'scan 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }}
        />

        {/* Grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />
      </div>

      <h2 className="text-xl font-extrabold text-slate-800 flex items-center justify-center space-x-2">
        <Loader2 className="w-5 h-5 text-indigo-600 animate-spin" />
        <span>Running Real-Time Forensic Pipeline...</span>
      </h2>

      <p className="text-xs text-slate-500 mt-1.5">
        Analyzing picture features for AI deepfake and synthesis detection
      </p>

      {/* Progress Steps List */}
      <div className="mt-8 space-y-3 max-w-md mx-auto text-left">
        {STEPS.map((step, idx) => {
          const IconComponent = step.icon;
          const isDone = idx < currentStep;
          const isCurrent = idx === currentStep;

          return (
            <div
              key={idx}
              className={`flex items-center space-x-3 p-3 rounded-xl border transition-all ${
                isDone
                  ? 'bg-emerald-50/60 border-emerald-200 text-slate-700'
                  : isCurrent
                  ? 'bg-indigo-50 border-indigo-300 text-indigo-900 shadow-sm'
                  : 'bg-white/60 border-slate-200 text-slate-400'
              }`}
            >
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${
                  isDone
                    ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                    : isCurrent
                    ? 'bg-indigo-600 text-white animate-pulse'
                    : 'bg-slate-100 text-slate-400'
                }`}
              >
                {isDone ? '✓' : <IconComponent className="w-3.5 h-3.5" />}
              </div>

              <span className="text-xs font-semibold leading-tight">{step.label}</span>
            </div>
          );
        })}
      </div>

      <style>{`
        @keyframes scan {
          0% { top: 0%; }
          50% { top: 100%; }
          100% { top: 0%; }
        }
      `}</style>
    </div>
  );
};
