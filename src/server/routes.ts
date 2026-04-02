import { Express } from 'express';
import db from './db.ts';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-kidtopia';

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(process.cwd(), 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB
  }
});

export function setupRoutes(app: Express) {
  // Auth Routes
  app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    
    const user = db.prepare('SELECT * FROM users WHERE username = ? AND password = ?').get(username, password) as any;
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
    
    res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });
    
    res.json({ user: { id: user.id, username: user.username, role: user.role } });
  });

  app.post('/api/logout', (req, res) => {
    res.clearCookie('token', {
      httpOnly: true,
      secure: true,
      sameSite: 'none'
    });
    res.json({ success: true });
  });

  app.get('/api/me', (req, res) => {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      res.json({ user: decoded });
    } catch (err) {
      res.status(401).json({ error: 'Invalid token' });
    }
  });

  // Content Routes
  app.get('/api/content', (req, res) => {
    const rows = db.prepare('SELECT * FROM content').all() as any[];
    const content: Record<string, any> = {};
    rows.forEach(row => {
      content[row.lang] = JSON.parse(row.data);
    });
    res.json(content);
  });

  app.put('/api/content/:lang', (req, res) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ error: 'Not authenticated' });
    
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET) as any;
    } catch (err) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    if (decoded.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized' });
    }
    
    try {
      const { lang } = req.params;
      const data = req.body;
      
      db.prepare('UPDATE content SET data = ? WHERE lang = ?').run(JSON.stringify(data), lang);
      res.json({ success: true });
    } catch (err) {
      console.error('Database error updating content:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // File Upload Route
  app.post(['/api/upload', '/api/upload/'], (req, res) => {
    console.log(`Received POST request to /api/upload`);
    
    // Note: In a production app with Firebase Auth, you would verify the Firebase ID token here.
    // For this prototype, we allow uploads to the local directory.
    upload.single('file')(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        console.error('Multer error:', err);
        return res.status(400).json({ error: `Upload error: ${err.message}` });
      } else if (err) {
        console.error('Unknown upload error:', err);
        return res.status(500).json({ error: 'Internal server error during upload' });
      }

      if (!req.file) {
        console.error('No file uploaded');
        return res.status(400).json({ error: 'No file uploaded' });
      }

      console.log('File uploaded successfully:', req.file.filename);
      // Return the public URL of the uploaded file
      const fileUrl = `/uploads/${req.file.filename}`;
      res.json({ url: fileUrl });
    });
  });
}
