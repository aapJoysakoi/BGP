import React, { useEffect, useRef } from "react";
import cytoscape from "cytoscape";

const Graph = ({ data, scenario = "normal" }) => {
  const cyRef = useRef(null);

  useEffect(() => {
    if (!data || !data.ases || !data.paths[scenario]) return;

    // Clear previous graph if exists
    if (cyRef.current) {
      cyRef.current.destroy();
    }

    // Prepare nodes
    const nodes = data.ases.map((as) => ({
      data: { id: as.id, label: as.label },
    }));

    // Prepare edges from the selected path
    const edges = data.paths[scenario][0].path.map((asId, index, array) => {
      if (index === 0) return null;
      return {
        data: {
          id: `e${array[index - 1]}_${asId}`,
          source: array[index - 1],
          target: asId,
        },
      };
    }).filter(Boolean);

    // Init cytoscape
    cyRef.current = cytoscape({
      container: document.getElementById("cy"),
      elements: [...nodes, ...edges],
      style: [
        {
          selector: "node",
          style: {
            label: "data(label)",
            "background-color": "#0074D9",
            color: "#fff",
            "text-valign": "center",
            "text-halign": "center",
          },
        },
        {
          selector: "edge",
          style: {
            width: 2,
            "line-color": "#ccc",
            "target-arrow-color": "#ccc",
            "target-arrow-shape": "triangle",
            "curve-style": "bezier",
          },
        },
      ],
      layout: {
        name: "breadthfirst",
        directed: true,
        padding: 10,
      },
    });
  }, [data, scenario]);

  return <div id="cy" style={{ width: "100%", height: "500px" }} />;
};

export default Graph;
