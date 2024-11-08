import Modal from "react-bootstrap/Modal";
import PropTypes from "prop-types";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useState } from "react";
import axiosInstance from "../../utils/Axios";
import { Bounce, toast } from "react-toastify";
import { tokenLoader } from "../../utils/token";

const token = tokenLoader();
const UserCreateModal = ({ open, handleClose }) => {
  /**
   * User Create Modal Component
   */
  const [formData, setFormData] = useState({
    email: "",
    password: "default",
    first_name: "",
    last_name: "",
    userType: "1",
  });

  const onChangeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const getUserType = (userType) => {
    switch (userType) {
      case "1":
        return "student";
      case "2":
        return "staff";
      case "3":
        return "admin";
      default:
        return "";
    }
  };

  const onCreateClick = async (event) => {
    event.preventDefault();
    const user_type = getUserType(formData.userType);
    const newUser = {
      email: formData.email,
      password: "default",
      first_name: formData.first_name,
      last_name: formData.last_name,
      user_type: user_type,
    };
    try {
      const response = await axiosInstance.post("/users/create_user", newUser, {
        headers: {
          Authorization: "Token " + token,
        },
      });
      if (response.status === 201) {
        toast.success("User Created Successfully", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          transition: Bounce,
        });
        handleClose();
      }
    } catch (error) {
      const errorData = error.response?.data || {};
      let errorMessage = "Error Creating user";
      if (errorData.email?.[0] === "A user with that email already exists.") {
        errorMessage = "A user with that email already exists.";
      } else if (errorData.email?.[0] === "Email field may not be blank.") {
        errorMessage = "Email field may not be blank.";
      } else if (
        errorData.first_name?.[0] === "First Name field may not be blank."
      ) {
        errorMessage = "First Name field may not be blank.";
      } else if (
        errorData.last_name?.[0] === "Last Name field may not be blank."
      ) {
        errorMessage = "Last Name field may not be blank.";
      }
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
      });
    }
  };

  return (
    <Modal
      show={open}
      onHide={handleClose}
      centered
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
    >
      <Modal.Header closeButton>
        <Modal.Title>User Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={onCreateClick}>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              name="email"
              value={formData.email}
              onChange={onChangeHandler}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicFirstName">
            <Form.Label>First name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter First Name"
              name="first_name"
              value={formData.first_name}
              onChange={onChangeHandler}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicLastName">
            <Form.Label>Last name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Last Name"
              name="last_name"
              value={formData.last_name}
              onChange={onChangeHandler}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicUserType">
            <Form.Select
              name="userType"
              value={formData.userType}
              onChange={onChangeHandler}
              defaultValue={formData.userType}
            >
              <option value="1">Student</option>
              <option value="2">Staff</option>
              <option value="3">Admin</option>
            </Form.Select>
          </Form.Group>
          <Button variant="dark" type="submit">
            Submit
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

UserCreateModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default UserCreateModal;
