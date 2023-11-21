import { Link } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../../store/AuthContext";

const Content = () => {
  const { userData } = useContext(AuthContext);

  return (
    <>
      <main className=" flex items-center justify-center ">
        <div className="flex flex-col items-center h-[250px]">
          <h1 className="text-[64px] pb-3 xl:text-[80px] font-medium">Pear</h1>
          <p className="text-[16px] pb-6 xl:text-[18px]">Music for everyone</p>
          {userData.token &&
          userData.token != "" &&
          userData.token != undefined ? (
            <Link to="player">
              <button className="btn px-10 py-1 font-medium xl:px-14">
                <span className="text-lg">Player</span>
              </button>
            </Link>
          ) : (
            <button className="btn px-10 py-1 font-medium xl:px-14">
              <span className="text-lg">Pear</span>
            </button>
          )}
        </div>
      </main>
    </>
  );
};

export default Content;
