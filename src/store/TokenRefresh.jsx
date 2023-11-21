import { useContext, useEffect } from "react";
import AuthContext from "./AuthContext";

const TokenRefreshTimer = () => {
  const { actions, userData } = useContext(AuthContext);

  useEffect(() => {
    const currentTime = Math.round(Date.now() / 1000);
    const timeRemaining = userData.tokenExp - currentTime;
    const refreshTime = timeRemaining - 10;
    // console.log(`Time remaining ${timeRemaining}, RefreshTime ${refreshTime}`);

    if (refreshTime > 0) {
      const timerId = setTimeout(() => {
        actions.refreshAccessToken();
      }, refreshTime * 1000);

      return () => clearTimeout(timerId);
    }
  }, [userData.tokenExp, actions]);

  return null;
};

export default TokenRefreshTimer;
