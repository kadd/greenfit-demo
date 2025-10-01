const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

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

router.get('/:id', (req, res) => {
  const blogId = req.params.id;
  const blogPath = path.join(__dirname, '../data/blog.json');
  console.log(`Loading Blog ID ${blogId} from:`, blogPath);
  fs.readFile(blogPath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Blog konnte nicht geladen werden.' });
    }
    try {
      const blogs = JSON.parse(data);
      const blog = blogs.find(b => b.id === blogId);
      if (!blog) {
        return res.status(404).json({ error: 'Blog nicht gefunden.' });
      }
      res.json(blog);
    } catch (parseErr) {
      res.status(500).json({ error: 'Blog-Daten sind ungültig.' });
    }
  });
});

router.put('/:id', (req, res) => {
  const blogId = req.params.id;
  const updatedBlog = req.body;
  if (!updatedBlog || !updatedBlog.title || !updatedBlog.content) {
    return res.status(400).json({ error: 'Ungültige Blog-Daten.' });
  }
  const blogPath = path.join(__dirname, '../data/blog.json');
  console.log(`Updating Blog ID ${blogId} in:`, blogPath);
  fs.readFile(blogPath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Blog konnte nicht geladen werden.' });
    }
    try {
      const blogs = JSON.parse(data);
      const blogIndex = blogs.findIndex(b => b.id === blogId);
      if (blogIndex === -1) {
        return res.status(404).json({ error: 'Blog nicht gefunden.' });
      }
      blogs[blogIndex] = { ...blogs[blogIndex], ...updatedBlog };
      fs.writeFile(blogPath, JSON.stringify(blogs, null, 2), (writeErr) => {
        if (writeErr) {
          return res.status(500).json({ error: 'Blog konnte nicht gespeichert werden.' });
        }
        res.json(blogs[blogIndex]);
      });
    } catch (parseErr) {
      res.status(500).json({ error: 'Blog-Daten sind ungültig.' });
    }
  });
});

router.delete('/:id', (req, res) => {
  const blogId = req.params.id;
  const blogPath = path.join(__dirname, '../data/blog.json');
  console.log(`Deleting Blog ID ${blogId} from:`, blogPath);
  fs.readFile(blogPath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Blog konnte nicht geladen werden.' });
    }
    try {
      let blogs = JSON.parse(data);
      let items = blogs.items || [];
      console.log("Current Blogs:", blogs);
      const blogIndex = items.findIndex(b => b.id === blogId);
        console.log("Blog Index to delete:", blogIndex);
      if (blogIndex === -1) {
        return res.status(404).json({ error: 'Blog nicht gefunden.' });
      }
      items.splice(blogIndex, 1);
      fs.writeFile(blogPath, JSON.stringify(blogs, null, 2), (writeErr) => {
        if (writeErr) {
          return res.status(500).json({ error: 'Blog konnte nicht gelöscht werden.' });
        }
        res.status(204).send();
      });
    } catch (parseErr) {
      res.status(500).json({ error: 'Blog-Daten sind ungültig.' });
    }
  });
});

router.post('/add', (req, res) => {
  const newPost = req.body;
  if (!newPost || !newPost.title || !newPost.date || !newPost.excerpt) {
    return res.status(400).json({ error: 'Ungültige Blog-Post-Daten.' });
  }
  const blogPath = path.join(__dirname, '../data/blog.json');
  console.log("Adding new Blog Post to:", blogPath);
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

router.put('/', (req, res) => {
  const blog = req.body;
    const updatedBlog = blog;
  const blogPath = path.join(__dirname, '../data/blog.json');
  console.log(`Updating entire blog in:`, blogPath);

  // Optional: Validierung
  if (!updatedBlog || !updatedBlog.title || !updatedBlog.items) {
    console.log("Invalid blog data:", updatedBlog);
    return res.status(400).json({ error: 'Ungültige Blog-Daten.' });
  }

  fs.writeFile(blogPath, JSON.stringify(updatedBlog, null, 2), (writeErr) => {
    if (writeErr) {
      return res.status(500).json({ error: 'Blog konnte nicht gespeichert werden.' });
    }
    res.json(updatedBlog);
  });
});

module.exports = router;