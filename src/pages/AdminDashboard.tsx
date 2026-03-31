import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Save, LogOut, Settings, Layout, Users, Shield, Image as ImageIcon, Trash2, Plus, Menu, X, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useContentRefresh } from '../ContentContext';
import { AnimatePresence } from 'motion/react';
import { db, auth, logout as firebaseLogout } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const refreshContent = useContentRefresh();
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeLang, setActiveLang] = useState<'en' | 'am'>('en');
  const [activeSection, setActiveSection] = useState('hero');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [confirmModal, setConfirmModal] = useState<{ message: string, onConfirm: () => void } | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate('/login');
      }
    });
    return () => unsub();
  }, [navigate]);

  useEffect(() => {
    if (feedback) {
      const timer = setTimeout(() => setFeedback(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [feedback]);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      let enDoc = await getDoc(doc(db, 'content', 'en'));
      let amDoc = await getDoc(doc(db, 'content', 'am'));
      
      // If content is missing, initialize it (only admins can do this)
      if (!enDoc.exists() || !amDoc.exists()) {
        const { translations: defaultTranslations } = await import('../translations');
        if (!enDoc.exists()) {
          await setDoc(doc(db, 'content', 'en'), defaultTranslations.en);
          enDoc = await getDoc(doc(db, 'content', 'en'));
        }
        if (!amDoc.exists()) {
          await setDoc(doc(db, 'content', 'am'), defaultTranslations.am);
          amDoc = await getDoc(doc(db, 'content', 'am'));
        }
      }

      if (enDoc.exists() && amDoc.exists()) {
        setContent({
          en: enDoc.data(),
          am: amDoc.data()
        });
      }
    } catch (err) {
      console.error('Failed to fetch or initialize content', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, 'content', activeLang), content[activeLang]);
      setFeedback({ type: 'success', message: 'Content saved successfully!' });
    } catch (err) {
      console.error('Failed to save content', err);
      setFeedback({ type: 'error', message: err instanceof Error ? err.message : 'Unknown error' });
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await firebaseLogout();
    navigate('/login');
  };

  const handleImageUpload = async (path: string[], file: File) => {
    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        handleChange(path, data.url);
        setFeedback({ type: 'success', message: 'Image uploaded successfully!' });
      } else {
        let errorMessage = 'Failed to upload image';
        try {
          const errorData = await res.json();
          errorMessage = errorData.error || errorMessage;
        } catch (e) {
          errorMessage = `Server error (${res.status}): ${res.statusText}`;
        }
        setFeedback({ type: 'error', message: errorMessage });
      }
    } catch (err) {
      console.error('Error uploading image', err);
      setFeedback({ type: 'error', message: 'Network error uploading image' });
    }
  };

  const handleChange = (path: string[], value: any) => {
    const newContent = JSON.parse(JSON.stringify(content));
    let current = newContent[activeLang];
    
    for (let i = 0; i < path.length - 1; i++) {
      current = current[path[i]];
    }
    
    current[path[path.length - 1]] = value;
    setContent(newContent);
  };

  const addItem = (path: string[]) => {
    const newContent = JSON.parse(JSON.stringify(content));
    let current = newContent[activeLang];
    
    for (let i = 0; i < path.length - 1; i++) {
      current = current[path[i]];
    }
    
    const array = current[path[path.length - 1]];
    const key = path[path.length - 1];
    
    if (Array.isArray(array)) {
      let template;
      if (array.length > 0) {
        if (typeof array[0] !== 'object' || array[0] === null) {
          template = '';
        } else {
          template = Object.keys(array[0]).reduce((acc, k) => {
            const originalValue = (array[0] as any)[k];
            if (typeof originalValue === 'object' && originalValue !== null && !Array.isArray(originalValue)) {
              return { 
                ...acc, 
                [k]: Object.keys(originalValue).reduce((subAcc, subKey) => ({ 
                  ...subAcc, 
                  [subKey]: typeof (originalValue as any)[subKey] === 'number' ? 5 : '' 
                }), {}) 
              };
            }
            return { ...acc, [k]: typeof originalValue === 'number' ? 5 : '' };
          }, {});
        }
      } else {
        // Default template based on key name
        const k = key.toLowerCase();
        if (['phones', 'emails', 'addresses', 'features', 'highlights'].includes(k)) {
          template = '';
        } else if (k === 'members') {
          template = { name: '', role: '', desc: '', image: '' };
        } else if (k === 'list') {
          template = { name: '', role: '', content: '', image: '', rating: 5 };
        } else if (k === 'timeline') {
          template = { time: '', activity: '', icon: 'Clock' };
        } else if (k === 'items') {
          template = { title: '', description: '', link: '', icon: 'FileText' };
        } else if (k === 'cards') {
          template = { title: '', description: '', icon: 'Shield', moreInfo: '' };
        } else {
          template = { title: '', description: '' };
        }
      }
      
      array.push(template);
      setContent(newContent);
    }
  };

  const removeItem = (path: string[], index: number) => {
    setConfirmModal({
      message: 'Are you sure you want to remove this item? This action cannot be undone until you refresh the page without saving.',
      onConfirm: () => {
        const newContent = JSON.parse(JSON.stringify(content));
        let current = newContent[activeLang];
        
        for (let i = 0; i < path.length - 1; i++) {
          current = current[path[i]];
        }
        
        const array = current[path[path.length - 1]];
        if (Array.isArray(array)) {
          array.splice(index, 1);
          setContent(newContent);
          setFeedback({ type: 'success', message: 'Item removed from list' });
        }
        setConfirmModal(null);
      }
    });
  };

  if (loading || !content) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-green"></div>
      </div>
    );
  }

  const sections = [
    { id: 'nav', icon: <Layout size={18} />, label: 'Navigation' },
    { id: 'hero', icon: <Layout size={18} />, label: 'Hero Section' },
    { id: 'safety', icon: <Shield size={18} />, label: 'Safety & Trust' },
    { id: 'programs', icon: <Settings size={18} />, label: 'Programs' },
    { id: 'staff', icon: <Users size={18} />, label: 'Staff' },
    { id: 'whyChoose', icon: <Shield size={18} />, label: 'Why Choose Us' },
    { id: 'dailyExperience', icon: <Layout size={18} />, label: 'Daily Experience' },
    { id: 'testimonials', icon: <Users size={18} />, label: 'Testimonials' },
    { id: 'cta', icon: <Layout size={18} />, label: 'Call to Action' },
    { id: 'virtualTour', icon: <Layout size={18} />, label: 'Virtual Tour' },
    { id: 'resources', icon: <Layout size={18} />, label: 'Resources' },
    { id: 'footer', icon: <Layout size={18} />, label: 'Footer' },
    { id: 'login', icon: <Users size={18} />, label: 'Login Page' },
    { id: 'leadCapture', icon: <Layout size={18} />, label: 'Lead Capture' },
  ];

  const renderField = (key: string, value: any, path: string[]) => {
    const isRating = key.toLowerCase() === 'rating' || key.toLowerCase() === 'rate';
    if (typeof value === 'number' || isRating) {
      return (
        <div key={path.join('.')} className="mb-4">
          <label className="block text-sm font-medium text-stone-700 mb-1 capitalize">
            {key.replace(/([A-Z])/g, ' $1').trim()}
          </label>
          <input
            type="number"
            min="1"
            max="5"
            value={value}
            onChange={(e) => handleChange(path, parseInt(e.target.value) || 0)}
            className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-brand-green outline-none"
          />
        </div>
      );
    }

    if (typeof value === 'string') {
      const isImage = key.toLowerCase().includes('image') || key.toLowerCase().includes('img') || key.toLowerCase().includes('photo') || key.toLowerCase().includes('icon') || key.toLowerCase().includes('avatar');
      const isMoreInfo = key === 'moreInfo';

      if (isImage) {
        return (
          <div key={path.join('.')} className="mb-4">
            <label className="block text-sm font-medium text-stone-700 mb-1 capitalize">
              {key.replace(/([A-Z])/g, ' $1').trim()}
            </label>
            <div className="flex items-center gap-4">
              {value && (
                <img src={value} alt={key} className="w-16 h-16 object-cover rounded-lg border border-stone-200" />
              )}
              <div className="flex-1">
                <input
                  type="text"
                  value={value}
                  onChange={(e) => handleChange(path, e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-brand-green outline-none mb-2"
                  placeholder="Image URL"
                />
                <label className="cursor-pointer flex items-center gap-2 text-sm text-brand-green hover:text-brand-orange transition-colors">
                  <ImageIcon size={16} />
                  <span>Upload Image</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleImageUpload(path, e.target.files[0]);
                      }
                    }}
                  />
                </label>
              </div>
            </div>
          </div>
        );
      }

      return (
        <div key={path.join('.')} className={`mb-4 ${isMoreInfo ? 'mt-8 pt-6 border-t border-stone-200' : ''}`}>
          {isMoreInfo && (
            <div className="flex items-center gap-2 mb-4 text-brand-green font-bold uppercase text-xs tracking-widest">
              <Plus size={14} />
              <span>Learn More Section Content</span>
            </div>
          )}
          <label className="block text-sm font-medium text-stone-700 mb-1 capitalize">
            {key.replace(/([A-Z])/g, ' $1').trim()}
          </label>
          {value.length > 100 || isMoreInfo ? (
            <textarea
              value={value}
              onChange={(e) => handleChange(path, e.target.value)}
              className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-brand-green outline-none"
              rows={isMoreInfo ? 6 : 4}
            />
          ) : (
            <input
              type="text"
              value={value}
              onChange={(e) => handleChange(path, e.target.value)}
              className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-brand-green outline-none"
            />
          )}
        </div>
      );
    }
    
    if (Array.isArray(value)) {
      const isPrimitiveArray = value.length > 0 ? typeof value[0] !== 'object' : true;
      
      return (
        <div key={path.join('.')} className="mb-6 p-4 bg-stone-50 rounded-xl border border-stone-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-stone-800 capitalize">{key}</h3>
            <button 
              onClick={() => addItem(path)}
              className="flex items-center gap-1 text-sm bg-brand-green text-white px-3 py-1.5 rounded-lg hover:opacity-90 transition-opacity"
            >
              <Plus size={14} />
              Add Item
            </button>
          </div>
          {value.map((item, index) => (
            <div key={index} className="mb-4 p-4 bg-white rounded-lg border border-stone-200 relative group">
              <button 
                onClick={() => removeItem(path, index)}
                className="absolute top-2 right-2 text-red-500 md:opacity-0 md:group-hover:opacity-100 transition-opacity p-1.5 hover:bg-red-50 rounded-lg z-10"
                title="Remove Item"
              >
                <Trash2 size={16} />
              </button>
              <div className="text-xs font-bold text-stone-400 mb-2 uppercase tracking-wider">Item {index + 1}</div>
              {isPrimitiveArray ? (
                <input
                  type="text"
                  value={item}
                  onChange={(e) => handleChange([...path, index.toString()], e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-brand-green outline-none"
                />
              ) : (
                Object.entries(item).map(([itemKey, itemValue]) => 
                  renderField(itemKey, itemValue, [...path, index.toString(), itemKey])
                )
              )}
            </div>
          ))}
        </div>
      );
    }
    
    if (typeof value === 'object' && value !== null) {
      return (
        <div key={path.join('.')} className="mb-6">
          <h3 className="text-lg font-bold text-stone-800 mb-4 capitalize">{key}</h3>
          {Object.entries(value).map(([objKey, objValue]) => 
            renderField(objKey, objValue, [...path, objKey])
          )}
        </div>
      );
    }
    
    return null;
  };

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col md:flex-row pt-20">
      {/* Mobile Header Overlay */}
      <div className="md:hidden fixed top-20 left-0 right-0 z-30 bg-white border-b border-stone-200 px-4 py-3 flex items-center justify-between shadow-sm">
        <button 
          onClick={() => setIsSidebarOpen(true)}
          className="flex items-center gap-2 text-stone-700 font-medium"
        >
          <Menu size={20} />
          <span>{sections.find(s => s.id === activeSection)?.label}</span>
        </button>
        <div className="flex gap-2">
          <button 
            onClick={() => setActiveLang(activeLang === 'en' ? 'am' : 'en')}
            className="px-3 py-1 bg-stone-100 rounded-lg text-xs font-bold text-stone-600"
          >
            {activeLang.toUpperCase()}
          </button>
          <button 
            onClick={handleSave}
            disabled={saving}
            className="p-2 bg-brand-green text-white rounded-lg disabled:opacity-50"
          >
            <Save size={18} />
          </button>
        </div>
      </div>

      {/* Sidebar Overlay for Mobile */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
            />
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-72 bg-white z-50 md:hidden flex flex-col"
            >
              <div className="p-6 border-b border-stone-200 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-stone-800">Admin Control</h2>
                  <p className="text-xs text-stone-500">Manage website content</p>
                </div>
                <button onClick={() => setIsSidebarOpen(false)} className="p-2 text-stone-400">
                  <X size={24} />
                </button>
              </div>

              <div className="p-4 border-b border-stone-200 flex gap-2">
                <button 
                  onClick={() => setActiveLang('en')}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${activeLang === 'en' ? 'bg-brand-green text-white' : 'bg-stone-100 text-stone-600'}`}
                >
                  English
                </button>
                <button 
                  onClick={() => setActiveLang('am')}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${activeLang === 'am' ? 'bg-brand-green text-white' : 'bg-stone-100 text-stone-600'}`}
                >
                  Amharic
                </button>
              </div>

              <nav className="flex-1 overflow-y-auto p-4 space-y-1">
                {sections.map(section => (
                  <button
                    key={section.id}
                    onClick={() => {
                      setActiveSection(section.id);
                      setIsSidebarOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                      activeSection === section.id 
                        ? 'bg-brand-green/10 text-brand-green' 
                        : 'text-stone-600 hover:bg-stone-100'
                    }`}
                  >
                    {section.icon}
                    {section.label}
                  </button>
                ))}
              </nav>

              <div className="p-4 border-t border-stone-200">
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex w-64 bg-white border-r border-stone-200 flex-col h-[calc(100vh-5rem)] sticky top-20">
        <div className="p-6 border-b border-stone-200">
          <h2 className="text-xl font-bold text-stone-800">Admin Control</h2>
          <p className="text-sm text-stone-500">Manage website content</p>
        </div>
        
        <div className="p-4 border-b border-stone-200 flex gap-2">
          <button 
            onClick={() => setActiveLang('en')}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${activeLang === 'en' ? 'bg-brand-green text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'}`}
          >
            English
          </button>
          <button 
            onClick={() => setActiveLang('am')}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${activeLang === 'am' ? 'bg-brand-green text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'}`}
          >
            Amharic
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {sections.map(section => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                activeSection === section.id 
                  ? 'bg-brand-green/10 text-brand-green' 
                  : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              {section.icon}
              {section.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-stone-200">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto h-[calc(100vh-5rem)] mt-14 md:mt-0">
        <div className="p-4 md:p-10 max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-stone-900 capitalize">
              {activeSection} Content ({activeLang.toUpperCase()})
            </h1>
            <button 
              onClick={handleSave}
              disabled={saving}
              className="hidden md:flex items-center gap-2 bg-brand-green text-white px-6 py-2.5 rounded-full font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              <Save size={18} />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-4 md:p-8">
            {content[activeLang] && content[activeLang][activeSection] ? (
              Object.entries(content[activeLang][activeSection]).map(([key, value]) => 
                renderField(key, value, [activeSection, key])
              )
            ) : (
              <p className="text-stone-500">No content available for this section.</p>
            )}
          </div>
        </div>
      </div>

      {/* Feedback Notification */}
      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] px-6 py-3 rounded-full shadow-lg text-white font-medium flex items-center gap-2 ${
              feedback.type === 'success' ? 'bg-brand-green' : 'bg-red-500'
            }`}
          >
            {feedback.type === 'success' ? <Shield size={18} /> : <X size={18} />}
            {feedback.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {confirmModal && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setConfirmModal(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl"
            >
              <h3 className="text-xl font-bold text-stone-900 mb-2">Confirm Action</h3>
              <p className="text-stone-600 mb-6">{confirmModal.message}</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setConfirmModal(null)}
                  className="flex-1 px-4 py-2 border border-stone-200 rounded-xl font-medium text-stone-600 hover:bg-stone-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmModal.onConfirm}
                  className="flex-1 px-4 py-2 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition-colors"
                >
                  Confirm Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
