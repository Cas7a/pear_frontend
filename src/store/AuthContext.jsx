import React, { createContext, useReducer } from "react";

export const AuthContext = createContext();

const URL = import.meta.env.VITE_API;

const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
    case "REGISTER":
      sessionStorage.setItem("token", action.payload.access_token);
      sessionStorage.setItem("tokenExp", action.payload.token_exp);
      sessionStorage.setItem("username", action.payload.username);

      sessionStorage.setItem("refreshToken", action.payload.refresh_token);

      return {
        ...state,
        userData: {
          username: action.payload.username,
          token: action.payload.access_token,
          tokenExp: action.payload.token_exp,
          refreshToken: action.payload.refresh_token,
        },
        loginError: false,
        registerError: false,
      };
    case "LOGIN_ERROR":
      return {
        ...state,
        loginError: action.payload,
      };

    case "REGISTER_ERROR":
      return {
        ...state,
        registerError: action.payload,
      };

    case "REFRESH_TOKEN":
      sessionStorage.setItem("token", action.payload.access_token);
      sessionStorage.setItem("tokenExp", action.payload.token_exp);

      return {
        ...state,
        userData: {
          ...state.userData,
          token: action.payload.access_token,
          tokenExp: action.payload.token_exp,
        },
      };

    default:
      return state;
  }
};

const initialState = {
  userData: {
    username: sessionStorage.getItem("username"),
    token: sessionStorage.getItem("token"),
    refreshToken: sessionStorage.getItem("refreshToken"),
    tokenExp: sessionStorage.getItem("tokenExp"),
  },

  loginError: false,
  registerError: false,
};

const makeRequest = async (method, url, body, auth) => {
  const opts = {
    method,
    headers: {
      Authorization: auth,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  };

  const res = await fetch(url, opts);

  if (!res.ok) {
    throw new Error("La solicitud no fue exitosa");
  }

  return res.json();
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const actions = {
    login: async (username, password) => {
      try {
        const userInfo = await makeRequest("POST", `${URL}/login`, {
          username,
          password,
        });

        dispatch({ type: "LOGIN", payload: userInfo });

        return true;
      } catch (error) {
        console.error("An error has ocurred", error);
        dispatch({
          type: "LOGIN_ERROR",
          payload: "User or password incorrect.",
        });
        return Promise.reject(error);
      }
    },

    register: async (username, email, password) => {
      try {
        const userInfo = await makeRequest("POST", `${URL}/register`, {
          username,
          password,
          email,
        });

        dispatch({ type: "REGISTER", payload: userInfo });
        return true;
      } catch (error) {
        console.error("An error has ocurred:", error);
        dispatch({
          type: "REGISTER_ERROR",
          payload: "Username or email already registered",
        });
        return Promise.reject(error);
      }
    },
    logout: async () => {
      try {
        await makeRequest(
          "POST",
          `${URL}/logout`,
          null,
          `Bearer ${state.userData.token}`
        );

        sessionStorage.removeItem("username");
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("refreshToken");
        sessionStorage.removeItem("tokenExp");
        sessionStorage.removeItem("isPlaying");
        sessionStorage.removeItem("queue");
        sessionStorage.removeItem("currentIndex");
        sessionStorage.setItem("currentSong", null);
        sessionStorage.setItem("currentTime", 0);

        sessionStorage.removeItem("currentRelease");
        sessionStorage.removeItem("currentPlaylists");
        window.location.reload();

        return true;
      } catch (error) {
        console.error(error);
        return Promise.reject(error);
      }
    },
    refreshAccessToken: async () => {
      try {
        const userInfo = await makeRequest(
          "POST",
          `${URL}/refresh`,
          undefined,
          `Bearer ${state.userData.refreshToken}`
        );
        console.log(userInfo);
        dispatch({ type: "REFRESH_TOKEN", payload: userInfo });

        return true;
      } catch (error) {
        console.error("An error has ocurred:", error);
        return Promise.reject(error);
      }
    },
  };

  return (
    <AuthContext.Provider
      value={{
        userData: state.userData,
        actions,
        loginError: state.loginError,
        registerError: state.registerError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
