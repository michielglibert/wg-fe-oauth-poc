import * as oauth from "@panva/oauth4webapi";

interface OAuthProps {
  clientId?: string;
  SSOHost?: string;
  redirectUri?: string;
  scopes?: string[];
}

interface OAuthTokens {
  accessToken: string;
  refreshToken?: string;
  idToken?: string;
}

interface FetchAuthorizationTokenProps {
  redirectUri?: string;
  brokerId?: string;
  loginToken?: string;
}

const LOCAL_STORAGE_OAUTH_OBJECT_KEY = "wg-oauth-object";
const LOCAL_STORAGE_OAUTH_TOKENS_KEY = "wg-oauth-tokens";
const AS_ERROR_MESSAGE =
  "OAuth was not initialized yet. Please call the init() method of the OAuth object.";
const NO_STATE_ERROR_MESSAGE =
  "No OAuth state found in local storage, user might not be returning from auth server.";

export const LOCAL_STORAGE_OAUTH_EVENT_NAME = "oauth-storage";

class OAuth {
  authorizationServer?: oauth.AuthorizationServer;
  client: oauth.Client;
  redirectUri: string;
  scopes: string[];
  randomState?: string;
  randomCodeVerifier?: string;
  #issuer: URL;
  #codeChallengeMethod: string = "S256";
  #responseType: string = "code";

  constructor(props?: OAuthProps) {
    const { clientId, SSOHost, redirectUri, scopes } = props || {};
    this.client = {
      client_id: clientId ?? import.meta.env.VITE_APP_SSO_CLIENT_ID,
      token_endpoint_auth_method: "none",
    };
    this.#issuer = new URL(SSOHost ?? import.meta.env.VITE_APP_SSO_HOST);
    this.redirectUri = redirectUri ?? import.meta.env.VITE_APP_SSO_REDIRECT_URI;
    this.scopes = scopes ?? ["offline", "openid", "api"];
  }

  // Public functions
  init = async () => {
    if (this.authorizationServer)
      throw new Error(
        "Init was called multiple times for the OAuth instance. Do not call the instance multiple times as this is a no-op."
      );

    this.authorizationServer = await oauth
      .discoveryRequest(this.#issuer, { algorithm: "oidc" })
      .then((response) =>
        oauth.processDiscoveryResponse(this.#issuer, response)
      );
    return this;
  };

  fetchAuthorizationToken = async ({
    redirectUri,
    brokerId,
    loginToken,
  }: FetchAuthorizationTokenProps = {}) => {
    if (!this.authorizationServer) throw new Error(AS_ERROR_MESSAGE);

    const code_verifier = this.#getRandomCodeVerifier();
    const code_challenge = await oauth.calculatePKCECodeChallenge(
      code_verifier
    );

    const authorizationUrl = new URL(
      this.authorizationServer.authorization_endpoint!
    );
    authorizationUrl.searchParams.set("client_id", this.client.client_id);
    authorizationUrl.searchParams.set("code_challenge", code_challenge);
    authorizationUrl.searchParams.set(
      "code_challenge_method",
      this.#codeChallengeMethod
    );
    authorizationUrl.searchParams.set("redirect_uri", this.redirectUri);
    authorizationUrl.searchParams.set("response_type", this.#responseType);
    authorizationUrl.searchParams.set("scope", this.scopes.join(" "));
    authorizationUrl.searchParams.set(
      "state",
      this.#getRandomState(redirectUri)
    );

    const idToken = this.getTokens()?.idToken;

    if (loginToken) {
      authorizationUrl.searchParams.set("login_token", loginToken);
    } else if (brokerId && idToken) {
      authorizationUrl.searchParams.set("broker_id", brokerId);
      authorizationUrl.searchParams.set("id_token", idToken);
      authorizationUrl.searchParams.set("action", "CHANGE_BROKER");
    }

    this.#persistOAuthObject();

    window.location.assign(authorizationUrl);
  };

  authorizationCodeGrantRequest = async () => {
    if (!this.authorizationServer) throw new Error(AS_ERROR_MESSAGE);

    const hasFoundOAuthState = this.#loadOAuthObject();

    if (!hasFoundOAuthState) {
      throw new Error(NO_STATE_ERROR_MESSAGE);
    }

    const currentUrl: URL = this.#getCurrentURL();
    const parameters = oauth.validateAuthResponse(
      this.authorizationServer,
      this.client,
      currentUrl,
      this.randomState!
    );
    if (oauth.isOAuth2Error(parameters)) {
      console.log("error", parameters);
      throw new Error(); // Handle OAuth 2.0 redirect error
    }

    const response = await oauth.authorizationCodeGrantRequest(
      this.authorizationServer,
      this.client,
      parameters,
      this.redirectUri,
      this.randomCodeVerifier!
    );

    this.#parseWwwAuthenticateChallenges(response);

    const result = await oauth.processAuthorizationCodeOpenIDResponse(
      this.authorizationServer,
      this.client,
      response
    );
    if (oauth.isOAuth2Error(result)) {
      console.log("error", result);
      throw new Error(); // Handle OAuth 2.0 response body error
    }

    this.#setTokens({
      accessToken: result.access_token,
      refreshToken: result.refresh_token,
      idToken: result.id_token,
    });

    let pathname;
    const stateParam = parameters.get("state");
    if (stateParam) {
      // State is formatted like XXX:pathname
      pathname = stateParam.split(":")[1];
    }

    window.location.replace(this.#getCurrentPathWithHost(pathname));
  };

  refreshTokenGrantRequest = async () => {
    if (!this.authorizationServer) throw new Error(AS_ERROR_MESSAGE);

    const tokens = this.getTokens();

    if (tokens?.refreshToken) {
      const response = await oauth.refreshTokenGrantRequest(
        this.authorizationServer,
        this.client,
        tokens.refreshToken
      );

      this.#parseWwwAuthenticateChallenges(response);

      const result = await oauth.processRefreshTokenResponse(
        this.authorizationServer,
        this.client,
        response
      );
      if (oauth.isOAuth2Error(result)) {
        console.log("error", result);
        throw new Error(); // Handle OAuth 2.0 response body error
      }

      this.#setTokens({
        accessToken: result.access_token,
        refreshToken: result.refresh_token,
        idToken: result.id_token,
      });
    }
  };

  revocationRequest = async () => {
    if (!this.authorizationServer) throw new Error(AS_ERROR_MESSAGE);

    const tokens = this.getTokens();

    if (tokens?.accessToken) {
      const response = await oauth.revocationRequest(
        this.authorizationServer,
        this.client,
        tokens.accessToken
      );

      this.#parseWwwAuthenticateChallenges(response);

      const result = await oauth.processRevocationResponse(response);
      if (oauth.isOAuth2Error(result)) {
        console.log("error", result);
        throw new Error(); // Handle OAuth 2.0 response body error
      }

      this.#clearTokens();
    }
  };

  getTokens = (): OAuthTokens | undefined => {
    const storageItem = localStorage.getItem(LOCAL_STORAGE_OAUTH_TOKENS_KEY);
    if (storageItem) return JSON.parse(storageItem);
  };

  getIsAuthorized = (): boolean => !!this.getTokens()?.accessToken;

  setSocialLoginToken = (token: string) =>
    this.#setTokens({ accessToken: token });

  // Private functions
  #parseWwwAuthenticateChallenges = (response: Response) => {
    let challenges: oauth.WWWAuthenticateChallenge[] | undefined;
    if ((challenges = oauth.parseWwwAuthenticateChallenges(response))) {
      for (const challenge of challenges) {
        console.log("challenge", challenge);
      }
      throw new Error(); // Handle www-authenticate challenges as needed
    }
  };

  #persistOAuthObject = () => {
    localStorage.setItem(LOCAL_STORAGE_OAUTH_OBJECT_KEY, JSON.stringify(this));
  };

  #loadOAuthObject = () => {
    const storageItem = localStorage.getItem(LOCAL_STORAGE_OAUTH_OBJECT_KEY);
    if (storageItem) {
      const oAuthObject: OAuth = JSON.parse(storageItem);

      if (oAuthObject) {
        this.randomState = oAuthObject.randomState;
        this.randomCodeVerifier = oAuthObject.randomCodeVerifier;

        localStorage.removeItem(LOCAL_STORAGE_OAUTH_OBJECT_KEY);
        return true;
      }
    }
    return false;
  };

  /** Gets the random state and includes the pathname */
  #getRandomState = (redirectUri?: string) => {
    const state = oauth.generateRandomState();
    this.randomState = `${state}:${redirectUri || window.location.pathname}`;
    return this.randomState;
  };

  #getRandomCodeVerifier = () => {
    const codeVerifier = oauth.generateRandomCodeVerifier();
    this.randomCodeVerifier = codeVerifier;
    return codeVerifier;
  };

  #getCurrentURL = () => {
    return new URL(window.location.href);
  };

  #getCurrentPathWithHost = (pathname?: string) => {
    return new URL(
      `${window.location.origin}${pathname || window.location.pathname}`
    );
  };

  #setTokens = ({ accessToken, refreshToken, idToken }: OAuthTokens) => {
    localStorage.setItem(
      LOCAL_STORAGE_OAUTH_TOKENS_KEY,
      JSON.stringify({
        accessToken,
        refreshToken,
        idToken,
      })
    );
    window.dispatchEvent(new Event(LOCAL_STORAGE_OAUTH_EVENT_NAME));
  };

  #clearTokens = () => {
    localStorage.removeItem(LOCAL_STORAGE_OAUTH_TOKENS_KEY);
    window.dispatchEvent(new Event(LOCAL_STORAGE_OAUTH_EVENT_NAME));
  };
}

export default OAuth;
