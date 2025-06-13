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

const getScenarioLabel = (key) => {
const map = {
normal: "Normal — Legitimate BGP route.",
hijack_origin_change: "Origin Hijack — An unauthorized AS announces the prefix.",
hijack_forged_path: "Forged Path — Hijacker fakes the AS path to appear legitimate.",
hijack_typo: "Typo — A misconfigured AS path leads to disruption.",
hijack_prepend: "Prepend — AS path prepending alters route preference."
};
return map[key] || "Unknown scenario";
};

return (
<div style={{ padding: "1.5rem", fontFamily: "sans-serif" }}>
<h1>BGP Hijack Simulator</h1>
<p style={{
fontWeight: "bold",
marginBottom: "1rem",
backgroundColor: "#f0f8ff",
padding: "10px",
borderRadius: "6px",
borderLeft: "5px solid #0074D9"
}}>
<p style={{ fontWeight: "bold", marginBottom: "1rem", padding: "10px 16px", borderRadius: "6px", border: "1px solid #ddd", backgroundColor: "#f0f8ff", color: "#333", fontSize: "15px", display: "inline-block", boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)" }}> Current Scenario:&nbsp; <span style={{ color: "#0074D9" }}> {getScenarioLabel(scenario)} </span> </p>
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