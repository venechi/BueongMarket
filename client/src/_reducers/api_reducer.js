import { GET_GEOCODE } from "./types";

export default function foo(state = {}, action) {
  switch (action.type) {
    case GET_GEOCODE:
      return { ...state, res: action.payload };

    default:
      return state;
  }
}
