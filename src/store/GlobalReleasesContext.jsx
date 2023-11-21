import React, { createContext, useState, useEffect } from "react";

export const GlobalReleasesContext = createContext();

export const GlobalReleasesProvider = ({ children }) => {
  const [currentGlobalRelease, setCurrentGlobalRelease] = useState(null);

  useEffect(() => {
    const storedRelease = sessionStorage.getItem("currentRelease");
    if (storedRelease) {
      setCurrentGlobalRelease(JSON.parse(storedRelease));
    }
  }, []);

  useEffect(() => {
    if (currentGlobalRelease) {
      sessionStorage.setItem(
        "currentRelease",
        JSON.stringify(currentGlobalRelease)
      );
    }
  }, [currentGlobalRelease]);

  const actions = {
    currentGlobalRelease,
    setCurrentGlobalRelease,
  };
  return (
    <GlobalReleasesContext.Provider value={actions}>
      {children}
    </GlobalReleasesContext.Provider>
  );
};
