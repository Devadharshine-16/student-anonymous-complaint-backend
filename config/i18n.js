import i18n from "i18n";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure i18n
i18n.configure({
  locales: ['en', 'es', 'fr', 'de', 'hi', 'ar'],
  defaultLocale: 'en',
  directory: path.join(__dirname, '../locales'),
  objectNotation: true,
  updateFiles: false,
  syncFiles: false,
  api: {
    '__': 't',
    '__n': 'tn'
  },
  register: global
});

// Middleware to detect language from request
export const detectLanguage = (req, res, next) => {
  let locale = 'en';
  
  // Priority order: query param > header > default
  if (req.query.lang && ['en', 'es', 'fr', 'de', 'hi', 'ar'].includes(req.query.lang)) {
    locale = req.query.lang;
  } else if (req.headers['accept-language']) {
    const acceptedLanguages = req.headers['accept-language'].split(',');
    for (let lang of acceptedLanguages) {
      const langCode = lang.split('-')[0].toLowerCase();
      if (['en', 'es', 'fr', 'de', 'hi', 'ar'].includes(langCode)) {
        locale = langCode;
        break;
      }
    }
  }
  
  req.setLocale(locale);
  res.locals.locale = locale;
  next();
};

// Helper function to get translated message
export const getMessage = (key, locale = 'en', params = {}) => {
  const i18nInstance = global.i18n || { t: (key) => key };
  return i18nInstance.t(key, params);
};

export default { detectLanguage, getMessage, i18n };
