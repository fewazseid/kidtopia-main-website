import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Save, LogOut, Settings, Layout, Users, Shield, Image as ImageIcon, Trash2, Plus, Menu, X, ChevronDown, ChevronUp, Eye, EyeOff, Fingerprint, Megaphone, Bell, FileText, HelpCircle, Compass, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useContentRefresh, ContentContext } from '../ContentContext';
import { AnimatePresence } from 'motion/react';

// Live Preview Components
import { Hero } from '../components/Hero';
import { Announcement } from '../components/Announcement';
import { LeadCapturePopup } from '../components/LeadCapturePopup';
import { TrustSafety } from '../components/TrustSafety';
import { Programs } from '../components/Programs';
import { WhyChoose } from '../components/WhyChoose';
import { StaffSection } from '../components/StaffSection';
import { VirtualTour } from '../components/VirtualTour';
import { DailyExperience } from '../components/DailyExperience';
import { Resources } from '../components/Resources';
import { Testimonials } from '../components/Testimonials';
import { FAQSection } from '../components/FAQSection';
import { CTASection } from '../components/CTASection';
import { Footer } from '../components/Footer';
import { Header } from '../components/Header';
import { EnrollPage } from './EnrollPage';
import { SoftwareShowcase } from '../components/SoftwareShowcase';
import { IframePreview } from '../components/IframePreview';
import { db, auth, logout as firebaseLogout, getAllUsers, updateUserRole, getAdminConfig, updateAdminConfig, updateCurrentUserPassword, saveFingerprintTemplate, getTourSchedule, updateTourSchedule, getAllBookings, updateBookingStatus, sendEmail, deleteBooking } from '../firebase';
import { captureFingerprint, isSecuGenAvailable, isFingerprintSimulatorEnabled, setFingerprintSimulator } from '../services/fingerprintService';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { translations as defaultTranslations } from '../translations';
import { ThreeSixtyViewer } from '../components/ThreeSixtyViewer';

export function convertGoogleDriveUrl(url: string): string {
  if (!url) return '';
  const trimmed = url.trim();
  
  // Matches standard file/d/FILE_ID/view format
  const fileDMatch = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileDMatch && fileDMatch[1]) {
    return `https://lh3.googleusercontent.com/d/${fileDMatch[1]}`;
  }
  
  // Matches open?id=FILE_ID query parameter format
  const idMatch = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (idMatch && idMatch[1]) {
    return `https://lh3.googleusercontent.com/d/${idMatch[1]}`;
  }
  
  return trimmed;
}

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const refreshContent = useContentRefresh();
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeLang, setActiveLang] = useState<'en' | 'am'>('en');
  const [activeSection, setActiveSection] = useState('hero');
  const [resourcesSubTab, setResourcesSubTab] = useState<'general' | 'rules' | 'policies' | 'handbook' | 'directive' | 'nutrition_milestones'>('general');
  
  // AI Policy Assistant state
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiTone, setAiTone] = useState('professional');
  const [aiAction, setAiAction] = useState<'generate' | 'rephrase' | 'add_clause'>('add_clause');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState('');

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error' | 'info', message: string } | null>(null);
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
  const [newUserRole, setNewUserRole] = useState('admin');
  const [addingUser, setAddingUser] = useState(false);
  const [apiStatus, setApiStatus] = useState<string | null>(null);
  const [fingerprintLoading, setFingerprintLoading] = useState(false);
  const [fingerprintStatus, setFingerprintStatus] = useState<string | null>(null);
  const [isSimulated, setIsSimulated] = useState(isFingerprintSimulatorEnabled());

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
          leadCapture: { ...defaultTranslations.en.leadCapture, ...(enDocData.leadCapture || {}) },
          virtualTour: { ...defaultTranslations.en.virtualTour, ...(enDocData.virtualTour || {}) },
          enrollmentPage: { ...defaultTranslations.en.enrollmentPage, ...(enDocData.enrollmentPage || {}) },
          whyChoose: { ...defaultTranslations.en.whyChoose, ...(enDocData.whyChoose || {}) },
          faq: { ...defaultTranslations.en.faq, ...(enDocData.faq || {}) },
          hero: { ...defaultTranslations.en.hero, ...(enDocData.hero || {}) },
          resources: { 
            ...defaultTranslations.en.resources, 
            ...(enDocData.resources || {}),
            intlActTitle: enDocData.resources?.intlActTitle !== undefined ? enDocData.resources.intlActTitle : defaultTranslations.en.resources.intlActTitle,
            intlActBody: enDocData.resources?.intlActBody !== undefined ? enDocData.resources.intlActBody : defaultTranslations.en.resources.intlActBody,
            intlGuidelinesTitle: enDocData.resources?.intlGuidelinesTitle !== undefined ? enDocData.resources.intlGuidelinesTitle : defaultTranslations.en.resources.intlGuidelinesTitle,
            intlGuidelinesBody: enDocData.resources?.intlGuidelinesBody !== undefined ? enDocData.resources.intlGuidelinesBody : defaultTranslations.en.resources.intlGuidelinesBody,
            policiesAndRegulations: enDocData.resources?.policiesAndRegulations !== undefined ? enDocData.resources.policiesAndRegulations : defaultTranslations.en.resources.policiesAndRegulations,
          },
          nav: { ...defaultTranslations.en.nav, ...(enDocData.nav || {}) },
          footer: {
            ...defaultTranslations.en.footer,
            ...(enDocData.footer || {}),
            social: {
              ...defaultTranslations.en.footer.social,
              ...(enDocData.footer?.social || {})
            }
          }
        };
        
        const amData = { 
          ...defaultTranslations.am, 
          ...amDocData,
          announcement: { ...defaultTranslations.am.announcement, ...(amDocData.announcement || {}) },
          leadCapture: { ...defaultTranslations.am.leadCapture, ...(amDocData.leadCapture || {}) },
          virtualTour: { ...defaultTranslations.am.virtualTour, ...(amDocData.virtualTour || {}) },
          enrollmentPage: { ...defaultTranslations.am.enrollmentPage, ...(amDocData.enrollmentPage || {}) },
          whyChoose: { ...defaultTranslations.am.whyChoose, ...(amDocData.whyChoose || {}) },
          faq: { ...defaultTranslations.am.faq, ...(amDocData.faq || {}) },
          hero: { ...defaultTranslations.am.hero, ...(amDocData.hero || {}) },
          resources: { 
            ...defaultTranslations.am.resources, 
            ...(amDocData.resources || {}),
            intlActTitle: amDocData.resources?.intlActTitle !== undefined ? amDocData.resources.intlActTitle : defaultTranslations.am.resources.intlActTitle,
            intlActBody: amDocData.resources?.intlActBody !== undefined ? amDocData.resources.intlActBody : defaultTranslations.am.resources.intlActBody,
            intlGuidelinesTitle: amDocData.resources?.intlGuidelinesTitle !== undefined ? amDocData.resources.intlGuidelinesTitle : defaultTranslations.am.resources.intlGuidelinesTitle,
            intlGuidelinesBody: amDocData.resources?.intlGuidelinesBody !== undefined ? amDocData.resources.intlGuidelinesBody : defaultTranslations.am.resources.intlGuidelinesBody,
            policiesAndRegulations: amDocData.resources?.policiesAndRegulations !== undefined ? amDocData.resources.policiesAndRegulations : defaultTranslations.am.resources.policiesAndRegulations,
          },
          nav: { ...defaultTranslations.am.nav, ...(amDocData.nav || {}) },
          footer: {
            ...defaultTranslations.am.footer,
            ...(amDocData.footer || {}),
            social: {
              ...defaultTranslations.am.footer.social,
              ...(amDocData.footer?.social || {})
            }
          }
        };

        // Deep merge resources items by actionType to guarantee new regulatory card items exist
        if (enDocData.resources?.items) {
          const mergedItems = enDocData.resources.items.filter(
            (item: any) => item && !['ar_activities', 'forms', 'avatar'].includes(item.actionType)
          );
          defaultTranslations.en.resources.items.forEach((defaultItem: any) => {
            const exists = mergedItems.some((item: any) => item.actionType === defaultItem.actionType);
            if (!exists) {
              mergedItems.push(defaultItem);
            }
          });
          enData.resources.items = mergedItems;
        }

        if (amDocData.resources?.items) {
          const mergedItems = amDocData.resources.items.filter(
            (item: any) => item && !['ar_activities', 'forms', 'avatar'].includes(item.actionType)
          );
          defaultTranslations.am.resources.items.forEach((defaultItem: any) => {
            const exists = mergedItems.some((item: any) => item.actionType === defaultItem.actionType);
            if (!exists) {
              mergedItems.push(defaultItem);
            }
          });
          amData.resources.items = mergedItems;
        }

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
            enData[section][arrayName] = enData[section][arrayName].map((item: any, idx: number) => {
              const base: any = { image: '', ...item };
              if (section === 'resources') {
                if (typeof base.actionType === 'undefined') base.actionType = 'handbook';
                if (typeof base.link === 'undefined') base.link = '';
              }
              return base;
            });
          }
          if (amData[section] && amData[section][arrayName]) {
            amData[section][arrayName] = amData[section][arrayName].map((item: any, idx: number) => {
              const base: any = { image: '', ...item };
              if (section === 'resources') {
                if (typeof base.actionType === 'undefined') base.actionType = 'handbook';
                if (typeof base.link === 'undefined') base.link = '';
              }
              return base;
            });
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

  const transformToOtherLangItem = (obj: any, keyName?: string): any => {
    if (obj === null || obj === undefined) return obj;
    if (Array.isArray(obj)) {
      return obj.map(item => transformToOtherLangItem(item, keyName));
    }
    if (typeof obj === 'object') {
      const newObj: any = {};
      for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          const value = obj[key];
          if (isNonTextField(key, value)) {
            newObj[key] = JSON.parse(JSON.stringify(value));
          } else {
            newObj[key] = transformToOtherLangItem(value, key);
          }
        }
      }
      return newObj;
    }
    if (typeof obj === 'string') {
      if (keyName && isNonTextField(keyName, obj)) {
        return obj;
      }
      return "";
    }
    return obj;
  };

  const [translatingFields, setTranslatingFields] = useState<Record<string, boolean>>({});

  const translateTextOnServer = async (text: string, source: 'en' | 'am', target: 'en' | 'am') => {
    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, sourceLang: source, targetLang: target })
      });
      const data = await response.json();
      if (data.success && data.translatedText) {
        return data.translatedText;
      }
    } catch (e) {
      console.error('API Translation failed', e);
    }
    return '';
  };

  const getOtherLangValue = (path: string[]) => {
    const otherLang = activeLang === 'en' ? 'am' : 'en';
    if (!content || !content[otherLang]) return '';
    let current = content[otherLang];
    for (const segment of path) {
      if (current === null || current === undefined) return '';
      current = current[segment];
    }
    return typeof current === 'string' ? current : '';
  };

  const handleInlineTranslate = async (path: string[]) => {
    const otherVal = getOtherLangValue(path);
    if (!otherVal) return;
    
    const pathKey = path.join('.');
    setTranslatingFields(prev => ({ ...prev, [pathKey]: true }));
    try {
      const otherLang = activeLang === 'en' ? 'am' : 'en';
      const translated = await translateTextOnServer(otherVal, otherLang, activeLang);
      if (translated) {
        handleChange(path, translated);
      } else {
        alert('Translation failed. Please check your network connection.');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setTranslatingFields(prev => ({ ...prev, [pathKey]: false }));
    }
  };

  const handleRunAiAssistant = async (targetField: 'intlGuidelinesBody' | 'intlActBody') => {
    if (!aiPrompt.trim()) {
      alert('Please describe what you want the AI to do.');
      return;
    }
    setAiLoading(true);
    setAiResult('');
    try {
      const currentText = content[activeLang]['resources'][targetField] || '';
      const response = await fetch('/api/ai-helper', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: aiPrompt,
          context: currentText,
          action: aiAction,
          lang: activeLang,
          tone: aiTone
        })
      });
      const data = await response.json();
      if (data.success && data.text) {
        setAiResult(data.text);
      } else {
        alert('AI helper failed: ' + (data.error || 'Unknown error'));
      }
    } catch (err: any) {
      console.error(err);
      alert('An error occurred while contacting the AI helper.');
    } finally {
      setAiLoading(false);
    }
  };

  const handleApplyAiResult = (targetField: 'intlGuidelinesBody' | 'intlActBody') => {
    if (!aiResult) return;
    handleChange(['resources', targetField], aiResult);
    setAiResult('');
    setAiPrompt('');
    setFeedback({ type: 'success', message: 'AI suggestion applied successfully to policy text!' });
  };

  interface TranslationJob {
    path: string[];
    sourceText: string;
    sourceLang: 'en' | 'am';
    targetLang: 'en' | 'am';
  }

  const syncAndQueueTranslations = (enVal: any, amVal: any, currentPath: string[], jobs: TranslationJob[]): { en: any, am: any } => {
    if (enVal === null || enVal === undefined) return { en: null, am: amVal };
    if (amVal === null || amVal === undefined) return { en: enVal, am: null };

    let repairedEn = enVal;
    let repairedAm = amVal;

    // Structural repair: If one side is an object/array and the other is a primitive (e.g., "", null, undefined),
    // convert the primitive to match the object's structure.
    const keyName = currentPath[currentPath.length - 1];
    if (typeof enVal === 'object' && enVal !== null && (typeof amVal !== 'object' || amVal === null)) {
      repairedAm = transformToOtherLangItem(enVal, keyName);
    } else if (typeof amVal === 'object' && amVal !== null && (typeof enVal !== 'object' || enVal === null)) {
      repairedEn = transformToOtherLangItem(amVal, keyName);
    }

    // Now check if either is primitive
    if (typeof repairedEn !== 'object' || typeof repairedAm !== 'object' || repairedEn === null || repairedAm === null) {
      if (typeof repairedEn === 'string' && typeof repairedAm === 'string') {
        const trimmedEn = repairedEn.trim();
        const trimmedAm = repairedAm.trim();
        
        if (trimmedEn !== '' && trimmedAm === '') {
          jobs.push({
            path: currentPath,
            sourceText: trimmedEn,
            sourceLang: 'en',
            targetLang: 'am'
          });
        } else if (trimmedAm !== '' && trimmedEn === '') {
          jobs.push({
            path: currentPath,
            sourceText: trimmedAm,
            sourceLang: 'am',
            targetLang: 'en'
          });
        }
      }
      return { en: repairedEn, am: repairedAm };
    }

    // If both are arrays
    if (Array.isArray(repairedEn) && Array.isArray(repairedAm)) {
      const maxLength = Math.max(repairedEn.length, repairedAm.length);
      const newEnArr = [];
      const newAmArr = [];
      for (let i = 0; i < maxLength; i++) {
        const itemEn = repairedEn[i];
        const itemAm = repairedAm[i];
        const nextPath = [...currentPath, i.toString()];

        if (itemEn !== undefined && itemAm !== undefined) {
          const res = syncAndQueueTranslations(itemEn, itemAm, nextPath, jobs);
          newEnArr.push(res.en);
          newAmArr.push(res.am);
        } else if (itemEn !== undefined) {
          // Missing in Amharic: Clone English item structure to Amharic
          const clonedAm = transformToOtherLangItem(itemEn, keyName);
          const res = syncAndQueueTranslations(itemEn, clonedAm, nextPath, jobs);
          newEnArr.push(res.en);
          newAmArr.push(res.am);
        } else if (itemAm !== undefined) {
          // Missing in English: Clone Amharic item structure to English
          const clonedEn = transformToOtherLangItem(itemAm, keyName);
          const res = syncAndQueueTranslations(clonedEn, itemAm, nextPath, jobs);
          newEnArr.push(res.en);
          newAmArr.push(res.am);
        }
      }
      return { en: newEnArr, am: newAmArr };
    }

    // If both are objects
    if (typeof repairedEn === 'object' && typeof repairedAm === 'object') {
      const allKeys = Array.from(new Set([...Object.keys(repairedEn), ...Object.keys(repairedAm)]));
      const newEnObj: any = {};
      const newAmObj: any = {};

      for (const key of allKeys) {
        const nextPath = [...currentPath, key];
        const valEn = repairedEn[key];
        const valAm = repairedAm[key];

        if (valEn !== undefined && valAm !== undefined) {
          const res = syncAndQueueTranslations(valEn, valAm, nextPath, jobs);
          newEnObj[key] = res.en;
          newAmObj[key] = res.am;
        } else if (valEn !== undefined) {
          // Key exists in English, but missing in Amharic
          const clonedAm = transformToOtherLangItem(valEn, key);
          const res = syncAndQueueTranslations(valEn, clonedAm, nextPath, jobs);
          newEnObj[key] = res.en;
          newAmObj[key] = res.am;
        } else if (valAm !== undefined) {
          // Key exists in Amharic, but missing in English
          const clonedEn = transformToOtherLangItem(valAm, key);
          const res = syncAndQueueTranslations(clonedEn, valAm, nextPath, jobs);
          newEnObj[key] = res.en;
          newAmObj[key] = res.am;
        }
      }
      return { en: newEnObj, am: newAmObj };
    }

    return { en: repairedEn, am: repairedAm };
  };

  const handleSave = async () => {
    setSaving(true);
    setFeedback({ type: 'info', message: 'Checking structures and queued translations...' });
    try {
      const enDataCopy = JSON.parse(JSON.stringify(content.en));
      const amDataCopy = JSON.parse(JSON.stringify(content.am));
      const jobs: TranslationJob[] = [];
      
      const { en: syncedEn, am: syncedAm } = syncAndQueueTranslations(enDataCopy, amDataCopy, [], jobs);
      
      if (jobs.length > 0) {
        setFeedback({ 
          type: 'info', 
          message: `Auto-translating ${jobs.length} structural text fields using Gemini AI (please wait)...` 
        });
        
        // Let's run all translation jobs
        const results = await Promise.all(
          jobs.map(async (job) => {
            const translated = await translateTextOnServer(job.sourceText, job.sourceLang, job.targetLang);
            return { job, translated };
          })
        );
        
        // Write translations back to our data copies
        results.forEach(({ job, translated }) => {
          if (translated) {
            let current = job.targetLang === 'en' ? syncedEn : syncedAm;
            for (let i = 0; i < job.path.length - 1; i++) {
              current = current[job.path[i]];
            }
            current[job.path[job.path.length - 1]] = translated;
          }
        });
        
        // Set state so UI updates
        setContent({ en: syncedEn, am: syncedAm });
      } else {
        setContent({ en: syncedEn, am: syncedAm });
      }

      await setDoc(doc(db, 'content', 'en'), syncedEn);
      await setDoc(doc(db, 'content', 'am'), syncedAm);
      setFeedback({ 
        type: 'success', 
        message: jobs.length > 0 
          ? `Content synchronized and saved successfully! Automatically translated ${jobs.length} structural fields.` 
          : 'Content and structure synchronized perfectly across both languages!' 
      });
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
        otherArray.push(transformToOtherLangItem(template, key));
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

  const moveItem = (path: string[], index: number, direction: 'up' | 'down') => {
    setContent((prevContent: any) => {
      if (!prevContent) return prevContent;
      const newContent = JSON.parse(JSON.stringify(prevContent));
      
      const moveForLang = (lang: 'en' | 'am') => {
        let current = newContent[lang];
        for (let i = 0; i < path.length - 1; i++) {
          if (!current[path[i]]) return;
          current = current[path[i]];
        }
        const array = current[path[path.length - 1]];
        if (Array.isArray(array)) {
          const targetIndex = direction === 'up' ? index - 1 : index + 1;
          if (targetIndex >= 0 && targetIndex < array.length) {
            const temp = array[index];
            array[index] = array[targetIndex];
            array[targetIndex] = temp;
          }
        }
      };
      
      moveForLang('en');
      moveForLang('am');
      
      setFeedback({ type: 'success', message: `Item moved ${direction}` });
      return newContent;
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
    { id: 'softwareShowcase', icon: <Layout size={18} />, label: 'Software Showcase' },
    { id: 'resources', icon: <Layout size={18} />, label: 'Resources' },
    { id: 'footer', icon: <Layout size={18} />, label: 'Footer' },
    { id: 'login', icon: <Users size={18} />, label: 'Login Page' },
    { id: 'leadCapture', icon: <Layout size={18} />, label: 'Lead Capture' },
    { id: 'enrollmentPage', icon: <FileText size={18} />, label: 'Enrollment Page' },
    { id: 'users', icon: <Users size={18} />, label: 'User Management' },
    { id: 'security', icon: <Shield size={18} />, label: 'Security Settings' },
  ];

  const previewableSections = [
    'hero', 'announcement', 'safety', 'programs', 'whyChoose', 
    'staff', 'virtualTour', 'dailyExperience', 'resources', 
    'testimonials', 'faq', 'cta', 'footer', 'nav', 'enrollmentPage',
    'leadCapture', 'softwareShowcase'
  ];
  const canPreview = previewableSections.includes(activeSection);

  const renderPreviewComponent = () => {
    switch (activeSection) {
      case 'hero':
        return <Hero lang={activeLang} onScrollTo={() => {}} />;
      case 'announcement':
        return <Announcement lang={activeLang} />;
      case 'safety':
        return <TrustSafety lang={activeLang} />;
      case 'programs':
        return <Programs lang={activeLang} />;
      case 'whyChoose':
        return <WhyChoose lang={activeLang} />;
      case 'staff':
        return <StaffSection lang={activeLang} />;
      case 'virtualTour':
        return <VirtualTour lang={activeLang} />;
      case 'dailyExperience':
        return <DailyExperience lang={activeLang} />;
      case 'resources':
        return <Resources lang={activeLang} />;
      case 'softwareShowcase':
        return <SoftwareShowcase lang={activeLang} isAdminView={true} />;
      case 'testimonials':
        return <Testimonials lang={activeLang} />;
      case 'faq':
        return <FAQSection lang={activeLang} />;
      case 'cta':
        return <CTASection lang={activeLang} />;
      case 'footer':
        return <Footer lang={activeLang} />;
      case 'leadCapture':
        return (
          <div className="p-8 flex flex-col items-center justify-center bg-stone-100 border border-stone-200 rounded-3xl shadow-inner min-h-[350px]">
            <LeadCapturePopup lang={activeLang} forceVisible={true} />
            <div className="mt-6 text-center text-xs text-stone-500 font-medium">
              Live Interactive Preview of the customized Lead Capture Popup
            </div>
          </div>
        );
      case 'nav':
        return (
          <div className="relative pt-24 pb-8 bg-stone-100">
            <Header lang={activeLang} setLang={() => {}} onScrollTo={() => {}} />
            <div className="p-8 text-center text-stone-500 font-medium bg-white border border-stone-200 rounded-2xl shadow-sm mt-8 mx-4">
              Navigation Header is rendered above. You can see how the menu items and language controls are positioned.
            </div>
          </div>
        );
      case 'enrollmentPage':
        return <EnrollPage lang={activeLang} />;
      default:
        return (
          <div className="p-8 text-center text-stone-500">
            No preview available for this section.
          </div>
        );
    }
  };

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

  // Strips legacy HTML tags and maps technical placeholders to user-friendly ones
  const cleanEmailTemplateForUser = (text: string): string => {
    if (!text) return '';
    let cleaned = text
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/h[1-6]>/gi, '\n\n')
      .replace(/<\/p>/gi, '\n\n')
      .replace(/<[^>]+>/g, ''); // strip any remaining tags
    
    cleaned = cleaned.replace(/\n{3,}/g, '\n\n');

    cleaned = cleaned
      .replace(/\{name\}/g, '[Parent Name]')
      .replace(/\{date\}/g, '[Date]')
      .replace(/\{time\}/g, '[Time]')
      .replace(/\{dayName\}/g, '[Day]');

    return cleaned.trim();
  };

  // Translates user-friendly placeholders back to internal format
  const prepareEmailTemplateForSave = (text: string): string => {
    if (!text) return '';
    return text
      .replace(/\[Parent Name\]/g, '{name}')
      .replace(/\[Date\]/g, '{date}')
      .replace(/\[Time\]/g, '{time}')
      .replace(/\[Day\]/g, '{dayName}');
  };

  // Formats email template text with a beautiful Kidtopia header/wrapper and Map section
  const formatEmailWithTheme = (title: string, bodyText: string, branchName?: string, hideMap = false): string => {
    const paragraphs = bodyText
      .split('\n')
      .filter(p => p.trim() !== '')
      .map(p => `<p style="margin: 0 0 16px 0; font-size: 16px; line-height: 1.6; color: #44403c;">${p}</p>`)
      .join('');

    // Dynamically retrieve addresses from the footer configuration
    const footerT = content[activeLang]?.footer || content['en']?.footer;
    const branches = footerT?.addresses || [];

    let resolvedBranchName = 'Kidtopia International Daycare and Preschool, Addis Ababa, Ethiopia';
    let resolvedCoordinates = '9.0054,38.8475';

    if (branchName && branchName !== 'Main Branch' && branchName !== 'Campus Branch') {
      const match = branches.find((b: any) => {
        const name = typeof b === 'string' ? b : b.locationName;
        return name.toLowerCase().includes(branchName.toLowerCase()) || branchName.toLowerCase().includes(name.toLowerCase());
      });
      if (match) {
        resolvedBranchName = typeof match === 'string' ? match : match.locationName;
        resolvedCoordinates = typeof match === 'string' ? '' : match.googleMapsCoordinates;
      } else {
        resolvedBranchName = branchName;
      }
    } else if (branches.length > 0) {
      const firstBranch = branches[0];
      resolvedBranchName = typeof firstBranch === 'string' ? firstBranch : firstBranch.locationName;
      resolvedCoordinates = typeof firstBranch === 'string' ? '' : firstBranch.googleMapsCoordinates;
    }

    const mapQuery = resolvedCoordinates || resolvedBranchName;
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`;

    const mapSection = hideMap ? '' : `
      <div style="margin-top: 30px; border: 1px solid #e7e5e4; border-radius: 16px; background-color: #fafaf9; padding: 24px;">
        <h4 style="margin: 0 0 8px 0; font-size: 15px; font-weight: bold; color: #1c1917;">
          Campus Location Details
        </h4>
        <p style="margin: 0 0 12px 0; font-size: 14px; font-weight: 600; color: #10b981;">${resolvedBranchName}</p>
        <p style="margin: 0 0 18px 0; font-size: 13px; line-height: 1.4; color: #78716c;">
          We have embedded the direct link to get driving directions, walking pathways, or public transit routes to this campus on Google Maps. Tap the button below to get directions:
        </p>
        <div style="text-align: center;">
          <a href="${mapsUrl}" target="_blank" rel="noopener noreferrer" style="display: inline-block; padding: 12px 24px; background-color: #ea580c; color: white; text-decoration: none; border-radius: 10px; font-weight: bold; font-size: 14px; box-shadow: 0 4px 6px rgba(234,88,12,0.15); font-family: sans-serif;">Open Campus in Google Maps</a>
        </div>
      </div>
    `;

    return `
      <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #fafaf9; padding: 40px 20px; text-align: center;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.03); border: 1px solid #e7e5e4; text-align: left;">
          
          <!-- Header Banner -->
          <div style="background-color: #10b981; padding: 32px 40px; text-align: center;">
            <h1 style="margin: 0; font-size: 26px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px;">${title}</h1>
          </div>

          <!-- Body Content -->
          <div style="padding: 40px;">
            ${paragraphs}
            
            ${mapSection}
            
            <div style="margin-top: 40px; padding-top: 24px; border-top: 1px solid #f5f5f4; color: #78716c; font-size: 13px;">
              <p style="margin: 0 0 4px 0; font-weight: bold; color: #44403c;">Kidtopia International Daycare and Preschool</p>
              <p style="margin: 0;">Providing top-tier bilingual early childhood education.</p>
            </div>
          </div>

        </div>
      </div>
    `;
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
              <option value="danger">Urgent / Danger (Rose-Red)</option>
              <option value="royal">Royal (Purple)</option>
              <option value="sunset">Sunset (Orange)</option>
              <option value="teal">Calm (Teal)</option>
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
              <option value="true">Active (Show Popup after scrolling past Announcement)</option>
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
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-sm font-medium text-stone-700 capitalize">
                {key}
              </label>
              {getOtherLangValue(path) && (
                <button
                  type="button"
                  onClick={() => handleInlineTranslate(path)}
                  disabled={translatingFields[path.join('.')]}
                  className="text-xs text-brand-green hover:text-brand-orange hover:scale-102 transition-all flex items-center gap-1 cursor-pointer font-bold disabled:opacity-50"
                  title="Auto-translate this field from the other language using Gemini AI"
                >
                  {translatingFields[path.join('.')] ? (
                    <>
                      <span className="w-2.5 h-2.5 border-2 border-brand-green border-t-transparent rounded-full animate-spin"></span>
                      <span>Translating...</span>
                    </>
                  ) : (
                    <>
                      Translate from {activeLang === 'en' ? 'Amharic' : 'English'}
                    </>
                  )}
                </button>
              )}
            </div>
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
                  <img src={value} alt={key} className="w-16 h-16 object-cover rounded-lg border border-stone-200 animate-in fade-in" />
                ) : (
                  <div className="w-16 h-16 bg-stone-100 rounded-lg border border-stone-200 flex items-center justify-center overflow-hidden animate-in fade-in">
                    <video src={value} className="w-full h-full object-cover" />
                  </div>
                )
              )}
              <div className="flex-1">
                <input
                  type="text"
                  value={value}
                  onChange={(e) => handleChange(path, e.target.value)}
                  onBlur={(e) => {
                    const converted = convertGoogleDriveUrl(e.target.value);
                    if (converted !== e.target.value) {
                      handleChange(path, converted);
                    }
                  }}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-brand-green outline-none mb-2"
                  placeholder={isImage ? "Image URL (Paste Google Drive link to auto-import!)" : "Video URL (Paste Google Drive link to auto-import!)"}
                />
                
                <div className="flex flex-wrap items-center gap-4">
                  <label className="cursor-pointer flex items-center gap-1.5 text-xs text-brand-green font-semibold hover:text-brand-orange transition-colors">
                    <ImageIcon size={14} />
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

                  <button
                    type="button"
                    onClick={() => {
                      const link = prompt(`Please paste your shared Google Drive ${isImage ? 'image' : 'video'} link:\n(Make sure sharing in Drive is set to 'Anyone with the link can view')`);
                      if (link) {
                        const converted = convertGoogleDriveUrl(link);
                        handleChange(path, converted);
                        alert('Google Drive file successfully imported & converted to direct high-speed link!');
                      }
                    }}
                    className="flex items-center gap-1.5 text-xs text-blue-600 font-semibold hover:text-blue-800 transition"
                  >
                    <Settings size={14} className="animate-spin text-blue-500" style={{ animationDuration: '6s' }} />
                    <span>Select from Drive</span>
                  </button>

                  <span className="text-[10px] text-stone-400">
                    (Drive file sharing must be enabled)
                  </span>
                </div>
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
          <div className="flex justify-between items-center mb-1.5">
            <label className="block text-sm font-medium text-stone-700 capitalize">
              {isEmailBody ? 'Email Content (Line breaks are preserved)' : key.replace(/([A-Z])/g, ' $1').trim()}
            </label>
            {getOtherLangValue(path) && (
              <button
                type="button"
                onClick={() => handleInlineTranslate(path)}
                disabled={translatingFields[path.join('.')]}
                className="text-xs text-brand-green hover:text-brand-orange hover:scale-102 transition-all flex items-center gap-1 cursor-pointer font-bold disabled:opacity-50"
                title="Auto-translate this field from the other language using Gemini AI"
              >
                {translatingFields[path.join('.')] ? (
                  <>
                    <span className="w-2.5 h-2.5 border-2 border-brand-green border-t-transparent rounded-full animate-spin"></span>
                    <span>Translating...</span>
                  </>
                ) : (
                  <>
                    Translate from {activeLang === 'en' ? 'Amharic' : 'English'}
                  </>
                )}
              </button>
            )}
          </div>
          {key === 'actionType' ? (
            <select
              value={value}
              onChange={(e) => handleChange(path, e.target.value)}
              className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-brand-green outline-none bg-white font-medium"
            >
              <option value="handbook">handbook (Interactive Handbook Reader)</option>
              <option value="nutrition">nutrition (Nutrition & Meal Guide)</option>
              <option value="intl_act">intl_act (Ethiopian Childcare Directive No. 1084/2025)</option>
              <option value="intl_guidelines">intl_guidelines (Consolidated Daycare Policies & Guidelines)</option>
              <option value="url">url (Custom External URL Link)</option>
            </select>
          ) : isEmailBody ? (
            <div className="space-y-3 w-full">
              <textarea
                value={cleanEmailTemplateForUser(value)}
                onChange={(e) => {
                  const prepared = prepareEmailTemplateForSave(e.target.value);
                  handleChange(path, prepared);
                }}
                className="w-full px-4 py-3 border border-stone-300 rounded-xl focus:ring-2 focus:ring-brand-green outline-none font-sans text-sm text-stone-800 leading-relaxed"
                rows={8}
                placeholder="Write your beautiful email template message here..."
              />
              <div className="bg-lime-50/50 p-3 rounded-xl border border-brand-green/10">
                <span className="text-[11px] font-bold text-brand-green uppercase tracking-wider block mb-2">
                  Tap to Insert Friendly Tags (Automatically replaced with actual booking details):
                </span>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const cleaned = cleanEmailTemplateForUser(value);
                      const updated = cleaned + " [Parent Name]";
                      handleChange(path, prepareEmailTemplateForSave(updated));
                    }}
                    className="px-2.5 py-1.5 bg-white border border-stone-200 hover:border-brand-green hover:text-brand-green text-xs font-bold rounded-lg shadow-sm transition-all text-stone-700 cursor-pointer"
                  >
                    Parent Name
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const cleaned = cleanEmailTemplateForUser(value);
                      const updated = cleaned + " [Date]";
                      handleChange(path, prepareEmailTemplateForSave(updated));
                    }}
                    className="px-2.5 py-1.5 bg-white border border-stone-200 hover:border-brand-green hover:text-brand-green text-xs font-bold rounded-lg shadow-sm transition-all text-stone-700 cursor-pointer"
                  >
                    Date
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const cleaned = cleanEmailTemplateForUser(value);
                      const updated = cleaned + " [Time]";
                      handleChange(path, prepareEmailTemplateForSave(updated));
                    }}
                    className="px-2.5 py-1.5 bg-white border border-stone-200 hover:border-brand-green hover:text-brand-green text-xs font-bold rounded-lg shadow-sm transition-all text-stone-700 cursor-pointer"
                  >
                    Time
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const cleaned = cleanEmailTemplateForUser(value);
                      const updated = cleaned + " [Day]";
                      handleChange(path, prepareEmailTemplateForSave(updated));
                    }}
                    className="px-2.5 py-1.5 bg-white border border-stone-200 hover:border-brand-green hover:text-brand-green text-xs font-bold rounded-lg shadow-sm transition-all text-stone-700 cursor-pointer"
                  >
                    Day
                  </button>
                </div>
              </div>
            </div>
          ) : value.length > 100 || isMoreInfo || isDescription ? (
            <textarea
              value={value}
              onChange={(e) => handleChange(path, e.target.value)}
              className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-brand-green outline-none"
              rows={isMoreInfo ? 6 : 3}
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
              <div className="absolute top-2 right-2 flex items-center gap-1.5 md:opacity-0 md:group-hover:opacity-100 transition-opacity z-10">
                {index > 0 && (
                  <button
                    onClick={() => moveItem(path, index, 'up')}
                    className="text-stone-500 p-1.5 hover:bg-stone-100 rounded-lg"
                    title="Move Up"
                  >
                    <ChevronUp size={16} />
                  </button>
                )}
                {index < value.length - 1 && (
                  <button
                    onClick={() => moveItem(path, index, 'down')}
                    className="text-stone-500 p-1.5 hover:bg-stone-100 rounded-lg"
                    title="Move Down"
                  >
                    <ChevronDown size={16} />
                  </button>
                )}
                <button 
                  onClick={() => removeItem(path, index)}
                  className="text-red-500 p-1.5 hover:bg-red-50 rounded-lg"
                  title="Remove Item"
                >
                  <Trash2 size={16} />
                </button>
              </div>
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
      {/* Desktop & Mobile Fixed Sticky Save & Notification Header Panel aligned parallel with Kidtopia Logo */}
      <div className="fixed top-0 left-0 right-0 h-20 z-[60] pointer-events-none">
        <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-end gap-2 md:gap-4 pointer-events-none">
          <div className="flex items-center gap-2 md:gap-4 pointer-events-auto">
            <button 
              onClick={() => setActiveSection('bookings')}
              className={`relative p-2 md:p-2.5 text-stone-600 bg-white/80 hover:bg-white border border-stone-200/60 rounded-full transition-colors shadow-sm cursor-pointer flex items-center justify-center ${activeSection === 'bookings' ? 'ring-2 ring-brand-green bg-white' : ''}`}
              title="View Tour Bookings"
            >
              <Bell size={18} className="text-stone-700 md:w-5 md:h-5" />
              {bookings.filter(b => b.status === 'pending').length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] md:text-[10px] rounded-full w-4.5 h-4.5 md:w-5 md:h-5 flex items-center justify-center font-bold border-2 border-white">
                  {bookings.filter(b => b.status === 'pending').length}
                </span>
              )}
            </button>
            <button 
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-1.5 md:gap-2 bg-brand-green text-white px-3.5 py-2 md:px-5 md:py-2.5 rounded-full font-semibold hover:opacity-95 active:scale-98 transition-all disabled:opacity-50 shadow-md shadow-brand-green/10 cursor-pointer text-xs md:text-sm animate-pulse-once"
            >
              <Save size={16} className="md:w-[18px] md:h-[18px]" />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>

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
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-4 border-b border-stone-100">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-stone-900 capitalize">
                {activeSection === 'bookings' ? 'Tour Bookings' : activeSection === 'emailTemplates' ? 'Email Templates' : activeSection === 'users' ? 'User Management' : activeSection === 'security' ? 'Security Settings' : `${activeSection} Content`} ({activeLang.toUpperCase()})
              </h1>
              <p className="text-xs text-stone-500 mt-1">
                {activeSection === 'bookings' ? 'Review and manage incoming tour requests.' : activeSection === 'users' ? 'Manage system roles and bio logins.' : 'Customize wording and live-preview changes in real-time.'}
              </p>
            </div>
            
            {canPreview && (
              <div className="flex bg-stone-100 p-1 rounded-xl border border-stone-200/60 shadow-inner shrink-0 self-end sm:self-auto">
                <button
                  type="button"
                  onClick={() => setPreviewMode(false)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${!previewMode ? 'bg-white text-brand-green shadow-sm' : 'text-stone-600 hover:text-stone-900'}`}
                >
                  <Settings size={14} />
                  Form Editor
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewMode(true)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${previewMode ? 'bg-white text-brand-green shadow-sm' : 'text-stone-600 hover:text-stone-900'}`}
                >
                  <Eye size={14} />
                  Live Preview
                </button>
              </div>
            )}
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
                  <h3 className="text-sm font-bold text-stone-800 mb-3">Add New Admin User</h3>
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
                    <button
                      type="submit"
                      disabled={addingUser}
                      className="bg-brand-green text-white px-4 py-2 rounded-lg font-bold text-sm hover:opacity-90 transition-opacity disabled:opacity-50 whitespace-nowrap"
                    >
                      {addingUser ? 'Adding...' : 'Add Admin'}
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
                              <span className="text-xs text-stone-500 font-medium">Administrator</span>
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
                      <div className="bg-emerald-50 border border-emerald-150 p-4 rounded-xl text-xs text-stone-700 leading-relaxed">
                        <h4 className="font-bold text-brand-green mb-1.5 flex items-center gap-1.5">
                          <Fingerprint size={14} /> FREE SECUGEN WORKAROUND GUIDE
                        </h4>
                        <p className="mb-2">
                          Commercial SecuGen WebAPI licenses are paid. To bypass this, we have engineered a built-in <strong>Free Demo Simulator</strong> that completely removes the need for physical hardware or premium driver installations.
                        </p>
                        <ol className="list-decimal pl-4 space-y-1.5">
                          <li><strong>Free Simulator Mode (Default / Recommended):</strong> Simply toggle the "Free Demo Simulator" switch below. No drivers are needed. You can register and test fingerprint authentication for free instantly!</li>
                          <li><strong>Physical Hardware Integration:</strong> To use a physical SecuGen Hamster Plus, install the local USB bridge service listening on port <code className="bg-emerald-100 px-1 py-0.5 rounded font-mono">8000</code> (HTTP) or <code className="bg-emerald-100 px-1 py-0.5 rounded font-mono">8443</code> (HTTPS). Remember to trust self-signed local certificates.</li>
                        </ol>
                      </div>

                      <button 
                        onClick={handleRegisterFingerprint}
                        disabled={fingerprintLoading}
                        className="flex items-center justify-center gap-2 px-4 py-3 bg-stone-900 text-white rounded-xl hover:bg-stone-800 transition-colors font-bold disabled:opacity-50"
                      >
                        <Fingerprint size={20} />
                        {fingerprintLoading ? 'Processing...' : 'Register Fingerprint'}
                      </button>

                      <div className="flex items-center justify-between bg-stone-50 p-3 rounded-xl border border-stone-100">
                        <div className="flex items-center gap-2">
                          <Fingerprint size={16} className={isSimulated ? "text-amber-500" : "text-emerald-500"} />
                          <div>
                            <span className="text-xs text-stone-700 font-bold block">Free Demo Simulator</span>
                            <span className="text-[10px] text-stone-400 block">Bypasses commercial driver licenses</span>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={isSimulated}
                            onChange={(e) => {
                              const val = e.target.checked;
                              setIsSimulated(val);
                              setFingerprintSimulator(val);
                              setFingerprintStatus(val ? 'Switched to free Demo Simulator.' : 'Switched to physical hardware scanner.');
                            }}
                          />
                          <div className="w-9 h-5 bg-stone-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand-green"></div>
                        </label>
                      </div>

                      {fingerprintStatus && (
                        <div className={`p-3 rounded-xl text-sm ${fingerprintStatus.includes('Error') ? 'bg-red-50 text-red-700 border border-red-100' : 'bg-stone-50 text-stone-700 border border-stone-100'}`}>
                          {fingerprintStatus}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-12 pt-8 border-t border-stone-100">
                    <h3 className="text-lg font-bold text-stone-900 mb-2">Central Operations & Notifications Email</h3>
                    <p className="text-sm text-stone-500 mb-4">
                      Enter the single, central email address used to receive "Contact Us" submissions, receive {adminConfig?.reminderHours || 2}-hour pending review alerts, and serve as the reply-to destination for tour schedule emails.
                    </p>
                    <div className="flex flex-col gap-4 max-w-md">
                      <input 
                        type="email"
                        value={adminConfig?.operationsEmail || ''}
                        onChange={(e) => {
                          setAdminConfig({ ...adminConfig, operationsEmail: e.target.value.trim() });
                        }}
                        className="w-full px-4 py-2 border border-stone-200 rounded-xl outline-none focus:border-brand-green"
                        placeholder="operations@kidtopiaet.com"
                      />
                      <button 
                        onClick={async () => {
                          setSecurityLoading(true);
                          try {
                            await updateAdminConfig(adminConfig);
                            setFeedback({ type: 'success', message: 'Central operations email saved!' });
                          } catch (err) {
                            setFeedback({ type: 'error', message: 'Failed to update email' });
                          } finally {
                            setSecurityLoading(false);
                          }
                        }}
                        disabled={securityLoading}
                        className="py-2 bg-brand-green text-white rounded-xl font-bold hover:opacity-90 transition-opacity disabled:opacity-50"
                      >
                        Save Operations Email
                      </button>
                    </div>
                  </div>

                  <div className="mt-12 pt-8 border-t border-stone-100">
                    <h3 className="text-lg font-bold text-stone-900 mb-2">Pending Booking Alert Interval</h3>
                    <p className="text-sm text-stone-500 mb-4">
                      Choose after how many hours a pending booking triggers automatic reminder emails to the admin notification recipients.
                    </p>
                    <div className="flex flex-col gap-4 max-w-md">
                      <select
                        value={adminConfig?.reminderHours || 2}
                        onChange={(e) => {
                          setAdminConfig({ ...adminConfig, reminderHours: parseInt(e.target.value, 10) });
                        }}
                        className="w-full px-4 py-2.5 border border-stone-200 rounded-xl outline-none focus:border-brand-green bg-white text-stone-800 text-sm font-medium"
                      >
                        <option value={1}>1 Hour</option>
                        <option value={2}>2 Hours (Default)</option>
                        <option value={4}>4 Hours</option>
                        <option value={6}>6 Hours</option>
                        <option value={12}>12 Hours</option>
                        <option value={24}>24 Hours (1 Day)</option>
                        <option value={48}>48 Hours (2 Days)</option>
                        <option value={72}>72 Hours (3 Days)</option>
                      </select>
                      <button 
                        onClick={async () => {
                          setSecurityLoading(true);
                          try {
                            await updateAdminConfig(adminConfig);
                            setFeedback({ type: 'success', message: 'Pending alert interval saved!' });
                          } catch (err) {
                            setFeedback({ type: 'error', message: 'Failed to update alert interval' });
                          } finally {
                            setSecurityLoading(false);
                          }
                        }}
                        disabled={securityLoading}
                        className="py-2 bg-brand-green text-white rounded-xl font-bold hover:opacity-90 transition-opacity disabled:opacity-50"
                      >
                        Save Alert Interval
                      </button>
                    </div>
                  </div>

                  <div className="mt-12 pt-8 border-t border-stone-100">
                    <h3 className="text-lg font-bold text-stone-900 mb-2">Notification Emails</h3>
                    <p className="text-sm text-stone-500 mb-4">Enter the email addresses that should receive alerts (like the {adminConfig?.reminderHours || 2}-hour pending approval reminder). Separate multiple emails with a comma.</p>
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
                            <th className="pb-3 text-sm font-bold text-stone-600">Campus Branch</th>
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
                              <td className="py-4 text-sm text-stone-700 font-semibold">{b.branch || 'Main Branch'}</td>
                              <td className="py-4 text-sm text-stone-800">{b.name}</td>
                              <td className="py-4 text-sm text-stone-500">
                                {b.email}<br/>{b.phone}
                              </td>
                              <td className="py-4 text-sm">
                                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                                  b.status === 'approved' ? 'bg-green-100 text-green-700' :
                                  b.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                  b.status === 'cancelled' ? 'bg-stone-200 text-stone-600' :
                                  'bg-amber-100 text-amber-700'
                                }`}>
                                  {b.status.toUpperCase()}
                                </span>
                              </td>
                              <td className="py-4 text-sm">
                                <div className="flex gap-2">
                                  {b.status === 'pending' ? (
                                    <>
                                      <button
                                        onClick={async () => {
                                          await updateBookingStatus(b.id, 'approved');
                                          setFeedback({ type: 'success', message: 'Booking approved!' });
                                          const updated = await getAllBookings();
                                          setBookings(updated.sort((a, b) => getTimestampTime(b.createdAt) - getTimestampTime(a.createdAt)));

                                          // Send approval email
                                          if (b.email) {
                                            const bookingLang = (b.lang === 'am' ? 'am' : 'en') as 'en' | 'am';
                                            const dayName = b.date ? new Date(b.date).toLocaleDateString('en-US', { weekday: 'long' }) : '';
                                            const templateHeader = content[bookingLang]?.emailTemplates?.approval?.subject || (bookingLang === 'am' ? 'የኪድቶፒያ የጉብኝት ቀጠሮ - ተረጋግጧል' : 'Kidtopia Tour Booking - Confirmed');
                                            const templateBody = content[bookingLang]?.emailTemplates?.approval?.body || (bookingLang === 'am' 
                                                ? 'የጉብኝት ቀጠሮዎ ተረጋግጧል!\n\nሰላም {name}፣\n\nበኪድቶፒያ የሚያደርጉት ጉብኝት መረጋገጡን ስናበስርዎ በደስታ ነው!\n\nቀን: {dayName}, {date}\nሰዓት: {time}\n\nእርስዎን ለማግኘት በጉጉት እንጠብቃለን! ማንኛውም ጥያቄ ካለዎት እባክዎን ያነጋግሩን።'
                                                : `Your Tour is Confirmed!\n\nHi {name},\n\nGreat news! Your physical tour at Kidtopia has been approved.\n\nDate: {dayName}, {date}\nTime: {time}\n\nWe look forward to meeting you! If you have any questions, please contact us.`);
                                            const subject = templateHeader
                                                .replace(/\{name\}/g, b.name || '')
                                                .replace(/\{date\}/g, b.date || '')
                                                .replace(/\{time\}/g, b.time || '')
                                                .replace(/\{dayName\}/g, dayName);

                                            const processedBody = templateBody
                                                .replace(/\{name\}/g, b.name || '')
                                                .replace(/\{date\}/g, b.date || '')
                                                .replace(/\{time\}/g, b.time || '')
                                                .replace(/\{dayName\}/g, dayName);

                                            const emailHtml = formatEmailWithTheme(subject, processedBody, b.branch);
                                            sendEmail(b.email, subject, emailHtml).catch(console.error);
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
                                            const bookingLang = (b.lang === 'am' ? 'am' : 'en') as 'en' | 'am';
                                            const dayName = b.date ? new Date(b.date).toLocaleDateString('en-US', { weekday: 'long' }) : '';
                                            const templateHeader = content[bookingLang]?.emailTemplates?.rejection?.subject || (bookingLang === 'am' ? 'የጉብኝት ቀጠሮ ዝመና' : 'Tour Booking Update');
                                            const templateBody = content[bookingLang]?.emailTemplates?.rejection?.body || (bookingLang === 'am'
                                                ? 'የጉብኝት ቀጠሮ ዝመና\n\nሰላም {name}፣\n\nአዝናለን፣ በ{dayName}, {date} በ{time} ያቀረቡትን የአካል ጉብኝት ጥያቄ ለማስተናገድ አንችልም።\n\nእባክዎን በሌላ ጊዜ አዲስ ጥያቄ ያቅርቡልን ወይም ለተጨማሪ መረጃ የእኛን ቢሮ ያነጋግሩ።'
                                                : `Tour Booking Update\n\nHi {name},\n\nUnfortunately, we are unable to accommodate your physical tour request for {dayName}, {date} at {time}.\n\nPlease feel free to submit a new request with a different time, or contact our office for further assistance.`);
                                            const subject = templateHeader
                                                .replace(/\{name\}/g, b.name || '')
                                                .replace(/\{date\}/g, b.date || '')
                                                .replace(/\{time\}/g, b.time || '')
                                                .replace(/\{dayName\}/g, dayName);

                                            const processedBody = templateBody
                                                .replace(/\{name\}/g, b.name || '')
                                                .replace(/\{date\}/g, b.date || '')
                                                .replace(/\{time\}/g, b.time || '')
                                                .replace(/\{dayName\}/g, dayName);

                                            const emailHtml = formatEmailWithTheme(subject, processedBody, b.branch, true);
                                            sendEmail(b.email, subject, emailHtml).catch(console.error);
                                          }
                                        }}
                                        className="text-red-500 hover:underline font-medium ml-2"
                                      >
                                        Reject
                                      </button>
                                    </>
                                  ) : (
                                    <button
                                      onClick={async () => {
                                        if (window.confirm('Are you sure you want to permanently delete this booking?')) {
                                          try {
                                            await deleteBooking(b.id);
                                            setFeedback({ type: 'success', message: 'Booking deleted successfully!' });
                                            const updated = await getAllBookings();
                                            setBookings(updated.sort((a, b) => getTimestampTime(b.createdAt) - getTimestampTime(a.createdAt)));
                                          } catch (error) {
                                            console.error("Failed to delete booking", error);
                                            setFeedback({ type: 'error', message: 'Failed to delete booking.' });
                                          }
                                        }
                                      }}
                                      className="text-red-600 hover:text-red-800 hover:underline font-medium"
                                    >
                                      Delete Booking
                                    </button>
                                  )}
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
              previewMode && canPreview ? (
                <div className="w-full text-center">
                  {/* Device selector */}
                  <div className="flex justify-center gap-2 mb-6 bg-stone-50 p-2.5 rounded-2xl border border-stone-200/60 max-w-sm mx-auto shadow-sm">
                    <button
                      type="button"
                      onClick={() => setPreviewDevice('desktop')}
                      className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${previewDevice === 'desktop' ? 'bg-brand-green text-white shadow-sm' : 'text-stone-600 hover:bg-stone-200/40'}`}
                    >
                      Desktop
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewDevice('tablet')}
                      className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${previewDevice === 'tablet' ? 'bg-brand-green text-white shadow-sm' : 'text-stone-600 hover:bg-stone-200/40'}`}
                    >
                      Tablet
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewDevice('mobile')}
                      className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${previewDevice === 'mobile' ? 'bg-brand-green text-white shadow-sm' : 'text-stone-600 hover:bg-stone-200/40'}`}
                    >
                      Mobile
                    </button>
                  </div>

                  {/* Device Frame */}
                  <div className={`transition-all duration-300 ${
                    previewDevice === 'mobile' 
                      ? 'max-w-[375px] mx-auto border-[12px] border-stone-800 rounded-[40px] h-[650px] overflow-y-auto bg-white shadow-2xl relative' 
                      : previewDevice === 'tablet'
                      ? 'max-w-[768px] mx-auto border-[10px] border-stone-800 rounded-3xl h-[650px] overflow-y-auto bg-white shadow-lg relative'
                      : 'w-full border border-stone-200 rounded-2xl overflow-hidden bg-white shadow-sm p-1'
                  }`}>
                    {/* Inner scaled viewport via real Iframe for accurate viewport media queries */}
                    <div className="w-full h-full text-left min-h-[500px]">
                      <IframePreview>
                        <ContentContext.Provider value={{ content, loading: false, refresh: async () => {} }}>
                          {renderPreviewComponent()}
                        </ContentContext.Provider>
                      </IframePreview>
                    </div>
                  </div>
                </div>
              ) : (
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
                  {activeSection === 'resources' ? (
                    <div className="space-y-6">
                      {/* Section Info */}
                      <div className="bg-emerald-50/40 p-5 rounded-2xl border border-brand-green/10 mb-2">
                        <h4 className="font-bold text-stone-900 mb-1 flex items-center gap-2">
                          <Shield size={18} className="text-brand-green" />
                          Policies, Handbooks & Guidelines Customizer
                        </h4>
                        <p className="text-xs text-stone-600 leading-relaxed">
                          Organize and manage parent-facing resources, code of conduct, nutrition meal planners, developmental trackers, and legal directives. Use the sub-tabs below to navigate sections and use our AI Assistant to draft perfect policies.
                        </p>
                      </div>

                      {/* Sub-Tabs Sidebar/Header */}
                      <div className="flex flex-wrap gap-2 border-b border-stone-200 pb-4 mb-6">
                        <button
                          type="button"
                          onClick={() => { setResourcesSubTab('general'); setAiResult(''); }}
                          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border cursor-pointer ${
                            resourcesSubTab === 'general'
                              ? 'bg-brand-green text-white border-brand-green shadow-sm font-black'
                              : 'bg-white text-stone-600 hover:bg-stone-50 border-stone-200'
                          }`}
                        >
                          <Layout size={14} />
                          <span>General Info & Cards</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => { setResourcesSubTab('rules'); setAiResult(''); }}
                          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border cursor-pointer ${
                            resourcesSubTab === 'rules'
                              ? 'bg-brand-green text-white border-brand-green shadow-sm font-black'
                              : 'bg-white text-stone-600 hover:bg-stone-50 border-stone-200'
                          }`}
                        >
                          <FileText size={14} />
                          <span>Enrollment Checklist (Rules)</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => { setResourcesSubTab('policies'); setAiResult(''); }}
                          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border cursor-pointer ${
                            resourcesSubTab === 'policies'
                              ? 'bg-brand-green text-white border-brand-green shadow-sm font-black'
                              : 'bg-white text-stone-600 hover:bg-stone-50 border-stone-200'
                          }`}
                        >
                          <Shield size={14} />
                          <span>Consolidated Daycare Policies</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => { setResourcesSubTab('handbook'); setAiResult(''); }}
                          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border cursor-pointer ${
                            resourcesSubTab === 'handbook'
                              ? 'bg-brand-green text-white border-brand-green shadow-sm font-black'
                              : 'bg-white text-stone-600 hover:bg-stone-50 border-stone-200'
                          }`}
                        >
                          <FileText size={14} />
                          <span>Parent Handbook Chapters</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => { setResourcesSubTab('directive'); setAiResult(''); }}
                          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border cursor-pointer ${
                            resourcesSubTab === 'directive'
                              ? 'bg-brand-green text-white border-brand-green shadow-sm font-black'
                              : 'bg-white text-stone-600 hover:bg-stone-50 border-stone-200'
                          }`}
                        >
                          <FileText size={14} />
                          <span>Ethiopian Care Directive</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => { setResourcesSubTab('nutrition_milestones'); setAiResult(''); }}
                          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border cursor-pointer ${
                            resourcesSubTab === 'nutrition_milestones'
                              ? 'bg-brand-green text-white border-brand-green shadow-sm font-black'
                              : 'bg-white text-stone-600 hover:bg-stone-50 border-stone-200'
                          }`}
                        >
                          <Settings size={14} />
                          <span>Nutrition & Milestones</span>
                        </button>
                      </div>

                      {/* Rendering of Sub-Tab Content */}
                      <div className="space-y-6 animate-in fade-in duration-200">
                        {resourcesSubTab === 'general' && (
                          <>
                            {renderField('title', content[activeLang].resources.title, ['resources', 'title'])}
                            {renderField('desc', content[activeLang].resources.desc, ['resources', 'desc'])}
                            {renderField('items', content[activeLang].resources.items, ['resources', 'items'])}
                          </>
                        )}

                        {resourcesSubTab === 'rules' && (
                          <>
                            {renderField('policiesAndRegulations', content[activeLang].resources.policiesAndRegulations, ['resources', 'policiesAndRegulations'])}
                          </>
                        )}

                        {resourcesSubTab === 'policies' && (
                          <>
                            {renderField('intlGuidelinesTitle', content[activeLang].resources.intlGuidelinesTitle, ['resources', 'intlGuidelinesTitle'])}
                            {renderField('intlGuidelinesBody', content[activeLang].resources.intlGuidelinesBody, ['resources', 'intlGuidelinesBody'])}
                            
                            {/* AI Policy Assistant Card */}
                            <div className="bg-gradient-to-br from-lime-50/50 to-emerald-50/30 p-6 rounded-2xl border border-brand-green/20 shadow-sm mt-8">
                              <h5 className="font-bold text-stone-900 text-sm flex items-center gap-2 mb-2 font-accent uppercase tracking-wider">
                                <Settings size={16} className="text-brand-green animate-spin" style={{ animationDuration: '8s' }} />
                                ✨ AI Policy Assistant & Clause Generator
                              </h5>
                              <p className="text-xs text-stone-600 mb-4 leading-relaxed">
                                Need custom updates to your policies? Describe your new rules or specifies rephrasing, and our built-in Gemini AI model will write polished clauses instantly.
                              </p>
                              
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                <div>
                                  <label className="block text-[11px] font-black uppercase tracking-wider text-stone-500 mb-1">What should AI do?</label>
                                  <select
                                    value={aiAction}
                                    onChange={(e) => setAiAction(e.target.value as any)}
                                    className="w-full text-xs font-semibold p-2.5 bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-green text-stone-700"
                                  >
                                    <option value="add_clause">Add/Integrate New Clause</option>
                                    <option value="rephrase">Rephrase & Improve Current Text</option>
                                    <option value="generate">Generate Standalone Paragraph</option>
                                  </select>
                                </div>
                                <div>
                                  <label className="block text-[11px] font-black uppercase tracking-wider text-stone-500 mb-1">Writing Tone</label>
                                  <select
                                    value={aiTone}
                                    onChange={(e) => setAiTone(e.target.value)}
                                    className="w-full text-xs font-semibold p-2.5 bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-green text-stone-700"
                                  >
                                    <option value="professional">Professional & Authoritative</option>
                                    <option value="welcoming">Polite & Welcoming</option>
                                    <option value="regulatory">Formal, Legal & Regulatory</option>
                                  </select>
                                </div>
                                <div className="flex items-end">
                                  <button
                                    type="button"
                                    onClick={() => handleRunAiAssistant('intlGuidelinesBody')}
                                    disabled={aiLoading}
                                    className="w-full py-2.5 bg-brand-green hover:bg-brand-green/95 text-white text-xs font-black rounded-xl shadow-sm transition-all disabled:opacity-50 flex items-center justify-center gap-1.5 cursor-pointer"
                                  >
                                    {aiLoading ? (
                                      <>
                                        <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                        <span>Drafting...</span>
                                      </>
                                    ) : (
                                      <>
                                        <span>✨ Query Gemini AI</span>
                                      </>
                                    )}
                                  </button>
                                </div>
                              </div>

                              <div className="mb-4">
                                <label className="block text-[11px] font-black uppercase tracking-wider text-stone-500 mb-1">Instructions for AI (Describe details, changes or clause values)</label>
                                <textarea
                                  value={aiPrompt}
                                  onChange={(e) => setAiPrompt(e.target.value)}
                                  placeholder="e.g., Add a late fee penalty of 500 ETB for late pickup after 6:00 PM, payable directly to the administrator on duty."
                                  className="w-full p-3 text-xs border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-green bg-white font-medium text-stone-800"
                                  rows={2}
                                />
                              </div>

                              {aiResult && (
                                <div className="mt-4 p-4 bg-white border border-brand-green/20 rounded-2xl animate-in slide-in-from-bottom-2 duration-300">
                                  <div className="flex justify-between items-center mb-2 pb-2 border-b border-stone-100">
                                    <span className="text-xs font-black uppercase tracking-wider text-brand-green">Gemini AI Draft Suggestion</span>
                                    <div className="flex gap-2">
                                      <button
                                        type="button"
                                        onClick={() => handleApplyAiResult('intlGuidelinesBody')}
                                        className="px-3 py-1.5 bg-brand-green hover:bg-brand-green/95 text-white text-[10px] font-black rounded-lg shadow-sm transition cursor-pointer"
                                      >
                                        Apply changes
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => setAiResult('')}
                                        className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-600 text-[10px] font-black rounded-lg transition cursor-pointer"
                                      >
                                        Discard
                                      </button>
                                    </div>
                                  </div>
                                  <pre className="text-xs text-stone-800 leading-relaxed font-sans whitespace-pre-wrap max-h-[250px] overflow-y-auto bg-stone-50/50 p-3 rounded-xl border border-stone-100">
                                    {aiResult}
                                  </pre>
                                </div>
                              )}
                            </div>
                          </>
                        )}

                        {resourcesSubTab === 'handbook' && (
                          <>
                            {renderField('handbookChapters', content[activeLang].resources.handbookChapters, ['resources', 'handbookChapters'])}
                          </>
                        )}

                        {resourcesSubTab === 'directive' && (
                          <>
                            {renderField('intlActTitle', content[activeLang].resources.intlActTitle, ['resources', 'intlActTitle'])}
                            {renderField('intlActBody', content[activeLang].resources.intlActBody, ['resources', 'intlActBody'])}
                            
                            {/* AI Policy Assistant Card for directive */}
                            <div className="bg-gradient-to-br from-blue-50/30 to-emerald-50/30 p-6 rounded-2xl border border-blue-200/40 shadow-sm mt-8">
                              <h5 className="font-bold text-stone-900 text-sm flex items-center gap-2 mb-2 font-accent uppercase tracking-wider">
                                <Settings size={16} className="text-blue-500 animate-spin" style={{ animationDuration: '8s' }} />
                                ✨ AI Directive Customizer & Editor
                              </h5>
                              <p className="text-xs text-stone-600 mb-4 leading-relaxed">
                                Need to align this directive text with recent municipal codes or regulatory adjustments? Describe the exact rules to add or update below.
                              </p>
                              
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                <div>
                                  <label className="block text-[11px] font-black uppercase tracking-wider text-stone-500 mb-1">What should AI do?</label>
                                  <select
                                    value={aiAction}
                                    onChange={(e) => setAiAction(e.target.value as any)}
                                    className="w-full text-xs font-semibold p-2.5 bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-green text-stone-700"
                                  >
                                    <option value="add_clause">Add/Integrate New Clause</option>
                                    <option value="rephrase">Rephrase & Improve Current Text</option>
                                    <option value="generate">Generate Standalone Paragraph</option>
                                  </select>
                                </div>
                                <div>
                                  <label className="block text-[11px] font-black uppercase tracking-wider text-stone-500 mb-1">Writing Tone</label>
                                  <select
                                    value={aiTone}
                                    onChange={(e) => setAiTone(e.target.value)}
                                    className="w-full text-xs font-semibold p-2.5 bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-green text-stone-700"
                                  >
                                    <option value="professional">Professional & Authoritative</option>
                                    <option value="welcoming">Polite & Welcoming</option>
                                    <option value="regulatory">Formal, Legal & Regulatory</option>
                                  </select>
                                </div>
                                <div className="flex items-end">
                                  <button
                                    type="button"
                                    onClick={() => handleRunAiAssistant('intlActBody')}
                                    disabled={aiLoading}
                                    className="w-full py-2.5 bg-brand-green hover:bg-brand-green/95 text-white text-xs font-black rounded-xl shadow-sm transition-all disabled:opacity-50 flex items-center justify-center gap-1.5 cursor-pointer"
                                  >
                                    {aiLoading ? (
                                      <>
                                        <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                        <span>Drafting...</span>
                                      </>
                                    ) : (
                                      <>
                                        <span>✨ Query Gemini AI</span>
                                      </>
                                    )}
                                  </button>
                                </div>
                              </div>

                              <div className="mb-4">
                                <label className="block text-[11px] font-black uppercase tracking-wider text-stone-500 mb-1">Instructions for AI (Describe details, changes or clause values)</label>
                                <textarea
                                  value={aiPrompt}
                                  onChange={(e) => setAiPrompt(e.target.value)}
                                  placeholder="e.g., Update the physical space requirements to mandate a minimum indoor space of 3 square meters instead of 2.5."
                                  className="w-full p-3 text-xs border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-green bg-white font-medium text-stone-800"
                                  rows={2}
                                />
                              </div>

                              {aiResult && (
                                <div className="mt-4 p-4 bg-white border border-blue-200/40 rounded-2xl animate-in slide-in-from-bottom-2 duration-300">
                                  <div className="flex justify-between items-center mb-2 pb-2 border-b border-stone-100">
                                    <span className="text-xs font-black uppercase tracking-wider text-blue-600">Gemini AI Draft Suggestion</span>
                                    <div className="flex gap-2">
                                      <button
                                        type="button"
                                        onClick={() => handleApplyAiResult('intlActBody')}
                                        className="px-3 py-1.5 bg-brand-green hover:bg-brand-green/95 text-white text-[10px] font-black rounded-lg shadow-sm transition cursor-pointer"
                                      >
                                        Apply changes
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => setAiResult('')}
                                        className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-600 text-[10px] font-black rounded-lg transition cursor-pointer"
                                      >
                                        Discard
                                      </button>
                                    </div>
                                  </div>
                                  <pre className="text-xs text-stone-800 leading-relaxed font-sans whitespace-pre-wrap max-h-[250px] overflow-y-auto bg-stone-50/50 p-3 rounded-xl border border-stone-100">
                                    {aiResult}
                                  </pre>
                                </div>
                              )}
                            </div>
                          </>
                        )}

                        {resourcesSubTab === 'nutrition_milestones' && (
                          <>
                            {renderField('menuDays', content[activeLang].resources.menuDays, ['resources', 'menuDays'])}
                            {renderField('milestonesData', content[activeLang].resources.milestonesData, ['resources', 'milestonesData'])}
                          </>
                        )}
                      </div>
                    </div>
                  ) : (
                    <>
                      {activeSection === 'virtualTour' && (
                        <div className="mb-10 p-6 bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl shadow-sm">
                          <h3 className="font-bold text-stone-800 dark:text-stone-100 text-base mb-2 flex items-center gap-2 font-sans">
                            <Compass size={20} className="text-brand-green animate-spin" style={{ animationDuration: '12s' }} />
                            Interactive 360° Virtual Tour Layout Builder
                          </h3>
                          <p className="text-sm text-stone-600 dark:text-stone-400 mb-6 font-sans">
                            Drag to look around the virtual room, and use the "Edit 360 Tour" button inside the viewer below to add/delete 360 rooms or link rooms with interactive connection hotspots.
                          </p>
                          <ThreeSixtyViewer isAdminMode={true} />
                        </div>
                      )}
                      {sortObjectKeysByTemplate(content[activeLang][activeSection], [activeSection]).map((key) => 
                        renderField(key, content[activeLang][activeSection][key], [activeSection, key])
                      )}
                    </>
                  )}
                </>
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
              feedback.type === 'success' ? 'bg-brand-green' : feedback.type === 'info' ? 'bg-blue-600 animate-pulse' : 'bg-red-500'
            }`}
          >
            {feedback.type === 'success' ? (
              <Shield size={18} />
            ) : feedback.type === 'info' ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <X size={18} />
            )}
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
