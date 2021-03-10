import React, { useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import UserContext from "../../context/userContext";
import UsersList from "../users/users-list";
import { Link } from "react-router-dom";

// Purpose: Home page
// Created By: CIPL
function Home() {
  const { userData } = useContext(UserContext);
  const history = useHistory();

  useEffect(() => {
    if (!userData.user) history.push("/login");
  }, []);
  
  return (
    <div>
      {userData.user ? (
                <UsersList />
            ) : (
                <>
                    <h2>You are not logged in</h2>
                    <Link to="/login">Login</Link>
                </>
            )}

      
    </div>
  );
}

export default Home;
