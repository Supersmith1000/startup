import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();   // ✅ <-- YOU NEED THIS

  async function handleSubmit(e) {
    e.preventDefault();

    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/create';

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        setMessage(`✅ Welcome, ${data.email}`);

        // 🚀 REDIRECT USER AFTER LOGIN
        navigate('/view');  // <-- THIS FIXES THE PROBLEM

        return;
      } else {
        const err = await response.json().catch(() => ({}));
        setMessage(`❌ ${err.msg || 'Login failed'}`);
      }
    } catch {
      setMessage('⚠️ Network error — please try again.');
    }
  }

  async function handleLogout() {
    try {
      const res = await fetch('/api/auth/logout', {
        method: 'DELETE',
        credentials: 'include',
      });
      setMessage(res.ok ? '👋 Logged out' : '⚠️ Logout failed');
    } catch {
      setMessage('⚠️ Logout failed');
    }
  }

  return (
    <div id="login-page" className="login-box">

      <h2 className="login-title">{isLogin ? 'Login' : 'Create Account'}</h2>
      <p className="login-sub">{isLogin ? 'Please log in' : 'Sign up to get started'}</p>

      <form onSubmit={handleSubmit} className="login-form">

        <label htmlFor="email" className="login-label">Email</label>
        <input
          type="email"
          id="email"
          className="login-input"
          placeholder="name@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label htmlFor="password" className="login-label">Password</label>
        <input
          type="password"
          id="password"
          className="login-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" className="login-btn primary-btn">
          {isLogin ? 'Login' : 'Create Account'}
        </button>
      </form>

      <div className="login-toggle">
        {isLogin ? "Don't have an account?" : 'Already registered?'}{' '}
        <button
          className="link-btn"
          onClick={() => {
            setIsLogin(!isLogin);
            setMessage('');
          }}
        >
          {isLogin ? 'Create one' : 'Login'}
        </button>
      </div>

      <button type="button" className="secondary-btn" onClick={handleLogout}>
        Logout
      </button>

      {message && <p className="login-message">{message}</p>}
    </div>
  );
}
