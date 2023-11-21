import React, { useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../../store/AuthContext";
import { useNavigate } from "react-router-dom";

import { ReactComponent as ArtistIcon } from "../../assets/NavPanel/artist.svg";
import { ReactComponent as AlbumIcon } from "../../assets/NavPanel/album.svg";
import { ReactComponent as SongIcon } from "../../assets/NavPanel/song.svg";
import { ReactComponent as PlaylistIcon } from "../../assets/NavPanel/playlist.svg";
import { ReactComponent as LogoutButton } from "../../assets/NavPanel/logout.svg";

import Pfp from "../../assets/profile_pic/pfp.png";

const icons = [
  { icon: PlaylistIcon, label: "Playlists", link: "playlists" },
  { icon: SongIcon, label: "Songs", link: "songs" },
  { icon: AlbumIcon, label: "Albums", link: "albums" },
  { icon: ArtistIcon, label: "Artists", link: "/player" },
];

const NavPanel = () => {
  const { userData, actions } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <div className="flex  p-2 lg:p-4 max-lg:items-center justify-between lg:flex-col bg-[#4a4a4a] sticky z-[998] top-0 h-[70px] w-full lg:h-[calc(100vh-96px)]  lg:w-[170px]">
      <div className="align-middle text-center">
        <Link to={`user/${userData.username}`}>
          <img
            src={Pfp}
            alt="Default Profile Picture"
            className="w-8 lg:w-10"
          />
        </Link>
      </div>
      <ul className="flex  items-center  lg:flex-col ">
        {icons.map((item, index) => (
          <Link
            to={item.link}
            key={index}
            className=" no-underline text-black w-14  lg:w-20"
          >
            <li className="lg:m-3 flex items-center flex-col  max-lg:h-10 max-lg:justify-end hover:fill-white hover:text-white   duration-300">
              <item.icon className="max-lg:w-5" />
              <span className="text-xs font-medium lg:text-sm">
                {item.label}
              </span>
            </li>
          </Link>
        ))}
      </ul>
      <div
        className="group text-xs lg:text-sm font-medium lg:flex items-center cursor-pointer justify-center  align-middle  text-center"
        onClick={() => {
          actions.logout();
          navigate("/");
        }}
      >
        <LogoutButton className="w-4 lg:w-7  group-hover:fill-white duration-300" />
        <h1 className="group-hover:text-white duration-300">Logout</h1>
      </div>
    </div>
  );
};

export default NavPanel;
