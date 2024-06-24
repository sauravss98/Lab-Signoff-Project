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
      console.log(error);
      if (error.response.status === 400) {
        toast("Old Password Wrong", {
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
