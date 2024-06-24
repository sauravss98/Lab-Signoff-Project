import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useState } from "react";
import { toast } from "react-toastify";
import { Bounce } from "react-toastify";
import axiosInstance from "../../utils/Axios";
import { tokenLoader } from "../../utils/token";

// eslint-disable-next-line react/prop-types
const ChangePasswordFormComponent = ({ handleClose }) => {
  const [form, setForm] = useState({
    old_password: "",
    new_password: "",
  });
  const token = tokenLoader();
  const onChangeHandler = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    const newData = {
      old_password: form.old_password,
      new_password: form.new_password,
    };

    try {
      const response = await axiosInstance.post(
        "/users/change-password/",
        newData,
        {
          headers: {
            Authorization: "Token " + token,
          },
        }
      );
      if (response.status === 200) {
        console.log(response);
        toast("Password Changed Successfully!!!", {
          position: "top-right",
          autoClose: 5000,
          type: "success",
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
      if (errorData.old_password?.[0] === "Wrong password.") {
        toast("Old Password entered is wrong. Please try again", {
          position: "top-right",
          autoClose: 5000,
          type: "error",
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          transition: Bounce,
        });
      }
      if (
        errorData.old_password?.[0] === "This field may not be blank." ||
        errorData.new_password?.[0] === "This field may not be blank."
      ) {
        toast("Password fields cannot be empty", {
          position: "top-right",
          autoClose: 5000,
          type: "error",
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          transition: Bounce,
        });
      }
      if (
        errorData.old_password?.[0] ===
          "This password is too short. It must contain at least 8 characters." ||
        errorData.new_password?.[0] ===
          "This password is too short. It must contain at least 8 characters."
      ) {
        toast("Password too short. Must be at least 8 characters long", {
          position: "top-right",
          autoClose: 5000,
          type: "error",
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          transition: Bounce,
        });
      }
      if (errorData.new_password?.[0] === "This password is too common.") {
        toast("Password used is too common, Please change it.", {
          position: "top-right",
          autoClose: 5000,
          type: "error",
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          transition: Bounce,
        });
      }
    }
  };
  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3" controlId="formOldPassword ">
        <Form.Label>Enter Old Password</Form.Label>
        <Form.Control
          type="password"
          placeholder="Old Password"
          name="old_password"
          value={form.old_password}
          onChange={onChangeHandler}
        />
      </Form.Group>
      <Form.Group className="mb-3" controlId="formNewPassword">
        <Form.Label>Enter New Password</Form.Label>
        <Form.Control
          type="password"
          placeholder="New Password"
          name="new_password"
          value={form.new_password}
          onChange={onChangeHandler}
        />
      </Form.Group>
      <Button variant="dark" type="submit">
        Submit
      </Button>
    </Form>
  );
};

export default ChangePasswordFormComponent;
