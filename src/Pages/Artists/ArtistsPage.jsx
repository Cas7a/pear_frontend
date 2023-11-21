import React, { useContext, useState, useEffect } from "react";
import { useParams } from "react-router";
import ArtistsContext from "../../store/ArtistsContext";
import Albums from "./Albums";
import TopTracks from "./TopTracks";

const Artists = () => {
  const artistContext = useContext(ArtistsContext);
  const { artistId } = useParams();
  const [currentArtist, setCurrentArtist] = useState(null);
  useEffect(() => {
    if (artistContext.artistInfo) {
      const result = artistContext.artistInfo.filter(
        (artist) => artist.id == artistId
      );

      setCurrentArtist(result[0]);
    }
  }, [artistContext.artistInfo, artistId]);

  return (
    <div className="py-4">
      <div className=" items-center sm360:table">
        {currentArtist && (
          <img
            src={currentArtist.images}
            alt="Artist Profile Picture"
            className="w-24 rounded-full mr-8 mv:w-40 md:w-52 md:mr-12 xl:w-64 aspect-square object-cover "
          />
        )}
        <div className="table-cell align-middle">
          <span className="text-xl mv:text-3xl md:text-4xl xl:text-6xl">
            {currentArtist && currentArtist.name}
          </span>
          {currentArtist && (
            <h1 className="mt-1 text-xs mv:text-sm mv:mt-2 xl:text-base">{`Followers: ${currentArtist.followers.toLocaleString(
              "en-US"
            )}`}</h1>
          )}
        </div>
      </div>
      <TopTracks artist={currentArtist} />
      <Albums artist={currentArtist} />
    </div>
  );
};

export default Artists;
