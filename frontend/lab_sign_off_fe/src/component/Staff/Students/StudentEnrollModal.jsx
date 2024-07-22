import { useState, useEffect } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import axiosInstance from "../../../utils/Axios";
import { toast, Bounce } from "react-toastify";
import { tokenLoader } from "../../../utils/token";
import PropTypes from "prop-types";

const token = tokenLoader();

const StudentEnrollModal = ({ show, handleClose, studentId }) => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axiosInstance.get(
          `/lab-session/dropdown/courses/available/${studentId}/`,
          {
            headers: {
              Authorization: "Token " + token,
            },
          }
        );
        setCourses(response.data);
      } catch (error) {
        toast.error("Error fetching courses", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });
      }
    };

    if (show) {
      fetchCourses();
    }
  }, [show, studentId]);

  const handleEnroll = async () => {
    try {
      const data = {
        course: selectedCourse,
        student: studentId,
      };
      const response = await axiosInstance.post(
        `lab-session/courses/${selectedCourse}/enrollments/create/`,
        data,
        {
          headers: {
            Authorization: "Token " + token,
          },
        }
      );
      if (response.status === 201) {
        toast.success("Student Enrolled to Course Successfully", {
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
        setSelectedCourse("");
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
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Enroll Student in New Course</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="courseSelect">
            <Form.Label>Select Course</Form.Label>
            <Form.Control
              as="select"
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
            >
              <option value="">Select a course...</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.course_name}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="dark" onClick={handleEnroll}>
          Enroll
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

// StudentEnrollModal.propTypes = {
//   studentId: PropTypes.number.isRequired,
//   show: PropTypes.boolean.isRequired,
//   handleClose: PropTypes.func.isRequired,
// };
StudentEnrollModal.propTypes = {
  studentId: PropTypes.number.isRequired,
  show: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default StudentEnrollModal;
