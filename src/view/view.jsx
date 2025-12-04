import React, { useState } from "react";
import Scoreboard from "../scoreboard.jsx";

export function View() {
  const [gameId, setGameId] = useState("");
  const [activeGameId, setActiveGameId] = useState(null);

  function searchGame() {
    if (gameId.trim() !== "") {
      setActiveGameId(gameId.trim());
    }
  }

  return (
    <main style={{ textAlign: "center", padding: "40px 0" }}>
      <h2>Live Game</h2>

      <div style={{ marginBottom: "15px" }}>
        <label style={{ marginRight: "6px" }}>Game ID#:</label>
        <input
          type="text"
          placeholder="1234"
          value={gameId}
          onChange={(e) => setGameId(e.target.value)}
        />
      </div>

      <button onClick={searchGame}>Search</button>

      <hr style={{ margin: "30px auto", width: "50%" }} />

      {activeGameId && <Scoreboard gameId={activeGameId} />}
    </main>
  );
}
