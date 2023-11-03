import ReCAPTCHA from "react-google-recaptcha";
import React, { RefObject } from "react";

interface Props {
  captchaRef: RefObject<ReCAPTCHA>;
}

const CaptchaComponent: React.FC<Props> = ({ captchaRef }) => {
  return (
    <ReCAPTCHA
      ref={captchaRef}
      size="invisible"
      sitekey={import.meta.env.VITE_APP_INVISIBLE_CAPTCHA_KEY}
      hl="en"
    />
  );
};

export default CaptchaComponent;
