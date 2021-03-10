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

// Purpose: Page List
// Created By: CIPL

//Repeat of Page row
const Pages = (props) => (
  <tr>
    <td>{props.page.title}</td>
    <td>{props.page.content}</td>
    <td>
      {props.page.keywords.map((keyword) => {
        return <span className="react-tagsinput-tag">{keyword}</span>;
      })}
    </td>
    <td>
      <Link to={"/editpage/" + props.page._id}>edit</Link> |{" "}
      <a
        href="#"
        onClick={() => {
          props.deletePage(props.page._id);
        }}
      >
        delete
      </a>
    </td>
  </tr>
);

//Get Page list
function PagesList() {
  const [error, setError] = useState();
  const [pages, setPages] = useState([]);

  const { userData } = useContext(UserContext);
  const history = useHistory();

  //Check user is Loggedin or not
  useEffect(() => {
    if (!userData.user) {
      history.push("/login");
    } else {
      getPages();
    }
  }, []);

  const getPages = async () => {
    axios
      .get("/pages/", {
        headers: { "x-auth-token": userData.token },
      })
      .then((response) => {
        setPages(response.data);
      })
      .catch((err) => {
        err && setError(err);
      });
  };

  const pagesList = () => {
    return pages.map((currentpage) => {
      return (
        <Pages
          page={currentpage}
          deletePage={deletePages}
          key={currentpage._id}
        />
      );
    });
  };

  const deletePages = (id) => {
    confirmAlert({
      title: "Are you sure?",
      message: "You want to delete this page?",
      buttons: [
        {
          label: "Yes",
          onClick: () => {
            axios
              .delete("/pages/" + id, {
                headers: { "x-auth-token": userData.token },
              })
              .then((response) => {
                setError(response.data);
              });

            setPages(pages.filter((el) => el._id !== id));
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

  const create = () => history.push("/createpage");

  return (
    <div className="container">
      <h4 className="mt-3">
        Page List
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
            <th>Title</th>
            <th>Content</th>
            <th>Keywords</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {pages.length > 0 ? (
            pagesList()
          ) : (
            <tr>
              <td className="text-center" colSpan="4">
                No Page found!
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default PagesList;
