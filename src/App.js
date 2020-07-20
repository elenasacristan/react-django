import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [users, setUsers] = useState([]);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [dataUpdated, setDataUpdated] = useState(false);
  const [update, setUpdate] = useState(false);
  const [endPoint, setEndPoint] = useState("/users/");

  useEffect(() => {
    fetch("/users/")
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
        setDataUpdated(false);
      });
  }, [dataUpdated]);

  // we need to create CSRG token to be able to submit data to Django with no error
  const getCookie = (name) => {
    let cookieValue = null;
    if (document.cookie && document.cookie !== "") {
      const cookies = document.cookie.split(";");
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        // Does this cookie string begin with the name we want?
        if (cookie.substring(0, name.length + 1) === name + "=") {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  };

  const handleChangeUser = (e) => {
    setUsername(e.target.value);
  };

  const handleChangeEmail = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const csrftoken = getCookie("csrftoken");

    let newUser = {
      username,
      email,
    };
    setUsername("");
    setEmail("");
    console.log(newUser);

    let url = "/users/";
    let httpMethod = "POST";

    if (update) {
      url = endPoint;
      httpMethod = "PUT";
      setUpdate(false);
    }

    fetch(url, {
      method: httpMethod,
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrftoken,
      },
      body: JSON.stringify(newUser),
    })
      .then((response) => response.json())
      .then((data) => setDataUpdated(true));
  };

  const handleEdit = ({ url, username, email }) => {
    setUsername(username);
    setEmail(email);
    setUpdate(true);
    setEndPoint(url);
    console.log(username, email, url);
  };

  const handleDelete = ({ url }) => {
    const csrftoken = getCookie("csrftoken");
    fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrftoken,
      },
    }).then((data) => setDataUpdated(true));
  };

  return (
    <div className="App container row mx-auto">
      <form className="col-12 col-md-4" onSubmit={handleSubmit}>
        <h4>New User</h4>
        <div className="form-group">
          <label htmlFor="username">User name</label>
          <input
            name="username"
            onChange={handleChangeUser}
            type="text"
            className="form-control"
            id="username"
            value={username}
          />
          <label htmlFor="email">Email address</label>
          <input
            name="email"
            onChange={handleChangeEmail}
            type="email"
            className="form-control"
            id="email"
            value={email}
          />
          <button type="submit " className="mt-4 btn btn-success">
            Save
          </button>
        </div>
      </form>
      <div className="col-12 offset-md-2 col-md-6 list-items">
      <h4>Users list</h4>
        {users.map((user) => (
          <div className="row items" key={user.email}>
            <div className="col-12 col-sm-8">
              <p>{user.username}</p>
            </div>
            <div className="col-6  col-sm-2">
              <button
                onClick={() => handleEdit(user)}
                className="btn btn-primary btn-sm"
              >
                Edit
              </button>
            </div>
            <div className="col-6  col-sm-2 ">
              <button
                onClick={() => handleDelete(user)}
                className="btn btn-danger btn-sm"
              >
                -
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
