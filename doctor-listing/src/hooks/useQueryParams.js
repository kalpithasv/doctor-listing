// src/hooks/useQueryParams.js
import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

const useQueryParams = (filters, setFilters) => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Update filters from URL when component mounts or URL changes
  useEffect(() => {
    const search = searchParams.get('search') || '';
    const consultationType = searchParams.get('consultationType') || '';
    const sort = searchParams.get('sort') || '';
    const specialtiesParam = searchParams.get('specialties') || '';
    const specialties = specialtiesParam ? specialtiesParam.split(',') : [];

    const updatedFilters = {
      ...filters,
      search: search,
      consultationType: consultationType || filters.consultationType,
      sort: sort || filters.sort,
      specialties: specialties.length > 0 ? specialties : filters.specialties
    };

    setFilters(updatedFilters);
  }, [searchParams]);

  // Update URL when filters change
  const updateUrlFromFilters = (newFilters) => {
    const params = {};
    
    if (newFilters.search) {
      params.search = newFilters.search;
    }
    
    if (newFilters.consultationType) {
      params.consultationType = newFilters.consultationType;
    }
    
    if (newFilters.sort) {
      params.sort = newFilters.sort;
    }
    
    if (newFilters.specialties && newFilters.specialties.length > 0) {
      params.specialties = newFilters.specialties.join(',');
    }
    
    setSearchParams(params);
  };

  return { updateUrlFromFilters };
};

export default useQueryParams;