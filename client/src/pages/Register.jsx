import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import "./Register.css";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await API.post("/auth/signup", formData);

      // IMPORTANT: check backend response
      if (res.status === 201 || res.status === 200) {
        alert("Registered Successfully");
        navigate("/");
      }

    } catch (error) {
      console.log(error);

      setError(
        error.response?.data?.message || "Registration Failed"
      );
    }
  };

  return (
    <div className="register-page">

      {/* Top Left Login Button */}
      <button
        className="login-btn"
        type="button"
        onClick={() => navigate("/")}
      >
        Login
      </button>

      <div className="register-box">
        <h1>Register</h1>

        {error && <p className="error-text">{error}</p>}

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Enter Name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Enter Email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Enter Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <button type="submit">
            Register
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;