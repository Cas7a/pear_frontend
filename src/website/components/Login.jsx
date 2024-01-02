import React, { useState, useContext, useEffect } from "react";
import Modal from "react-modal";
import { Link } from "react-router-dom";
import AuthContext from "../../store/AuthContext";

// Modal.setAppElement("#root");
Modal.setAppElement(document.createElement("div"));

const Login = ({ isOpen, onClose }) => {
  const { actions, loginError } = useContext(AuthContext);

  const [data, setData] = useState({ username: "", password: "" });
  const [loginSuccess, setLoginSuccess] = useState(false);

  useEffect(() => {
    if (loginSuccess) {
      window.location.assign("/player");
    }
  }, [loginSuccess]);

  const submit = async (e) => {
    e.preventDefault();

    const loginResult = await actions.login(data.username, data.password);

    if (loginResult) {
      setLoginSuccess(true);
    }
  };

  const handler = (e) => {
    setData((prevData) => ({ ...prevData, [e.target.id]: e.target.value }));
  };

  return (
    <Modal
      isOpen={true}
      onRequestClose={onClose}
      contentLabel="Login Pop up"
      className="login w-96 h-96 absolute max-md:top-0 max-md:left-0 max-md:right-0 max-md:bottom-0 max-md:m-auto md:top-24 md:right-8 max-w-full  rounded-xl pt-8"
      style={{
        overlay: {
          backgroundColor: "rgba(0, 0, 0, 0.2)",
        },
      }}
    >
      <form
        className="text-xl font-medium w-[70%] mx-auto text-white"
        onSubmit={submit}
      >
        <h1 className=" text-center">Login</h1>
        <div className="mt-6 w-[73%] mx-auto text-sm">
          <label htmlFor="username">
            <span>username</span>
          </label>

          <input
            id="username"
            name="username"
            type="text"
            autoFocus
            required
            value={data.username}
            onChange={(e) => handler(e)}
            placeholder="Username"
            className="py-3 pr-4 pl-3 rounded-md border-solid border-2 placeholder-opacity-40 placeholder-[#f0f0f0] bg-[#737373] text-white  focus:outline-none transition 
          duration-300 hover:border-orange-50"
          />
        </div>

        <div className="mt-4 w-[73%] mx-auto h-[90px] text-sm">
          <label htmlFor="password">
            <span>password</span>
          </label>
          <input
            id="password"
            type="password"
            name="password"
            required
            value={data.password}
            onChange={(e) => handler(e)}
            placeholder="Password"
            className="py-3 pr-4 pl-3 rounded-md border-solid border-2 placeholder-opacity-40 placeholder-[#f0f0f0] bg-[#737373] text-white focus:outline-none transition 
          duration-300 hover:border-orange-50 "
          />
          <p className="text-red-600 text-xs mt-2">{loginError}</p>
        </div>

        <button
          onClick={submit}
          aria-label="login"
          className="btn_login mt-5 mb-4 px-16 py-3 font-medium block mx-auto text-black"
        >
          <span>Login</span>
        </button>
        <div className="text-center text-black text-[11px]">
          <span className="mr-2">Don't have an account?</span>
          <Link
            to="register"
            className="text-black font-normal transition duration-300 hover:text-orange-50"
          >
            <span className=" font-bold">Sign up now</span>
          </Link>
        </div>
      </form>
    </Modal>
  );
};

export default Login;
