import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Folder, 
  FileImage, 
  FileVideo, 
  ArrowLeft, 
  Search, 
  UploadCloud, 
  Check, 
  Loader2, 
  X, 
  Cloud, 
  LogOut, 
  Plus, 
  FolderOpen 
} from 'lucide-react';
import { auth } from '../firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

interface GoogleDrivePickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
  isImageOnly?: boolean;
}

interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  thumbnailLink?: string;
  webContentLink?: string;
}

export const GoogleDrivePicker: React.FC<GoogleDrivePickerProps> = ({
  isOpen,
  onClose,
  onSelect,
  isImageOnly = true
}) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [files, setFiles] = useState<DriveFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [folderHistory, setFolderHistory] = useState<string[]>(['root']);
  const [currentFolderName, setCurrentFolderName] = useState('My Drive');
  const [folderNamesMap, setFolderNamesMap] = useState<Record<string, string>>({ root: 'My Drive' });

  // Add scope for Google Drive
  const handleConnect = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      provider.addScope('https://www.googleapis.com/auth/drive.readonly');
      provider.addScope('https://www.googleapis.com/auth/drive.file');
      
      const result = await signInWithPopup(auth, provider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      if (credential?.accessToken) {
        setAccessToken(credential.accessToken);
        setUserEmail(result.user.email);
      } else {
        alert('Failed to obtain Google Drive access token.');
      }
    } catch (err: any) {
      console.error('Error connecting to Google Drive:', err);
      alert(`Connection failed: ${err.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = () => {
    setAccessToken(null);
    setUserEmail(null);
    setFiles([]);
    setFolderHistory(['root']);
    setCurrentFolderName('My Drive');
  };

  const currentFolderId = folderHistory[folderHistory.length - 1];

  const fetchFiles = async () => {
    if (!accessToken) return;
    setLoading(true);
    try {
      // Build search query
      let q = `'${currentFolderId}' in parents and trashed = false`;
      
      if (searchQuery.trim()) {
        q = `name contains '${searchQuery.replace(/'/g, "\\'")}' and trashed = false`;
      }

      // Filter types
      if (isImageOnly) {
        q += ` and (mimeType = 'application/vnd.google-apps.folder' or mimeType starts with 'image/')`;
      } else {
        q += ` and (mimeType = 'application/vnd.google-apps.folder' or mimeType starts with 'image/' or mimeType starts with 'video/')`;
      }

      const encodedQ = encodeURIComponent(q);
      const url = `https://www.googleapis.com/drive/v3/files?pageSize=100&fields=files(id,name,mimeType,thumbnailLink,webContentLink)&q=${encodedQ}`;

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });

      if (!res.ok) {
        if (res.status === 401) {
          // Token expired, clear token
          setAccessToken(null);
          setUserEmail(null);
          throw new Error('Session expired. Please reconnect to Google Drive.');
        }
        const errData = await res.json();
        throw new Error(errData.error?.message || 'Failed to fetch files');
      }

      const data = await res.json();
      
      // Sort: Folders first, then alphabetically
      const sortedFiles = (data.files || []).sort((a: DriveFile, b: DriveFile) => {
        const isFolderA = a.mimeType === 'application/vnd.google-apps.folder';
        const isFolderB = b.mimeType === 'application/vnd.google-apps.folder';
        if (isFolderA && !isFolderB) return -1;
        if (!isFolderA && isFolderB) return 1;
        return a.name.localeCompare(b.name);
      });

      setFiles(sortedFiles);
    } catch (err: any) {
      console.error('Error fetching files:', err);
      alert(err.message || 'Error fetching files from Google Drive');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && accessToken) {
      fetchFiles();
    }
  }, [isOpen, accessToken, folderHistory, searchQuery]);

  const handleFolderClick = (folderId: string, folderName: string) => {
    setFolderNamesMap(prev => ({ ...prev, [folderId]: folderName }));
    setFolderHistory(prev => [...prev, folderId]);
    setCurrentFolderName(folderName);
    setSearchQuery('');
  };

  const handleBackClick = () => {
    if (folderHistory.length > 1) {
      const newHistory = folderHistory.slice(0, -1);
      setFolderHistory(newHistory);
      const prevFolderId = newHistory[newHistory.length - 1];
      setCurrentFolderName(folderNamesMap[prevFolderId] || 'My Drive');
      setSearchQuery('');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!accessToken || !e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    
    setUploading(true);
    try {
      // 1. Create file with metadata
      const metadata = {
        name: file.name,
        parents: [currentFolderId]
      };

      const formData = new FormData();
      formData.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
      formData.append('file', file);

      const uploadUrl = 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,mimeType';
      const uploadRes = await fetch(uploadUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`
        },
        body: formData
      });

      if (!uploadRes.ok) {
        const errData = await uploadRes.json();
        throw new Error(errData.error?.message || 'Upload failed');
      }

      const uploadedFile = await uploadRes.json();
      const fileId = uploadedFile.id;

      // 2. Set file permission to public so anyone can view it
      await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}/permissions`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          role: 'reader',
          type: 'anyone'
        })
      });

      // 3. Select this file immediately and close
      const directUrl = `https://lh3.googleusercontent.com/d/${fileId}`;
      onSelect(directUrl);
      onClose();
    } catch (err: any) {
      console.error('Upload to Drive error:', err);
      alert(`Failed to upload: ${err.message || 'Unknown error'}`);
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = (fileId: string) => {
    const directUrl = `https://lh3.googleusercontent.com/d/${fileId}`;
    onSelect(directUrl);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm"
        />

        {/* Modal Panel */}
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="relative bg-white border border-stone-200 shadow-2xl rounded-3xl w-full max-w-4xl h-[85vh] flex flex-col overflow-hidden z-10"
        >
          {/* Header */}
          <div className="p-6 border-b border-stone-100 flex items-center justify-between bg-stone-50">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-blue-50 text-blue-600 rounded-2xl">
                <Cloud size={24} />
              </div>
              <div>
                <h3 className="font-display font-black text-xl tracking-tight text-stone-900">
                  Google Drive File Chooser
                </h3>
                {userEmail && (
                  <p className="text-xs text-stone-500 font-medium">
                    Connected to <span className="text-blue-600 font-semibold">{userEmail}</span>
                  </p>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {accessToken && (
                <button
                  onClick={handleDisconnect}
                  title="Disconnect Drive"
                  className="p-2 text-stone-400 hover:text-red-500 rounded-xl hover:bg-stone-100 transition"
                >
                  <LogOut size={18} />
                </button>
              )}
              <button 
                onClick={onClose}
                className="p-2 text-stone-400 hover:text-stone-600 rounded-xl hover:bg-stone-100 transition"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Connected Body */}
          {accessToken ? (
            <div className="flex-1 flex flex-col min-h-0 bg-white">
              {/* Controls bar */}
              <div className="p-4 border-b border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-stone-50/50">
                {/* Navigation/Breadcrumbs */}
                <div className="flex items-center gap-2 text-sm text-stone-600">
                  {folderHistory.length > 1 && (
                    <button
                      onClick={handleBackClick}
                      className="p-1.5 hover:bg-stone-200 text-stone-700 rounded-lg transition mr-1"
                    >
                      <ArrowLeft size={16} />
                    </button>
                  )}
                  <span className="font-semibold text-stone-800 flex items-center gap-1.5">
                    <FolderOpen size={16} className="text-blue-500" />
                    {currentFolderName}
                  </span>
                </div>

                {/* Search & Upload */}
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                    <input
                      type="text"
                      placeholder="Search files..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 pr-4 py-1.5 text-xs border border-stone-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none w-44 sm:w-56"
                    />
                  </div>

                  {/* Upload directly to Drive folder */}
                  <label className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 shadow-sm transition">
                    {uploading ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <Plus size={14} />
                    )}
                    <span>{uploading ? 'Uploading...' : 'Upload to Drive'}</span>
                    <input
                      type="file"
                      accept={isImageOnly ? "image/*" : "image/*,video/*"}
                      disabled={uploading}
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Files Grid / List */}
              <div className="flex-1 overflow-y-auto p-6">
                {loading ? (
                  <div className="h-full flex flex-col items-center justify-center gap-3 text-stone-500">
                    <Loader2 className="animate-spin text-blue-600" size={32} />
                    <span className="text-sm font-medium">Loading Google Drive contents...</span>
                  </div>
                ) : files.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-8">
                    <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center text-stone-400 mb-4">
                      <Folder size={28} />
                    </div>
                    <h4 className="font-bold text-stone-800 text-base mb-1">Folder is Empty</h4>
                    <p className="text-stone-400 text-xs max-w-xs">
                      No matching images or video files found in this folder. You can upload files from your device directly using "Upload to Drive".
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {files.map((file) => {
                      const isFolder = file.mimeType === 'application/vnd.google-apps.folder';
                      const isImage = file.mimeType.startsWith('image/');
                      
                      return (
                        <div
                          key={file.id}
                          onClick={() => {
                            if (isFolder) {
                              handleFolderClick(file.id, file.name);
                            } else {
                              handleFileSelect(file.id);
                            }
                          }}
                          className={`group relative border rounded-2xl p-3 flex flex-col items-center text-center cursor-pointer select-none transition duration-200 ${
                            isFolder 
                              ? 'border-stone-200 hover:border-blue-400 hover:bg-blue-50/20 bg-stone-50/50' 
                              : 'border-stone-200 hover:border-green-400 hover:bg-green-50/10'
                          }`}
                        >
                          {/* Icon or Thumbnail */}
                          <div className="w-full h-24 rounded-xl overflow-hidden bg-stone-100 flex items-center justify-center mb-2.5 relative">
                            {isFolder ? (
                              <Folder size={40} className="text-yellow-500 fill-yellow-400" />
                            ) : isImage && file.thumbnailLink ? (
                              <img 
                                src={file.thumbnailLink} 
                                alt={file.name}
                                className="w-full h-full object-cover"
                                referrerPolicy="no-referrer"
                              />
                            ) : file.mimeType.startsWith('video/') ? (
                              <FileVideo size={36} className="text-red-500" />
                            ) : (
                              <FileImage size={36} className="text-blue-500" />
                            )}
                          </div>

                          {/* File / Folder Name */}
                          <span className="text-xs font-semibold text-stone-700 truncate w-full px-1" title={file.name}>
                            {file.name}
                          </span>
                          
                          {/* Hover action overlay */}
                          <span className="text-[10px] text-stone-400 mt-0.5">
                            {isFolder ? 'Folder' : 'Select File'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Disconnected Body (Welcome / Prompt to connect) */
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-stone-50/30">
              <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mb-6 shadow-md shadow-blue-100">
                <Cloud size={40} />
              </div>
              <h4 className="font-display font-black text-2xl text-stone-800 tracking-tight mb-2">
                Connect your Google Drive
              </h4>
              <p className="text-stone-500 text-sm max-w-md mb-8 leading-relaxed">
                Choose, browse, and upload files directly using your daycare Google Drive account.
                This keeps all of Kidtopia's hero images, galleries, and videos seamlessly hosted in Google Drive.
              </p>

              <button
                type="button"
                onClick={handleConnect}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm px-6 py-3 rounded-2xl flex items-center gap-2.5 shadow-lg shadow-blue-600/20 transition-all duration-150 active:scale-95 disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Cloud size={18} />
                )}
                <span>{loading ? 'Connecting...' : 'Connect Google Drive'}</span>
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
