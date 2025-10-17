import React from 'react';

export function Login() {
  return (
    <main>
      <section>
        <h2>Play Ball</h2>
        <p>Please login</p>
        <div><label for="text">Username: </label>
          <input type="text" id="text" name="varText" placeholder="name" required pattern="[Aa].*" />
        </div>
        <div>
          <label for="password">Password: </label>
          <input type="password" id="password" name="varPassword"/>
        </div>
        <div>
          <button type="submit">Login</button>
        </div>
      </section>
      <aside>
      </aside>
    </main>
  );
}