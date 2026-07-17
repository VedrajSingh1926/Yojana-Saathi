export const logger = {
  info: (message, meta = {}) => {
    console.log(JSON.stringify({ timestamp: new Date().toISOString(), level: 'INFO', message, ...meta }));
  },
  error: (message, error = null, meta = {}) => {
    const errorDetails = error ? { errorMessage: error.message, stack: error.stack } : {};
    console.error(JSON.stringify({ timestamp: new Date().toISOString(), level: 'ERROR', message, ...errorDetails, ...meta }));
  },
  warn: (message, meta = {}) => {
    console.warn(JSON.stringify({ timestamp: new Date().toISOString(), level: 'WARN', message, ...meta }));
  },
  debug: (message, meta = {}) => {
    if (process.env.NODE_ENV !== 'production') {
      console.log(JSON.stringify({ timestamp: new Date().toISOString(), level: 'DEBUG', message, ...meta }));
    }
  }
};
