import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom'; // For URL query params syncing
import Autocomplete from '../components/Autocomplete/Autocomplete';
import FilterPanel from '../components/FilterPanel/FilterPanel';
import DoctorList from '../components/DoctorList/DoctorList';
import { fetchDoctors } from '../services/doctorService';
import { applyFilters, extractSpecialties } from '../utils/filterUtils';
import styles from './Dashboard.module.css';

const Dashboard = () => {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const specialtiesParam = searchParams.get('specialties') || '';
  const selectedSpecialtiesFromUrl = specialtiesParam ? specialtiesParam.split(',') : [];



  // Use URL query params to sync filters state

  // Initialize filters state from URL query params or defaults
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    consultationType: searchParams.get('consultationType') || null,
    specialties: specialties,
    priceRange: [
      Number(searchParams.get('priceMin')) || 0,
      Number(searchParams.get('priceMax')) || 5000,
    ],
    sort: searchParams.get('sort') || 'fees',
  });
  

  // Fetch doctors data once on mount
  useEffect(() => {
    const loadDoctors = async () => {
      try {
        setLoading(true);
        const data = await fetchDoctors();

        // Normalize fees to number and availability to boolean
        const enhancedData = data.map((doctor) => ({
          ...doctor,
          fees: Number(doctor.fees) || 0,
          availability: doctor.availability === 'available',
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
    if (filters.specialties.length > 0) params.specialties = filters.specialties.join(','); // <-- join to string
    if (filters.priceRange[0] !== 0) params.priceMin = filters.priceRange[0];
    if (filters.priceRange[1] !== 5000) params.priceMax = filters.priceRange[1];
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
          <button onClick={clearFilters} disabled={
            !filters.search &&
            !filters.consultationType &&
            filters.specialties.length === 0 &&
            filters.priceRange[0] === 0 &&
            filters.priceRange[1] === 5000 &&
            filters.sort === 'fees'
          }>
            Clear All
          </button>
          <DoctorList doctors={filteredDoctors} loading={loading} error={error} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
