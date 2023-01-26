

import { PostHttp } from "../http";

export const RefreshToken = () => {
  const payload = {
    // refreshToken: JSON.parse(window.sessionStorage.getItem("refreshToken")),
    clientId: JSON.parse(window.sessionStorage.getItem("authData")).clientId,
    scopeId: JSON.parse(window.sessionStorage.getItem("selectedScope")).id,
  };
  return PostHttp("/token", payload, false);
};


