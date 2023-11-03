import { parse } from "query-string";
import { useEffect } from "react";
import useAuth from "./useAuth";
import {
  authenticateByLoginToken,
  onUserReceivedAuthorizationToken,
} from "../WgAuthState";

/** Listens for state changes related to auth */
const useAuthListener = () => {
  const { isReturningFromSSO, isAuthenticatingViaLoginToken } = useAuth();
  const search = window.location.search;

  useEffect(() => {
    if (isReturningFromSSO) onUserReceivedAuthorizationToken();
  }, [isReturningFromSSO]);

  useEffect(() => {
    if (isAuthenticatingViaLoginToken) {
      const loginToken = parse(search).login_token;
      if (loginToken && typeof loginToken === "string")
        authenticateByLoginToken(loginToken);
    }
  }, [search]);
};

export default useAuthListener;
