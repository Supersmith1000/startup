import React from "react";
import {
  BrowserRouter,
  NavLink,
  Route,
  Routes,
  Navigate,
  useLocation,
} from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import "./app.css";

import { Login } from "./login";
import { About } from "./about/about";
import { Newgame } from "./newgame/newgame";
import PastGames from "./pastgames/pastgames.jsx";
import { Stat } from "./stat/stat";
import { View } from "./view/view";
import { TempSocket } from "./websocket/TempSocket.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <MainLayout />
    </BrowserRouter>
  );
}

function MainLayout() {
  const location = useLocation();
  const hideChrome = location.pathname === "/login";

  return (
    <div className="app-root">

      {!hideChrome && (
        <header className="app-header">
          <h1 className="app-title">WHO-1</h1>

          <nav className="app-nav">
            <NavLink to="/login">Login</NavLink>
            <NavLink to="/view">View Games</NavLink>
            <NavLink to="/newgame">New Game</NavLink>
            <NavLink to="/pastgames">Past Games</NavLink>
            <NavLink to="/stat">Stats</NavLink>
            <NavLink to="/about">About</NavLink>
            <NavLink to="/ws-test">WS Test</NavLink>
          </nav>
        </header>
      )}

      <main className="app-content">
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/view" element={<View />} />
          <Route path="/newgame" element={<Newgame />} />
          <Route path="/pastgames" element={<PastGames />} />
          <Route path="/stat" element={<Stat />} />
          <Route path="/about" element={<About />} />
          <Route path="/ws-test" element={<TempSocket />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {!hideChrome && (
        <footer className="app-footer">
          <p>Author: Andrew Smith</p>
        </footer>
      )}
    </div>
  );
}

function NotFound() {
  return (
    <div className="not-found">
      404: Return to sender. Address unknown.
    </div>
  );
}
