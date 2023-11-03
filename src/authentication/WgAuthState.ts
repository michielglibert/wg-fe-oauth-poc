import { parseJwt } from "../utils/jwt";
import OAuth from "./OAuth";

export const WgOAuth = await new OAuth().init();

export const login = async (redirectUri?: string) => {
  await WgOAuth.fetchAuthorizationToken({ redirectUri });
};

export const authenticateByLoginToken = async (loginToken: string) => {
  await WgOAuth.fetchAuthorizationToken({ loginToken });
};

export const changeDistributionByBrokerId = async (brokerId: string) => {
  await WgOAuth.fetchAuthorizationToken({ brokerId });
};

export const onUserReceivedAuthorizationToken = async () => {
  await WgOAuth.authorizationCodeGrantRequest();
};

export const refreshToken = async () => {
  await WgOAuth.refreshTokenGrantRequest();
};

export const logout = async () => {
  await WgOAuth.revocationRequest();
};

export const getJwtToken = () => {
  const accessToken = WgOAuth.getTokens()?.accessToken;
  return accessToken ? parseJwt(accessToken) : undefined;
};
