import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        setName("");
        setEmail("");
        setPassword("");
        // Optionally navigate to login after successful signup
        navigate("/login");
      } else {
        setMessage(data.message);
      }
    } catch (err) {
      console.error("Fetch failed:", err);
      setMessage("Network error. Check if the server is running.");
    }
  };

  return (
    <div className="sign-up-container">
      <h2>Register</h2>
      <form className="sign-up-form" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name"><strong>Name</strong></label>
          <input
            type="text"
            id="name"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

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

        <button type="submit">Sign Up</button>
      </form>
      {message && <p style={{ color: "#00bcd4", marginTop: "1rem" }}>{message}</p>}
      <div className="already-account">
        <p>Already have an account?</p>
        <Link to="/login" className="form-link-btn">Log In</Link>
      </div>
    </div>
  );
}
