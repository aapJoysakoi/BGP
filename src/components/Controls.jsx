import React from "react";

const Controls = ({ onChange, activeScenario }) => {
const scenarios = [
{ key: "normal", label: "Normal" },
{ key: "hijack_origin_change", label: "Origin Hijack" },
{ key: "hijack_forged_path", label: "Forged Path" },
{ key: "hijack_typo", label: "Typo" },
{ key: "hijack_prepend", label: "Prepend" }
];

return (
<div style={{ marginBottom: "1rem", display: "flex", flexWrap: "wrap", gap: "8px" }}>
{scenarios.map((s) => {
const isActive = s.key === activeScenario;
return (
<button
key={s.key}
onClick={() => onChange(s.key)}
style={{
padding: "8px 16px",
borderRadius: "6px",
border: "1px solid #ccc",
backgroundColor: isActive ? "#0074D9" : "#f5f5f5",
color: isActive ? "#fff" : "#333",
fontWeight: "bold",
fontSize: "14px",
cursor: "pointer",
transition: "all 0.2s ease",
boxShadow: isActive ? "0 0 6px rgba(0, 116, 217, 0.5)" : "none"
}}
onMouseOver={(e) => {
if (!isActive) {
e.target.style.backgroundColor = "#e0f0ff";
}
}}
onMouseOut={(e) => {
if (!isActive) {
e.target.style.backgroundColor = "#f5f5f5";
}
}}
>
{s.label}
</button>
);
})}
</div>
);
};

export default Controls;