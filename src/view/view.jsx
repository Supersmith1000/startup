import React, { useState } from 'react';
import Scoreboard from '../scoreboard.jsx';

export function View() {
  const [gameId, setGameId] = useState('');
  const [activeGame, setActiveGame] = useState(null);

  function handleSearch() {
    if (!gameId.trim()) {
      alert("Please enter a valid Game ID");
      return;
    }
    setActiveGame(gameId.trim());
  }

  return (
    <main style={{ textAlign: "center", padding: "20px" }}>
      <section>
        <h2>Live Game Viewer</h2>

        <div style={{ marginBottom: "15px" }}>
          <label htmlFor="text">Game ID#: </label>
          <input
            type="text"
            id="text"
            name="varText"
            placeholder="Enter Game ID"
            value={gameId}
            onChange={(e) => setGameId(e.target.value)}
            style={{ marginLeft: "10px", padding: "5px" }}
          />
        </div>

        <div>
          <button onClick={handleSearch}>Search</button>
        </div>
      </section>

      <aside style={{ marginTop: "30px" }}>
        {activeGame && (
          <div>
            <h3>Viewing Live Game: {activeGame}</h3>
            <Scoreboard gameId={activeGame} />
          </div>
        )}
      </aside>
    </main>
  );
}
