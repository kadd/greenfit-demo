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

// =============== INDIVIDUAL BLOG POST MANAGEMENT ================ //

// Get single blog post by ID
router.get('/items/:id', async (req, res) => {
  try {
    const postId = req.params.id;
    const blog = await fileOps.readJsonFile(BLOG_FILE);
    const blogPost = blog.items.find(post => post.id === postId);
    if (!blogPost) {
      return res.status(404).json({ error: 'Blog-Post nicht gefunden.' });
    }
    res.json(blogPost);
  } catch (error) {
    res.status(500).json({ 
      message: 'Fehler beim Laden des Blog-Posts',
      details: error.message 
    });
  }
});

// create new blog post
router.post('/item', async (req, res) => {
  try {
    const newPost = req.body;
    if (!newPost || !newPost.title || !newPost.date || !newPost.excerpt) {
      return res.status(400).json({ error: 'Ungültige Blog-Post-Daten.' });
    }

    const result = await fileOps.updateJsonFile(BLOG_FILE, (blog) => {
      const newPostWithMeta = {
        ...newPost,
        id: `post-${blog.items.length + 1}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      blog.items.push(newPostWithMeta);
      blog.updatedAt = new Date().toISOString();
      return blog;
    }, { backup: true, validate: true });

    // Neue Blog-Post zurückgeben
    const newPostFromResult = result.items[result.items.length - 1];
    res.status(201).json(newPostFromResult);
  } catch (error) {
    res.status(500).json({ 
      message: 'Fehler beim Hinzufügen des Blog-Posts',
      details: error.message 
    });
  }
});

// Update single blog post by ID
router.put('/items/:id', async (req, res) => {
  try {
    const postId = req.params.id;
    const updatedData = req.body;

    if( !updatedData || !updatedData.title || !updatedData.date || !updatedData.excerpt) {
      return res.status(400).json({ error: 'Ungültige Blog-Post-Daten.' });
    }

    const result = await fileOps.updateJsonFile(BLOG_FILE, (blog) => {
      const postIndex = blog.items.findIndex(p => p.id === postId);
      if (postIndex === -1) {
        throw new Error('Blog-Post nicht gefunden.');
      }
      const existingPost = blog.items[postIndex];
      const updatedPost = {
        ...existingPost,
        ...updatedData,
        id: existingPost.id, // ID beibehalten
        updatedAt: new Date().toISOString(),
      };
      blog.items[postIndex] = updatedPost;
      blog.updatedAt = new Date().toISOString();
      return blog;
    }, { backup: true, validate: true });

    const updatedPostFromResult = result.items.find(p => p.id === postId);
    res.json(updatedPostFromResult);
  } catch (error) {
    res.status(500).json({ 
      message: 'Fehler beim Aktualisieren des Blog-Posts',
      details: error.message 
    });
  }
});


// Delete single blog post by ID
router.delete('/items/:id', async (req, res) => {
  try {
    const postId = req.params.id;
    const result = await fileOps.updateJsonFile(BLOG_FILE, (blog) => {
      const postIndex = blog.items.findIndex(p => p.id === postId);
      if (postIndex === -1) {
        throw new Error('Blog-Post nicht gefunden.');
      }
      blog.items.splice(postIndex, 1);
      blog.updatedAt = new Date().toISOString();
      return blog;
    }, { backup: true, validate: true });

    res.json({ message: 'Blog-Post wurde gelöscht.', data: result });
  } catch (error) {
    if (error.message === 'Blog-Post nicht gefunden.') {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({
        error: 'Fehler beim Löschen des Blog-Posts',
        details: error.message
      });
    }
  }
});

router.post('/items/reorder', async (req, res) => {
  try {
    const { newOrder } = req.body;
    if (!Array.isArray(newOrder)) {
      return res.status(400).json({ error: 'Ungültige Reihenfolge-Daten.' });
    }

    const result = await fileOps.updateJsonFile(BLOG_FILE, (blog) => {
      const reorderedItems = [];
      newOrder.forEach(id => {
        const item = blog.items.find(post => post.id === id);
        if (item) {
          reorderedItems.push(item);
        }
      });
      blog.items = reorderedItems;
      blog.updatedAt = new Date().toISOString();
      return blog;
    }, { backup: true, validate: true });

    res.json(result);
  } catch (error) {
    res.status(500).json({
      message: 'Fehler beim Neuordnen der Blog-Posts',
      details: error.message
    });
  }
});


module.exports = router;