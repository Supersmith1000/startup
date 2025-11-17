const KEY = 'who1.games';
const API_URL = '/api';

export async function fetchGames() {
  try {
    const response = await fetch(`${API_URL}/games`, {
      credentials: 'include',
    });
    if (response.ok) {
      const data = await response.json();
      localStorage.setItem(KEY, JSON.stringify(data));
      return data;
    } else {
      console.warn('Backend not reachable, using local cache');
      return loadLocal();
    }
  } catch (error) {
    console.warn('Offline or server down — using local cache', error);
    return loadLocal();
  }
}

export async function saveGame(player, team, score) {
  const newGame = { player, team, score, date: new Date() };
  try {
    const response = await fetch(`${API_URL}/games`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(newGame),
    });
    if (response.ok) {
      const saved = await response.json();
      syncLocal(saved);
      return saved;
    }
  } catch (error) {
    console.warn('Offline, saving locally only');
    syncLocal(newGame);
    return newGame;
  }
}

function loadLocal() {
  const raw = localStorage.getItem(KEY);
  return raw ? JSON.parse(raw) : [];
}

function syncLocal(newGame) {
  const games = loadLocal();
  games.push(newGame);
  localStorage.setItem(KEY, JSON.stringify(games));
}