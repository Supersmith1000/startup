import React, { useEffect, useState } from 'react';
import { fetchGames } from './services/gamesService.js';

export default function PastGames() {
  const [query, setQuery] = useState('');
  const [games, setGames] = useState(null);
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const data = await fetchGames();
        if (alive) setGames(data);
      } catch {
        if (alive) setError('Failed to load games.');
      }
    })();
    return () => { alive = false; };
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    if (!games) return;
    const q = query.trim().toLowerCase();
    setResults(games.filter(g => g.id.toLowerCase().includes(q)));
  }

  if (error) return <p className="text-danger">{error}</p>;
  if (games === null) return <p>Loading past games…</p>;

  return (
    <main>
      <section>
        <h2>Search past games</h2>
        <p>Enter Game ID:</p>

        <form onSubmit={handleSubmit} className="d-flex gap-2">
          <label htmlFor="gameId" className="visually-hidden">Game ID</label>
          <input
            id="gameId"
            type="text"
            placeholder="G-101"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            required
          />
          <button type="submit">Search</button>
        </form>

        <hr />

        {results.length ? (
          <ul>
            {results.map(g => (
              <li key={g.id}>
                <strong>{g.id}</strong> — {g.team1} {g.score1} — {g.score2} {g.team2} (Winner: {g.winner})
              </li>
            ))}
          </ul>
        ) : (
          <p>No results yet. Try a valid ID.</p>
        )}
      </section>
      <aside></aside>
    </main>
  );
}
