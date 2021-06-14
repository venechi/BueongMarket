import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";

import LandingPage from "./components/views/LandingPage/LandingPage";
import ItemViewPage from "./components/views/ItemPage/ItemViewPage";
import LoginPage from "./components/views/LoginPage/LoginPage";
import RegisterPage from "./components/views/RegisterPage/RegisterPage";
import EditorPage from "./components/views/EditorPage/EditorPage";
import MyPage from "./components/views/MyPage/MyPage";

import Auth from "./hoc/auth";

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/mypage" component={Auth(MyPage, true)} />
        <Route path="/editor/:itemId" component={Auth(EditorPage, true)} />
        <Route path="/register" component={Auth(RegisterPage, false)} />
        <Route path="/login" component={Auth(LoginPage, false)} />
        <Redirect from="/logout" to="/" />
        <Route path="/item/:itemId" component={Auth(ItemViewPage, null)} />
        <Route path="/" component={Auth(LandingPage, null)} />
      </Switch>
    </Router>
  );
}

export default App;
