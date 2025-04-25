// src/components/FilterPanel/FilterPanel.js
import React from 'react';
import styles from './FilterPanel.module.css';

const FilterPanel = ({ 
  filters, 
  specialties, 
  onSortChange, 
  onSpecialtyChange, 
  onConsultationModeChange,
  onPriceRangeChange
}) => {
  // Handle price range minimum change
  const handleMinPriceChange = (e) => {
    const minValue = parseInt(e.target.value) || 0;
    const [, maxValue] = filters.priceRange;
    onPriceRangeChange([minValue, maxValue]);
  };

  // Handle price range maximum change
  const handleMaxPriceChange = (e) => {
    const maxValue = parseInt(e.target.value) || 5000;
    const [minValue] = filters.priceRange;
    onPriceRangeChange([minValue, maxValue]);
  };

  return (
    <div className={styles.filterPanel}>
      <div className={styles.filterSection}>
        <h3 className={styles.filterTitle}>Sort By</h3>
        <div className={styles.sortOptions}>
          <button 
            className={`${styles.sortButton} ${filters.sort === 'fees' ? styles.active : ''}`}
            onClick={() => onSortChange('fees')}
          >
            Price - Low to High
          </button>
          <button 
            className={`${styles.sortButton} ${filters.sort === 'fees-desc' ? styles.active : ''}`}
            onClick={() => onSortChange('fees-desc')}
          >
            Price - High to Low
          </button>
          <button 
            className={`${styles.sortButton} ${filters.sort === 'experience' ? styles.active : ''}`}
            onClick={() => onSortChange('experience')}
          >
            Experience
          </button>
          <button 
            className={`${styles.sortButton} ${filters.sort === 'availability' ? styles.active : ''}`}
            onClick={() => onSortChange('availability')}
          >
            Availability
          </button>
        </div>
      </div>

      <div className={styles.filterSection}>
        <h3 className={styles.filterTitle}>Consultation Type</h3>
        <div className={styles.consultationOptions}>
          <button 
            className={`${styles.consultButton} ${filters.consultationType === 'videoConsult' ? styles.active : ''}`}
            onClick={() => onConsultationModeChange('videoConsult')}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="7" width="20" height="15" rx="2" ry="2"></rect>
              <polyline points="17 2 12 7 7 2"></polyline>
            </svg>
            Video Consult
          </button>
          <button 
            className={`${styles.consultButton} ${filters.consultationType === 'inClinic' ? styles.active : ''}`}
            onClick={() => onConsultationModeChange('inClinic')}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
            In Clinic
          </button>
        </div>
      </div>

      <div className={styles.filterSection}>
        <h3 className={styles.filterTitle}>Price Range</h3>
        <div className={styles.priceRangeInputs}>
          <div className={styles.rangeInput}>
            <label>Min</label>
            <input
              type="number"
              min="0"
              max="5000"
              value={filters.priceRange[0]}
              onChange={handleMinPriceChange}
            />
          </div>
          <div className={styles.rangeInput}>
            <label>Max</label>
            <input
              type="number"
              min="0"
              max="5000"
              value={filters.priceRange[1]}
              onChange={handleMaxPriceChange}
            />
          </div>
        </div>
        <div className={styles.priceRangeSlider}>
          <input
            type="range"
            min="0"
            max="5000"
            value={filters.priceRange[1]}
            onChange={handleMaxPriceChange}
            className={styles.slider}
          />
        </div>
      </div>

      <div className={styles.filterSection}>
        <h3 className={styles.filterTitle}>Specialties</h3>
        <div className={styles.specialtyList}>
          {specialties.length > 0 ? (
            specialties.map((specialty, index) => (
              <label key={index} className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={filters.specialties.includes(specialty)}
                  onChange={() => onSpecialtyChange(specialty)}
                  className={styles.checkbox}
                />
                <span className={styles.checkmark}></span>
                {specialty}
              </label>
            ))
          ) : (
            <p className={styles.noSpecialties}>No specialties found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;