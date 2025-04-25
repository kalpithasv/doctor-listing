// src/utils/filterUtils.js

// Filter doctors based on search term
export const filterBySearch = (doctors, searchTerm) => {
    if (!searchTerm) return doctors;
    
    return doctors.filter(doctor => 
      doctor.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };
  
  // Filter doctors by consultation type
  export const filterByConsultationType = (doctors, consultationType) => {
    if (!consultationType) return doctors;
    
    switch (consultationType) {
      case 'videoConsult':
        return doctors.filter(doctor => doctor.videoConsult);
      case 'inClinic':
        return doctors.filter(doctor => doctor.inClinic);
      default:
        return doctors;
    }
  };
  
  // Filter doctors by specialties
  export const filterBySpecialties = (doctors, selectedSpecialties) => {
    if (!selectedSpecialties || selectedSpecialties.length === 0) return doctors;
    
    return doctors.filter(doctor => 
      doctor.speciality.some(specialty => selectedSpecialties.includes(specialty))
    );
  };
  
  // Sort doctors by fees (ascending) or experience (descending)
  export const sortDoctors = (doctors, sortBy) => {
    if (!sortBy) return doctors;
    
    const sortedDoctors = [...doctors];
    
    if (sortBy === 'fees') {
      sortedDoctors.sort((a, b) => a.fees - b.fees);
    } else if (sortBy === 'experience') {
      sortedDoctors.sort((a, b) => b.experience - a.experience);
    }
    
    return sortedDoctors;
  };
  
  // Apply all filters in chain
  export const applyFilters = (doctors, filters) => {
    let filteredDoctors = [...doctors];
    
    // Apply search filter
    filteredDoctors = filterBySearch(filteredDoctors, filters.search);
    
    // Apply consultation type filter
    filteredDoctors = filterByConsultationType(filteredDoctors, filters.consultationType);
    
    // Apply specialty filters
    filteredDoctors = filterBySpecialties(filteredDoctors, filters.specialties);
    
    // Apply sorting
    filteredDoctors = sortDoctors(filteredDoctors, filters.sort);
    
    return filteredDoctors;
  };
  
  // Extract unique specialties from all doctors
  export const extractSpecialties = (doctors) => {
    const specialtiesSet = new Set();
    
    doctors.forEach(doctor => {
      doctor.speciality.forEach(specialty => {
        specialtiesSet.add(specialty);
      });
    });
    
    return Array.from(specialtiesSet).sort();
  };