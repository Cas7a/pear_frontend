import React, { useContext } from "react";
import { ArtistsContext } from "../../store/ArtistsContext";
import { Link } from "react-router-dom";
import AuthContext from "../../store/AuthContext";
import { millisToMinutesAndSeconds } from "../../Pages/Artists/TopTracks";

const Welcome = () => {
  const artistContext = useContext(ArtistsContext);
  const { userData } = useContext(AuthContext);

  const ArtistComponent = ({ artist }) => {
    return (
      <div className="cursor-pointer text-white min-w-[130px] max-w-sm  ">
        <img
          src={artist.images}
          alt="Artist Profile Picture"
          className=" aspect-square object-cover rounded-md mb-2 w-full"
        />
        <br />
        <span className=" text-[14px] 2xl:text-[16px]">{artist.name}</span>
        <br />
        <span className="capitalize text-[12px] 2xl:text-[14px]">
          {artist.type}
        </span>
      </div>
    );
  };

  const username =
    (userData?.username || "").charAt(0).toUpperCase() +
    (userData?.username || "").slice(1);

  return (
    <>
      {artistContext.artistInfo && artistContext.artistInfo.length > 0 ? (
        <div className="mb-10">
          <p className=" text-lg sm360:text-xl lg:text-4xl mb-5">
            Welcome {username}
          </p>
          <p className="text-base sm360:text-lg lg:text-2xl">Popular Artists</p>
          <div className="mt-3 grid gap-8 grid-cols-1 justify-items-center sm360:grid-cols-2  sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 2xl:grid-cols-7">
            {artistContext.artistInfo.map((artist) => (
              <Link
                to={`artist/${artist.id}`}
                className="no-underline"
                key={artist.id}
              >
                <ArtistComponent artist={artist} />
              </Link>
            ))}
          </div>

          <div className="mt-20">
            <h1 className="text-base sm360:text-lg lg:text-2xl">Top 5 Songs</h1>
            <div>
              {artistContext.top_5_Tracks &&
                artistContext.top_5_Tracks.map((track, index) => {
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
                            <h1 className="text-xs text-[#ffffff90]">
                              {track.artist}
                            </h1>
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
        </div>
      ) : null}
    </>
  );
};

export default Welcome;
