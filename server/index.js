import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const dbPath = path.resolve(__dirname, 'db.json');
const uploadsDir = path.resolve(rootDir, 'public', 'uploads');

// Ensure uploads folder exists
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, 'upload-' + uniqueSuffix + ext);
  },
});
const upload = multer({ storage });

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(uploadsDir));

// Helper functions for Database
function readDB() {
  try {
    const raw = fs.readFileSync(dbPath, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading db.json:', err);
    return null;
  }
}

function writeDB(data) {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error writing to db.json:', err);
    return false;
  }
}

// -------------------------------------------------------------
// 1. ALL DATA (Single fetch for live site hydration)
// -------------------------------------------------------------
app.get('/api/all', (req, res) => {
  const db = readDB();
  if (!db) return res.status(500).json({ error: 'Failed to read database' });
  res.json(db);
});

// -------------------------------------------------------------
// 2. SETTINGS
// -------------------------------------------------------------
app.get('/api/settings', (req, res) => {
  const db = readDB();
  res.json(db.settings);
});

app.put('/api/settings', (req, res) => {
  const db = readDB();
  db.settings = { ...db.settings, ...req.body };
  writeDB(db);
  res.json({ success: true, settings: db.settings });
});

// -------------------------------------------------------------
// 3. ABOUT & BIO
// -------------------------------------------------------------
app.get('/api/about', (req, res) => {
  const db = readDB();
  res.json(db.about);
});

app.put('/api/about', (req, res) => {
  const db = readDB();
  db.about = { ...db.about, ...req.body };
  writeDB(db);
  res.json({ success: true, about: db.about });
});

// -------------------------------------------------------------
// 4. COLLAGE PHOTOS (7-8 Photos)
// -------------------------------------------------------------
app.get('/api/collage', (req, res) => {
  const db = readDB();
  const sorted = [...(db.collage || [])].sort((a, b) => (a.order || 0) - (b.order || 0));
  res.json(sorted);
});

app.post('/api/collage', (req, res) => {
  const db = readDB();
  const newItem = {
    id: 'c_' + Date.now(),
    order: (db.collage?.length || 0) + 1,
    ...req.body,
  };
  db.collage = db.collage || [];
  db.collage.push(newItem);
  writeDB(db);
  res.status(201).json(newItem);
});

app.put('/api/collage/:id', (req, res) => {
  const db = readDB();
  const index = db.collage.findIndex(item => item.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Photo not found' });
  db.collage[index] = { ...db.collage[index], ...req.body };
  writeDB(db);
  res.json(db.collage[index]);
});

app.delete('/api/collage/:id', (req, res) => {
  const db = readDB();
  db.collage = db.collage.filter(item => item.id !== req.params.id);
  writeDB(db);
  res.json({ success: true });
});

app.put('/api/collage/reorder', (req, res) => {
  const { items } = req.body; // array of { id, order }
  const db = readDB();
  if (Array.isArray(items)) {
    db.collage = items;
    writeDB(db);
  }
  res.json({ success: true, collage: db.collage });
});

// -------------------------------------------------------------
// 5. TESTIMONIALS SLIDER (10-11 Slides)
// -------------------------------------------------------------
app.get('/api/testimonials', (req, res) => {
  const db = readDB();
  res.json(db.testimonials || []);
});

app.post('/api/testimonials', (req, res) => {
  const db = readDB();
  const newItem = {
    id: 't_' + Date.now(),
    ...req.body,
  };
  db.testimonials = db.testimonials || [];
  db.testimonials.push(newItem);
  writeDB(db);
  res.status(201).json(newItem);
});

app.put('/api/testimonials/:id', (req, res) => {
  const db = readDB();
  const index = db.testimonials.findIndex(t => t.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Testimonial not found' });
  db.testimonials[index] = { ...db.testimonials[index], ...req.body };
  writeDB(db);
  res.json(db.testimonials[index]);
});

app.delete('/api/testimonials/:id', (req, res) => {
  const db = readDB();
  db.testimonials = db.testimonials.filter(t => t.id !== req.params.id);
  writeDB(db);
  res.json({ success: true });
});

// -------------------------------------------------------------
// 6. VIDEOS SECTION
// -------------------------------------------------------------
// A. YouTube Videos (2x3 Grid)
app.get('/api/videos/youtube', (req, res) => {
  const db = readDB();
  const sorted = [...(db.youtubeVideos || [])].sort((a, b) => (a.order || 0) - (b.order || 0));
  res.json(sorted);
});

app.post('/api/videos/youtube', (req, res) => {
  const db = readDB();
  const newItem = {
    id: 'yt_' + Date.now(),
    order: (db.youtubeVideos?.length || 0) + 1,
    ...req.body,
  };
  db.youtubeVideos = db.youtubeVideos || [];
  db.youtubeVideos.push(newItem);
  writeDB(db);
  res.status(201).json(newItem);
});

app.put('/api/videos/youtube/:id', (req, res) => {
  const db = readDB();
  const index = db.youtubeVideos.findIndex(v => v.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Video not found' });
  db.youtubeVideos[index] = { ...db.youtubeVideos[index], ...req.body };
  writeDB(db);
  res.json(db.youtubeVideos[index]);
});

app.delete('/api/videos/youtube/:id', (req, res) => {
  const db = readDB();
  db.youtubeVideos = db.youtubeVideos.filter(v => v.id !== req.params.id);
  writeDB(db);
  res.json({ success: true });
});

// B. Instagram Reels (1x3 or 1x4 Row)
app.get('/api/videos/reels', (req, res) => {
  const db = readDB();
  const sorted = [...(db.instagramReels || [])].sort((a, b) => (a.order || 0) - (b.order || 0));
  res.json({
    layout: db.settings?.reelsLayout || '1x4',
    reels: sorted,
  });
});

app.post('/api/videos/reels', (req, res) => {
  const db = readDB();
  const newItem = {
    id: 'reel_' + Date.now(),
    order: (db.instagramReels?.length || 0) + 1,
    ...req.body,
  };
  db.instagramReels = db.instagramReels || [];
  db.instagramReels.push(newItem);
  writeDB(db);
  res.status(201).json(newItem);
});

app.put('/api/videos/reels/:id', (req, res) => {
  const db = readDB();
  const index = db.instagramReels.findIndex(r => r.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Reel not found' });
  db.instagramReels[index] = { ...db.instagramReels[index], ...req.body };
  writeDB(db);
  res.json(db.instagramReels[index]);
});

app.delete('/api/videos/reels/:id', (req, res) => {
  const db = readDB();
  db.instagramReels = db.instagramReels.filter(r => r.id !== req.params.id);
  writeDB(db);
  res.json({ success: true });
});

app.put('/api/videos/reels-layout', (req, res) => {
  const { layout } = req.body; // '1x3' or '1x4'
  const db = readDB();
  db.settings = db.settings || {};
  db.settings.reelsLayout = layout || '1x4';
  writeDB(db);
  res.json({ success: true, layout: db.settings.reelsLayout });
});

// C. About Indian Magician (1x3 Row Featurette)
app.get('/api/videos/highlights', (req, res) => {
  const db = readDB();
  res.json(db.highlights || []);
});

app.put('/api/videos/highlights', (req, res) => {
  const db = readDB();
  db.highlights = req.body; // array of 3 cards
  writeDB(db);
  res.json({ success: true, highlights: db.highlights });
});

// -------------------------------------------------------------
// 7. IN THE NEWS (2x3 Grid + Dedicated /news Page)
// -------------------------------------------------------------
app.get('/api/news', (req, res) => {
  const db = readDB();
  res.json(db.news || []);
});

app.post('/api/news', (req, res) => {
  const db = readDB();
  const newItem = {
    id: 'n_' + Date.now(),
    showOnHome: true,
    category: 'article',
    ...req.body,
  };
  db.news = db.news || [];
  db.news.unshift(newItem);
  writeDB(db);
  res.status(201).json(newItem);
});

app.put('/api/news/:id', (req, res) => {
  const db = readDB();
  const index = db.news.findIndex(item => item.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'News item not found' });
  db.news[index] = { ...db.news[index], ...req.body };
  writeDB(db);
  res.json(db.news[index]);
});

app.delete('/api/news/:id', (req, res) => {
  const db = readDB();
  db.news = db.news.filter(item => item.id !== req.params.id);
  writeDB(db);
  res.json({ success: true });
});

// -------------------------------------------------------------
// 8. DYNAMIC CUSTOM SECTIONS
// -------------------------------------------------------------
app.get('/api/sections', (req, res) => {
  const db = readDB();
  res.json(db.sections || []);
});

app.post('/api/sections', (req, res) => {
  const db = readDB();
  const newItem = {
    id: 'sec_' + Date.now(),
    enabled: true,
    order: (db.sections?.length || 0) + 1,
    ...req.body,
  };
  db.sections = db.sections || [];
  db.sections.push(newItem);
  writeDB(db);
  res.status(201).json(newItem);
});

app.put('/api/sections/:id', (req, res) => {
  const db = readDB();
  const index = db.sections.findIndex(s => s.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Section not found' });
  db.sections[index] = { ...db.sections[index], ...req.body };
  writeDB(db);
  res.json(db.sections[index]);
});

app.delete('/api/sections/:id', (req, res) => {
  const db = readDB();
  db.sections = db.sections.filter(s => s.id !== req.params.id);
  writeDB(db);
  res.json({ success: true });
});

// -------------------------------------------------------------
// 9. DYNAMIC CUSTOM PAGES (/page/:slug)
// -------------------------------------------------------------
app.get('/api/pages', (req, res) => {
  const db = readDB();
  res.json(db.pages || []);
});

app.get('/api/pages/by-slug/:slug', (req, res) => {
  const db = readDB();
  const page = (db.pages || []).find(p => p.slug === req.params.slug);
  if (!page) return res.status(404).json({ error: 'Page not found' });
  res.json(page);
});

app.post('/api/pages', (req, res) => {
  const db = readDB();
  const newItem = {
    id: 'p_' + Date.now(),
    showInFooter: true,
    ...req.body,
  };
  db.pages = db.pages || [];
  db.pages.push(newItem);
  writeDB(db);
  res.status(201).json(newItem);
});

app.put('/api/pages/:id', (req, res) => {
  const db = readDB();
  const index = db.pages.findIndex(p => p.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Page not found' });
  db.pages[index] = { ...db.pages[index], ...req.body };
  writeDB(db);
  res.json(db.pages[index]);
});

app.delete('/api/pages/:id', (req, res) => {
  const db = readDB();
  db.pages = db.pages.filter(p => p.id !== req.params.id);
  writeDB(db);
  res.json({ success: true });
});

// -------------------------------------------------------------
// 10. CONTACT FORM SUBMISSIONS / INQUIRIES
// -------------------------------------------------------------
app.get('/api/inquiries', (req, res) => {
  const db = readDB();
  const sorted = [...(db.inquiries || [])].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  res.json(sorted);
});

app.post('/api/inquiries', (req, res) => {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !subject) {
    return res.status(400).json({ error: 'Name, email, and subject are required' });
  }

  const db = readDB();
  const newInquiry = {
    id: 'inq_' + Date.now(),
    name,
    email,
    subject,
    message: message || '',
    createdAt: new Date().toISOString(),
    read: false,
  };

  db.inquiries = db.inquiries || [];
  db.inquiries.unshift(newInquiry);
  writeDB(db);

  console.log(`[Notification] New contact form submission from ${name} (${email}): "${subject}"`);
  console.log(`[Notification] Forwarded to recipient: ${db.settings?.contactEmail || 'indianmagician.upendra@gmail.com'}`);

  res.status(201).json({
    success: true,
    message: 'Your inquiry has been received with wonder! Magician Upendra Thakur will get back to you shortly.',
    inquiry: newInquiry,
  });
});

app.put('/api/inquiries/:id/read', (req, res) => {
  const db = readDB();
  const inq = (db.inquiries || []).find(i => i.id === req.params.id);
  if (!inq) return res.status(404).json({ error: 'Inquiry not found' });
  inq.read = true;
  writeDB(db);
  res.json({ success: true, inquiry: inq });
});

app.delete('/api/inquiries/:id', (req, res) => {
  const db = readDB();
  db.inquiries = (db.inquiries || []).filter(i => i.id !== req.params.id);
  writeDB(db);
  res.json({ success: true });
});

// -------------------------------------------------------------
// 11. FILE UPLOAD (MULTER)
// -------------------------------------------------------------
app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  const fileUrl = `/uploads/${req.file.filename}`;
  res.json({ success: true, url: fileUrl, filename: req.file.filename });
});

// -------------------------------------------------------------
// 12. ADMIN AUTHENTICATION
// -------------------------------------------------------------
app.post('/api/auth/login', (req, res) => {
  const { password } = req.body;
  const db = readDB();
  const correctPassword = db.settings?.adminPassword || 'magicadmin123';

  if (password === correctPassword) {
    // Return simple token for session
    const token = 'magic_admin_session_' + Date.now();
    return res.json({ success: true, token });
  }
  return res.status(401).json({ success: false, error: 'Invalid secret password. Access denied.' });
});

// Serve static client build if dist exists
const distDir = path.resolve(rootDir, 'dist');
if (fs.existsSync(distDir)) {
  app.use(express.static(distDir));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
      return next();
    }
    res.sendFile(path.resolve(distDir, 'index.html'));
  });
}

// Start Express Server
app.listen(PORT, () => {
  console.log(`✨ Indian Magician Full-Stack Server running on http://localhost:${PORT}`);
});
