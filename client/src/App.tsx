import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ChargingStationDashboard from "./components/charging-station/ChargingStationDashboard";
import Footer from "./components/footer/Footer";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ChargingStationDashboard />} />
      </Routes>
      <Footer />
    </Router>
  );
};

export default App;
