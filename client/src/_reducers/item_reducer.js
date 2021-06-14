import {
  GET_ITEMS,
  GET_ITEM,
  UPDATE_ITEM,
  DELETE_ITEM,
  GET_ITEMS_OF_USER,
  UPDATE_COMMENT,
} from "../_actions/types";

export default function foo(state = {}, action) {
  switch (action.type) {
    case GET_ITEMS:
      return { ...state, items: action.payload };

    case GET_ITEM:
      return { ...state, item: action.payload };

    case UPDATE_ITEM:
      return { ...state, res: action.payload };

    case DELETE_ITEM:
      return { ...state, res: action.payload };

    case GET_ITEMS_OF_USER:
      return { ...state, res: action.payload };

    case UPDATE_COMMENT:
      return { ...state, res: action.payload };

    default:
      return state;
  }
}
