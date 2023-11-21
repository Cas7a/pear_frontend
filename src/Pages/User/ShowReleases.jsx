import React, { useEffect, useContext, useState } from "react";
import { ReleasesContext } from "../../store/ReleasesContext";
import AuthContext from "../../store/AuthContext";

import CreateRelease from "./CreateRelease";
import { Link } from "react-router-dom";
import { ReactComponent as SongIcon } from "../../assets/NavPanel/song.svg";
import { ReactComponent as AddPlaylist } from "../../assets/Playlist-Release/addPlaylist.svg";

const ShowReleases = () => {
  const actions = useContext(ReleasesContext);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const { userData } = useContext(AuthContext);

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await actions.showReleases();

        if (data) {
          data.reverse();

          actions.setReleases(data);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [actions.forceUpdate]);

  return (
    <>
      {actions.releases && actions.releases.length > 0 ? (
        <div className="mt-14 lg:mt-24">
          <div className="flex items-center">
            <span className=" text-2xl md:text-3xl lg:text-4xl mr-3 align-middle">
              Releases
            </span>
            <div>
              <AddPlaylist
                className="cursor-pointer align-middle fill-white max-md:w-4 mt-[6px]"
                onClick={openModal}
              />
            </div>
          </div>
          <section className="mt-6">
            {actions.releases &&
              actions.releases.length > 0 &&
              (() => {
                const releasesByType = actions.releases.reduce(
                  (acc, release) => {
                    if (!acc[release.release_type]) {
                      acc[release.release_type] = [];
                    }
                    acc[release.release_type].push(release);
                    return acc;
                  },
                  {}
                );

                return Object.entries(releasesByType).map(
                  ([releaseType, releases], index) => (
                    <div key={index} className="mb-24 md:mb-14">
                      <h1 className="text-base font-medium lg:text-xl ">
                        {releaseType.charAt(0).toUpperCase() +
                          releaseType.slice(1) +
                          "s"}
                      </h1>
                      <div className="mt-4 grid gap-8 grid-cols-1 mv:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 2xl:grid-cols-7">
                        {releases.map((release, index) => {
                          return (
                            <div
                              key={index}
                              className="flex flex-col items-center"
                            >
                              <Link
                                to={`/player/user/${userData.username}/release/${release.release_id}`}
                                className=" no-underline text-inherit"
                              >
                                <div>
                                  <div className="mb-2">
                                    <img
                                      src={release.release_cover}
                                      alt="Release cover"
                                      className="w-full object-cover  rounded-md aspect-square min-w-[100px] "
                                    />
                                  </div>

                                  <h1 className="text-[12px] lg:text-[14px] ">
                                    {release.title}
                                  </h1>
                                  <h1 className="text-[12px] lg:text-[14px] mt-[6px] ">
                                    {release.year}
                                  </h1>
                                </div>
                              </Link>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )
                );
              })()}
          </section>

          <CreateRelease isOpen={modalIsOpen} onClose={closeModal} />
        </div>
      ) : (
        <div className=" flex flex-col items-center justify-center  mt-16 mb-10">
          <div className="text-center">
            <SongIcon className=" w-36 h-28 fill-[#2B2B2B] xl:h-40 xl:w-40" />
          </div>
          <div className="mt-6 ">
            <h1 className="text-center text-base text-[#2F2F2F] xl:text-lg">
              You have not released anything yet
            </h1>
          </div>
          <div className="flex justify-center mt-7  ">
            <button
              onClick={openModal}
              className="btn_login  w-40 py-3 font-medium block text-black"
            >
              <h1>Release music</h1>
            </button>
          </div>
          <CreateRelease isOpen={modalIsOpen} onClose={closeModal} />
        </div>
      )}
    </>
  );
};

export default ShowReleases;
