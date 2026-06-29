import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { 
  ArrowRight, ArrowUp, ArrowDown, ArrowLeft, Plus, Trash2, Camera, Move, Settings, Check, X, 
  RotateCcw, ZoomIn, ZoomOut, Maximize2, Minimize2, Edit2, Save, 
  Image as ImageIcon, Eye, RefreshCw, ChevronRight, Compass, HelpCircle
} from 'lucide-react';
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
}

export interface Scene {
  id: string;
  title: string;
  imageUrl: string;
  isStart: boolean;
  hotspots: Hotspot[];
}

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
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [currentScene, setCurrentScene] = useState<Scene | null>(null);
  const [loading, setLoading] = useState(true);
  const [sceneLoading, setSceneLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isRoomsMenuOpen, setIsRoomsMenuOpen] = useState(false);
  
  // Camera angles (React states for coordinates indicator)
  const [cameraLon, setCameraLon] = useState(0);
  const [cameraLat, setCameraLat] = useState(0);
  const [cameraFov, setCameraFov] = useState(75);

  // Camera angles high-performance refs (to avoid recreating Three.js scene during drag)
  const cameraLonRef = useRef(0);
  const cameraLatRef = useRef(0);
  const cameraFovRef = useRef(75);

  // Hotspots render positioning
  const [projectedHotspots, setProjectedHotspots] = useState<Array<{
    hotspot: Hotspot;
    x: number;
    y: number;
    visible: boolean;
  }>>([]);

  // Modals / Creators
  const [showAddRoomModal, setShowAddRoomModal] = useState(false);
  const [newRoomTitle, setNewRoomTitle] = useState('');
  const [newRoomImageFile, setNewRoomImageFile] = useState<File | null>(null);
  const [newRoomImageUrl, setNewRoomImageUrl] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);

  const [showAddHotspotModal, setShowAddHotspotModal] = useState(false);
  const [newHotspotText, setNewHotspotText] = useState('');
  const [newHotspotTarget, setNewHotspotTarget] = useState('');
  const [newHotspotType, setNewHotspotType] = useState<'link' | 'info'>('link');
  const [newHotspotDescription, setNewHotspotDescription] = useState('');
  const [activeInfoHotspot, setActiveInfoHotspot] = useState<Hotspot | null>(null);

  // Camera target orientation refs (for smooth pan interpolation)
  const targetLonRef = useRef(0);
  const targetLatRef = useRef(0);
  const targetFovRef = useRef(75);

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
  const onPointerDownPointerXRef = useRef(0);
  const onPointerDownPointerYRef = useRef(0);
  const onPointerDownLonRef = useRef(0);
  const onPointerDownLatRef = useRef(0);

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

        setScenes(loadedScenes);
        const start = loadedScenes.find(s => s.isStart) || loadedScenes[0];
        setCurrentScene(start || null);

        // Save migrated configuration back to firestore silently if changed
        if (mutated) {
          setDoc(doc(db, 'settings', 'virtual_tour_360'), { scenes: loadedScenes }).catch(e => {
            console.warn('Silently failed to save auto-migrated 360 scene config:', e);
          });
        }
      } else {
        // Fallback to default
        setScenes(DEFAULT_SCENES);
        setCurrentScene(DEFAULT_SCENES[0]);
        // Auto-save defaults if admin
        if (isAdmin) {
          await setDoc(doc(db, 'settings', 'virtual_tour_360'), { scenes: DEFAULT_SCENES });
        }
      }
    } catch (err) {
      console.error('Failed to load virtual tour configuration from Firestore, using defaults:', err);
      setScenes(DEFAULT_SCENES);
      setCurrentScene(DEFAULT_SCENES[0]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScenes();
  }, [isAdmin]);

  // Save Config to Firestore
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

  // Switch Room with transition
  const handleSwitchRoom = (sceneId: string, hotspot?: Hotspot) => {
    const targetScene = scenes.find(s => s.id === sceneId);
    if (!targetScene) return;

    // Stage 1: Fast fly-forward/zoom transition in 3D Space
    targetFovRef.current = 20; // Zoom in extremely close to look like flying forward
    if (hotspot) {
      targetLonRef.current = hotspot.yaw;
      targetLatRef.current = hotspot.pitch;
    }

    const isPreloaded = textureCacheRef.current.has(sceneId);

    if (isPreloaded) {
      // Blazing fast continuous transition if texture is preloaded (no loader overlay needed!)
      setTimeout(() => {
        setCurrentScene(targetScene);
        // Reset view angles for the new scene, but start with an elegant cinematic wide-angle zoom back to 75
        targetLonRef.current = 0;
        targetLatRef.current = 0;
        cameraLonRef.current = 0;
        cameraLatRef.current = 0;
        
        cameraFovRef.current = 110; // Start extra wide
        targetFovRef.current = 75;  // Lerp smoothly to normal 75 fov
      }, 200);
    } else {
      // Fallback transitional cross-fade if not preloaded
      setTimeout(() => {
        setSceneLoading(true);
        
        setTimeout(() => {
          setCurrentScene(targetScene);
          targetLonRef.current = 0;
          targetLatRef.current = 0;
          cameraLonRef.current = 0;
          cameraLatRef.current = 0;
          
          cameraFovRef.current = 110;
          targetFovRef.current = 75;
          
          setSceneLoading(false);
        }, 200);
      }, 200);
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

    const newId = newRoomTitle.toLowerCase().replace(/[^a-z0-9]/g, '_') + '_' + Date.now();
    const newScene: Scene = {
      id: newId,
      title: newRoomTitle,
      imageUrl: newRoomImageUrl,
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

    // Capture the current camera angles (which are locked at center of screen)
    const newHotspot: Hotspot = {
      id: 'hs_' + Date.now(),
      pitch: Math.round(cameraLat),
      yaw: Math.round(cameraLon),
      targetSceneId: newHotspotType === 'link' ? newHotspotTarget : '',
      text: newHotspotText,
      type: newHotspotType,
      description: newHotspotType === 'info' ? newHotspotDescription : ''
    };

    const updated = scenes.map(s => {
      if (s.id === currentScene.id) {
        return {
          ...s,
          hotspots: [...s.hotspots, newHotspot]
        };
      }
      return s;
    });

    await saveScenesConfig(updated);

    // Reset Form
    setNewHotspotText('');
    setNewHotspotTarget('');
    setNewHotspotType('link');
    setNewHotspotDescription('');
    setShowAddHotspotModal(false);
  };

  // Delete Hotspot
  const handleDeleteHotspot = async (hotspotId: string) => {
    if (!currentScene) return;
    if (!confirm('Are you sure you want to delete this navigation hotspot?')) {
      return;
    }

    const updated = scenes.map(s => {
      if (s.id === currentScene.id) {
        return {
          ...s,
          hotspots: s.hotspots.filter(h => h.id !== hotspotId)
        };
      }
      return s;
    });

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

  // 1. Preload all scenes as soon as the list is ready (opening / reload)
  useEffect(() => {
    if (loading || !scenes || scenes.length === 0) return;

    textureLoaderRef.current.setCrossOrigin('anonymous');

    scenes.forEach(scene => {
      if (!scene.imageUrl) return;

      // Check if already in cache
      if (textureCacheRef.current.has(scene.id)) return;

      const loadUrl = scene.imageUrl.startsWith('http')
        ? scene.imageUrl + (scene.imageUrl.includes('?') ? '&' : '?') + 't=' + Date.now()
        : scene.imageUrl;

      textureLoaderRef.current.load(
        loadUrl,
        (texture) => {
          texture.minFilter = THREE.LinearFilter;
          texture.generateMipmaps = false;
          textureCacheRef.current.set(scene.id, texture);
          console.log(`Successfully preloaded high-res texture for: ${scene.id}`);
          
          // If the scene currently displayed is this one, update it immediately
          if (currentSceneRef.current?.id === scene.id && sphereMaterialRef.current) {
            sphereMaterialRef.current.map = texture;
            sphereMaterialRef.current.needsUpdate = true;
          }
        },
        undefined,
        (err) => {
          console.warn(`Failed preloading scene texture: ${scene.id}. Will fall back dynamically.`, err);
        }
      );
    });
  }, [loading, scenes]);

  // 2. Manage currentScene changes & progressive texture enhancement
  useEffect(() => {
    if (loading || !currentScene) return;

    // Sync ref
    currentSceneRef.current = currentScene;

    if (!sphereMaterialRef.current) return;

    // Check texture cache
    const cachedTexture = textureCacheRef.current.get(currentScene.id);

    if (cachedTexture) {
      // Instant transition! No loading screen or white flashes!
      sphereMaterialRef.current.map = cachedTexture;
      sphereMaterialRef.current.needsUpdate = true;
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    } else {
      // Progressive Enhancement: Set low-resolution/grid placeholder first, then load high-res
      const placeholder = createLowResPlaceholderTexture(currentScene.title);
      sphereMaterialRef.current.map = placeholder;
      sphereMaterialRef.current.needsUpdate = true;
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }

      const loadUrl = currentScene.imageUrl.startsWith('http')
        ? currentScene.imageUrl + (currentScene.imageUrl.includes('?') ? '&' : '?') + 't=' + Date.now()
        : currentScene.imageUrl;

      textureLoaderRef.current.setCrossOrigin('anonymous');
      textureLoaderRef.current.load(
        loadUrl,
        (loadedTexture) => {
          loadedTexture.minFilter = THREE.LinearFilter;
          loadedTexture.generateMipmaps = false;
          textureCacheRef.current.set(currentScene.id, loadedTexture);

          // Swap to high-res if user is still looking at this scene
          if (currentSceneRef.current?.id === currentScene.id && sphereMaterialRef.current) {
            sphereMaterialRef.current.map = loadedTexture;
            sphereMaterialRef.current.needsUpdate = true;
          }
        },
        undefined,
        (err) => {
          console.error(`Error loading 360 photo texture for ${currentScene.id}:`, err);
          if (currentSceneRef.current?.id === currentScene.id && sphereMaterialRef.current) {
            try {
              sphereMaterialRef.current.map = createFallbackPanoTexture();
              sphereMaterialRef.current.needsUpdate = true;
            } catch (fallbackErr) {
              console.error('Fallback texture application failed:', fallbackErr);
            }
          }
        }
      );
    }
  }, [loading, currentScene]);

  // 3. Initialize and run Three.js engine (Runs once on mount)
  useEffect(() => {
    if (loading || !mountRef.current) return;

    // Dimensions
    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(cameraFovRef.current, width / height, 1, 1100);
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
      if (activeScene && activeScene.hotspots && activeScene.hotspots.length > 0) {
        const projections = activeScene.hotspots.map(hs => {
          // Convert hotspot's pitch/yaw back to 3D point
          const hsPhi = THREE.MathUtils.degToRad(90 - hs.pitch);
          const hsTheta = THREE.MathUtils.degToRad(hs.yaw);
          
          const hsVector = new THREE.Vector3();
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

          const screenX = (vector.x * .5 + .5) * width;
          const screenY = (-(vector.y * .5) + .5) * height;

          return {
            hotspot: hs,
            x: screenX,
            y: screenY,
            visible: !isBehind && screenX >= 0 && screenX <= width && screenY >= 0 && screenY <= height
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
      // Only write to React state if user is panning to avoid infinite updates
      if (isUserInteractingRef.current) {
        setCameraLon(cameraLonRef.current);
        setCameraLat(cameraLatRef.current);
        setCameraFov(cameraFovRef.current);
      }
    }, 100);

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

  // Handle Drag & Swipe Events
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    isUserInteractingRef.current = true;
    onPointerDownPointerXRef.current = e.clientX;
    onPointerDownPointerYRef.current = e.clientY;
    onPointerDownLonRef.current = targetLonRef.current;
    onPointerDownLatRef.current = targetLatRef.current;
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isUserInteractingRef.current) return;
    
    // Calculate actual container dimensions dynamically
    const containerWidth = mountRef.current?.clientWidth || 1000;
    const containerHeight = mountRef.current?.clientHeight || 600;
    
    // Map screen pixel translation exactly to degrees of Field of View.
    // Multiplying by 2.4 provides a perfectly responsive and snappier "grabbing" feel, matching Google Earth.
    const panSpeedX = (cameraFovRef.current / containerWidth) * 2.4;
    const panSpeedY = ((cameraFovRef.current * (containerHeight / containerWidth)) / containerHeight) * 2.4;
    
    const deltaX = e.clientX - onPointerDownPointerXRef.current;
    const deltaY = e.clientY - onPointerDownPointerYRef.current;

    // Use addition for both X and Y so that content "grabs" and matches natural swipe direction perfectly
    const newLon = onPointerDownLonRef.current + deltaX * panSpeedX;
    const newLat = onPointerDownLatRef.current + deltaY * panSpeedY;

    targetLonRef.current = newLon;
    targetLatRef.current = Math.max(-85, Math.min(85, newLat));
  };

  const handlePointerUp = () => {
    isUserInteractingRef.current = false;
    setCameraLon(cameraLonRef.current);
    setCameraLat(cameraLatRef.current);
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
      <div className="w-full h-[500px] flex flex-col items-center justify-center bg-stone-900 text-stone-200 rounded-2xl border border-stone-800">
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
          isFullscreen ? 'fixed inset-0 z-[9999] rounded-none h-screen' : 'h-[600px] border-stone-200/80 dark:border-stone-800'
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
          onWheel={handleWheel}
        />

        {/* 2D Projected Navigation / Description Hotspots */}
        {projectedHotspots.map(({ hotspot, x, y, visible }) => {
          if (!visible) return null;
          const isInfo = hotspot.type === 'info';

          return (
            <div
              key={hotspot.id}
              className="absolute -translate-x-1/2 -translate-y-1/2 group z-20 flex flex-col items-center pointer-events-auto select-none"
              style={{ left: `${x}px`, top: `${y}px` }}
            >
              {isInfo ? (
                /* Information description area hotspot */
                <button
                  onClick={() => setActiveInfoHotspot(hotspot)}
                  className="flex flex-col items-center focus:outline-none group/btn"
                >
                  {/* Glowing information beacon */}
                  <div className="relative flex items-center justify-center w-8 h-8">
                    <div className="absolute w-10 h-10 rounded-full bg-amber-500/30 animate-ping" />
                    <div className="absolute w-7 h-7 rounded-full bg-amber-500/40 blur-xs animate-pulse" />
                    <div className="w-6 h-6 rounded-full bg-amber-500 border border-white flex items-center justify-center shadow-lg transition-transform duration-200 group-hover/btn:scale-125">
                      <span className="text-[11px] text-white font-serif font-black italic">i</span>
                    </div>
                  </div>
                  {/* Floating Description Label */}
                  <div className="mt-1.5 px-3 py-1 bg-stone-900/90 backdrop-blur-md border border-amber-500/35 rounded-xl text-amber-200 text-xs font-sans tracking-wide whitespace-nowrap shadow-xl flex items-center gap-1 opacity-90 group-hover/btn:opacity-100 group-hover/btn:border-amber-400 group-hover/btn:bg-amber-950/90 transition-all duration-200">
                    <HelpCircle className="w-3 h-3 text-amber-400 animate-bounce" />
                    <span>{hotspot.text}</span>
                  </div>
                </button>
              ) : (
                /* Google Earth / Street View style perspective floor arrow link hotspot */
                <button
                  onClick={() => handleSwitchRoom(hotspot.targetSceneId, hotspot)}
                  className="flex flex-col items-center focus:outline-none group/btn"
                >
                  {/* Perspective ground chevron indicator */}
                  <div className="relative w-16 h-12 flex items-center justify-center" style={{ perspective: '120px' }}>
                    {/* Perspective flat circle */}
                    <div 
                      className="w-12 h-12 bg-brand-green/80 border-2 border-white rounded-full flex items-center justify-center shadow-lg transition-all duration-300 group-hover/btn:scale-110 group-hover/btn:bg-brand-green group-hover/btn:shadow-brand-green/40"
                      style={{ transform: 'rotateX(55deg) scaleY(1.2)' }}
                    >
                      <ArrowRight className="w-5 h-5 text-white -rotate-90 animate-bounce" style={{ animationDuration: '2s' }} />
                    </div>
                    {/* Ping floor circle ripple */}
                    <div 
                      className="absolute w-16 h-16 rounded-full border border-brand-green/50 animate-ping pointer-events-none"
                      style={{ transform: 'rotateX(55deg) scaleY(1.2)' }}
                    />
                  </div>

                  {/* Text label with custom backdrop blur */}
                  <div className="mt-1 px-3.5 py-1 bg-black/85 backdrop-blur-md border border-white/20 rounded-full text-white text-xs font-sans tracking-wide whitespace-nowrap shadow-xl flex items-center gap-1 opacity-90 group-hover/btn:opacity-100 group-hover/btn:bg-brand-green group-hover/btn:border-white/40 transition-all duration-200">
                    <span>{hotspot.text}</span>
                    <ChevronRight className="w-3 h-3" />
                  </div>
                </button>
              )}

              {/* Admin Hotspot Actions */}
              {editMode && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteHotspot(hotspot.id);
                  }}
                  className="mt-2 px-2 py-0.5 bg-red-600 hover:bg-red-700 text-[10px] text-white font-sans font-medium rounded-full shadow flex items-center gap-1 transition z-30"
                >
                  <Trash2 className="w-2.5 h-2.5" />
                  <span>Delete</span>
                </button>
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

        {/* Interactive Smooth Fade Transition Overlay */}
        {sceneLoading && (
          <div className="absolute inset-0 bg-stone-950/80 backdrop-blur-md z-50 flex items-center justify-center transition-all duration-300">
            <div className="flex flex-col items-center">
              <RefreshCw className="w-8 h-8 animate-spin text-brand-green mb-3" />
              <p className="text-white text-xs font-sans tracking-widest uppercase">Stepping into room...</p>
            </div>
          </div>
        )}

        {/* Floating Top Title Bar */}
        <div className="absolute top-4 left-4 right-4 pointer-events-none flex justify-between items-start z-30">
          <div className="bg-black/60 backdrop-blur-md border border-white/10 px-4 py-2.5 rounded-xl shadow-lg pointer-events-auto max-w-[70%]">
            <span className="text-[10px] font-mono tracking-widest text-brand-green uppercase font-semibold flex items-center gap-1.5 mb-0.5">
              <Compass 
                className="w-4 h-4 text-brand-green transition-transform duration-100 ease-out" 
                style={{ transform: `rotate(${-cameraLon}deg)` }} 
              />
              <span>Live 360° Tour • Heading: {getCompassHeading(cameraLon)}</span>
            </span>
            <h3 className="text-white font-sans text-base font-semibold tracking-wide flex items-center gap-2">
              {currentScene?.title}
              {currentScene?.isStart && (
                <span className="px-1.5 py-0.5 bg-brand-green/30 text-brand-green text-[9px] uppercase tracking-wider rounded font-mono font-semibold border border-brand-green/30">
                  Starting Room
                </span>
              )}
            </h3>
          </div>

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

            {/* Help guidelines popup toggler */}
            <div className="relative group">
              <button className="p-2 bg-black/60 backdrop-blur-md border border-white/10 text-white rounded-xl hover:bg-black/80 transition shadow">
                <HelpCircle className="w-4 h-4" />
              </button>
              <div className="absolute right-0 top-12 w-64 p-4 bg-stone-900/95 backdrop-blur-md border border-stone-800 text-stone-300 text-xs rounded-xl shadow-2xl opacity-0 scale-95 pointer-events-none group-hover:opacity-100 group-hover:scale-100 group-hover:pointer-events-auto transition-all duration-200 z-50">
                <p className="font-semibold text-white mb-2 font-sans flex items-center gap-1.5">
                  <Compass className="w-4 h-4 text-brand-green" />
                  How to Navigate:
                </p>
                <ul className="space-y-1.5 list-disc list-inside font-sans">
                  <li><strong>Drag / Swipe</strong> on the photo to rotate your camera view in 360°.</li>
                  <li><strong>Click / Tap</strong> the floating arrows to move between rooms.</li>
                  <li><strong>Scroll</strong> to zoom in and out.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Info Hotspot Description Overlay */}
        {activeInfoHotspot && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-sm px-4 pointer-events-auto">
            <div className="bg-stone-950/95 backdrop-blur-md border border-amber-500/45 p-5 rounded-2xl shadow-2xl animate-in zoom-in duration-300">
              <div className="flex justify-between items-start mb-2.5">
                <h4 className="font-sans font-black text-amber-400 text-xs tracking-wider uppercase flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4 text-amber-500 animate-pulse" />
                  {activeInfoHotspot.text}
                </h4>
                <button 
                  onClick={() => setActiveInfoHotspot(null)}
                  className="p-1 hover:bg-white/10 rounded-full transition text-stone-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-stone-300 text-xs leading-relaxed font-sans">
                {activeInfoHotspot.description || "Discover more details about this area of our modern nursery school."}
              </p>
            </div>
          </div>
        )}

        {/* Floating Bottom Navigation Console (Room Selector & PlayStation D-pad Controller) */}
        <div className="absolute bottom-4 left-4 right-4 pointer-events-none flex justify-between items-end z-30">
          
          {/* Room Selector Quick Links Menu */}
          <div className="flex flex-col items-start gap-2 pointer-events-auto max-w-[65%] sm:max-w-[75%]">
            {/* Desktop View: Wide Row Selection (Visible on Large Screens) */}
            <div className="hidden lg:flex bg-black/60 backdrop-blur-md border border-white/10 p-2 rounded-xl shadow-lg gap-1.5 overflow-x-auto scrollbar-none">
              {scenes.map(s => (
                <button
                  key={s.id}
                  onClick={() => handleSwitchRoom(s.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-sans tracking-wide font-medium transition-all whitespace-nowrap ${
                    currentScene?.id === s.id
                      ? 'bg-brand-green text-white shadow'
                      : 'text-stone-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {s.title}
                </button>
              ))}
            </div>

            {/* Mobile / Tablet View: Collapsible Selector Button */}
            <div className="relative lg:hidden">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsRoomsMenuOpen(!isRoomsMenuOpen);
                }}
                className="bg-black/85 backdrop-blur-md border border-white/20 px-3.5 py-2.5 rounded-xl shadow-2xl text-white text-xs font-sans font-semibold flex items-center gap-2 hover:bg-black transition active:scale-95"
              >
                <Compass className="w-4 h-4 text-brand-green animate-pulse" />
                <span className="truncate max-w-[120px] xs:max-w-[180px]">{currentScene?.title || 'Select Classroom'}</span>
                <ChevronRight className={`w-4 h-4 text-stone-400 transition-transform duration-200 ${isRoomsMenuOpen ? 'rotate-90 text-white' : ''}`} />
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
 
          {/* PlayStation Controller Cross D-pad Console */}
          <div className="flex flex-col items-center gap-3 pointer-events-auto">
            {/* Circular D-pad body - scaled up for better touch accuracy */}
            <div className="relative w-40 h-40 bg-black/75 backdrop-blur-md rounded-full border border-white/10 shadow-2xl flex items-center justify-center select-none">
              {/* UP button */}
              <button
                onClick={() => handleKeyDown('up')}
                className="absolute top-2 left-1/2 -translate-x-1/2 w-12 h-12 rounded-t-lg bg-stone-900 border-t border-x border-white/10 active:bg-brand-green text-stone-300 hover:text-white hover:bg-stone-800 flex items-center justify-center shadow-md transition-all duration-100"
                title="Look Up"
              >
                <ArrowUp className="w-6 h-6 text-stone-300 group-hover:text-white" />
              </button>
              
              {/* LEFT button */}
              <button
                onClick={() => handleKeyDown('left')}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-12 h-12 rounded-l-lg bg-stone-900 border-l border-y border-white/10 active:bg-brand-green text-stone-300 hover:text-white hover:bg-stone-800 flex items-center justify-center shadow-md transition-all duration-100"
                title="Rotate Left"
              >
                <ArrowLeft className="w-6 h-6 text-stone-300 group-hover:text-white" />
              </button>

              {/* RIGHT button */}
              <button
                onClick={() => handleKeyDown('right')}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-12 h-12 rounded-r-lg bg-stone-900 border-r border-y border-white/10 active:bg-brand-green text-stone-300 hover:text-white hover:bg-stone-800 flex items-center justify-center shadow-md transition-all duration-100"
                title="Rotate Right"
              >
                <ArrowRight className="w-6 h-6 text-stone-300 group-hover:text-white" />
              </button>

              {/* DOWN button */}
              <button
                onClick={() => handleKeyDown('down')}
                className="absolute bottom-2 left-1/2 -translate-x-1/2 w-12 h-12 rounded-b-lg bg-stone-900 border-b border-x border-white/10 active:bg-brand-green text-stone-300 hover:text-white hover:bg-stone-800 flex items-center justify-center shadow-md transition-all duration-100"
                title="Look Down"
              >
                <ArrowDown className="w-6 h-6 text-stone-300 group-hover:text-white" />
              </button>

              {/* Central CORE button (Reset View) */}
              <button
                onClick={() => {
                  targetLonRef.current = 0;
                  targetLatRef.current = 0;
                  targetFovRef.current = 75;
                  setCameraLon(0);
                  setCameraLat(0);
                  setCameraFov(75);
                }}
                className="w-12 h-12 rounded-full bg-stone-850 hover:bg-stone-800 active:bg-brand-green border border-stone-750 flex items-center justify-center shadow-inner transition-all text-stone-400 hover:text-brand-green"
                title="Reset Camera Orientation"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
            </div>

            {/* PlayStation Action Bar: Zoom In, Zoom Out, Fullscreen - scaled up */}
            <div className="bg-black/75 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-xl shadow-lg flex items-center gap-2.5">
              <button
                onClick={() => handleKeyDown('zoomIn')}
                className="p-2 hover:bg-white/10 text-stone-300 hover:text-white rounded-lg transition"
                title="Zoom In"
              >
                <ZoomIn className="w-5.5 h-5.5" />
              </button>
              <button
                onClick={() => handleKeyDown('zoomOut')}
                className="p-2 hover:bg-white/10 text-stone-300 hover:text-white rounded-lg transition"
                title="Zoom Out"
              >
                <ZoomOut className="w-5.5 h-5.5" />
              </button>
              <div className="w-[1px] h-4 bg-white/20" />
              <button
                onClick={toggleFullscreen}
                className="p-2 hover:bg-white/10 text-stone-300 hover:text-white rounded-lg transition"
                title="Toggle Fullscreen"
              >
                {isFullscreen ? <Minimize2 className="w-5.5 h-5.5" /> : <Maximize2 className="w-5.5 h-5.5" />}
              </button>
            </div>
          </div>

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
                        <div className="space-y-0.5">
                          <p className="font-semibold text-stone-700 dark:text-stone-200">{hs.text}</p>
                          <p className="text-stone-500 font-mono text-[10px]">
                            Links to: <span className="font-sans font-medium text-brand-green">{targetName}</span> (Lat: {hs.pitch}°, Lon: {hs.yaw}°)
                          </p>
                        </div>
                        <button
                          onClick={() => handleDeleteHotspot(hs.id)}
                          className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-950/20 dark:hover:bg-red-950/40 rounded-lg transition"
                          title="Delete Hotspot"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
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
                <label className="block text-stone-700 dark:text-stone-300 font-medium mb-1.5">
                  Or use a web image URL
                </label>
                <input
                  type="url"
                  placeholder="https://example.com/panorama.jpg"
                  value={newRoomImageUrl}
                  onChange={(e) => setNewRoomImageUrl(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-950 text-stone-800 dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-brand-green"
                />
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

              {newHotspotType === 'link' ? (
                <div>
                  <label className="block text-stone-700 dark:text-stone-300 font-medium mb-1.5">
                    Destination Room
                  </label>
                  <select
                    value={newHotspotTarget}
                    onChange={(e) => setNewHotspotTarget(e.target.value)}
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
