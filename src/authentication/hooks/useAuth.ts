import {
  QueryObserverResult,
  UseMutateAsyncFunction,
  useMutation,
} from "@tanstack/react-query";
import { parse } from "query-string";
import { useState } from "react";
import { useDistribution } from "../../api/get/getDistribution";
import { useUser } from "../../api/get/getUser";
import { useUserData } from "../../api/get/getUserData";
import { useUserInfo } from "../../api/get/getUserInfo";
import { Distribution, User, UserData, UserInfo } from "../../types";
import { isSocialLoginUrl } from "../SocialAuth";
import {
  changeDistributionByBrokerId,
  getJwtToken,
  login,
  logout,
  refreshToken,
} from "../WgAuthState";
import useIsAccessTokenExpired from "./useIsAccessTokenExpired";
import useIsAuthorized from "./useIsAuthorized";

export type UserRole = "PUBLIC" | "SOCIAL" | "BROKER";

interface JwtData {
  aud: any[];
  client_id: string;
  exp: number;
  ext: {
    bid: string;
    broker_plan: string;
    company_role: string;
    country: string;
    crm: string;
    did: string;
    email: string;
    language: string;
    locale: string;
    role: string;
    uid: string;
  };
  iat: number;
  iss: string;
  jti: string;
  scp: string[];
  sub: string;
}

export interface UseAuth {
  jwtData: JwtData;
  /** User data */
  user: User;
  /** Refetch user date */
  refetchUser: () => Promise<QueryObserverResult<User, unknown>>;

  /** Distribution data */
  distribution: Distribution;
  refetchDistribution: () => Promise<
    QueryObserverResult<Distribution, unknown>
  >;

  /** Other user data */
  ssoData: {
    data: UserData;
    refetchUserData: () => Promise<QueryObserverResult<UserData, unknown>>;
    info: UserInfo;
    refetchUserInfo: () => Promise<QueryObserverResult<UserInfo, unknown>>;
  };

  /** Function to logion the user */
  login: UseMutateAsyncFunction<unknown, unknown, string | undefined>;
  /** Function to logout the user */
  logout: UseMutateAsyncFunction;
  /** Refreshes the user token */
  refreshToken: UseMutateAsyncFunction;
  /** Is access token expired */
  isAccessTokenExpired: boolean;
  /** Is logged in */
  isAuthorized: boolean;
  /** Is logging in */
  isAuthorizing: boolean;
  /** Is all social user related data fetched  */
  isAllSocialUserDataFetched: boolean;
  /** Is all user related data fetched  */
  isAllBrokerDataFetched: boolean;
  /** User role */
  role: UserRole;
  /** Indicates wether the user is returning from SSO */
  isReturningFromSSO: boolean;
  /** Indicates whether the url has a login token */
  isAuthenticatingViaLoginToken: boolean;
  /** Changes the current distribution for the user */
  changeDistribution: UseMutateAsyncFunction<unknown, unknown, string>;
  /** Indicates whether the user is changing the broker */
  isChangingDistribution: boolean;
}

/**
 * Do not render the application while `isAllUserDataFetched` is false
 */

export const useAuth = (): UseAuth => {
  const params = parse(window.location.search);

  const isAccessTokenExpired = useIsAccessTokenExpired();
  const isAuthorized = useIsAuthorized();

  const [isAuthorizing, setIsAuthorizing] = useState<boolean>(false);
  const [isChangingDistribution, setIsChangingDistribution] =
    useState<boolean>(false);

  const userQuery = useUser();
  const userInfoQuery = useUserInfo();
  const userDataQuery = useUserData();
  const distributionQuery = useDistribution();

  const clearData = () => {
    userQuery.remove();
    userInfoQuery.remove();
    userDataQuery.remove();
    distributionQuery.remove();
  };

  const loginMutation = useMutation({
    mutationFn: (redirectUri?: string) => login(redirectUri),
    onMutate: () => {
      setIsAuthorizing(true);
    },
    onError: () => {
      setIsAuthorizing(false);
    },
  });

  const refreshTokenMutation = useMutation({
    mutationFn: refreshToken,
  });

  const logoutMutation = useMutation({
    mutationFn: logout,
    onSettled: clearData,
  });

  const changeDistribution = useMutation({
    mutationFn: (brokerId: string) => changeDistributionByBrokerId(brokerId),
    onMutate: () => {
      setIsChangingDistribution(true);
    },
    onError: () => {
      setIsChangingDistribution(false);
    },
  });

  const getUserRole = (): UserRole => {
    const { data } = userQuery;

    if (data) {
      return "BROKER";
    } else if (isAuthorized && isSocialLoginUrl) return "SOCIAL";

    return "PUBLIC";
  };

  const getIsReturningFromSSO = () => {
    if (params.code && params.scope && params.state) return true;
    return false;
  };

  const getIsAuthenticatingViaLoginToken = () => {
    if (params.login_token) return true;
    return false;
  };

  return {
    jwtData: getJwtToken(),
    user: userQuery.data!,
    refetchUser: userQuery.refetch,
    distribution: distributionQuery.data!,
    refetchDistribution: distributionQuery.refetch,
    ssoData: {
      data: userDataQuery.data!,
      refetchUserData: userDataQuery.refetch,
      info: userInfoQuery.data!,
      refetchUserInfo: userInfoQuery.refetch,
    },
    login: loginMutation.mutateAsync,
    logout: logoutMutation.mutateAsync,
    refreshToken: refreshTokenMutation.mutateAsync,
    isAuthorizing,
    isAuthorized,
    isAccessTokenExpired,
    isAllSocialUserDataFetched: distributionQuery.isSuccess,
    isAllBrokerDataFetched:
      userQuery.isSuccess &&
      userInfoQuery.isSuccess &&
      userDataQuery.isSuccess &&
      distributionQuery.isSuccess,
    role: getUserRole(),
    isReturningFromSSO: getIsReturningFromSSO(),
    isAuthenticatingViaLoginToken: getIsAuthenticatingViaLoginToken(),
    changeDistribution: changeDistribution.mutateAsync,
    isChangingDistribution: isChangingDistribution,
  };
};

export default useAuth;
