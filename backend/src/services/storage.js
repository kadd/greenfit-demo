const { Storage } = require("@google-cloud/storage");
const path = require("path");
const fs = require("fs");

// GCS Schlüsseldatei prüfen
const keyPath = path.join(__dirname, "../../gcs-key.json");
if (!fs.existsSync(keyPath)) {
  console.error("GCS Schlüsseldatei fehlt! Bitte gcs-key.json im backend-Ordner ablegen.");
  process.exit(1);
}

// Storage global initialisieren
const storage = new Storage({
  keyFilename: process.env.GCP_KEYFILE_PATH || keyPath,
  projectId: process.env.GCP_PROJECT_ID || "greenfit-demo",
});

const bucketName = process.env.GCP_BUCKET_NAME || "greenfit-demo-uploads";
if (!bucketName) {
  console.error("GCP_BUCKET_NAME Umgebungsvariable nicht gesetzt!");
  process.exit(1);
}

const bucket = storage.bucket(bucketName);

// Exported functions
const getStorage = () => storage;
const getBucket = () => bucket;
const getBucketName = () => bucketName;
const handleGCSError = (err, res, operation = "GCS Operation") => {
  console.error(`${operation} Fehler:`, err);
  return res.status(500).json({ 
    success: false, 
    message: `Fehler bei ${operation}` 
  });
};

module.exports = {
  storage,
  bucket,
  bucketName,
  handleGCSError
};