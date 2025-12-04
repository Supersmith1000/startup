import React from "react";
import {
  BrowserRouter,
  NavLink,
  Route,
  Routes,
  Navigate,
  useLocation
} from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import "./login.css";

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

  // Hide header/footer on login page
  const hideChrome = location.pathname === "/login";

  return (
    <div className="app-container bg-dark text-light" style={{ minHeight: "100vh" }}>
      
      {/* ----- HEADER ----- */}
      {!hideChrome && (
        <header className="text-center" style={{ padding: "20px 0" }}>
          <h1 style={{ marginBottom: "5px" }}>WHO-1</h1>
          <p style={{ marginBottom: "15px" }}>Features</p>

          <nav>
            <ul
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "15px",
                flexWrap: "wrap",
                listStyle: "none",
                padding: 0
              }}
            >
              <li><NavLink className="nav-btn" to="/login">Login</NavLink></li>
              <li><NavLink className="nav-btn" to="/view">View Games</NavLink></li>
              <li><NavLink className="nav-btn" to="/newgame">New Game</NavLink></li>
              <li><NavLink className="nav-btn" to="/pastgames">Past Games</NavLink></li>
              <li><NavLink className="nav-btn" to="/stat">Stats</NavLink></li>
              <li><NavLink className="nav-btn" to="/about">About</NavLink></li>
              <li><NavLink className="nav-btn" to="/ws-test">WS Test</NavLink></li>
            </ul>
          </nav>
        </header>
      )}

      {/* ----- ROUTES ----- */}
      <div style={{ width: "100%", maxWidth: "900px", margin: "0 auto" }}>
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
      </div>

      {/* ----- FOOTER ----- */}
      {!hideChrome && (
        <footer className="text-center" style={{ padding: "30px 0" }}>
          <p style={{ marginBottom: "4px" }}>
            Author Name(s): Andrew Smith
          </p>
          <a
            href="https://github.com/Supersmith1000/startup"
            style={{ color: "#59bfff", textDecoration: "underline" }}
          >
            GitHub
          </a>
        </footer>
      )}

    </div>
  );
}

function NotFound() {
  return (
    <main className="container-fluid bg-secondary text-center" style={{ padding: "50px" }}>
      404: Return to sender. Address unknown.
    </main>
  );
}
