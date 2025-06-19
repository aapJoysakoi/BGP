import React, { useEffect, useState } from "react";
import Graph from "./components/Graph";
import Controls from "./components/Controls";
import ScenarioForm from "./components/ScenarioForm";
import "./styles.css";

function App() {
  const [data, setData] = useState(null);
  const [scenario, setScenario] = useState("normal");
  const [customPath, setCustomPath] = useState(null);
  const [theme, setTheme] = useState("light");
  const [mode, setMode] = useState("learning");

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
        background: "#e8f5e9",
        text: "#2e7d32"
      },
      hijack_origin_change: {
        label: "Origin Hijack — An unauthorized AS announces the prefix.",
        background: "#fdecea",
        text: "#c62828"
      },
      hijack_forged_path: {
        label: "Forged Path — Hijacker fakes the AS path to appear legitimate.",
        background: "#fff3e0",
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
      },
      custom: {
        label: "Custom Hijack — Simulated by you!",
        background: "#e3f2fd",
        text: "#1565c0"
      }
    };
    return map[key] || {
      label: "Unknown scenario.",
      background: "#eeeeee",
      text: "#000"
    };
  };

  const getThemeStyles = (theme) => {
    const themes = {
      light: {
        backgroundColor: "#ffffff",
        textColor: "#000000"
      },
      dark: {
        backgroundColor: "#181818",
        textColor: "#f0f0f0"
      }
    };
    return themes[theme] || themes.light;
  };

  useEffect(() => {
    const themeStyles = getThemeStyles(theme);
    document.body.style.backgroundColor = themeStyles.backgroundColor;
    document.body.style.color = themeStyles.textColor;
    document.body.classList.toggle("dark-mode", theme === "dark");
  }, [theme]);

  const simulateHijack = (attacker, type) => {
    const victimPrefix = data.prefixes[0].prefix;
    const victimAS = data.prefixes[0].owner;

    let path = [];

    if (type === "origin_change") {
      path = ["AS4", "AS3", "AS2", attacker];
    } else if (type === "forged_path") {
      path = ["AS4", "AS3", attacker, victimAS];
    }

    const newData = {
      ...data,
      paths: {
        ...data.paths,
        custom: [{ prefix: victimPrefix, path }]
      }
    };

    setCustomPath({ scenario: "custom", data: newData });
    setScenario("custom");
  };

  const reset = () => {
    setCustomPath(null);
    setScenario("normal");
  };

  const scenarioInfo = getScenarioStyle(scenario);
  const activeData = customPath?.data || data;

  const getHijackBannerMessage = () => {
    switch (scenario) {
      case "hijack_origin_change":
        return "🚨 Origin Hijack Detected";
      case "hijack_forged_path":
        return "⚡ Forged Path Hijack Detected";
      case "hijack_typo":
        return "⚠️ AS Path Typo Detected";
      case "hijack_prepend":
        return "🔁 AS Path Prepend Detected";
      case "custom":
        return "🧪 Custom Hijack Simulation";
      default:
        return null;
    }
  };

  return (
    <div className="app-container">
      <h1>BGP Hijack Simulator</h1>

      <p
        className="info-banner"
        style={{
          backgroundColor: scenarioInfo.background,
          color: scenarioInfo.text,
          border: `1px solid ${scenarioInfo.text}33`
        }}
      >
        Current Scenario: {scenarioInfo.label}
      </p>

      {/* Controls: Theme + Mode + Alert */}
      <div className="top-controls">
        <div className="button-group">
          <button
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          >
            Theme: {theme === "light" ? "Light" : "Dark"}
          </button>

          <button
            onClick={() => setMode(mode === "learning" ? "diy" : "learning")}
          >
            Mode: {mode === "learning" ? "Learning Mode" : "Do It Yourself Mode"}
          </button>
        </div>

        {scenario !== "normal" && (
          <div className="hijack-alert">{getHijackBannerMessage()}</div>
        )}
      </div>

      {/* Learning mode = scenario buttons, DIY mode = form */}
      {mode === "learning" ? (
        <Controls onChange={setScenario} activeScenario={scenario} />
      ) : (
        data && <ScenarioForm ases={data.ases} onSimulate={simulateHijack} />
      )}

      {mode === "diy" && (
        <button onClick={reset} style={{ marginBottom: "1rem" }}>
          Reset
        </button>
      )}

      {/* Graph component */}
      {activeData ? (
        <Graph data={activeData} scenario={scenario} />
      ) : (
        <p>Loading graph data...</p>
      )}
    </div>
  );
}

export default App;
