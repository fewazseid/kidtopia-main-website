import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Upload, Link as LinkIcon, FolderOpen, Image as ImageIcon, Check, AlertCircle, RefreshCw } from 'lucide-react';

export function convertGoogleDriveUrl(url: string): string {
  if (!url) return '';
  const trimmed = url.trim();
  if (!trimmed) return '';

  let fileId = '';
  const fileDMatch = trimmed.match(/\/(?:file\/)?d\/([a-zA-Z0-9_-]+)/);
  if (fileDMatch && fileDMatch[1]) {
    fileId = fileDMatch[1];
  } else {
    const idMatch = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (idMatch && idMatch[1]) {
      fileId = idMatch[1];
    }
  }

  if (fileId) {
    return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1600`;
  }

  return trimmed;
}

export function extractDriveFileId(url: string): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  const fileDMatch = trimmed.match(/\/(?:file\/)?d\/([a-zA-Z0-9_-]+)/);
  if (fileDMatch && fileDMatch[1]) return fileDMatch[1];
  const idMatch = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (idMatch && idMatch[1]) return idMatch[1];
  return null;
}

interface ImageSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (imageUrl: string, title?: string) => void;
  initialUrl?: string;
  initialTitle?: string;
  showTitleField?: boolean;
  modalTitle?: string;
}

export const ImageSelectModal: React.FC<ImageSelectModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  initialUrl = '',
  initialTitle = '',
  showTitleField = false,
  modalTitle = 'Select or Edit Photo'
}) => {
  const [activeTab, setActiveTab] = useState<'drive' | 'upload' | 'url'>('drive');
  const [driveUrlInput, setDriveUrlInput] = useState('');
  const [directUrlInput, setDirectUrlInput] = useState('');
  const [titleInput, setTitleInput] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [imageLoadError, setImageLoadError] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const initial = initialUrl ? initialUrl.trim() : '';
      setTitleInput(initialTitle || '');
      setPreviewUrl(initial);
      setErrorMsg('');
      setImageLoadError(false);

      if (initial.includes('drive.google.com') || initial.includes('drive.google') || initial.includes('thumbnail?id=')) {
        setActiveTab('drive');
        setDriveUrlInput(initial);
      } else if (initial.startsWith('data:') || initial.startsWith('blob:')) {
        setActiveTab('upload');
      } else if (initial) {
        setActiveTab('url');
        setDirectUrlInput(initial);
      } else {
        setActiveTab('drive');
        setDriveUrlInput('');
        setDirectUrlInput('');
      }
    }
  }, [isOpen, initialUrl, initialTitle]);

  const handleDriveInputChange = (val: string) => {
    setDriveUrlInput(val);
    setErrorMsg('');
    setImageLoadError(false);

    if (!val.trim()) {
      setPreviewUrl('');
      return;
    }

    const converted = convertGoogleDriveUrl(val);
    if (val.includes('drive.google') && converted === val && !extractDriveFileId(val)) {
      setErrorMsg('Could not parse Google Drive File ID. Please check the link format.');
      setPreviewUrl('');
    } else {
      setPreviewUrl(converted);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please select a valid image file (PNG, JPG, WebP).');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setErrorMsg('File size exceeds 10MB limit.');
      return;
    }

    setIsProcessing(true);
    setErrorMsg('');
    setImageLoadError(false);

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setPreviewUrl(base64);
      setIsProcessing(false);
    };
    reader.onerror = () => {
      setErrorMsg('Failed to read file.');
      setIsProcessing(false);
    };
    reader.readAsDataURL(file);
  };

  const handleDirectUrlChange = (val: string) => {
    setDirectUrlInput(val);
    setErrorMsg('');
    setImageLoadError(false);

    const trimmed = val.trim();
    if (!trimmed) {
      setPreviewUrl('');
      return;
    }

    if (trimmed.includes('drive.google.com')) {
      // Auto switch to drive tab format conversion
      const converted = convertGoogleDriveUrl(trimmed);
      setPreviewUrl(converted);
    } else {
      setPreviewUrl(trimmed);
    }
  };

  const handleImageError = () => {
    setImageLoadError(true);
    const fileId = extractDriveFileId(previewUrl) || extractDriveFileId(driveUrlInput);
    if (fileId && !previewUrl.includes('lh3.googleusercontent.com')) {
      // Try fallback format
      setPreviewUrl(`https://lh3.googleusercontent.com/d/${fileId}`);
      setImageLoadError(false);
    } else if (fileId && previewUrl.includes('lh3.googleusercontent.com')) {
      setPreviewUrl(`https://drive.google.com/uc?export=view&id=${fileId}`);
    } else {
      setErrorMsg('Failed to load image preview. Please make sure Google Drive sharing is set to "Anyone with the link can view".');
    }
  };

  const handleSave = () => {
    if (!previewUrl && !initialUrl) {
      setErrorMsg('Please select an image or provide a valid Drive link/file.');
      return;
    }

    const finalUrl = previewUrl || convertGoogleDriveUrl(driveUrlInput || directUrlInput);
    onSelect(finalUrl, titleInput);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-sm select-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-5 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between bg-stone-50/50 dark:bg-stone-900/50">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400">
                <FolderOpen size={20} />
              </div>
              <h3 className="font-bold text-stone-800 dark:text-stone-100 text-base">
                {modalTitle}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 overflow-y-auto space-y-5 flex-1">
            {/* Title Field if requested */}
            {showTitleField && (
              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1.5">
                  Photo Title / Caption
                </label>
                <input
                  type="text"
                  value={titleInput}
                  onChange={(e) => setTitleInput(e.target.value)}
                  placeholder="e.g. Circle Time & Storytelling Class"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-800 dark:text-stone-200 text-xs focus:ring-2 focus:ring-brand-green outline-none"
                />
              </div>
            )}

            {/* Source Selection Tabs */}
            <div>
              <div className="flex rounded-2xl bg-stone-100 dark:bg-stone-800/80 p-1 mb-4">
                <button
                  type="button"
                  onClick={() => { setActiveTab('drive'); setErrorMsg(''); }}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                    activeTab === 'drive'
                      ? 'bg-white dark:bg-stone-700 text-blue-600 dark:text-blue-400 shadow-sm'
                      : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
                  }`}
                >
                  <FolderOpen size={14} />
                  <span>Google Drive</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setActiveTab('upload'); setErrorMsg(''); }}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                    activeTab === 'upload'
                      ? 'bg-white dark:bg-stone-700 text-brand-green shadow-sm'
                      : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
                  }`}
                >
                  <Upload size={14} />
                  <span>Upload File</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setActiveTab('url'); setErrorMsg(''); }}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                    activeTab === 'url'
                      ? 'bg-white dark:bg-stone-700 text-purple-600 dark:text-purple-400 shadow-sm'
                      : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
                  }`}
                >
                  <LinkIcon size={14} />
                  <span>Image URL</span>
                </button>
              </div>

              {/* Tab 1: Google Drive */}
              {activeTab === 'drive' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-stone-600 dark:text-stone-400 mb-1">
                      Paste Shared Google Drive Link
                    </label>
                    <input
                      type="text"
                      value={driveUrlInput}
                      onChange={(e) => handleDriveInputChange(e.target.value)}
                      placeholder="https://drive.google.com/file/d/1A2B3C.../view"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-800 dark:text-stone-200 text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div className="p-3 rounded-xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 text-[11px] text-blue-700 dark:text-blue-300 leading-relaxed flex items-start gap-2">
                    <FolderOpen size={15} className="shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold mb-0.5">Google Drive Link Instructions:</p>
                      <p>Open your file in Google Drive &rarr; click <strong>Share</strong> &rarr; change General access to <strong>"Anyone with the link can view"</strong> &rarr; copy & paste the link above.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Upload File */}
              {activeTab === 'upload' && (
                <div className="space-y-3">
                  <label className="block border-2 border-dashed border-stone-300 dark:border-stone-700 hover:border-brand-green dark:hover:border-brand-green rounded-2xl p-6 text-center cursor-pointer transition bg-stone-50/50 dark:bg-stone-800/30">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <Upload size={32} className="mx-auto text-stone-400 mb-2" />
                    <p className="text-xs font-bold text-stone-700 dark:text-stone-200">
                      Click to choose image file or drag here
                    </p>
                    <p className="text-[10px] text-stone-400 mt-1">
                      Supports PNG, JPG, JPEG, WebP (Max 10MB)
                    </p>
                  </label>
                </div>
              )}

              {/* Tab 3: Direct URL */}
              {activeTab === 'url' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-stone-600 dark:text-stone-400 mb-1">
                      Direct Web Image URL
                    </label>
                    <input
                      type="url"
                      value={directUrlInput}
                      onChange={(e) => handleDirectUrlChange(e.target.value)}
                      placeholder="https://images.unsplash.com/photo-..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-800 dark:text-stone-200 text-xs focus:ring-2 focus:ring-purple-500 outline-none"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/40 text-red-600 dark:text-red-400 text-xs font-semibold flex items-center gap-2">
                <AlertCircle size={16} className="shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Live Image Preview Box */}
            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-2">
                Live Image Preview
              </label>
              <div className="aspect-video w-full rounded-2xl overflow-hidden border border-stone-200 dark:border-stone-700 bg-stone-100 dark:bg-stone-800 flex items-center justify-center relative">
                {isProcessing ? (
                  <div className="flex flex-col items-center gap-2 text-stone-400">
                    <RefreshCw size={24} className="animate-spin text-brand-green" />
                    <span className="text-xs font-semibold">Processing image...</span>
                  </div>
                ) : previewUrl ? (
                  <div className="w-full h-full relative group">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                      onError={handleImageError}
                    />
                    <div className="absolute bottom-2 left-2 px-2.5 py-1 bg-black/70 backdrop-blur-md rounded-lg text-white text-[10px] font-bold flex items-center gap-1">
                      <Check size={12} className="text-green-400" />
                      <span>Image Ready</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center text-stone-400 p-4">
                    <ImageIcon size={32} className="mb-1 opacity-50" />
                    <span className="text-xs">No image selected or link provided</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-5 border-t border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/50 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 text-xs font-bold transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={!previewUrl || isProcessing}
              className="px-5 py-2.5 rounded-xl bg-brand-green hover:bg-brand-green/90 text-white text-xs font-bold shadow-md disabled:opacity-50 transition cursor-pointer flex items-center gap-1.5"
            >
              <Check size={14} />
              <span>Apply Photo</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
