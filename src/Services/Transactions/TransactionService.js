import { PostHttp } from "../http";

export const FetchTransactions = (payload) => {
  return PostHttp("/transactions", payload, true);
};


