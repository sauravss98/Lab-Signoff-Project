import { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import PropTypes from "prop-types";
import { useParams } from "react-router-dom";
import axiosInstance from "../../../utils/Axios";
import { tokenLoader } from "../../../utils/token";
import { Bounce, toast } from "react-toastify";

const token = tokenLoader();

const RequestCreateModal = ({ open, handleClose, sessionId }) => {
  const { course_id } = useParams();
  const [formData, setFormData] = useState({
    text: "",
    student_lab_session: null,
    staff: [],
    file: null,
  });

  const resetForm = () => {
    setFormData({
      text: "",
      student_lab_session: null,
      staff: [],
      file: null,
    });
  };

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const onFileChangeHandler = (e) => {
    setFormData((prev) => ({
      ...prev,
      file: e.target.files[0],
    }));
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
        const staffIds = response.data.map((staff) => staff.id);
        setFormData((prevFormData) => ({
          ...prevFormData,
          staff: staffIds,
        }));
      } catch (error) {
        console.error("Error fetching staff data:", error);
      }
    };

    if (open) {
      fetchStaffData();
      setFormData((prevFormData) => ({
        ...prevFormData,
        student_lab_session: sessionId,
        text: "",
      }));
    }
  }, [course_id, open, sessionId]);

  const onCreateClick = async (event) => {
    event.preventDefault();
    const formDataToSend = new FormData();
    formDataToSend.append("text", formData.text);
    formDataToSend.append("student_lab_session", formData.student_lab_session);
    formDataToSend.append("staff", JSON.stringify(formData.staff));

    if (formData.file) {
      formDataToSend.append("file", formData.file);
    }

    try {
      const response = await axiosInstance.post(
        `requests/create/`,
        formDataToSend,
        {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 201) {
        toast.success("New Request Created Successfully", {
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
        resetForm();
      }
    } catch (error) {
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
  };

  const onModalClose = () => {
    resetForm();
    handleClose();
  };

  return (
    <Modal
      show={open}
      onHide={onModalClose}
      centered
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
    >
      <Modal.Header closeButton>
        <Modal.Title>Create New Request</Modal.Title>
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

          <Form.Group className="mb-3" controlId="formFileUpload">
            <Form.Label>Optional File Upload</Form.Label>
            <Form.Control
              type="file"
              name="file"
              onChange={onFileChangeHandler}
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
