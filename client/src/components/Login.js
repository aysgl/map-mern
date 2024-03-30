import axios from "axios";
import React, { useState, useRef } from "react";

const Login = ({ setShowLogin, setCurrentUser, myStorage }) => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const authRef = useRef();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://127.0.0.1:8080/api/users/login",
        formData
      );
      myStorage.setItem("username", res.data.username);
      setCurrentUser(res.data.username);
      setShowLogin(false);
    } catch (err) {
      console.log(err);
    }
  };

  const handleContainerClick = (e) => {
    if (!authRef.current.contains(e.target)) {
      setShowLogin(false);
    }
  };

  return (
    <div className="container" onClick={handleContainerClick}>
      <div className="auth" ref={authRef}>
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
          <input
            autoFocus
            placeholder="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
          />
          <input
            type="password"
            placeholder="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
          <button className="btn" type="submit">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
