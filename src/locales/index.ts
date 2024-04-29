import enUS from './en-US.json';
import esSP from './es-SP.json';

type Locale = Record<string, string>;

const projectLocales: Record<string, Locale> = {
  en: enUS,
  es: esSP,
};

export default projectLocales;
