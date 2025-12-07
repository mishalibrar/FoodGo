import React, { createContext, useState, useContext } from 'react';

const LocationContext = createContext();

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};

export const LocationProvider = ({ children }) => {
  const [locationAddress, setLocationAddress] = useState('Getting location...');
  const [location, setLocation] = useState(null);
  const [fetchingLocation, setFetchingLocation] = useState(true);
  const [locationError, setLocationError] = useState(false);

  return (
    <LocationContext.Provider
      value={{
        locationAddress,
        setLocationAddress,
        location,
        setLocation,
        fetchingLocation,
        setFetchingLocation,
        locationError,
        setLocationError,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

