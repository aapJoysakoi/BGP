import React, { useEffect, useRef } from "react";
import cytoscape from "cytoscape";

// Scenario-specific edge styles
const styleMap = {
normal: { color: "#2ecc71", style: "solid" }, // Green
hijack_origin_change: { color: "#e74c3c", style: "solid" }, // Red
hijack_forged_path: { color: "#e74c3c", style: "dashed" }, // Red dashed
hijack_typo: { color: "#95a5a6", style: "dotted" }, // Gray dotted
hijack_prepend: { color: "#f39c12", style: "dashed" } // Orange dashed
};

const Graph = ({ data, scenario = "normal" }) => {
const cyRef = useRef(null);

useEffect(() => {
if (!data || !data.ases || !data.paths[scenario]) return;

if (cyRef.current) {
  cyRef.current.destroy();
}

const nodes = data.ases.map((as) => ({
  data: { id: as.id, label: as.label }
}));

const path = data.paths[scenario][0].path;
const style = styleMap[scenario] || styleMap["normal"];

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
        "background-color": "#3498db",
        color: "#fff",
        "text-valign": "center",
        "text-halign": "center",
        "font-size": "12px"
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

return <div id="cy" style={{ width: "100%", height: "500px" }} />;
};

export default Graph;