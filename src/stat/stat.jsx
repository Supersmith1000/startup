import React, { useEffect, useState } from 'react';

export function Stat() {
  const [games, setGames] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadGames() {
      try {
        // 👇 Directly call your Express backend on port 3000
        const response = await fetch('/api/nba', {
        credentials: 'include',
      });


        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();
        setGames(data.data || []);
      } catch (err) {
        console.error('Failed to load NBA data:', err);
        setError('❌ Unable to load live NBA games.');
      }
    }

    loadGames();
  }, []);

  if (error) return <p className="text-danger">{error}</p>;
  if (!games.length) return <p>Loading live NBA games…</p>;

  return (
    <main className="p-4">
      <h2>🏀 Live NBA Games</h2>
      <ul className="list-unstyled">
        {games.map((g) => (
          <li
            key={g.id}
            className="border rounded p-3 my-2 bg-dark text-light"
          >
            <strong>{g.visitor_team.full_name}</strong> vs{' '}
            <strong>{g.home_team.full_name}</strong>
            <div>
              Tip-off:{' '}
              {new Date(g.datetime).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </div>
            <div>
              Status: {g.status.includes('T') ? 'Scheduled' : g.status}
            </div>
            <div>
              Score: {g.visitor_team_score} - {g.home_team_score}
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
