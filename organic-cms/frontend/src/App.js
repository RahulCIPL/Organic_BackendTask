import React, { useState, useEffect } from "react";

// Purpose: Include routing related package
import { BrowserRouter, Switch, Route } from "react-router-dom";

// Purpose: Include api call related package
import axios from "axios";

//import components
import Header from './components/layout/header';
import Home from './components/misc/home';
import Register from './components/auth/register';
import Login from './components/auth/login';
import UserContext from './context/userContext';
import Pages from './components/pages/pages-list';
import CreatePage from './components/pages/create-page';
import CreateUser from './components/users/create-user';
import NotFound from "./components/misc/pageNotFound";

import "./App.css";

function App() {
  const [userData, setUserData] = useState({
    token: undefined,
    user: undefined,
  });

  useEffect(() => {
    const checkLoggedIn = async () => {
      let token = localStorage.getItem("auth-token");

      if (token === null) {
        localStorage.setItem("auth-token", "");
        token = "";
      }
      const tokenResponse = await axios.post("/users/tokenIsValid", null, {
        headers: { "x-auth-token": token },
      });

      if (tokenResponse.data) {
        const userRes = await axios.get("/users/", {
          headers: { "x-auth-token": token },
        });
        setUserData({
          token: token,
          user: userRes.data,
        });
      }
    };

    checkLoggedIn();
  }, []);

  return (
    <BrowserRouter>
      <UserContext.Provider value={{ userData, setUserData }}>
        <Header />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/register" component={Register} />
          <Route path="/login" component={Login} />
          <Route path="/pages" component={Pages} />
          <Route path="/createuser" component={CreateUser} />
          <Route path="/edituser/:id" component={CreateUser} />
          <Route path="/createpage" component={CreatePage} />
          <Route path="/editpage/:id" component={CreatePage} />
          <Route component={NotFound} />
        </Switch>
      </UserContext.Provider>
    </BrowserRouter>
  );
}

export default App;
