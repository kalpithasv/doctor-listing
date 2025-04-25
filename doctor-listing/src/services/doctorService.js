// src/services/doctorService.js
import axios from 'axios';

const API_URL = 'https://srijandubey.github.io/campus-api-mock/SRM-C1-25.json';

export const fetchDoctors = async () => {
  try {
    const response = await axios.get(API_URL);
    
    // Add a unique ID to each doctor if they don't have one
    const doctorsWithIds = response.data.map((doctor, index) => ({
      ...doctor,
      id: doctor.id || `doc-${index + 1}`
    }));
    
    return doctorsWithIds;
  } catch (error) {
    console.error('Error fetching doctors:', error);
    throw error;
  }
};

export const getDoctorById = async (id) => {
  try {
    const doctors = await fetchDoctors();
    const doctor = doctors.find(doc => doc.id === id);
    
    if (!doctor) {
      throw new Error('Doctor not found');
    }
    
    return doctor;
  } catch (error) {
    console.error(`Error fetching doctor with ID ${id}:`, error);
    throw error;
  }
};