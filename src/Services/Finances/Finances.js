import { GetHttp } from "../http";

export const GetWalletDetailsWithMobileNo = (mobile) => {
  return GetHttp(`/accountholder/wallets?id=${mobile}&type=MSISDN`, true);
};

export const GetWalletDetailsWithOrgId = (id) => {
  return GetHttp(`/organization/${id}/wallets`, true);
};

export const GetWalletDetails = () => {
  return GetHttp("/accountholder/wallets", true);
};
