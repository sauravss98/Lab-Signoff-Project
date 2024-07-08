import { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import PropTypes from "prop-types";
import axiosInstance from "../../utils/Axios";
import { tokenLoader } from "../../utils/token";
import { Bounce, toast } from "react-toastify";

const token = tokenLoader();

const ProgramCreateComponent = ({ open, handleClose }) => {
  const [formData, setFormData] = useState({
    program_name: "",
    program_lenght: "",
  });

  const onChangeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onCreateClick = async (event) => {
    event.preventDefault();
    const program_name = formData.program_name;
    const program_lenght = formData.program_lenght;
    if (program_name === "" || program_lenght < 1) {
      toast.error(`Name field cannot be empty and lenght cannot be 0`, {
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
    } else {
      const createdData = {
        program_name: program_name,
        program_lenght: program_lenght,
      };
      try {
        const response = await axiosInstance.post(
          "/programs/create/",
          createdData,
          {
            headers: {
              Authorization: "Token " + token,
            },
          }
        );
        if (response.status === 201) {
          toast.success("New Program Created Successfully", {
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
          setFormData({ program_name: "", program_lenght: "" });
        }
      } catch (error) {
        console.log(error);
        toast.error(`Creating new program Failed: ${error}`, {
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
        <Modal.Title>Create New Program</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={onCreateClick}>
          <Form.Group className="mb-3" controlId="formProgramName">
            <Form.Control
              type="text"
              placeholder="Edit Program Name"
              name="program_name"
              value={formData.program_name}
              onChange={onChangeHandler}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formProgramLenght">
            <Form.Label>Program Length</Form.Label>
            <Form.Control
              type="number"
              placeholder="Edit Program Length"
              name="program_lenght"
              value={formData.program_lenght}
              onChange={onChangeHandler}
              required
            />
          </Form.Group>
          <Button variant="dark" type="submit">
            Submit
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

ProgramCreateComponent.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default ProgramCreateComponent;
