import React, { useState, useEffect, useContext } from "react";
import Modal from "react-modal";
import { useParams } from "react-router";
import { ReactComponent as PlaySong } from "../../assets/Playlist-Release/playSong.svg";
import { ReactComponent as PauseSong } from "../../assets/Playlist-Release/pauseSong.svg";

import { ReactComponent as SongOptions } from "../../assets/Playlist-Release/options.svg";
import { convertDuration } from "../../utils/calculateAudioDuration";

import { useLocation } from "react-router";
import PlaylistContext from "../../store/PlaylistContext";
import { PlaybackContext } from "../../store/PlaybackContext";

const URL = import.meta.env.VITE_API;

//Context for global releases (other users releases)
const GlobalReleaseTemplate = () => {
  const playlistActions = useContext(PlaylistContext);
  const playbackActions = useContext(PlaybackContext);

  const location = useLocation();

  const [selectedTrack, setSelectedTrack] = useState(null);
  const { releaseId } = useParams();
  const [currentRelease, setCurrentRelease] = useState(null);
  const [menuState, setMenuState] = useState({
    visible: false,
    x: "0px",
    y: "0px",
  });

  useEffect(() => {
    fetch(`${URL}/search`)
      .then((response) => response.json())
      .then((release) => {
        const result = release.filter((item) => item.release_id == releaseId);
        setCurrentRelease(result[0]);
      });
  }, [location.pathname]);

  const showMenu = (event, track) => {
    event.preventDefault();

    setSelectedTrack(track);

    const x = event.clientX - 200;
    const y = event.clientY - 50;

    setMenuState({ visible: true, x: `${x}px`, y: `${y}px` });
  };

  const closeMenu = () => {
    setMenuState({ visible: false });
    setSelectedTrack(null);
  };

  const autoPlay = () => {
    playbackActions.setQueue(currentRelease.release_tracks);
    playbackActions.setCurrentSong(currentRelease.release_tracks[0]);
    playbackActions.setIsPlaying(true);
    sessionStorage.setItem(
      "queue",
      JSON.stringify(currentRelease.release_tracks)
    );
    playbackActions.setCurrentIndex(0);
    sessionStorage.setItem("currentIndex", 0);
  };
  return (
    <div className="mt-8">
      <div className="items-center flex max-md:flex-col">
        <input type="file" className=" hidden" />
        <img
          src={currentRelease && currentRelease.release_cover}
          alt="Playlist Cover"
          className="md:mr-4 aspect-square object-cover w-[170px] sm:w-52  md:w-56 xl:w-64"
        />
        <div className="max-md:text-center">
          <h1 className="text-xl max-md:mt-3  truncate md:text-5xl lg:text-7xl">
            {currentRelease && currentRelease.title}
          </h1>
          <span className="text-sm text-center text-[#ffffff90] hover:underline ">
            {currentRelease && currentRelease.autor}
          </span>
        </div>
      </div>

      <div className="flex mt-6 max-md:flex-col justify-between items-center">
        <div className="flex gap-2 mv:gap-5 max-md:mb-5">
          <button
            type="submit"
            className="btn_login bg-orange-500  bg-opacity-75 w-24 sm360:w-28 md:w-36 py-3 font-medium block text-black"
            onClick={autoPlay}
          >
            <h1>Play</h1>
          </button>
        </div>
      </div>
      {currentRelease &&
        currentRelease.release_tracks.map((track, index) => {
          return (
            <div
              key={index}
              className="p-2  my-3 lg:pr-6 flex justify-between items-center hover:bg-[#D3D3D3] hover:bg-opacity-10 transition duration-300 rounded-lg "
            >
              <div className="flex overflow-hidden items-center text-xs lg:text-sm">
                <div>
                  {playbackActions.isPlaying &&
                  playbackActions.currentSong.release_track_id ===
                    track.release_track_id ? (
                    <PauseSong
                      className="fill-white mr-4 cursor-pointer"
                      onClick={() => {
                        playbackActions.handlePlayPauseClick(track, index);
                      }}
                    />
                  ) : (
                    <PlaySong
                      className="fill-white mr-4 cursor-pointer"
                      onClick={() => {
                        playbackActions.setQueue(currentRelease.release_tracks);

                        sessionStorage.setItem(
                          "queue",
                          JSON.stringify(currentRelease.release_tracks)
                        );

                        playbackActions.handlePlayPauseClick(track, index);
                      }}
                    />
                  )}
                </div>
                <img
                  className="rounded-md aspect-square object-cover w-10 mv:w-12 md:w-16"
                  src={track.track_cover}
                  alt="Track Cover"
                />
                <div className="ml-2 overflow-hidden">
                  <h1
                    className={`truncate ${
                      playbackActions.currentSong &&
                      playbackActions.currentSong.release_track_id ===
                        track.release_track_id
                        ? "text-orange-500"
                        : ""
                    }`}
                  >
                    {track.track_name.replace(".mp3", "").replace(".wav", "")}
                  </h1>
                </div>
              </div>

              <div className="text-xs lg:text-sm ml-4 flex items-center gap-9">
                <p className="h-[17px]">
                  {convertDuration(track.track_duration)}
                </p>

                <SongOptions
                  className="fill-white cursor-pointer"
                  onClick={(e) => showMenu(e, track)}
                />
              </div>
            </div>
          );
        })}
      {menuState.visible && (
        <Modal
          isOpen={menuState.visible}
          onRequestClose={closeMenu}
          contentLabel="Create playlist form"
          className=" bg-[#2f2f2f] absolute w-[200px]  rounded-xl max-w-full "
          style={{
            overlay: {
              backgroundColor: "rgba(0, 0, 0, 0)",
              zIndex: "999",
            },
            content: {
              top: menuState.y,
              left: menuState.x,
            },
          }}
        >
          <div className="p-3 text-white">
            <div className="">
              <h1 className="text-sm lg:text-base">
                {playlistActions.currentPlaylists.length !== 0 ||
                !playlistActions.currentPlaylists
                  ? "Add to playlist"
                  : "Create playlist"}
              </h1>
            </div>

            {playlistActions.currentPlaylists.length !== 0 ||
            !playlistActions.currentPlaylists ? (
              <ul className="mt-2 max-h-24 overflow-y-auto text-sm lg:text-base ">
                {playlistActions.currentPlaylists &&
                  playlistActions.currentPlaylists.map((playlist, index) => {
                    return (
                      <li
                        key={index}
                        className="py-2 cursor-pointer hover:bg-[#D3D3D3] hover:bg-opacity-10 transition duration-300 rounded"
                        onClick={async () => {
                          await playlistActions.addSongToPlaylist(
                            selectedTrack,
                            playlist.playlist_id
                          );
                          alert("Song added to playlist");
                          closeMenu();
                        }}
                      >
                        {playlist.playlist_title}
                      </li>
                    );
                  })}
              </ul>
            ) : null}
            <div
              className=" border-solid border-t cursor-pointer py-2 mt-2 border-[#555] hover:bg-[#D3D3D3] hover:bg-opacity-10 transition duration-300 rounded"
              onClick={() => {
                playbackActions.addToQueue(selectedTrack, closeMenu);
              }}
            >
              <h1 className="text-sm lg:text-base">Add to queue</h1>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default GlobalReleaseTemplate;
