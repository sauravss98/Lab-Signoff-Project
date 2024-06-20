// import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import "../Home/Home.css";
import SideNav from "../SideNav/SideNav";
import { useState } from "react";

const Home = () => {
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSideBarOpen(!isSideBarOpen);
  };

  return (
    <>
      <div>
        <div>
          <Row>
            <SideNav isOpen={isSideBarOpen} toggleSidebar={toggleSidebar} />
            <h1>Home</h1>
          </Row>
        </div>
      </div>
    </>
  );
};

export default Home;
