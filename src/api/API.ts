import OAuth from "../authentication/OAuth";

type HTTPMethods = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface Request {
  path: string;
  payload?: unknown;
  options?: RequestInit;
}

interface ErrorResponse {
  code?: number | null;
  detail?: string | null;
  domain?: string | null;
  error?: string | null;
  formatted?: string | null;
  msg?: string | null;
  rpc_code?: number | null;
}

// Inspiration by Axios: https://axios-http.com/docs/res_schema
interface Response<T> {
  data: T;
  status: number;
  statusText: string;
  headers: Headers;
  error?: ErrorResponse;
  isError: boolean;
}

interface ConstructorObject {
  baseURL: string;
  defaultHeaders?: Record<string, string>;
  oauthObject?: OAuth;
}

export const ACCESS_TOKEN_EXPIRED_EVENT_NAME = "access-token-expired";
const MAX_REFRESH_RETRIES = 3;

class API {
  baseURL: string;
  defaultHeaders?: Record<string, string>;
  oauthObject?: OAuth;
  refreshRetries: number = 0;

  constructor({ baseURL, defaultHeaders, oauthObject }: ConstructorObject) {
    this.baseURL = baseURL;
    this.defaultHeaders = defaultHeaders;
    this.oauthObject = oauthObject;
  }

  get = async <T>(
    path: string,
    options?: RequestInit
  ): Promise<Response<T>> => {
    return this.#request<T>({ path, options }, "GET");
  };

  post = async <T>(
    path: string,
    payload: unknown,
    options?: RequestInit
  ): Promise<Response<T>> => {
    return this.#request<T>({ path, payload, options }, "POST");
  };

  put = async <T>(
    path: string,
    payload: unknown,
    options?: RequestInit
  ): Promise<Response<T>> => {
    return this.#request<T>({ path, payload, options }, "PUT");
  };

  patch = async <T>(
    path: string,
    payload: unknown,
    options?: RequestInit
  ): Promise<Response<T>> => {
    return this.#request<T>({ path, payload, options }, "PATCH");
  };

  delete = async <T>(
    path: string,
    options?: RequestInit
  ): Promise<Response<T>> => {
    return this.#request<T>({ path, options }, "DELETE");
  };

  #isTokenExpired = (error: ErrorResponse) => {
    if (error.msg === "AUTHENTICATION_EXPIRED") {
      window.dispatchEvent(new Event(ACCESS_TOKEN_EXPIRED_EVENT_NAME));
      return true;
    }
    return false;
  };

  #isTokenInvalid = (error: ErrorResponse) => {
    if (error.msg === "INVALID_TOKEN" || error.msg === "NOT_AUTHENTICATED") {
      return true;
    }
    return false;
  };

  /** Refresh the token and retry this 3 times if needed */
  #refreshToken = async () => {
    if (this.oauthObject) {
      try {
        await this.oauthObject.refreshTokenGrantRequest();
        this.refreshRetries = 0;
      } catch (e) {
        this.refreshRetries++;
        if (this.refreshRetries < MAX_REFRESH_RETRIES)
          setTimeout(() => this.#refreshToken(), 1000);
        else this.refreshRetries = 0;
      }
    }
  };

  #pushToSSO = async () => {
    if (this.oauthObject) await this.oauthObject.fetchAuthorizationToken();
  };

  #request = async <T>(
    req: Request,
    method: HTTPMethods
  ): Promise<Response<T>> => {
    const request = async () => {
      const response = await fetch(this.#getRequestURL(req.path), {
        method,
        body: this.#getPayload(req.payload),
        headers: {
          "content-type": "application/json",
          ...(this.oauthObject && { Authorization: this.#getBearerToken() }),
          ...this.defaultHeaders,
          ...req.options?.headers,
        },
        ...req.options,
      });
      return this.#getResponseObject<T>(response);
    };

    let response = await request();

    if (response.isError) {
      if (this.#isTokenExpired(response.error!)) {
        await this.#refreshToken();
        response = await request();
      } else if (this.#isTokenInvalid(response.error!)) {
        // Automatically redirect back to auth server of the auth object
        this.#pushToSSO();
      }
    }

    return response;
  };

  #getBearerToken = () => {
    const accessToken = this.oauthObject?.getTokens()?.accessToken;
    return `Bearer ${accessToken}`;
  };

  #getRequestURL = (path: string) => new URL(path, this.baseURL);

  #getResponseObject = async <T>(
    res: globalThis.Response
  ): Promise<Response<T>> => {
    const data: T = await res.json();

    let response: Response<T> = {
      data,
      status: res.status,
      statusText: res.statusText,
      headers: res.headers,
      isError: res.status >= 400,
    };

    if (response.isError)
      response = {
        ...response,
        error: data as ErrorResponse,
      };

    return response;
  };

  #getPayload = (payload: unknown) =>
    payload instanceof FormData ? payload : JSON.stringify(payload);
}

export default API;
