import { RefObject, useRef, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { useCurrentCampaign } from "../../api/get/getCampaign";
import { useDistributionId } from "../../api/get/getDistribution";
import { useSocialLogin } from "../../api/post/postSocialLogin";

interface UseCaptcha {
  captchaRef: RefObject<ReCAPTCHA>;
  isAuthenticatingByCaptcha: boolean;
  executeCaptcha: (arg0: string) => Promise<void>;
}

const useCaptcha = (): UseCaptcha => {
  const captchaRef = useRef<ReCAPTCHA>(null);

  const [isExecutingCaptcha, setIsExecutingCaptcha] = useState<boolean>(false);

  const { mutateAsync: authenticateByCaptcha } = useSocialLogin();
  const distributionId = useDistributionId();
  const { data: currentCampaign } = useCurrentCampaign();

  const executeCaptcha = async (email: string) => {
    setIsExecutingCaptcha(true);
    try {
      const captchaKey = await captchaRef?.current?.executeAsync();
      if (!captchaKey) {
        return console.error(
          "Something went wrong while executing the captcha"
        );
      }
      captchaRef?.current?.reset();
      await getAccessTokenByCaptchaKey(captchaKey, email);
    } catch (error) {
      console.error("Something went wrong while executing the captcha");
      if (error) console.error(error);
    }
    setIsExecutingCaptcha(false);
  };

  /**
   * Does a call to backend to receive a social login token
   * @param captchaKey Key received by captcha
   */
  const getAccessTokenByCaptchaKey = async (
    captchaKey: string,
    email: string
  ) => {
    await authenticateByCaptcha({
      token: captchaKey,
      email,
      askBrokerId: currentCampaign
        ? currentCampaign.assigned_to || currentCampaign.created_by || undefined
        : undefined,
      askDistributionId: distributionId,
    });
  };

  return {
    captchaRef,
    isAuthenticatingByCaptcha: isExecutingCaptcha,
    executeCaptcha,
  };
};

export default useCaptcha;
