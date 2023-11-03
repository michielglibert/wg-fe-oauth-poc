import { UseQueryResult, useQuery } from "@tanstack/react-query";
import { isCampaignsUrl } from "../../authentication/SocialAuth";
import { Campaign } from "../../types";
import { wgApi } from "../wgApi";

const getCampaignById = async (campaignId: string): Promise<Campaign> => {
  const { data } = await wgApi.get<Campaign>(`v1/api/campaigns/${campaignId}`);
  return data;
};

export const getCampaignIdFromURL = (url: string): string => {
  // replace https:// to an empty sting so we can safely extract the campaigns short id
  const replacedUrl = url.replace(/(^\w+:|^)\/\//, "");
  const prefix = replacedUrl.split(".")[0];

  return prefix;
};

export const getUseCurrentCampaignQKey = () => ["user", "campaign"];

/**
 * Related to user data since it is needed for a user when he goes trough a campaign
 */
export const useCurrentCampaign = (): UseQueryResult<Campaign, unknown> =>
  useQuery<Campaign>(
    getUseCurrentCampaignQKey(),
    async () => {
      const campaignId = getCampaignIdFromURL(window.location.href);
      const resp = await getCampaignById(campaignId);
      return resp;
    },
    {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchInterval: false,
      enabled: isCampaignsUrl,
    }
  );
