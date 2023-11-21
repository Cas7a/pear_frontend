import React from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const SkeletonLoading = () => {
  const navPanel = (width, height, lWidth, lHeight, isCircle) => {
    return (
      <div className="flex p-2 lg:p-4 items-center justify-between lg:flex-col bg-[#4a4a4a] sticky z-[998] top-0 h-[70px] w-full lg:h-[calc(100vh-96px)]  lg:w-[170px]">
        <div className="align-middle text-center ">
          <SkeletonTheme baseColor="#202020" highlightColor="#444">
            <Skeleton
              circle
              width={width}
              height={height}
              containerClassName="flex-1"
            />
          </SkeletonTheme>
        </div>
        <ul className=" lg:m-3 flex max-lg:gap-3 items-center lg:flex-col">
          <SkeletonTheme baseColor="#202020" highlightColor="#444">
            {Array(4)
              .fill()
              .map((_, i) => (
                <Skeleton
                  key={i}
                  circle
                  width={width}
                  height={height}
                  containerClassName="flex-1"
                  className="my-2 "
                />
              ))}
          </SkeletonTheme>
        </ul>
        <div className=" align-middle text-center">
          <SkeletonTheme baseColor="#202020" highlightColor="#444">
            <Skeleton
              width={lWidth}
              height={lHeight}
              circle={isCircle}
              containerClassName="flex-1"
            />
          </SkeletonTheme>
        </div>
      </div>
    );
  };

  return (
    <main>
      <div className="grid grid-flow-col-dense">
        <div className="max-lg:hidden">{navPanel(50, 50, 70, 11)}</div>
        <div className="h-screen bg-[#111111] w-full lg:w-[calc(100vw-170px)]"></div>
      </div>
      <div className="h-[96px] z-[999] bottom-[70px] lg:bottom-0 sticky panel max-lg:border-b max-lg:border-solid lg:shadow-player flex items-center justify-center gap-3 align-middle"></div>
      <div className="lg:hidden bottom-0 max-lg:sticky">
        {navPanel(40, 40, 40, 40, true)}
      </div>
    </main>
  );
};

export default SkeletonLoading;
