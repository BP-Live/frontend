"use client";

import { useEffect, useState } from "react";

const WebSocketComponent = () => {
  const [aggregatedData, setAggregatedData] = useState({});

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8000/ws");

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("Data received:", data);

      setAggregatedData((prevData) => ({ ...prevData, ...data }));
    };

    return () => {
      ws.close();
    };
  }, []);

  return (
    <div>
      <h2>Aggregated Data</h2>
      <pre>{JSON.stringify(aggregatedData, null, 2)}</pre>
    </div>
  );
};

export default WebSocketComponent;
