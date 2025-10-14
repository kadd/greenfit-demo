const fs = require("fs");
const path = require("path");

const dataDir = path.join(__dirname, "../data");
const backupDir = path.join(__dirname, "../backup");

console.log("Data Directory:", dataDir);
console.log("Backup Directory:", backupDir);
console.log("Data Dir exists:", fs.existsSync(dataDir));
console.log("Backup Dir exists:", fs.existsSync(backupDir));

// Ensure backup directory exists
if (!fs.existsSync(backupDir)) {
    console.log("Creating backup directory...");
    fs.mkdirSync(backupDir, { recursive: true });
}

function backupData() {
    console.log("Starting backup process...");
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const backupPath = path.join(backupDir, `data-backup-${timestamp}.zip`);
    
    console.log("Backup path:", backupPath);

    // Überprüfe ob archiver verfügbar ist
    let archiver;
    try {
        archiver = require("archiver");
        console.log("Archiver loaded successfully");
    } catch (error) {
        console.error("Archiver not found:", error.message);
        return Promise.reject(new Error("Archiver package nicht installiert"));
    }

    if (!fs.existsSync(dataDir)) {
        console.error("Data directory does not exist:", dataDir);
        return Promise.reject(new Error("Datenverzeichnis existiert nicht"));
    }

    // Liste Dateien im data Directory
    try {
        const dataFiles = fs.readdirSync(dataDir);
        console.log("Files in data directory:", dataFiles);
        if (dataFiles.length === 0) {
            console.warn("No files found in data directory");
        }
    } catch (error) {
        console.error("Error reading data directory:", error);
        return Promise.reject(error);
    }

    // Backup cleanup logic
    try {
        console.log("Starting backup cleanup...");
        
        if (!fs.existsSync(backupDir)) {
            console.log("Backup directory doesn't exist, skipping cleanup");
        } else {
            const files = fs.readdirSync(backupDir);
            console.log("Existing backup files:", files);
            
            const now = Date.now();
            files.forEach(file => {
                const filePath = path.join(backupDir, file);
                try {
                    const stats = fs.statSync(filePath);
                    const ageInDays = (now - stats.mtimeMs) / (1000 * 60 * 60 * 24);
                    console.log(`File ${file}: age ${ageInDays.toFixed(1)} days`);
                    
                    if (ageInDays > 30) {
                        console.log(`Deleting old file: ${file}`);
                        fs.unlinkSync(filePath);
                    }
                } catch (error) {
                    console.error(`Error processing file ${file}:`, error.message);
                }
            });

            const remainingFiles = fs.readdirSync(backupDir);
            console.log("Remaining files after age cleanup:", remainingFiles);
            
            if (remainingFiles.length > 5) {
                console.log("Too many backups, cleaning up...");
                const sortedFiles = remainingFiles
                    .filter(file => file.endsWith('.zip'))
                    .map(file => {
                        const filePath = path.join(backupDir, file);
                        const stats = fs.statSync(filePath);
                        return { file, time: stats.mtimeMs };
                    })
                    .sort((a, b) => a.time - b.time);
                    
                const filesToDelete = sortedFiles.slice(0, remainingFiles.length - 5);
                console.log("Files to delete:", filesToDelete.map(f => f.file));
                
                filesToDelete.forEach(({ file }) => {
                    const filePath = path.join(backupDir, file);
                    try {
                        fs.unlinkSync(filePath);
                        console.log(`Deleted: ${file}`);
                    } catch (error) {
                        console.error(`Error deleting ${file}:`, error.message);
                    }
                });
            }
        }
    } catch (error) {
        console.error("Error during backup cleanup:", error);
        // Nicht abbrechen, weiter mit Backup
    }

    console.log("Creating new backup...");
    
    const output = fs.createWriteStream(backupPath);
    const archive = archiver("zip", { zlib: { level: 9 } });

    return new Promise((resolve, reject) => {
        output.on("close", () => {
            console.log(`Backup created successfully: ${backupPath}`);
            console.log(`Backup size: ${archive.pointer()} bytes`);
            resolve(backupPath);
        });
        
        output.on("error", (err) => {
            console.error("Output stream error:", err);
            reject(err);
        });
        
        archive.on("error", (err) => {
            console.error("Archive error:", err);
            reject(err);
        });

        archive.on("warning", (err) => {
            console.warn("Archive warning:", err);
        });

        console.log("Piping archive to output...");
        archive.pipe(output);
        
        console.log("Adding directory to archive...");
        archive.directory(dataDir, false);
        
        console.log("Finalizing archive...");
        archive.finalize();
    });
}

module.exports = { backupData };