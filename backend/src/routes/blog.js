const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

//get entire blog
router.get('/', (req, res) => {
  const blogPath = path.join(__dirname, '../data/blog.json');
  console.log("Loading Blog from:", blogPath);
  fs.readFile(blogPath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Blog konnte nicht geladen werden.' });
    }
    try {
      const blog = JSON.parse(data);
      res.json(blog);
    } catch (parseErr) {
      res.status(500).json({ error: 'Blog-Daten sind ungültig.' });
    }
  });
});

// create empty blog
router.post('/create', (req, res) => {
  const blogPath = path.join(__dirname, '../data/blog.json');
  console.log(`Creating empty blog in:`, blogPath);
  const emptyBlog = { title: "Blog", items: [] };

  // Füge eine ID und ein Erstellungsdatum hinzu
  emptyBlog.id = "blog-" + Date.now();
  emptyBlog.createdAt = new Date().toISOString();
  emptyBlog.updatedAt = emptyBlog.createdAt;

  fs.writeFile(blogPath, JSON.stringify(emptyBlog, null, 2), (writeErr) => {
    if (writeErr) {
      return res.status(500).json({ error: 'Blog konnte nicht erstellt werden.' });
    }
    res.status(201).json(emptyBlog);
  });
});

// Delete entire blog
router.delete('/', (req, res) => {
  const blogPath = path.join(__dirname, '../data/blog.json');
  console.log(`Deleting entire blog in:`, blogPath);
  fs.writeFile(blogPath, JSON.stringify({ title: "Blog", items: [] }, null, 2), (writeErr) => {
    if (writeErr) {
      return res.status(500).json({ error: 'Blog konnte nicht gelöscht werden.' });
    }
    res.json({ message: 'Blog wurde gelöscht.' });
  });
});

// Prevent concurrent writes
let isWriting = false;

// Update entire blog
router.put('/', (req, res) => {
  if (isWriting) {
    return res.status(429).json({ error: 'Bitte warte, der Blog wird gerade gespeichert.' });
  }
  isWriting = true;
  const blog = req.body;
    const updatedBlog = blog;
  const blogPath = path.join(__dirname, '../data/blog.json');
  console.log(`Updating entire blog in:`, blogPath);

  // Optional: Validierung
  if (!updatedBlog || !updatedBlog.title || !updatedBlog.items) {
    console.log("Invalid blog data:", updatedBlog);
    return res.status(400).json({ error: 'Ungültige Blog-Daten.' });
  }

  // ids für items hinzufügen, falls nicht vorhanden
  updatedBlog.items = updatedBlog.items.map((item, index) => ({
    id: item.id || (index + 1).toString(),
    ...item
  }));

  // Zeit messen
  const startTime = Date.now();
  console.log(`Start writing blog at ${new Date(startTime).toISOString()}`);

  // Aktualisiere das Blog-Datum
  updatedBlog.updatedAt = new Date().toISOString();

  fs.writeFile(blogPath, JSON.stringify(updatedBlog, null, 2), (writeErr) => {
    if (writeErr) {
      return res.status(500).json({ error: 'Blog konnte nicht gespeichert werden.' });
    }
    isWriting = false;
    res.json(updatedBlog);
  });
  const endTime = Date.now();
  console.log(`Finished writing blog at ${new Date(endTime).toISOString()}, took ${endTime - startTime}ms`);
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