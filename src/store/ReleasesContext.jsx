import React, { createContext, useContext, useState } from "react";
import AuthContext from "./AuthContext";

export const ReleasesContext = createContext();
const URL = import.meta.env.VITE_API;

export const ReleasesProvider = ({ children }) => {
  const { userData } = useContext(AuthContext);
  const [releases, setReleases] = useState(null);
  const [forceUpdate, setForceUpdate] = useState(false);

  const actions = {
    releases,
    setReleases,
    setForceUpdate,

    forceUpdate,
    createRelease: async (body) => {
      try {
        const opts = {
          method: "POST",
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${userData.token}`,
          },
          body: JSON.stringify(body),
        };

        const res = await fetch(`${URL}/releases`, opts);

        const data = await res.json();
        setReleases((prev) => [...prev, data]);
      } catch (error) {
        console.error(error);
      }
    },

    showReleases: async () => {
      try {
        const opts = {
          method: "GET",
          headers: {
            Authorization: `Bearer ${userData.token}`,
          },
        };
        const res = await fetch(`${URL}/releases`, opts);
        const data = await res.json();
        // console.log("fetched");
        setReleases(data);

        return data;
      } catch (error) {
        console.error(error);
      }
    },

    deleteRelease: async (endpoint) => {
      try {
        const opts = {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${userData.token}`,
          },
        };
        const res = await fetch(`${URL}/release/${endpoint}`, opts);
        const data = await res.json();
        // console.log(data);
      } catch (error) {
        console.error(error);
      }
    },

    deleteSongFromRelease: async (release, song) => {
      try {
        const opts = {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${userData.token}`,
          },
        };
        const res = await fetch(`${URL}/release/${release}/${song}`, opts);
        const data = await res.json();

        // console.log(data);
      } catch (error) {
        console.error(error);
      }
    },
  };

  return (
    <ReleasesContext.Provider value={actions}>
      {children}
    </ReleasesContext.Provider>
  );
};
