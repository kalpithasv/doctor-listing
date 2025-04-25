// src/utils/filterUtils.js

// Filter doctors based on search term (name)
export const filterBySearch = (doctors, searchTerm) => {
    if (!searchTerm) return doctors;
  
    const lowerTerm = searchTerm.toLowerCase();
  
    return doctors.filter(doctor =>
      doctor.name?.toLowerCase().includes(lowerTerm)
    );
  };
  
  // Filter doctors by consultation type (single select)
  export const filterByConsultationType = (doctors, consultationType) => {
    if (!consultationType) return doctors;
  
    switch (consultationType) {
      case 'videoConsult':
        return doctors.filter(doctor => doctor.videoConsult === true);
      case 'inClinic':
        return doctors.filter(doctor => doctor.inClinic === true);
      default:
        return doctors;
    }
  };
  
  // Filter doctors by specialties (multi-select)
  export const filterBySpecialties = (doctors, selectedSpecialties) => {
    if (!selectedSpecialties || selectedSpecialties.length === 0) return doctors;
  
    return doctors.filter(doctor =>
      Array.isArray(doctor.speciality) &&
      doctor.speciality.some(specialty => selectedSpecialties.includes(specialty))
    );
  };
  
  // Filter doctors by price range [min, max]
  export const filterByPriceRange = (doctors, priceRange) => {
    if (!priceRange || priceRange.length !== 2) return doctors;
  
    const [min, max] = priceRange;
  
    return doctors.filter(doctor => {
      const fees = Number(doctor.fees);
      if (isNaN(fees)) return false; // exclude if fees invalid
      return fees >= min && fees <= max;
    });
  };
  
  // Sort doctors by fees (ascending), experience (descending), or fees descending
  export const sortDoctors = (doctors, sortBy) => {
    if (!sortBy) return doctors;
  
    const sortedDoctors = [...doctors];
  
    if (sortBy === 'fees') {
      sortedDoctors.sort((a, b) => (Number(a.fees) || 0) - (Number(b.fees) || 0));
    } else if (sortBy === 'fees-desc') {
      sortedDoctors.sort((a, b) => (Number(b.fees) || 0) - (Number(a.fees) || 0));
    } else if (sortBy === 'experience') {
      sortedDoctors.sort((a, b) => (b.experience || 0) - (a.experience || 0));
    }
  
    return sortedDoctors;
  };
  
  // Apply all filters in sequence
  export const applyFilters = (doctors, filters) => {
    let filteredDoctors = [...doctors];
  
    filteredDoctors = filterBySearch(filteredDoctors, filters.search);
    filteredDoctors = filterByConsultationType(filteredDoctors, filters.consultationType);
    filteredDoctors = filterBySpecialties(filteredDoctors, filters.specialties);
    filteredDoctors = filterByPriceRange(filteredDoctors, filters.priceRange); // Price filter added here
    filteredDoctors = sortDoctors(filteredDoctors, filters.sort);
  
    return filteredDoctors;
  };
  
  // Extract unique specialties from all doctors, sorted alphabetically
  export const extractSpecialties = (doctors) => {
    const specialtiesSet = new Set();
  
    doctors.forEach(doctor => {
      if (Array.isArray(doctor.speciality)) {
        doctor.speciality.forEach(specialty => {
          specialtiesSet.add(specialty);
        });
      } else if (typeof doctor.speciality === 'string') {
        specialtiesSet.add(doctor.speciality);
      }
    });
  
    return Array.from(specialtiesSet).sort();
  };
  