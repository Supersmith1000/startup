import React from 'react';

export function View() {
  return (
    <main>
    <section>
      <h2>Live Game</h2>
      <div><label for="text">Game ID#: </label>
        <input type="text" id="text" name="varText" placeholder="##" required pattern="[Aa].*" />
      </div>
      <div>
        <button type="submit">Search</button>
      </div>
    </section>
    <aside>
    </aside>
  </main>
  );
}