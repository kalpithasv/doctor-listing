// src/utils/filterUtils.js

// Filter doctors based on search term (name)
export const filterBySearch = (doctors, searchTerm) => {
  if (!searchTerm) return doctors;

  const lowerTerm = searchTerm.toLowerCase();

  return doctors.filter(doctor =>
    doctor.name?.toLowerCase().includes(lowerTerm)
  );
};

// Filter doctors by consultation mode (video or in clinic)
export const filterByConsultationMode = (doctors, consultationType) => {
    if (!consultationType) return doctors;
  
    console.log('Filtering by consultationType:', consultationType);
    const filtered = doctors.filter(doctor => doctor.videoConsult === true);
    console.log('Doctors with videoConsult:', filtered.length);
  
    if (consultationType === 'videoConsult') {
      return filtered;
    } else if (consultationType === 'inClinic') {
      return doctors.filter(doctor => doctor.inClinic === true);
    }
    return doctors;
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

// Filter doctors by availability
export const filterByAvailability = (doctors, availabilityFilter) => {
  if (!availabilityFilter) return doctors;

  if (availabilityFilter === 'available') {
    return doctors.filter(doctor => doctor.availability === true);
  }
  return doctors;
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
  filteredDoctors = filterByConsultationMode(filteredDoctors, filters.consultationType);
  filteredDoctors = filterBySpecialties(filteredDoctors, filters.specialties);
  filteredDoctors = filterByPriceRange(filteredDoctors, filters.priceRange);
  filteredDoctors = filterByAvailability(filteredDoctors, filters.availability);
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
