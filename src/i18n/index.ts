import { createI18n } from 'vue-i18n';

import projectLocales from '@/locales';

const i18nConfig = {
  legacy: false,
  locale: localStorage.getItem('locale') || 'en',
  fallbackLocale: 'en',
};

const loadI18n = (config: object) => createI18n(config);

export default loadI18n({
  ...i18nConfig,
  messages: projectLocales,
  globalInjection: true, // Injects $t in all the app templates
  legacy: false,
});
