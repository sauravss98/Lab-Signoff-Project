import PropTypes from "prop-types";
import Modal from "react-bootstrap/Modal";

const UserItemModal = ({ open, handleClose, selectedRow }) => {
  /**
   * User Detail component
   */
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
      <Modal.Body>
        {selectedRow && (
          <>
            <p>
              <strong>ID:</strong> {selectedRow.id}
            </p>
            <p>
              <strong>First Name:</strong> {selectedRow.first_name}
            </p>
            <p>
              <strong>Last Name:</strong> {selectedRow.last_name}
            </p>
            <p>
              <strong>Email:</strong> {selectedRow.email}
            </p>
            <p>
              <strong>User Type:</strong> {selectedRow.user_type}
            </p>
          </>
        )}
      </Modal.Body>
    </Modal>
  );
};

UserItemModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  selectedRow: PropTypes.shape({
    id: PropTypes.number,
    first_name: PropTypes.string,
    last_name: PropTypes.string,
    email: PropTypes.string,
    user_type: PropTypes.string,
  }),
};

export default UserItemModal;
