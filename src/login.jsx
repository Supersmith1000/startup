import React, { useState, useEffect } from "react";
import "./login.css";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLogin, setIsLogin] = useState(true); // 🔥 toggle between login/signup

  useEffect(() => {
    document.body.classList.add("login-mode");
    return () => document.body.classList.remove("login-mode");
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");

    const endpoint = isLogin ? "/api/auth/login" : "/api/auth/create";

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        setMessage(isLogin ? "Invalid login." : "Account creation failed.");
        return;
      }

      setMessage(isLogin ? "Logged in!" : "Account created!");
      document.body.classList.remove("login-mode");
      window.location.href = "/view";
    } catch (err) {
      setMessage("Server error.");
    }
  }

  return (
    <div className="login-box">
      <h2 className="login-title">{isLogin ? "Login" : "Create Account"}</h2>
      <p className="login-sub">
        {isLogin ? "Please log in" : "Make a new account"}
      </p>

      <form className="login-form" onSubmit={handleSubmit}>
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
          {isLogin ? "Login" : "Create Account"}
        </button>
      </form>

      <button
        className="link-btn"
        onClick={() => setIsLogin(!isLogin)}
      >
        {isLogin ? "Create one" : "Already have an account?"}
      </button>

      {message && <div className="login-message">{message}</div>}
    </div>
  );
}
