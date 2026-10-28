import React, { useState } from 'react';
import { ForensicCategory } from '../types';
import { Activity, Info, ShieldAlert, CheckCircle, AlertTriangle } from 'lucide-react';

interface ForensicMetricsProps {
  categories: ForensicCategory[];
}

export const ForensicMetrics: React.FC<ForensicMetricsProps> = ({ categories }) => {
  const [activeConcept, setActiveConcept] = useState<ForensicCategory | null>(null);

  const getRiskBadge = (risk: string, score: number) => {
    if (risk === 'HIGH' || score >= 70) {
      return {
        label: 'HIGH ANOMALY',
        bg: 'bg-rose-50 border-rose-200 text-rose-700',
        icon: ShieldAlert,
        bar: 'bg-gradient-to-r from-rose-400 to-pink-400',
      };
    }
    if (risk === 'MEDIUM' || score >= 35) {
      return {
        label: 'MODERATE RISK',
        bg: 'bg-amber-50 border-amber-200 text-amber-800',
        icon: AlertTriangle,
        bar: 'bg-gradient-to-r from-amber-400 to-orange-400',
      };
    }
    return {
      label: 'AUTHENTIC PATTERN',
      bg: 'bg-emerald-50 border-emerald-200 text-emerald-800',
      icon: CheckCircle,
      bar: 'bg-gradient-to-r from-emerald-400 to-teal-400',
    };
  };

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-sm">
      <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-100">
        <div className="flex items-center space-x-2">
          <Activity className="w-5 h-5 text-indigo-600" />
          <h3 className="text-base font-extrabold text-slate-800">Forensic Pillar Diagnostics</h3>
        </div>
        <span className="text-xs text-slate-500 font-medium">0-100 Anomaly Index</span>
      </div>

      <div className="space-y-4">
        {categories.map((cat) => {
          const badge = getRiskBadge(cat.riskLevel, cat.score);
          const BadgeIcon = badge.icon;

          return (
            <div
              key={cat.key}
              className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-indigo-100 transition"
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-bold text-slate-800">{cat.name}</span>
                  <button
                    onClick={() => setActiveConcept(cat)}
                    className="text-slate-400 hover:text-indigo-600 transition"
                    title="Click for 12th grade concept explanation"
                  >
                    <Info className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex items-center space-x-2">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border flex items-center space-x-1 ${badge.bg}`}
                  >
                    <BadgeIcon className="w-3 h-3" />
                    <span>{badge.label}</span>
                  </span>
                  <span className="font-mono text-xs font-extrabold text-slate-800 w-8 text-right">
                    {cat.score}%
                  </span>
                </div>
              </div>

              {/* Progress score bar */}
              <div className="w-full h-2.5 bg-slate-200/70 rounded-full overflow-hidden border border-slate-200/50 my-2">
                <div
                  className={`h-full ${badge.bar} transition-all duration-500 rounded-full`}
                  style={{ width: `${Math.max(4, cat.score)}%` }}
                />
              </div>

              <p className="text-xs text-slate-500 leading-normal">{cat.detail}</p>
            </div>
          );
        })}
      </div>

      {/* Concept Explanation Modal */}
      {activeConcept && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-md w-full shadow-2xl">
            <h4 className="text-lg font-bold text-slate-900 mb-2">{activeConcept.name}</h4>
            <p className="text-xs text-indigo-700 font-mono font-bold mb-3">
              Concept: {activeConcept.educationalConcept}
            </p>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              {activeConcept.detail}
            </p>
            <div className="p-3 bg-indigo-50/70 rounded-2xl border border-indigo-100 text-xs text-slate-700">
              <span className="font-bold text-indigo-900">12th Grade CS Key Takeaway:</span> In digital forensics, synthetic image generators fail to emulate microscopic physical light scattering and sensor noise consistency.
            </div>
            <button
              onClick={() => setActiveConcept(null)}
              className="mt-5 w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-2xl transition shadow-md shadow-indigo-100"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
