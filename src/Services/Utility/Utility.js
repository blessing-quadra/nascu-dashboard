import { PostHttp } from "../http";

// export const FetchInfoWithNumber = (mobileNumber) => {
//   return GetHttp(`/accountholder?id=${mobileNumber}&type=MSISDN`, true);
// };

export const BuyAirtimeService = (payload) => {
  return PostHttp("/payment", payload, true);
};

export const BuyElectricityService = (payload) => {
  return PostHttp("/payment", payload, true);
};
