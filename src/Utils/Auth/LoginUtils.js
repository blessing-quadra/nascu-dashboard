import toast from "react-hot-toast";
import { AuthorizeUser } from "../../Services/Auth/Login";

function LoginHandlerOthers(payload) {
  const { identity, password } = payload;
  if (!identity && !password) {
    return false;
  }
  const RequestPayload = {
    identity: {
      identity: identity,
      identityType: "MSISDN",
    },
    credential: {
      credential: password,
      credentialType: "PASSWORD",
    },
  };

  return AuthorizeUser(RequestPayload);
}

function LoginHandlerSuperAdmin(payload) {
  const { identity, password } = payload;
  if (!identity && !password) {
    return false;
  }
  const RequestPayload = {
    identity: {
      identity: identity,
      identityType: "USERNAME",
    },
    credential: {
      credential: password,
      credentialType: "PASSWORD",
    },
  };

  return AuthorizeUser(RequestPayload);
}

export { LoginHandlerOthers, LoginHandlerSuperAdmin };
