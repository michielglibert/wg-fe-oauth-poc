import React from "react";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import useAuth from "../authentication/hooks/useAuth";
import { isSocialLoginUrl } from "../authentication/SocialAuth";
import BrokerProvider from "../providers/user-providers/BrokerProvider";
import LoadingScreen from "./pages/LoadingScreen";

const BrokerRoute: React.FC = () => {
  const {
    isAuthorized,
    isReturningFromSSO,
    isChangingDistribution,
    isAllBrokerDataFetched,
  } = useAuth();
  const location = useLocation();

  if (isReturningFromSSO || isChangingDistribution) return <LoadingScreen />;

  if (!isAuthorized || isSocialLoginUrl) {
    return <Navigate to="/login" state={{ from: location }} />;
  }

  if (!isAllBrokerDataFetched) return <LoadingScreen />;

  return (
    <BrokerProvider>
      <Outlet />
    </BrokerProvider>
  );
};

export default BrokerRoute;
