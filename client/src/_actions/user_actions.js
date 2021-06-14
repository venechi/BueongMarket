import axios from "axios";
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
    .post("/api/users/login", dataToSubmit)
    .then((res) => res.data);
  return {
    type: LOGIN_USER,
    payload: request,
  };
}

export function logout() {
  const request = axios.get("/api/users/logout").then((res) => res.data);
  return {
    type: LOGOUT_USER,
    payload: request,
  };
}

export function registerUser(dataToSubmit) {
  const request = axios
    .post("/api/users/register", dataToSubmit)
    .then((res) => res.data);
  return {
    type: REGISTER_USER,
    payload: request,
  };
}

export function checkID(dataToSubmit) {
  const request = axios
    .post("/api/users/checkid", dataToSubmit)
    .then((res) => res.data);
  return {
    type: CHECK_ID,
    payload: request,
  };
}

export function checkNickname(dataToSubmit) {
  const request = axios
    .post("/api/users/checknickname", dataToSubmit)
    .then((res) => res.data);
  return {
    type: CHECK_NICKNAME,
    payload: request,
  };
}

export function auth() {
  const request = axios.get("/api/users/auth").then((res) => res.data);
  return {
    type: AUTH_USER,
    payload: request,
  };
}
