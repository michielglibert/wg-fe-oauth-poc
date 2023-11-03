import { Center, Spinner } from "@chakra-ui/react";
import React, { useEffect } from "react";
import useAuth from "../authentication/hooks/useAuth";
import { useLocation, useNavigate } from "react-router-dom";
import LoadingScreen from "./pages/LoadingScreen";

const Authentication: React.FC = () => {
  const { login } = useAuth();

  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  useEffect(() => {
    login(from);
  }, []);

  return <LoadingScreen />;
};

export default Authentication;
