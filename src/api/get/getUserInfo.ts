import { useQuery, UseQueryResult } from "@tanstack/react-query";
import useIsAuthorized from "../../authentication/hooks/useIsAuthorized";
import { isSocialLoginUrl } from "../../authentication/SocialAuth";
import { UserInfo } from "../../types";
import { ssoApi } from "../ssoApi";

const getUserInfo = async () => {
  const { data } = await ssoApi.get<UserInfo>("userinfo");
  return data;
};

export const getUserInfoQKey = (): string[] => ["user", "info"];

const USER_INFO_REFETCH_INTERVAL = 30 * 60 * 1000;

export const useUserInfo = (): UseQueryResult<UserInfo> => {
  const isAuthorized = useIsAuthorized();

  return useQuery<UserInfo>(getUserInfoQKey(), getUserInfo, {
    cacheTime: Infinity,
    staleTime: Infinity,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchInterval: USER_INFO_REFETCH_INTERVAL,
    enabled: isAuthorized && !isSocialLoginUrl,
  });
};
