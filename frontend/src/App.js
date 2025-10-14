import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch("http://localhost:5000/plan/history");
        const data = await res.json();
        console.log('Fetched History:', data);
        setHistory(data.history || []);
      } catch (err) {
        console.error("Error fetching history:", err);
      }
    };

    fetchHistory();
  }, []);

  const handleSubmit = async () => {
    if (!input.trim()) return;

    try {
      const res = await fetch("http://localhost:5000/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task: input }),
      });

      const data = await res.json();
      if (data?.result) {
        const responseWithTask = { ...data.result, userTask: input };

        setResponse(responseWithTask);
        setHistory((prev) => [...prev, { task: input, result: responseWithTask }]);
      } else {
        setResponse({ error: "No structured result received." });
      }
    } catch (err) {
      console.error(err);
      setResponse({ error: "Failed to fetch from backend." });
    }

    setInput("");
  };

  return (
    <div className="app-container">
      <div className="sidebar">
        <h3>History</h3>
        <ul>
          {history.map((item, index) => (
            <li key={index} onClick={() => setResponse(item.result)}>
              {item.task}
            </li>
          ))}
        </ul>
      </div>

      <div className="main-content">
        <h2>Task Planner</h2>

        <div className="response-box">
          {response ? (
            response.error ? (
              <p style={{ color: "red" }}>{response.error}</p>
            ) : (
              <div>
                <h2>Task: {response.userTask}</h2>
                <h3>Overall Timeline: {response.overall_timeline}</h3>
                <div className="subtask-list">
                  {response.subtasks.map((task, index) => (
                    <div className={`subtask-card priority-${task.priority}`} key={index}>
                      <h4>{task.title}</h4>
                      <p><strong>Timeline:</strong> {task.timeline}</p>
                      <p><strong>Procedure:</strong> {task.procedure}</p>
                      <p><strong>Priority:</strong> {task.priority}</p>
                      <p><strong>Dependencies:</strong>
                        {task.dependencies.length > 0 ? task.dependencies.join(", ") : "None"}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )
          ) : (
            <p>Your response will appear here.</p>
          )}
        </div>

        <div className="input-area">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter your task..."
            rows={4}
          />
          <button onClick={handleSubmit}>Generate Plan</button>
        </div>
      </div>
    </div>
  );
}

export default App;
