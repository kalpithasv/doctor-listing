import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './DoctorCard.module.css';

const DoctorCard = ({ doctor }) => {
  const navigate = useNavigate();
  const specialties = doctor && doctor.speciality ? doctor.speciality : [];
  
  const handleCardClick = () => {
    navigate(`/doctors/${doctor.id}`);
  };
  
  const handleBookAppointment = (e) => {
    e.stopPropagation(); // Prevent card click from triggering
    navigate(`/appointment/${doctor.id}`);
  };

  // Show rating stars based on doctor rating
  const renderRatingStars = (rating) => {
    const fullStars = Math.floor(rating || 0);
    const hasHalfStar = (rating || 0) - fullStars >= 0.5;
    
    return (
      <div className={styles.rating}>
        {[...Array(5)].map((_, index) => (
          <span key={index} className={
            index < fullStars 
              ? styles.starFilled 
              : (index === fullStars && hasHalfStar 
                  ? styles.starHalf 
                  : styles.starEmpty)
          }>★</span>
        ))}
        <span className={styles.ratingValue}>({rating || 0})</span>
      </div>
    );
  };
  
  return (
    <div className={styles.doctorCard} data-testid="doctor-card" onClick={handleCardClick}>
      <div className={styles.doctorProfile}>
        <div className={styles.doctorAvatar}>
          <img 
            src={doctor.image || `https://via.placeholder.com/60?text=${doctor.name ? doctor.name.charAt(0) : ''}`} 
            alt={doctor.name || 'Doctor'} 
          />
          {doctor.availability && doctor.availability === 'available' && (
            <span className={styles.availabilityBadge}>Available Today</span>
          )}
        </div>
        <div className={styles.doctorInfo}>
          <h3 className={styles.doctorName} data-testid="doctor-name">{doctor.name || 'Unknown Doctor'}</h3>
          <p className={styles.doctorSpecialty} data-testid="doctor-specialty">
            {specialties.join(', ')}
          </p>
          <p className={styles.doctorQualification}>{doctor.qualification || 'Medical Professional'}</p>
          <p className={styles.doctorExperience} data-testid="doctor-experience">
            {doctor.experience || 0} yrs experience
          </p>
          
          {renderRatingStars(doctor.rating)}
          
          <div className={styles.clinicInfo}>
            <div className={styles.clinicName}>{doctor.clinicName || 'Clinic'}</div>
            <div className={styles.location}>{doctor.location || 'Location not specified'}</div>
          </div>
        </div>
      </div>
      
      <div className={styles.doctorActions}>
        <div className={styles.consultationFee}>
          <span className={styles.feeLabel}>Consultation Fee:</span>
          <span className={styles.feeAmount} data-testid="doctor-fee">₹ {doctor.fees || 'Not specified'}</span>
        </div>
        
        <div className={styles.consultationTypes}>
          {doctor.videoConsult && (
            <span className={styles.videoConsult}>
              <i className={styles.videoIcon}>📹</i> Video Consult
            </span>
          )}
          {doctor.inClinic && (
            <span className={styles.inClinic}>
              <i className={styles.clinicIcon}>🏥</i> In Clinic
            </span>
          )}
        </div>
        
        <button 
          className={styles.appointmentButton}
          onClick={handleBookAppointment}
        >
          Book Appointment
        </button>
      </div>
    </div>
  );
};

export default DoctorCard;