import { GetHttp, PostHttp } from "../http";

export const FetchAllOrganizations = () => {
  return GetHttp(`/organizations?type=CREDIT_UNION&page=0&size=100`, true);
};

export const CreateNewOrganisation = (payload) => {
  return PostHttp("/organization", payload, true);
};
