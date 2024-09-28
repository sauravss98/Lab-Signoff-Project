import Modal from "react-bootstrap/Modal";
import PropTypes from "prop-types";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useState } from "react";
import "./CreateFeedbackModal.css";
import { tokenLoader } from "../../../utils/token";
import axiosInstance from "../../../utils/Axios";
import { Bounce, toast } from "react-toastify";

const token = tokenLoader();

const CreateFeedbackModal = ({ open, handleClose, labsession }) => {
  const [formData, setFormData] = useState({
    feedback: "",
    rating: 0,
  });

  const onCreateClick = async (event) => {
    event.preventDefault();
    console.log("clicked button");
    console.log("Feedback:", formData.feedback);
    console.log("Rating:", formData.rating);
    try {
      const data = {
        feedback: formData.feedback,
        rating: formData.rating,
      };
      const response = await axiosInstance.post(
        `/lab-session/lab-sessions/${labsession.lab_session}/feedback/`,
        data,
        {
          headers: {
            Authorization: "Token " + token,
          },
        }
      );
      if (response.status === 201) {
        toast.success("New Feedback Created Successfully", {
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
        setFormData({ feedback: "", rating: 0 });
      }
    } catch (error) {
      toast.error(`Creating feedback Failed: ${error}`, {
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

  const onChangeHandler = (rating) => {
    setFormData({ ...formData, rating });
  };

  const onExit = () => {
    setFormData({
      feedback: "",
      rating: 0,
    });
    handleClose();
  };

  return (
    <Modal
      show={open}
      onHide={onExit}
      centered
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
    >
      <Modal.Header closeButton>
        Create FeedBack for {labsession.lab_session_name}
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={onCreateClick}>
          <Form.Group className="mb-3" controlId="formfeedback">
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Add Feedback"
              name="feedback"
              value={formData.feedback}
              onChange={(e) =>
                setFormData({ ...formData, feedback: e.target.value })
              }
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formrating">
            <Form.Label>Rate the Session:</Form.Label>
            <div className="rating-buttons">
              {[1, 2, 3, 4, 5].map((rating) => (
                <Button
                  key={rating}
                  variant={
                    formData.rating === rating ? "primary" : "outline-secondary"
                  }
                  className="rounded-circle rating-button"
                  onClick={() => onChangeHandler(rating)}
                >
                  {rating}
                </Button>
              ))}
            </div>
          </Form.Group>

          <Button variant="dark" type="submit">
            Submit
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

CreateFeedbackModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  labsession: PropTypes.object.isRequired,
};

export default CreateFeedbackModal;
