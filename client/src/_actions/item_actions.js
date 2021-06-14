import axios from "axios";
import {
  GET_ITEMS,
  GET_ITEM,
  UPDATE_ITEM,
  DELETE_ITEM,
  GET_ITEMS_OF_USER,
  UPDATE_COMMENT,
} from "./types";

export function getItems(searchQuery) {
  let query = "/api";
  if (searchQuery) query += `?query=${searchQuery}`;
  const request = axios.get(query).then((res) => res.data);
  return {
    type: GET_ITEMS,
    payload: request,
  };
}

export function getItem(itemId) {
  const request = axios.get(`/api/item/${itemId}`).then((res) => res.data);
  return {
    type: GET_ITEM,
    payload: request,
  };
}

export function updateItem(dataToSubmit) {
  const request = axios
    .post("/api/item/update", dataToSubmit, {
      header: { "Content-Type": "multipart/form-data" },
    })
    .then((res) => res.data);
  return {
    type: UPDATE_ITEM,
    payload: request,
  };
}

export function deleteItem(itemId) {
  const request = axios
    .get(`/api/item/delete/${itemId}`)
    .then((res) => res.data);
  return {
    type: DELETE_ITEM,
    payload: request,
  };
}

export function getItemsOfUser() {
  const request = axios.get(`/api/allitem`).then((res) => res.data);
  return {
    type: GET_ITEMS_OF_USER,
    payload: request,
  };
}

export function updateComment(dataToSubmit) {
  const request = axios
    .post(`/api/item/comment`, dataToSubmit)
    .then((res) => res.data);
  return {
    type: UPDATE_COMMENT,
    payload: request,
  };
}
