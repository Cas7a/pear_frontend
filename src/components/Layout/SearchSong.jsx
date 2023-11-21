import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { ReactComponent as BackIcon } from "../../assets/SearchBar/backIcon.svg";
import { ReactComponent as ForwardIcon } from "../../assets/SearchBar/forwardIcon.svg";

const URL = import.meta.env.VITE_API;
import Modal from "react-modal";

import Fuse from "fuse.js";

const SearchSong = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [modalIsOpen, setModalIsOpen] = React.useState(false);

  const navigate = useNavigate();
  let b = () => {
    navigate(-1);
  };

  let f = () => {
    navigate(1);
  };

  useEffect(() => {
    if (searchTerm) {
      fetch(`${URL}/search`)
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          const fuseOptions = {
            isCaseSensitive: false,

            keys: ["title"],
          };
          const fuse = new Fuse(data, fuseOptions);
          const results = fuse.search(searchTerm, { limit: 5 });

          setSearchResults(results.map((result) => result.item));
        });
    } else {
      setSearchResults([]);
    }
  }, [searchTerm]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div className="flex justify-between items-center h-[70px] px-2 sticky top-0 bg-[#111111] mv:flex-row mv:px-4">
      <div className="align-middle">
        <BackIcon className="cursor-pointer fill-white mr-8" onClick={b} />
        <ForwardIcon className="cursor-pointer fill-white" onClick={f} />
      </div>
      <div>
        <input
          className="px-2 text-xs rounded-2xl my-4 py-[10px] mv:pr-10 sm:pr-20 sm:pl-4 border-solid border-2 focus:border-orange-500 focus:outline-none "
          placeholder="Search albums"
          type="text"
          value={searchTerm}
          onClick={() => setModalIsOpen(true)}
          onChange={handleSearchChange}
        />
      </div>
      {modalIsOpen && (
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={() => {
            setSearchTerm("");
            setModalIsOpen(false);
          }}
          shouldFocusAfterRender={false}
          className=" bg-[#3f3f3f] right-2  md:w-[450px] w-[calc(100%-15px)]  md:right-3 max-h-70 absolute top-[60px] rounded-xl p-3"
          style={{
            overlay: {
              backgroundColor: "",
              zIndex: "999",
            },
          }}
        >
          <div className="text-white text-base space-y-3 ">
            {searchResults.length == 0 ? (
              <div className="h-24 text-center flex items-center justify-center">
                No matches found
              </div>
            ) : (
              searchResults.map((release, index) => (
                <Link
                  to={`${release.release_type}/${release.release_id}`}
                  key={index}
                  className="bg-[#2f2f2f] rounded p-3  flex items-center no-underline text-inherit"
                  onClick={() => {
                    sessionStorage.setItem(
                      "currentRelease",
                      JSON.stringify(release)
                    );
                    setSearchTerm("");
                    setModalIsOpen(false);
                  }}
                >
                  <img
                    className="w-12 rounded aspect-square object-cover"
                    src={release.release_cover}
                    alt="release cover"
                  />
                  <div className="text-sm  ml-2">
                    <span>{release.title}</span>
                    <p className="text-xs opacity-75 ">
                      {release.release_type.charAt(0).toUpperCase() +
                        release.release_type.slice(1)}
                    </p>
                  </div>
                </Link>
              ))
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};

export default SearchSong;
