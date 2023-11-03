import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { WgOAuth } from "../../authentication/WgAuthState";
import { wgAuthApi } from "../wgAuthApi";

interface Payload {
  askBrokerId?: string;
  askDistributionId: string;
  email: string;
  token: string;
}

interface Response {
  access_token: string;
  id: string;
}

const postSocialLogin = async (payload: Payload) => {
  const { data } = await wgAuthApi.post<Response>("auth/captcha", {
    token: payload.token,
    email: payload.email,
    ask_broker_id: payload.askBrokerId,
    ask_distribution_id: payload.askDistributionId,
    version: "V2_INVISIBLE",
  });

  return data;
};

export const useSocialLogin = (): UseMutationResult<
  Response,
  unknown,
  Payload
> => {
  return useMutation<Response, unknown, Payload>(postSocialLogin, {
    onSuccess: (data) => {
      WgOAuth.setSocialLoginToken(data.access_token);
    },
  });
};
