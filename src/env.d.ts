/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_SSO_CLIENT_ID: string;
  readonly VITE_APP_SSO_HOST: string;
  readonly VITE_APP_SSO_REDIRECT_URI: string;
  readonly VITE_APP_AUTH_HOST: string;
  readonly VITE_APP_WG_API_HOST: string;
  readonly VITE_APP_INVISIBLE_CAPTCHA_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
