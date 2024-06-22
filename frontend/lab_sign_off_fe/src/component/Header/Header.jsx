import { useDispatch } from "react-redux";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import classes from "./Header.module.css";
import { useEffect, useState } from "react";
import axiosInstance from "../../utils/Axios";
import { authActions } from "../../store/auth";
import { useNavigate } from "react-router-dom";
import { tokenLoader } from "../../utils/token";

function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [userName, setUserName] = useState("");
  const token = tokenLoader();

  const homeClick = () => {
    navigate("/");
  };
  const settingsClick = () => {
    navigate("/settings");
  };

  const logoutClick = async () => {
    const response = await axiosInstance.post("users/logout");
    if (response.status === 200) {
      localStorage.removeItem("token");
      localStorage.removeItem("expiration");
      localStorage.removeItem("authentication");
      dispatch(authActions.logout);
      navigate("/login");
    }
  };

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (token === "EXPIRED") {
        navigate("/login");
        return;
      }
      if (token) {
        const response = await axiosInstance.get("/users/user_details", {
          headers: {
            Authorization: "Token " + token,
          },
        });
        const first_name = response.data.first_name;
        const second_name = response.data.last_name;
        const name = first_name + " " + second_name;
        setUserName(name);
      } else {
        navigate("/login");
      }
    };

    fetchUserDetails();
  }, [navigate, token]);

  return (
    <>
      <Navbar className="bg-body-tertiary" bg="dark" data-bs-theme="dark">
        <Navbar.Brand onClick={homeClick}>Lab App</Navbar.Brand>
        {token && (
          <Navbar.Collapse
            className="justify-content-end"
            id={classes.navElement}
          >
            <NavDropdown
              title={"Hi, " + userName}
              id="navbarScrollingDropdown"
              className={classes.headerDropdown}
            >
              <NavDropdown.Item onClick={settingsClick}>
                Settings
              </NavDropdown.Item>
              <NavDropdown.Item onClick={logoutClick}>Logout</NavDropdown.Item>
            </NavDropdown>
          </Navbar.Collapse>
        )}
      </Navbar>
    </>
  );
}

export default Header;
