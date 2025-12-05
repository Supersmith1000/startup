import React, { useState, useEffect, useRef } from "react";

export default function ScoreboardViewer({ gameId }) {

  // 🔥 DEBUG LOGS — REQUIRED
  const wsUrl =
    window.location.hostname === "localhost"
      ? `ws://localhost:4000/ws?gameId=${gameId}`
      : `wss://startup.who-1.com/ws?gameId=${gameId}`;

  console.log("Viewer mounted with gameId:", gameId);
  console.log("Connecting to WS URL:", wsUrl);

  const [teamOneScore, setTeamOneScore] = useState(0);
  const [teamTwoScore, setTeamTwoScore] = useState(0);
  const wsRef = useRef(null);

  useEffect(() => {
    console.log("Viewer connecting to:", wsUrl);

    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("Viewer WS connected for game:", gameId);
    };

    ws.onmessage = (msg) => {
      console.log("Viewer received WS message:", msg.data);

      const data = JSON.parse(msg.data);

      if (data.type === "score_update" && data.gameId === gameId) {
        console.log("✔ Updating viewer scores:", data);
        setTeamOneScore(data.team1);
        setTeamTwoScore(data.team2);
      }
    };

    ws.onerror = (err) => console.log("Viewer WS error:", err);
    ws.onclose = () => console.log("Viewer WS closed");

    return () => ws.close();
  }, [gameId]);

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>WHO-1 Live Scoreboard</h1>
      <h3>Game ID: {gameId}</h3>

      <div style={{ display: "flex", justifyContent: "center", gap: "60px" }}>
        <div>
          <h2>Team 1: {teamOneScore}</h2>
        </div>

        <div>
          <h2>Team 2: {teamTwoScore}</h2>
        </div>
      </div>
    </div>
  );
}
