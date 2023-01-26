import axios from "axios";
import { CONFIG } from "../config";
import { PostHttp } from "../http";

export const GetOTP = (payload) => {
  const response = axios.post(
    `${CONFIG.API_ROOT_ADDRESS}/requestResetCredentialOtp`,
    payload
  );
  return response;
};

export const RetrievePassword = (payload) => {
  const response = axios.post(
    `${CONFIG.API_ROOT_ADDRESS}/resetCredentialWithOTP`,
    payload
  );
  return response;
};
