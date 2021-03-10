import React, { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";
import ErrorNotice from "../misc/errorNotice";
import UserContext from "../../context/userContext";
//Used for Confirmation befor delete
import { confirmAlert } from "react-confirm-alert";
//CSS for Confirmation box
import "react-confirm-alert/src/react-confirm-alert.css";

// Purpose: User List
// Created By: CIPL

//Repeat of User row
const Users = (props) => {
  return (
    <tr>
      <td>{props.user.name}</td>
      <td>{props.user.emailaddress}</td>
      <td>{props.user.status ? "Active" : "Inactive"}</td>
      <td>
        <Link to={"/edituser/" + props.user._id}>edit</Link>
        {props.user._id !== props.loggedinId ? (
          <span>
            &nbsp;|&nbsp;
            <a
              href="#"
              onClick={() => {
                props.deleteUser(props.user._id);
              }}
            >
              delete
            </a>
          </span>
        ) : (
          ""
        )}
      </td>
    </tr>
  );
};

//Get User list
function UsersList() {
  const [error, setError] = useState();
  const [users, setUsers] = useState([]);

  const { userData } = useContext(UserContext);
  const history = useHistory();

  //Check user is Loggedin or not
  useEffect(() => {
    if (!userData.user) {
      history.push("/login");
    } else {
      getUsers();
    }
  }, []);

  const getUsers = async () => {
    axios
      .get("/users/", {
        headers: { "x-auth-token": userData.token },
      })
      .then((response) => {
        setUsers(response.data);
      })
      .catch((err) => {
        err && setError(err);
      });
  };

  const usersList = () => {
    return users.map((currentuser, index) => {
      return (
        <Users
          user={currentuser}
          deleteUser={deleteUsers}
          loggedinId={userData.user.id}
          key={currentuser._id}
        />
      );
    });
  };

  const deleteUsers = (id) => {
    confirmAlert({
      title: "Are you sure?",
      message: "You want to delete this user?",
      buttons: [
        {
          label: "Yes",
          onClick: () => {
            axios
              .delete("/users/" + id, {
                headers: { "x-auth-token": userData.token },
              })
              .then((response) => {
                setError(response.data);
              });

            setUsers(users.filter((el) => el._id !== id));
          },
        },
        {
          label: "No",
          onClick: () => {
            console.log("Click No");
          },
        },
      ],
    });
  };

  const create = () => history.push("/createuser");

  return (
    <div className="container">
      <h4 className="mt-3">
        User List
        <div className="float-right mb-3 ">
          <button
            type="button"
            className="btn btn-primary cmscolor"
            onClick={create}
          >
            Create
          </button>
        </div>
      </h4>
      {error && (
        <ErrorNotice message={error} clearError={() => setError(undefined)} />
      )}

      <table className="table">
        <thead className="thead-light">
          <tr>
            <th>Name</th>
            <th>Emailaddress</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            usersList()
          ) : (
            <tr>
              <td className="text-center" colSpan="4">
                No User found!
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default UsersList;
