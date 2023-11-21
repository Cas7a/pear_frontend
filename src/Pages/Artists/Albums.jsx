import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";

const Albums = ({ artist }) => {
  const [ArtistAlbums, setArtistAlbums] = useState();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (artist) {
      setArtistAlbums(artist.albums);
    }
  }, [artist]);

  let sliceAmount;
  if (windowWidth >= 640 && windowWidth < 1280) {
    sliceAmount = 3;
  } else if (windowWidth >= 1280) {
    sliceAmount = 5;
  } else {
    sliceAmount = 2;
  }
  const displayedAlbums = ArtistAlbums
    ? ArtistAlbums.slice(0, sliceAmount)
    : [];

  return (
    <div className="mt-10">
      <h1 className="text-sm mv:text-base xl:text-xl">Latest Releases</h1>
      <div className="grid gap-8 grid-cols-2  justify-items-center mt-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 2xl:grid-cols-7">
        {displayedAlbums &&
          displayedAlbums.map((album, index, arr) => {
            return (
              <Link
                to={album.url}
                key={index}
                target="_blank"
                className="text-inherit no-underline w-full"
              >
                <div>
                  <img
                    src={album.images[0].url}
                    alt="Album Cover"
                    className="rounded-md w-full  aspect-square object-cover "
                  />
                  <div className="text-xs lg:text-sm mt-2">
                    <h1 className="truncate">{album.name}</h1>
                    <h2>{album.release_date.slice(0, 4)}</h2>
                  </div>
                </div>
              </Link>
            );
          })}
      </div>
    </div>
  );
};
export default Albums;
