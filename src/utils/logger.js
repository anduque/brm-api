const fs = require('fs');
const path = require('path');

const LOG_DIR = path.resolve(__dirname, '../../logs');
const LOG_FILE = path.join(LOG_DIR, 'app.log');

if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR, { recursive: true });
}

const writeLog = (level, message, meta) => {
  const timestamp = new Date().toISOString();
  const payload = {
    timestamp,
    level,
    message,
    meta
  };

  fs.appendFileSync(LOG_FILE, `${JSON.stringify(payload)}\n`, 'utf8');
};

const logger = {
  info(message, meta = {}) {
    console.log(`[INFO] ${message}`, meta);
    writeLog('info', message, meta);
  },
  warn(message, meta = {}) {
    console.warn(`[WARN] ${message}`, meta);
    writeLog('warn', message, meta);
  },
  error(message, meta = {}) {
    console.error(`[ERROR] ${message}`, meta);
    writeLog('error', message, meta);
  }
};

module.exports = logger;


