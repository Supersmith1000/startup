import React, { useState } from 'react';
import Scoreboard from '../scoreboard.jsx';
import { saveGame } from '../gamesService'; // <-- connects to backend/localStorage

export function Newgame() {
  const [team1, setTeam1] = useState('');
  const [team2, setTeam2] = useState('');
  const [players1, setPlayers1] = useState('');
  const [players2, setPlayers2] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // simple validation
    if (!team1 || !team2) {
      setMessage('❌ Please enter both team names.');
      return;
    }

    const team1Players = players1.split(',').map(p => p.trim()).filter(p => p);
    const team2Players = players2.split(',').map(p => p.trim()).filter(p => p);

    // build game object
    const newGame = {
      player: 'System', // or user if logged in
      team: `${team1} vs ${team2}`,
      score: 0,
      team1,
      team2,
      team1Players,
      team2Players
    };

    try {
      const saved = await saveGame(newGame.player, newGame.team, newGame.score);
      setMessage(`✅ Game created: ${team1} vs ${team2}`);
      // reset fields
      setTeam1('');
      setTeam2('');
      setPlayers1('');
      setPlayers2('');
    } catch (err) {
      setMessage('❌ Could not save game.');
    }
  };

  return (
    <main>
      <section>
        <h2>Add Teams</h2>
        <p>Please login</p>

        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="team1">Team 1: </label>
            <input
              type="text"
              id="team1"
              value={team1}
              onChange={(e) => setTeam1(e.target.value)}
              placeholder="name"
              required
            />
          </div>

          <div>
            <label htmlFor="team2">Team 2: </label>
            <input
              type="text"
              id="team2"
              value={team2}
              onChange={(e) => setTeam2(e.target.value)}
              placeholder="name"
              required
            />
          </div>

          <h3>Add player names separated by a comma</h3>

          <div>
            <label htmlFor="team1Players">Team 1 players: </label>
            <textarea
              id="team1Players"
              value={players1}
              onChange={(e) => setPlayers1(e.target.value)}
            ></textarea>
          </div>

          <div>
            <label htmlFor="team2Players">Team 2 players: </label>
            <textarea
              id="team2Players"
              value={players2}
              onChange={(e) => setPlayers2(e.target.value)}
            ></textarea>
          </div>

          <div>
            <button type="submit">Track Game</button>
          </div>
        </form>

        {message && <p>{message}</p>}
      </section>

      <aside>
        {/* You can display <Scoreboard /> here later */}
      </aside>
    </main>
  );
}