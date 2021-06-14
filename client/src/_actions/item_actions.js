import axios from "axios";
import { GET_ITEMS } from "./types";

export function getItems(searchQuery) {
  let query = "/api";
  if (searchQuery) query += `?query=${searchQuery}`;
  const request = axios.get(query).then((res) => res.data);
  return {
    type: GET_ITEMS,
    payload: request,
  };
}
