import React, { useEffect, useState } from "react";

export function WebsocketDemo() {
  const [message, setMessage] = useState("Connecting to WebSocket...");

  useEffect(() => {
    const ws = new WebSocket(
      window.location.host.includes("localhost")
        ? "ws://localhost:5173/ws"
        : "wss://startup.who-1.com/ws"
    );

    ws.onopen = () => {
      setMessage("WebSocket connected!");
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "connected") setMessage(data.msg);
      if (data.type === "time") setMessage("Server Time: " + data.timestamp);
    };

    ws.onerror = () => {
      setMessage("WebSocket error.");
    };

    ws.onclose = () => {
      console.log("WebSocket closed");
    };

    return () => ws.close();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>WebSocket Live Data</h2>
      <p>{message}</p>
    </div>
  );
}
