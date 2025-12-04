import React, { useEffect, useState } from 'react';

export function Stat() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadGames() {
    try {
      const res = await fetch("/api/nba");
      const data = await res.json();
      setGames(data.games || []);
    } catch (err) {
      console.error("Failed to load games", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadGames();

    // Optional auto-refresh every 30 seconds
    const interval = setInterval(loadGames, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <p>Loading games...</p>;

  if (games.length === 0)
    return <p>No NBA games found for today.</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>NBA Scoreboard</h2>

      {games.map((g) => (
        <div
          key={g.id}
          style={{
            border: "1px solid #ccc",
            borderRadius: "8px",
            padding: "12px",
            marginBottom: "12px",
            background:
              g.state === "in"
                ? "#ffe5e5"          // live games highlighted
                : g.state === "post"
                ? "#f0f0f0"          // finished games grey
                : "white",           // upcoming games normal
          }}
        >
          <h3 style={{ margin: "0 0 8px 0" }}>
            {g.home.name} vs {g.away.name}
          </h3>

          <p style={{ margin: 0 }}>
            <strong>Status:</strong> {g.status}
          </p>

          <p style={{ margin: 0 }}>
            <strong>{g.home.name}</strong>: {g.home.score}
            <br />
            <strong>{g.away.name}</strong>: {g.away.score}
          </p>
        </div>
      ))}
    </div>
  );
}
