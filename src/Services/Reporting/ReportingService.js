import axios from "axios";
import { GetHttp, PostHttp } from "../http";

export const FetchAllBranchOfficerTransactions = (payload) => {
  return PostHttp(`/transactions`, payload, true);
  // return GetHttp(`/reports/transactions/credit-union`, payload, true);
};

export const FetchMembersTransactions = (payload) => {
  // return PostHttp(`/transactions`, payload, true);
  return GetHttp(`/reports/transactions/member`, payload, true);
};

export const FetchCreditUnionMembers = (orgId) => {
  return GetHttp(`/organization/${orgId}/members?page=0&size=1000000000`, true);
};

export const FetchAllBranchOfficerMembership = (payload) => {
  const lists = Object.keys(payload);
  let queryParams = "";
  lists.forEach((list, index) => {
    if (index < lists.length) {
      queryParams += `${list}=${payload[list]}&`;
    } else {
      queryParams += `${list}=${payload[list]}`;
    }
  });
  return GetHttp(`/accountholders/search?${queryParams}`, true);
};

// `/organization/${organizationId}/members?page=0&size=100`,
