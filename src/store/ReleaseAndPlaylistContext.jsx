import React, { createContext, useState, useContext } from "react";
import PlaylistContext from "./PlaylistContext";
import AuthContext from "./AuthContext";
import { ReleasesContext } from "./ReleasesContext";
import {
  deleteSongFromFirebase,
  deleteReleaseFromFirebase,
} from "../Pages/User/deleteReleaseFromFirebase";

export const ReleaseAndPlaylistContext = createContext();

export const ReleaseAndPlaylistProvider = ({ children }) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState(null);

  const playlistActions = useContext(PlaylistContext);
  const authActions = useContext(AuthContext);
  const releaseActions = useContext(ReleasesContext);

  const [data, setData] = useState({
    image: null,
    title: null,
    tracks: null,
    type: null,
    id: null,
  });
  const [menuState, setMenuState] = useState({
    visible: false,
    x: "0px",
    y: "0px",
  });

  const actions = {
    menuState,
    data,
    setData,
    isDeleteModalOpen,
    selectedTrack,

    closeMenu: () => {
      setMenuState({ visible: false });
      setSelectedTrack(null);
    },

    showMenu: (event, track) => {
      event.preventDefault();

      setSelectedTrack(track);

      const x = event.clientX - 200;
      const y = event.clientY - 120;

      setMenuState({ visible: true, x: `${x}px`, y: `${y}px` });
    },

    confirmDelete: async () => {
      if (data.type == "playlist") {
        try {
          await playlistActions.deletePlaylist(data.id);

          playlistActions.setForceUpdate((prev) => !prev);
        } catch (error) {
          console.error(error);
        }
      } else if (data.type == "release") {
        try {
          await releaseActions.deleteRelease(data.id);

          releaseActions.setForceUpdate((prev) => !prev);
          deleteReleaseFromFirebase(authActions.userData.username, data.title);
        } catch (error) {
          console.error(error);
        }
      }

      setIsDeleteModalOpen(false);
    },

    cancelDelete: () => {
      setIsDeleteModalOpen(false);
    },

    deleteMusic: () => {
      setIsDeleteModalOpen(true);
    },

    deleteSongFromRelease: async () => {
      await releaseActions.deleteSongFromRelease(
        data.id,
        selectedTrack.release_track_id
      );
      releaseActions.setForceUpdate((prev) => !prev);

      deleteSongFromFirebase(
        authActions.userData.username,
        data.title,
        selectedTrack.track_name
      );
      alert("Song has been deleted");
      actions.closeMenu();
    },

    deleteSongFromPlaylist: async () => {
      await playlistActions.deleteSongFromPlaylist(
        data.id,
        selectedTrack.release_track_id
      );
      playlistActions.setForceUpdate((prev) => !prev);

      alert("Song has been removed from playlist");
      actions.closeMenu();
    },
  };

  return (
    <ReleaseAndPlaylistContext.Provider value={actions}>
      {children}
    </ReleaseAndPlaylistContext.Provider>
  );
};
