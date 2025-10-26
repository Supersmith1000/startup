const KEY = 'who1.games';

export async function fetchGames() {
  const raw = localStorage.getItem(KEY);
  return raw ? JSON.parse(raw) : [];
}