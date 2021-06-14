import axios from "axios";
import { GET_GEOCODE } from "./types";

export function getGeocode(coords) {
  const request = axios
    .get(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${coords.lat}&longitude=${coords.long}&localityLanguage=ko`
    )
    .then((res) => res.data);
  return {
    type: GET_GEOCODE,
    payload: request,
  };
}
