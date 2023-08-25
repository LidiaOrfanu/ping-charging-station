import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ChargingStationsDashboard from './components/chargingstations/ChargingStationsDashboard';
import Header from './components/header/Header';
import PageNotFound from './components/pagenotfound/PageNotFound';

const App: React.FC = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<ChargingStationsDashboard />} />
        {/* <Route path="/stations/:id" element={<ChargingStationPage />}/> */}
        {/* <Route path="/search-results" element={<ChargingStationPage />} /> */}
        <Route path="/not-found" element={<PageNotFound />} />
      </Routes>
      {/* <Footer /> */}
    </Router>
  );
};

export default App;