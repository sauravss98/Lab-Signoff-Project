import { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import PropTypes from "prop-types";
import { useParams } from "react-router-dom";
import axiosInstance from "../../../utils/Axios";
import { tokenLoader } from "../../../utils/token";

const token = tokenLoader();

const RequestCreateModal = ({ open, handleClose, sessionId }) => {
  const { course_id } = useParams();
  const [formData, setFormData] = useState({
    text: "",
    student_lab_session: sessionId,
    staff: [],
  });

  const onChangeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    const fetchStaffData = async () => {
      try {
        const response = await axiosInstance.get(
          `courses/courses/${course_id}/staff/`,
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );
        console.log("Staff data:", response.data); // Debugging
        const staffIds = response.data.map((staff) => staff.id);
        setFormData((prevFormData) => ({
          ...prevFormData,
          staff: staffIds,
        }));
      } catch (error) {
        console.error("Error fetching staff data:", error);
      }
    };

    fetchStaffData();
  }, [course_id]);

  const onCreateClick = async (event) => {
    event.preventDefault();
    console.log("Form data:", formData); // Debugging
    // Add your form submission logic here
  };

  useEffect(() => {
    console.log("Modal sessionId:", sessionId); // Debugging
    setFormData((prevFormData) => ({
      ...prevFormData,
      student_lab_session: sessionId,
    }));
  }, [sessionId]);

  return (
    <Modal
      show={open}
      onHide={handleClose}
      centered
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
    >
      <Modal.Header closeButton>
        <Modal.Title>
          Create New Request for course: {course_id} session: {sessionId}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={onCreateClick}>
          <Form.Group className="mb-3" controlId="formRequestText">
            <Form.Control
              type="text"
              placeholder="Enter Request Text"
              name="text"
              value={formData.text}
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

RequestCreateModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  sessionId: PropTypes.number,
};

export default RequestCreateModal;
