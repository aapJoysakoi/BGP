import React, { useEffect, useState } from "react";
import Graph from "./components/Graph";
import "./styles.css";

function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("/bgp_data.json")
      .then((res) => res.json())
      .then(setData)
      .catch(console.error);
  }, []);

  return (
    <div>
      <h1>BGP Route Visualizer</h1>
      {data ? <Graph data={data} scenario="normal" /> : <p>Loading...</p>}
    </div>
  );
}

export default App;
