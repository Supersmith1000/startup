import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './login.css';

import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import { Login } from './login';
import { About } from './about/about';
import { Newgame } from './newgame/newgame';
import PastGames from './pastgames/pastgames.jsx';
import { Stat } from './stat/stat';
import { View } from './view/view';

export default function App() {
  return (
    <BrowserRouter>
      <div className="body bg-dark text-light">
        <header>
          <h1>WHO-1</h1>
          <p>Features</p>
          <nav>
            <ul>
              <li><NavLink className="nav-btn" to="/login">Login</NavLink></li>
              <li><NavLink className="nav-btn" to="/view">View Games</NavLink></li>
              <li><NavLink className="nav-btn" to="/newgame">New Game</NavLink></li>
              <li><NavLink className="nav-btn" to="/pastgames">View Past Games</NavLink></li>
              <li><NavLink className="nav-btn" to="/stat">Stats</NavLink></li>
              <li><NavLink className="nav-btn" to="/about">About</NavLink></li>
            </ul>
          </nav>
        </header>

        <Routes>
          <Route path='/login' element={<Login />} />
          <Route path='/view' element={<View />} />
          <Route path='/newgame' element={<Newgame />} />
          <Route path='/pastgames' element={<PastGames />} />
          <Route path='/about' element={<About />} />
          <Route path='/stat' element={<Stat />} />

          {/* default / fallback route */}
          <Route path='*' element={<NotFound />} />
        </Routes>

        <footer>
          <p>Author Name(s): Andrew Smith</p>
          <div><a href="https://github.com/Supersmith1000/startup">GitHub</a></div>
        </footer>
      </div>
    </BrowserRouter>
  );
}

function NotFound() {
  return (
    <main className="container-fluid bg-secondary text-center">
      404: Return to sender. Address unknown.
    </main>
  );
}
