import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { tokenLoader } from "../../../utils/token";
import axiosInstance from "../../../utils/Axios";
import Button from "react-bootstrap/Button"; // Fixed import path
import { Bounce, toast } from "react-toastify";

const token = tokenLoader();

const LabSessionEditModal = ({ show, onHide, sessionId }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const onChangeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get(
          `/lab-session/lab-sessions/${sessionId}/`,
          {
            headers: {
              Authorization: "Token " + token,
            },
          }
        );
        setFormData({
          name: response.data.name,
          description: response.data.description,
        });
      } catch (error) {
        console.log(error);
      }
    };

    if (show && sessionId) {
      // Added sessionId check
      fetchData();
    }
  }, [show, sessionId]);

  const onEditClick = async (event) => {
    event.preventDefault();
    const { name, description } = formData;
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
      try {
        const response = await axiosInstance.patch(
          `/lab-session/lab-sessions/${sessionId}/update/`,
          {
            name,
            description,
          },
          {
            headers: {
              Authorization: "Token " + token,
            },
          }
        );
        if (response.status === 200) {
          toast.success("Lab Session Edited Successfully", {
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
          onHide();
          setFormData({ name: "", description: "" });
        }
      } catch (error) {
        toast.error(`Editing Lab Session Failed: ${error}`, {
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

  const handleHide = () => {
    setFormData({ name: "", description: "" }); // Reset form data
    onHide(); // Call the parent onHide function
  };

  return (
    <Modal
      show={show}
      onHide={handleHide} // Use the new hide handler
      centered
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
    >
      <Modal.Header closeButton>
        <Modal.Title>Edit Lab Session: {sessionId}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={onEditClick}>
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
          <Form.Group className="mb-3" controlId="formLabDescription">
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Add Session Description"
              name="description"
              value={formData.description}
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

LabSessionEditModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  sessionId: PropTypes.number,
};

export default LabSessionEditModal;
