import { GET_ITEMS } from "../_actions/types";

export default function foo(state = {}, action) {
  switch (action.type) {
    case GET_ITEMS:
      return { ...state, items: action.payload };

    default:
      return state;
  }
}
