import React, { useEffect, useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import UserContext from "../../context/userContext";
import ErrorNotice from "../misc/errorNotice";
import TagsInput from "react-tagsinput";

//Used for keyword added as Tags style
import "react-tagsinput/react-tagsinput.css";

// Purpose: Create Page
// Created By: CIPL
function CreatePage(props) {
  const [id, setId] = useState(props.match.params.id);
  const [title, setTitle] = useState();
  const [content, setContent] = useState();
  const [keywords, setKeywords] = useState([]);
  const [error, setError] = useState();
  const { userData } = useContext(UserContext);
  const history = useHistory();
  useEffect(() => {
    //Check user is Loggedin or not
    if (!userData.user) {
      history.push("/login");
    } else {
      createOrEditPage();
    }
  }, []);

  //Edit Page details for Update Page
  const createOrEditPage = async () => {
    if (id) {
      axios
        .get("/pages/" + id, {
          headers: { "x-auth-token": userData.token },
        })
        .then((response) => {
          if (response) {
            setTitle(response.data.title);
            setContent(response.data.content);
            setKeywords(response.data.keywords);
          }
        })
        .catch((err) => {
          err && setError(err);
        });
    }
  };

  //Page Submit Event
  const submit = async (e) => {
    e.preventDefault();
    try {
      const newPage = {
        title,
        content,
        keywords,
        createdBy: userData.user.id,
      };
      if (id) {
        await axios.post("/pages/update/" + id, newPage, {
          headers: { "x-auth-token": userData.token },
        });
      } else {
        await axios.post("/pages/add", newPage, {
          headers: { "x-auth-token": userData.token },
        });
      }

      history.push("/pages");
    } catch (err) {
      err.response.data.msg && setError(err.response.data.msg);
    }
  };

  const handleChange = (keyword) => {
    setKeywords(keyword);
  };

  const back = () => history.push("/pages");

  return (
    <div className="container">
      <h4 className="mt-3 mb-3">
        {id ? "Update Page" : "Create Page"}
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
          <label htmlFor="name">Title </label>
          <input
            type="text"
            id="name"
            className="form-control"
            placeholder="Enter Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="content">Content</label>
          <textarea
            id="content"
            value={content}
            className="form-control"
            placeholder="Enter Content"
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Keywords</label>
          <TagsInput
            value={keywords}
            onChange={handleChange}
            inputProps={{ placeholder: "Add a keyword" }}
          />
        </div>
        <small id="keywordsHelp" className="form-text text-muted">
          Please press <b>Tab</b> or <b>Enter</b> key to add keyword.
        </small>
        <button type="submit" className="btn btn-primary cmscolor mt-3">
          {id ? "Update" : "Create"}
        </button>
      </form>
    </div>
  );
}

export default CreatePage;
