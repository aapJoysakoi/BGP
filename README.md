BGP Hijack Simulator
An Interactive Learning Platform for Internet Routing Security

Developed during an internship at the National Internet Exchange of India (NIXI), this project simulates real-world BGP (Border Gateway Protocol) hijack scenarios to foster cybersecurity awareness and routing security education.

📘 Overview
The Border Gateway Protocol (BGP) plays a crucial role in directing traffic across the global Internet. However, its lack of inherent security mechanisms makes it vulnerable to route hijacks—where malicious or misconfigured Autonomous Systems (ASes) advertise false routing information.

This simulator allows learners to explore how such hijacks occur, visualize their impact, and experiment with different mitigation patterns in a controlled, interactive environment.

🎯 Key Features
🌐 Web-based: Fully frontend-based (React + Vite)

📡 Scenario-driven: Simulates origin hijacks, forged paths, typos, and more

📊 Graph Visualization: Cytoscape.js used for real-time AS path rendering

🎨 Visual Cues: Color-coded nodes and edges to distinguish normal vs. hijacked states

🧭 Role Indicators: Identifies origin AS, transit AS, and hijackers

🧠 Education-Focused: Designed for cybersecurity students and early-career professionals

📷 Demonstration
Scenario	Preview
Normal Routing	
Origin Hijack	
Forged AS Path	
Prepending Error	
Typographical Error	

📁 Project Structure
php
Copy
Edit
BGP/
├── public/
│   └── bgp_data.json        # Predefined AS paths & roles
├── src/
│   ├── components/
│   │   ├── Graph.jsx        # Graph rendering logic
│   │   └── Controls.jsx     # Scenario selection buttons
│   ├── App.jsx              # Main container and state manager
│   ├── styles.css           # UI styling
├── package.json             # Project metadata & dependencies
├── README.md                # This document
🚀 Getting Started
To run the project locally:

Clone the repository:

bash
Copy
Edit
git clone https://github.com/aapJoysakoi/BGP.git
cd BGP
Install dependencies:

bash
Copy
Edit
npm install
Start the development server:

bash
Copy
Edit
npm run dev
Open your browser and navigate to:

arduino
Copy
Edit
http://localhost:5173/
🧪 Implemented Scenarios
Each scenario mimics a real-world misconfiguration or attack, rendered graphically for clarity:

Scenario	Description
Normal Routing	Displays legitimate AS path and prefix propagation
Origin Hijack	A false origin AS advertises a prefix it doesn't own
Forged Path Hijack	A hijacker crafts a fake AS path including the real origin
AS Path Prepending	An AS manipulates route selection by artificially extending its AS path
Typographical Error	A misconfigured AS number causes path duplication or invalid propagation

Scenarios are defined in a static JSON file (bgp_data.json) and rendered using Cytoscape layouts.

🔧 Tech Stack
Component	Technology
UI Framework	React (Vite)
Graph Visualization	Cytoscape.js
Styling	CSS (custom)
Data Format	JSON
Package Manager	npm

📚 Educational Goals
This simulator is designed to:

Bridge the gap between theoretical BGP concepts and real-world routing behavior

Offer a visual, hands-on experience for students and security practitioners

Promote awareness of routing security risks and potential countermeasures

Support NIXI’s mission to enhance national Internet infrastructure and cyber hygiene

🚧 Roadmap & Future Enhancements
⌨️ CLI-based scenario scripting interface

🧱 Containerized real BGP lab with FRRouting (via Docker)

🧩 Custom scenario builder (drag-and-drop AS topology)

🎮 Gamified “Challenge Mode” with score-based learning

📈 Real BGP incident replay from RouteViews or BGPStream

👩‍💻 Author
Joysa Kaushik
B.Tech-M.Tech (Cyber Security)
National Forensic Sciences University, Delhi Campus
Intern – National Internet Exchange of India (NIXI)

🔗 LinkedIn: linkedin.com/in/joysakaushik

📄 License
This project is released under the MIT License.
You are welcome to use, extend, or adapt it for academic and educational purposes.