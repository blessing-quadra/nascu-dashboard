import axios from "axios";
import { CONFIG } from "./config";

export const GetHttp = (relaivePath, payload, protectedEndpoint) => {
  try {
    if (!navigator.onLine) {
      const promise = new Promise((resolve, reject) => {
        reject({
          message: "Check your network connection",
        });
      });
      return promise;
    }
    const isProtected = protectedEndpoint ? protectedEndpoint : true;

    const authorizationToken = sessionStorage.getItem("token");
    const header = {
      headers: {
        "Content-Type": "application/json",
        Authorization: isProtected
          ? "Bearer " + JSON.parse(authorizationToken)
          : {},
      },
    };
    console.log(header);
    
    let params = "";
    const paramList = Object.keys(payload);
    paramList.forEach((key, index) => {
      if (index === 0) {
        params += `?${key}=${payload[key]}`;
      } else {
        params += `&${key}=${payload[key]}`;
      }
    });
    let fullPath;
    if (paramList.length > 0) {
      fullPath = `${CONFIG.API_ROOT_ADDRESS + relaivePath + params}`;
    } else {
      fullPath = `${CONFIG.API_ROOT_ADDRESS + relaivePath}`;
    }
    return axios.get(fullPath, header);
  } catch (error) {
    const promise = new Promise((resolve, reject) => {
      reject({
        name: error.name,
        message: error.message,
      });
    });
    throw promise;
  }
};

export const PostHttp = (relaivePath, payload, protectedEndpoint) => {
  try {
    if (!navigator.onLine) {
      const promise = new Promise((resolve, reject) => {
        reject({
          message: "Check your network connection",
        });
      });
      return promise;
    }
    const isProtected = protectedEndpoint ? protectedEndpoint : true;

    const authorizationToken = sessionStorage.getItem("token");
    const header = {
      headers: {
        Authorization: isProtected
          ? "Bearer " + JSON.parse(authorizationToken)
          : {},
        "Content-Type": "application/json",
      },
    };
    console.log(header);
    return axios.post(CONFIG.API_ROOT_ADDRESS + relaivePath, payload, header);
  } catch (error) {
    const promise = new Promise((resolve, reject) => {
      reject({
        name: error.name,
        message: error.message,
      });
    });
    throw promise;
  }
};

export const PutHttp = (relaivePath, payload, protectedEndpoint) => {
  try {
    if (!navigator.onLine) {
      const promise = new Promise((resolve, reject) => {
        reject({
          message: "Check your network connection",
        });
      });
      return promise;
    }
    const isProtected = protectedEndpoint ? protectedEndpoint : true;

    const authorizationToken = sessionStorage.getItem("token");
    const header = {
      headers: {
        Authorization: isProtected
          ? "Bearer " + JSON.parse(authorizationToken)
          : {},
        "Content-Type": "application/json",
      },
    };
    console.log(header);
    return axios.put(CONFIG.API_ROOT_ADDRESS + relaivePath, payload, header);
  } catch (error) {
    const promise = new Promise((resolve, reject) => {
      reject({
        name: error.name,
        message: error.message,
      });
    });
    throw promise;
  }
};

export const DeleteHttp = (relaivePath, protectedEndpoint) => {
  if (!navigator.onLine) {
    return false;
  }
  const isProtected = protectedEndpoint ? protectedEndpoint : true;

  const authorizationToken = sessionStorage.getItem("token");
  const header = {
    headers: {
      Authorization: isProtected
        ? "Bearer " + JSON.parse(authorizationToken)
        : {},
      "Content-Type": "application/json",
    },
  };
  return axios.delete(CONFIG.API_ROOT_ADDRESS + relaivePath, header);
};

const PatchHttp = (relaivePath, payload, protectedEndpoint) => {
  if (!navigator.onLine) {
    return false;
  }
  const isProtected = protectedEndpoint ? protectedEndpoint : true;

  const authorizationToken = sessionStorage.getItem("token");
  return axios.patch(
    CONFIG.API_ROOT_ADDRESS + relaivePath,
    payload,
    isProtected ? authorizationToken : {}
  );
};
