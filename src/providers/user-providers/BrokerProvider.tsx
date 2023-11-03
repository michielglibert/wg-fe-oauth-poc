import React, { PropsWithChildren, useEffect } from "react";
import SocialProvider from "./SocialProvider";

const BrokerProvider: React.FC<PropsWithChildren> = ({ children }) => {
  useEffect(() => {
    console.log("Broker provider loaded");
  }, []);

  return <SocialProvider>{children}</SocialProvider>;
};

export default BrokerProvider;
