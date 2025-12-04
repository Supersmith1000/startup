import React, { useState } from "react";
import ScoreboardController from "../scoreboard/ScoreboardController.jsx";

export function Newgame() {
  const [team1, setTeam1] = useState("");
  const [team2, setTeam2] = useState("");
  const [players1, setPlayers1] = useState("");
  const [players2, setPlayers2] = useState("");
  const [message, setMessage] = useState("");

  const [activeGameId, setActiveGameId] = useState(null);
  const [activeTeam1, setActiveTeam1] = useState("");
  const [activeTeam2, setActiveTeam2] = useState("");

  function generateGameId() {
    return Math.random().toString(36).substring(2, 10).toUpperCase();
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!team1 || !team2) {
      setMessage("❌ Please enter both team names.");
      return;
    }

    const gameId = generateGameId();

    setMessage(`✅ Game created! ID: ${gameId}`);

    // Store active game info
    setActiveGameId(gameId);
    setActiveTeam1(team1);
    setActiveTeam2(team2);

    // Reset the form
    setTeam1("");
    setTeam2("");
    setPlayers1("");
    setPlayers2("");
  };

  return (
    <main style={{ padding: "20px" }}>
      <section>
        <h2>Create New Game</h2>

        <form onSubmit={handleSubmit}>
          <div>
            <label>Team 1:</label>
            <input
              value={team1}
              onChange={(e) => setTeam1(e.target.value)}
              required
            />
          </div>

          <div>
            <label>Team 2:</label>
            <input
              value={team2}
              onChange={(e) => setTeam2(e.target.value)}
              required
            />
          </div>

          <h3>Player Names (comma-separated)</h3>

          <div>
            <label>Team 1 Players:</label>
            <textarea
              value={players1}
              onChange={(e) => setPlayers1(e.target.value)}
            />
          </div>

          <div>
            <label>Team 2 Players:</label>
            <textarea
              value={players2}
              onChange={(e) => setPlayers2(e.target.value)}
            />
          </div>

          <button type="submit">Start Game</button>
        </form>

        {message && <p>{message}</p>}
      </section>

      {activeGameId && (
        <aside style={{ marginTop: "30px" }}>
          <h3>Live Scoreboard (Controller)</h3>
          <ScoreboardController
            gameId={activeGameId}
            team1={activeTeam1}
            team2={activeTeam2}
          />
        </aside>
      )}
    </main>
  );
}
