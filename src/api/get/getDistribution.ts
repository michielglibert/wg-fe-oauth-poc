import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { isSocialLoginUrl } from "../../authentication/SocialAuth";
import useAuth from "../../authentication/hooks/useAuth";
import { getJwtToken, WgOAuth } from "../../authentication/WgAuthState";
import { Distribution } from "../../types";
import { wgApi } from "../wgApi";
import { useCurrentCampaign } from "./getCampaign";

const getDistribution = async (distributionId: string) => {
  const { data } = await wgApi.get<Distribution>(
    `v1/api/broker/v1/api/distributions/${distributionId}`
  );
  return data;
};

export const getDistributionQKey = (): string[] => ["user"];

/**
 * Distribution id can be retrieved through multiple methods:
 * - The JWT token
 * - The campaign (Social login only)
 * - The party id if it is included in the url params (Social login only)
 * @returns
 */
export const useDistributionId = (): string => {
  if (isSocialLoginUrl) {
    const { data: currentCampaign } = useCurrentCampaign();
    return currentCampaign?.distribution_id || "";
  }

  const jwtData = getJwtToken();

  return jwtData?.ext?.did || "";
};

export const useDistribution = (): UseQueryResult<Distribution> => {
  const distributionId = useDistributionId();

  return useQuery(
    getDistributionQKey(),
    () => getDistribution(distributionId!),
    {
      cacheTime: Infinity,
      staleTime: Infinity,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      enabled: !!distributionId,
    }
  );
};
