import React, { useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import UserContext from "../../context/userContext";
import ErrorNotice from "../misc/errorNotice";

// Purpose: Login Page
// Created By: CIPL

function Login() {
  const [emailaddress, setEmailaddress] = useState();
  const [password, setPassword] = useState();
  const [error, setError] = useState();

  const { setUserData } = useContext(UserContext);
  const history = useHistory();

  //Login User submit event
  const submit = async (e) => {
    e.preventDefault();
    try {
      const loginUser = { emailaddress, password };
      const loginResponse = await axios.post(
        "/users/login",
        loginUser
      );
      setUserData({
        token: loginResponse.data.token,
        user: loginResponse.data.user,
      });
      localStorage.setItem("auth-token", loginResponse.data.token);
      history.push("/");
    } catch (err) {
      err.response.data.msg && setError(err.response.data.msg);
    }
  };

  return (
    <div className="container">
      <h2>Login</h2>
      {error && (
        <ErrorNotice message={error} clearError={() => setError(undefined)} />
      )}
      <form onSubmit={submit}>
        <div className="form-group">
          <label htmlFor="emailaddress">Email address</label>
          <input
            type="email"
            id="emailaddress"
            className="form-control"
            placeholder="Enter Emailaddress"
            onChange={(e) => setEmailaddress(e.target.value)}
          />
          <small id="emailHelp" className="form-text text-muted">
            We'll never share your email with anyone else.
          </small>
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            className="form-control"
            placeholder="Enter Password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary cmscolor">
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;
