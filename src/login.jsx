import React, { useState } from 'react';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLogin, setIsLogin] = useState(true);

  async function handleSubmit(e) {
    e.preventDefault();

    const base = 'http://localhost:3000';
    const endpoint = isLogin
      ? `${base}/api/auth/login`
      : `${base}/api/auth/create`;

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
        setEmail('');
        setPassword('');
      } else {
        const err = await response.json().catch(() => ({}));
        setMessage(`❌ ${err.msg || 'Login failed'}`);
      }
    } catch {
      setMessage('⚠️ Network error — is the backend running on 3000?');
    }
  }

  async function handleLogout() {
    try {
      const res = await fetch('http://localhost:3000/api/auth/logout', {
        method: 'DELETE',
        credentials: 'include',
      });
      if (res.ok) setMessage('👋 Logged out');
      else setMessage('⚠️ Logout failed');
    } catch {
      setMessage('⚠️ Logout failed');
    }
  }

  return (
    <main>
      <section>
        <h2>{isLogin ? 'Login' : 'Create Account'}</h2>
        <p>{isLogin ? 'Please log in' : 'Sign up to get started'}</p>

        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div>
            <button type="submit">
              {isLogin ? 'Login' : 'Create Account'}
            </button>
          </div>
        </form>

        <p>
          {isLogin ? "Don't have an account?" : 'Already registered?'}{' '}
          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setMessage('');
            }}
          >
            {isLogin ? 'Create one' : 'Login'}
          </button>
        </p>

        <button type="button" onClick={handleLogout}>
          Logout
        </button>

        {message && <p>{message}</p>}
      </section>
      <aside></aside>
    </main>
  );
}
