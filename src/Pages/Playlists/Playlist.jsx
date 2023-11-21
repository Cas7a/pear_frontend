import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router";
import PlaylistContext from "../../store/PlaylistContext";

import AutorTemplate from "../../components/Layout/AutorTemplate";
import { ReleaseAndPlaylistContext } from "../../store/ReleaseAndPlaylistContext";
import img from "../../assets/Playlist-Release/playlist_img.png";

const Playlist = () => {
  const { playlistId } = useParams();
  const [currentPlaylist, setCurrentPlaylist] = useState(null);
  const actions = useContext(PlaylistContext);
  const releasePlaylistActions = useContext(ReleaseAndPlaylistContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await actions.showPlaylists();

        if (data) {
          const result = data.filter(
            (playlist) => playlist.playlist_id == playlistId
          );
          setCurrentPlaylist(result[0]);
          // console.log(result);
          if (result[0]) {
            releasePlaylistActions.setData({
              image: img,
              description: result[0].playlist_description,
              title: result[0].playlist_title,
              tracks: result[0].playlist_tracks,
              type: "playlist",
              id: playlistId,
            });
          }
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [actions.forceUpdate]);

  return currentPlaylist && <AutorTemplate />;
};

export default Playlist;
