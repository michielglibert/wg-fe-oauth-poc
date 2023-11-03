import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuth from "../authentication/hooks/useAuth";
import LoadingScreen from "./pages/LoadingScreen";
import SocialProvider from "../providers/user-providers/SocialProvider";
import { useCurrentCampaign } from "../api/get/getCampaign";
import ReAthenticateModal from "../components/ReAthenticateModal";

const SocialRoute: React.FC = () => {
  const { pathname } = useLocation();
  const { isAuthorized, isAccessTokenExpired, isAllSocialUserDataFetched } =
    useAuth();
  const { data: currentCampaign } = useCurrentCampaign();

  if (pathname === "/" && currentCampaign) {
    <Navigate to="/public" />;
  }

  if (isAuthorized && !isAllSocialUserDataFetched) return <LoadingScreen />;

  return (
    <SocialProvider>
      <ReAthenticateModal isOpen={!isAuthorized || isAccessTokenExpired} />
      <Outlet />
    </SocialProvider>
  );
};

export default SocialRoute;
