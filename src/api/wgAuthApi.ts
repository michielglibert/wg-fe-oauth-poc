import API from "./API";

export const wgAuthApi = new API({
  baseURL: import.meta.env.VITE_APP_AUTH_HOST,
});
