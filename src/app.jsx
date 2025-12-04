import  { TempSocket } from './websocket/TempSocket.jsx';
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './login.css';

import { 
  BrowserRouter, 
  NavLink, 
  Route, 
  Routes, 
  Navigate, 
  useLocation 
} from 'react-router-dom';

import { Login } from './login';
import { About } from './about/about';
import { Newgame } from './newgame/newgame';
import PastGames from './pastgames/pastgames.jsx';
import { Stat } from './stat/stat';
import { View } from './view/view';

export default function App() {
  return (
    <BrowserRouter>
      <MainLayout />
    </BrowserRouter>
  );
}

function MainLayout() {
  const location = useLocation();

  // Hide header & footer on login page
  const hideChrome = location.pathname === '/login';
  React.useEffect(() => {
    if (location.pathname === "/login") {
      document.body.classList.add("login-mode");
    } else {
      document.body.classList.remove("login-mode");
    }
  }, [location.pathname]);
  return (
    <div className="body bg-dark text-light">

      {!hideChrome && (
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
      )}

      <Routes>
        {/* Homepage → login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route path="/login" element={<Login />} />
        <Route path="/view" element={<View />} />
        <Route path="/newgame" element={<Newgame />} />
        <Route path="/pastgames" element={<PastGames />} />
        <Route path="/about" element={<About />} />
        <Route path="/stat" element={<Stat />} />
        <Route path="/ws-test" element={<TempSocket />} />
        <Route path="*" element={<NotFound />} />
      </Routes>

      {!hideChrome && (
        <footer>
          <p>Author Name(s): Andrew Smith</p>
          <div><a href="https://github.com/Supersmith1000/startup">GitHub</a></div>
        </footer>
      )}
    </div>
  );
}

function NotFound() {
  return (
    <main className="container-fluid bg-secondary text-center">
      404: Return to sender. Address unknown.
    </main>
  );
}
