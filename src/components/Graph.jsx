import React, { useEffect, useRef } from "react";
import cytoscape from "cytoscape";
import popper from "cytoscape-popper";
import tippy from "tippy.js";
import "tippy.js/dist/tippy.css";

// Register popper plugin
cytoscape.use(popper);

const Graph = ({ data, scenario = "normal" }) => {
  const cyRef = useRef(null);

  useEffect(() => {
    if (!data || !data.ases || !data.paths[scenario]) return;

    if (cyRef.current) {
      cyRef.current.destroy();
    }

    const pathData = data.paths[scenario][0];
    const path = pathData.path;
    const origin = path[0];
    const hijacker = scenario === "custom" ? path[path.length - 1] : null;

    // Assign classes instead of inline styles
    const nodes = data.ases.map((as) => {
      let nodeClass = "legit";
      if (as.id === origin) nodeClass = "origin";
      if (as.id === hijacker) nodeClass = "hijacker";
      return {
        data: { id: as.id, label: as.label },
        classes: nodeClass
      };
    });

    const edges = path.map((asId, index, array) => {
      if (index === 0) return null;
      return {
        data: {
          id: `e${array[index - 1]}_${asId}`,
          source: array[index - 1],
          target: asId
        }
      };
    }).filter(Boolean);

    const cy = cytoscape({
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
            "font-weight": "bold",
            "text-outline-color": "#555",
            "text-outline-width": "2px",
            "width": 40,
            "height": 40,
            "font-size": "10px"
          }
        },
        {
          selector: "node.legit",
          style: {
            "background-color": "#0074D9"
          }
        },
        {
          selector: "node.origin",
          style: {
            "background-color": "#2ecc40"
          }
        },
        {
          selector: "node.hijacker",
          style: {
            "background-color": "#ff4136"
          }
        },
        {
          selector: "edge",
          style: {
            width: 3,
            "line-color": "#999",
            "target-arrow-color": "#999",
            "target-arrow-shape": "triangle",
            "curve-style": "bezier"
          }
        }
      ],
      layout: {
        name: "breadthfirst",
        directed: true,
        padding: 10,
        spacingFactor: 1.5
      },
      minZoom: 0.5,
      maxZoom: 2.5,
      userPanningEnabled: true,
      boxSelectionEnabled: false
    });

    // Clamp panning
    cy.on("pan", () => {
      const pan = cy.pan();
      const limit = 300;
      cy.pan({
        x: Math.max(Math.min(pan.x, limit), -limit),
        y: Math.max(Math.min(pan.y, limit), -limit)
      });
    });

    // ✅ Create tooltips using popperRef
    cy.nodes().forEach((node) => {
      const asId = node.id();
      const asInfo = data.ases.find((as) => as.id === asId);
      const isOrigin = node.hasClass("origin");
      const isHijacker = node.hasClass("hijacker");
      const role = isOrigin ? "Origin" : isHijacker ? "Hijacker" : "Transit";
      const type = isHijacker ? "Malicious" : "Legitimate";

      const ref = node.popperRef();
      const dummyDomEle = document.createElement("div");
      const tip = tippy(dummyDomEle, {
        getReferenceClientRect: ref.getBoundingClientRect,
        content: `
          <strong>${asInfo?.label || asId}</strong><br/>
          Role: ${role}<br/>
          Type: ${type}
        `,
        allowHTML: true,
        placement: "top",
        theme: "light",
        trigger: "manual"
      });

      node.on("mouseover", () => tip.show());
      node.on("mouseout", () => tip.hide());
    });

    cyRef.current = cy;
  }, [data, scenario]);

  return <div id="cy" style={{ width: "100%", height: "500px" }} />;
};

export default Graph;
