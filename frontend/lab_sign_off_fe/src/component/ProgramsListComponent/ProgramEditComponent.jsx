import { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import PropTypes from "prop-types";
import axiosInstance from "../../utils/Axios";
import { tokenLoader } from "../../utils/token";
import { Bounce, toast } from "react-toastify";

const token = tokenLoader();

const ProgramEditComponent = ({ open, handleClose, itemId }) => {
  /**
   * Component for program edit modal
   */
  const [formData, setFormData] = useState({
    program_name: "",
    program_lenght: 0,
  });

  const onChangeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    const fetchData = async () => {
      if (open && itemId) {
        try {
          const response = await axiosInstance.get(`programs/${itemId}`, {
            headers: {
              Authorization: "Token " + token,
            },
          });
          const { program_name, program_lenght } = response.data;
          setFormData({ program_name, program_lenght });
        } catch (error) {
          console.error("Error fetching program details:", error);
        }
      }
    };
    fetchData();
  }, [open, itemId]);

  useEffect(() => {
    if (!open) {
      setFormData({
        program_name: "",
        program_lenght: 0,
      });
    }
  }, [open]);

  const onEditClick = async (event) => {
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
      const editedData = {
        program_name: program_name,
        program_lenght: program_lenght,
      };
      try {
        const response = await axiosInstance.patch(
          `programs/update/${itemId}/`,
          editedData,
          {
            headers: {
              Authorization: "Token " + token,
            },
          }
        );
        if (response.status === 200) {
          toast.success("Program Edited Successfully", {
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
        toast.error(`Editing Failed: ${error}`, {
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
        <Modal.Title>Program Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={onEditClick}>
          <Form.Group className="mb-3" controlId="formProgramName">
            <Form.Label>Program Name</Form.Label>
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
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

ProgramEditComponent.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  itemId: PropTypes.number,
};

export default ProgramEditComponent;
