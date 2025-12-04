import React, { useState, useEffect } from "react";
import "./login.css";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  // 🔥 Enable special background mode for login
  useEffect(() => {
    document.body.classList.add("login-mode");
    return () => document.body.classList.remove("login-mode");
  }, []);

  async function loginUser(e) {
    e.preventDefault();
    setMessage("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        setMessage("Invalid login.");
        return;
      }

      setMessage("Logged in!");
      document.body.classList.remove("login-mode");
      window.location.href = "/view";
    } catch (err) {
      setMessage("Server error.");
    }
  }

  return (
    <div className="login-box">
      <h2 className="login-title">Login</h2>
      <p className="login-sub">Please log in</p>

      <form className="login-form" onSubmit={loginUser}>
        <label className="login-label">Email</label>
        <input
          className="login-input"
          type="email"
          placeholder="name@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label className="login-label">Password</label>
        <input
          className="login-input"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="primary-btn" type="submit">
          Login
        </button>
      </form>

      <button
        className="link-btn"
        onClick={() => alert("Signup coming soon!")}
      >
        Create one
      </button>

      {message && <div className="login-message">{message}</div>}
    </div>
  );
}
