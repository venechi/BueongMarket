import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { auth } from "../_actions/user_actions";

export default function (SpecificComponent, option, adminRoute = null) {
  //option
  //null => 아무나 출입 가능
  //true => 조건(보통 로그인)에 맞으면 출입 가능
  //false => 조건에 안맞아야 출입 가능
  //adminRoute -> 관리자 대상 옵션  //값은 option과 같음
  function AuthenticationCheck(props) {
    const dispatch = useDispatch();
    useEffect(() => {
      dispatch(auth()).then((res) => {
        if (!res.payload.isAuth) {
          //비로그인
          if (option) {
            props.history.push("/login");
          }
        } else {
          //로그인
          if (adminRoute && !res.payload.isAdmin) {
            props.history.push("/");
          } else {
            if (option === false) {
              props.history.push("/");
            }
          }
        }
      });
    }, []);
    return <SpecificComponent />;
  }

  return AuthenticationCheck;
}
