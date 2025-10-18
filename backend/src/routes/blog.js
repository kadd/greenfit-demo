const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

const fileOps = require('../services/fileOperations');
const DefaultGenerator = require('../services/defaultGenerator');

const BLOG_FILE = '../data/blog.json';

//get entire blog
router.get('/', async (req, res) => {
 try {
    const blog = await fileOps.readJsonFile(BLOG_FILE);
    res.json(blog);
 } catch (error) {
    res.status(500).json({ 
      message: 'Fehler beim Abrufen des Blogs',
      details: error.message 
    });
 }
});

// create empty blog
router.post('/create', async (req, res) => {
  try {
    const emptyBlog = { 
      title: "Blog", 
      description: "Beschreibung des Blogs", 
      items: [] 
    };

    const result = await fileOps.writeJsonFile(BLOG_FILE, emptyBlog, { 
      backup: true, 
      validate: false // Kein Validieren, da leer
    });
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ 
      message: 'Fehler beim Erstellen des Blogs',
      details: error.message 
    });
  }
});

// Delete entire blog
router.delete('/', async (req, res) => {
  try {
    const emptyBlog = { 
      title: "Blog", 
      description: "Beschreibung des Blogs", 
      items: [] 
    };
    const result = await fileOps.writeJsonFile(BLOG_FILE, emptyBlog, { 
      backup: true, 
      validate: false // Kein Validieren, da leer
    });
    res.json({ message: 'Blog wurde gelöscht.', details: result });
  } catch (error) {
    res.status(500).json({ 
      message: 'Fehler beim Löschen des Blogs',
      details: error.message 
    });
  }
  
});


// Update entire blog
router.put('/', async (req, res) => {
  try {
    const blog = req.body;

    if (!blog?.title || !Array.isArray(blog.items)) {
      return res.status(400).json({ error: 'Title und Items sind erforderlich' });
    }
    
    // Items mit IDs versehen
    blog.items = blog.items.map((item, index) => ({
      ...item,
      id: item.id || `item-${index + 1}`,
      updatedAt: item.updatedAt || new Date().toISOString(),
      createdAt: item.createdAt || new Date().toISOString(),
    }));

    // Aktualisiere das Blog-Datum
    blog.updatedAt = new Date().toISOString();

    const result = await fileOps.writeJsonFile(BLOG_FILE, blog, {
      backup: true,
      validate: true
    });
    
    res.json(result);
  } catch (error) {
    res.status(500).json({ 
      message: 'Fehler beim Aktualisieren des Blogs',
      details: error.message 
    });
  }
});

// reset blog to default template
router.post('/reset', async (req, res) => {
  try {
    const defaultBlog = DefaultGenerator.generateDefaultBlog();

    const result = await fileOps.writeJsonFile(BLOG_FILE, defaultBlog, {
      backup: true,
      validate: true
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({
      message: 'Fehler beim Zurücksetzen des Blogs',
      details: error.message
    });
  }
});

// Add new blog post
router.post('/items/add', (req, res) => {
  const newPost = req.body;
  if (!newPost || !newPost.title || !newPost.date || !newPost.excerpt) {
    return res.status(400).json({ error: 'Ungültige Blog-Post-Daten.' });
  }
  const blogPath = path.join(__dirname, '../data/blog.json');
  console.log("Adding new Blog Post to:", blogPath);

  // Füge eine ID hinzu
  newPost.id = "post-" + Date.now();

  // Füge ein Erstellungsdatum hinzu
  newPost.createdAt = new Date().toISOString();
  newPost.updatedAt = newPost.createdAt;

  fs.readFile(blogPath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Blog konnte nicht geladen werden.' });
    }
    try {
      const blog = JSON.parse(data);
      blog.items = blog.items || [];
      newPost.id = (blog.items.length + 1).toString();
      blog.items.push(newPost);
      fs.writeFile(blogPath, JSON.stringify(blog, null, 2), (writeErr) => {
        if (writeErr) {
          return res.status(500).json({ error: 'Blog konnte nicht gespeichert werden.' });
        }
        res.status(201).json(newPost);
      });
    } catch (parseErr) {
      res.status(500).json({ error: 'Blog-Daten sind ungültig.' });
    }
  });
});


// Get single blog post by ID
router.get('/items/:id', (req, res) => {
  const postId = req.params.id;
  const blogPath = path.join(__dirname, '../data/blog.json');
  console.log(`Loading Blog Post ID ${postId} from:`, blogPath);
  fs.readFile(blogPath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Blog konnte nicht geladen werden.' });
    }
    try {
      const blog = JSON.parse(data);
      const post = blog.items.find(p => p.id === postId);
      if (!post) {
        return res.status(404).json({ error: 'Blog-Post nicht gefunden.' });
      }
      res.json(post);
    } catch (parseErr) {
      res.status(500).json({ error: 'Blog-Daten sind ungültig.' });
    }
  });
});

// Delete single blog post by ID
router.delete('/items/:id', (req, res) => {
  const postId = req.params.id;
  const blogPath = path.join(__dirname, '../data/blog.json');
  console.log(`Deleting Blog Post ID ${postId} in:`, blogPath);

  fs.readFile(blogPath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Blog konnte nicht geladen werden.' });
    }
    try {
      const blog = JSON.parse(data);
      const postIndex = blog.items.findIndex(p => p.id === postId);   
      if (postIndex === -1) {
        return res.status(404).json({ error: 'Blog-Post nicht gefunden.' });
      }
      blog.items.splice(postIndex, 1);

      // Aktualisiere das Blog-Datum
      blog.updatedAt = new Date().toISOString();

      fs.writeFile(blogPath, JSON.stringify(blog, null, 2), (writeErr) => {
        if (writeErr) {
          return res.status(500).json({ error: 'Blog konnte nicht gespeichert werden.' });
        }
        res.json({ message: 'Blog-Post wurde gelöscht.' });
      });
    } catch (parseErr) {
      res.status(500).json({ error: 'Blog-Daten sind ungültig.' });
    }
  });
});

// Update single blog post by ID
router.put('/items/:id', (req, res) => {
  const postId = req.params.id;
  const updatedPost = req.body;
  const blogPath = path.join(__dirname, '../data/blog.json');
  console.log(`Updating Blog Post ID ${postId} in:`, blogPath);

  // Optional: Validierung
  if (!updatedPost || !updatedPost.title || !updatedPost.date || !updatedPost.excerpt) {
    console.log("Invalid blog post data:", updatedPost);
    return res.status(400).json({ error: 'Ungültige Blog-Post-Daten.' });
  }

  fs.readFile(blogPath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Blog konnte nicht geladen werden.' });
    }
    try {
      const blog = JSON.parse(data);
      const postIndex = blog.items.findIndex(p => p.id === postId);
      if (postIndex === -1) {
        return res.status(404).json({ error: 'Blog-Post nicht gefunden.' });
      }
      blog.items[postIndex] = { ...blog.items[postIndex], ...updatedPost };
      blog.updatedAt = new Date().toISOString();

      // Backup der aktuellen Daten vor dem Speichern
      backupData().then((backupPath) => {
        console.log("Backup erstellt unter:", backupPath);
      }).catch((err) => {
        console.error("Fehler beim Erstellen des Backups:", err);
      });

      // Speichere die aktualisierten Blog-Daten
      fs.writeFile(blogPath, JSON.stringify(blog, null, 2), (writeErr) => {
        if (writeErr) {
          return res.status(500).json({ error: 'Blog konnte nicht gespeichert werden.' });
        }
        res.json(blog.items[postIndex]);
      });
    } catch (parseErr) {
      res.status(500).json({ error: 'Blog-Daten sind ungültig.' });
    }
  });
});




module.exports = router;