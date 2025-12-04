import React, { useEffect, useState, useRef } from "react";

export function TempSocket() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [connected, setConnected] = useState(false);
  const wsRef = useRef(null);

  useEffect(() => {
    // ✔ Automatically chooses correct host (dev or production)
    const wsUrl =
      window.location.hostname === "localhost"
        ? "ws://localhost:4000/ws"
        : "wss://startup.who-1.com/ws";

    const ws = new WebSocket(wsUrl);
    wsRef.value = ws;

    ws.onopen = () => {
      setConnected(true);
      setMessages((prev) => [...prev, "🟢 Connected to WebSocket"]);
    };

    ws.onmessage = (event) => {
      setMessages((prev) => [...prev, `📩 ${event.data}`]);
    };

    ws.onclose = () => {
      setConnected(false);
      setMessages((prev) => [...prev, "🔴 WebSocket disconnected"]);
    };

    return () => ws.close();
  }, []);

  function sendMessage() {
    if (input.trim() === "") return;
    if (!wsRef.value) return;

    wsRef.value.send(input);
    setMessages((prev) => [...prev, `📤 You: ${input}`]);
    setInput("");
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>WebSocket Demo</h2>

      <p>
        Status:{" "}
        <strong style={{ color: connected ? "lightgreen" : "red" }}>
          {connected ? "Connected" : "Disconnected"}
        </strong>
      </p>

      <div
        style={{
          border: "1px solid #444",
          padding: "10px",
          borderRadius: "8px",
          height: "300px",
          overflowY: "auto",
          background: "#111",
          color: "white",
          marginBottom: "20px",
        }}
      >
        {messages.map((msg, i) => (
          <div key={i} style={{ marginBottom: "6px" }}>
            {msg}
          </div>
        ))}
      </div>

      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type message..."
        style={{
          padding: "10px",
          borderRadius: "6px",
          width: "70%",
          marginRight: "10px",
        }}
      />

      <button
        onClick={sendMessage}
        className="btn btn-primary"
        disabled={!connected}
      >
        Send
      </button>
    </div>
  );
}
