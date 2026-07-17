import { logger } from './logger.js';

export const fetchWithTimeoutAndRetry = async (url, options = {}, retries = 2, backoff = 500, timeout = 10000) => {
  for (let i = 0; i <= retries; i++) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    try {
      logger.debug(`HTTP Request: ${options.method || 'GET'} ${url} (Attempt ${i + 1}/${retries + 1})`);
      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      });
      clearTimeout(id);
      
      if (!response.ok) {
        // We might want to retry on 5xx or specific 4xx (like 429)
        if (response.status >= 500 || response.status === 429) {
          throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
        } else {
          // Client error, don't retry
          return response;
        }
      }
      return response;
    } catch (error) {
      clearTimeout(id);
      if (i === retries) {
        logger.error(`HTTP request failed after ${retries + 1} attempts: ${url}`, error);
        throw error;
      }
      logger.warn(`HTTP request failed, retrying in ${backoff}ms... (${error.message})`);
      await new Promise(res => setTimeout(res, backoff));
      // Exponential backoff
      backoff *= 2;
    }
  }
};
