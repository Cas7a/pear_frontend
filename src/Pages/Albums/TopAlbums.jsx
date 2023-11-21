import React from "react";
import { useContext, useState, useEffect } from "react";
import AlbumsContext from "../../store/AlbumsContext";
import { Link } from "react-router-dom";

const TopAlbums = () => {
  const actions = useContext(AlbumsContext);

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  let sliceAmount;

  if (windowWidth >= 640 && windowWidth <= 768) {
    sliceAmount = 3;
  } else if (windowWidth >= 768 && windowWidth < 1024) {
    sliceAmount = 4;
  } else if (windowWidth >= 1024 && windowWidth < 1280) {
    sliceAmount = 5;
  } else if (windowWidth >= 1280 && windowWidth < 1536) {
    sliceAmount = 6;
  } else if (windowWidth > 1536) {
    sliceAmount = 7;
  } else {
    sliceAmount = 2;
  }

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  // console.log(actions.topAlbums);
  const showAlbums = (albums) => {
    return (
      <div className=" min-w-[200px] grid gap-8 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 justify-items-center mt-2">
        {actions.topAlbums &&
          albums.slice(0, sliceAmount).map((album, index) => (
            <Link
              to={album.href}
              key={index}
              target="_blank"
              className="text-inherit no-underline w-full"
            >
              <div>
                <img
                  src={album.img}
                  alt="Album Cover"
                  className="rounded-md w-full  min-w-[100px] aspect-square object-cover "
                />
                <div className="text-xs lg:text-sm mt-2">
                  <h1 className="truncate">{album.name}</h1>
                  <h1 className="truncate text-[#ffffff90]">{album.artist}</h1>
                  <h1 className="text-xs">{album.releaseDate}</h1>
                </div>
              </div>
            </Link>
          ))}
      </div>
    );
  };

  return (
    <div className="py-3">
      <h1 className="text-3xl lg:text-4xl 2xl:text-5xl">Top Albums</h1>
      <div className="mt-5 lg:mt-10">
        <h1 className="text-2xl 2xl:text-3xl">Pop</h1>
        {showAlbums(actions.topAlbums.pop)}
      </div>

      <div className="mt-12">
        <h1 className="text-2xl 2xl:text-3xl">Hip Hop</h1>
        {showAlbums(actions.topAlbums.hipHop)}
      </div>

      <div className="mt-12">
        <h1 className="text-2xl 2xl:text-3xl">Indie</h1>
        {showAlbums(actions.topAlbums.indie)}
      </div>
      <div className="mt-12">
        <h1 className="text-2xl 2xl:text-3xl">Jazz</h1>
        {showAlbums(actions.topAlbums.jazz)}
      </div>
    </div>
  );
};

export default TopAlbums;
