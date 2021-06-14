import {
  LOGIN_USER,
  LOGOUT_USER,
  REGISTER_USER,
  CHECK_ID,
  CHECK_NICKNAME,
  AUTH_USER,
} from "../_actions/types";

export default function foo(state = {}, action) {
  switch (action.type) {
    case LOGIN_USER:
      return { ...state, loginSuccess: action.payload };

    case LOGOUT_USER:
      return { ...state, logoutSuccess: action.payload };

    case REGISTER_USER:
      return { ...state, register: action.payload };

    case CHECK_ID:
      return { ...state, isValid: action.payload };

    case CHECK_NICKNAME:
      return { ...state, isValid: action.payload };

    case AUTH_USER:
      return { ...state, userData: action.payload };

    default:
      return state;
  }
}
