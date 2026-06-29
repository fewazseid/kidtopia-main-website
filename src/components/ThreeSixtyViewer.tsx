import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { 
  ArrowRight, ArrowUp, ArrowDown, ArrowLeft, Plus, Trash2, Camera, Move, Settings, Check, X, 
  RotateCcw, ZoomIn, ZoomOut, Maximize2, Minimize2, Edit2, Save, 
  Image as ImageIcon, Eye, RefreshCw, ChevronRight, Compass, HelpCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';

export interface Hotspot {
  id: string;
  pitch: number; // latitude equivalent (Y-axis rotation lookAt) -85 to 85
  yaw: number;   // longitude equivalent (X-axis rotation lookAt) -180 to 180
  targetSceneId: string;
  text: string;
  type?: 'link' | 'info';
  description?: string;
  color?: string; // Optional custom color of direction / link hotspot icon
  linkedHotspotId?: string; // ID of the reciprocal return door in targetScene
}

export interface Scene {
  id: string;
  title: string;
  imageUrl: string;
  isStart: boolean;
  hotspots: Hotspot[];
  startLon?: number;  // Optional custom starting camera longitude angle
  startLat?: number;  // Optional custom starting camera latitude angle
}

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

// Extract low and high resolution URLs for progressive texture loading
export function getLowResAndHighResUrls(url: string): { low: string; high: string } {
  const converted = convertGoogleDriveUrl(url);
  if (!converted) return { low: '', high: '' };
  
  if (converted.includes('lh3.googleusercontent.com/d/')) {
    const cleanUrl = converted.split('=')[0];
    return {
      low: `${cleanUrl}=w800`,
      high: `${cleanUrl}=w4096`
    };
  }
  
  if (converted.includes('unsplash.com')) {
    const cleanUrl = converted.split('?')[0];
    return {
      low: `${cleanUrl}?q=30&w=800`,
      high: `${cleanUrl}?q=85&w=4096`
    };
  }
  
  return {
    low: converted,
    high: converted
  };
}

// Onboarding Walkthrough Steps for customers
const GUIDE_STEPS = [
  {
    title: "Welcome to Kidtopia 360° Virtual Tour! 🎒",
    description: "Step inside our modern nursery school! Click and drag your mouse, or swipe on your screen in any direction to explore this room in 360 degrees.",
    highlight: "three-sixty-tour-container"
  },
  {
    title: "Navigation & Floor Portals 🚪",
    description: "Look around for floating direction indicators. Clicking or tapping on them will instantly transition you into another playroom or classroom!",
    highlight: "hotspots"
  },
  {
    title: "Interactive Compass 🧭",
    description: "The middle compass at the top rotates dynamically as you look around. Use it to keep track of North and see your exact heading direction!",
    highlight: "compass"
  },
  {
    title: "D-pad & Zoom Controls 🎮",
    description: "Use the glassmorphic control console in the bottom corner to look around, reset your view, zoom in/out, or toggle immersive Fullscreen mode.",
    highlight: "dpad"
  },
  {
    title: "Horizontal Room Selector 🏫",
    description: "Quickly browse and jump to any classroom or campus space by clicking on the thumbnails in this horizontal side-scrolling room selector!",
    highlight: "side-scroll"
  }
];

const DEFAULT_SCENES: Scene[] = [
  {
    id: 'lobby',
    title: 'Welcome Reception & Lobby',
    imageUrl: 'https://photo-sphere-viewer-data.netlify.app/assets/sphere.jpg',
    isStart: true,
    hotspots: [
      {
        id: 'to_classroom',
        pitch: -12,
        yaw: 45,
        targetSceneId: 'classroom',
        text: 'Walk to Toddler Playroom'
      },
      {
        id: 'to_playground',
        pitch: -5,
        yaw: -130,
        targetSceneId: 'playground',
        text: 'Go to Outdoor Playground'
      }
    ]
  },
  {
    id: 'classroom',
    title: 'Toddler Playroom & Learning Area',
    imageUrl: 'https://pannellum.org/images/cerebra.jpg',
    isStart: false,
    hotspots: [
      {
        id: 'back_to_lobby',
        pitch: -10,
        yaw: 180,
        targetSceneId: 'lobby',
        text: 'Back to Reception'
      }
    ]
  },
  {
    id: 'playground',
    title: 'Secure Outdoor Play Area',
    imageUrl: 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/2294472375_24a3b8ef46_o.jpg',
    isStart: false,
    hotspots: [
      {
        id: 'back_to_lobby_play',
        pitch: 0,
        yaw: 0,
        targetSceneId: 'lobby',
        text: 'Back to Main Lobby'
      }
    ]
  }
];

const createFallbackPanoTexture = (): THREE.CanvasTexture => {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    // Beautiful linear gradient to feel ambient
    const gradient = ctx.createLinearGradient(0, 0, 0, 512);
    gradient.addColorStop(0, '#1c1917'); // dark stone
    gradient.addColorStop(0.5, '#44403c'); // warm medium stone
    gradient.addColorStop(1, '#1c1917');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1024, 512);

    // Minimal elegant grids mimicking a real architectural space
    ctx.strokeStyle = 'rgba(16, 185, 129, 0.2)'; // brand green
    ctx.lineWidth = 1.5;
    for (let i = 0; i <= 1024; i += 64) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, 512);
      ctx.stroke();
    }
    for (let j = 0; j <= 512; j += 64) {
      ctx.beginPath();
      ctx.moveTo(0, j);
      ctx.lineTo(1024, j);
      ctx.stroke();
    }

    // Interactive message
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 24px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('360° Kidtopia Interactive Tour', 512, 230);
    ctx.fillStyle = '#a8a29e';
    ctx.font = '15px sans-serif';
    ctx.fillText('Loading 360 view... drag to explore this room spacer', 512, 274);
  }
  const texture = new THREE.CanvasTexture(canvas);
  return texture;
};

export interface ThreeSixtyViewerProps {
  isAdminMode?: boolean;
}

export const ThreeSixtyViewer: React.FC<ThreeSixtyViewerProps> = ({ isAdminMode = false }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  
  // State
  const [isThreeReady, setIsThreeReady] = useState(false);
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [currentScene, setCurrentScene] = useState<Scene | null>(null);
  const [loading, setLoading] = useState(true);
  const [sceneLoading, setSceneLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isRoomsMenuOpen, setIsRoomsMenuOpen] = useState(false);
  const [deletingHotspotId, setDeletingHotspotId] = useState<string | null>(null);
  
  // Onboarding walkthrough guide states
  const [showGuide, setShowGuide] = useState(() => {
    try {
      return localStorage.getItem('kidtopia_tour_guide_shown') !== 'true';
    } catch {
      return true;
    }
  });
  const [guideStep, setGuideStep] = useState(0);
  
  // Camera angles (React states for coordinates indicator)
  const [cameraLon, setCameraLon] = useState(0);
  const [cameraLat, setCameraLat] = useState(0);
  const [cameraFov, setCameraFov] = useState(75);

  // Camera angles high-performance refs (to avoid recreating Three.js scene during drag)
  const cameraLonRef = useRef(0);
  const cameraLatRef = useRef(0);
  const cameraFovRef = useRef(100);
  const targetFovRef = useRef(100);

  // Hotspots render positioning
  const [projectedHotspots, setProjectedHotspots] = useState<Array<{
    hotspot: Hotspot;
    x: number;
    y: number;
    visible: boolean;
  }>>([]);

  // Modals / Creators
  const [showAddRoomModal, setShowAddRoomModal] = useState(false);
  const [showEditRoomModal, setShowEditRoomModal] = useState(false);
  const [newRoomTitle, setNewRoomTitle] = useState('');
  const [editRoomTitle, setEditRoomTitle] = useState('');
  const [newRoomImageFile, setNewRoomImageFile] = useState<File | null>(null);
  const [newRoomImageUrl, setNewRoomImageUrl] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);

  const [showAddHotspotModal, setShowAddHotspotModal] = useState(false);
  const [showEditHotspotModal, setShowEditHotspotModal] = useState(false);
  const [editingHotspotId, setEditingHotspotId] = useState<string | null>(null);
  const [newHotspotText, setNewHotspotText] = useState('');
  const [newHotspotTarget, setNewHotspotTarget] = useState('');
  const [newHotspotType, setNewHotspotType] = useState<'link' | 'info'>('link');
  const [newHotspotDescription, setNewHotspotDescription] = useState('');
  const [newHotspotLinkedId, setNewHotspotLinkedId] = useState(''); // Selected Return Door ID
  const [newHotspotColor, setNewHotspotColor] = useState('#10b981'); // Customizable direction color
  const [useGyroscope, setUseGyroscope] = useState(false); // Gyroscope sensor toggle
  const [isRoomListExpanded, setIsRoomListExpanded] = useState(false);
  const useGyroscopeRef = useRef(false);
  const [activeInfoHotspot, setActiveInfoHotspot] = useState<Hotspot | null>(null);

  // Camera target orientation refs (for smooth pan interpolation)
  const targetLonRef = useRef(0);
  const targetLatRef = useRef(0);

  // Three.js References
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const sphereMeshRef = useRef<THREE.Mesh | null>(null);
  const sphereMaterialRef = useRef<THREE.MeshBasicMaterial | null>(null);
  const textureLoaderRef = useRef<THREE.TextureLoader>(new THREE.TextureLoader());
  const textureCacheRef = useRef<Map<string, THREE.Texture>>(new Map());
  const currentSceneRef = useRef<Scene | null>(null);

  // Interaction refs
  const isUserInteractingRef = useRef(false);
  const lastPointerXRef = useRef(0);
  const lastPointerYRef = useRef(0);
  const onPointerDownPointerXRef = useRef(0);
  const onPointerDownPointerYRef = useRef(0);
  const onPointerDownLonRef = useRef(0);
  const onPointerDownLatRef = useRef(0);
  const lastMotionTimeRef = useRef<number>(0);

  const getCompassHeading = (lon: number) => {
    let deg = (-lon) % 360;
    if (deg < 0) deg += 360;
    const directions = ['N 🧭', 'NE 🧭', 'E 🧭', 'SE 🧭', 'S 🧭', 'SW 🧭', 'W 🧭', 'NW 🧭'];
    const index = Math.round(deg / 45) % 8;
    return directions[index];
  };

  // Check Admin Role
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Simple check: check if user exists in the admin e-mails, or fetch role
        // For simplicity and matching current Admin check style:
        const isAdminEmail = 
          user.email === 'admin@kidtopiaet.com' || 
          user.email === 'fewazseidahmed@gmail.com' || 
          user.email === 'system_worker@kidtopiaet.internal' || 
          user.email === 'system_worker_v2@kidtopiaet.internal' || 
          user.email === 'system_worker_v4@kidtopiaet.internal' || 
          user.email?.endsWith('@kidtopiaet.internal');
        
        setIsAdmin(!!isAdminEmail);
      } else {
        setIsAdmin(false);
      }
    });
    return () => unsub();
  }, []);

  // Fetch Scenes Configuration from Firestore
  const fetchScenes = async () => {
    setLoading(true);
    try {
      const configDoc = await getDoc(doc(db, 'settings', 'virtual_tour_360'));
      if (configDoc.exists() && configDoc.data()?.scenes) {
        let loadedScenes = configDoc.data().scenes as Scene[];
        let mutated = false;
        
        // Auto-migrate flat Unsplash images to proper equirectangular room panorama with CORS support
        loadedScenes = loadedScenes.map(s => {
          if (s.imageUrl && s.imageUrl.includes('unsplash.com')) {
            mutated = true;
            return {
              ...s,
              imageUrl: 'https://pannellum.org/images/cerebra.jpg'
            };
          }
          return s;
        });

        // Ensure there is exactly one scene set as start, defaulting to the very first scene if none is selected
        const hasStart = loadedScenes.some(s => s.isStart);
        if (!hasStart && loadedScenes.length > 0) {
          loadedScenes[0].isStart = true;
          mutated = true;
        }

        setScenes(loadedScenes);
        const start = loadedScenes.find(s => s.isStart) || loadedScenes[0];
        setCurrentScene(start || null);
        
        if (start) {
          const initLon = start.startLon !== undefined ? start.startLon : 0;
          const initLat = start.startLat !== undefined ? start.startLat : 0;
          targetLonRef.current = initLon;
          targetLatRef.current = initLat;
          cameraLonRef.current = initLon;
          cameraLatRef.current = initLat;
          setCameraLon(initLon);
          setCameraLat(initLat);
        }

        // Save migrated configuration back to firestore silently if changed
        if (mutated) {
          setDoc(doc(db, 'settings', 'virtual_tour_360'), { scenes: loadedScenes }).catch(e => {
            console.warn('Silently failed to save auto-migrated 360 scene config:', e);
          });
        }
      } else {
        // Fallback to default
        const start = DEFAULT_SCENES[0];
        setScenes(DEFAULT_SCENES);
        setCurrentScene(start);
        
        if (start) {
          const initLon = start.startLon !== undefined ? start.startLon : 0;
          const initLat = start.startLat !== undefined ? start.startLat : 0;
          targetLonRef.current = initLon;
          targetLatRef.current = initLat;
          cameraLonRef.current = initLon;
          cameraLatRef.current = initLat;
          setCameraLon(initLon);
          setCameraLat(initLat);
        }
        
        // Auto-save defaults if admin
        if (isAdmin) {
          await setDoc(doc(db, 'settings', 'virtual_tour_360'), { scenes: DEFAULT_SCENES });
        }
      }
    } catch (err) {
      console.error('Failed to load virtual tour configuration from Firestore, using defaults:', err);
      const start = DEFAULT_SCENES[0];
      setScenes(DEFAULT_SCENES);
      setCurrentScene(start);
      if (start) {
        const initLon = start.startLon !== undefined ? start.startLon : 0;
        const initLat = start.startLat !== undefined ? start.startLat : 0;
        targetLonRef.current = initLon;
        targetLatRef.current = initLat;
        cameraLonRef.current = initLon;
        cameraLatRef.current = initLat;
        setCameraLon(initLon);
        setCameraLat(initLat);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScenes();
  }, [isAdmin]);

  // Check Admin Role
  const saveScenesConfig = async (updatedScenes: Scene[]) => {
    try {
      setSceneLoading(true);
      await setDoc(doc(db, 'settings', 'virtual_tour_360'), { scenes: updatedScenes });
      setScenes(updatedScenes);
      // Refresh current scene representation
      if (currentScene) {
        const freshCurrent = updatedScenes.find(s => s.id === currentScene.id);
        if (freshCurrent) {
          setCurrentScene(freshCurrent);
        }
      }
      alert('Virtual tour configuration saved successfully!');
    } catch (err) {
      console.error('Failed to save scenes config to Firestore:', err);
      alert('Error saving virtual tour: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setSceneLoading(false);
    }
  };

  // Manage Gyroscope / Device Orientation (1:1 Movement Mapping)
  useEffect(() => {
    if (!useGyroscope) return;

    let lastAlpha: number | null = null;
    let lastBeta: number | null = null;
    let lastGamma: number | null = null;

    const handleOrientation = (e: DeviceOrientationEvent) => {
      const { alpha, beta, gamma } = e;
      if (alpha === null || beta === null || gamma === null) return;

      // Handle initial state
      if (lastAlpha === null || lastBeta === null || lastGamma === null) {
        lastAlpha = alpha;
        lastBeta = beta;
        lastGamma = gamma;
        return;
      }

      const orient = (typeof window !== 'undefined' && window.screen?.orientation)
        ? (window.screen.orientation.angle) 
        : (typeof window !== 'undefined' && typeof window.orientation !== 'undefined' ? (window.orientation as number) : 0);

      // Shortest path delta for Alpha (Yaw/Longitude)
      let deltaAlpha = alpha - lastAlpha;
      if (deltaAlpha > 180) deltaAlpha -= 360;
      if (deltaAlpha < -180) deltaAlpha += 360;

      // Smoothing factor (Lerp) to prevent "flickering" or noise
      const smoothFactor = 0.4; // More aggressive smoothing
      const noiseThreshold = 0.2; // Higher threshold to ignore tiny movements causing "flickering"

      if (Math.abs(deltaAlpha) > noiseThreshold) {
        targetLonRef.current -= deltaAlpha * smoothFactor;
      }

      if (orient === 0) { // Portrait
        const deltaBeta = beta - lastBeta;
        if (Math.abs(deltaBeta) > noiseThreshold) {
          targetLatRef.current = Math.max(-85, Math.min(85, targetLatRef.current + deltaBeta * smoothFactor));
        }
      } else if (orient === 90) { // Landscape Left
        const deltaGamma = gamma - lastGamma;
        if (Math.abs(deltaGamma) > noiseThreshold) {
          targetLatRef.current = Math.max(-85, Math.min(85, targetLatRef.current - deltaGamma * smoothFactor));
        }
      } else if (orient === -90) { // Landscape Right
        const deltaGamma = gamma - lastGamma;
        if (Math.abs(deltaGamma) > noiseThreshold) {
          targetLatRef.current = Math.max(-85, Math.min(85, targetLatRef.current + deltaGamma * smoothFactor));
        }
      } else {
        const deltaBeta = beta - lastBeta;
        if (Math.abs(deltaBeta) > noiseThreshold) {
          targetLatRef.current = Math.max(-85, Math.min(85, targetLatRef.current - deltaBeta * smoothFactor));
        }
      }

      lastAlpha = alpha;
      lastBeta = beta;
      lastGamma = gamma;
    };

    window.addEventListener('deviceorientation', handleOrientation);
    return () => window.removeEventListener('deviceorientation', handleOrientation);
  }, [useGyroscope]);

  // Request Device Orientation permission
  const requestDeviceOrientationPermission = async () => {
    if (useGyroscope) {
      setUseGyroscope(false);
      useGyroscopeRef.current = false;
      return;
    }

    if (
      typeof window !== 'undefined' &&
      typeof (window as any).DeviceOrientationEvent !== 'undefined' &&
      typeof (window as any).DeviceOrientationEvent.requestPermission === 'function'
    ) {
      try {
        const permissionState = await (window as any).DeviceOrientationEvent.requestPermission();
        if (permissionState === 'granted') {
          setUseGyroscope(true);
          useGyroscopeRef.current = true;
        } else {
          alert('Motion sensor permission denied.');
        }
      } catch (error) {
        console.error(error);
      }
    } else {
      setUseGyroscope(true);
      useGyroscopeRef.current = true;
    }
  };

  // Switch Room with transition
  const handleSwitchRoom = (sceneId: string, hotspot?: Hotspot) => {
    const targetScene = scenes.find(s => s.id === sceneId);
    if (!targetScene) return;

    // Stage 1: Fast fly-forward/zoom transition in 3D Space
    targetFovRef.current = 20; // Zoom in extremely close to look like flying forward
    if (hotspot) {
      // Use shortest path to prevent 360 spin
      let deltaLon = hotspot.yaw - (cameraLonRef.current % 360);
      if (deltaLon > 180) deltaLon -= 360;
      if (deltaLon < -180) deltaLon += 360;
      
      targetLonRef.current = cameraLonRef.current + deltaLon;
      targetLatRef.current = hotspot.pitch;
    }

    const isPreloaded = textureCacheRef.current.has(sceneId);

    // Stage 2: Calculate landing angles based on reciprocal return door
    let landingLon = targetScene.startLon !== undefined ? targetScene.startLon : 0;
    let landingLat = targetScene.startLat !== undefined ? targetScene.startLat : 0;

    if (hotspot?.linkedHotspotId) {
      const linkedDoor = targetScene.hotspots.find(h => h.id === hotspot.linkedHotspotId);
      if (linkedDoor) {
        // Look away from the return door to simulate walking forward into the room
        landingLon = linkedDoor.yaw + 180;
        if (landingLon > 180) landingLon -= 360;
        // Pitch should stay level or look slightly down/up based on the door, but usually 0 is safer
        landingLat = 0; 
      }
    }

    if (isPreloaded) {
      // Give the zoom effect 400ms to play out before instantly swapping textures
      setTimeout(() => {
        setCurrentScene(targetScene);
        // Apply starting camera directions for this classroom to avoid facing backwards
        targetLonRef.current = landingLon;
        targetLatRef.current = landingLat;
        cameraLonRef.current = landingLon;
        cameraLatRef.current = landingLat;
        
        cameraFovRef.current = 110; // Start extra wide
        targetFovRef.current = 100;  // Lerp smoothly to zoomed out state
      }, 400);
    } else {
      // Fallback transitional cross-fade if not preloaded
      setTimeout(() => {
        setSceneLoading(true);
        
        setTimeout(() => {
          setCurrentScene(targetScene);
          // Apply starting camera directions for this classroom to avoid facing backwards
          targetLonRef.current = landingLon;
          targetLatRef.current = landingLat;
          cameraLonRef.current = landingLon;
          cameraLatRef.current = landingLat;
          
          cameraFovRef.current = 110;
          targetFovRef.current = 100;
          
          setSceneLoading(false);
        }, 300);
      }, 300);
    }
  };

  // Image Upload handler for creating rooms
  const handleImageUpload = async (file: File) => {
    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed with status ' + response.status);
      }

      const data = await response.json();
      if (data.url) {
        setNewRoomImageUrl(data.url);
      } else {
        throw new Error('No URL returned from upload response');
      }
    } catch (err) {
      console.error('File upload failed:', err);
      alert('Failed to upload 360 photo: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setUploadingImage(false);
    }
  };

  // Create New Scene Room
  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoomTitle.trim()) {
      alert('Please enter a room title');
      return;
    }
    if (!newRoomImageUrl) {
      alert('Please enter or upload a 360 panorama image');
      return;
    }

    const finalImageUrl = convertGoogleDriveUrl(newRoomImageUrl);
    const newId = newRoomTitle.toLowerCase().replace(/[^a-z0-9]/g, '_') + '_' + Date.now();
    const newScene: Scene = {
      id: newId,
      title: newRoomTitle,
      imageUrl: finalImageUrl,
      isStart: scenes.length === 0, // Make start if it's the first scene
      hotspots: []
    };

    const updated = [...scenes, newScene];
    await saveScenesConfig(updated);
    
    // Switch to new room
    setCurrentScene(newScene);

    // Reset Form
    setNewRoomTitle('');
    setNewRoomImageUrl('');
    setNewRoomImageFile(null);
    setShowAddRoomModal(false);
  };

  // Edit Scene Room Name
  const handleEditRoomName = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentScene) return;
    if (!editRoomTitle.trim()) {
      alert('Please enter a room title');
      return;
    }

    const updated = scenes.map(s => {
      if (s.id === currentScene.id) {
        return { ...s, title: editRoomTitle };
      }
      return s;
    });

    await saveScenesConfig(updated);
    
    // Update local state immediately
    setCurrentScene({ ...currentScene, title: editRoomTitle });
    
    setShowEditRoomModal(false);
  };

  // Delete Scene Room
  const handleDeleteRoom = async (sceneId: string) => {
    if (scenes.length <= 1) {
      alert('You must keep at least one room in the virtual tour.');
      return;
    }
    if (!confirm('Are you sure you want to delete this room and all its hotspots?')) {
      return;
    }

    const updated = scenes.filter(s => s.id !== sceneId);
    
    // Clean up any hotspots in other rooms that pointed to this deleted room
    const thoroughlyUpdated = updated.map(s => ({
      ...s,
      hotspots: s.hotspots.filter(h => h.targetSceneId !== sceneId)
    }));

    // If the deleted room was the starting room, assign another one
    const deletedWasStart = scenes.find(s => s.id === sceneId)?.isStart;
    if (deletedWasStart && thoroughlyUpdated.length > 0) {
      thoroughlyUpdated[0].isStart = true;
    }

    // Switch current scene if necessary
    const nextScene = thoroughlyUpdated[0];
    setCurrentScene(nextScene);

    await saveScenesConfig(thoroughlyUpdated);
  };

  // Set Current Scene as Starting Room
  const handleSetAsStartRoom = async () => {
    if (!currentScene) return;
    const updated = scenes.map(s => ({
      ...s,
      isStart: s.id === currentScene.id
    }));
    await saveScenesConfig(updated);
  };

  // Save current camera view angle as the starting viewpoint for the room
  const handleSaveStartingDirection = async () => {
    if (!currentScene) return;
    
    // Grab current camera angles from refs (to get absolute precision)
    const currentLon = cameraLonRef.current;
    const currentLat = cameraLatRef.current;
    
    const updated = scenes.map(s => {
      if (s.id === currentScene.id) {
        return {
          ...s,
          startLon: currentLon,
          startLat: currentLat
        };
      }
      return s;
    });
    
    await saveScenesConfig(updated);
    
    // Update local state
    setCurrentScene({
      ...currentScene,
      startLon: currentLon,
      startLat: currentLat
    });
    
    alert(`Success: The entrance direction for "${currentScene.title}" is saved successfully! (Yaw: ${currentLon.toFixed(1)}°, Pitch: ${currentLat.toFixed(1)}°)`);
  };

  const openEditHotspotModal = (hs: Hotspot) => {
    setEditingHotspotId(hs.id);
    setNewHotspotType(hs.type);
    setNewHotspotText(hs.text);
    setNewHotspotTarget(hs.targetSceneId || '');
    setNewHotspotLinkedId(hs.linkedHotspotId || '');
    setNewHotspotDescription(hs.description || '');
    setNewHotspotColor(hs.color || '#10b981');
    setShowAddHotspotModal(true);
  };

  const resetHotspotForm = () => {
    setEditingHotspotId(null);
    setNewHotspotText('');
    setNewHotspotTarget('');
    setNewHotspotLinkedId('');
    setNewHotspotType('link');
    setNewHotspotDescription('');
    setNewHotspotColor('#10b981'); // Reset to default brand green
    setShowAddHotspotModal(false);
  };

  // Create Hotspot at Center of Screen
  const handleCreateHotspot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentScene) return;
    if (!newHotspotText.trim()) {
      alert('Please enter a hotspot label');
      return;
    }
    if (newHotspotType === 'link' && !newHotspotTarget) {
      alert('Please select a target room');
      return;
    }
    if (newHotspotType === 'info' && !newHotspotDescription.trim()) {
      alert('Please enter a description for the info area');
      return;
    }

    if (editingHotspotId) {
      const updated = scenes.map(s => {
        if (s.id === currentScene.id) {
          return {
            ...s,
            hotspots: s.hotspots.map(h => {
              if (h.id === editingHotspotId) {
                return {
                  ...h,
                  text: newHotspotText,
                  targetSceneId: newHotspotType === 'link' ? newHotspotTarget : '',
                  type: newHotspotType,
                  description: newHotspotType === 'info' ? newHotspotDescription : '',
                  color: newHotspotColor,
                  linkedHotspotId: (newHotspotType === 'link' && newHotspotLinkedId) ? newHotspotLinkedId : undefined
                };
              }
              return h;
            })
          };
        }
        return s;
      });
      await saveScenesConfig(updated);
      resetHotspotForm();
      return;
    }

    // Capture the current camera angles (which are locked at center of screen)
    const newHotspot: Hotspot = {
      id: 'hs_' + Date.now(),
      pitch: Math.round(cameraLat),
      yaw: Math.round(cameraLon),
      targetSceneId: newHotspotType === 'link' ? newHotspotTarget : '',
      text: newHotspotText,
      type: newHotspotType,
      description: newHotspotType === 'info' ? newHotspotDescription : '',
      color: newHotspotColor, // Save the custom direction color chosen by the user
      linkedHotspotId: (newHotspotType === 'link' && newHotspotLinkedId) ? newHotspotLinkedId : undefined
    };

    const updated = scenes.map(s => {
      // 1. Add hotspot to current scene
      if (s.id === currentScene.id) {
        return {
          ...s,
          hotspots: [...s.hotspots, newHotspot]
        };
      }
      // 2. If a return door is selected, update it in the target scene to point back!
      if (newHotspotType === 'link' && newHotspotTarget === s.id && newHotspotLinkedId) {
        return {
          ...s,
          hotspots: s.hotspots.map(h => {
            if (h.id === newHotspotLinkedId) {
              return { ...h, linkedHotspotId: newHotspot.id, targetSceneId: currentScene.id };
            }
            return h;
          })
        };
      }
      return s;
    });

    await saveScenesConfig(updated);

    resetHotspotForm();
  };

  // Delete Hotspot
  const handleDeleteHotspot = async (hotspotId: string) => {
    if (!currentScene) return;

    const updated = scenes.map(s => {
      if (s.id === currentScene.id) {
        return {
          ...s,
          hotspots: s.hotspots.filter(h => h.id !== hotspotId)
        };
      }
      return s;
    });

    setScenes(updated); // Immediate UI update
    await saveScenesConfig(updated);
  };

  // Helper to create beautiful low-resolution placeholder textures dynamically
  const createLowResPlaceholderTexture = (title: string): THREE.CanvasTexture => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Elegant ambient gradient matching Kidtopia's theme
      const gradient = ctx.createLinearGradient(0, 0, 0, 256);
      gradient.addColorStop(0, '#0f172a'); // deep slate
      gradient.addColorStop(0.5, '#334155'); // medium slate
      gradient.addColorStop(1, '#0f172a');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 512, 256);

      // Warm green radial glow for inviting visual cue
      const radial = ctx.createRadialGradient(256, 128, 10, 256, 128, 150);
      radial.addColorStop(0, 'rgba(16, 185, 129, 0.25)'); // soft green
      radial.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = radial;
      ctx.fillRect(0, 0, 512, 256);

      // Cyber/architectural grid lines for 3D coordinate space feeling
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
      ctx.lineWidth = 1;
      for (let i = 0; i <= 512; i += 32) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, 256);
        ctx.stroke();
      }
      for (let j = 0; j <= 256; j += 32) {
        ctx.beginPath();
        ctx.moveTo(0, j);
        ctx.lineTo(512, j);
        ctx.stroke();
      }

      // Elegant typography
      ctx.fillStyle = '#10b981'; // Brand Green accent
      ctx.font = 'bold 11px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('360° INTERACTIVE VIRTUAL TOUR', 256, 90);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 18px sans-serif';
      ctx.fillText(title, 256, 125);

      ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
      ctx.font = 'normal 10px sans-serif';
      ctx.fillText('Loading ultra-high definition panorama...', 256, 160);
    }
    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  };

  // 1. Preload other scenes in the background with a delay to give absolute bandwidth priority to the active starting scene first
  useEffect(() => {
    if (loading || !scenes || scenes.length === 0 || !currentScene) return;

    textureLoaderRef.current.setCrossOrigin('anonymous');

    // Preload the background rooms with a 1.5s delay to let the primary/starting room load first
    const delayPreload = setTimeout(() => {
      scenes.forEach(scene => {
        // Skip current scene because it is loaded instantly and with high priority in effect #2
        if (scene.id === currentScene.id) return;
        if (!scene.imageUrl) return;

        // Check if already in cache
        if (textureCacheRef.current.has(scene.id)) return;

        const loadUrl = scene.imageUrl.startsWith('http')
          ? scene.imageUrl + (scene.imageUrl.includes('?') ? '&' : '?') + 't=' + Date.now()
          : scene.imageUrl;

        textureLoaderRef.current.load(
          loadUrl,
          (texture) => {
            texture.minFilter = THREE.LinearMipmapLinearFilter;
            texture.generateMipmaps = true;
            texture.anisotropy = rendererRef.current?.capabilities.getMaxAnisotropy() || 1;
            textureCacheRef.current.set(scene.id, texture);
            console.log(`Successfully preloaded high-res background texture for: ${scene.id}`);
          },
          undefined,
          (err) => {
            console.warn(`Failed background preloading scene texture: ${scene.id}. Will fall back dynamically.`, err);
          }
        );
      });
    }, 1500);

    return () => clearTimeout(delayPreload);
  }, [loading, scenes, currentScene?.id]);

    // 2. Manage currentScene changes & progressive texture enhancement
    const initTextureLoad = () => {
      if (loading || !currentScene || !isThreeReady) return;

      // Sync ref
      currentSceneRef.current = currentScene;

      if (!sphereMaterialRef.current) return;

      // Check texture cache
      const cachedTexture = textureCacheRef.current.get(currentScene.id);

      const urls = getLowResAndHighResUrls(currentScene.imageUrl);

      if (cachedTexture) {
        // Instant transition!
        sphereMaterialRef.current.map = cachedTexture;
        sphereMaterialRef.current.needsUpdate = true;
        if (rendererRef.current && sceneRef.current && cameraRef.current) {
          rendererRef.current.render(sceneRef.current, cameraRef.current);
        }
      } else {
        // Progressive Enhancement
        const placeholder = createLowResPlaceholderTexture(currentScene.title);
        sphereMaterialRef.current.map = placeholder;
        sphereMaterialRef.current.needsUpdate = true;
        if (rendererRef.current && sceneRef.current && cameraRef.current) {
          rendererRef.current.render(sceneRef.current, cameraRef.current);
        }

        textureLoaderRef.current.setCrossOrigin('anonymous');
        
        textureLoaderRef.current.load(
          urls.low,
          (lowResTexture) => {
            if (currentSceneRef.current?.id === currentScene.id && sphereMaterialRef.current && !textureCacheRef.current.has(currentScene.id)) {
              sphereMaterialRef.current.map = lowResTexture;
              sphereMaterialRef.current.needsUpdate = true;
            }
            
            textureLoaderRef.current.load(urls.high, (highResTexture) => {
              textureCacheRef.current.set(currentScene.id, highResTexture);
              if (currentSceneRef.current?.id === currentScene.id && sphereMaterialRef.current) {
                sphereMaterialRef.current.map = highResTexture;
                sphereMaterialRef.current.needsUpdate = true;
              }
            });
          }
        );
      }
    };

    useEffect(() => {
      initTextureLoad();
    }, [loading, currentScene, isThreeReady]);

  // 3. Initialize and run Three.js engine (Runs once on mount)
  useEffect(() => {
    if (loading || !mountRef.current) return;

    // Dimensions
    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Start with a high FOV for "zoomed out" entry effect
    const initialFov = 100;
    cameraFovRef.current = initialFov;
    targetFovRef.current = initialFov; // Start zoomed out

    // Camera
    const camera = new THREE.PerspectiveCamera(initialFov, mountRef.current.clientWidth / mountRef.current.clientHeight, 1, 1100);
    cameraRef.current = camera;

    // WebGL Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    // Clear previous canvases if any
    mountRef.current.innerHTML = '';
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Create Inside-Out Sphere Geometry
    const geometry = new THREE.SphereGeometry(500, 60, 40);
    geometry.scale(-1, 1, 1); // invert the sphere geometry on the x-axis so inside is rendered

    // Create Material & Mesh
    const sphereMaterial = new THREE.MeshBasicMaterial();
    sphereMaterialRef.current = sphereMaterial;
    
    // Initialize material with a beautiful starting placeholder
    if (currentSceneRef.current) {
      sphereMaterial.map = createLowResPlaceholderTexture(currentSceneRef.current.title);
    } else {
      sphereMaterial.map = createFallbackPanoTexture();
    }

    const sphereMesh = new THREE.Mesh(geometry, sphereMaterial);
    scene.add(sphereMesh);
    sphereMeshRef.current = sphereMesh;

    // Set Three.js as ready
    setIsThreeReady(true);

    // FIX: Trigger high-res texture load for the initial scene immediately
    if (currentSceneRef.current) {
      const scene = currentSceneRef.current;
      const urls = getLowResAndHighResUrls(scene.imageUrl);
      
      textureLoaderRef.current.setCrossOrigin('anonymous');
      textureLoaderRef.current.load(urls.high, (texture) => {
        texture.minFilter = THREE.LinearMipmapLinearFilter;
        texture.generateMipmaps = true;
        texture.anisotropy = renderer.capabilities.getMaxAnisotropy() || 1;
        textureCacheRef.current.set(scene.id, texture);
        
        // Use the local sphereMaterial variable directly to avoid ref timing issues
        sphereMaterial.map = texture;
        sphereMaterial.needsUpdate = true;
        
        // Force a render
        if (sceneRef.current) {
          renderer.render(sceneRef.current, camera);
        }
      }, undefined, (err) => {
        console.warn(`Failed to load initial high-res texture for ${scene.id}:`, err);
      });
    }

    // Animation / Rendering Loop
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Butter-smooth lerp towards target orientation
      const lerpFactor = 0.15;
      cameraLonRef.current += (targetLonRef.current - cameraLonRef.current) * lerpFactor;
      cameraLatRef.current += (targetLatRef.current - cameraLatRef.current) * lerpFactor;
      cameraFovRef.current += (targetFovRef.current - cameraFovRef.current) * lerpFactor;

      // Keep angles within standard bounds
      const currentLat = Math.max(-85, Math.min(85, cameraLatRef.current));
      const currentLon = cameraLonRef.current;
      
      // Sync FOV changes dynamically in render loop
      if (camera.fov !== cameraFovRef.current) {
        camera.fov = cameraFovRef.current;
        camera.updateProjectionMatrix();
      }
      
      // Calculate Look At Direction from angles
      const phi = THREE.MathUtils.degToRad(90 - currentLat);
      const theta = THREE.MathUtils.degToRad(currentLon);

      const target = new THREE.Vector3();
      target.x = 500 * Math.sin(phi) * Math.cos(theta);
      target.y = 500 * Math.cos(phi);
      target.z = 500 * Math.sin(phi) * Math.sin(theta);

      camera.lookAt(target);
      renderer.render(scene, camera);

      // Project Hotspots coordinates to 2D HTML space
      const activeScene = currentSceneRef.current;
      if (activeScene && activeScene.hotspots && activeScene.hotspots.length > 0 && mountRef.current) {
        // Calculate container dimensions dynamically to solve shifting on mobile/tablet viewports
        const currentWidth = mountRef.current.clientWidth;
        const currentHeight = mountRef.current.clientHeight;
        
        const projections = activeScene.hotspots.map(hs => {
          // Convert hotspot's pitch/yaw back to 3D point
          const hsPhi = THREE.MathUtils.degToRad(90 - hs.pitch);
          const hsTheta = THREE.MathUtils.degToRad(hs.yaw);
          
          const hsVector = new THREE.Vector3();
          // Use positive x to match camera lookAt target coordinate system.
          // This keeps hotspots and directions perfectly stuck to the surface when the camera rotates.
          hsVector.x = 500 * Math.sin(hsPhi) * Math.cos(hsTheta);
          hsVector.y = 500 * Math.cos(hsPhi);
          hsVector.z = 500 * Math.sin(hsPhi) * Math.sin(hsTheta);

          // Project point to camera coordinates
          const vector = hsVector.clone();
          vector.project(camera);

          // Check if point is in front of camera
          const cameraDirection = new THREE.Vector3();
          camera.getWorldDirection(cameraDirection);
          const isBehind = hsVector.dot(cameraDirection) < 0;

          const screenX = (vector.x * .5 + .5) * currentWidth;
          const screenY = (-(vector.y * .5) + .5) * currentHeight;

          return {
            hotspot: hs,
            x: screenX,
            y: screenY,
            visible: !isBehind && screenX >= 0 && screenX <= currentWidth && screenY >= 0 && screenY <= currentHeight
          };
        });

        // Set state safely
        setProjectedHotspots(projections);
      } else {
        setProjectedHotspots([]);
      }
    };

    animate();

    // Resize Observer
    const resizeObserver = new ResizeObserver((entries) => {
      if (!entries || entries.length === 0) return;
      const { width: newWidth, height: newHeight } = entries[0].contentRect;
      if (cameraRef.current && rendererRef.current) {
        cameraRef.current.aspect = newWidth / newHeight;
        cameraRef.current.updateProjectionMatrix();
        rendererRef.current.setSize(newWidth, newHeight);
      }
    });
    resizeObserver.observe(mountRef.current);

    // Sync angle states local values to component states
    const angleUpdateInterval = setInterval(() => {
      // Update state for compass and UI readouts
      if (isUserInteractingRef.current || useGyroscopeRef.current) {
        setCameraLon(cameraLonRef.current);
        setCameraLat(cameraLatRef.current);
        setCameraFov(cameraFovRef.current);
      }
    }, 32); // ~30fps update for UI elements

    // Cleanups
    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      clearInterval(angleUpdateInterval);
      
      geometry.dispose();
      sphereMaterial.dispose();
      renderer.dispose();
      
      if (mountRef.current) {
        mountRef.current.innerHTML = '';
      }
    };
  }, [loading]);

  const touchPinchDistRef = useRef<number>(0);

  // Handle Drag & Swipe Events
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!e.isPrimary) return; // Only pan with the primary pointer
    isUserInteractingRef.current = true;
    onPointerDownPointerXRef.current = e.clientX;
    onPointerDownPointerYRef.current = e.clientY;
    lastPointerXRef.current = e.clientX;
    lastPointerYRef.current = e.clientY;
    onPointerDownLonRef.current = targetLonRef.current;
    onPointerDownLatRef.current = targetLatRef.current;
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!e.isPrimary || !isUserInteractingRef.current) return;
    
    // Calculate actual container dimensions dynamically
    const containerWidth = mountRef.current?.clientWidth || 1000;
    const containerHeight = mountRef.current?.clientHeight || 600;
    
    // Detect touch / pen pointer type to reverse the left and right swipe only for mobile/tablet
    const isTouch = e.pointerType === 'touch' || e.pointerType === 'pen';
    const speedFactor = isTouch ? 0.8 : 1.0; // decrease speed of movement on touch screens by 20%
    
    // Map screen pixel translation exactly to degrees of Field of View.
    // Multiplying by 2.4 provides a perfectly responsive and snappier "grabbing" feel, matching Google Earth.
    const panSpeedX = (cameraFovRef.current / containerWidth) * 2.4 * speedFactor;
    const panSpeedY = ((cameraFovRef.current * (containerHeight / containerWidth)) / containerHeight) * 2.4 * speedFactor;
    
    const deltaX = e.clientX - lastPointerXRef.current;
    const deltaY = e.clientY - lastPointerYRef.current;
    
    lastPointerXRef.current = e.clientX;
    lastPointerYRef.current = e.clientY;

    // Both PC/Mouse and Mobile/Tablet screens now use -1 for intuitive, natural, and consistent dragging direction
    const swipeMultiplierX = -1;

    targetLonRef.current += deltaX * panSpeedX * swipeMultiplierX;
    targetLatRef.current = Math.max(-85, Math.min(85, targetLatRef.current + deltaY * panSpeedY));
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!e.isPrimary) return;
    isUserInteractingRef.current = false;
    setCameraLon(cameraLonRef.current);
    setCameraLat(cameraLatRef.current);

    // Check for click (minimal movement)
    const deltaX = Math.abs(e.clientX - onPointerDownPointerXRef.current);
    const deltaY = Math.abs(e.clientY - onPointerDownPointerYRef.current);
    if (deltaX < 5 && deltaY < 5) {
      // It's a click on the canvas
      if (activeInfoHotspot) {
        setActiveInfoHotspot(null);
      } else if (!editMode && !isFullscreen) {
        // "expand first" - toggle fullscreen when clicking empty space, only IF NOT ALREADY FULLSCREEN
        toggleFullscreen();
      }
    }
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 2) {
      isUserInteractingRef.current = false; // Disable panning while zooming
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      touchPinchDistRef.current = Math.sqrt(dx * dx + dy * dy);
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      const delta = touchPinchDistRef.current - dist;
      touchPinchDistRef.current = dist;
      
      const newFov = Math.max(30, Math.min(100, targetFovRef.current + delta * 0.15));
      targetFovRef.current = newFov;
      setCameraFov(newFov);
    }
  };

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    const newFov = Math.max(30, Math.min(100, targetFovRef.current + e.deltaY * 0.05));
    targetFovRef.current = newFov;
    setCameraFov(newFov);
  };

  // Keyboard navigation / Console navigation
  const handleKeyDown = (direction: 'left' | 'right' | 'up' | 'down' | 'zoomIn' | 'zoomOut') => {
    const step = 20; // responsive step
    if (direction === 'left') targetLonRef.current -= step;
    if (direction === 'right') targetLonRef.current += step;
    if (direction === 'up') targetLatRef.current = Math.min(85, targetLatRef.current + step);
    if (direction === 'down') targetLatRef.current = Math.max(-85, targetLatRef.current - step);
    if (direction === 'zoomIn') {
      targetFovRef.current = Math.max(30, targetFovRef.current - 12);
    }
    if (direction === 'zoomOut') {
      targetFovRef.current = Math.min(100, targetFovRef.current + 12);
    }
    
    // Trigger immediate reactive feedback for state display
    setCameraLon(targetLonRef.current);
    setCameraLat(targetLatRef.current);
    setCameraFov(targetFovRef.current);
  };

  const toggleFullscreen = () => {
    const el = document.getElementById('three-sixty-tour-container');
    if (!el) return;

    if (!document.fullscreenElement) {
      el.requestFullscreen().then(() => setIsFullscreen(true)).catch(err => {
        console.error('Error enabling fullscreen:', err);
      });
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false));
    }
  };

  // Watch for fullscreen change via Esc key
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  if (loading) {
    return (
      <div className="w-full h-[320px] sm:h-[420px] md:h-[500px] flex flex-col items-center justify-center bg-stone-900 text-stone-200 rounded-2xl border border-stone-800">
        <RefreshCw className="w-10 h-10 animate-spin text-brand-green mb-4" />
        <p className="font-sans text-sm tracking-wide">Assembling 3D Virtual Tour Environment...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-6">
      
      {/* Main Tour Display Section */}
      <div 
        id="three-sixty-tour-container"
        className={`relative w-full rounded-2xl overflow-hidden shadow-2xl border bg-black transition-all duration-300 ${
          isFullscreen ? 'fixed inset-0 z-[9999] rounded-none h-screen' : 'h-[320px] sm:h-[420px] md:h-[600px] border-stone-200/80 dark:border-stone-800'
        }`}
      >
        
        {/* WebGL Mount Point */}
        <div 
          ref={mountRef}
          className="w-full h-full cursor-grab active:cursor-grabbing touch-none"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerOut={handlePointerUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onWheel={handleWheel}
        />

        {/* 2D Projected Navigation / Description Hotspots */}
        {projectedHotspots.map(({ hotspot, x, y, visible }) => {
          if (!visible) return null;
          const isInfo = hotspot.type === 'info';

          return (
            <div
              key={hotspot.id}
              className="absolute -translate-x-1/2 -translate-y-1/2 group z-40 flex flex-col items-center pointer-events-auto select-none"
              style={{ left: `${x}px`, top: `${y}px` }}
            >
              {isInfo ? (
                /* Information description area hotspot - styled to be premium glassmorphic */
                <button
                  onClick={() => setActiveInfoHotspot(hotspot)}
                  className="flex flex-col items-center focus:outline-none group/btn"
                >
                  {/* Glowing information beacon */}
                  <div className="relative flex items-center justify-center w-8 h-8">
                    <div className="absolute w-12 h-12 rounded-full bg-amber-400/20 animate-ping" />
                    <div className="absolute w-9 h-9 rounded-full bg-white/50 backdrop-blur-2xl border border-white/60 shadow-[0_8px_32px_rgba(255,255,255,0.2)]" />
                    <div className="w-6 h-6 rounded-full bg-amber-500 border border-white flex items-center justify-center shadow-lg transition-transform duration-200 group-hover/btn:scale-125 z-10">
                      <span className="text-[11px] text-white font-serif font-black italic">i</span>
                    </div>
                  </div>
                  {/* Floating Description Label - glassy transparent */}
                  <div className="mt-2 px-3 py-1.5 bg-white/40 backdrop-blur-[24px] border border-white/50 rounded-xl text-stone-900 text-[10px] font-bold tracking-wide whitespace-nowrap shadow-2xl flex items-center gap-1.5 opacity-90 group-hover/btn:opacity-100 transition-all duration-200">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    <span>{hotspot.text}</span>
                  </div>
                </button>
              ) : (
                /* Google Earth / Street View style perspective floor arrow link hotspot - styled to be light glassmorphic */
                <button
                  onClick={() => handleSwitchRoom(hotspot.targetSceneId, hotspot)}
                  className="flex flex-col items-center focus:outline-none group/btn"
                >
                  {/* Perspective ground chevron indicator */}
                  <div className="relative w-16 h-12 flex items-center justify-center" style={{ perspective: '120px' }}>
                    {/* Perspective flat circle */}
                    <div 
                      className="w-12 h-12 border-2 border-white/80 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 group-hover/btn:scale-110"
                      style={{ 
                        transform: 'rotateX(55deg) scaleY(1.2)',
                        backgroundColor: 'rgba(255,255,255,0.5)',
                        backdropFilter: 'blur(12px)'
                      }}
                    >
                      <ArrowRight className="w-5 h-5 text-white -rotate-90 animate-bounce" style={{ animationDuration: '2s' }} />
                    </div>
                    {/* Ping floor circle ripple */}
                    <div 
                      className="absolute w-16 h-16 rounded-full border animate-ping pointer-events-none"
                      style={{ 
                        transform: 'rotateX(55deg) scaleY(1.2)',
                        borderColor: 'rgba(255,255,255,0.7)'
                      }}
                    />
                  </div>

                  {/* Text label with glassy transparent backdrop blur */}
                  <div 
                    className="mt-1 px-4 py-1.5 bg-white/40 backdrop-blur-[24px] border border-white/50 rounded-full text-stone-900 text-[10px] font-bold tracking-wide whitespace-nowrap shadow-2xl flex items-center gap-1.5 opacity-90 group-hover/btn:opacity-100 transition-all duration-200"
                  >
                    <span>{hotspot.text}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-stone-700" />
                  </div>
                </button>
              )}

              {/* Admin Hotspot Actions */}
              {editMode && (
                <div className="mt-2 flex gap-1 z-50">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      openEditHotspotModal(hotspot);
                    }}
                    className="px-2.5 py-1 bg-stone-800/90 backdrop-blur-md hover:bg-black text-[9px] text-white font-sans font-bold rounded-lg shadow-lg flex items-center gap-1 transition-all active:scale-95 border border-white/10"
                  >
                    <Settings className="w-2.5 h-2.5" />
                    <span>Edit</span>
                  </button>
                  
                  {deletingHotspotId === hotspot.id ? (
                    <div className="flex gap-1 animate-in slide-in-from-right-2 duration-200">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleDeleteHotspot(hotspot.id);
                          setDeletingHotspotId(null);
                        }}
                        className="px-2.5 py-1 bg-red-600 text-[9px] text-white font-sans font-bold rounded-lg shadow-lg flex items-center gap-1 transition-all active:scale-95 border border-white/10"
                      >
                        Confirm
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setDeletingHotspotId(null);
                        }}
                        className="px-2.5 py-1 bg-stone-500 text-[9px] text-white font-sans font-bold rounded-lg shadow-lg transition-all active:scale-95 border border-white/10"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setDeletingHotspotId(hotspot.id);
                      }}
                      className="px-2.5 py-1 bg-red-600/90 backdrop-blur-md hover:bg-red-700 text-[9px] text-white font-sans font-bold rounded-lg shadow-lg flex items-center gap-1 transition-all active:scale-95 border border-white/10"
                    >
                      <Trash2 className="w-2.5 h-2.5" />
                      <span>Delete</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {/* Admin Center Crosshair (for precise hotspot placing) */}
        {editMode && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-10">
            <div className="relative">
              {/* Horizontal line */}
              <div className="w-10 h-0.5 bg-red-500 opacity-60 rounded-full" />
              {/* Vertical line */}
              <div className="w-0.5 h-10 bg-red-500 opacity-60 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              {/* Central target dot */}
              <div className="w-2 h-2 rounded-full bg-red-600 border border-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
              {/* Center instructions indicator */}
              <span className="absolute left-1/2 -translate-x-1/2 top-6 bg-red-600/90 text-white text-[10px] font-mono tracking-widest uppercase px-2 py-0.5 rounded whitespace-nowrap shadow border border-red-500">
                Hotspot Center Target
              </span>
            </div>
          </div>
        )}

        {/* YouTube-style Top Loading Progress Bar */}
        <AnimatePresence>
          {sceneLoading && (
            <motion.div 
              initial={{ width: "0%", opacity: 1 }}
              animate={{ width: "95%", opacity: 1 }}
              exit={{ width: "100%", opacity: 0 }}
              transition={{ 
                width: { duration: 2, ease: "easeOut" },
                opacity: { duration: 0.3 }
              }}
              className="absolute top-0 left-0 h-1 bg-brand-orange z-[60] shadow-[0_0_10px_rgba(249,115,22,0.5)]"
            />
          )}
        </AnimatePresence>

        {/* Interactive Smooth Fade Transition Overlay */}
        <AnimatePresence>
          {sceneLoading && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-stone-950/20 backdrop-blur-sm z-50 flex items-center justify-center pointer-events-none"
            >
              <div className="flex flex-col items-center">
                <div className="px-4 py-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl">
                  <p className="text-white text-[10px] font-black tracking-[0.2em] uppercase opacity-80">Loading View</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Top Title Bar - Replaced with Middle Compass & Onboarding guidelines */}
        <div className="absolute top-4 left-4 right-4 pointer-events-none flex justify-between items-start z-30">
          
          {/* Top Left: Admin Controls */}
          <div className="flex gap-2 pointer-events-auto">
            {/* Admin control panel toggler */}
            {isAdminMode && isAdmin && (
              <button
                onClick={() => {
                  setEditMode(!editMode);
                  if (!editMode) setShowAddHotspotModal(false);
                }}
                className={`px-3 py-2 rounded-xl text-xs font-medium font-sans flex items-center gap-1.5 shadow transition-all ${
                  editMode 
                    ? 'bg-amber-600 hover:bg-amber-700 text-white border border-amber-500' 
                    : 'bg-stone-900/90 hover:bg-stone-800 text-stone-200 border border-stone-800'
                }`}
              >
                <Settings className={`w-4 h-4 ${editMode ? 'animate-spin' : ''}`} />
                <span>{editMode ? 'Exit Layout Editor' : '🛠️ Edit 360 Tour'}</span>
              </button>
            )}
          </div>

          {/* CUSTOM HORIZONTAL COMPASS RULER (Top Center) */}
          <div id="tour-compass" className="absolute left-1/2 -translate-x-1/2 top-0 pointer-events-none flex flex-col items-center gap-1.5 w-64 sm:w-80">
            {/* Horizontal sliding ruler */}
            <div className="w-full h-8 bg-black/40 backdrop-blur-md border border-white/20 rounded-full overflow-hidden relative shadow-lg">
              <div 
                className="absolute top-0 bottom-0 flex items-center transition-transform duration-100 ease-out"
                style={{ 
                  transform: `translateX(calc(50% - ${cameraLon * 2}px))`
                }}
              >
                {/* Render repeating ruler segments to cover all rotation overflow */}
                {[-3, -2, -1, 0, 1, 2, 3].map((k) => (
                  <div key={k} className="absolute top-0 bottom-0 flex items-center" style={{ left: `${k * 720}px`, width: '720px' }}>
                    <div className="absolute left-[0px] top-[2px] text-[10px] text-brand-orange font-bold -translate-x-1/2 z-10">N</div>
                    <div className="absolute left-[180px] top-[2px] text-[10px] text-white font-bold -translate-x-1/2 z-10">E</div>
                    <div className="absolute left-[360px] top-[2px] text-[10px] text-white font-bold -translate-x-1/2 z-10">S</div>
                    <div className="absolute left-[540px] top-[2px] text-[10px] text-white font-bold -translate-x-1/2 z-10">W</div>
                    
                    {/* Ticks every 15 degrees (30px) */}
                    {Array.from({length: 24}).map((_, i) => (
                      <div 
                        key={i} 
                        className="absolute bottom-0 w-[1.5px] bg-white/40" 
                        style={{ 
                          left: `${i * 30}px`, 
                          height: i % 6 === 0 ? '12px' : '6px', 
                          transform: 'translateX(-50%)' 
                        }} 
                      />
                    ))}
                  </div>
                ))}
              </div>
              {/* Center Needle */}
              <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-brand-orange shadow-[0_0_8px_rgba(218,141,30,0.8)] -translate-x-1/2 z-20" />
            </div>
            
            {/* Room Title Tag - glassmorphic and elegant */}
            <div className="bg-white/20 dark:bg-black/20 backdrop-blur-lg border border-white/30 px-4 py-1.5 rounded-full shadow-md pointer-events-auto flex flex-col items-center gap-0.5">
              <h3 className="text-white font-sans text-xs sm:text-sm font-semibold tracking-wide flex items-center gap-1.5 whitespace-nowrap drop-shadow-md">
                <span>{currentScene?.title}</span>
                {currentScene?.isStart && (
                  <span className="px-1.5 py-0.5 bg-brand-orange/80 text-white text-[8px] sm:text-[9px] uppercase tracking-wider rounded font-mono font-bold">
                    Entrance
                  </span>
                )}
              </h3>
            </div>
          </div>

          <div className="flex gap-2 pointer-events-auto">
            {/* Interactive Guide Walkthrough Toggler */}
            <button 
              onClick={() => {
                setGuideStep(0);
                setShowGuide(true);
              }}
              className="px-2 sm:px-4 py-2 bg-white/90 backdrop-blur-md border border-white/20 text-black rounded-xl hover:bg-white transition-all shadow-xl flex items-center gap-2 text-xs font-bold font-sans active:scale-95"
              title="Open Navigation Tour Guide"
            >
              <HelpCircle className="w-4.5 h-4.5 text-brand-green animate-bounce" />
              <span className="hidden sm:inline">Tour Guide</span>
            </button>
          </div>
        </div>

        {/* ONBOARDING CUSTOMER WALKTHROUGH GUIDE DIALOG OVERLAY */}
        {showGuide && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white/20 dark:bg-black/30 backdrop-blur-2xl border border-white/30 rounded-2xl p-5 shadow-2xl max-w-sm w-full animate-in zoom-in-95 duration-200 flex flex-col gap-3 pointer-events-auto text-white">
              {/* Header */}
              <div className="flex justify-between items-center pb-2 border-b border-white/20">
                <span className="px-2 py-0.5 bg-brand-orange/80 text-white text-[10px] font-sans font-bold uppercase tracking-wider rounded-md">
                  Step {guideStep + 1} of {GUIDE_STEPS.length}
                </span>
                <button
                  onClick={() => {
                    setShowGuide(false);
                    try {
                      localStorage.setItem('kidtopia_tour_guide_shown', 'true');
                    } catch (e) {}
                  }}
                  className="text-white/60 hover:text-white transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              {/* Step info */}
              <div className="flex flex-col gap-1.5 drop-shadow-md">
                <h4 className="font-sans font-black text-white text-sm tracking-wide">
                  {GUIDE_STEPS[guideStep].title}
                </h4>
                <p className="text-xs text-white/90 leading-relaxed font-sans">
                  {GUIDE_STEPS[guideStep].description}
                </p>
              </div>
              
              {/* Visual Help Indicator */}
              <div className="bg-black/20 p-4 rounded-xl border border-white/20 flex items-center justify-center backdrop-blur-md shadow-inner overflow-hidden min-h-[80px]">
                <AnimatePresence mode="wait">
                  {guideStep === 0 && (
                    <motion.div 
                      key="step0"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="flex flex-col items-center gap-2"
                    >
                      <motion.div
                        animate={{ 
                          x: [-20, 20, -20],
                          transition: { repeat: Infinity, duration: 2 }
                        }}
                        className="p-2 bg-white/10 rounded-full border border-white/20"
                      >
                        <Move className="w-6 h-6 text-brand-orange" />
                      </motion.div>
                      <span className="text-[10px] text-brand-orange font-bold uppercase tracking-wider">Drag to look around</span>
                    </motion.div>
                  )}
                  {guideStep === 1 && (
                    <motion.div 
                      key="step1"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex flex-col items-center gap-2"
                    >
                      <motion.div
                        animate={{ 
                          y: [0, -10, 0],
                          transition: { repeat: Infinity, duration: 1.5 }
                        }}
                      >
                        <ArrowRight className="w-7 h-7 text-white -rotate-90" />
                      </motion.div>
                      <span className="text-[10px] text-white font-bold uppercase tracking-wider">Tap arrows to move</span>
                    </motion.div>
                  )}
                  {guideStep === 2 && (
                    <motion.div 
                      key="step2"
                      initial={{ opacity: 0, rotate: -45 }}
                      animate={{ opacity: 1, rotate: 0 }}
                      exit={{ opacity: 0, rotate: 45 }}
                      className="flex flex-col items-center gap-2"
                    >
                      <motion.div
                        animate={{ 
                          rotate: 360,
                          transition: { repeat: Infinity, duration: 8, ease: "linear" }
                        }}
                      >
                        <Compass className="w-7 h-7 text-white" />
                      </motion.div>
                      <span className="text-[10px] text-white font-bold uppercase tracking-wider">Check your heading</span>
                    </motion.div>
                  )}
                  {guideStep === 3 && (
                    <motion.div 
                      key="step3"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="grid grid-cols-2 gap-4 items-center"
                    >
                      <motion.div
                        animate={{ 
                          scale: [1, 1.1, 1],
                          transition: { repeat: Infinity, duration: 2 }
                        }}
                        className="flex flex-col items-center gap-1"
                      >
                        <ZoomIn className="w-5 h-5 text-brand-orange" />
                        <span className="text-[8px] font-bold">Zoom</span>
                      </motion.div>
                      <motion.div
                        animate={{ 
                          rotate: [0, 90, 180, 270, 360],
                          transition: { repeat: Infinity, duration: 4 }
                        }}
                        className="flex flex-col items-center gap-1"
                      >
                        <RotateCcw className="w-5 h-5 text-brand-orange" />
                        <span className="text-[8px] font-bold">Reset</span>
                      </motion.div>
                    </motion.div>
                  )}
                  {guideStep === 4 && (
                    <motion.div 
                      key="step4"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="flex items-center gap-3 overflow-hidden px-4"
                    >
                      {[1, 2, 3].map(i => (
                        <motion.div 
                          key={i}
                          animate={{ 
                            x: [-10, 10, -10],
                            transition: { repeat: Infinity, duration: 3, delay: i * 0.2 }
                          }}
                          className="w-8 h-8 rounded bg-white/10 shrink-0 border border-white/20"
                        />
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              {/* Action controls */}
              <div className="flex justify-between items-center mt-2 pt-2 border-t border-white/20">
                <button
                  type="button"
                  onClick={() => {
                    setShowGuide(false);
                    try {
                      localStorage.setItem('kidtopia_tour_guide_shown', 'true');
                    } catch (e) {}
                  }}
                  className="px-3 py-1.5 text-xs text-white/70 hover:text-white transition font-sans font-semibold"
                >
                  Skip Guide
                </button>
                
                <div className="flex gap-1.5">
                  {guideStep > 0 && (
                    <button
                      type="button"
                      onClick={() => setGuideStep(prev => prev - 1)}
                      className="px-3 py-1.5 border border-white/30 hover:bg-white/10 text-white rounded-lg text-xs font-sans font-semibold transition"
                    >
                      Back
                    </button>
                  )}
                  
                  <button
                    type="button"
                    onClick={() => {
                      if (guideStep < GUIDE_STEPS.length - 1) {
                        setGuideStep(prev => prev + 1);
                      } else {
                        setShowGuide(false);
                        try {
                          localStorage.setItem('kidtopia_tour_guide_shown', 'true');
                        } catch (e) {}
                      }
                    }}
                    className="px-4 py-1.5 bg-brand-orange hover:bg-brand-orange/90 text-white rounded-lg text-xs font-sans font-bold shadow-md transition border border-white/20"
                  >
                    {guideStep === GUIDE_STEPS.length - 1 ? "Start Exploring!" : "Next"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Floating Info Hotspot Description Overlay */}
        {activeInfoHotspot && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-sm px-4 pointer-events-auto">
            <div className="bg-white/30 backdrop-blur-[40px] border border-white/60 p-6 rounded-[32px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] animate-in zoom-in-95 duration-300">
              <div className="flex justify-between items-start mb-4">
                <h4 className="font-sans font-black text-stone-900 text-[11px] tracking-widest uppercase flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)] animate-pulse" />
                  {activeInfoHotspot.text}
                </h4>
                <button 
                  onClick={() => setActiveInfoHotspot(null)}
                  className="p-1.5 bg-black/5 hover:bg-black/10 rounded-full transition text-stone-500 hover:text-stone-900"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-stone-700 text-xs leading-relaxed font-semibold font-sans">
                {activeInfoHotspot.description || "Discover more details about this area of our modern nursery school."}
              </p>
            </div>
          </div>
        )}

        {/* Floating Bottom Navigation Console (Room Selector & PlayStation D-pad Controller) */}
        <div className="absolute bottom-4 left-4 right-4 pointer-events-none flex justify-between items-end z-30">
          
          {/* Room Selector Quick Links Menu */}
          <div className="flex flex-col items-start gap-2 pointer-events-auto max-w-[70%] sm:max-w-[80%] md:max-w-[85%] transition-all">
            {/* Desktop / Tablet View: Collapsible Row Selection */}
            <div className="hidden md:flex items-center gap-1.5 md:gap-2">
              <button
                onClick={() => setIsRoomListExpanded(!isRoomListExpanded)}
                className="bg-black/60 backdrop-blur-md border border-white/10 p-2 md:p-2.5 rounded-xl shadow-lg text-white hover:bg-black transition-all"
                title={isRoomListExpanded ? "Hide Rooms" : "Explore Rooms"}
              >
                <ChevronRight className={`w-4 h-4 md:w-5 md:h-5 transition-transform duration-300 ${isRoomListExpanded ? 'rotate-180' : ''}`} />
              </button>
              
              {isRoomListExpanded && (
                <div className="flex bg-black/60 backdrop-blur-md border border-white/10 p-1.5 md:p-2 rounded-xl shadow-lg gap-1 md:gap-1.5 overflow-x-auto scrollbar-none animate-in slide-in-from-left duration-300">
                  {scenes.map(s => (
                    <button
                      key={s.id}
                      onClick={() => handleSwitchRoom(s.id)}
                      className={`px-2 md:px-3 py-1 md:py-1.5 rounded-lg text-[10px] md:text-xs font-sans tracking-wide font-medium transition-all whitespace-nowrap ${
                        currentScene?.id === s.id
                          ? 'bg-brand-green text-white shadow'
                          : 'text-stone-300 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      {s.title}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Mobile View: Collapsible Selector Button */}
            <div className="relative md:hidden">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsRoomsMenuOpen(!isRoomsMenuOpen);
                }}
                className="bg-black/85 backdrop-blur-md border border-white/20 px-3 py-2.5 rounded-xl shadow-2xl text-white text-xs font-sans font-semibold flex items-center gap-2 hover:bg-black transition active:scale-95"
              >
                <ChevronRight className={`w-4 h-4 text-white transition-transform duration-200 ${isRoomsMenuOpen ? 'rotate-90' : ''}`} />
                {isRoomsMenuOpen && (
                  <span className="truncate max-w-[120px] xs:max-w-[180px] animate-in fade-in duration-200">
                    {currentScene?.title || 'Select Classroom'}
                  </span>
                )}
              </button>
              
              {isRoomsMenuOpen && (
                <>
                  {/* Backdrop click guard to easily close the dropdown */}
                  <div 
                    className="fixed inset-0 z-40 bg-transparent" 
                    onClick={() => setIsRoomsMenuOpen(false)}
                  />
                  
                  {/* Floating Selection Options Panel */}
                  <div className="absolute bottom-12 left-0 w-64 max-h-56 overflow-y-auto bg-stone-950/95 backdrop-blur-lg border border-white/10 rounded-2xl shadow-2xl p-2 flex flex-col gap-1 z-50 animate-in slide-in-from-bottom duration-150">
                    <div className="px-2.5 py-1.5 text-[10px] font-mono tracking-widest text-stone-500 uppercase font-semibold border-b border-white/5 mb-1">
                      Campus Classrooms
                    </div>
                    {scenes.map(s => (
                      <button
                        key={s.id}
                        onClick={() => {
                          handleSwitchRoom(s.id);
                          setIsRoomsMenuOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs font-sans transition-all flex items-center justify-between ${
                          currentScene?.id === s.id
                            ? 'bg-brand-green text-white font-semibold shadow'
                            : 'text-stone-300 hover:bg-white/5 hover:text-white'
                        }`}
                      >
                        <span className="truncate pr-2">{s.title}</span>
                        {currentScene?.id === s.id && <Check className="w-3.5 h-3.5 text-white" />}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
 
          {/* PlayStation Controller Cross D-pad Console - Glassmorphic Transparent Overlay */}
          <div className="flex flex-col items-center gap-3 pointer-events-auto z-30">
            {/* Circular D-pad body - styled to be glassmorphic and transparent */}
            <div className="hidden sm:flex relative w-40 h-40 bg-black/25 backdrop-blur-md rounded-full border border-white/20 shadow-2xl items-center justify-center select-none">
              {/* UP button */}
              <button
                onClick={() => handleKeyDown('up')}
                className="absolute top-2 left-1/2 -translate-x-1/2 w-12 h-12 rounded-t-lg bg-white/5 hover:bg-white/15 active:bg-brand-green/40 border-t border-x border-white/10 text-white/80 hover:text-white flex items-center justify-center transition-all duration-100"
                title="Look Up"
              >
                <ArrowUp className="w-6 h-6" />
              </button>
              
              {/* LEFT button */}
              <button
                onClick={() => handleKeyDown('left')}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-12 h-12 rounded-l-lg bg-white/5 hover:bg-white/15 active:bg-brand-green/40 border-l border-y border-white/10 text-white/80 hover:text-white flex items-center justify-center transition-all duration-100"
                title="Rotate Left"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>

              {/* RIGHT button */}
              <button
                onClick={() => handleKeyDown('right')}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-12 h-12 rounded-r-lg bg-white/5 hover:bg-white/15 active:bg-brand-green/40 border-r border-y border-white/10 text-white/80 hover:text-white flex items-center justify-center transition-all duration-100"
                title="Rotate Right"
              >
                <ArrowRight className="w-6 h-6" />
              </button>

              {/* DOWN button */}
              <button
                onClick={() => handleKeyDown('down')}
                className="absolute bottom-2 left-1/2 -translate-x-1/2 w-12 h-12 rounded-b-lg bg-white/5 hover:bg-white/15 active:bg-brand-green/40 border-b border-x border-white/10 text-white/80 hover:text-white flex items-center justify-center transition-all duration-100"
                title="Look Down"
              >
                <ArrowDown className="w-6 h-6" />
              </button>

              {/* Central CORE button (Reset View) */}
              <button
                onClick={() => {
                  const sLon = currentScene?.startLon ?? 0;
                  const sLat = currentScene?.startLat ?? 0;
                  targetLonRef.current = sLon;
                  targetLatRef.current = sLat;
                  targetFovRef.current = 75;
                  setCameraLon(sLon);
                  setCameraLat(sLat);
                  setCameraFov(75);
                }}
                className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 active:bg-brand-green/40 border border-white/20 flex items-center justify-center transition-all text-white/85 hover:text-brand-green"
                title="Reset Camera Orientation"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
            </div>

            {/* Action Bar: Gyroscope, Zoom In, Zoom Out, Fullscreen - transparent glass layout */}
            <div className="bg-black/25 backdrop-blur-md border border-white/20 px-2 md:px-3 py-1.5 rounded-xl shadow-lg flex items-center gap-1.5 md:gap-2.5">
              <button
                type="button"
                onClick={requestDeviceOrientationPermission}
                className={`p-1.5 md:p-2 rounded-lg transition-all ${
                  useGyroscope 
                    ? 'bg-brand-green/30 text-brand-green border border-brand-green/30' 
                    : 'text-stone-300 hover:text-white hover:bg-white/10 border border-transparent'
                }`}
                title="Use Device Gyroscope"
              >
                <Compass className={`w-4.5 h-4.5 md:w-5.5 md:h-5.5 ${useGyroscope ? 'animate-spin' : ''}`} style={{ animationDuration: useGyroscope ? '6s' : '0s' }} />
              </button>

              <div className="w-[1px] h-3 md:h-4 bg-white/20" />

              <button
                onClick={() => handleKeyDown('zoomIn')}
                className="hidden md:block p-1.5 md:p-2 hover:bg-white/10 text-stone-300 hover:text-white rounded-lg transition"
                title="Zoom In"
              >
                <ZoomIn className="w-4.5 h-4.5 md:w-5.5 md:h-5.5" />
              </button>
              <button
                onClick={() => handleKeyDown('zoomOut')}
                className="hidden md:block p-1.5 md:p-2 hover:bg-white/10 text-stone-300 hover:text-white rounded-lg transition"
                title="Zoom Out"
              >
                <ZoomOut className="w-4.5 h-4.5 md:w-5.5 md:h-5.5" />
              </button>
              <div className="hidden md:block w-[1px] h-3 md:h-4 bg-white/20" />
              <button
                onClick={toggleFullscreen}
                className="p-1.5 md:p-2 hover:bg-white/10 text-stone-300 hover:text-white rounded-lg transition"
                title="Toggle Fullscreen"
              >
                {isFullscreen ? <Minimize2 className="w-4.5 h-4.5 md:w-5.5 md:h-5.5" /> : <Maximize2 className="w-4.5 h-4.5 md:w-5.5 md:h-5.5" />}
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* HORIZONTAL SIDE-SCROLLABLE SCENE QUICK-NAVIGATOR CAROUSEL */}
      <div id="side-scrollable-navigator" className="mt-4 bg-white dark:bg-stone-900/60 backdrop-blur-sm border border-stone-200/80 dark:border-stone-800 rounded-2xl p-4 shadow-md pointer-events-auto transition-all">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-brand-green" />
            <h4 className="font-sans font-bold text-[10px] sm:text-xs tracking-wider text-stone-800 dark:text-stone-200 uppercase">
              Explore Kidtopia Campus Rooms
            </h4>
          </div>
          <span className="text-[9px] font-sans text-stone-400 font-medium">
            Swipe left/right to view rooms ({scenes.length})
          </span>
        </div>
        
        {/* Horizontal flex scroll container */}
        <div className="flex gap-3 overflow-x-auto pb-1.5 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-stone-200 dark:scrollbar-thumb-stone-800 snap-x">
          {scenes.map(s => {
            const isActive = currentScene?.id === s.id;
            const urls = getLowResAndHighResUrls(s.imageUrl);
            
            return (
              <button
                key={s.id}
                onClick={() => handleSwitchRoom(s.id)}
                className={`snap-start shrink-0 flex flex-col items-start gap-1.5 p-1.5 rounded-xl border text-left transition-all relative group ${
                  isActive
                    ? 'bg-brand-green/10 border-brand-green shadow-md ring-1 ring-brand-green/30'
                    : 'bg-stone-50 dark:bg-stone-950 border-stone-200 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-700 hover:bg-stone-100/50 dark:hover:bg-stone-900/50'
                }`}
                style={{ width: '135px' }}
              >
                {/* Miniature Thumbnail */}
                <div className="w-full h-20 rounded-lg overflow-hidden relative bg-stone-900 select-none pointer-events-none">
                  <img
                    src={urls.low}
                    alt={s.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  
                  {s.isStart && (
                    <span className="absolute top-1 left-1 px-1.5 py-0.5 bg-brand-green text-white font-mono font-black text-[7px] uppercase tracking-wider rounded-md shadow-xs">
                      Start
                    </span>
                  )}
                  
                  {isActive && (
                    <div className="absolute inset-0 bg-brand-green/20 flex items-center justify-center backdrop-blur-[0.5px]">
                      <span className="px-2 py-0.5 bg-brand-green text-white font-sans font-bold text-[8px] uppercase tracking-wider rounded-full shadow-md animate-pulse">
                        Viewing
                      </span>
                    </div>
                  )}
                </div>
                
                {/* Title */}
                <div className="px-1 w-full">
                  <p className={`text-[10px] font-sans font-bold leading-tight line-clamp-2 ${
                    isActive ? 'text-brand-green' : 'text-stone-700 dark:text-stone-300'
                  }`}>
                    {s.title}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Admin Blueprint & Customization Panels (Locked Behind Auth) */}
      {editMode && currentScene && (
        <div className="bg-amber-50 dark:bg-stone-900 border border-amber-200 dark:border-stone-800 rounded-2xl p-6 shadow-md transition-all">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-amber-200/60 dark:border-stone-800">
            <div>
              <span className="px-2 py-0.5 bg-amber-100 dark:bg-stone-800 text-amber-800 dark:text-amber-400 text-[10px] font-mono tracking-widest uppercase rounded font-bold">
                Daycare Tour Customizer
              </span>
              <h4 className="text-stone-800 dark:text-stone-100 font-sans font-semibold text-lg mt-1">
                Visual Tour Builder Tools
              </h4>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setShowAddRoomModal(true)}
                className="px-3.5 py-2 bg-brand-green hover:bg-brand-green/90 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition shadow"
              >
                <Plus className="w-4 h-4" />
                <span>Add New 360 Room</span>
              </button>
              
              <button
                onClick={() => setShowAddHotspotModal(true)}
                className="px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition shadow"
              >
                <Move className="w-4 h-4" />
                <span>Link a Room (Hotspot)</span>
              </button>

              <button
                onClick={handleSetAsStartRoom}
                className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition shadow"
                disabled={currentScene.isStart}
              >
                <Check className="w-4 h-4" />
                <span>Set Current as Start Room</span>
              </button>

              <button
                onClick={() => {
                  setEditRoomTitle(currentScene.title);
                  setShowEditRoomModal(true);
                }}
                className="px-3.5 py-2 bg-stone-700 hover:bg-stone-800 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition shadow"
              >
                <Settings className="w-4 h-4" />
                <span>Rename Current Room</span>
              </button>

              <button
                onClick={handleSaveStartingDirection}
                className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition shadow"
                title="Save the current camera angle/direction as the starting viewpoint for this classroom"
              >
                <Compass className="w-4 h-4 animate-pulse" />
                <span>Set Entrance View Angle</span>
              </button>

              <button
                onClick={() => handleDeleteRoom(currentScene.id)}
                className="px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition shadow"
                disabled={scenes.length <= 1}
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete Current Room</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Hotspots Connections List */}
            <div className="bg-white dark:bg-stone-950 p-4 rounded-xl border border-stone-200 dark:border-stone-800">
              <h5 className="text-stone-800 dark:text-stone-200 text-xs font-mono uppercase tracking-wider font-semibold mb-3 flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-brand-green" />
                Outgoing Hotspots in {currentScene.title}
              </h5>
              
              {currentScene.hotspots && currentScene.hotspots.length > 0 ? (
                <div className="space-y-2">
                  {currentScene.hotspots.map(hs => {
                    const targetName = scenes.find(s => s.id === hs.targetSceneId)?.title || hs.targetSceneId;
                    return (
                      <div 
                        key={hs.id}
                        className="flex items-center justify-between p-3 bg-stone-50 dark:bg-stone-900 rounded-lg border border-stone-200/60 dark:border-stone-800 text-xs"
                      >
                        <div className="space-y-0.5 flex items-start gap-2">
                          <div 
                            className="w-3 h-3 rounded-full mt-0.5 shrink-0 border border-white/40 shadow-xs" 
                            style={{ backgroundColor: hs.color || '#10b981' }} 
                            title="Custom Accent Color"
                          />
                          <div>
                            <p className="font-semibold text-stone-700 dark:text-stone-200">{hs.text}</p>
                            <p className="text-stone-500 font-mono text-[10px]">
                              Links to: <span className="font-sans font-medium text-brand-green" style={{ color: hs.color || '#10b981' }}>{targetName}</span> (Lat: {hs.pitch}°, Lon: {hs.yaw}°)
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => openEditHotspotModal(hs)}
                            className="p-1.5 bg-stone-100 hover:bg-stone-200 text-stone-600 dark:bg-stone-800 dark:hover:bg-stone-700 dark:text-stone-300 rounded-lg transition"
                            title="Edit Hotspot"
                          >
                            <Settings className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteHotspot(hs.id)}
                            className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-950/20 dark:hover:bg-red-950/40 rounded-lg transition"
                            title="Delete Hotspot"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-6 text-stone-400 font-sans text-xs">
                  <Move className="w-8 h-8 mx-auto mb-2 opacity-55 text-stone-400" />
                  No hotspots defined yet. Click "Link a Room" to connect this view to another part of the daycare.
                </div>
              )}
            </div>

            {/* Help / Coordinates panel */}
            <div className="bg-white dark:bg-stone-950 p-4 rounded-xl border border-stone-200 dark:border-stone-800 flex flex-col justify-between">
              <div>
                <h5 className="text-stone-800 dark:text-stone-200 text-xs font-mono uppercase tracking-wider font-semibold mb-3 flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4 text-amber-500" />
                  How to visually link rooms:
                </h5>
                <ol className="list-decimal list-inside space-y-2 text-stone-600 dark:text-stone-400 text-xs font-sans leading-relaxed">
                  <li>Rotate the 360 viewer above until the central red crosshair is looking at the doorway or area you want to place the navigation link.</li>
                  <li>Click <strong className="text-amber-600 font-medium">"Link a Room"</strong> above.</li>
                  <li>In the popup modal, name the button (e.g. "Enter Classroom") and select which room it connects to.</li>
                  <li>Click Save. The hotspot is created exactly on target!</li>
                </ol>
              </div>

              <div className="mt-4 pt-4 border-t border-stone-100 dark:border-stone-800 flex justify-between items-center text-xs">
                <span className="font-mono text-stone-500">Current Camera Orientation:</span>
                <span className="font-mono font-bold text-brand-green bg-brand-green/10 px-2 py-0.5 rounded">
                  Lat: {Math.round(cameraLat)}° / Lon: {Math.round(cameraLon)}°
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1: Add New Room */}
      {showAddRoomModal && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl w-full max-w-lg shadow-2xl p-6 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-sans font-bold text-stone-800 dark:text-white text-lg flex items-center gap-2">
                <Camera className="w-5 h-5 text-brand-green" />
                Add New 360 Scene Room
              </h4>
              <button 
                onClick={() => setShowAddRoomModal(false)}
                className="p-1 bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-500 dark:text-stone-400 rounded-full transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateRoom} className="space-y-4 font-sans text-sm">
              <div>
                <label className="block text-stone-700 dark:text-stone-300 font-medium mb-1.5">
                  Room Title / Label
                </label>
                <input
                  type="text"
                  placeholder="e.g. Creative Playroom, Toddler Sandbox"
                  value={newRoomTitle}
                  onChange={(e) => setNewRoomTitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-950 text-stone-800 dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-brand-green"
                  required
                />
              </div>

              <div>
                <label className="block text-stone-700 dark:text-stone-300 font-medium mb-1.5">
                  Upload 360 Panorama Photo (Equirectangular)
                </label>
                
                <div className="border-2 border-dashed border-stone-200 dark:border-stone-800 rounded-2xl p-6 text-center hover:bg-stone-50 dark:hover:bg-stone-950/40 transition">
                  <input
                    type="file"
                    id="pano-upload-input"
                    accept="image/*"
                    onChange={(e) => {
                      const files = e.target.files;
                      if (files && files.length > 0) {
                        setNewRoomImageFile(files[0]);
                        handleImageUpload(files[0]);
                      }
                    }}
                    className="hidden"
                  />
                  <label htmlFor="pano-upload-input" className="cursor-pointer block">
                    {uploadingImage ? (
                      <div className="flex flex-col items-center">
                        <RefreshCw className="w-8 h-8 animate-spin text-brand-green mb-2" />
                        <span className="text-stone-500 text-xs">Uploading and processing 360 panorama file...</span>
                      </div>
                    ) : newRoomImageUrl ? (
                      <div className="flex flex-col items-center">
                        <Check className="w-8 h-8 text-brand-green mb-2" />
                        <span className="text-brand-green text-xs font-semibold">Image uploaded successfully!</span>
                        <span className="text-stone-400 text-[11px] truncate max-w-xs mt-1">{newRoomImageUrl}</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <ImageIcon className="w-8 h-8 text-stone-400 mb-2" />
                        <span className="text-stone-700 dark:text-stone-300 font-semibold text-xs">Click or Drag & Drop to Upload</span>
                        <span className="text-stone-400 text-[10px] mt-1">Supports JPEG, PNG, WEBP (Equirectangular recommended)</span>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-stone-700 dark:text-stone-300 font-medium mb-1.5 flex items-center justify-between">
                  <span>Or use a web image URL</span>
                  <button
                    type="button"
                    onClick={() => {
                      const link = prompt(`Please paste your shared Google Drive 360 panorama link:\n(Make sure sharing in Drive is set to 'Anyone with the link can view')`);
                      if (link) {
                        const converted = convertGoogleDriveUrl(link);
                        setNewRoomImageUrl(converted);
                        alert('Google Drive panorama successfully imported & converted!');
                      }
                    }}
                    className="text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center gap-1"
                  >
                    <span>📥 Select from Drive</span>
                  </button>
                </label>
                <input
                  type="url"
                  placeholder="https://example.com/panorama.jpg (Paste Google Drive link to auto-import!)"
                  value={newRoomImageUrl}
                  onChange={(e) => setNewRoomImageUrl(e.target.value)}
                  onBlur={() => {
                    const converted = convertGoogleDriveUrl(newRoomImageUrl);
                    if (converted !== newRoomImageUrl) {
                      setNewRoomImageUrl(converted);
                    }
                  }}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-950 text-stone-800 dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-brand-green"
                />
                <p className="mt-1 text-[11px] text-stone-500 dark:text-stone-400 leading-normal">
                  💡 <strong>Google Drive links supported!</strong> Simply copy & paste any shared Drive file link (e.g., <code>https://drive.google.com/file/d/.../view</code>) and it will automatically convert to a direct high-speed image.
                </p>
              </div>

              <div className="pt-4 border-t border-stone-100 dark:border-stone-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddRoomModal(false)}
                  className="px-4 py-2 bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 rounded-xl hover:bg-stone-200 dark:hover:bg-stone-700 transition font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploadingImage || !newRoomImageUrl || !newRoomTitle}
                  className="px-4 py-2 bg-brand-green hover:bg-brand-green/90 disabled:bg-stone-200 disabled:dark:bg-stone-800 disabled:text-stone-400 text-white rounded-xl transition font-medium shadow"
                >
                  Create Room
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 1B: Edit Room */}
      {showEditRoomModal && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl w-full max-w-lg shadow-2xl p-6 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-sans font-bold text-stone-800 dark:text-white text-lg flex items-center gap-2">
                <Settings className="w-5 h-5 text-stone-700 dark:text-stone-300" />
                Rename 360 Scene Room
              </h4>
              <button 
                onClick={() => setShowEditRoomModal(false)}
                className="p-1 bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-500 dark:text-stone-400 rounded-full transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleEditRoomName} className="space-y-4 font-sans text-sm">
              <div>
                <label className="block text-stone-700 dark:text-stone-300 font-medium mb-1.5">
                  Room Title / Label
                </label>
                <input
                  type="text"
                  placeholder="e.g. Creative Playroom, Toddler Sandbox"
                  value={editRoomTitle}
                  onChange={(e) => setEditRoomTitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-950 text-stone-800 dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-brand-green"
                  required
                />
              </div>

              <div className="pt-4 border-t border-stone-100 dark:border-stone-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowEditRoomModal(false)}
                  className="px-4 py-2 bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 rounded-xl hover:bg-stone-200 dark:hover:bg-stone-700 transition font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-brand-green hover:bg-emerald-600 text-white rounded-xl font-medium transition shadow flex items-center gap-2"
                >
                  Save Name
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Add Hotspot Connection */}
      {showAddHotspotModal && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl w-full max-w-md shadow-2xl p-6 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-sans font-bold text-stone-800 dark:text-white text-lg flex items-center gap-2">
                <Plus className="w-5 h-5 text-amber-500 animate-pulse" />
                Add Interactive Hotspot
              </h4>
              <button 
                onClick={() => setShowAddHotspotModal(false)}
                className="p-1 bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-500 dark:text-stone-400 rounded-full transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateHotspot} className="space-y-4 font-sans text-sm">
              <div className="p-3 bg-amber-50/80 dark:bg-stone-950 border border-amber-100 dark:border-stone-800 rounded-xl flex flex-col space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-amber-800 dark:text-amber-400 font-bold">
                  Hotspot Coordinates Locked
                </span>
                <span className="font-mono text-stone-600 dark:text-stone-400 text-xs">
                  Pitch (Vertical Lat): {Math.round(cameraLat)}° <br />
                  Yaw (Horizontal Lon): {Math.round(cameraLon)}°
                </span>
              </div>

              {/* Hotspot Type Switcher Segmented Control */}
              <div>
                <label className="block text-stone-700 dark:text-stone-300 font-medium mb-1.5">
                  Hotspot Purpose / Type
                </label>
                <div className="grid grid-cols-2 gap-2 bg-stone-100 dark:bg-stone-950 p-1 rounded-xl border border-stone-200 dark:border-stone-800">
                  <button
                    type="button"
                    onClick={() => setNewHotspotType('link')}
                    className={`py-2 rounded-lg text-xs font-semibold font-sans tracking-wide transition-all ${
                      newHotspotType === 'link'
                        ? 'bg-brand-green text-white shadow'
                        : 'text-stone-600 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200'
                    }`}
                  >
                    🔗 Room Transition Link
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewHotspotType('info')}
                    className={`py-2 rounded-lg text-xs font-semibold font-sans tracking-wide transition-all ${
                      newHotspotType === 'info'
                        ? 'bg-amber-500 text-white shadow'
                        : 'text-stone-600 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200'
                    }`}
                  >
                    ℹ️ Information Beacon
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-stone-700 dark:text-stone-300 font-medium mb-1.5">
                  Hotspot Label / Text Title
                </label>
                <input
                  type="text"
                  placeholder={newHotspotType === 'link' ? "e.g. Enter Preschool Room, Back to Main Entrance" : "e.g. Reading Corner, Sleeping Area"}
                  value={newHotspotText}
                  onChange={(e) => setNewHotspotText(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-950 text-stone-800 dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-brand-green"
                  required
                />
              </div>

              {/* Color Selector for direction/hotspot customization */}
              <div>
                <label className="block text-stone-700 dark:text-stone-300 font-medium mb-1.5 flex justify-between items-center">
                  <span>Hotspot Custom Accent Color</span>
                  <span className="text-[10px] text-stone-400">Used to express/highlight rooms</span>
                </label>
                <div className="flex items-center gap-2">
                  <div className="flex flex-wrap gap-1.5 flex-1 bg-stone-100 dark:bg-stone-950 p-1.5 rounded-xl border border-stone-200 dark:border-stone-800">
                    {[
                      { hex: '#10b981', label: 'Green' },
                      { hex: '#f97316', label: 'Orange' },
                      { hex: '#3b82f6', label: 'Blue' },
                      { hex: '#ef4444', label: 'Red' },
                      { hex: '#8b5cf6', label: 'Purple' },
                      { hex: '#ec4899', label: 'Pink' },
                      { hex: '#06b6d4', label: 'Cyan' }
                    ].map(preset => (
                      <button
                        key={preset.hex}
                        type="button"
                        onClick={() => setNewHotspotColor(preset.hex)}
                        className="w-6 h-6 rounded-full border border-white/20 relative transition flex items-center justify-center hover:scale-110 active:scale-95"
                        style={{ backgroundColor: preset.hex }}
                        title={preset.label}
                      >
                        {newHotspotColor === preset.hex && (
                          <div className="w-2.5 h-2.5 rounded-full bg-white shadow-sm" />
                        )}
                      </button>
                    ))}
                  </div>
                  
                  {/* Custom hex input */}
                  <input
                    type="text"
                    value={newHotspotColor}
                    onChange={(e) => setNewHotspotColor(e.target.value)}
                    placeholder="#10b981"
                    className="w-20 px-2 py-1.5 text-xs rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-950 font-mono text-center focus:outline-none focus:ring-1 focus:ring-brand-green"
                  />
                </div>
              </div>

              {newHotspotType === 'link' ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-stone-700 dark:text-stone-300 font-medium mb-1.5">
                      Destination Room
                    </label>
                    <select
                      value={newHotspotTarget}
                      onChange={(e) => {
                        setNewHotspotTarget(e.target.value);
                        setNewHotspotLinkedId(''); // Reset linked door when target changes
                      }}
                      className="w-full px-3.5 py-2 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-950 text-stone-800 dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-brand-green"
                      required
                    >
                      <option value="">-- Select Destination Scene --</option>
                      {scenes
                        .filter(s => s.id !== currentScene.id)
                        .map(s => (
                          <option key={s.id} value={s.id}>
                            {s.title}
                          </option>
                        ))}
                    </select>
                  </div>
                  
                  {newHotspotTarget && (
                    <div className="p-3 bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/30 rounded-xl">
                      <label className="block text-indigo-900 dark:text-indigo-200 font-medium mb-1.5 flex justify-between items-center">
                        <span>Return Door Link (Optional)</span>
                      </label>
                      <p className="text-xs text-indigo-700/70 dark:text-indigo-300/70 mb-2">
                        Select a door in the destination room to act as the return path. 
                        Your camera will automatically land facing away from this return door when you enter the room.
                      </p>
                      <select
                        value={newHotspotLinkedId}
                        onChange={(e) => setNewHotspotLinkedId(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl border border-indigo-200 dark:border-indigo-800 bg-white dark:bg-stone-950 text-stone-800 dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-brand-green"
                      >
                        <option value="">-- No Return Door Link --</option>
                        {scenes.find(s => s.id === newHotspotTarget)?.hotspots
                          .filter(h => h.type !== 'info')
                          .map(h => (
                            <option key={h.id} value={h.id}>
                              {h.text} (Yaw: {h.yaw}°)
                            </option>
                          ))}
                      </select>
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <label className="block text-stone-700 dark:text-stone-300 font-medium mb-1.5">
                    Detailed Area Description
                  </label>
                  <textarea
                    placeholder="Enter detailed description to show when visitors click this information beacon area..."
                    value={newHotspotDescription}
                    onChange={(e) => setNewHotspotDescription(e.target.value)}
                    rows={3}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-950 text-stone-800 dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-brand-green resize-none"
                    required
                  />
                </div>
              )}

              <div className="pt-4 border-t border-stone-100 dark:border-stone-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddHotspotModal(false)}
                  className="px-4 py-2 bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 rounded-xl hover:bg-stone-200 dark:hover:bg-stone-700 transition font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={
                    !newHotspotText.trim() || 
                    (newHotspotType === 'link' ? !newHotspotTarget : !newHotspotDescription.trim())
                  }
                  className="px-4 py-2 bg-brand-green hover:bg-brand-green/90 disabled:bg-stone-200 disabled:dark:bg-stone-800 disabled:text-stone-400 text-white rounded-xl transition font-medium shadow"
                >
                  Create Hotspot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
