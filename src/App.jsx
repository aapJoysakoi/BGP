import React, { useEffect, useState } from "react";
import Graph from "./components/Graph";
import Controls from "./components/Controls";
import "./styles.css";

function App() {
const [data, setData] = useState(null);
const [scenario, setScenario] = useState("normal");

useEffect(() => {
fetch("/bgp_data.json")
.then((res) => res.json())
.then(setData)
.catch(console.error);
}, []);

const getScenarioStyle = (key) => {
const map = {
normal: {
label: "Normal — Legitimate BGP route.",
background: "#e8f5e9", // light green
text: "#2e7d32" // dark green
},
hijack_origin_change: {
label: "Origin Hijack — An unauthorized AS announces the prefix.",
background: "#fdecea", // light red
text: "#c62828"
},
hijack_forged_path: {
label: "Forged Path — Hijacker fakes the AS path to appear legitimate.",
background: "#fff3e0", // light orange
text: "#ef6c00"
},
hijack_typo: {
label: "Typo — A misconfigured AS path leads to disruption.",
background: "#eceff1",
text: "#37474f"
},
hijack_prepend: {
label: "Prepend — AS path prepending alters route preference.",
background: "#fffde7",
text: "#f9a825"
}
};
return map[key] || {
label: "Unknown scenario.",
background: "#eeeeee",
text: "#000"
};
};

const scenarioInfo = getScenarioStyle(scenario);

return (
<div style={{ padding: "1.5rem", fontFamily: "sans-serif" }}>
<h1 style={{ marginBottom: "0.5rem" }}>BGP Hijack Simulator</h1>

  <p style={{
    fontWeight: "bold",
    marginBottom: "1rem",
    padding: "10px 16px",
    borderRadius: "6px",
    backgroundColor: scenarioInfo.background,
    color: scenarioInfo.text,
    fontSize: "15px",
    border: `1px solid ${scenarioInfo.text}33`,
    display: "inline-block",
    boxShadow: "0 1px 4px rgba(0,0,0,0.08)"
  }}>
    Current Scenario:&nbsp;{scenarioInfo.label}
  </p>

  <Controls onChange={setScenario} activeScenario={scenario} />

  {data ? (
    <Graph data={data} scenario={scenario} />
  ) : (
    <p>Loading graph data...</p>
  )}
</div>
);
}

export default App;