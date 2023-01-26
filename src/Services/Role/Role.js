import { GetHttp, PostHttp } from "../http";

export const FetchRoles = (roleId) => {
  return GetHttp(`/authorization/role/id/${roleId}`, true);
};

export const FetchAllRoles = () => {
  return GetHttp(`/authorization/roles?page=0&size=100`, true);
};

export const FetchOrganisationRoles = (organizationId) => {
  return GetHttp(`/organization/${organizationId}/roles?page=0&size=100`);
};

export const createNewRoleService = (payload) => {
  return PostHttp("/authorization/role", payload, true);
};

export const updateRolePermission = (payload) => {
  // const roleId = JSON.parse(
  //   window.sessionStorage.getItem("selectedScope")
  // )?.roleId;
  return PostHttp(
    `/authorization/role/${payload.selectedId}/permissions?status=true`,
    payload.data,
    true
  );
};
