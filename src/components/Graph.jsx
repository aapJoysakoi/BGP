import React, { useEffect, useRef } from "react";
import cytoscape from "cytoscape";
import popper from "cytoscape-popper";
import tippy from "tippy.js";
import "tippy.js/dist/tippy.css";

cytoscape.use(popper);

const Graph = ({ data, scenario = "normal" }) => {
  const cyRef = useRef(null);
  const audioRef = useRef(null);
  const alertShown = useRef(false);

  useEffect(() => {
    if (scenario !== "normal" && !alertShown.current) {
      alertShown.current = true;
      audioRef.current?.play();
    } else if (scenario === "normal") {
      alertShown.current = false;
    }
  }, [scenario]);

  useEffect(() => {
    if (!data || !data.ases || !data.paths[scenario]) return;

    if (cyRef.current) {
      cyRef.current.destroy();
    }

    const pathData = data.paths[scenario][0];
    const path = pathData.path;
    const origin = path[0];
    const hijacker = scenario === "custom" ? path[path.length - 1] : null;

    const nodes = data.ases.map((as) => {
      let nodeClass = "legit";
      if (as.id === origin) nodeClass = "origin";
      if (as.id === hijacker) nodeClass = "hijacker";
      return {
        data: { id: as.id, label: as.label },
        classes: nodeClass
      };
    });

    const edges = path
      .map((asId, index, array) => {
        if (index === 0) return null;
        return {
          data: {
            id: `e${array[index - 1]}_${asId}`,
            source: array[index - 1],
            target: asId
          }
        };
      })
      .filter(Boolean);

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
            "background-color": "#ff4136",
            "border-width": 4,
            "border-color": "#ff4136",
            "border-opacity": 0.6
          }
        },
        {
          selector: "edge",
          style: {
            width: 3,
            opacity: 1,
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
        padding: 20,
        spacingFactor: 1.6
      },
      minZoom: 0.5,
      maxZoom: 2.5,
      userPanningEnabled: true,
      boxSelectionEnabled: false
    });

    cyRef.current = cy;

    let isPanningProgrammatically = false;
    cy.on("pan", () => {
      if (isPanningProgrammatically) return;
      const pan = cy.pan();
      const limit = 300;
      const clampedPan = {
        x: Math.max(Math.min(pan.x, limit), -limit),
        y: Math.max(Math.min(pan.y, limit), -limit)
      };
      if (pan.x !== clampedPan.x || pan.y !== clampedPan.y) {
        isPanningProgrammatically = true;
        cy.pan(clampedPan);
        setTimeout(() => {
          isPanningProgrammatically = false;
        }, 0);
      }
    });

    // Tooltips
    cy.nodes().forEach((node) => {
      const asId = node.id();
      const asInfo = data.ases.find((as) => as.id === asId);
      const isOrigin = node.hasClass("origin");
      const isHijacker = node.hasClass("hijacker");
      const role = isOrigin ? "Origin" : isHijacker ? "Hijacker" : "Transit";
      const type = isHijacker ? "Malicious" : "Legitimate";

      const ref = node.popperRef();
      const dummy = document.createElement("div");
      const tip = tippy(dummy, {
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
  }, [data, scenario]);

  // Determine wrapper class for border color
  const hijackClassMap = {
    hijack_origin_change: "hijack-red",
    hijack_forged_path: "hijack-blue",
    hijack_typo: "hijack-yellow",
    hijack_prepend: "hijack-orange",
    custom: "hijack-purple"
  };

  const isHijack = scenario !== "normal";
  const wrapperClass = isHijack
    ? `graph-wrapper ${hijackClassMap[scenario] || "hijack-red"}`
    : "graph-wrapper";

  return (
    <div style={{ position: "relative" }}>
      <audio ref={audioRef} src="/alert.mp3" preload="auto" />
      <div className={wrapperClass}>
        <div id="cy" />
      </div>
    </div>
  );
};

export default Graph;
