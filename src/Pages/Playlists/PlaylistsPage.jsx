import React, { useState, useContext, useEffect } from "react";
import { ReactComponent as PlaylistIcon } from "../../assets/NavPanel/playlist.svg";
import { ReactComponent as AddPlaylist } from "../../assets/Playlist-Release/addPlaylist.svg";
import img from "../../assets/Playlist-Release/playlist_img.png";

import { Link } from "react-router-dom";
import CreatePlaylist from "./CreatePlaylist";
import PlaylistContext from "../../store/PlaylistContext";

const Playlists = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const actions = useContext(PlaylistContext);

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await actions.showPlaylists();
        // console.log(data);
        if (data && Array.isArray(data)) {
          data.reverse();

          actions.setCurrentPlaylists(data);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [actions.forceUpdate]);

  return (
    <>
      {actions.currentPlaylists.length === 0 ? (
        <>
          <div className=" flex flex-col items-center justify-center  h-[calc(100vh-166px)]">
            <div className="text-center">
              <PlaylistIcon className=" w-36 h-28 fill-[#2B2B2B] xl:h-40 xl:w-40" />
            </div>
            <div className="mt-6">
              <h1 className="text-center text-base text-[#2F2F2F] xl:text-lg">
                You have not added any playlists yet
              </h1>
            </div>
            <div className="flex justify-center mt-7  ">
              <button
                className="btn_login  w-40 py-3 font-medium block text-black"
                onClick={openModal}
              >
                <h1>Create Playlist</h1>
              </button>
            </div>
          </div>

          <CreatePlaylist isOpen={modalIsOpen} onClose={closeModal} />
        </>
      ) : (
        <div className="mt-5">
          <div className="">
            <span className="md:text-lg 2xl:text-xl mr-3 align-middle">
              Playlists
            </span>
            <AddPlaylist
              className="cursor-pointer align-middle fill-white max-md:w-4 "
              onClick={openModal}
            />
          </div>
          <section className="mt-4">
            <div className="grid  gap-4 grid-cols-1 mv:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 2xl:grid-cols-6">
              {actions.currentPlaylists.length > 0 &&
                actions.currentPlaylists.map((playlist, index) => {
                  return (
                    <div key={index} className="mv:mb-7 align-middle ">
                      <div className="">
                        <Link to={`/player/playlist/${playlist.playlist_id}`}>
                          <img
                            src={img}
                            alt="Playlist Cover"
                            className="w-full object-contain"
                          />
                        </Link>
                      </div>
                      <div className="mt-3 text-sm ">
                        <Link
                          to={`/player/playlist/${playlist.playlist_id}`}
                          className="no-underline text-inherit"
                        >
                          <h1>{playlist.playlist_title}</h1>
                        </Link>
                      </div>
                    </div>
                  );
                })}
            </div>
          </section>

          <CreatePlaylist isOpen={modalIsOpen} onClose={closeModal} />
        </div>
      )}
    </>
  );
};

export default Playlists;
