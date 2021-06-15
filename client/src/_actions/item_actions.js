import axios from "axios";
import CONSTANTS from "../Constants";
import {
  GET_ITEMS,
  GET_ITEM,
  UPDATE_ITEM,
  DELETE_ITEM,
  GET_ITEMS_OF_USER,
  UPDATE_COMMENT,
} from "./types";

export function getItems(searchQuery) {
  let query = CONSTANTS.API_SERVER + "/api";
  if (searchQuery) query += `?query=${searchQuery}`;
  const request = axios
    .get(query, { withCredentials: true })
    .then((res) => res.data);
  return {
    type: GET_ITEMS,
    payload: request,
  };
}

export function getItem(itemId) {
  const request = axios
    .get(CONSTANTS.API_SERVER + `/api/item/${itemId}`, {
      withCredentials: true,
    })
    .then((res) => res.data);
  return {
    type: GET_ITEM,
    payload: request,
  };
}

export function updateItem(dataToSubmit) {
  const request = axios
    .post(CONSTANTS.API_SERVER + "/api/item/update", dataToSubmit, {
      header: { "Content-Type": "multipart/form-data" },
      withCredentials: true,
    })
    .then((res) => res.data);
  return {
    type: UPDATE_ITEM,
    payload: request,
  };
}

export function deleteItem(itemId) {
  const request = axios
    .get(CONSTANTS.API_SERVER + `/api/item/delete/${itemId}`, {
      withCredentials: true,
    })
    .then((res) => res.data);
  return {
    type: DELETE_ITEM,
    payload: request,
  };
}

export function getItemsOfUser() {
  const request = axios
    .get(CONSTANTS.API_SERVER + `/api/allitem`, { withCredentials: true })
    .then((res) => res.data);
  return {
    type: GET_ITEMS_OF_USER,
    payload: request,
  };
}

export function updateComment(dataToSubmit) {
  const request = axios
    .post(CONSTANTS.API_SERVER + `/api/item/comment`, dataToSubmit, {
      withCredentials: true,
    })
    .then((res) => res.data);
  return {
    type: UPDATE_COMMENT,
    payload: request,
  };
}
