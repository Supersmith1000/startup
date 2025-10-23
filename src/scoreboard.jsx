import React, { useState, useEffect } from 'react';

export default function Scoreboard() {
  const [teamOneScore, setTeamOneScore] = useState(0);
  const [teamTwoScore, setTeamTwoScore] = useState(0);

  // This runs every time a score changes
  useEffect(() => {
    if (teamOneScore === 10 || teamTwoScore === 10) {
      alert('We have a winner!');
    }
  }, [teamOneScore, teamTwoScore]);

  return (
    <div className="scoreboard">
      <h1>WHO-1 Scoreboard</h1>
      <div className="scores">
        <div>
          <h2>Team 1: {teamOneScore}</h2>
          <button onClick={() => setTeamOneScore(teamOneScore + 1)}>+1</button>
        </div>

        <div>
          <h2>Team 2: {teamTwoScore}</h2>
          <button onClick={() => setTeamTwoScore(teamTwoScore + 1)}>+1</button>
        </div>
      </div>
    </div>
  );
}