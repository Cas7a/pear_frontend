import React, { useContext, useState } from "react";
import { PlaybackContext } from "../../store/PlaybackContext";
import { ReactComponent as SongOptions } from "../../assets/Playlist-Release/options.svg";
import { convertDuration } from "../../utils/calculateAudioDuration";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Modal from "react-modal";
import PlaylistContext from "../../store/PlaylistContext";
import { ReleaseAndPlaylistContext } from "../../store/ReleaseAndPlaylistContext";

const Queue = () => {
  const playbackActions = useContext(PlaybackContext);
  const playlistActions = useContext(PlaylistContext);
  const RpActions = useContext(ReleaseAndPlaylistContext);
  const [selectedTrack, setSelectedTrack] = useState(null);

  const deleteFromQueue = () => {
    const deletedSong =
      playbackActions.queue &&
      playbackActions.queue.filter(
        (track) =>
          selectedTrack &&
          selectedTrack.release_track_id != track.release_track_id
      );
    sessionStorage.setItem("queue", JSON.stringify(deletedSong));
    playbackActions.setQueue(deletedSong);
    closeMenu();
    alert("Deleted from queue");
  };

  const [menuState, setMenuState] = useState({
    visible: false,
    x: "0px",
    y: "0px",
  });

  const closeMenu = () => {
    setSelectedTrack(null);
    setMenuState({ visible: false });
  };

  const showMenu = (event, track) => {
    event.preventDefault();
    setSelectedTrack(track);
    const x = event.clientX - 200;
    const y = event.clientY - 50;

    setMenuState({ visible: true, x: `${x}px`, y: `${y}px` });
  };

  // Logic to change queue by drag & drop
  const handleDragEnd = (result) => {
    if (!result.destination) return;
    // console.log(result.source.index);
    const items = Array.from(playbackActions.queue);
    const [reorderedItem] = items.splice(result.source.index, 1);
    // console.log(reorderedItem);
    items.splice(result.destination.index, 0, reorderedItem);

    playbackActions.setQueue(items);
    sessionStorage.setItem("queue", JSON.stringify(items));
  };

  return (
    <div>
      <h1 className="text-lg ">My Queue</h1>
      {playbackActions.currentSong && (
        <div>
          <p className="mt-4 text-sm  text">Currently playing</p>
          <div className="my-2 flex bg-[#111111] justify-between items-center p-2 hover:bg-[#D3D3D3] hover:bg-opacity-10  duration-300  rounded-lg">
            <div className="flex items-center truncate">
              <img
                src={
                  playbackActions.currentSong &&
                  playbackActions.currentSong.track_cover
                }
                alt="track cover"
                className=" aspect-square object-cover mr-2 w-16 rounded"
              />
              <div>
                <h1 className="text-xs lg:text-sm text-orange-500 truncate ">
                  {playbackActions.currentSong &&
                    playbackActions.currentSong.track_name
                      .replace(".mp3", "")
                      .replace(".wav", "")}
                </h1>
                <span className="text-[11px] text-[#ffffff90]">
                  {playbackActions.currentSong.autor}
                </span>
              </div>
            </div>

            <div className="h-4 flex gap-2 mv:gap-8 items-center text-xs lg:text-sm">
              <p className="h-[17px]">
                {convertDuration(
                  playbackActions.currentSong &&
                    playbackActions.currentSong.track_duration
                )}
              </p>

              <SongOptions
                className="fill-white cursor-pointer"
                onClick={(e) => showMenu(e, playbackActions.currentSong)}
              />
            </div>
          </div>
        </div>
      )}

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="queue">
          {(provided) => (
            <div
              className="w-full border-t border-solid border-[#555]  "
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              <div>
                {playbackActions.queue &&
                  playbackActions.queue
                    .slice(playbackActions.currentIndex + 1)
                    .map((track, index) => {
                      return (
                        <Draggable
                          key={track.release_track_id}
                          draggableId={track.release_track_id}
                          index={index + playbackActions.currentIndex + 1}
                        >
                          {(provided) => (
                            <div
                              className="my-3"
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <div className="flex bg-[#111111] justify-between items-center p-2 hover:bg-[#D3D3D3] hover:bg-opacity-10  duration-300 rounded-lg ">
                                <div className="flex items-center truncate">
                                  <img
                                    src={track.track_cover}
                                    alt="track cover"
                                    className=" aspect-square object-cover mr-2 w-16 rounded"
                                  />
                                  <div>
                                    <h1
                                      className={`text-xs lg:text-sm truncate${
                                        playbackActions.currentSong &&
                                        playbackActions.currentSong
                                          .release_track_id ===
                                          track.release_track_id
                                          ? "text-orange-500"
                                          : ""
                                      }`}
                                    >
                                      {track.track_name
                                        .replace(".mp3", "")
                                        .replace(".wav", "")}
                                    </h1>
                                    <span className="text-[11px] text-[#ffffff90]">
                                      {track.autor}
                                    </span>
                                  </div>
                                </div>

                                <div className="h-4 flex gap-2 mv:gap-8 items-center text-xs lg:text-sm">
                                  <p className="h-[17px]">
                                    {convertDuration(track.track_duration)}
                                  </p>

                                  <SongOptions
                                    className="fill-white cursor-pointer"
                                    onClick={(e) => showMenu(e, track)}
                                  />
                                </div>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      );
                    })}
                {provided.placeholder}
              </div>
            </div>
          )}
        </Droppable>
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
              <div className="  py-2 ">
                <h1 className="text-sm lg:text-base">Add to playlist</h1>
                <ul className="mt-2 max-h-24 overflow-y-auto text-sm lg:text-base ">
                  {playlistActions.currentPlaylists &&
                    playlistActions.currentPlaylists.map((playlist, index) => {
                      return (
                        <li
                          key={index}
                          className="py-2  cursor-pointer hover:bg-[#D3D3D3] hover:bg-opacity-10 transition duration-300 rounded"
                          onClick={async () => {
                            await playlistActions.addSongToPlaylist(
                              selectedTrack,
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
              </div>
              {playbackActions.currentSong &&
              playbackActions.currentSong.release_track_id ===
                selectedTrack.release_track_id ? null : (
                <div className="  cursor-pointer py-2 border-[#555] hover:bg-[#D3D3D3] hover:bg-opacity-10 transition duration-300 rounded  border-t border-solid">
                  <h1
                    className="text-sm lg:text-base"
                    onClick={deleteFromQueue}
                  >
                    Delete from queue
                  </h1>
                </div>
              )}
            </div>
          </Modal>
        )}
      </DragDropContext>
    </div>
  );
};

export default Queue;
