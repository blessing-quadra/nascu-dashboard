import { PutHttp, PostHttp } from "../http";

export const CashoutService = (payload) => {
  return PostHttp("/cashout", payload, true);
};

export const CompleteCashoutService = (payload) => {
  return PutHttp("/cashout", payload, true);
};

export const AdminCashoutService = (payload) => {
  return PostHttp("/adjustment", payload, false);
};
