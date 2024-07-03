import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import PropTypes from "prop-types";
import axiosInstance from "../../utils/Axios";
import { tokenLoader } from "../../utils/token";

const token = tokenLoader();

const ProgramEditComponent = ({ open, handleClose, itemId }) => {
  const [programDetails, setProgramDetails] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (open && itemId) {
        try {
          const response = await axiosInstance.get(`programs/${itemId}`, {
            headers: {
              Authorization: "Token " + token,
            },
          });
          setProgramDetails(response.data);
        } catch (error) {
          console.error("Error fetching program details:", error);
        }
      }
    };
    fetchData();
  }, [open, itemId]);

  useEffect(() => {
    if (!open) {
      setProgramDetails(null); // Reset program details when modal is closed
    }
  }, [open]);

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
        {programDetails ? programDetails.program_name : "Loading..."}
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
