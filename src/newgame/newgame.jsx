import React from 'react';
import Scoreboard from './Scoreboard';

export function Newgame() {
  return (
     <main>
    <section>
      <h2>Add teams</h2>
      <p>Please login</p>
      <div><label for="text">Team 1: </label>
        <input type="text" id="text" name="varText" placeholder="name" required pattern="[Aa].*" />
      </div>
      <div><label for="text">Team 2: </label>
        <input type="text" id="text" name="varText" placeholder="name" required pattern="[Aa].*" />
      </div>
      <h3>Add players names seperated by a comma</h3>
      <div>
         <label for="textarea">Team 1 players names: </label>
         <textarea id="team1" name="varTextarea"></textarea>
      </div>
      <div>
         <label for="textarea">Team 2 players names: </label>
         <textarea id="team2" name="varTextarea"></textarea>
      </div>
      <div>
        <button type="submit">Track Game</button>
      </div>
    </section>
    <aside>
    </aside>
  </main>
  );
}