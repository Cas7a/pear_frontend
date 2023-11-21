import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../store/AuthContext";

const Register = () => {
  const { actions, registerError, userData } = useContext(AuthContext);

  const USER_TOKEN = userData.token;

  const [data, setData] = useState({ username: "", email: "", password: "" });
  const [registerSuccess, setRegisterSuccess] = useState(false);

  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();

    const registerResult = await actions.register(
      data.username,
      data.email,
      data.password
    );

    if (registerResult) {
      setRegisterSuccess(true);
      navigate("/player");
      window.location.reload();
    }
  };

  const handler = (e) => {
    setData((prevData) => ({ ...prevData, [e.target.id]: e.target.value }));
  };

  return (
    <>
      {USER_TOKEN && USER_TOKEN != "" && USER_TOKEN != undefined ? (
        <div className="website h-screen flex items-center justify-center">
          <span className="text-xl font-medium">You're logged in!</span>
        </div>
      ) : (
        <div className="h-screen website text-white flex items-center">
          <div className="w-[300px] h-[400px] sm:w-[400px] lg:w-[550px] lg:h-[530px] rounded-3xl login flex items-center justify-center  mx-auto">
            <form className="text-center" onSubmit={submit}>
              <label className=" font-medium lg:text-3xl">
                <h1 className="pb-4 text-center lg:pb-7">Register</h1>
              </label>

              <div className="mb-4">
                <div className="text-left">
                  <label
                    className=" text-sm font-medium lg:text-base "
                    htmlFor="username"
                  >
                    <span>Username</span>
                  </label>
                </div>

                <input
                  className="input_register"
                  onChange={(e) => handler(e)}
                  type="text"
                  id="username"
                  value={data.username}
                  required
                  name="username"
                  autoFocus
                  placeholder="Name"
                />
              </div>

              <div className="mb-4">
                <div className="text-left">
                  <label
                    className="text-sm font-medium lg:text-base"
                    htmlFor="email"
                  >
                    <span>Email</span>
                  </label>
                </div>

                <input
                  className="input_register"
                  onChange={(e) => handler(e)}
                  type="email"
                  id="email"
                  value={data.email}
                  required
                  name="email"
                  placeholder="Email"
                />
              </div>

              <div className="mb-8 h-[90px] ">
                <div className="text-left">
                  <label
                    className=" text-sm font-medium lg:text-base"
                    htmlFor="password"
                  >
                    <span>Password</span>
                  </label>
                </div>

                <input
                  className="input_register"
                  onChange={(e) => handler(e)}
                  type="password"
                  id="password"
                  value={data.password}
                  required
                  name="password"
                  placeholder="Password"
                />
                <p className="text-red-600 text-xs mt-2 max-lg:w-48">
                  {registerError}
                </p>
              </div>

              <div className="text-center">
                <button className="btn_login px-14 py-2" type="submit">
                  <span className="text-sm font-bold lg:px-6 lg:text-base">
                    Register
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Register;
