import axios from "axios";
import CONSTANTS from "../Constants";
import {
  LOGIN_USER,
  LOGOUT_USER,
  REGISTER_USER,
  CHECK_ID,
  CHECK_NICKNAME,
  AUTH_USER,
} from "./types";

export function loginUser(dataToSubmit) {
  const request = axios
    .post(CONSTANTS.API_SERVER + "/api/users/login", dataToSubmit, {
      withCredentials: true,
    })
    .then((res) => res.data);
  return {
    type: LOGIN_USER,
    payload: request,
  };
}

export function logout() {
  const request = axios
    .get(CONSTANTS.API_SERVER + "/api/users/logout", { withCredentials: true })
    .then((res) => res.data);
  return {
    type: LOGOUT_USER,
    payload: request,
  };
}

export function registerUser(dataToSubmit) {
  const request = axios
    .post(CONSTANTS.API_SERVER + "/api/users/register", dataToSubmit, {
      withCredentials: true,
    })
    .then((res) => res.data);
  return {
    type: REGISTER_USER,
    payload: request,
  };
}

export function checkID(dataToSubmit) {
  const request = axios
    .post(CONSTANTS.API_SERVER + "/api/users/checkid", dataToSubmit, {
      withCredentials: true,
    })
    .then((res) => res.data);
  return {
    type: CHECK_ID,
    payload: request,
  };
}

export function checkNickname(dataToSubmit) {
  const request = axios
    .post(CONSTANTS.API_SERVER + "/api/users/checknickname", dataToSubmit, {
      withCredentials: true,
    })
    .then((res) => res.data);
  return {
    type: CHECK_NICKNAME,
    payload: request,
  };
}

export function auth() {
  const request = axios
    .get(CONSTANTS.API_SERVER + "/api/users/auth", { withCredentials: true })
    .then((res) => res.data);
  return {
    type: AUTH_USER,
    payload: request,
  };
}
