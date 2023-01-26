import axios from "axios";
import { GetHttp } from "../http";

export const FetchAllCreditUnionTransactions = (payload) => {
  return GetHttp(
    `/reports/transactions/credit-union?organizationId=${payload.id}&startDate=${payload.fromDate}&endDate=${payload.toDate}`,
    true
  );
  // return axios.get("/mock/credit_union_transaction_report.json");
};

export const FetchAllBranchOfficers = () => {
  // return GetHttp(`/creditUnionReport?organizationId=${id}`, true);
  return axios.get("/mock/credit_union_users_report.json");
};

export const FetchAllMembers = () => {
  // return GetHttp(`/creditUnionReport?organizationId=${id}`, true);
  return axios.get("/mock/branch_officer_users_report.json");
};

export const FetchReportForNASCUCU = (payload) => {
  return GetHttp(
    `/reports/transactions/all-credit-unions-stats?startDate=${payload.fromDate}&endDate=${payload.toDate}&activeOnly=true`,
    true
  );
  // return axios.get("/mock/NASCU_users_report.json");
};

export const FetchReportForActiveCreditUnion = (payload) => {
  return GetHttp(
    `/reports/transactions/all-credit-unions-stats?startDate=${payload.fromDate}&endDate=${payload.toDate}&activeOnly=false`,
    true
  );
  // return axios.get("/mock/NASCU_users_report.json");
};

export const FetchTotalRegisteredCreditUnion = (payload) => {
  if (!payload?.toDate && !payload?.fromDate) {
    return GetHttp(
      `/reports/transactions/all-credit-unions-stats?&activeOnly=false`,
      true
    );
  } else {
    return GetHttp(
      `/reports/transactions/all-credit-unions-stats?startDate=${payload.fromDate}&endDate=${payload.toDate}&activeOnly=false`,
      true
    );
  }
  // return axios.get("/mock/NASCU_report.json");
};

export const FetchTotalActiveCreditUnion = (payload) => {
  return GetHttp(
    `/reports/transactions/all-credit-unions-stats?startDate=${payload.fromDate}&endDate=${payload.toDate}&activeOnly=true&page=0&size=1000000`,
    true
  );
};

export const FetchReportForCU = (id) => {
  return GetHttp(
    `/reports/transactions/credit-union-stats?organizationId=${id}`,
    true
  );
  // return axios.get("/mock/credit_union_report.json");
};

export const FetchReportForBO = (id) => {
  // return GetHttp(`/creditUnionReport?organizationId=${id}`, true);
  return axios.get("/mock/branch_officer_report.json");
};

export const WalletBalances = (id) => {
  return GetHttp(`/organization/${id}/wallets`, true);
  // return axios.get("/mock/report.json");
};

export const FetchReportsForCUAdmin = () => {
  return GetHttp("/creditUnionsReports", true);
  // return axios.get("/mock/reports.json");
};
