import React, { createContext, useContext, useState, useEffect } from "react";
import AuthContext from "./AuthContext";

export const PlaylistContext = createContext();
const URL = import.meta.env.VITE_API;

export const PlaylistProvider = ({ children }) => {
  const [forceUpdate, setForceUpdate] = useState(false);

  const [currentPlaylists, setCurrentPlaylists] = useState(() => {
    const storedPlaylists = sessionStorage.getItem("currentPlaylists");
    return storedPlaylists ? JSON.parse(storedPlaylists) : [];
  });
  useEffect(() => {
    sessionStorage.setItem(
      "currentPlaylists",
      JSON.stringify(currentPlaylists)
    );
  }, [currentPlaylists]);

  const { userData } = useContext(AuthContext);

  const actions = {
    setForceUpdate,
    forceUpdate,
    setCurrentPlaylists,
    currentPlaylists,

    createPlaylist: async (body) => {
      try {
        const opts = {
          method: "POST",
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${userData.token}`,
          },
          body: JSON.stringify(body),
        };

        const res = await fetch(`${URL}/playlists`, opts);

        const data = await res.json();
        // console.log(data);
      } catch (error) {
        console.error(error);
      }
    },
    showPlaylists: async () => {
      try {
        const opts = {
          method: "GET",
          headers: {
            Authorization: `Bearer ${userData.token}`,
          },
        };
        const res = await fetch(`${URL}/playlists`, opts);
        const data = await res.json();

        setCurrentPlaylists(data);
        return data;
      } catch (error) {
        console.error(error);
      }
    },

    changePlaylistImage: async (body, endpoint) => {
      try {
        const opts = {
          method: "PUT",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify(body),
        };
        const res = await fetch(`${URL}/playlist/${endpoint}`, opts);
        // console.log(res);
        const data = await res.json();

        return data;
      } catch (error) {
        console.error(error);
      }
    },
    deletePlaylist: async (endpoint) => {
      try {
        const opts = {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${userData.token}`,
          },
        };
        const res = await fetch(`${URL}/playlist/${endpoint}`, opts);
        // console.log(res);
        const data = await res.json();

        return data;
      } catch (error) {
        console.error(error);
      }
    },

    addSongToPlaylist: async (body, endpoint) => {
      try {
        const opts = {
          method: "POST",
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${userData.token}`,
          },
          body: JSON.stringify(body),
        };
        const res = await fetch(`${URL}/playlist/${endpoint}/tracks`, opts);
        // console.log(res);
        const data = await res.json();
        // console.log(data);

        return data;
      } catch (error) {
        console.error(error);
      }
    },

    deleteSongFromPlaylist: async (playlistId, songId) => {
      try {
        const opts = {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${userData.token}`,
          },
        };
        const res = await fetch(
          `${URL}/playlist/${playlistId}/${songId}`,
          opts
        );

        const data = await res.json();
        // console.log(data);

        return data;
      } catch (error) {
        console.error(error);
      }
    },
  };

  useEffect(() => {
    actions.showPlaylists();
  }, []);

  return (
    <PlaylistContext.Provider value={actions}>
      {children}
    </PlaylistContext.Provider>
  );
};

export default PlaylistContext;
