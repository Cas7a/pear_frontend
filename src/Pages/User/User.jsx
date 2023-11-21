import React, { useContext } from "react";
import Pfp from "../../assets/profile_pic/pfp.png";
import AuthContext from "../../store/AuthContext";
import ShowReleases from "./ShowReleases";

const User = () => {
  const { userData } = useContext(AuthContext);

  const username =
    (userData?.username || "").charAt(0).toUpperCase() +
    (userData?.username || "").slice(1);

  return (
    <>
      <div className="py-4">
        <div className=" items-center sm360:table">
          <img
            src={Pfp}
            alt="Artist Profile Picture"
            className="w-24 rounded-full mr-8 mv:w-40 md:w-52 md:mr-12 xl:w-64 "
          />

          <div className="table-cell align-middle">
            <span className="text-xl mv:text-3xl md:text-4xl xl:text-6xl">
              {username}
            </span>

            <h1 className="mt-1 text-xs mv:text-sm mv:mt-2 xl:text-base"></h1>
          </div>
        </div>
      </div>

      <ShowReleases />
    </>
  );
};

export default User;
