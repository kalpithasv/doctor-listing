// App.js
import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import Dashboard from './pages/Dashboard';
import DoctorDetail from './pages/DoctorDetail';
import DoctorListingPage from './pages/DoctorListingPage';


function App() {
  const [doctors, setDoctors] = useState([]);  
  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/doctors/:id" element={<DoctorDetail />} />
          <Route path="/doctors" element={<DoctorListingPage doctors={doctors} />} />
          {/* other routes */}
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
