import { useState, useEffect } from "react";
const URL = import.meta.env.VITE_API;

const TokenVerify = () => {
  const [status, setStatus] = useState("");

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    // console.log(token);
    async function verifyAndDisplayContent() {
      if (typeof token === "string") {
        try {
          const response = await fetch(`${URL}/protected`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const decoded = await response.json();
            // console.log(decoded);
            setStatus("Token verified: " + JSON.stringify(decoded));
          } else {
            setStatus("Error verifying token: " + response.statusText);
          }
        } catch (error) {
          setStatus("Error verifying token:" + error.message);
        }
      } else {
        setStatus("Error: Token is not a string");
      }
    }

    verifyAndDisplayContent();
  }, []);

  return null;
};

export default TokenVerify;
