import { GetHttp, PostHttp } from "../http";

export const DepositService = (payload) => {
  return PostHttp("/deposit", payload, true);
};

export const FetchCashouts = () => {
  return GetHttp(`/cashouts?&page=0&size=1000`, false);
};

// export const GenerateAuthToken = (payload) => {
//   return PostHttp("/token", payload, false);
// };
