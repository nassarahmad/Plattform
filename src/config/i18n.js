const i18next = require('i18next');
const i18nextMiddleware = require('i18next-http-middleware');
const Backend = require('i18next-fs-backend');
const path = require('path');

i18next
  .use(Backend)
  .use(i18nextMiddleware.LanguageDetector)
  .init({
    fallbackLng: 'en',
    supportedLngs: ['en', 'ar'],
    defaultNS: 'common',
    ns: ['common'],
    backend: {
      loadPath: path.join(__dirname, '../locales/{{lng}}.json')
    },
    detection: {
      order: ['querystring', 'header'],
      lookupQuerystring: 'lang',
      lookupHeader: 'accept-language',
      caches: false,
      convertDetectedLanguage: (lng) => lng.startsWith('ar') ? 'ar' : 'en'
    },
    interpolation: { escapeValue: false }
  });

module.exports = i18next;