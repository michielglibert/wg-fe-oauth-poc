import { useQuery, UseQueryResult } from "@tanstack/react-query";
import useIsAuthorized from "../../authentication/hooks/useIsAuthorized";
import { isSocialLoginUrl } from "../../authentication/SocialAuth";
import { WgOAuth } from "../../authentication/WgAuthState";
import { UserData } from "../../types";
import { wgApi } from "../wgApi";

const getUserData = async () => {
  const { data } = await wgApi.get<UserData>("v1/api/users/me");
  return data;
};

export const getUserDataQKey = (): string[] => ["user", "data"];

export const useUserData = (): UseQueryResult<UserData> => {
  const isAuthorized = useIsAuthorized();

  return useQuery<UserData>(getUserDataQKey(), getUserData, {
    cacheTime: Infinity,
    staleTime: Infinity,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    enabled: isAuthorized && !isSocialLoginUrl,
  });
};
