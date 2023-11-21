import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export function millisToMinutesAndSeconds(millis) {
  var minutes = Math.floor(millis / 60000);
  var seconds = ((millis % 60000) / 1000).toFixed(0);
  return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
}

const TopTracks = ({ artist }) => {
  const [artistTopTracks, setArtistTopTracks] = useState();

  useEffect(() => {
    if (artist) {
      setArtistTopTracks(artist.topTracks);
    }
  }, [artist]);

  return (
    <div className="mt-8  xl:mt-20">
      <h1 className=" text-sm mv:text-base xl:text-xl">Top Tracks</h1>
      <div>
        {artistTopTracks &&
          artistTopTracks.map((track, index) => {
            return (
              <Link
                to={track.url}
                key={index}
                target="_blank"
                className="no-underline text-inherit"
              >
                <div className="p-2 my-3 lg:pr-6 flex justify-between items-center hover:bg-[#D3D3D3] hover:bg-opacity-10 transition duration-300 rounded-lg ">
                  <div className="flex overflow-hidden items-center text-xs lg:text-sm ">
                    <img
                      className="rounded-md w-10 mv:w-12 md:w-16 aspect-square object-cover"
                      src={track.album.images}
                      alt="Track Cover"
                    />
                    <div className="ml-2 overflow-hidden">
                      <h1 className="truncate">{track.name}</h1>
                    </div>
                  </div>

                  <div className="text-xs lg:text-sm ml-4">
                    <h1>{millisToMinutesAndSeconds(track.duration)}</h1>
                  </div>
                </div>
              </Link>
            );
          })}
      </div>
    </div>
  );
};

export default TopTracks;
