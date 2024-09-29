import { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import PropTypes from "prop-types";
import axiosInstance from "../../utils/Axios";
import { tokenLoader } from "../../utils/token";
import { Bounce, toast } from "react-toastify";
import Select from "react-select";

const token = tokenLoader();

const CoursesEditComponent = ({ open, handleClose, courseId }) => {
  /**
   * Course Edit modal
   */
  const [programs, setPrograms] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedPrograms, setSelectedPrograms] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [formData, setFormData] = useState({
    course_name: "",
  });

  useEffect(() => {
    if (courseId) {
      const fetchCourseData = async () => {
        try {
          const response = await axiosInstance.get(`/courses/${courseId}/`, {
            headers: {
              Authorization: "Token " + token,
            },
          });
          console.log(response);
          const { course_name, programs, staff } = response.data;

          setFormData({ course_name });
          setSelectedPrograms(
            programs.map((program) => ({
              value: program.id,
              label: program.program_name,
            }))
          );
          setSelectedUsers(
            staff.map((user) => ({
              value: user.id,
              label: user.first_name + " " + user.last_name,
            }))
          );
        } catch (error) {
          toast.error("Failed to load course data", { transition: Bounce });
        }
      };
      fetchCourseData();
    }
  }, [courseId]);

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const programsResponse = await axiosInstance.get(
          "programs/dropdown/programs/",
          {
            headers: {
              Authorization: "Token " + token,
            },
          }
        );
        setPrograms(programsResponse.data);
      } catch (error) {
        toast.error("Failed to fetch programs", { transition: Bounce });
      }
    };
    fetchPrograms();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersResponse = await axiosInstance.get("users/dropdown/user", {
          headers: {
            Authorization: "Token " + token,
          },
        });
        setUsers(usersResponse.data);
      } catch (error) {
        toast.error("Failed to fetch users", { transition: Bounce });
      }
    };
    fetchUsers();
  }, []);

  const handleProgramsChange = (selectedOptions) => {
    setSelectedPrograms(selectedOptions);
  };

  const handleUsersChange = (selectedOptions) => {
    setSelectedUsers(selectedOptions);
  };

  const programOptions = programs.map((program) => ({
    value: program.id,
    label: program.program_name,
  }));

  const userOptions = users.map((user) => ({
    value: user.id,
    label: user.first_name + " " + user.last_name,
  }));

  const onChangeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSaveClick = async (event) => {
    event.preventDefault();
    const course_name = formData.course_name;
    const staff_ids = selectedUsers.map((value) => value.value).join(",");
    const programs_ids = selectedPrograms.map((value) => value.value).join(",");

    if (course_name === "") {
      toast.error(`Course name cannot be empty`, {
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
      return;
    }

    const updatedData = {
      course_name,
      staff_ids,
      programs_ids,
    };

    try {
      const response = await axiosInstance.put(
        `/courses/update/${courseId}/`,
        updatedData,
        {
          headers: {
            Authorization: "Token " + token,
          },
        }
      );

      if (response.status === 200) {
        toast.success("Course updated successfully", {
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
      console.error(error);
      toast.error(`Updating course failed: ${error}`, {
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
        <Modal.Title>Edit Course</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={onSaveClick}>
          <Form.Control
            type="text"
            placeholder="Edit Course Name"
            name="course_name"
            value={formData.course_name}
            onChange={onChangeHandler}
            required
          />
          <Form.Group className="mb-3" controlId="formPrograms">
            <Form.Label>Select Programs</Form.Label>
            <Select
              isMulti
              options={programOptions}
              value={selectedPrograms}
              onChange={handleProgramsChange}
              placeholder="Select programs..."
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formUsers">
            <Form.Label>Select Users</Form.Label>
            <Select
              isMulti
              options={userOptions}
              value={selectedUsers}
              onChange={handleUsersChange}
              placeholder="Select users..."
            />
          </Form.Group>
          <Button variant="dark" type="submit">
            Save Changes
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

CoursesEditComponent.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  courseId: PropTypes.number.isRequired,
};

export default CoursesEditComponent;
