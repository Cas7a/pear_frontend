import React, { useContext, useState, useRef, useEffect } from "react";
import Modal from "react-modal";
import { ReleasesContext } from "../../store/ReleasesContext";
import { storage } from "../../Firebase/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import AuthContext from "../../store/AuthContext";
import { calculateAudioDuration } from "../../utils/calculateAudioDuration";

const CreateRelease = ({ isOpen, onClose }) => {
  const actions = useContext(ReleasesContext);
  const { userData } = useContext(AuthContext);
  const tracksInputRef = useRef();
  const coverInputRef = useRef();

  const [releaseType, setReleaseType] = useState("");
  const [isTypeSelected, setIsTypeSelected] = useState(false);

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedCover, setSelectedCover] = useState([]);

  const [errorMessages, setErrorMessages] = useState({
    file: "",
    cover: "",
  });

  const [tracksInfo, setTracksInfo] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [data, setData] = useState({
    title: "",
    type: releaseType,
    cover: "",
    tracks: [],
    autor: userData.username,
  });

  useEffect(() => {
    setData((prevData) => ({
      ...prevData,
      type: releaseType,
    }));
  }, [releaseType]);

  const uploadRelease = async (e) => {
    e.preventDefault();

    const filesArray = Array.from(selectedFiles);

    if (!isTypeSelected) {
      alert("Select release type");
      return;
    }

    // Check if cover is uploaded
    if (selectedCover.length === 0) {
      setErrorMessages((prevData) => ({
        ...prevData,
        cover: "Select your cover",
      }));
      return;
    }

    // Check if track is uploaded
    if (selectedFiles.length === 0) {
      setErrorMessages((prevData) => ({
        ...prevData,
        file: "Select at least one track.",
      }));
      return;
    }

    //Check release type
    if ([1, 2, 3].includes(selectedFiles.length) && releaseType != "single") {
      alert("Choose Single");
      return;
    }
    if ([4, 5].includes(selectedFiles.length) && releaseType != "EP") {
      alert("Choose EP");
      return;
    }
    if (selectedFiles.length >= 6 && releaseType != "album") {
      alert("Choose Album");
      return;
    }

    //Check if cover is valid
    const allowedMimeTypesCover = ["image/jpeg", "image/png", "image/jpg"];
    if (
      !selectedCover[0] ||
      !allowedMimeTypesCover.includes(selectedCover[0].type)
    ) {
      alert("Select a valid cover format (JPEG, PNG, JPG).");
      return;
    }

    //Check if track is valid
    const allowedMimeTypesTracks = ["audio/mpeg", "audio/vnd.wav"];
    const invalidFiles = filesArray.filter(
      (file) => !allowedMimeTypesTracks.includes(file.type)
    );
    if (invalidFiles.length > 0) {
      alert("Select a valid format (MP3, WAV)");
      return;
    }

    // Upload tracks and cover to firebase
    try {
      setIsLoading(true);

      const uploadPromises = filesArray.map(async (file) => {
        const storageRef = ref(
          storage,
          `releases/${userData.username}/${data.title}/${file.name}`
        );
        return uploadBytes(storageRef, file).then(() =>
          getDownloadURL(storageRef)
        );
      });

      const coverStorageRef = ref(
        storage,
        `releases_images/${userData.username}/${selectedCover[0].name}`
      );

      uploadPromises.push(
        uploadBytes(coverStorageRef, selectedCover[0]).then(() =>
          getDownloadURL(coverStorageRef)
        )
      );

      const uploadedUrls = await Promise.all(uploadPromises);

      const coverUrl = uploadedUrls.pop();
      const trackCover = await getDownloadURL(coverStorageRef);
      const currentYear = new Date().getFullYear();

      setData((prevData) => {
        const newTracks = tracksInfo.map((track, index) => {
          return {
            ...track,
            track_cover: trackCover,
            track_url: uploadedUrls[index],
            year: currentYear,

            autor:
              (userData?.username || "").charAt(0).toUpperCase() +
              (userData?.username || "").slice(1),
          };
        });

        const finalData = {
          ...prevData,
          cover: coverUrl,
          year: currentYear,
          tracks: newTracks,
        };

        actions.createRelease(finalData);
        return finalData;
      });

      onClose();
    } catch (error) {
      console.error("Error uploading files", error);
    }

    setData({
      title: "",
      type: setReleaseType(""),
      cover: "",
      tracks: [],
    });
    setErrorMessages({
      file: "",
      cover: "",
    });
    setSelectedFiles([]);
    setSelectedCover([]);
    setIsLoading(false);
  };

  const handleCheckboxChange = (type) => {
    setReleaseType(type);
    setData((prevData) => ({
      ...prevData,
      type,
    }));
    setIsTypeSelected(true);
  };

  const handleTitle = (e) => {
    setData((prevData) => ({ ...prevData, [e.target.id]: e.target.value }));
  };

  const handleFileChange = async (e) => {
    const files = e.target.files;
    const updatedTrackInfo = [];
    setSelectedFiles(files);
    for (const file of files) {
      try {
        const duration = await calculateAudioDuration(file);

        updatedTrackInfo.push({
          track_name: file.name,
          track_duration: duration,
        });
      } catch (error) {
        console.error("File duration error", error);
      }
    }
    setTracksInfo(updatedTrackInfo);
  };

  const handleCover = async (e) => {
    const file = e.target.files;
    setSelectedCover(file);
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Upload music form"
      shouldCloseOnOverlayClick={!isLoading}
      className=" bg-[#2f2f2f] w-[450px] h-[500px] modal rounded-xl  max-w-full max-h-[80%] lg:w-[550px] lg:h-[580px]  overflow-hidden overflow-y-auto"
      style={{
        overlay: {
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          zIndex: "999",
        },
      }}
    >
      <form onSubmit={uploadRelease} className="p-6">
        <div>
          <h1 className="text-white  text-lg">Release your music</h1>
        </div>

        <div className="text-white text-sm tracking-wide ">
          <div className="mt-5 ">
            <label htmlFor="title">Title</label>
            <input
              id="title"
              type="text"
              autoFocus
              required
              value={data.title}
              onChange={(e) => handleTitle(e)}
              placeholder="Give a title for your release"
              className="pb-2 px-0 py-1 border-solid border-0 w-full border-b-[1px] mt-2 text-white placeholder-opacity-40 bg-transparent focus:outline-none transition 
      duration-300 hover:border-orange-50"
            />
          </div>
          <div className=" mt-8 mb-8">
            <h1 className="mb-3">Release type</h1>

            <div className=" inline-flex mr-4 items-center ">
              <label htmlFor="single">{`Single (1-3)`}</label>
              <input
                type="checkbox"
                checked={releaseType === "single"}
                onChange={() => handleCheckboxChange("single")}
                id="single"
              />
            </div>

            <div className=" inline-flex mr-4 items-center">
              <label htmlFor="ep">{`EP (4-5)`}</label>
              <input
                type="checkbox"
                checked={releaseType === "EP"}
                onChange={() => handleCheckboxChange("EP")}
                id="ep"
              />
            </div>

            <div className=" inline-flex items-center">
              <label htmlFor="album">{`Album (6 >)`}</label>
              <input
                type="checkbox"
                checked={releaseType === "album"}
                onChange={() => handleCheckboxChange("album")}
                id="album"
              />
            </div>
          </div>
          <div className="mb-2 h-24">
            <button
              className="bg-[#222] rounded border-none text-white cursor-pointer p-3 font-semibold hover:opacity-75 focus:opacity-75 w-44"
              onClick={(e) => {
                e.preventDefault();
                coverInputRef.current.click();
              }}
            >
              Upload your cover
            </button>
            <input
              type="file"
              style={{ display: "none" }}
              accept=".png, .jpg, .jpeg"
              ref={coverInputRef}
              onChange={handleCover}
            />
            <p className="ml-1 mt-2 text-[13px]">
              Selected files: {selectedCover[0] ? selectedCover[0].name : 0}
            </p>
            {errorMessages.cover && selectedCover.length === 0 ? (
              <h1 className="ml-1 mt-1 text-xs text-red-600">
                {errorMessages.cover}
              </h1>
            ) : null}
          </div>
          <div className="h-24">
            <button
              className="bg-[#222] rounded border-none text-white cursor-pointer p-3 font-semibold hover:opacity-75 focus:opacity-75  w-44"
              onClick={(e) => {
                e.preventDefault();
                tracksInputRef.current.click();
              }}
            >
              Upload your tracks
            </button>
            <input
              type="file"
              style={{ display: "none" }}
              multiple
              accept=".mp3, .wav"
              ref={tracksInputRef}
              onChange={handleFileChange}
            />
            <p className="ml-1 mt-2 text-[13px]">
              Selected tracks: {selectedFiles.length}
            </p>
            {errorMessages.file && selectedFiles.length === 0 ? (
              <h1 className="ml-1 mt-1 text-xs text-red-600">
                {errorMessages.file}
              </h1>
            ) : null}
          </div>
        </div>

        <div className="flex justify-end mt-12 lg:mt-16">
          <button
            type="submit"
            className="btn_login w-40 py-3 font-medium block text-black h-11"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="loader"></span>
            ) : (
              <h1 className="">Upload your music</h1>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateRelease;
