import React, { useEffect, useState } from 'react';
import { fetchGames } from "../gamesService.js";

export default function PastGames() {
  const [query, setQuery] = useState('');
  const [games, setGames] = useState([]);
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const data = await fetchGames();
        if (alive) {
          setGames(data);
          setLoading(false);
        }
      } catch (err) {
        if (alive) {
          setError('❌ Failed to load games.');
          setLoading(false);
        }
      }
    })();
    return () => { alive = false; };
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    if (!games.length) return;

    const q = query.trim().toLowerCase();
    const filtered = games.filter((g) =>
      String(g.id || '').toLowerCase().includes(q)
    );
    setResults(filtered);
  }

  if (loading) return <p>Loading past games…</p>;
  if (error) return <p className="text-danger">{error}</p>;

  const displayGames = results.length ? results : games;

  return (
    <main>
      <section>
        <h2>Search Past Games</h2>
        <p>Enter a Game ID:</p>

        <form onSubmit={handleSubmit} className="d-flex gap-2">
          <label htmlFor="gameId" className="visually-hidden">Game ID</label>
          <input
            id="gameId"
            type="text"
            placeholder="e.g. 1"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit">Search</button>
        </form>

        <hr />

        {displayGames.length ? (
          <ul>
            {displayGames.map((g) => (
              <li key={g.id || g.date}>
                <strong>ID {g.id}</strong> — 
                <span> {g.team || `${g.team1 ?? ''} vs ${g.team2 ?? ''}`} </span> — 
                <span>Score: {g.score ?? 'N/A'}</span> — 
                <span>{new Date(g.date).toLocaleString()}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p>No games found.</p>
        )}
      </section>
      <aside></aside>
    </main>
  );
}
