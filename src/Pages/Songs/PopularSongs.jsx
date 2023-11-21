import React from "react";
import { useContext } from "react";
import ArtistsContext from "../../store/ArtistsContext";
import { Link } from "react-router-dom";
import { millisToMinutesAndSeconds } from "../Artists/TopTracks";

const PopularSongs = () => {
  const artistContext = useContext(ArtistsContext);

  return (
    <div className="mt-4">
      <h1 className="text-base sm360:text-lg lg:text-2xl">
        Top 50 Songs Today
      </h1>
      {artistContext.top_50_Tracks &&
        artistContext.top_50_Tracks.map((track, index) => {
          return (
            <Link
              to={track.href}
              key={index}
              target="_blank"
              className="no-underline text-inherit"
            >
              <div className="p-2 my-3 lg:pr-6 flex justify-between items-center hover:bg-[#D3D3D3] hover:bg-opacity-10 transition duration-300 rounded-lg ">
                <div className="flex overflow-hidden items-center text-xs lg:text-sm ">
                  <img
                    className="rounded-md w-10 mv:w-12 md:w-16 aspect-square object-cover"
                    src={track.img}
                    alt="Track Cover"
                  />
                  <div className="ml-2 overflow-hidden">
                    <h1 className="truncate">{track.name}</h1>
                    <h1 className="text-xs text-[#ffffff90]">{track.artist}</h1>
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
  );
};

export default PopularSongs;
