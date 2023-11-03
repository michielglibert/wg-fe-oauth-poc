import { useQuery, UseQueryResult } from "@tanstack/react-query";
import useIsAuthorized from "../../authentication/hooks/useIsAuthorized";
import { isSocialLoginUrl } from "../../authentication/SocialAuth";
import { User } from "../../types";
import { wgApi } from "../wgApi";

const getUser = async () => {
  const { data } = await wgApi.get<User>("v1/api/brokers/me");
  return data;
};

export const getUserQKey = (): string[] => ["user"];

export const useUser = (): UseQueryResult<User> => {
  const isAuthorized = useIsAuthorized();

  return useQuery(getUserQKey(), getUser, {
    cacheTime: Infinity,
    staleTime: Infinity,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    enabled: isAuthorized && !isSocialLoginUrl,
  });
};
