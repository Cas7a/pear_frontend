import React, { useState, useContext } from "react";
import Modal from "react-modal";
import PlaylistContext from "../../store/PlaylistContext";

const CreatePlaylist = ({ isOpen, onClose }) => {
  const [data, setData] = useState({
    title: "",
    description: "",
  });

  const actions = useContext(PlaylistContext);

  const addPlaylist = async (e) => {
    e.preventDefault();
    onClose();
    try {
      await actions.createPlaylist(data);
      actions.setForceUpdate((prev) => !prev);
    } catch (error) {
      console.error(error);
    }
    setData({
      title: "",
      description: "",
    });
  };

  const handler = (e) => {
    setData((prevData) => ({ ...prevData, [e.target.id]: e.target.value }));
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Create playlist form"
      className=" bg-[#2f2f2f;] w-[450px] h-[450px] modal rounded-xl  max-w-full max-h-[80%] lg:w-[550px] lg:h-[500px]  overflow-hidden overflow-y-auto"
      style={{
        overlay: {
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          zIndex: "999",
        },
      }}
    >
      <form onSubmit={addPlaylist} className="p-6">
        <div>
          <h1 className="text-white  text-lg">Create new playlist</h1>
        </div>
        <div className="mt-5  text-sm text-white">
          <label htmlFor="title">
            <h1 className=" text-white text-opacity-80   tracking-wide">
              Title
            </h1>
          </label>
          <input
            id="title"
            type="text"
            autoFocus
            required
            value={data.title}
            onChange={(e) => handler(e)}
            placeholder="Give a title for your playlist"
            className="pb-2 px-0 py-1 border-solid border-0 w-full border-b-[1px] mt-2 text-white placeholder-opacity-40 bg-transparent focus:outline-none transition 
          duration-300 hover:border-orange-50"
          />
        </div>
        <div className="mt-8 text-sm text-white">
          <label htmlFor="title">
            <h1 className=" text-white text-opacity-80   tracking-wide">
              Write a description
            </h1>
          </label>
          <textarea
            id="description"
            cols="1"
            rows="2"
            value={data.description}
            onChange={(e) => handler(e)}
            placeholder="Write a short description for your playlist (Optional)"
            maxLength={400}
            className=" resize-none w-full  px-0 border-solid border-0 border-b-[1px] mt-3 text-white placeholder-opacity-40 bg-transparent focus:outline-none transition 
          duration-300 hover:border-orange-50"
          />
        </div>
        <div className="flex justify-end mt-36 lg:mt-48">
          <button
            type="submit"
            className="btn_login w-40 py-3 font-medium block text-black"
          >
            <h1>Create new</h1>
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default CreatePlaylist;
