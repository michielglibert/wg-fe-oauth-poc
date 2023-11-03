import { WgOAuth } from "../authentication/WgAuthState";
import API from "./API";

export const ssoApi = new API({
  baseURL: import.meta.env.VITE_APP_SSO_HOST,
  oauthObject: WgOAuth,
});
