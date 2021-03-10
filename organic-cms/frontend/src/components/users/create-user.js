import React, { useEffect, useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import UserContext from "../../context/userContext";
import ErrorNotice from "../misc/errorNotice";

//Enum for Status Dropdown
const statusEnums = {
  active: {
    id: "1",
    name: "Active",
  },
  inActive: {
    id: "0",
    name: "Inactive",
  },
};

// Purpose: Create user 
// Created By: CIPL
function CreateUser(props) {
  const [id, setId] = useState(props.match.params.id);
  const [name, setName] = useState();
  const [emailaddress, setEmailaddress] = useState();
  const [password, setPassword] = useState();
  const [passwordCheck, setPasswordCheck] = useState();
  const [status, setStatus] = useState(statusEnums.active.id);
  const handleChange = (event) => {
    setStatus(event.target.value);
  };
  const [error, setError] = useState();

  const { userData } = useContext(UserContext);
  const history = useHistory();

  //Check user is Loggedin or not
  useEffect(() => {
    if (!userData.user) {
      history.push("/login");
    }
    else{
      createOrEditUser();
    }
    
  }, []);

    //Edit User details for Update User
  const createOrEditUser = async () => {
    if (id) {
        axios
      .get("/users/"+ id, {
        headers: { "x-auth-token": userData.token },
      })
      .then((response) => {
          console.log(response.data.name)
        if(response){
            setName(response.data.name);
            setEmailaddress(response.data.emailaddress);
            setStatus(response.data.status ? "1" : "0");
          }
      })
      .catch((err) => {
        err && setError(err);
      });
    }
  };

    //User Submit Event
  const submit = async (e) => {
    e.preventDefault();

    try {
      const newUser = {
        name,
        emailaddress,
        password,
        passwordCheck,
        status,
        createdBy: userData.user.id,
      };
      if (id) {
        await axios.post("/users/update/" + id, newUser, {
          headers: { "x-auth-token": userData.token },
        });
      } else {
        await axios.post("/users/add", newUser, {
          headers: { "x-auth-token": userData.token },
        });
      }

      history.push("/");
    } catch (err) {
      err.response.data.msg && setError(err.response.data.msg);
    }
  };

  const back = () => history.push("/");

  return (
    <div className="container">
      <h4 className="mt-3">
      {id ? 'Update User' : 'Create User'}
        <div className="float-right mb-3 ">
          <button
            type="button"
            className="btn btn-primary cmscolor"
            onClick={back}
          >
            Back
          </button>
        </div>
      </h4>
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
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="emailaddress">Email address</label>
          <input
            type="email"
            id="emailaddress"
            value={emailaddress}
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
            className="form-control"
            placeholder="Enter Password"
            autoComplete="new-password"
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
        <div className="form-group">
          <label htmlFor="status">Status</label>
          <select
            id="status"
            value={status}
            onChange={handleChange}
            className="form-control"
          >
            {Object.keys(statusEnums).map((key) => (
              <option key={key} value={statusEnums[key].id}>
                {statusEnums[key].name}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className="btn btn-primary cmscolor">
         {id ? 'Update' : 'Create'}
        </button>
      </form>
    </div>
  );
}

export default CreateUser;
