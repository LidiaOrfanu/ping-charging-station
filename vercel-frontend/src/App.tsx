import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ChargingStationDashboard from './components/charging-station/ChargingStationDashboard';
import Header from './components/header/Header';
import PageNotFound from './components/page-not-found/PageNotFound';

const App: React.FC = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<ChargingStationDashboard />} />
        {/* <Route path="/stations/:id" element={<ChargingStationPage />}/> */}
        {/* <Route path="/search-results" element={<ChargingStationPage />} /> */}
        <Route path="/not-found" element={<PageNotFound />} />
      </Routes>
      {/* <Footer /> */}
    </Router>
  );
};

export default App;