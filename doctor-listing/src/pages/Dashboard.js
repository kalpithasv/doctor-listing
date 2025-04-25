import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom'; // For URL query params syncing
import Autocomplete from '../components/Autocomplete/Autocomplete';
import FilterPanel from '../components/FilterPanel/FilterPanel';
import DoctorList from '../components/DoctorList/DoctorList';
import { fetchDoctors } from '../services/doctorService';
import { applyFilters, extractSpecialties } from '../utils/filterUtils';
import styles from './Dashboard.module.css';

// Inline parseFee function to extract numeric fee from strings like "₹ 500"
const parseFee = (fee) => {
  if (!fee) return null;
  const feeStr = fee.toString().replace(/[^\d.]/g, ''); // Remove non-digit/non-dot chars
  const feeNum = Number(feeStr);
  return isNaN(feeNum) ? null : feeNum;
};

const Dashboard = () => {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchParams, setSearchParams] = useSearchParams();

  // Parse specialties from URL query params (comma-separated string)
  const specialtiesParam = searchParams.get('specialties') || '';
  const selectedSpecialtiesFromUrl = specialtiesParam ? specialtiesParam.split(',') : [];
  
  // Initialize filters state from URL query params or defaults
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    consultationType: searchParams.get('consultationType') || null,
    specialties: selectedSpecialtiesFromUrl,
    priceRange: [
      Number(searchParams.get('priceMin')) || 0,
      Number(searchParams.get('priceMax')) || 5000,
    ],
    availability: searchParams.get('availability') || null, // e.g. 'available' or null
    sort: searchParams.get('sort') || 'fees',
  });

  // Fetch doctors data once on mount
  useEffect(() => {
    const loadDoctors = async () => {
      try {
        setLoading(true);
        const data = await fetchDoctors();

        // Normalize doctor data
        const enhancedData = data.map((doctor) => ({
          ...doctor,
          fees: parseFee(doctor.fees),
          videoConsult: !!doctor.video_consult || !!doctor.videoConsult,
          inClinic: !!doctor.in_clinic || !!doctor.inClinic,
          availability: doctor.availability === 'available' || doctor.availability === true,
          speciality: Array.isArray(doctor.speciality) ? doctor.speciality : [doctor.speciality].filter(Boolean),
        }));

        setDoctors(enhancedData);
        setSpecialties(extractSpecialties(enhancedData));
        setLoading(false);
      } catch (err) {
        setError('Failed to load doctors.');
        setLoading(false);
      }
    };

    loadDoctors();
  }, []);

  // Update URL query params when filters change
  useEffect(() => {
    const params = {};

    if (filters.search) params.search = filters.search;
    if (filters.consultationType) params.consultationType = filters.consultationType;
    if (filters.specialties.length > 0) params.specialties = filters.specialties.join(',');
    if (filters.priceRange[0] !== 0) params.priceMin = filters.priceRange[0];
    if (filters.priceRange[1] !== 5000) params.priceMax = filters.priceRange[1];
    if (filters.availability) params.availability = filters.availability;
    if (filters.sort) params.sort = filters.sort;

    setSearchParams(params);
  }, [filters, setSearchParams]);

  // Apply filters whenever doctors or filters state changes
  useEffect(() => {
    if (!doctors.length) {
      setFilteredDoctors([]);
      return;
    }

    const filtered = applyFilters(doctors, filters);
    setFilteredDoctors(filtered);
  }, [doctors, filters]);

  // Handlers to update filters state
  const handleSearch = (searchTerm) => {
    setFilters((prev) => ({ ...prev, search: searchTerm }));
  };

  const handleConsultationTypeChange = (consultationType) => {
    setFilters((prev) => ({
      ...prev,
      consultationType: prev.consultationType === consultationType ? null : consultationType,
    }));
  };

  const handleSpecialtyChange = (specialty) => {
    setFilters((prev) => {
      const specialties = [...prev.specialties];
      const index = specialties.indexOf(specialty);
      if (index === -1) specialties.push(specialty);
      else specialties.splice(index, 1);
      return { ...prev, specialties };
    });
  };

  const handlePriceRangeChange = (priceRange) => {
    setFilters((prev) => ({ ...prev, priceRange }));
  };

  const handleSortChange = (sort) => {
    setFilters((prev) => ({ ...prev, sort }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      consultationType: null,
      specialties: [],
      priceRange: [0, 5000],
      availability: null,
      sort: 'fees',
    });
  };

  return (
    <div className={styles.dashboardContainer}>
      <Autocomplete doctors={doctors} onSearch={handleSearch} searchTerm={filters.search} />

      <div className={styles.dashboardContent}>
        <FilterPanel
          filters={filters}
          specialties={specialties}
          onSortChange={handleSortChange}
          onSpecialtyChange={handleSpecialtyChange}
          onConsultationModeChange={handleConsultationTypeChange}
          onPriceRangeChange={handlePriceRangeChange}
        />

        <div className={styles.resultsContainer}>
          <button
            onClick={clearFilters}
            disabled={
              !filters.search &&
              !filters.consultationType &&
              filters.specialties.length === 0 &&
              filters.priceRange[0] === 0 &&
              filters.priceRange[1] === 5000 &&
              !filters.availability &&
              filters.sort === 'fees'
            }
          >
            Clear All
          </button>
          <DoctorList doctors={filteredDoctors} loading={loading} error={error} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
