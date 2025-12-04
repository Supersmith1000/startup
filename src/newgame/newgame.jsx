import React, { useState } from 'react';
import Scoreboard from '../scoreboard.jsx';
import { saveGame } from '../gamesService';

export function Newgame() {
  const [team1, setTeam1] = useState('');
  const [team2, setTeam2] = useState('');
  const [players1, setPlayers1] = useState('');
  const [players2, setPlayers2] = useState('');
  const [message, setMessage] = useState('');

  const [activeGameId, setActiveGameId] = useState(null);

  function generateGameId() {
    return Math.random().toString(36).substring(2, 10).toUpperCase();
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!team1 || !team2) {
      setMessage('❌ Please enter both team names.');
      return;
    }

    const team1Players = players1.split(',').map(p => p.trim()).filter(Boolean);
    const team2Players = players2.split(',').map(p => p.trim()).filter(Boolean);

    const gameId = generateGameId();

    const newGame = {
      id: gameId,
      team1,
      team2,
      team1Players,
      team2Players,
      score1: 0,
      score2: 0
    };

    try {
      await saveGame("System", `${team1} vs ${team2}`, 0);

      setMessage(`✅ Game created! ID: ${gameId}`);

      // Show the live scoreboard
      setActiveGameId(gameId);

      // Reset form
      setTeam1('');
      setTeam2('');
      setPlayers1('');
      setPlayers2('');

    } catch (err) {
      console.error(err);
      setMessage('❌ Could not save game.');
    }
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
          <h3>Live Scoreboard</h3>
          <Scoreboard gameId={activeGameId} />
        </aside>
      )}
    </main>
  );
}
