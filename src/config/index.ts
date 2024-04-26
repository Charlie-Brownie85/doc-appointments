export const apiURL: { base: string } = {
  // usually here I would import any API related data (base url's, API keys, etc) from Env. vars
  // like: import.meta.env.VITE_DOCPLANNER_BASE_API_URL,
  // but for the sake of simplicity I will hardcode the base URL here
  base: 'https://draliatest.azurewebsites.net/api/availability',
};

export default {
  apiURL,
};
