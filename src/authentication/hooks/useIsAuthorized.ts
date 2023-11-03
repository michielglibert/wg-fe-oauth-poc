import { useEffect, useState } from "react";
import { LOCAL_STORAGE_OAUTH_EVENT_NAME } from "../OAuth";
import { WgOAuth } from "../WgAuthState";

/**
 * Hook which tracks the state of the access token expiration.
 * This is triggered in the OAuth.ts file.
 */
const useIsAuthorized = () => {
  const [isAuthorized, setIsAuthorized] = useState<boolean>(
    WgOAuth.getIsAuthorized()
  );

  const setAuthorizedState = () => {
    const authorizationValue = WgOAuth.getIsAuthorized();
    setIsAuthorized(authorizationValue);
  };

  useEffect(() => {
    window.addEventListener(LOCAL_STORAGE_OAUTH_EVENT_NAME, setAuthorizedState);

    return () => {
      window.removeEventListener(
        LOCAL_STORAGE_OAUTH_EVENT_NAME,
        setAuthorizedState
      );
    };
  }, []);

  return isAuthorized;
};

export default useIsAuthorized;
