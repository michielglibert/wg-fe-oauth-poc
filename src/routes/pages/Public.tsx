import { Box, Button } from "@chakra-ui/react";
import React from "react";
import { useNavigate } from "react-router-dom";
import CaptchaComponent from "../../authentication/CaptchaComponent";
import useCaptcha from "../../authentication/hooks/useCaptcha";

interface Props {}

const Public: React.FC<Props> = () => {
  const { captchaRef, executeCaptcha, isAuthenticatingByCaptcha } =
    useCaptcha();
  const navigate = useNavigate();

  const startSocialFlow = async () => {
    await executeCaptcha("michiel@wegroup.be");
    navigate("/social");
  };

  return (
    <Box>
      <Button onClick={startSocialFlow} isLoading={isAuthenticatingByCaptcha}>
        Get started
      </Button>
      <CaptchaComponent captchaRef={captchaRef} />
    </Box>
  );
};

export default Public;
