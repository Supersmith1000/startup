import React, { useState } from 'react';
import Scoreboard from '../scoreboard.jsx';

export function View() {
  const [gameId, setGameId] = useState("");
  const [activeGameId, setActiveGameId] = useState(null);

  function searchGame() {
    if (gameId.trim() !== "") {
      setActiveGameId(gameId.trim());
    }
  }

  return (
    <main style={{ textAlign: "center", paddingTop: "20px" }}>
      <section>
        <h2>Live Game</h2>

        <div>
          <label>Game ID#: </label>
          <input
            type="text"
            placeholder="##"
            value={gameId}
            onChange={(e) => setGameId(e.target.value)}
          />
        </div>

        <div>
          <button onClick={searchGame}>Search</button>
        </div>
      </section>

      <hr style={{ margin: "20px auto", width: "50%" }} />

      {/* ⭐ SHOW SCOREBOARD WHEN GAME ID FOUND ⭐ */}
      {activeGameId && (
        <Scoreboard gameId={activeGameId} />
      )}
    </main>
  );
}
