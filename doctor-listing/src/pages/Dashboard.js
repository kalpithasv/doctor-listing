// src/pages/Dashboard.js
import React, { useState, useEffect } from 'react';
import FilterPanel from '../components/FilterPanel/FilterPanel';
import DoctorList from '../components/DoctorList/DoctorList';
import Autocomplete from '../components/Autocomplete/Autocomplete';
import { fetchDoctors } from '../services/doctorService';
import styles from './Dashboard.module.css';

const Dashboard = () => {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [specialties, setSpecialties] = useState([]);
  const [filters, setFilters] = useState({
    sort: 'fees',
    specialties: [],
    consultationType: null,
    searchTerm: '',
    priceRange: [0, 5000]
  });

  // Fetch doctors data
  useEffect(() => {
    const loadDoctors = async () => {
      try {
        setLoading(true);
        const data = await fetchDoctors();
        const enhancedData = data.map(doctor => ({
          ...doctor,
          availability: Math.random() > 0.5
        }));
        
        setDoctors(enhancedData);
        
        // Extract unique specialties
        const uniqueSpecialties = new Set();
        enhancedData.forEach(doctor => {
          if (doctor.speciality && Array.isArray(doctor.speciality)) {
            doctor.speciality.forEach(spec => uniqueSpecialties.add(spec));
          } else if (doctor.speciality && typeof doctor.speciality === 'string') {
            uniqueSpecialties.add(doctor.speciality);
          }
        });
        setSpecialties(Array.from(uniqueSpecialties));
        
        setLoading(false);
      } catch (err) {
        setError('Failed to load doctors. Please try again later.');
        setLoading(false);
      }
    };
    
    loadDoctors();
  }, []);

  // Apply filters and sorting
  useEffect(() => {
    let result = [...doctors];
    
    // Apply search filter
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      result = result.filter(doctor => 
        doctor.name?.toLowerCase().includes(term) ||
        (doctor.speciality && Array.isArray(doctor.speciality) && 
         doctor.speciality.some(spec => spec.toLowerCase().includes(term))) ||
        (doctor.location && doctor.location?.toLowerCase().includes(term))
      );
    }
    
    // Apply specialty filter
    if (filters.specialties.length > 0) {
      result = result.filter(doctor => 
        doctor.speciality && (
          Array.isArray(doctor.speciality) ?
          doctor.speciality.some(spec => filters.specialties.includes(spec)) :
          filters.specialties.includes(doctor.speciality)
        )
      );
    }
    
    // Apply consultation type filter
    if (filters.consultationType) {
      result = result.filter(doctor => doctor[filters.consultationType] === true);
    }
    
    // Apply price range filter
    if (filters.priceRange && filters.priceRange.length === 2) {
      const [min, max] = filters.priceRange;
      result = result.filter(doctor => 
        doctor.fees >= min && doctor.fees <= max
      );
    }
    
    // Apply sorting
    if (filters.sort === 'fees') {
      result.sort((a, b) => (a.fees || 0) - (b.fees || 0));
    } else if (filters.sort === 'fees-desc') {
      result.sort((a, b) => (b.fees || 0) - (a.fees || 0));
    } else if (filters.sort === 'experience') {
      result.sort((a, b) => (b.experience || 0) - (a.experience || 0));
    } else if (filters.sort === 'availability') {
      // Sort by availability (available doctors first)
      result.sort((a, b) => {
        if (a.availability === b.availability) return 0;
        return a.availability ? -1 : 1;
      });
    }
    
    setFilteredDoctors(result);
  }, [doctors, filters]);

  // Handle search
  const handleSearch = (searchTerm) => {
    setFilters(prev => ({ ...prev, searchTerm }));
  };

  // Handle sort change
  const handleSortChange = (sortValue) => {
    setFilters(prev => ({ ...prev, sort: sortValue }));
  };

  // Handle specialty change
  const handleSpecialtyChange = (specialty) => {
    setFilters(prev => {
      const specialties = [...prev.specialties];
      const index = specialties.indexOf(specialty);
      
      if (index === -1) {
        specialties.push(specialty);
      } else {
        specialties.splice(index, 1);
      }
      
      return { ...prev, specialties };
    });
  };

  // Handle consultation mode change
  const handleConsultationModeChange = (mode) => {
    setFilters(prev => {
      // Toggle the consultation type if clicking on the same mode
      const consultationType = prev.consultationType === mode ? null : mode;
      return { ...prev, consultationType };
    });
  };

  // Handle price range change
  const handlePriceRangeChange = (range) => {
    setFilters(prev => ({ ...prev, priceRange: range }));
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      sort: 'fees',
      specialties: [],
      consultationType: null,
      searchTerm: '',
      priceRange: [0, 5000]
    });
  };

  const noFiltersActive = !filters.specialties.length && !filters.consultationType && !filters.searchTerm;

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.dashboardHeader}>
        <h1 className={styles.dashboardTitle}>Find the Right Doctor</h1>
        <p className={styles.dashboardSubtitle}>
          Search from our network of qualified healthcare professionals
        </p>
      </div>
      
      <div className={styles.searchSection}>
        <Autocomplete 
          doctors={doctors} 
          onSearch={handleSearch}
          searchTerm={filters.searchTerm}
        />
      </div>
      
      <div className={styles.dashboardContent}>
        <aside className={styles.filterSidebar}>
          <div className={styles.filterHeader}>
            <h2>Filter Results</h2>
            <button 
              onClick={clearFilters}
              className={styles.clearButton}
              disabled={!filters.specialties.length && !filters.consultationType && !filters.searchTerm}
            >
              Clear All
            </button>
          </div>
          <FilterPanel 
            filters={filters}
            specialties={specialties}
            onSortChange={handleSortChange}
            onSpecialtyChange={handleSpecialtyChange}
            onConsultationModeChange={handleConsultationModeChange}
            onPriceRangeChange={handlePriceRangeChange}
          />
        </aside>
        
        <div className={styles.resultsContainer}>
            {noFiltersActive ? (
              <div className={styles.sloganContainer}>
                <h2 className={styles.slogan}>Your Health, Our Priority</h2>
                <p className={styles.sloganSubtitle}>Find the best care tailored to your needs.</p>
              </div>
            ) : (
              <>
                <div className={styles.resultsHeader}>
                  <h2>
                    {loading ? 'Finding doctors...' : 
                     `${filteredDoctors.length} Doctors Available`}
                  </h2>
                  <div className={styles.activeFilters}>
                    {filters.specialties.length > 0 && (
                      <span className={styles.filterBadge}>
                        {filters.specialties.length} Specialties
                        <button 
                          className={styles.removeFilterButton}
                          onClick={() => setFilters(prev => ({ ...prev, specialties: [] }))}
                        >
                          ×
                        </button>
                      </span>
                    )}
                    {filters.consultationType && (
                      <span className={styles.filterBadge}>
                        {filters.consultationType === 'videoConsult' ? 'Video Consult' : 'In Clinic'}
                        <button 
                          className={styles.removeFilterButton}
                          onClick={() => setFilters(prev => ({ ...prev, consultationType: null }))}
                        >
                          ×
                        </button>
                      </span>
                    )}
                    {filters.searchTerm && (
                      <span className={styles.filterBadge}>
                        Search: "{filters.searchTerm}"
                        <button 
                          className={styles.removeFilterButton}
                          onClick={() => setFilters(prev => ({ ...prev, searchTerm: '' }))}
                        >
                          ×
                        </button>
                      </span>
                    )}
                  </div>
                </div>
                <DoctorList 
                  doctors={filteredDoctors} 
                  loading={loading} 
                  error={error} 
                />
              </>
            )}
          </div>
      </div>
    </div>
  );
};

export default Dashboard;
