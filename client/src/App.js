import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import LandingPage from "./components/views/LandingPage/LandingPage";
import ItemViewPage from "./components/views/ItemPage/ItemViewPage";

import Auth from "./hoc/auth";

function App() {
  return (
    <Router>
      <div>
        {/*
          A <Switch> looks through all its children <Route>
          elements and renders the first one whose path
          matches the current URL. Use a <Switch> any time
          you have multiple routes, but you want only one
          of them to render at a time
        */}
        <Switch>
          <Route path="/item/:itemId" component={Auth(ItemViewPage, null)} />
          <Route path="/" component={Auth(LandingPage, null)} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
