// src/pages/DoctorDetail.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getDoctorById } from '../services/doctorService';
import styles from './DoctorDetail.module.css';

const DoctorDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('about');
  const [availableSlots, setAvailableSlots] = useState([]);

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        setLoading(true);
        const data = await getDoctorById(id);
        setDoctor(data);
        
        // Generate some mock available slots for the next 5 days
        const slots = [];
        const today = new Date();
        
        for (let i = 0; i < 5; i++) {
          const date = new Date(today);
          date.setDate(today.getDate() + i);
          
          // Generate random slots for this day
          const daySlots = [];
          const slotCount = Math.floor(Math.random() * 5) + 2; // 2-6 slots
          
          for (let j = 0; j < slotCount; j++) {
            const hour = 9 + Math.floor(Math.random() * 8);
            const minute = Math.random() > 0.5 ? '00' : '30';
            daySlots.push(`${hour}:${minute}`);
          }
          
          // Sort slots by time
          daySlots.sort();
          
          slots.push({
            date: date,
            slots: daySlots
          });
        }
        
        setAvailableSlots(slots);
        setLoading(false);
      } catch (err) {
        setError('Failed to load doctor details. Please try again later.');
        setLoading(false);
      }
    };

    fetchDoctor();
  }, [id]);

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const formatDate = (date) => {
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Loading doctor details...</p>
      </div>
    );
  }

  if (error || !doctor) {
    return (
      <div className={styles.errorContainer}>
        <p>{error || 'Doctor not found'}</p>
        <button className={styles.backButton} onClick={handleBackClick}>
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className={styles.detailContainer}>
      <button className={styles.backButton} onClick={handleBackClick}>
        &larr; Back to Doctors
      </button>
      
      <div className={styles.doctorHeader}>
        <div className={styles.doctorAvatar}>
          <img 
            src={`https://via.placeholder.com/120?text=${doctor.name.charAt(0)}`} 
            alt={doctor.name} 
          />
        </div>
        
        <div className={styles.doctorHeaderInfo}>
          <h1 className={styles.doctorName}>{doctor.name}</h1>
          <p className={styles.doctorSpecialty}>
            {doctor.speciality ? 
              (Array.isArray(doctor.speciality) ? 
                doctor.speciality.join(', ') : 
                doctor.speciality) : 
              ''}
          </p>
          <p className={styles.doctorQualification}>{doctor.qualification}</p>
          <div className={styles.doctorBadges}>
            <span className={styles.experienceBadge}>
              {doctor.experience} Years Experience
            </span>
            {doctor.videoConsult && (
              <span className={styles.videoBadge}>Video Consult Available</span>
            )}
            {doctor.inClinic && (
              <span className={styles.clinicBadge}>In-Clinic Available</span>
            )}
          </div>
        </div>
        
        <div className={styles.appointmentSection}>
          <div className={styles.feeInfo}>
            <span className={styles.feeLabel}>Consultation Fee</span>
            <span className={styles.feeAmount}>₹ {doctor.fees}</span>
          </div>
        </div>
      </div>
      
      <div className={styles.detailTabs}>
        <button 
          className={`${styles.tabButton} ${activeTab === 'about' ? styles.activeTab : ''}`}
          onClick={() => handleTabChange('about')}
        >
          About
        </button>
        <button 
          className={`${styles.tabButton} ${activeTab === 'book' ? styles.activeTab : ''}`}
          onClick={() => handleTabChange('book')}
        >
          Book Appointment
        </button>
        <button 
          className={`${styles.tabButton} ${activeTab === 'location' ? styles.activeTab : ''}`}
          onClick={() => handleTabChange('location')}
        >
          Location & Timing
        </button>
        <button 
          className={`${styles.tabButton} ${activeTab === 'reviews' ? styles.activeTab : ''}`}
          onClick={() => handleTabChange('reviews')}
        >
          Reviews
        </button>
      </div>
      
      <div className={styles.tabContent}>
        {activeTab === 'about' && (
          <div className={styles.aboutSection}>
            <h2>About Dr. {doctor.name}</h2>
            <p className={styles.aboutText}>
              {doctor.about || `Dr. ${doctor.name} is a healthcare professional with ${doctor.experience} years of experience specializing in ${doctor.speciality ? (Array.isArray(doctor.speciality) ? doctor.speciality.join(', ') : doctor.speciality) : 'various medical fields'}. They have earned ${doctor.qualification} and are committed to providing quality healthcare.`}
            </p>
            
            <h3>Specializations</h3>
            <ul className={styles.specializationList}>
              {doctor.speciality && (
                Array.isArray(doctor.speciality) ? 
                  doctor.speciality.map((spec, index) => (
                    <li key={index} className={styles.specializationItem}>{spec}</li>
                  )) :
                  <li className={styles.specializationItem}>{doctor.speciality}</li>
              )}
            </ul>
            
            <h3>Services Offered</h3>
            <ul className={styles.servicesList}>
              {doctor.services ? (
                Array.isArray(doctor.services) ? 
                  doctor.services.map((service, index) => (
                    <li key={index} className={styles.serviceItem}>{service}</li>
                  )) :
                  <li className={styles.serviceItem}>{doctor.services}</li>
              ) : (
                <li className={styles.serviceItem}>General Consultation</li>
              )}
            </ul>
          </div>
        )}
        
        {activeTab === 'book' && (
          <div className={styles.bookingSection}>
            <h2>Book an Appointment</h2>
            
            <div className={styles.bookingOptions}>
              {doctor.videoConsult && (
                <button className={`${styles.bookingTypeButton} ${styles.videoButton}`}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="7" width="20" height="15" rx="2" ry="2"></rect>
                    <polyline points="17 2 12 7 7 2"></polyline>
                  </svg>
                  Video Consultation
                </button>
              )}
              
              {doctor.inClinic && (
                <button className={`${styles.bookingTypeButton} ${styles.clinicButton}`}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                    <polyline points="9 22 9 12 15 12 15 22"></polyline>
                  </svg>
                  In-Clinic Appointment
                </button>
              )}
            </div>
            
            <div className={styles.availabilityCalendar}>
              <h3>Available Slots</h3>
              <div className={styles.datesScrollContainer}>
                {availableSlots.map((daySlots, index) => (
                  <div key={index} className={styles.dateCard}>
                    <div className={styles.dateHeader}>
                      {formatDate(daySlots.date)}
                    </div>
                    <div className={styles.slotsContainer}>
                      {daySlots.slots.map((time, idx) => (
                        <button key={idx} className={styles.timeSlot}>
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className={styles.bookingCTA}>
              <p>Select a date and time to book your appointment</p>
              <button className={styles.bookNowButton} disabled>
                Book Now
              </button>
            </div>
          </div>
        )}
        
        {activeTab === 'location' && (
          <div className={styles.locationSection}>
            <h2>Clinic Location & Timings</h2>
            <div className={styles.clinicCard}>
              <h3 className={styles.clinicName}>{doctor.clinicName || `Dr. ${doctor.name}'s Clinic`}</h3>
              <p className={styles.clinicAddress}>{doctor.location || 'Address information not available'}</p>
              
              <div className={styles.timingsTable}>
                <h4>Consultation Hours</h4>
                <div className={styles.timingRow}>
                  <span className={styles.dayLabel}>Monday - Friday</span>
                  <span className={styles.timeValue}>9:00 AM - 6:00 PM</span>
                </div>
                <div className={styles.timingRow}>
                  <span className={styles.dayLabel}>Saturday</span>
                  <span className={styles.timeValue}>9:00 AM - 2:00 PM</span>
                </div>
                <div className={styles.timingRow}>
                  <span className={styles.dayLabel}>Sunday</span>
                  <span className={styles.timeValue}>Closed</span>
                </div>
              </div>
              
              <div className={styles.mapPlaceholder}>
                <div className={styles.mapImage}>Map Location Placeholder</div>
                <button className={styles.directionsButton}>Get Directions</button>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'reviews' && (
          <div className={styles.reviewsSection}>
            <h2>Patient Reviews</h2>
            
            {doctor.reviews && doctor.reviews.length > 0 ? (
              <>
                <div className={styles.reviewStats}>
                  <div className={styles.ratingOverview}>
                    <span className={styles.avgRating}>{doctor.rating || 4.5}</span>
                    <div className={styles.starRating}>
                      {[1, 2, 3, 4, 5].map(star => (
                        <span key={star} className={doctor.rating >= star ? styles.filledStar : styles.emptyStar}>★</span>
                      ))}
                    </div>
                    <span className={styles.reviewCount}>Based on {doctor.reviews.length} reviews</span>
                  </div>
                  
                  <div className={styles.ratingBreakdown}>
                    {[5, 4, 3, 2, 1].map(rating => {
                      const count = doctor.reviews.filter(r => Math.round(r.rating) === rating).length;
                      const percentage = (count / doctor.reviews.length) * 100 || 0;
                      
                      return (
                        <div key={rating} className={styles.ratingBar}>
                          <span className={styles.ratingLabel}>{rating} Stars</span>
                          <div className={styles.progressBarContainer}>
                            <div 
                              className={styles.progressBarFill} 
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                          <span className={styles.ratingCount}>{count}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                <div className={styles.reviewList}>
                  {doctor.reviews.map((review, index) => (
                    <div key={index} className={styles.reviewCard}>
                      <div className={styles.reviewHeader}>
                        <div className={styles.reviewerInfo}>
                          <div className={styles.reviewerInitial}>
                            {review.patientName ? review.patientName.charAt(0) : 'A'}
                          </div>
                          <div>
                            <p className={styles.reviewerName}>
                              {review.patientName || 'Anonymous Patient'}
                            </p>
                            <p className={styles.reviewDate}>
                              {review.date ? new Date(review.date).toLocaleDateString() : 'Recent visit'}
                            </p>
                          </div>
                        </div>
                        
                        <div className={styles.reviewRating}>
                          {[1, 2, 3, 4, 5].map(star => (
                            <span key={star} className={review.rating >= star ? styles.filledStar : styles.emptyStar}>★</span>
                          ))}
                        </div>
                      </div>
                      
                      <div className={styles.reviewContent}>
                        <p>{review.comment || 'Good experience with the doctor.'}</p>
                      </div>
                      
                      {review.treatmentType && (
                        <div className={styles.treatmentInfo}>
                          <span className={styles.treatmentLabel}>Treatment:</span>
                          <span className={styles.treatmentType}>{review.treatmentType}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                
                <div className={styles.paginationControls}>
                  <button className={styles.paginationButton} disabled>Previous</button>
                  <span className={styles.pageIndicator}>Page 1 of 1</span>
                  <button className={styles.paginationButton} disabled>Next</button>
                </div>
              </>
            ) : (
              <div className={styles.noReviews}>
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                </svg>
                <p className={styles.noReviewsMessage}>No reviews available for this doctor yet.</p>
                <p className={styles.noReviewsSubtext}>Be the first to share your experience!</p>
              </div>
            )}
            
            <div className={styles.writeReviewContainer}>
              <h3>Write a Review</h3>
              <p className={styles.reviewHelpText}>
                Share your experience to help other patients make informed decisions
              </p>
              
              <button className={styles.writeReviewButton}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
                Write Review
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorDetail;