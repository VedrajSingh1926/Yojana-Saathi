import React, { createContext, useContext, useState, useEffect } from 'react';

const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
  const [stateLocation, setStateLocation] = useState(() => {
    try {
      const stored = localStorage.getItem('yojana_state');
      return stored || 'Rajasthan';
    } catch (e) {
      return 'Rajasthan';
    }
  });

  useEffect(() => {
    localStorage.setItem('yojana_state', stateLocation);
  }, [stateLocation]);

  return (
    <LocationContext.Provider value={{ stateLocation, setStateLocation }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocationContext = () => useContext(LocationContext);
