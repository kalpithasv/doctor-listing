// src/hooks/useQueryParams.js
import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

const useQueryParams = (filters, setFilters) => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Initialize filters from URL query params on mount and when URL changes
  useEffect(() => {
    const search = searchParams.get('search') || '';
    const consultationType = searchParams.get('consultationType') || null;
    const sort = searchParams.get('sort') || 'fees';
    const specialtiesParam = searchParams.get('specialties') || '';
    const specialties = specialtiesParam ? specialtiesParam.split(',') : [];
    const priceMin = Number(searchParams.get('priceMin')) || 0;
    const priceMax = Number(searchParams.get('priceMax')) || 5000;

    const updatedFilters = {
      ...filters,
      search,
      consultationType,
      sort,
      specialties: specialties.length > 0 ? specialties : [],
      priceRange: [priceMin, priceMax],
    };

    // Only update filters if changed to avoid infinite loops
    const filtersChanged =
      filters.search !== updatedFilters.search ||
      filters.consultationType !== updatedFilters.consultationType ||
      filters.sort !== updatedFilters.sort ||
      filters.priceRange[0] !== updatedFilters.priceRange[0] ||
      filters.priceRange[1] !== updatedFilters.priceRange[1] ||
      filters.specialties.length !== updatedFilters.specialties.length ||
      !filters.specialties.every((spec) => updatedFilters.specialties.includes(spec));

    if (filtersChanged) {
      setFilters(updatedFilters);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // Update URL when filters change
  useEffect(() => {
    const params = {};

    if (filters.search) params.search = filters.search;
    if (filters.consultationType) params.consultationType = filters.consultationType;
    if (filters.sort) params.sort = filters.sort;
    if (filters.specialties && filters.specialties.length > 0) {
      params.specialties = filters.specialties.join(',');
    }
    if (filters.priceRange) {
      const [min, max] = filters.priceRange;
      if (min > 0) params.priceMin = min;
      if (max < 5000) params.priceMax = max;
    }

    setSearchParams(params);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  return {};
};

export default useQueryParams;
