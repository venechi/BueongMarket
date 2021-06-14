import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import LandingPage from "./components/views/LandingPage/LandingPage";
import ItemViewPage from "./components/views/ItemPage/ItemViewPage";
import LoginPage from "./components/views/LoginPage/LoginPage";
import RegisterPage from "./components/views/RegisterPage/RegisterPage";

import Auth from "./hoc/auth";
import MyHeader from "./components/MyHeader";

function App() {
  return (
    <Router>
      <MyHeader>
        <Switch>
          <Route path="/register" component={Auth(RegisterPage, false)} />
          <Route path="/login" component={Auth(LoginPage, false)} />
          <Route path="/item/:itemId" component={Auth(ItemViewPage, null)} />
          <Route path="/" component={Auth(LandingPage, null)} />
        </Switch>
      </MyHeader>
    </Router>
  );
}

export default App;
