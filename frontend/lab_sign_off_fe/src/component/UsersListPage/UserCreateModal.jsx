import Modal from "react-bootstrap/Modal";
import PropTypes from "prop-types";

const UserCreateModal = ({ open, handleClose }) => {
  return (
    <Modal
      show={open}
      onHide={handleClose}
      centered
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
    >
      <Modal.Header closeButton>
        <Modal.Title>User Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>Form</Modal.Body>
    </Modal>
  );
};

UserCreateModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default UserCreateModal;
