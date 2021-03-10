import React, { useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import UserContext from "../../context/userContext";
import ErrorNotice from "../misc/errorNotice";

// Purpose: Register User Page
// Created By: CIPL
function Register() {
  const [name, setName] = useState();
  const [emailaddress, setEmailaddress] = useState();
  const [password, setPassword] = useState();
  const [passwordCheck, setPasswordCheck] = useState();
  const [error, setError] = useState();

  const { setUserData } = useContext(UserContext);
  const history = useHistory();

  //Register user submit event
  const submit = async (e) => {
    e.preventDefault();

    try {
      const newUser = { name, emailaddress, password, passwordCheck };
      await axios.post("/users/register", newUser);
      const loginResponse = await axios.post(
        "/users/login",
        {
          emailaddress,
          password,
        }
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
      <h2>Register</h2>
      {error && (
        <ErrorNotice message={error} clearError={() => setError(undefined)} />
      )}
      <form onSubmit={submit}>
        <div className="form-group">
          <label htmlFor="name">Name </label>
          <input
            type="text"
            id="name"
            className="form-control"
            placeholder="Enter Name"
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="emailaddress">Email address</label>
          <input
            type="email"
            id="emailaddress"
            className="form-control"
            placeholder="Enter Emailaddress"
            onChange={(e) => setEmailaddress(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            autoComplete="new-password"
            className="form-control"
            placeholder="Enter Password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            className="form-control"
            autoComplete="new-password"
            placeholder="Enter Confirm Password"
            onChange={(e) => setPasswordCheck(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary cmscolor">
          Register
        </button>
      </form>
    </div>
  );
}

export default Register;
