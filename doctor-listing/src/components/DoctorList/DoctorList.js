// src/components/DoctorList/DoctorList.js
import React from 'react';
import * as DoctorCardModule from '../DoctorCard/DoctorCard';
import styles from './DoctorList.module.css';

const DoctorCard = DoctorCardModule.default || DoctorCardModule;

const DoctorList = ({ doctors, loading, error }) => {
  if (loading) {
    return <div className={styles.loadingContainer}>Loading doctors...</div>;
  }

  if (error) {
    return <div className={styles.errorContainer}>Error loading doctors: {error}</div>;
  }

  if (!doctors || doctors.length === 0) {
    return <div className={styles.noResultsContainer}>No doctors found matching your criteria.</div>;
  }

  return (
    <div className={styles.doctorListContainer}>
      {doctors.map((doctor) => (
        <div key={doctor.id} data-testid="doctor-card">
          <DoctorCard doctor={doctor} />
        </div>
      ))}
    </div>
  );
};

export default DoctorList;
