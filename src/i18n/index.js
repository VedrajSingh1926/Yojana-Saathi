import en from './en';
import hi from './hi';
import ta from './ta';
import te from './te';
import bn from './bn';

// Create a fallback proxy so missing keys in any language automatically fall back to English
const createFallback = (langObj) => {
  return new Proxy(langObj, {
    get: function(target, prop) {
      if (prop in target) {
        return target[prop];
      }
      return en[prop]; // fallback to English
    }
  });
};

const translations = {
  en,
  hi: createFallback(hi),
  ta: createFallback(ta),
  te: createFallback(te),
  bn: createFallback(bn)
};

export default translations;
