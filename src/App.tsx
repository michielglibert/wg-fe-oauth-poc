import {
  Box,
  Button,
  Center,
  HStack,
  Input,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import useAuth from "./authentication/hooks/useAuth";
import { useRef } from "react";

const App = () => {
  const input = useRef<HTMLInputElement>(null);

  const {
    user,
    login,
    logout,
    refreshToken,
    changeDistribution,
    isAuthorizing,
    isAuthorized,
    refetchUser,
  } = useAuth();

  const handleClickLogin = () => {
    login("/");
  };

  const handleClickRefreshToken = () => {
    refreshToken();
  };

  const handleClickLogout = () => {
    logout();
  };

  const handleClickMeCall = () => {
    refetchUser();
  };

  const handleChangeBroker = () => {
    if (input.current) changeDistribution(input.current.value);
  };

  return (
    <VStack align="stretch">
      <HStack spacing="4">
        <Button onClick={handleClickLogin} isLoading={isAuthorizing}>
          login
        </Button>
        <Button onClick={handleClickRefreshToken}>refresh token</Button>
        <Button onClick={handleClickLogout}>logout</Button>
        <Button onClick={handleClickMeCall}>me call</Button>
      </HStack>
      <VStack>
        <Text fontSize="8xl">App loaded</Text>
        <Text>Welcome {user.name}</Text>

        <Box p="12">
          <Input type="text" ref={input} placeholder="Broker id" />
          <Button onClick={handleChangeBroker}>
            Change to brokerId distrubtion
          </Button>
        </Box>
      </VStack>
    </VStack>
  );
};

export default App;
