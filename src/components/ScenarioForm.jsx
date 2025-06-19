import React, { useState } from "react";

const ScenarioForm = ({ ases, onSimulate }) => {
  const [attacker, setAttacker] = useState("");
  const [hijackType, setHijackType] = useState("origin_change");

  const hijackOptions = [
    { value: "origin_change", label: "Origin Change" },
    { value: "forged_path", label: "Forged Path" }
  ];

  const handleSimulate = () => {
    if (attacker && hijackType) {
      onSimulate(attacker, hijackType);
    }
  };

  return (
    <div style={{ marginBottom: "1rem" }}>
      <label>
        Select Attacker AS:
        <select value={attacker} onChange={(e) => setAttacker(e.target.value)}>
          <option value="">-- Select --</option>
          {ases.map((as) => (
            <option key={as.id} value={as.id}>{as.label}</option>
          ))}
        </select>
      </label>
      <label style={{ marginLeft: "1rem" }}>
        Hijack Type:
        <select value={hijackType} onChange={(e) => setHijackType(e.target.value)}>
          {hijackOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </label>
      <button style={{ marginLeft: "1rem" }} onClick={handleSimulate}>
        Simulate
      </button>
    </div>
  );
};

export default ScenarioForm;
