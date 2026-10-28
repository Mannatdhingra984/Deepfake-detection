import React, { useRef, useState, useEffect } from 'react';
import { Upload, Image as ImageIcon, Sparkles, AlertCircle } from 'lucide-react';

interface UploadZoneProps {
  onFileSelect: (file: File, dataUrl: string) => void;
}

export const UploadZone: React.FC<UploadZoneProps> = ({
  onFileSelect,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      processSelectedFile(files[0]);
    }
  };

  const processSelectedFile = (file: File) => {
    setErrorMessage(null);
    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please select a valid image file (JPEG, PNG, WEBP, GIF).');
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      setErrorMessage('Image size exceeds 20MB limit. Please upload a smaller image.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        onFileSelect(file, event.target.result as string);
      }
    };
    reader.onerror = () => setErrorMessage('Error reading file.');
    reader.readAsDataURL(file);
  };

  // Drag & drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processSelectedFile(e.dataTransfer.files[0]);
    }
  };

  // Clipboard paste listener
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (items) {
        for (let i = 0; i < items.length; i++) {
          if (items[i].type.indexOf('image') !== -1) {
            const blob = items[i].getAsFile();
            if (blob) {
              const file = new File([blob], `pasted-image-${Date.now()}.png`, { type: blob.type });
              processSelectedFile(file);
              break;
            }
          }
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      {/* Title & Introduction */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold mb-3 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
          <span>AI Forensic Detection Engine</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-800 tracking-tight">
          AI Deepfake & Image Forensic Detector
        </h1>
        <p className="mt-3 text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Upload any picture to analyze pupil specular reflections, skin/hair texture continuity,
          Error Level Analysis (ELA) compression, and EXIF metadata to identify AI synthesis or digital edits.
        </p>
      </div>

      {/* Main Drag-and-Drop Box */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-3xl p-10 sm:p-14 text-center transition-all cursor-pointer ${
          isDragging
            ? 'border-indigo-400 bg-indigo-50/80 scale-[1.01] shadow-lg'
            : 'border-slate-300 bg-white/90 hover:border-indigo-300 hover:bg-slate-50/80 shadow-sm'
        }`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="w-20 h-20 rounded-2xl bg-indigo-100/70 border border-indigo-200/60 flex items-center justify-center text-indigo-600 shadow-sm">
            <Upload className="w-9 h-9" />
          </div>

          <div>
            <h3 className="text-xl font-bold text-slate-800">
              Drag & Drop your picture here
            </h3>
            <p className="text-xs text-slate-500 mt-1.5">
              Supports JPEG, PNG, WEBP, GIF (Max 20MB) &bull; Direct Paste (Ctrl+V)
            </p>
          </div>

          {/* Single Action Button: Select File */}
          <div className="pt-3">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
              className="inline-flex items-center space-x-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-2xl transition shadow-md shadow-indigo-200"
            >
              <ImageIcon className="w-4 h-4" />
              <span>Select File</span>
            </button>
          </div>
        </div>
      </div>

      {/* Error Banner if any */}
      {errorMessage && (
        <div className="mt-4 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-center space-x-2 shadow-sm">
          <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
};
