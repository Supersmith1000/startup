import React from 'react';

export function Pastgames() {
  return (
    <main>
    <section>
      <h2>Search past games</h2>
      <p>Please enter game ID#:</p>
      <div><label for="text">Username: </label>
        <input type="text" id="text" name="varText" placeholder="name" required pattern="[Aa].*" />
      </div>
      <div>
        <button type="submit">Search</button>
      </div>
      <p>This will be the database feature</p>
    </section>
    <aside>
    </aside>
  </main>
  );
}