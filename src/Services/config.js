const APP_MODE = process.env.REACT_APP_MODE;

const STAGING = {
  API_ROOT_ADDRESS: "http://54.174.86.200:8091/wallet", //http://sandbox.NASCU.novaonda.io:8091/wallet - https://novaonda.io:8090/wallet
};

const LIVE = {
  API_ROOT_ADDRESS: "https://novaonda.io:8095/wallet",
};

export const CONFIG = APP_MODE === "LIVE" ? LIVE : STAGING;
