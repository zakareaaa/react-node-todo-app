import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch("http://localhost:8000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        // Pass the whole user object to TodoList
        navigate("/todos", { state: { user: data.user } });
        setEmail("");
        setPassword("");
      } else {
        setMessage(data.message);
      }
    } catch (err) {
      console.error("Fetch failed:", err);
      setMessage("Network error. Check if the server is running.");
    }
  };

  return (
    <div className="login-container">
      <h2>Log In</h2>
      <form className="login-form" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email"><strong>Email</strong></label>
          <input
            type="email"
            id="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="password"><strong>Password</strong></label>
          <input
            type="password"
            id="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit">Log In</button>
      </form>
      {message && <p style={{ color: "#00bcd4", marginTop: "1rem" }}>{message}</p>}
      <div className="no-account">
        <p>Don’t have an account?</p>
        <Link to="/signup" className="form-link-btn">Sign Up</Link>
      </div>
    </div>
  );
}
