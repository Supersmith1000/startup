import React, { useState, useEffect, useRef } from "react";

export default function ScoreboardController({ gameId }) {
  const [teamOneScore, setTeamOneScore] = useState(0);
  const [teamTwoScore, setTeamTwoScore] = useState(0);
  const wsRef = useRef(null);

  const wsUrl =
    window.location.hostname === "localhost"
      ? `ws://localhost:4000/ws?gameId=${gameId}`
      : `wss://startup.who-1.com/ws?gameId=${gameId}`;

  useEffect(() => {
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("WS CONTROLLER CONNECTED:", gameId);
    };

    ws.onerror = (err) => {
      console.error("WS CONTROLLER ERROR:", err);
    };

    ws.onclose = () => {
      console.log("WS CONTROLLER CLOSED");
    };

    return () => ws.close();
  }, [gameId]);

  function sendScoreUpdate(one, two) {
    console.log("SENDING SCORE UPDATE:", { one, two, ws: wsRef.current });
    wsRef.current?.send(
      JSON.stringify({
        type: "score_update",
        gameId,
        team1: one,
        team2: two,
      })
    );
  }

  function addTeamOne() {
    const newScore = teamOneScore + 1;
    setTeamOneScore(newScore);
    sendScoreUpdate(newScore, teamTwoScore);
  }

  function addTeamTwo() {
    const newScore = teamTwoScore + 1;
    setTeamTwoScore(newScore);
    sendScoreUpdate(teamOneScore, newScore);
  }

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>WHO-1 Scoreboard (Controller)</h1>
      <h3>Game ID: {gameId}</h3>

      <div style={{ display: "flex", justifyContent: "center", gap: "40px" }}>
        <div>
          <h2>Team 1: {teamOneScore}</h2>
          <button onClick={addTeamOne}>+1</button>
        </div>

        <div>
          <h2>Team 2: {teamTwoScore}</h2>
          <button onClick={addTeamTwo}>+1</button>
        </div>
      </div>
    </div>
  );
}
