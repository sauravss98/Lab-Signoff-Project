import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { tokenLoader } from "../../utils/token";
import axiosInstance from "../../utils/Axios";

const Home = () => {
  const navigate = useNavigate();
  const [userType, setUserType] = useState("");
  const userTypeRef = useRef("");

  useEffect(() => {
    const fetchData = async () => {
      const token = tokenLoader();
      if (token === "EXPIRED") {
        navigate("/login");
        return;
      }
      if (token) {
        try {
          const response = await axiosInstance.get("/users/user_details", {
            headers: {
              Authorization: "Token " + token,
            },
          });
          userTypeRef.current = response.data.user_type;
          setUserType(userTypeRef.current);
          navigate(`/${response.data.user_type}`);
        } catch (error) {
          console.log(error);
          if (error.response.status === 403) {
            navigate("/login");
          }
        }
      } else {
        navigate("/login");
      }
    };

    fetchData();
  }, [navigate]);

  return null;
};

export default Home;
