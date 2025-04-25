// src/pages/DoctorListingPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchDoctors } from '../services/doctorService';
import './DoctorListingPage.css';

const DoctorListingPage = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const loadDoctors = async () => {
      try {
        setLoading(true);
        const data = await fetchDoctors();
        setDoctors(data);
        setError(null);
      } catch (err) {
        setError('Failed to load doctors. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    loadDoctors();
  }, []);

  const filteredDoctors = doctors.filter(doctor => {
    const name = doctor.name?.toLowerCase() || '';
    const specialty = doctor.specialty?.toLowerCase() || '';
    const term = searchTerm.toLowerCase();
  
    return name.includes(term) || specialty.includes(term);
  });  

  const handleViewDetails = (id) => {
    navigate(`/doctors/${id}`);
  };

  return (
    <div className="doctor-listing-container">
      <h1>Find Doctors</h1>
      <input
        type="text"
        placeholder="Search doctors by name or specialty"
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        className="search-input"
      />

      {loading && <p>Loading doctors...</p>}
      {error && <p className="error-message">{error}</p>}

      {!loading && !error && filteredDoctors.length === 0 && (
        <p className="no-results">No doctors found.</p>
      )}

      <div className="doctor-grid">
        {filteredDoctors.map((doctor) => (
          <div key={doctor.id} className="doctor-card">
            <h3>{doctor.name}</h3>
            <p><strong>Specialty:</strong> {doctor.specialty}</p>
            <p><strong>Experience:</strong> {doctor.experience || 'N/A'} years</p>
            <button
              className="details-button"
              onClick={() => handleViewDetails(doctor.id)}
            >
              View Details
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoctorListingPage;
