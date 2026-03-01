import React from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
} from "chart.js";
import { Pie, Line } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement
);

const DeveloperDashboard = () => {
  // 📊 Dummy Data (tu peux connecter avec ton backend Flask après)

  const stats = {
    total: 245,
    urgent: 12,
    resolved: 180,
    accuracy: 91.8,
  };

  const pieData = {
    labels: ["Backend", "Frontend", "Database", "Security"],
    datasets: [
      {
        data: [40, 25, 20, 15],
        backgroundColor: ["#6366F1", "#10B981", "#F59E0B", "#EF4444"],
      },
    ],
  };

  const lineData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Tickets",
        data: [12, 19, 8, 15, 22, 30, 18],
        borderColor: "#6366F1",
        backgroundColor: "rgba(99,102,241,0.2)",
      },
    ],
  };

  return (
    <div style={{ padding: "30px", fontFamily: "Arial" }}>
      <h2>Developer Dashboard</h2>

      {/* 🔢 Cards */}
      <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
        <Card title="Total Tickets" value={stats.total} />
        <Card title="Urgent Tickets" value={stats.urgent} />
        <Card title="Resolved" value={stats.resolved} />
        <Card title="Model Accuracy" value={`${stats.accuracy}%`} />
      </div>

      {/* 📊 Charts */}
      <div style={{ display: "flex", gap: "40px", marginTop: "40px" }}>
        <div style={{ width: "40%" }}>
          <h4>Tickets by Category</h4>
          <Pie data={pieData} />
        </div>

        <div style={{ width: "60%" }}>
          <h4>Weekly Ticket Trend</h4>
          <Line data={lineData} />
        </div>
      </div>

      {/* 🤖 ML Performance */}
      <div style={{ marginTop: "40px" }}>
        <h4>Model Performance</h4>
        <p>Model: BERT</p>
        <p>Accuracy: 91.8%</p>
        <p>Precision: 89%</p>
        <p>Recall: 92%</p>
        <p>F1-score: 90%</p>
        <button style={buttonStyle}>Retrain Model</button>
      </div>

      {/* ⚙️ System Monitoring */}
      <div style={{ marginTop: "40px" }}>
        <h4>System Monitoring</h4>
        <p>API Status: 🟢 Online</p>
        <p>Average Response Time: 1.2s</p>
        <p>Database Size: 120MB</p>
        <p>Active Users: 34</p>
      </div>
    </div>
  );
};

const Card = ({ title, value }) => (
  <div
    style={{
      background: "#f3f4f6",
      padding: "20px",
      borderRadius: "10px",
      width: "200px",
      boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    }}
  >
    <h4>{title}</h4>
    <h2>{value}</h2>
  </div>
);

const buttonStyle = {
  padding: "10px 20px",
  background: "#6366F1",
  color: "white",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
};

export default DeveloperDashboard;