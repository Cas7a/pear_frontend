import { useState, useEffect } from "react";
import { Outlet } from "react-router";
import Player from "../components/Layout/Player";
import NavPanel from "../components/Layout/NavPanel";
import SearchSong from "../components/Layout/SearchSong";
import SkeletonLoading from "../components/Layout/SkeletonLoading";

const RootPage = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);
  if (loading) {
    return <SkeletonLoading />;
  }

  return (
    <>
      <main>
        <div className="grid grid-flow-col-dense">
          <div className="max-lg:hidden">
            <NavPanel />
          </div>
          <div className="bg-[#111111] text-white w-screen lg:w-[calc(100vw-170px)]">
            <SearchSong />
            <div className="px-6 xl:px-24 max-lg:min-h-[calc(100vh-236px)]">
              <Outlet />
            </div>
          </div>
        </div>
        <Player />
        <div className="lg:hidden  max-lg:bottom-0 max-lg:sticky">
          <NavPanel />
        </div>
      </main>
    </>
  );
};

export default RootPage;
