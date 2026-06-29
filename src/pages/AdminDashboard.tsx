import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Save, LogOut, Settings, Layout, Users, Shield, Image as ImageIcon, Trash2, Plus, Menu, X, ChevronDown, Eye, EyeOff, Fingerprint, Megaphone, Bell, FileText, HelpCircle, Compass } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useContentRefresh } from '../ContentContext';
import { AnimatePresence } from 'motion/react';
import { db, auth, logout as firebaseLogout, getAllUsers, updateUserRole, getAdminConfig, updateAdminConfig, updateCurrentUserPassword, saveFingerprintTemplate, getTourSchedule, updateTourSchedule, getAllBookings, updateBookingStatus } from '../firebase';
import { captureFingerprint, isSecuGenAvailable } from '../services/fingerprintService';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { translations as defaultTranslations } from '../translations';
import { ThreeSixtyViewer } from '../components/ThreeSixtyViewer';

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
  const [users, setUsers] = useState<any[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [adminConfig, setAdminConfig] = useState<any>(null);
  const [securityLoading, setSecurityLoading] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [showShortcutPassword, setShowShortcutPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [newUserUsername, setNewUserUsername] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newUserRole, setNewUserRole] = useState('parent');
  const [addingUser, setAddingUser] = useState(false);
  const [apiStatus, setApiStatus] = useState<string | null>(null);
  const [fingerprintLoading, setFingerprintLoading] = useState(false);
  const [fingerprintStatus, setFingerprintStatus] = useState<string | null>(null);

  const [tourSchedule, setTourSchedule] = useState<any>(null);
  const [scheduleViewDay, setScheduleViewDay] = useState('Default');
  const daysOfWeek = ['Default', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const [bookings, setBookings] = useState<any[]>([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);

  const checkApiHealth = async () => {
    let apiBase = (import.meta as any).env.VITE_API_URL || '';
    if (apiBase.endsWith('/')) {
      apiBase = apiBase.slice(0, -1);
    }
    const pingUrl = apiBase ? `${apiBase}/api/ping` : '/api/ping';
    
    if (!apiBase) {
      setApiStatus(`Warning: VITE_API_URL is NOT set. Attempting to reach API via relative path: ${pingUrl}. This will fail if your frontend and backend are on different domains.`);
    }

    try {
      setApiStatus(prev => `${prev ? prev + '\n\n' : ''}Checking ${pingUrl}...`);
      const res = await fetch(pingUrl);
      
      const contentType = res.headers.get('content-type');
      if (contentType && contentType.includes('text/html')) {
        setApiStatus(prev => `${prev}\n\nAPI Error: Received HTML instead of JSON from ${pingUrl}. \n\nThis means you are hitting the frontend SPA fallback. \n\nFIX: Set the VITE_API_URL environment variable in your Vercel settings to your backend URL (e.g., your Cloud Run URL).`);
        return;
      }

      const data = await res.json();
      setApiStatus(prev => `${prev}\n\nAPI OK: ${data.message} (Status: ${data.status})`);
    } catch (err) {
      setApiStatus(prev => `${prev}\n\nAPI Error: ${err instanceof Error ? err.message : String(err)} (URL: ${pingUrl})`);
    }
  };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate('/login');
      } else {
        // User is authenticated, now safe to fetch protected data
        fetchContent();
        fetchUsers();
        fetchAdminConfig();
      }
    });
    return () => unsub();
  }, [navigate]);

  // Remove the old useEffect that fetched immediately
  useEffect(() => {
    if (feedback) {
      const timer = setTimeout(() => setFeedback(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [feedback]);

  const fetchAdminConfig = async () => {
    try {
      const config = await getAdminConfig();
      setAdminConfig(config);
    } catch (err) {
      console.error('Failed to fetch admin config', err);
      // Fallback to default if not found or no permission yet
      setAdminConfig({
        username: 'admin',
        password: '123456',
        email: 'admin@kidtopiadaycare.com',
        firebasePassword: 'admin123'
      });
    }
  };

  const handleRegisterFingerprint = async () => {
    setFingerprintLoading(true);
    setFingerprintStatus('Initializing SecuGen WebAPI...');
    try {
      const available = await isSecuGenAvailable();
      if (!available) {
        throw new Error('SecuGen WebAPI service is not running. Please ensure the driver is installed and running on localhost:8000.');
      }

      setFingerprintStatus('Please place your finger on the scanner...');
      const response = await captureFingerprint();
      
      if (response.ErrorCode !== 0) {
        throw new Error(response.ErrorDescription || 'Failed to capture fingerprint.');
      }

      if (response.Base64Template) {
        setFingerprintStatus('Saving fingerprint template...');
        await saveFingerprintTemplate(response.Base64Template);
        setFingerprintStatus('Fingerprint registered successfully!');
        setFeedback({ type: 'success', message: 'Fingerprint registered successfully!' });
      } else {
        throw new Error('No template received from scanner.');
      }
    } catch (err: any) {
      console.error('Fingerprint Registration Error:', err);
      setFingerprintStatus(`Error: ${err.message}`);
      setFeedback({ type: 'error', message: err.message });
    } finally {
      setFingerprintLoading(false);
    }
  };

  const handleUpdateSecurity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword && newPassword.length < 6) {
      setFeedback({ type: 'error', message: 'Password must be at least 6 characters' });
      return;
    }
    setSecurityLoading(true);
    try {
      // Update password if provided
      let updatedAdminConfig = { ...adminConfig };
      if (newPassword) {
        await updateCurrentUserPassword(newPassword);
        updatedAdminConfig.password = newPassword;
        setNewPassword('');
      }
      
      // Update shortcut username and password
      await updateAdminConfig(updatedAdminConfig);
      setAdminConfig(updatedAdminConfig);
      
      setFeedback({ type: 'success', message: 'Security settings updated successfully!' });
    } catch (err: any) {
      console.error('Failed to update security settings', err);
      setFeedback({ type: 'error', message: err.code === 'auth/requires-recent-login' ? 'Please logout and login again to change password' : 'Failed to update security settings' });
    } finally {
      setSecurityLoading(false);
    }
  };

  const fetchUsers = async () => {
    setUsersLoading(true);
    try {
      const allUsers = await getAllUsers();
      setUsers(allUsers);
    } catch (err) {
      console.error('Failed to fetch users', err);
    } finally {
      setUsersLoading(false);
    }
  };

  const handleUpdateUserRole = async (uid: string, newRole: string) => {
    try {
      await updateUserRole(uid, newRole);
      setUsers(users.map(u => u.uid === uid ? { ...u, role: newRole } : u));
      setFeedback({ type: 'success', message: 'User role updated successfully!' });
    } catch (err) {
      console.error('Failed to update user role', err);
      setFeedback({ type: 'error', message: 'Failed to update user role' });
    }
  };

  const handleDeleteUser = (uid: string) => {
    setConfirmModal({
      message: 'Are you sure you want to remove this user? This will revoke their access.',
      onConfirm: async () => {
        setConfirmModal(null);
        try {
          const { deleteUserDoc } = await import('../firebase');
          await deleteUserDoc(uid);
          setUsers((prevUsers) => prevUsers.filter(u => u.uid !== uid));
          setFeedback({ type: 'success', message: 'User removed successfully!' });
        } catch (err) {
          console.error('Failed to remove user', err);
          setFeedback({ type: 'error', message: 'Failed to remove user' });
        }
      }
    });
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newUserPassword.length < 6) {
      setFeedback({ type: 'error', message: 'Password must be at least 6 characters' });
      return;
    }
    if (!newUserUsername || newUserUsername.includes('@')) {
      setFeedback({ type: 'error', message: 'Please enter a valid username (without @)' });
      return;
    }
    setAddingUser(true);
    try {
      const emailToUse = `${newUserUsername.toLowerCase()}@kidtopiaet.com`;
      const { createUserWithoutLogin } = await import('../firebase');
      await createUserWithoutLogin(emailToUse, newUserPassword, newUserRole);
      setFeedback({ type: 'success', message: 'User added successfully!' });
      setNewUserUsername('');
      setNewUserPassword('');
      setNewUserRole('parent');
      fetchUsers();
    } catch (err: any) {
      if (err.code === 'auth/email-already-in-use' || (err.message && err.message.includes('email-already-in-use'))) {
        setFeedback({ type: 'error', message: 'This username is already taken. Please choose another one.' });
      } else {
        console.error('Failed to add user', err);
        let msg = err.message || 'Failed to add user';
        if (err.message?.includes('permission-denied')) {
          msg = 'You do not have permission to add users.';
        }
        setFeedback({ type: 'error', message: msg });
      }
    } finally {
      setAddingUser(false);
    }
  };

  const getTimestampTime = (dt: any) => {
    if (!dt) return 0;
    if (typeof dt.toDate === 'function') return dt.toDate().getTime();
    if (dt.seconds) return dt.seconds * 1000;
    return new Date(dt).getTime() || 0;
  };

  const fetchTourData = async () => {
    try {
      setBookingsLoading(true);
      const schedule = await getTourSchedule();
      setTourSchedule(schedule);
      const allBookings = await getAllBookings();
      setBookings(allBookings.sort((a, b) => getTimestampTime(b.createdAt) - getTimestampTime(a.createdAt)));
    } catch (err) {
      console.error('Failed to fetch tour data', err);
    } finally {
      setBookingsLoading(false);
    }
  };

  const fetchContent = async () => {
    try {
      fetchTourData();
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
        const { translations: defaultTranslations } = await import('../translations');
        const enDocData = enDoc.data();
        const amDocData = amDoc.data();

        // Deep merge for specific sections to ensure new fields are added
        const enData = { 
          ...defaultTranslations.en, 
          ...enDocData,
          announcement: { ...defaultTranslations.en.announcement, ...(enDocData.announcement || {}) },
          virtualTour: { ...defaultTranslations.en.virtualTour, ...(enDocData.virtualTour || {}) },
          enrollmentPage: { ...defaultTranslations.en.enrollmentPage, ...(enDocData.enrollmentPage || {}) },
          whyChoose: { ...defaultTranslations.en.whyChoose, ...(enDocData.whyChoose || {}) },
          faq: { ...defaultTranslations.en.faq, ...(enDocData.faq || {}) },
          hero: { ...defaultTranslations.en.hero, ...(enDocData.hero || {}) },
          nav: { ...defaultTranslations.en.nav, ...(enDocData.nav || {}) }
        };
        
        const amData = { 
          ...defaultTranslations.am, 
          ...amDocData,
          announcement: { ...defaultTranslations.am.announcement, ...(amDocData.announcement || {}) },
          virtualTour: { ...defaultTranslations.am.virtualTour, ...(amDocData.virtualTour || {}) },
          enrollmentPage: { ...defaultTranslations.am.enrollmentPage, ...(amDocData.enrollmentPage || {}) },
          whyChoose: { ...defaultTranslations.am.whyChoose, ...(amDocData.whyChoose || {}) },
          faq: { ...defaultTranslations.am.faq, ...(amDocData.faq || {}) },
          hero: { ...defaultTranslations.am.hero, ...(amDocData.hero || {}) },
          nav: { ...defaultTranslations.am.nav, ...(amDocData.nav || {}) }
        };

        // Ensure media array exists in virtualTour
        if (!enData.virtualTour.media) enData.virtualTour.media = defaultTranslations.en.virtualTour.media;
        if (!amData.virtualTour.media) amData.virtualTour.media = defaultTranslations.am.virtualTour.media;

        // Remove legacy fields
        delete enData.virtualTour.image;
        delete enData.virtualTour.video;
        delete amData.virtualTour.image;
        delete amData.virtualTour.video;

        // Normalize media items to ensure they have description
        if (enData.virtualTour.media) {
          enData.virtualTour.media = enData.virtualTour.media.map((m: any) => ({ description: '', ...m }));
        }
        if (amData.virtualTour.media) {
          amData.virtualTour.media = amData.virtualTour.media.map((m: any) => ({ description: '', ...m }));
        }

        // Normalize announcement to ensure it has title
        if (enData.announcement && typeof enData.announcement.title === 'undefined') {
          enData.announcement.title = '';
        }
        if (amData.announcement && typeof amData.announcement.title === 'undefined') {
          amData.announcement.title = '';
        }

        // Normalize arrays to ensure items have image field
        const arraysToNormalize = [
          ['hero', 'highlights'],
          ['safety', 'cards'],
          ['dailyExperience', 'timeline'],
          ['resources', 'items']
        ];

        arraysToNormalize.forEach(([section, arrayName]) => {
          if (enData[section] && enData[section][arrayName]) {
            enData[section][arrayName] = enData[section][arrayName].map((item: any) => ({ image: '', ...item }));
          }
          if (amData[section] && amData[section][arrayName]) {
            amData[section][arrayName] = amData[section][arrayName].map((item: any) => ({ image: '', ...item }));
          }
        });

        // Normalize addresses to ensure they are objects
        if (enData.footer?.addresses) {
          enData.footer.addresses = enData.footer.addresses.map((a: any) => 
            typeof a === 'string' ? { locationName: a, googleMapsCoordinates: '' } : a
          );
        }
        if (amData.footer?.addresses) {
          amData.footer.addresses = amData.footer.addresses.map((a: any) => 
            typeof a === 'string' ? { locationName: a, googleMapsCoordinates: '' } : a
          );
        }

        // Add emailTemplates default
        const defaultEmailTemplates = {
          approval: {
            subject: 'Kidtopia Tour Booking - Confirmed',
            body: 'Your Tour is Confirmed!\n\nHi {name},\n\nGreat news! Your physical tour at Kidtopia has been approved.\n\nDate: {dayName}, {date}\nTime: {time}\n\nWe look forward to meeting you! If you have any questions, please contact us.'
          },
          rejection: {
            subject: 'Tour Booking Update',
            body: 'Tour Booking Update\n\nHi {name},\n\nUnfortunately, we are unable to accommodate your physical tour request for {dayName}, {date} at {time}.\n\nPlease feel free to submit a new request with a different time, or contact our office for further assistance.'
          }
        };

        if (!(enData as any).emailTemplates) (enData as any).emailTemplates = JSON.parse(JSON.stringify(defaultEmailTemplates));
        if (!(amData as any).emailTemplates) (amData as any).emailTemplates = JSON.parse(JSON.stringify(defaultEmailTemplates));

        setContent({
          en: enData,
          am: amData
        });
      }
    } catch (err) {
      console.error('Failed to fetch or initialize content', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (content && activeSection === 'hero') {
      const hero = content[activeLang].hero;
      if (hero && (hero.backgroundType === undefined || hero.heroVideo === undefined)) {
        const newContent = JSON.parse(JSON.stringify(content));
        if (newContent[activeLang].hero.backgroundType === undefined) newContent[activeLang].hero.backgroundType = 'image';
        if (newContent[activeLang].hero.heroVideo === undefined) newContent[activeLang].hero.heroVideo = '';
        setContent(newContent);
      }
    }
  }, [content, activeLang, activeSection]);

  useEffect(() => {
    if (content && activeSection === 'hero') {
      const hero = content[activeLang].hero;
      if (hero && (hero.backgroundType === undefined || hero.heroVideo === undefined)) {
        const newContent = JSON.parse(JSON.stringify(content));
        if (newContent[activeLang].hero.backgroundType === undefined) newContent[activeLang].hero.backgroundType = 'image';
        if (newContent[activeLang].hero.heroVideo === undefined) newContent[activeLang].hero.heroVideo = '';
        setContent(newContent);
      }
    }
  }, [content, activeLang, activeSection]);

  const isNonTextField = (key: string, value: any): boolean => {
    if (typeof value !== 'string') return true;
    const lowerKey = key.toLowerCase();
    const nonTextKeys = [
      'image', 'video', 'heroimage', 'herovideo', 'url', 'type', 
      'backgroundtype', 'icon', 'logo', 'buttonlink', 'googlemapscoordinates',
      'image1', 'image2', 'rating', 'rate'
    ];
    if (nonTextKeys.includes(lowerKey)) return true;
    if (value.startsWith('http://') || value.startsWith('https://') || value.startsWith('data:') || value.startsWith('blob:')) {
      return true;
    }
    return false;
  };

  const transformToOtherLangItem = (obj: any): any => {
    if (obj === null || obj === undefined) return obj;
    if (Array.isArray(obj)) {
      return obj.map(item => transformToOtherLangItem(item));
    }
    if (typeof obj === 'object') {
      const newObj: any = {};
      for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          const value = obj[key];
          if (isNonTextField(key, value)) {
            newObj[key] = transformToOtherLangItem(value);
          } else {
            newObj[key] = "";
          }
        }
      }
      return newObj;
    }
    if (typeof obj === 'string') {
      return "";
    }
    return obj;
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, 'content', 'en'), content.en);
      await setDoc(doc(db, 'content', 'am'), content.am);
      setFeedback({ type: 'success', message: 'Content saved successfully for both languages!' });
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

  const handleFileUpload = async (path: string[], file: File, type: 'image' | 'video' = 'image') => {
    try {
      const { storage } = await import('../firebase');
      const { ref, uploadBytes, getDownloadURL } = await import('firebase/storage');
      
      const fileExtension = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExtension}`;
      const storageRef = ref(storage, `uploads/${type}s/${fileName}`);
      
      setFeedback({ type: 'success', message: `Uploading ${type}...` });
      
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      handleChange(path, downloadURL);
      setFeedback({ type: 'success', message: `${type === 'image' ? 'Image' : 'Video'} uploaded successfully!` });
    } catch (err: any) {
      console.error(`Error uploading ${type}`, err);
      setFeedback({ type: 'error', message: `Upload failed: ${err.message || 'Check permissions'}` });
    }
  };

  const handleChange = (path: string[], value: any) => {
    const newContent = JSON.parse(JSON.stringify(content));
    const lastKey = path[path.length - 1];

    const writeToLang = (lang: 'en' | 'am', val: any) => {
      let current = newContent[lang];
      for (let i = 0; i < path.length - 1; i++) {
        if (!current[path[i]]) return;
        current = current[path[i]];
      }
      current[lastKey] = val;
    };

    if (isNonTextField(lastKey, value)) {
      writeToLang('en', value);
      writeToLang('am', value);
    } else {
      writeToLang(activeLang, value);
    }

    setContent(newContent);
  };

  const addItem = (path: string[]) => {
    const newContent = JSON.parse(JSON.stringify(content));
    
    const getArrayAt = (lang: 'en' | 'am') => {
      let current = newContent[lang];
      for (let i = 0; i < path.length - 1; i++) {
        if (!current[path[i]]) return null;
        current = current[path[i]];
      }
      return current[path[path.length - 1]];
    };

    const activeArray = getArrayAt(activeLang);
    if (Array.isArray(activeArray)) {
      const key = path[path.length - 1];
      let template: any;
      if (activeArray.length > 0) {
        if (typeof activeArray[0] !== 'object' || activeArray[0] === null) {
          template = '';
        } else {
          template = Object.keys(activeArray[0]).reduce((acc, k) => {
            const originalValue = (activeArray[0] as any)[k];
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
        if (['phones', 'emails', 'features'].includes(k)) {
          template = '';
        } else if (k === 'highlights') {
          template = { title: '', desc: '', image: '' };
        } else if (k === 'addresses') {
          template = { locationName: '', googleMapsCoordinates: '' };
        } else if (k === 'members') {
          template = { name: '', role: '', desc: '', image: '' };
        } else if (k === 'list') {
          template = { name: '', text: '', rating: 5, image: '', workInfo: '' };
        } else if (k === 'timeline') {
          template = { time: '', activity: '', image: '' };
        } else if (k === 'items') {
          template = { title: '', description: '', type: '', image: '' };
        } else if (k === 'media') {
          template = { url: '', type: 'image', description: '' };
        } else if (k === 'cards') {
          template = { title: '', desc: '', image: '', moreInfo: '' };
        } else if (k === 'processsteps') {
          template = { step: '', title: '', desc: '' };
        } else if (k === 'documentslist') {
          template = { title: '', desc: '' };
        } else {
          template = { title: '', description: '', image: '' };
        }
      }
      
      activeArray.push(template);
      
      const otherLang = activeLang === 'en' ? 'am' : 'en';
      const otherArray = getArrayAt(otherLang);
      if (Array.isArray(otherArray)) {
        otherArray.push(transformToOtherLangItem(template));
      }
      
      setContent(newContent);
    }
  };

  const removeItem = (path: string[], index: number) => {
    setConfirmModal({
      message: 'Are you sure you want to remove this item? This action will remove it from both English and Amharic versions to keep them structurally identical.',
      onConfirm: () => {
        setContent((prevContent: any) => {
          if (!prevContent) return prevContent;
          const newContent = JSON.parse(JSON.stringify(prevContent));
          
          const removeForLang = (lang: 'en' | 'am') => {
            let current = newContent[lang];
            for (let i = 0; i < path.length - 1; i++) {
              if (!current[path[i]]) return;
              current = current[path[i]];
            }
            const array = current[path[path.length - 1]];
            if (Array.isArray(array)) {
              array.splice(index, 1);
            }
          };
          
          removeForLang('en');
          removeForLang('am');
          
          setFeedback({ type: 'success', message: 'Item removed from both languages' });
          return newContent;
        });
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
    { id: 'bookings', icon: <Megaphone size={18} />, label: 'Tour Bookings' },
    { id: 'emailTemplates', icon: <Megaphone size={18} />, label: 'Email Templates' },
    { id: 'nav', icon: <Layout size={18} />, label: 'Navigation' },
    { id: 'announcement', icon: <Megaphone size={18} />, label: 'Announcement' },
    { id: 'hero', icon: <Layout size={18} />, label: 'Hero Section' },
    { id: 'safety', icon: <Shield size={18} />, label: 'Safety & Trust' },
    { id: 'programs', icon: <Settings size={18} />, label: 'Programs' },
    { id: 'staff', icon: <Users size={18} />, label: 'Staff' },
    { id: 'whyChoose', icon: <Shield size={18} />, label: 'Why Choose Us' },
    { id: 'faq', icon: <HelpCircle size={18} />, label: 'FAQs' },
    { id: 'dailyExperience', icon: <Layout size={18} />, label: 'Daily Experience' },
    { id: 'testimonials', icon: <Users size={18} />, label: 'Testimonials' },
    { id: 'cta', icon: <Layout size={18} />, label: 'Call to Action' },
    { id: 'virtualTour', icon: <Layout size={18} />, label: 'Virtual Tour' },
    { id: 'resources', icon: <Layout size={18} />, label: 'Resources' },
    { id: 'footer', icon: <Layout size={18} />, label: 'Footer' },
    { id: 'login', icon: <Users size={18} />, label: 'Login Page' },
    { id: 'leadCapture', icon: <Layout size={18} />, label: 'Lead Capture' },
    { id: 'enrollmentPage', icon: <FileText size={18} />, label: 'Enrollment Page' },
    { id: 'users', icon: <Users size={18} />, label: 'User Management' },
    { id: 'security', icon: <Shield size={18} />, label: 'Security Settings' },
  ];

  const sortObjectKeysByTemplate = (obj: any, path: string[]) => {
    if (!obj || typeof obj !== 'object') return [];
    
    let templateObj: any = defaultTranslations.en;
    for (const segment of path) {
      if (!templateObj) break;
      if (Array.isArray(templateObj)) {
        if (!isNaN(Number(segment))) {
          templateObj = templateObj[0] || {};
        } else {
          // It's an array but the segment isn't a number? Should rarely happen unless structure mismatches
          templateObj = undefined;
        }
      } else {
        templateObj = templateObj[segment];
      }
    }
    
    if (Array.isArray(templateObj)) {
      templateObj = templateObj[0] || {};
    }
    
    if (!templateObj || typeof templateObj !== 'object') {
      return Object.keys(obj);
    }
    
    const templateKeys = Object.keys(templateObj);
    return Object.keys(obj).sort((a, b) => {
      const idxA = templateKeys.indexOf(a);
      const idxB = templateKeys.indexOf(b);
      if (idxA !== -1 && idxB !== -1) return idxA - idxB;
      if (idxA !== -1) return -1;
      if (idxB !== -1) return 1;
      return a.localeCompare(b);
    });
  };

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
      if (key === 'type' && path[0] === 'announcement') {
        return (
          <div key={path.join('.')} className="mb-4">
            <label className="block text-sm font-medium text-stone-700 mb-1 capitalize">
              Announcement Type
            </label>
            <select
              value={value}
              onChange={(e) => handleChange(path, e.target.value)}
              className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-brand-green outline-none bg-white"
            >
              <option value="info">Info (Blue)</option>
              <option value="warning">Warning (Amber)</option>
              <option value="success">Success (Green)</option>
              <option value="danger">Urgent / Danger (Rose-Red)</option>
              <option value="royal">Royal (Purple)</option>
              <option value="sunset">Sunset (Orange)</option>
              <option value="teal">Calm (Teal)</option>
            </select>
          </div>
        );
      }

      if (key === 'type' && path[0] === 'leadCapture') {
        return (
          <div key={path.join('.')} className="mb-4">
            <label className="block text-sm font-medium text-stone-700 mb-1 capitalize">
              Popup Style / Accent Theme
            </label>
            <select
              value={value}
              onChange={(e) => handleChange(path, e.target.value)}
              className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-brand-green outline-none bg-white"
            >
              <option value="info">Primary (Green Accent)</option>
              <option value="warning">Attention (Orange Accent)</option>
              <option value="success">Nurturing (Teal Accent)</option>
            </select>
          </div>
        );
      }

      if (key === 'enabled' && path[0] === 'leadCapture') {
        return (
          <div key={path.join('.')} className="mb-4">
            <label className="block text-sm font-medium text-stone-700 mb-1 capitalize">
              Popup Status (Active / Disabled)
            </label>
            <select
              value={value}
              onChange={(e) => handleChange(path, e.target.value)}
              className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-brand-green outline-none bg-white"
            >
              <option value="true">Active (Show Popup after 30 seconds)</option>
              <option value="false">Disabled (Do Not Show)</option>
            </select>
          </div>
        );
      }

      if (key === 'type' && path.includes('media')) {
        return (
          <div key={path.join('.')} className="mb-4">
            <label className="block text-sm font-medium text-stone-700 mb-1 capitalize">
              Media Type
            </label>
            <select
              value={value}
              onChange={(e) => handleChange(path, e.target.value)}
              className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-brand-green outline-none bg-white"
            >
              <option value="image">Image</option>
              <option value="video">Video</option>
            </select>
          </div>
        );
      }

      if (key === 'buttonLink' && (path[0] === 'announcement' || path[0] === 'leadCapture')) {
        return (
          <div key={path.join('.')} className="mb-4">
            <label className="block text-sm font-medium text-stone-700 mb-1 capitalize">
              Call To Action Button Target
            </label>
            <select
              value={value}
              onChange={(e) => handleChange(path, e.target.value)}
              className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-brand-green outline-none bg-white"
            >
              {path[0] === 'announcement' && <option value="">None (Don't Show Button)</option>}
              <option value="/book-tour">Book a Tour</option>
              <option value="/enroll">Enroll Now</option>
              <option value="/programs">Programs</option>
              <option value="/about">About Us</option>
              <option value="/virtual-tour">Virtual Tour</option>
              <option value="/resources">Parent Resources</option>
              <option value="/testimonials">Testimonials</option>
              <option value="/contact">Contact Us</option>
              <option value="/login">Login</option>
            </select>
          </div>
        );
      }

      if (key === 'buttonText' && (path[0] === 'announcement' || path[0] === 'leadCapture')) {
        let parentObjTmp = content[activeLang];
        for (let i = 0; i < path.length - 1; i++) {
          parentObjTmp = parentObjTmp[path[i]];
        }
        if (path[0] === 'announcement' && !parentObjTmp.buttonLink) return null; // Don't show text if no target for announcement

        return (
          <div key={path.join('.')} className="mb-4">
            <label className="block text-sm font-medium text-stone-700 mb-1 capitalize">
              Button Display Text Label (e.g. Enroll Now, Book A Tour)
            </label>
            <input
              type="text"
              value={value}
              onChange={(e) => handleChange(path, e.target.value)}
              className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-brand-green outline-none bg-white"
              placeholder="e.g. Enroll Now"
            />
          </div>
        );
      }

      if (key === 'backgroundType' && path[0] === 'hero') {                
        return (
          <div key={path.join('.')} className="mb-4">
            <label className="block text-sm font-medium text-stone-700 mb-1 capitalize">
              Background Type
            </label>
            <select
              value={value}
              onChange={(e) => handleChange(path, e.target.value)}
              className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-brand-green outline-none bg-white"
            >
              <option value="image">Photo</option>
              <option value="video">Video</option>
            </select>
          </div>
        );
      }
      
      // Explicitly check for video URL even if not initially present
      if (key === 'heroVideo' && path[0] === 'hero') {
        return (
          <div key={path.join('.')} className="mb-4">
            <label className="block text-sm font-medium text-stone-700 mb-1 capitalize">
              Hero Video URL
            </label>
            <input
              type="text"
              value={value || ""}
              onChange={(e) => handleChange(path, e.target.value)}
              className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-brand-green outline-none"
              placeholder="Paste YouTube or direct video URL here"
            />
          </div>
        );
      }

      let parentObj = content[activeLang];
      for (let i = 0; i < path.length - 1; i++) {
        parentObj = parentObj[path[i]];
      }
      const mediaType = parentObj?.type || 'image';
      const isMediaUrl = key === 'url' && path.includes('media');

      const isImage = key.toLowerCase().includes('image') || key.toLowerCase().includes('img') || key.toLowerCase().includes('photo') || key.toLowerCase().includes('icon') || key.toLowerCase().includes('avatar') || (isMediaUrl && mediaType === 'image');
      const isVideo = key.toLowerCase().includes('video') || key.toLowerCase().includes('movie') || key.toLowerCase().includes('clip') || (isMediaUrl && mediaType === 'video');
      const isMoreInfo = key === 'moreInfo';
      const isDescription = key === 'description' || key === 'desc';
      const isAnnouncementText = (key === 'text' && path[0] === 'announcement') || (key === 'text' && path[0] === 'leadCapture');
      const isEmailBody = key === 'body' && path[0] === 'emailTemplates';

      const isColor = key.toLowerCase().includes('color');

      if (isColor) {
        return (
          <div key={path.join('.')} className="mb-4">
            <label className="block text-sm font-medium text-stone-700 mb-1 capitalize">
              {key.replace(/([A-Z])/g, ' $1').trim()}
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={value}
                onChange={(e) => handleChange(path, e.target.value)}
                className="w-10 h-10 border-0 rounded cursor-pointer"
              />
              <input
                type="text"
                value={value}
                onChange={(e) => handleChange(path, e.target.value)}
                className="flex-1 px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-brand-green outline-none"
              />
            </div>
          </div>
        );
      }

      if (isAnnouncementText) {
        return (
          <div key={path.join('.')} className="mb-4">
            <label className="block text-sm font-medium text-stone-700 mb-1 capitalize">
              {key}
            </label>
            <textarea
              value={value}
              onChange={(e) => handleChange(path, e.target.value)}
              className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-brand-green outline-none min-h-[100px]"
              placeholder={`Enter ${key}...`}
            />
          </div>
        );
      }

      if (isImage || isVideo) {
        return (
          <div key={path.join('.')} className="mb-4">
            <label className="block text-sm font-medium text-stone-700 mb-1 capitalize">
              {key.replace(/([A-Z])/g, ' $1').trim()}
            </label>
            <div className="flex items-center gap-4">
              {value && (
                isImage ? (
                  <img src={value} alt={key} className="w-16 h-16 object-cover rounded-lg border border-stone-200" />
                ) : (
                  <div className="w-16 h-16 bg-stone-100 rounded-lg border border-stone-200 flex items-center justify-center overflow-hidden">
                    <video src={value} className="w-full h-full object-cover" />
                  </div>
                )
              )}
              <div className="flex-1">
                <input
                  type="text"
                  value={value}
                  onChange={(e) => handleChange(path, e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-brand-green outline-none mb-2"
                  placeholder={isImage ? "Image URL" : "Video URL"}
                />
                <label className="cursor-pointer flex items-center gap-2 text-sm text-brand-green hover:text-brand-orange transition-colors">
                  <ImageIcon size={16} />
                  <span>Upload {isImage ? 'Image' : 'Video'}</span>
                  <input
                    type="file"
                    accept={isImage ? "image/*" : "video/*"}
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleFileUpload(path, e.target.files[0], isImage ? 'image' : 'video');
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
            {isEmailBody ? 'Email Content (Line breaks are preserved)' : key.replace(/([A-Z])/g, ' $1').trim()}
          </label>
          {value.length > 100 || isMoreInfo || isDescription || isEmailBody ? (
            <textarea
              value={value}
              onChange={(e) => handleChange(path, e.target.value)}
              className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-brand-green outline-none"
              rows={isMoreInfo || isEmailBody ? 6 : 3}
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
      // Special case for addresses to ensure they are treated as objects even if empty
      const isAddresses = key === 'addresses';
      const isPrimitiveArray = !isAddresses && (value.length > 0 ? typeof value[0] !== 'object' : true);
      
      return (
        <div key={path.join('.')} className="mb-6 p-4 bg-stone-50 rounded-xl border border-stone-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-stone-800 capitalize">{key}</h3>
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
                sortObjectKeysByTemplate(item, path).map((itemKey) => 
                  renderField(itemKey, item[itemKey], [...path, index.toString(), itemKey])
                )
              )}
            </div>
          ))}
          <button 
            onClick={() => addItem(path)}
            className="flex items-center gap-1 text-sm text-brand-green border border-brand-green px-3 py-2 rounded-lg hover:bg-brand-green hover:text-white transition-colors w-max mt-2"
          >
            <Plus size={16} />
            Add Item
          </button>
        </div>
      );
    }
    
    if (typeof value === 'object' && value !== null) {
      return (
        <div key={path.join('.')} className="mb-6">
          <h3 className="text-lg font-bold text-stone-800 mb-4 capitalize">{key}</h3>
          {sortObjectKeysByTemplate(value, path).map((objKey) => 
            renderField(objKey, value[objKey], [...path, objKey])
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
            onClick={() => setActiveSection('bookings')}
            className="p-2 bg-stone-100 text-stone-600 rounded-lg relative"
          >
            <Bell size={18} />
            {bookings.filter(b => b.status === 'pending').length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
                {bookings.filter(b => b.status === 'pending').length}
              </span>
            )}
          </button>
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
            <div className="hidden md:flex items-center gap-4">
              <button 
                onClick={() => setActiveSection('bookings')}
                className="relative p-2 text-stone-600 bg-white border border-stone-200 hover:bg-stone-50 rounded-full transition-colors shadow-sm"
              >
                <Bell size={20} />
                {bookings.filter(b => b.status === 'pending').length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full w-5 h-5 flex items-center justify-center font-bold border-2 border-white">
                    {bookings.filter(b => b.status === 'pending').length}
                  </span>
                )}
              </button>
              <button 
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 bg-brand-green text-white px-6 py-2.5 rounded-full font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                <Save size={18} />
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-4 md:p-8">
            {activeSection === 'users' ? (
              <div className="space-y-6">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-stone-900">Registered Users</h2>
                    <p className="text-xs text-stone-500 mt-1">Manage user access and roles.</p>
                  </div>
                  <button 
                    onClick={fetchUsers}
                    className="text-sm text-brand-green hover:underline"
                  >
                    Refresh List
                  </button>
                </div>

                <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 mb-6">
                  <h3 className="text-sm font-bold text-stone-800 mb-3">Add New User</h3>
                  <form onSubmit={handleAddUser} className="flex flex-col md:flex-row gap-3">
                    <input
                      type="text"
                      value={newUserUsername}
                      onChange={(e) => setNewUserUsername(e.target.value)}
                      placeholder="Username"
                      required
                      className="flex-1 px-3 py-2 border border-stone-200 rounded-lg outline-none focus:border-brand-green text-sm"
                    />
                    <input
                      type="password"
                      value={newUserPassword}
                      onChange={(e) => setNewUserPassword(e.target.value)}
                      placeholder="Password (min 6 chars)"
                      required
                      className="flex-1 px-3 py-2 border border-stone-200 rounded-lg outline-none focus:border-brand-green text-sm"
                    />
                    <select
                      value={newUserRole}
                      onChange={(e) => setNewUserRole(e.target.value)}
                      className="px-3 py-2 border border-stone-200 rounded-lg outline-none focus:border-brand-green text-sm bg-white"
                    >
                      <option value="parent">Parent</option>
                      <option value="staff">Staff</option>
                      <option value="admin">Admin</option>
                    </select>
                    <button
                      type="submit"
                      disabled={addingUser}
                      className="bg-brand-green text-white px-4 py-2 rounded-lg font-bold text-sm hover:opacity-90 transition-opacity disabled:opacity-50 whitespace-nowrap"
                    >
                      {addingUser ? 'Adding...' : 'Add User'}
                    </button>
                  </form>
                </div>

                {usersLoading ? (
                  <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-green"></div>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b border-stone-100">
                          <th className="pb-4 font-bold text-stone-600 text-sm">Email</th>
                          <th className="pb-4 font-bold text-stone-600 text-sm">Role</th>
                          <th className="pb-4 font-bold text-stone-600 text-sm">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-50">
                        {users.map((user) => (
                          <tr key={user.uid} className="hover:bg-stone-50/50 transition-colors">
                            <td className="py-4 text-stone-700 text-sm">{user.email || 'No Email'}</td>
                            <td className="py-4">
                              <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                user.role === 'admin' ? 'bg-red-100 text-red-600' :
                                user.role === 'staff' ? 'bg-blue-100 text-blue-600' :
                                'bg-green-100 text-green-600'
                              }`}>
                                {user.role}
                              </span>
                            </td>
                            <td className="py-4 flex items-center gap-2">
                              <select 
                                value={user.role}
                                onChange={(e) => handleUpdateUserRole(user.uid, e.target.value)}
                                className="text-sm border border-stone-200 rounded-lg px-2 py-1 outline-none focus:border-brand-green"
                                disabled={user.email === 'admin@kidtopiaet.com' || (adminConfig && user.email === adminConfig.email)}
                              >
                                <option value="parent">Parent</option>
                                <option value="staff">Staff</option>
                                <option value="admin">Admin</option>
                              </select>
                              <button
                                onClick={() => handleDeleteUser(user.uid)}
                                disabled={user.email === 'admin@kidtopiaet.com' || (adminConfig && user.email === adminConfig.email)}
                                className="p-1.5 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-stone-400"
                                title="Remove User Access"
                              >
                                <Trash2 size={16} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ) : activeSection === 'security' ? (
              <div className="space-y-8">
                <div>
                  <h2 className="text-xl font-bold text-stone-900 mb-2">Admin Account Settings</h2>
                  <p className="text-sm text-stone-500 mb-6">Configure your login username and password. This updates both the shortcut and your actual account password.</p>
                  
                  <form onSubmit={handleUpdateSecurity} className="space-y-4 max-w-md">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-stone-700">Login Username</label>
                      <input 
                        type="text"
                        value={adminConfig?.username || ''}
                        onChange={(e) => setAdminConfig({ ...adminConfig, username: e.target.value })}
                        className="w-full px-4 py-2 border border-stone-200 rounded-xl outline-none focus:border-brand-green"
                        placeholder="e.g. admin"
                        required
                        autoCapitalize="none"
                        autoCorrect="off"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-stone-700">New Password (leave blank to keep current)</label>
                      <div className="relative">
                        <input 
                          type={showNewPassword ? "text" : "password"}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="w-full px-4 py-2 border border-stone-200 rounded-xl outline-none focus:border-brand-green pr-12"
                          placeholder="••••••••"
                          autoCapitalize="none"
                          autoCorrect="off"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-brand-green transition-colors p-1"
                        >
                          {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                    </div>
                    
                    <button 
                      type="submit"
                      disabled={securityLoading}
                      className="w-full py-3 bg-brand-green text-white rounded-xl font-bold hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                      {securityLoading ? 'Updating...' : 'Save Security Settings'}
                    </button>
                  </form>

                  <div className="mt-12 pt-8 border-t border-stone-100">
                    <h3 className="text-lg font-bold text-stone-900 mb-2">Fingerprint Authentication</h3>
                    <p className="text-sm text-stone-500 mb-4">Register your fingerprint to enable quick login using your SecuGen Hamster Plus scanner.</p>
                    <div className="flex flex-col gap-4 max-w-md">
                      <button 
                        onClick={handleRegisterFingerprint}
                        disabled={fingerprintLoading}
                        className="flex items-center justify-center gap-2 px-4 py-3 bg-stone-900 text-white rounded-xl hover:bg-stone-800 transition-colors font-bold disabled:opacity-50"
                      >
                        <Fingerprint size={20} />
                        {fingerprintLoading ? 'Processing...' : 'Register Fingerprint'}
                      </button>
                      {fingerprintStatus && (
                        <div className={`p-3 rounded-xl text-sm ${fingerprintStatus.includes('Error') ? 'bg-red-50 text-red-700 border border-red-100' : 'bg-stone-50 text-stone-700 border border-stone-100'}`}>
                          {fingerprintStatus}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-12 pt-8 border-t border-stone-100">
                    <h3 className="text-lg font-bold text-stone-900 mb-2">Notification Emails</h3>
                    <p className="text-sm text-stone-500 mb-4">Enter the email addresses that should receive alerts (like the 2-hour pending approval reminder). Separate multiple emails with a comma.</p>
                    <div className="flex flex-col gap-4 max-w-md">
                      <input 
                        type="text"
                        value={adminConfig?.adminEmails?.join(', ') || ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          const emailsArray = val.split(',').map(e => e.trim()).filter(e => !!e);
                          setAdminConfig({ ...adminConfig, adminEmails: emailsArray });
                        }}
                        className="w-full px-4 py-2 border border-stone-200 rounded-xl outline-none focus:border-brand-green"
                        placeholder="admin1@kidtopiaet.com, admin2@kidtopiaet.com"
                      />
                      <button 
                        onClick={async () => {
                          setSecurityLoading(true);
                          try {
                            await updateAdminConfig(adminConfig);
                            setFeedback({ type: 'success', message: 'Notification emails saved!' });
                          } catch (err) {
                            setFeedback({ type: 'error', message: 'Failed to update emails' });
                          } finally {
                            setSecurityLoading(false);
                          }
                        }}
                        disabled={securityLoading}
                        className="py-2 bg-brand-green text-white rounded-xl font-bold hover:opacity-90 transition-opacity disabled:opacity-50"
                      >
                        Save Notification Emails
                      </button>
                    </div>
                  </div>

                  <div className="mt-12 pt-8 border-t border-stone-100">
                    <h3 className="text-lg font-bold text-stone-900 mb-2">System Diagnostics</h3>
                    <p className="text-sm text-stone-500 mb-4">Check the status of the backend server and file upload system.</p>
                    <div className="flex flex-col gap-4 max-w-md">
                      <button 
                        onClick={checkApiHealth}
                        className="flex items-center justify-center gap-2 px-4 py-2 border border-stone-200 rounded-xl text-stone-700 hover:bg-stone-50 transition-colors font-medium"
                      >
                        <Shield size={18} />
                        Check API Health
                      </button>
                      {apiStatus && (
                        <div className={`p-3 rounded-xl text-sm font-mono break-all ${apiStatus.includes('OK') ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                          {apiStatus}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : activeSection === 'bookings' ? (
              <div className="space-y-8">
                {/* Pending Actions / Notification Panel */}
                {(() => {
                   const pending = bookings.filter(b => b.status === 'pending');
                   if (pending.length === 0) return null;
                   return (
                     <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
                       <h3 className="text-amber-800 font-bold mb-2 flex items-center gap-2">
                         <Megaphone size={18} /> Required Attention: Pending Tours ({pending.length})
                       </h3>
                       <p className="text-sm text-amber-700">You have {pending.length} tour booking(s) awaiting approval.</p>
                     </div>
                   );
                })()}

                <div>
                  <h2 className="text-xl font-bold text-stone-900 mb-4">Tour Schedule Settings</h2>
                  <p className="text-sm text-stone-500 mb-4">Manage the available time slots for tour bookings (8:30 AM to 6:00 PM).</p>
                  
                  <div className="mb-4">
                    <label className="text-sm font-bold text-stone-700 block mb-2">Schedule Day</label>
                    <div className="flex flex-wrap gap-2">
                      {daysOfWeek.map(day => (
                        <button
                          key={day}
                          onClick={() => setScheduleViewDay(day)}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${
                            scheduleViewDay === day 
                              ? 'bg-brand-green text-white border-brand-green' 
                              : 'bg-white text-stone-600 border-stone-200 hover:border-brand-green'
                          }`}
                        >
                          {day}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-stone-50 rounded-xl border border-stone-200">
                    {(() => {
                      const currentSlots = scheduleViewDay === 'Default' 
                        ? tourSchedule?.slots || []
                        : (tourSchedule?.daySchedules?.[scheduleViewDay] || JSON.parse(JSON.stringify(tourSchedule?.slots || [])));

                      return currentSlots.map((slot: any, idx: number) => (
                        <label key={idx} className="flex items-center gap-3 cursor-pointer p-2 hover:bg-stone-100 rounded-lg">
                          <input
                            type="checkbox"
                            checked={slot.active}
                            onChange={async (e) => {
                              const newSlots = [...currentSlots];
                              newSlots[idx].active = e.target.checked;
                              
                              const updatedSchedule = { ...tourSchedule };
                              if (!updatedSchedule.daySchedules) {
                                updatedSchedule.daySchedules = {};
                              }

                              if (scheduleViewDay === 'Default') {
                                updatedSchedule.slots = newSlots;
                              } else {
                                updatedSchedule.daySchedules[scheduleViewDay] = newSlots;
                              }
                              
                              setTourSchedule(updatedSchedule);
                              try {
                                await updateTourSchedule(updatedSchedule);
                                setFeedback({ type: 'success', message: 'Schedule updated!' });
                              } catch (err) {
                                setFeedback({ type: 'error', message: 'Failed to update schedule' });
                              }
                            }}
                            className="w-4 h-4 text-brand-green border-stone-300 rounded focus:ring-brand-green"
                          />
                          <span className="font-medium text-stone-700">{slot.time}</span>
                        </label>
                      ));
                    })()}
                  </div>
                </div>

                <div className="pt-8 border-t border-stone-200">
                  <h2 className="text-xl font-bold text-stone-900 mb-4">Recent Bookings</h2>
                  {bookingsLoading ? (
                    <div className="flex justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-green"></div>
                    </div>
                  ) : bookings.length === 0 ? (
                    <p className="text-stone-500 text-center py-8">No tours booked yet.</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="border-b border-stone-200">
                            <th className="pb-3 text-sm font-bold text-stone-600">Date & Time</th>
                            <th className="pb-3 text-sm font-bold text-stone-600">Name</th>
                            <th className="pb-3 text-sm font-bold text-stone-600">Contact</th>
                            <th className="pb-3 text-sm font-bold text-stone-600">Status</th>
                            <th className="pb-3 text-sm font-bold text-stone-600">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100">
                          {bookings.map((b) => (
                            <tr key={b.id}>
                              <td className="py-4 text-sm text-stone-900 font-medium">
                                {b.date} <br/><span className="text-stone-500 font-normal">{b.time}</span>
                              </td>
                              <td className="py-4 text-sm text-stone-800">{b.name}</td>
                              <td className="py-4 text-sm text-stone-500">
                                {b.email}<br/>{b.phone}
                              </td>
                              <td className="py-4 text-sm">
                                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                                  b.status === 'approved' ? 'bg-green-100 text-green-700' :
                                  b.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                  'bg-amber-100 text-amber-700'
                                }`}>
                                  {b.status.toUpperCase()}
                                </span>
                              </td>
                              <td className="py-4 text-sm">
                                <div className="flex gap-2">
                                  <button
                                    onClick={async () => {
                                      await updateBookingStatus(b.id, 'approved');
                                      setFeedback({ type: 'success', message: 'Booking approved!' });
                                      const updated = await getAllBookings();
                                      setBookings(updated.sort((a, b) => getTimestampTime(b.createdAt) - getTimestampTime(a.createdAt)));

                                      // Send approval email
                                      if (b.email) {
                                        const dayName = b.date ? new Date(b.date).toLocaleDateString('en-US', { weekday: 'long' }) : '';
                                        const templateHeader = content[activeLang]?.emailTemplates?.approval?.subject || 'Kidtopia Tour Booking - Confirmed';
                                        const templateBody = content[activeLang]?.emailTemplates?.approval?.body || `Your Tour is Confirmed!\n\nHi {name},\n\nGreat news! Your physical tour at Kidtopia has been approved.\n\nDate: {dayName}, {date}\nTime: {time}\n\nWe look forward to meeting you! If you have any questions, please contact us.`;
                                        const emailHtml = templateBody
                                            .replace(/\n/g, '<br/>')
                                            .replace(/\{name\}/g, b.name || '')
                                            .replace(/\{date\}/g, b.date || '')
                                            .replace(/\{time\}/g, b.time || '')
                                            .replace(/\{dayName\}/g, dayName)
                                            // Handle potential legacy <p> tags visually nicely if they exist
                                            .replace(/<p>/g, '<p style="margin: 0 0 10px 0;">');
                                        const subject = templateHeader
                                            .replace(/\{name\}/g, b.name || '')
                                            .replace(/\{date\}/g, b.date || '')
                                            .replace(/\{time\}/g, b.time || '')
                                            .replace(/\{dayName\}/g, dayName);

                                        import('../firebase').then(({ sendEmail }) => {
                                            sendEmail(b.email, subject, emailHtml).catch(console.error);
                                        });
                                      }
                                    }}
                                    className="text-brand-green hover:underline font-medium"
                                  >
                                    Approve
                                  </button>
                                  <button
                                    onClick={async () => {
                                      await updateBookingStatus(b.id, 'rejected');
                                      setFeedback({ type: 'success', message: 'Booking rejected' });
                                      const updated = await getAllBookings();
                                      setBookings(updated.sort((a, b) => getTimestampTime(b.createdAt) - getTimestampTime(a.createdAt)));

                                      // Send rejection email
                                      if (b.email) {
                                        const dayName = b.date ? new Date(b.date).toLocaleDateString('en-US', { weekday: 'long' }) : '';
                                        const templateHeader = content[activeLang]?.emailTemplates?.rejection?.subject || 'Tour Booking Update';
                                        const templateBody = content[activeLang]?.emailTemplates?.rejection?.body || `Tour Booking Update\n\nHi {name},\n\nUnfortunately, we are unable to accommodate your physical tour request for {dayName}, {date} at {time}.\n\nPlease feel free to submit a new request with a different time, or contact our office for further assistance.`;
                                        const emailHtml = templateBody
                                            .replace(/\n/g, '<br/>')
                                            .replace(/\{name\}/g, b.name || '')
                                            .replace(/\{date\}/g, b.date || '')
                                            .replace(/\{time\}/g, b.time || '')
                                            .replace(/\{dayName\}/g, dayName)
                                            .replace(/<p>/g, '<p style="margin: 0 0 10px 0;">');
                                        const subject = templateHeader
                                            .replace(/\{name\}/g, b.name || '')
                                            .replace(/\{date\}/g, b.date || '')
                                            .replace(/\{time\}/g, b.time || '')
                                            .replace(/\{dayName\}/g, dayName);

                                        import('../firebase').then(({ sendEmail }) => {
                                            sendEmail(b.email, subject, emailHtml).catch(console.error);
                                        });
                                      }
                                    }}
                                    className="text-red-500 hover:underline font-medium ml-2"
                                  >
                                    Reject
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            ) : content[activeLang] && content[activeLang][activeSection] ? (
              <>
                {activeSection === 'emailTemplates' && (
                  <div className="mb-6 p-4 bg-lime-50 border border-brand-green/20 rounded-xl">
                    <h3 className="font-bold text-brand-green mb-2 flex items-center gap-2">
                       <Megaphone size={18}/> Placeholder Variables
                    </h3>
                    <p className="text-sm text-stone-600 mb-2">You can use these placeholders inside your email templates. They will be automatically replaced with the booking data when an email is sent:</p>
                    <ul className="list-disc pl-5 text-sm text-stone-600 space-y-1">
                      <li><strong>{`{name}`}</strong> - The parent's name</li>
                      <li><strong>{`{date}`}</strong> - The requested tour date (YYYY-MM-DD)</li>
                      <li><strong>{`{time}`}</strong> - The requested tour time</li>
                      <li><strong>{`{dayName}`}</strong> - The day of the week (e.g., Monday, Tuesday)</li>
                    </ul>
                  </div>
                )}
                {activeSection === 'virtualTour' && (
                  <div className="mb-10 p-6 bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl shadow-sm">
                    <h3 className="font-bold text-stone-800 dark:text-stone-100 text-base mb-2 flex items-center gap-2 font-sans">
                      <Compass size={20} className="text-brand-green animate-spin" style={{ animationDuration: '12s' }} />
                      Interactive 360° Virtual Tour Layout Builder
                    </h3>
                    <p className="text-sm text-stone-600 dark:text-stone-400 mb-6 font-sans">
                      Drag to look around the virtual room, and use the "🛠️ Edit 360 Tour" button inside the viewer below to add/delete 360 rooms or link rooms with interactive connection hotspots.
                    </p>
                    <ThreeSixtyViewer isAdminMode={true} />
                  </div>
                )}
                {sortObjectKeysByTemplate(content[activeLang][activeSection], [activeSection]).map((key) => 
                  renderField(key, content[activeLang][activeSection][key], [activeSection, key])
                )}
              </>
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
