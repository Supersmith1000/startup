import React, { useState, useEffect, useRef } from 'react';

export default function Scoreboard({ gameId }) {
  const [teamOneScore, setTeamOneScore] = useState(0);
  const [teamTwoScore, setTeamTwoScore] = useState(0);
  const wsRef = useRef(null);

  // Correct websocket URL
  const wsUrl =
    window.location.hostname === "localhost"
      ? `ws://localhost:4000/ws?gameId=${gameId}`
      : `wss://startup.who-1.com/ws?gameId=${gameId}`;

  useEffect(() => {
    if (!gameId) return;

    console.log("Connecting to:", wsUrl);
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("WS connected for game:", gameId);
    };

    ws.onmessage = (msg) => {
      const data = JSON.parse(msg.data);

      if (data.type === "score_update") {
        setTeamOneScore(data.team1);
        setTeamTwoScore(data.team2);
      }
    };

    ws.onclose = () => {
      console.log("WS disconnected");
    };

    return () => ws.close();
  }, [gameId]);

  // Send score to server → synced to all clients
  function sendScoreUpdate(newOne, newTwo) {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          type: "score_update",
          gameId,
          team1: newOne,
          team2: newTwo,
        })
      );
    }
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
    <div
      className="scoreboard"
      style={{
        textAlign: "center",
        padding: "20px",
        background: "#222",
        color: "white",
        borderRadius: "10px",
        width: "80%",
        margin: "20px auto",
      }}
    >
      <h1>🏀 WHO-1 Scoreboard</h1>
      <h3>Game ID: {gameId}</h3>

      <div
        className="scores"
        style={{
          display: "flex",
          justifyContent: "space-evenly",
          marginTop: "30px",
        }}
      >
        {/* TEAM 1 */}
        <div>
          <h2 style={{ fontSize: "32px" }}>Team 1: {teamOneScore}</h2>
          <button
            onClick={addTeamOne}
            style={{
              padding: "10px 20px",
              fontSize: "20px",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            +1
          </button>
        </div>

        {/* TEAM 2 */}
        <div>
          <h2 style={{ fontSize: "32px" }}>Team 2: {teamTwoScore}</h2>
          <button
            onClick={addTeamTwo}
            style={{
              padding: "10px 20px",
              fontSize: "20px",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            +1
          </button>
        </div>
      </div>
    </div>
  );
}
