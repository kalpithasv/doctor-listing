import React from 'react';
// Import all modules at the top of the file
import * as DoctorCardModule from '../DoctorCard/DoctorCard';
import styles from './DoctorList.module.css';

// Then declare any constants from imports
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

  // Add a check to make sure DoctorCard is a valid component
  console.log("DoctorCard type:", typeof DoctorCard);

  return (
    <div className={styles.doctorListContainer}>
      {doctors.map(doctor => (
        <DoctorCard key={doctor.id || Math.random()} doctor={doctor} />
      ))}
    </div>
  );
};

export default DoctorList;