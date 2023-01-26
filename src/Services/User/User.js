import { GetHttp, PostHttp } from "../http";

export const FetchInfoWithNumber = (mobileNumber) => {
  return GetHttp(`/accountholder?id=${mobileNumber}&type=MSISDN`, true);
};

export const FetchInfoWithUsername = () => {
  return GetHttp(`/adminuser`, true);
};

export const RegisterNewMember = (payload) => {
  return PostHttp("/accountholder", payload, true);
};

export const ViewAllMember = (organizationId) => {
  return GetHttp(
    `/organization/${organizationId}/members?page=0&size=100`,
    true
  );
};

export const UpdateMemberStatus = (payload) => {
  return GetHttp(
    `/organization/member/status?id=${payload.id}&type=${payload.type}&status=${payload.status}`,
    true
  );
};
