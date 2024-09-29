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

const CourseCreateComponent = ({ open, handleClose }) => {
  /**
   * Course Create Modal
   */
  const [programs, setPrograms] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedPrograms, setSelectedPrograms] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [formData, setFormData] = useState({
    course_name: "",
  });

  const onChangeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    const fetchData = async () => {
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
    fetchData();
  }, []);

  const handleProgramsChange = (selectedOptions) => {
    setSelectedPrograms(selectedOptions);
  };

  const programOptions = programs.map((program) => ({
    value: program.id,
    label: program.program_name,
  }));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersResponse = await axiosInstance.get("users/dropdown/user", {
          headers: {
            Authorization: "Token " + token,
          },
        });
        setUsers(usersResponse.data);
      } catch (error) {
        toast.error("Failed to fetch programs", { transition: Bounce });
      }
    };
    fetchData();
  }, []);

  const handleUsersChange = (selectedOptions) => {
    setSelectedUsers(selectedOptions);
  };

  const userOptions = users.map((user) => ({
    value: user.id,
    label: user.first_name + " " + user.last_name,
  }));

  const onCreateClick = async (event) => {
    event.preventDefault();
    const course_name = formData.course_name;
    const staff_ids = selectedUsers.map((value) => value.value).join(",");
    const programs_ids = selectedPrograms.map((value) => value.value).join(",");

    if (course_name === "") {
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
        course_name: course_name,
        staff_ids: staff_ids,
        programs_ids: programs_ids,
      };
      try {
        const response = await axiosInstance.post(
          "/courses/create/",
          createdData,
          {
            headers: {
              Authorization: "Token " + token,
            },
          }
        );
        console.log(response.status);
        if (response.status === 201 || response.status === 200) {
          toast.success("New Course Created Successfully", {
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
          setFormData({ course_name: "" });
          setSelectedPrograms([]);
          setSelectedUsers([]);
        }
      } catch (error) {
        console.log(error);
        toast.error(`Creating new course failed: ${error}`, {
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
        <Modal.Title>Create New Course</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={onCreateClick}>
          <Form.Control
            type="text"
            placeholder="Add Course Name"
            name="course_name"
            value={formData.course_name}
            onChange={onChangeHandler}
            required
          />
          <Form.Group className="mb-3" controlId="formCourseData">
            <Form.Label>Select Programs</Form.Label>
            <Select
              isMulti
              options={programOptions}
              value={selectedPrograms}
              onChange={handleProgramsChange}
              placeholder="Select programs..."
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formUserData">
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
            Submit
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

CourseCreateComponent.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default CourseCreateComponent;
