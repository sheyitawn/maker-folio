import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import './logs.css'

const Logs = ({ projectId }) => {
  const [logs, setLogs] = useState([]);
  console.log("🚀 ~ Logs ~ logs:", logs)

  useEffect(() => {
    fetch('/data/projects.json')
      .then(res => res.json())
      .then(data => {
        setLogs(data[projectId]?.logs || []);
      });

    console.log("id: ", projectId)
    console.log("logs: ", logs)
  }, [projectId]);

  if (!logs.length) return <p>No logs yet.</p>;

  return (
    <div className="logs-container">
      id: {projectId}

      {logs.map((log, i) => (
        <div key={i} className="log-entry">
          <h3>title: {log.filename}</h3>
          <h4>{new Date(log.date).toLocaleDateString()}</h4>
          <ReactMarkdown>{log.content}</ReactMarkdown>
          {log.images?.map((img, idx) => (
            <img
              key={idx}
              src={`/content/projects/${projectId}/${img}`}
              alt={`log-${i}-img-${idx}`}
              style={{ maxWidth: '100%', marginTop: '0.5rem' }}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default Logs;
