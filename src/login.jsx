import React, { useState } from 'react';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLogin, setIsLogin] = useState(true); // toggle between login/create

  async function handleSubmit(e) {
    e.preventDefault();

    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/create';

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // keep auth cookie
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        setMessage(`✅ Welcome, ${data.email}`);
        setEmail('');
        setPassword('');
      } else {
        const err = await response.json();
        setMessage(`❌ ${err.msg || 'Login failed'}`);
      }
    } catch {
      setMessage('⚠️ Network error — is the backend running?');
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
            <button type="submit">{isLogin ? 'Login' : 'Create Account'}</button>
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

        {message && <p>{message}</p>}
      </section>
      <aside></aside>
    </main>
  );
}