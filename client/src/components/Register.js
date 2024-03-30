import axios from "axios";
import React, { useRef, useState } from "react";
import { toast } from "react-toastify";

const Register = ({ setShowRegister }) => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
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
      await axios.post("http://127.0.0.1:8080/api/users/register", formData);
      setShowRegister(false);
    } catch (err) {
      toast.error(err.response.data.message);
      console.log(err.response.data.message);
    }
  };

  const handleContainerClick = (e) => {
    if (!authRef.current.contains(e.target)) {
      setShowRegister(false);
    }
  };

  return (
    <div className="container" onClick={handleContainerClick}>
      <div className="auth" ref={authRef}>
        <h1>Register</h1>
        <form onSubmit={handleSubmit}>
          <input
            autoFocus
            placeholder="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
          />
          <input
            type="email"
            placeholder="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          <input
            type="password"
            min="6"
            placeholder="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
          <button className="btn" type="submit">
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
