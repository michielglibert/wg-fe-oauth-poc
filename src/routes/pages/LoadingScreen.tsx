import { Center, Spinner } from "@chakra-ui/react";
import React from "react";

const LoadingScreen: React.FC = () => {
  return (
    <Center h="100vh" w="100%">
      <Spinner color="#ff8000" size="xl" />
    </Center>
  );
};

export default LoadingScreen;
