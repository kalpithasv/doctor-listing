// src/components/Autocomplete/Autocomplete.js
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import styles from './Autocomplete.module.css';

const Autocomplete = ({ doctors, onSearch, searchTerm = '' }) => {
  const [input, setInput] = useState(searchTerm);
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const wrapperRef = useRef(null);

  useEffect(() => {
    setInput(searchTerm);
  }, [searchTerm]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInput(value);

    if (value.trim() === '') {
      setSuggestions([]);
      setIsOpen(false);
      onSearch('');
    } else {
      const filteredSuggestions = doctors.filter(doctor =>
        doctor.name.toLowerCase().includes(value.toLowerCase()) ||
        (doctor.speciality && Array.isArray(doctor.speciality) &&
          doctor.speciality.some(spec => spec.toLowerCase().includes(value.toLowerCase()))) ||
        (doctor.location && doctor.location.toLowerCase().includes(value.toLowerCase()))
      ).slice(0, 3); // Limit to 3 suggestions

      setSuggestions(filteredSuggestions);
      setIsOpen(true);
    }
  };

  const handleSelection = (doctorName) => {
    setInput(doctorName);
    onSearch(doctorName);
    setIsOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(input);
    setIsOpen(false);
  };

  return (
    <div className={styles.autocompleteContainer} ref={wrapperRef}>
      <form onSubmit={handleSubmit} className={styles.searchForm}>
        <div className={styles.inputWrapper}>
          <svg
            className={styles.searchIcon}
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            placeholder="Search by doctor, specialty, location..."
            className={styles.searchInput}
            aria-label="Search doctors"
            data-testid="autocomplete-input"  // <-- Added here
          />
          {input && (
            <button
              type="button"
              className={styles.clearButton}
              onClick={() => {
                setInput('');
                onSearch('');
                setSuggestions([]);
              }}
            >
              ×
            </button>
          )}
        </div>
        <button type="submit" className={styles.searchButton}>
          Search
        </button>
      </form>

      {isOpen && suggestions.length > 0 && (
        <ul className={styles.suggestionsList}>
          {suggestions.map((doctor) => (
            <li
              key={doctor.id}
              className={styles.suggestionItem}
              data-testid="suggestion-item"  // <-- Added here
            >
              <Link
                to={`/doctors/${doctor.id}`}
                className={styles.suggestionLink}
                onClick={() => handleSelection(doctor.name)}
              >
                <div className={styles.doctorAvatarSmall}>
                  {doctor.name.charAt(0)}
                </div>
                <div className={styles.suggestionContent}>
                  <span className={styles.doctorName}>{doctor.name}</span>
                  <span className={styles.doctorDetail}>
                    {doctor.speciality
                      ? Array.isArray(doctor.speciality)
                        ? doctor.speciality.join(', ')
                        : doctor.speciality
                      : ''}
                  </span>
                </div>
              </Link>
            </li>
          ))}
          <li className={styles.viewAllItem}>
            <button
              className={styles.viewAllButton}
              onClick={() => {
                onSearch(input);
                setIsOpen(false);
              }}
            >
              View all results
            </button>
          </li>
        </ul>
      )}
    </div>
  );
};

export default Autocomplete;
