import { useEffect, useState } from "react";
import { ACCESS_TOKEN_EXPIRED_EVENT_NAME } from "../../api/API";

/**
 * Hook which tracks the state of the access token expiration.
 * This is triggered in the API.ts file.
 */
const useIsAccessTokenExpired = () => {
  const [isAccessTokenExpired, setIsAccessTokenExpired] =
    useState<boolean>(false);

  const setAuthorizedState = () => {
    setIsAccessTokenExpired(true);
  };

  useEffect(() => {
    window.addEventListener(
      ACCESS_TOKEN_EXPIRED_EVENT_NAME,
      setAuthorizedState
    );

    return () => {
      window.removeEventListener(
        ACCESS_TOKEN_EXPIRED_EVENT_NAME,
        setAuthorizedState
      );
    };
  }, []);

  return isAccessTokenExpired;
};

export default useIsAccessTokenExpired;
