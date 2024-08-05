import { useDispatch } from "react-redux";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import classes from "./Header.module.css";
import { useEffect, useState } from "react";
import axiosInstance from "../../utils/Axios";
import { settingsActions } from "../../store/settingsPageState";
import { authActions } from "../../store/auth";
import { useNavigate } from "react-router-dom";
import { tokenLoader } from "../../utils/token";
import { Button } from "react-bootstrap";

function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [userName, setUserName] = useState("");
  const [tokenAvailable, setTokenAvailable] = useState(false);
  const token = tokenLoader();

  const homeClick = () => {
    navigate("/");
  };
  const settingsClick = () => {
    navigate("/settings");
  };

  const onNotificationClick = () => {
    navigate("/notifications");
  };

  const logoutClick = async () => {
    const response = await axiosInstance.post("users/logout");
    if (response.status === 200) {
      localStorage.removeItem("token");
      localStorage.removeItem("expiration");
      localStorage.removeItem("authentication");
      dispatch(settingsActions.clearSelectedSettings());
      dispatch(authActions.logout());
      setTokenAvailable(false);
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
        try {
          const response = await axiosInstance.get("/users/user_details", {
            headers: {
              Authorization: "Token " + token,
            },
          });
          const first_name = response.data.first_name;
          const second_name = response.data.last_name;
          const name = first_name + " " + second_name;
          setUserName(name);
          setTokenAvailable(true);
        } catch (error) {
          console.log(error);
          setTokenAvailable(false);
        }
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
        {tokenAvailable && (
          <Navbar.Collapse
            className="justify-content-end"
            id={classes.navElement}
          >
            <Button onClick={onNotificationClick}>Notification</Button>
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
