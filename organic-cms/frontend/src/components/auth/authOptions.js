import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
import UserContext from "../../context/userContext";
import { Link } from "react-router-dom";

// Purpose: Authenticate User and Show Header Links
// Created By: CIPL
function AuthOptions() {
  const { userData, setUserData } = useContext(UserContext);
  const history = useHistory();

  const register = () => history.push("/register");
  const login = () => history.push("/login");
  const logout = () => {
    setUserData({
      token: undefined,
      user: undefined,
    });
    localStorage.setItem("auth-token", "");
    history.push("/login");
  };

  return (
    <div className="auth-options">
      {userData.user ? (
         <div className="float-right">
          <div className="collpase navbar-collapse">
            <ul className="navbar-nav mr-auto">
            <li className="navbar-item">
                <Link to="/" className="nav-link">
                  Users
                </Link>
              </li>
              <li className="navbar-item">
                <Link to="/pages" className="nav-link">
                  Pages
                </Link>
              </li>
              <li className="navbar-item">
                <button className="btn btn-danger mr-2" onClick={logout}>
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      ) : (
        <div className="float-right">
          <button className="btn btn-secondary mr-2" onClick={register}>
            Sign Up
          </button>
          <button className="btn btn-secondary mr-2" onClick={login}>
            Login
          </button>
        </div>
      )}
    </div>
  );
}

export default AuthOptions;
