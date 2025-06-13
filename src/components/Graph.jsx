import React, { useEffect, useRef } from "react";
import cytoscape from "cytoscape";

// Edge style map by scenario
const styleMap = {
normal: { color: "#2ecc71", style: "solid" },
hijack_origin_change: { color: "#e74c3c", style: "solid" },
hijack_forged_path: { color: "#e74c3c", style: "dashed" },
hijack_typo: { color: "#95a5a6", style: "dotted" },
hijack_prepend: { color: "#f39c12", style: "dashed" }
};

// Node color by AS role
const roleColorMap = {
origin: "#2ecc71", // green
transit: "#3498db", // blue
hijacker: "#e74c3c", // red
default: "#bdc3c7" // gray
};

const Graph = ({ data, scenario = "normal" }) => {
const cyRef = useRef(null);

useEffect(() => {
if (!data || !data.ases || !data.paths[scenario]) return;


if (cyRef.current) {
  cyRef.current.destroy();
}

const style = styleMap[scenario] || styleMap["normal"];
const path = data.paths[scenario][0].path;

const nodes = data.ases.map((as) => ({
  data: {
    id: as.id,
    label: `${as.id}\n(${as.role || "unknown"})`,
    role: as.role || "default"
  },
  style: {
    "background-color": roleColorMap[as.role] || roleColorMap.default
  }}));

const edges = path.map((asId, index, array) => {
  if (index === 0) return null;
  return {
    data: {
      id: `e${array[index - 1]}_${asId}`,
      source: array[index - 1],
      target: asId
    },
    style: {
      "line-color": style.color,
      "line-style": style.style,
      "target-arrow-color": style.color,
      "target-arrow-shape": "triangle"
    }
  };
}).filter(Boolean);

cyRef.current = cytoscape({
  container: document.getElementById("cy"),
  elements: [...nodes, ...edges],
  style: [
    {
      selector: "node",
      style: {
        label: "data(label)",
        color: "#fff",
        "text-valign": "center",
        "text-halign": "center",
        "font-size": "10px",
        "text-wrap": "wrap",
        "background-opacity": 1,
        "width": 50,
        "height": 50
      }
    },
    {
      selector: "edge",
      style: {
        width: 3,
        "curve-style": "bezier"
      }
    }
  ],
  layout: {
    name: "breadthfirst",
    directed: true,
    padding: 10
  }
});
}, [data, scenario]);

return (
<div>
{/* Role legend */}
<div style={{ marginBottom: "1rem" }}>
<strong>Node Roles:</strong> 
<span style={{ color: "#2ecc71" }}>● Origin</span>  
<span style={{ color: "#3498db" }}>● Transit</span>  
<span style={{ color: "#e74c3c" }}>● Hijacker</span>
</div>

  {/* Graph container */}
  <div id="cy" style={{ width: "100%", height: "500px" }} />
</div>
);
};

export default Graph;