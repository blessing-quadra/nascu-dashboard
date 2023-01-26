import { PostHttp } from "../http";

export const DepositToBOWallet = (payload) => {
  return PostHttp("/floattransfer", payload, true);
};

// export const GenerateAuthToken = (payload) => {
//   return PostHttp("/token", payload, false);
// };
