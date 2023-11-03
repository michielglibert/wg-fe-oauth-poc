import { WgOAuth } from "../authentication/WgAuthState";
import API from "./API";

export const wgApi = new API({
  baseURL: import.meta.env.VITE_APP_WG_API_HOST,
  defaultHeaders: {
    "content-type": "application/json",
    // TODO: Adjust to `'Accept-Language': getI18nLanguageCode()`
    "Accept-Language": "nl",
    // TODO: Adjust to `'x-logrocket': logrocketUrl`
    "x-logrocket": "",
    // TODO: Adjust to `'x-app-version': manifestVersion`
    "x-app-version": "",
  },
  oauthObject: WgOAuth,
});
