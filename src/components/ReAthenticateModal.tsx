import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
} from "@chakra-ui/react";
import React from "react";
import CaptchaComponent from "../authentication/CaptchaComponent";
import useCaptcha from "../authentication/hooks/useCaptcha";

interface Props {
  isOpen: boolean;
}

const ReAthenticateModal: React.FC<Props> = ({ isOpen }) => {
  const { captchaRef, executeCaptcha, isAuthenticatingByCaptcha } =
    useCaptcha();

  return (
    <Modal isOpen={isOpen} onClose={() => null}>
      <CaptchaComponent captchaRef={captchaRef} />
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Session expired</ModalHeader>
        <ModalBody>Please re-authenticate</ModalBody>

        <ModalFooter>
          <Button
            onClick={() => executeCaptcha("michiel@wegroup.be")}
            isLoading={isAuthenticatingByCaptcha}
          >
            Authenticate
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ReAthenticateModal;
