exports.getGalleryImages = (req, res) => {
  const content = JSON.parse(fs.readFileSync(contentPath, 'utf8'));
  res.json(content.gallery?.images || []);
};

exports.addGalleryImage = (req, res) => {
  const { url, caption } = req.body;
  const content = JSON.parse(fs.readFileSync(contentPath, 'utf8'));
  if (!content.gallery) content.gallery = { title: 'Impressionen', images: [] };
  content.gallery.images.push({ url, caption });
  fs.writeFileSync(contentPath, JSON.stringify(content, null, 2), 'utf8');
  res.json({ success: true, message: 'Bild hinzugefügt', images: content.gallery.images });
}