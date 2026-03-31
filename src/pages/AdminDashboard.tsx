import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Save, LogOut, Settings, Layout, Users, Shield, Image as ImageIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeLang, setActiveLang] = useState<'en' | 'am'>('en');
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const res = await fetch('/api/content');
      if (res.ok) {
        const data = await res.json();
        setContent(data);
      } else if (res.status === 401) {
        navigate('/login');
      }
    } catch (err) {
      console.error('Failed to fetch content', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/content/${activeLang}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(content[activeLang])
      });
      
      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          navigate('/login');
        } else {
          throw new Error('Failed to save');
        }
      } else {
        alert('Content saved successfully!');
      }
    } catch (err) {
      console.error('Failed to save content', err);
      alert('Failed to save content');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/logout', { method: 'POST' });
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
      } else {
        alert('Failed to upload image');
      }
    } catch (err) {
      console.error('Error uploading image', err);
      alert('Error uploading image');
    }
  };

  const handleChange = (path: string[], value: string) => {
    const newContent = { ...content };
    let current = newContent[activeLang];
    
    for (let i = 0; i < path.length - 1; i++) {
      current = current[path[i]];
    }
    
    current[path[path.length - 1]] = value;
    setContent(newContent);
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
    if (typeof value === 'string') {
      const isImage = key.toLowerCase().includes('image') || key.toLowerCase().includes('img') || key.toLowerCase().includes('photo') || key.toLowerCase().includes('icon') || key.toLowerCase().includes('avatar');

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
        <div key={path.join('.')} className="mb-4">
          <label className="block text-sm font-medium text-stone-700 mb-1 capitalize">
            {key.replace(/([A-Z])/g, ' $1').trim()}
          </label>
          {value.length > 100 ? (
            <textarea
              value={value}
              onChange={(e) => handleChange(path, e.target.value)}
              className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-brand-green outline-none"
              rows={4}
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
      return (
        <div key={path.join('.')} className="mb-6 p-4 bg-stone-50 rounded-xl border border-stone-200">
          <h3 className="text-lg font-bold text-stone-800 mb-4 capitalize">{key}</h3>
          {value.map((item, index) => (
            <div key={index} className="mb-4 p-4 bg-white rounded-lg border border-stone-200">
              <div className="text-xs font-bold text-stone-400 mb-2 uppercase tracking-wider">Item {index + 1}</div>
              {Object.entries(item).map(([itemKey, itemValue]) => 
                renderField(itemKey, itemValue, [...path, index.toString(), itemKey])
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
      {/* Sidebar */}
      <div className="w-full md:w-64 bg-white border-r border-stone-200 flex flex-col h-[calc(100vh-5rem)] sticky top-20">
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
      <div className="flex-1 overflow-y-auto h-[calc(100vh-5rem)]">
        <div className="p-6 md:p-10 max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-stone-900 capitalize">
              {activeSection} Content ({activeLang.toUpperCase()})
            </h1>
            <button 
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 bg-brand-green text-white px-6 py-2.5 rounded-full font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              <Save size={18} />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6 md:p-8">
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
    </div>
  );
};
