import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "./store/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { userData } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!userData.token) {
      navigate("/");
    }
  }, [userData.token, navigate]);

  return children;
};
export default ProtectedRoute;
