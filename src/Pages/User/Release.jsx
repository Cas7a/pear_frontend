import React, { useEffect, useContext, useState } from "react";
import AutorTemplate from "../../components/Layout/AutorTemplate";
import { ReleasesContext } from "../../store/ReleasesContext";
import { useParams } from "react-router";
import { ReleaseAndPlaylistContext } from "../../store/ReleaseAndPlaylistContext";

const Release = () => {
  const actions = useContext(ReleasesContext);
  const releasePlaylistActions = useContext(ReleaseAndPlaylistContext);

  const { releaseId } = useParams();
  const [currentRelease, setCurrentRelease] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await actions.showReleases();

        if (data) {
          const result = data.filter(
            (release) => release.release_id == releaseId
          );
          setCurrentRelease(result[0]);
          if (result[0]) {
            releasePlaylistActions.setData({
              image: result[0].release_cover,
              title: result[0].title,
              tracks: result[0].release_tracks,
              type: "release",
              id: releaseId,
            });
          }
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [actions.forceUpdate]);

  return currentRelease && <AutorTemplate />;
};

export default Release;
