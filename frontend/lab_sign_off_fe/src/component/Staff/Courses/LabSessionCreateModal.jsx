import Modal from "react-bootstrap/Modal";
import { tokenLoader } from "../../../utils/token";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/esm/Button";
import PropTypes from "prop-types";
import { useState } from "react";
import { Bounce, toast } from "react-toastify";
import axiosInstance from "../../../utils/Axios";

const token = tokenLoader();

const LabSessionCreateModal = ({ open, handleClose, course_id }) => {
  const [formData, setFormData] = useState({
    name: "",
    course: course_id,
  });

  const onChangeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onCreateClick = async (event) => {
    event.preventDefault();
    const name = formData.name;
    const course = formData.course;

    if (name === "") {
      toast.error(`Name field cannot be empty`, {
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
        name: name,
        course: course,
      };
      try {
        const response = await axiosInstance.post(
          `/lab-session/courses/${course_id}/lab-sessions/create/`,
          createdData,
          {
            headers: {
              Authorization: "Token " + token,
            },
          }
        );
        if (response.status === 201) {
          toast.success("New Session Created Successfully", {
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
        toast.error(`Creating new session Failed: ${error}`, {
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
        <Modal.Title>Create New Lab Session</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={onCreateClick}>
          <Form.Group className="mb-3" controlId="formLabName">
            <Form.Control
              type="text"
              placeholder="Add Session Name"
              name="name"
              value={formData.name}
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

LabSessionCreateModal.propTypes = {
  course_id: PropTypes.number,
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};
export default LabSessionCreateModal;
