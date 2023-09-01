import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ChargingStationDashboard from "./components/charging-station/ChargingStationDashboard";
import PageNotFound from "./components/page-not-found/PageNotFound";
import ChargingStationPage from "./components/charging-station/ChargingStationPage";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ChargingStationDashboard />} />
        <Route path="/station/:id" element={<ChargingStationPage />} />
        <Route path="/not-found" element={<PageNotFound />} />
      </Routes>
      {/* <Footer /> */}
    </Router>
  );
};

export default App;
