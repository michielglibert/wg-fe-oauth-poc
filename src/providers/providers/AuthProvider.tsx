import React, { PropsWithChildren } from "react";
import useAuthListener from "../../authentication/hooks/useAuthListener";

const AuthProvider: React.FC<PropsWithChildren> = ({ children }) => {
  useAuthListener();

  return <>{children}</>;
};

export default AuthProvider;
