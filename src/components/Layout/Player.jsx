import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { ReactComponent as ChangeSongButton } from "../../assets/Player/next.svg";
import { ReactComponent as PlayButton } from "../../assets/Player/play.svg";
import { ReactComponent as PauseButton } from "../../assets/Player/pause.svg";
import { ReactComponent as VolumeButton } from "../../assets/Player/volume.svg";
import { ReactComponent as QueueButton } from "../../assets/Player/queue.svg";

import { convertDuration } from "../../utils/calculateAudioDuration";
import { PlaybackContext } from "../../store/PlaybackContext";

const Player = () => {
  const playbackActions = useContext(PlaybackContext);
  const handleProgressChange = (event) => {
    const newProgress = event.target.value;
    playbackActions.setSeekValue(newProgress);

    if (playbackActions.isUserSeeking) {
      playbackActions.setSongProgress(newProgress);
    }
  };

  const playPauseSong = () => {
    playbackActions.handlePlayPauseClick(
      playbackActions.currentSong,
      playbackActions.currentIndex
    );
  };

  return (
    <div
      className={`${
        !playbackActions.currentSong ? "h-[96px]" : "h-[96px]"
      } z-[999] max-lg:border-b border-solid  max-lg:bottom-[70px] bottom-0  lg:shadow-player sticky panel
flex flex-col items-center  justify-between  align-middle px-4`}
    >
      <div className="w-full mt-3 flex justify-between items-center h-full">
        {playbackActions.currentSong ? (
          <div className="flex items-center w-24 mv:w-40">
            <img
              src={
                playbackActions.currentSong &&
                playbackActions.currentSong.track_cover
              }
              alt="Current song cover"
              className="w-14 rounded lg:w-[64px] aspect-square object-cover"
            />
            <div className="pl-2 max-lg:truncate lg:whitespace-nowrap">
              <h1
                className=" text-white text-xs md:text-sm max-lg:truncate lg:whitespace-nowrap
        "
              >
                {playbackActions.currentSong &&
                  playbackActions.currentSong.track_name
                    .replace(".mp3", "")
                    .replace(".wav", "")}
              </h1>
              <h1 className=" text-[10px] lg:text-xs text-[#ffffff90]">
                {playbackActions.currentSong.autor}
              </h1>
            </div>
          </div>
        ) : (
          <div className="flex items-center w-20 mv:w-40"></div>
        )}
        <div className="flex flex-col gap-2 w-24 mv:w-40 ">
          <div className="flex items-center justify-center max-md:gap-2">
            <div>
              <button
                disabled={!playbackActions.currentSong}
                className="p-0 bg-transparent  border-none"
              >
                <ChangeSongButton
                  className="mirror w-5 md:w-10 hover:fill-white duration-500"
                  onClick={playbackActions.playPrevious}
                />
              </button>
            </div>
            <div>
              <button
                disabled={!playbackActions.currentSong}
                className="bg-transparent  border-none p-0"
              >
                {playbackActions.isPlaying ? (
                  <PauseButton
                    className="w-7 md:w-10 hover:fill-white duration-500"
                    onClick={playPauseSong}
                  />
                ) : (
                  <PlayButton
                    className="w-7 md:w-10 hover:fill-white duration-500"
                    onClick={
                      playbackActions.queueEnded == false ? playPauseSong : null
                    }
                  />
                )}
              </button>
            </div>
            <div>
              <button
                disabled={!playbackActions.currentSong}
                className="p-0 bg-transparent  border-none"
              >
                <ChangeSongButton
                  className="w-5 md:w-10 hover:fill-white duration-500"
                  onClick={playbackActions.playNext}
                />
              </button>
            </div>
          </div>
        </div>
        {playbackActions.currentSong ? (
          <div className="flex items-center w-24 mv:w-44">
            <Link to="/player/queue" className="h-6">
              <QueueButton className="cursor-pointer hover:fill-white duration-500 mr-2 max-2xl:w-5 " />
            </Link>

            <div className="  flex items-center w-24 mv:w-40">
              <VolumeButton className=" max-2xl:w-5 " />
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                className="w-14 mv:w-28  cursor-pointer"
                value={playbackActions.volume}
                onChange={(e) => {
                  playbackActions.setVolume(e.target.value);
                }}
              />
            </div>
          </div>
        ) : (
          <div className="w-24 mv:w-40"></div>
        )}
      </div>
      {playbackActions.currentSong && (
        <div className="h-full">
          {playbackActions.currentSong && (
            <div className="flex items-center max-sm360:hidden ">
              <span className=" text-[14px] font-medium">
                {convertDuration(playbackActions.audioRef.current.currentTime)}
              </span>
              <div className="">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={
                    playbackActions.isUserSeeking
                      ? isNaN(playbackActions.seekValue)
                        ? 0
                        : playbackActions.seekValue
                      : isNaN(playbackActions.songProgress)
                      ? 0
                      : playbackActions.songProgress
                  }
                  onChange={handleProgressChange}
                  onMouseDown={playbackActions.handleProgressMouseDown}
                  onMouseUp={playbackActions.handleProgressMouseUp}
                  onTouchStart={playbackActions.handleProgressTouchStart}
                  onTouchMove={playbackActions.handleProgressTouchMove}
                  onTouchEnd={playbackActions.handleProgressTouchEnd}
                  className=" sm:w-60 lg:w-96 mx-4 my-0 cursor-pointer"
                />
              </div>

              <span className=" text-[14px]  font-medium">
                {playbackActions.currentSong &&
                  convertDuration(playbackActions.currentSong.track_duration)}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Player;
