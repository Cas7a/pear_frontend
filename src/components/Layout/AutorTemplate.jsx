import React, { useContext } from "react";
import Modal from "react-modal";
import { isMobile } from "react-device-detect";

import { ReactComponent as DeleteMusic } from "../../assets/Playlist-Release/deletePlaylist.svg";
import { ReactComponent as PlaySong } from "../../assets/Playlist-Release/playSong.svg";
import { ReactComponent as PauseSong } from "../../assets/Playlist-Release/pauseSong.svg";
import { ReactComponent as SongOptions } from "../../assets/Playlist-Release/options.svg";

import { convertDuration } from "../../utils/calculateAudioDuration";

import { useNavigate } from "react-router";
import { PlaylistContext } from "../../store/PlaylistContext";
import { AuthContext } from "../../store/AuthContext";
import { PlaybackContext } from "../../store/PlaybackContext";
import { ReleaseAndPlaylistContext } from "../../store/ReleaseAndPlaylistContext";
import { ReleasesContext } from "../../store/ReleasesContext";

//This component renders a layout for a playlist or a release uploaded by the user.
const AutorTemplate = () => {
  const playlistActions = useContext(PlaylistContext);
  const playbackActions = useContext(PlaybackContext);
  const authActions = useContext(AuthContext);
  const RpActions = useContext(ReleaseAndPlaylistContext);
  const releaseActions = useContext(ReleasesContext);

  const navigate = useNavigate();

  const autoPlay = () => {
    playbackActions.setQueue(RpActions.data.tracks);
    playbackActions.setCurrentSong(RpActions.data.tracks[0]);
    playbackActions.setIsPlaying(true);
    sessionStorage.setItem("queue", JSON.stringify(RpActions.data.tracks));
    playbackActions.setCurrentIndex(0);
    sessionStorage.setItem("currentIndex", 0);
    playbackActions.setQueueEnded(false);
  };

  const touchPlay = (track, index) => {
    playbackActions.setQueue(RpActions.data.tracks);
    sessionStorage.setItem("queue", JSON.stringify(RpActions.data.tracks));

    playbackActions.handlePlayPauseClick(track, index);
  };

  // console.log(isMobile);
  return (
    <div className="mt-8">
      <div className="items-center flex max-md:flex-col">
        <input type="file" className=" hidden" />
        <img
          src={RpActions.data.image}
          alt="Playlist Cover"
          className="md:mr-4 cursor-pointer aspect-square object-cover w-[170px] sm:w-52  md:w-56 xl:w-64 "
        />
        <div className="max-md:text-center max-md:mt-4 w-full">
          <span className=" text-xl max-md:mt-3 h-20 truncate md:text-5xl lg:text-7xl">
            {RpActions.data.title}
          </span>
          <h1 className="text-[#ffffff90] text-sm max-md:truncate">
            {RpActions.data.description}
          </h1>
        </div>
      </div>
      <div className="flex mt-6 max-md:flex-col justify-between items-center mb-8 lg:pr-4">
        <div className="flex gap-2 mv:gap-5 max-md:mb-5">
          <button
            className="btn_login bg-orange-500  bg-opacity-75 w-24 sm360:w-28 md:w-36 py-3 font-medium block text-black"
            onClick={autoPlay}
          >
            <h1>Play</h1>
          </button>
        </div>

        <div
          className="flex justify-end  sm360:items-center text-center w-12 md:w-32 cursor-pointer"
          onClick={RpActions.deleteMusic}
        >
          <div>
            <DeleteMusic className="fill-white cursor-pointer" />
          </div>

          <h1 className="mt-[2px] ml-2  text-[10px] md:text-xs md:text-right  ">
            {`Delete ${RpActions.data.type}`}
          </h1>
        </div>
        {RpActions.isDeleteModalOpen && (
          <Modal
            isOpen={RpActions.isDeleteModalOpen}
            onRequestClose={RpActions.cancelDelete}
            contentLabel="Create playlist form"
            className=" bg-[#2f2f2f;] w-[400px] h-[170px] modal rounded-xl max-w-full"
            style={{
              overlay: {
                backgroundColor: "rgba(0, 0, 0, 0.7)",
                zIndex: "999",
              },
            }}
          >
            <div className="py-5 px-4">
              <div>
                <h1 className="text-white  text-lg">
                  Delete from your profile?
                </h1>
              </div>
              <div className="  mt-14 max-mv:text-center mv:ml-24">
                <div className="inline-block mr-4">
                  <button
                    className="btn_login  w-32 py-3 font-medium block text-black"
                    onClick={RpActions.cancelDelete}
                  >
                    <h1>Cancel</h1>
                  </button>
                </div>

                <div className="inline-block">
                  <button
                    className="btn_login bg-orange-500 bg-opacity-70 w-32 py-3 font-medium block text-black"
                    onClick={() => {
                      RpActions.confirmDelete();
                      RpActions.data.type == "release"
                        ? navigate(
                            `/player/user/${authActions.userData.username}`
                          )
                        : navigate("/player/playlists");
                    }}
                  >
                    <h1>Delete</h1>
                  </button>
                </div>
              </div>
            </div>
          </Modal>
        )}
      </div>
      {RpActions.data.tracks.map((track, index) => {
        // console.log(track);
        return (
          <div
            key={index}
            className="p-2  my-3 lg:pr-6 flex justify-between items-center hover:bg-[#D3D3D3] hover:bg-opacity-10  duration-300 rounded-lg "
            onClick={() => {
              isMobile ? touchPlay(track, index) : null;
            }}
            onDoubleClick={() => {
              isMobile ? null : touchPlay(track, index);
            }}
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
                      playbackActions.setQueue(RpActions.data.tracks);
                      sessionStorage.setItem(
                        "queue",
                        JSON.stringify(RpActions.data.tracks)
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
                {RpActions.data.type == "playlist" && (
                  <h1 className="text-xs text-[#ffffff90]">{track.autor}</h1>
                )}
              </div>
            </div>

            <div className="text-xs lg:text-sm ml-4 flex items-center gap-9">
              <p className="h-[17px]">
                {convertDuration(track.track_duration)}
              </p>

              <div className="h-4">
                <SongOptions
                  className="fill-white cursor-pointer"
                  onClick={(e) => RpActions.showMenu(e, track)}
                />
              </div>
            </div>
          </div>
        );
      })}
      {RpActions.menuState.visible && (
        <Modal
          isOpen={RpActions.menuState.visible}
          onRequestClose={RpActions.closeMenu}
          contentLabel="Create playlist form"
          className=" bg-[#2f2f2f] absolute w-[200px]  rounded-xl max-w-full "
          style={{
            overlay: {
              backgroundColor: "rgba(0, 0, 0, 0)",
              zIndex: "999",
            },
            content: {
              top: RpActions.menuState.y,
              left: RpActions.menuState.x,
            },
          }}
        >
          <div className="p-3 text-white">
            <div>
              <h1 className="text-sm lg:text-base">
                {playlistActions.currentPlaylists.length !== 0 ||
                !playlistActions.currentPlaylists
                  ? "Add to playlist"
                  : "Create playlist"}
              </h1>
            </div>
            {playlistActions.currentPlaylists.length !== 0 ||
            !playlistActions.currentPlaylists ? (
              <ul className="mt-2 max-h-24 overflow-y-auto text-sm lg:text-base">
                {playlistActions.currentPlaylists &&
                  playlistActions.currentPlaylists.map((playlist, index) => {
                    return (
                      <li
                        key={index}
                        className="py-2 cursor-pointer hover:bg-[#D3D3D3] hover:bg-opacity-10 transition duration-300 rounded"
                        onClick={async () => {
                          await playlistActions.addSongToPlaylist(
                            RpActions.selectedTrack,
                            playlist.playlist_id
                          );
                          alert("Song added to playlist");
                          RpActions.closeMenu();
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
                playbackActions.addToQueue(
                  RpActions.selectedTrack,
                  RpActions.closeMenu
                );
              }}
            >
              <h1 className="text-sm lg:text-base">Add to queue</h1>
            </div>

            <div className=" border-solid border-t py-2  border-[#555] hover:bg-[#D3D3D3] hover:bg-opacity-10 transition duration-300 rounded">
              <h1
                className="text-sm lg:text-base cursor-pointer"
                onClick={() => {
                  if (RpActions.data.type == "release") {
                    RpActions.deleteSongFromRelease();
                    if (releaseActions.releases[0].release_tracks.length == 1) {
                      navigate(`/player/user/${authActions.userData.username}`);
                    }
                  } else {
                    RpActions.deleteSongFromPlaylist();
                    if (RpActions.data.tracks.length == 1) {
                      navigate(`/player/playlists`);
                    }
                  }
                }}
              >
                {RpActions.data.type == "release"
                  ? "Delete from release"
                  : "Delete from playlist"}
              </h1>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default AutorTemplate;
