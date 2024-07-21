import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { toast } from "react-toastify";

const ConfirmDelivery = ({ showModal, handleCloseModal, fromEmail }) => {
  const [QTP, setQTP] = useState("1234");
  const previewStyle = {
    height: 240,
    width: 320,
  };

  const handleConfirm = async () => {
    // const response = await PostApiCall(`/orders/confirmTransfer/${fromEmail}`, formData);
    // if (response.success) {
    toast.success("Validation Confirmed");
    setQrData(null);
    handleCloseModal();
    // }
  };

  return (
    <Modal show={showModal} onHide={handleCloseModal}>
      <Modal.Header closeButton>
        <Modal.Title>Confirm Your Choice</Modal.Title>
      </Modal.Header>
      <Modal.Body>Are you Sure you Want to Confirm Delivery</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCloseModal}>
          Cancel
        </Button>
        <Button variant="secondary" onClick={handleConfirm}>
          Confirm
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmDelivery;
