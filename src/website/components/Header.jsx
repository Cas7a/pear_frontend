import React, { useState, useContext } from "react";
import Logo from "../resources/PearLogo.png";

import Login from "./Login";
import AuthContext from "../../store/AuthContext";

const Header = () => {
  const { userData, actions } = useContext(AuthContext);

  const logout = () => {
    actions.logout();
  };

  const [modalIsOpen, setModalIsOpen] = useState(false);

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  return (
    <nav className="flex justify-between items-center mx-10 h-[100px] ">
      <div className="h-[65px] w-[150px] my-4">
        <img className="h-full" src={Logo} alt="Pear Logo" />
      </div>

      {userData.token && userData.token != "" && userData.token != undefined ? (
        <div>
          <button className="btn px-4 py-2 w-[150px]" onClick={logout}>
            <span className="text-[17px] font-bold px-3">Logout</span>
          </button>
        </div>
      ) : (
        <div className=" ">
          <button className="btn px-4 py-2 w-[150px]" onClick={openModal}>
            <span className="text-[17px] font-bold px-3">Login</span>
          </button>
        </div>
      )}
      <Login isOpen={modalIsOpen} onClose={closeModal} />
    </nav>
  );
};

export default Header;
