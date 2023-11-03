import React, { PropsWithChildren, useEffect } from "react";

const SocialProvider: React.FC<PropsWithChildren> = ({ children }) => {
  useEffect(() => {
    console.log("Social provider loaded");
  }, []);

  return <>{children}</>;
};

export default SocialProvider;
