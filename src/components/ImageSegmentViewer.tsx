import React, { useState } from 'react';
import { ZoomIn, ZoomOut, RotateCcw, Layers, Eye, Crosshair, CheckCircle2 } from 'lucide-react';
import { SegmentRegion } from '../types';

interface ImageSegmentViewerProps {
  imageDataUrl: string;
  elaCanvasDataUrl?: string;
  segments: SegmentRegion[];
  verdict: string;
}

type LayerViewMode = 'SEGMENTS' | 'HEATMAP' | 'ELA' | 'ORIGINAL';

export const ImageSegmentViewer: React.FC<ImageSegmentViewerProps> = ({
  imageDataUrl,
  elaCanvasDataUrl,
  segments,
  verdict,
}) => {
  const [viewMode, setViewMode] = useState<LayerViewMode>('SEGMENTS');
  const [selectedSegment, setSelectedSegment] = useState<SegmentRegion | null>(
    segments.length > 0 ? segments[0] : null
  );
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(2.5, prev + 0.25));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(1, prev - 0.25));
  const handleZoomReset = () => setZoomLevel(1);

  // Helper for color badge based on anomaly type
  const getAnomalyColor = (type: string, score: number) => {
    if (type === 'AUTHENTIC' || score < 30) {
      return {
        border: 'border-emerald-500',
        bg: 'bg-emerald-500/15',
        text: 'text-emerald-800',
        badge: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      };
    }
    if (score >= 70) {
      return {
        border: 'border-rose-500',
        bg: 'bg-rose-500/15',
        text: 'text-rose-800',
        badge: 'bg-rose-100 text-rose-800 border-rose-200',
      };
    }
    return {
      border: 'border-amber-500',
      bg: 'bg-amber-500/15',
      text: 'text-amber-800',
      badge: 'bg-amber-100 text-amber-800 border-amber-200',
    };
  };

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-4 sm:p-6 shadow-sm">
      {/* Top Controls Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100">
        {/* Layer Mode Toggle */}
        <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-2xl border border-slate-200">
          <button
            onClick={() => setViewMode('SEGMENTS')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition ${
              viewMode === 'SEGMENTS'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Crosshair className="w-3.5 h-3.5" />
            <span>Segments ({segments.length})</span>
          </button>

          <button
            onClick={() => setViewMode('HEATMAP')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition ${
              viewMode === 'HEATMAP'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Heatmap</span>
          </button>

          {elaCanvasDataUrl && (
            <button
              onClick={() => setViewMode('ELA')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition ${
                viewMode === 'ELA'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>ELA Compression</span>
            </button>
          )}

          <button
            onClick={() => setViewMode('ORIGINAL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              viewMode === 'ORIGINAL'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Original
          </button>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center space-x-1 bg-slate-100 px-2 py-1 rounded-2xl border border-slate-200 text-slate-700">
          <button
            onClick={handleZoomOut}
            disabled={zoomLevel <= 1}
            className="p-1 hover:text-slate-900 disabled:opacity-30 transition"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-xs font-mono px-2 font-bold text-indigo-600">
            {Math.round(zoomLevel * 100)}%
          </span>
          <button
            onClick={handleZoomIn}
            disabled={zoomLevel >= 2.5}
            className="p-1 hover:text-slate-900 disabled:opacity-30 transition"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={handleZoomReset}
            className="p-1 hover:text-slate-900 transition ml-1 text-slate-400 hover:text-slate-600"
            title="Reset Zoom"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Image Stage Container */}
      <div className="relative w-full aspect-square sm:aspect-[4/3] bg-slate-50 rounded-2xl overflow-hidden border border-slate-200 flex items-center justify-center">
        <div
          className="relative w-full h-full flex items-center justify-center transition-transform duration-200 origin-center"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          {/* Base Image or ELA Image */}
          <img
            src={viewMode === 'ELA' && elaCanvasDataUrl ? elaCanvasDataUrl : imageDataUrl}
            alt="Analyzed target"
            className="w-full h-full object-contain pointer-events-none"
          />

          {/* HEATMAP LAYER OVERLAY */}
          {viewMode === 'HEATMAP' && (
            <div className="absolute inset-0 pointer-events-none">
              {segments.map((seg) => {
                const [ymin, xmin, ymax, xmax] = seg.box2d;
                const topPct = (ymin / 1000) * 100;
                const leftPct = (xmin / 1000) * 100;
                const widthPct = ((xmax - xmin) / 1000) * 100;
                const heightPct = ((ymax - ymin) / 1000) * 100;

                const color = getAnomalyColor(seg.anomalyType, seg.anomalyScore);

                return (
                  <div
                    key={'heatmap-' + seg.id}
                    className={`absolute ${color.bg} border ${color.border} rounded-lg filter blur-[2px] transition-opacity opacity-70`}
                    style={{
                      top: `${topPct}%`,
                      left: `${leftPct}%`,
                      width: `${widthPct}%`,
                      height: `${heightPct}%`,
                    }}
                  />
                );
              })}
            </div>
          )}

          {/* BOUNDING BOX SEGMENTS OVERLAY */}
          {(viewMode === 'SEGMENTS' || viewMode === 'HEATMAP') &&
            segments.map((seg) => {
              const [ymin, xmin, ymax, xmax] = seg.box2d;
              const topPct = (ymin / 1000) * 100;
              const leftPct = (xmin / 1000) * 100;
              const widthPct = ((xmax - xmin) / 1000) * 100;
              const heightPct = ((ymax - ymin) / 1000) * 100;

              const isSelected = selectedSegment?.id === seg.id;
              const color = getAnomalyColor(seg.anomalyType, seg.anomalyScore);

              return (
                <div
                  key={seg.id}
                  onClick={() => setSelectedSegment(seg)}
                  className={`absolute border-2 cursor-pointer transition-all ${color.border} ${
                    isSelected
                      ? 'bg-indigo-500/20 ring-4 ring-indigo-400/40 z-20 scale-[1.02]'
                      : 'hover:bg-slate-500/10 z-10'
                  } rounded-lg`}
                  style={{
                    top: `${topPct}%`,
                    left: `${leftPct}%`,
                    width: `${widthPct}%`,
                    height: `${heightPct}%`,
                  }}
                >
                  {/* Bounding Box Label Badge */}
                  <div
                    className={`absolute -top-6 left-0 px-2 py-0.5 rounded text-[10px] font-bold shadow-sm whitespace-nowrap flex items-center space-x-1 ${
                      isSelected
                        ? 'bg-indigo-600 text-white'
                        : 'bg-white/95 text-slate-800 border border-slate-200'
                    }`}
                  >
                    <span>{seg.label}</span>
                    <span className="font-mono text-[9px] opacity-80">({seg.anomalyScore}%)</span>
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* Segment Details Inspector Card */}
      {selectedSegment && (
        <div className="mt-4 p-4 rounded-2xl bg-indigo-50/50 border border-indigo-200/80 transition-all">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 animate-ping" />
              <h4 className="text-sm font-bold text-slate-800">{selectedSegment.label}</h4>
            </div>

            <div className="flex items-center space-x-2">
              <span
                className={`px-2 py-0.5 rounded-full text-[11px] font-bold border ${
                  getAnomalyColor(selectedSegment.anomalyType, selectedSegment.anomalyScore).badge
                }`}
              >
                {selectedSegment.anomalyType}
              </span>
              <span className="text-xs font-bold text-indigo-700 font-mono">
                Anomaly Score: {selectedSegment.anomalyScore}/100
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed mb-3">
            {selectedSegment.description}
          </p>

          {/* 12th Grade CS Explanation Box */}
          <div className="p-3 rounded-xl bg-white border border-indigo-100 text-xs shadow-sm">
            <div className="font-bold text-indigo-900 mb-1 flex items-center space-x-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
              <span>12th Grade Forensic Analysis Note:</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              {selectedSegment.explanation12thGrade}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
