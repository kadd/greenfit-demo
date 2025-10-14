// backend/src/services/writeManager.js
class WriteManager {
  constructor() {
    this.writeLocks = new Map(); // filename -> lock status
    this.writeQueue = new Map(); // filename -> queue array
  }

  async acquireWriteLock(filename, operation) {
    return new Promise((resolve, reject) => {
      const lockKey = this.getLockKey(filename);
      
      if (this.writeLocks.get(lockKey)) {
        // File ist locked - in Queue einreihen
        if (!this.writeQueue.has(lockKey)) {
          this.writeQueue.set(lockKey, []);
        }
        this.writeQueue.get(lockKey).push({ operation, resolve, reject });
        return;
      }

      // Lock akquirieren
      this.writeLocks.set(lockKey, true);
      this.executeOperation(lockKey, operation, resolve, reject);
    });
  }

  async executeOperation(lockKey, operation, resolve, reject) {
    try {
      console.log(`🔒 Write lock acquired for: ${lockKey}`);
      const result = await operation();
      resolve(result);
    } catch (error) {
      reject(error);
    } finally {
      this.releaseWriteLock(lockKey);
    }
  }

  releaseWriteLock(lockKey) {
    console.log(`🔓 Write lock released for: ${lockKey}`);
    this.writeLocks.delete(lockKey);
    
    // Nächste Operation aus der Queue abarbeiten
    const queue = this.writeQueue.get(lockKey);
    if (queue && queue.length > 0) {
      const { operation, resolve, reject } = queue.shift();
      this.writeLocks.set(lockKey, true);
      this.executeOperation(lockKey, operation, resolve, reject);
    }
  }

  getLockKey(filename) {
    return filename.replace(/[\/\\]/g, '_'); // Normalize path separators
  }

  // Status-Info für Debugging
  getStatus() {
    return {
      activeLocks: Array.from(this.writeLocks.keys()),
      queueSizes: Array.from(this.writeQueue.entries()).map(([key, queue]) => ({
        file: key,
        queueSize: queue.length
      }))
    };
  }
}

// Singleton Instance
const writeManager = new WriteManager();
module.exports = writeManager;