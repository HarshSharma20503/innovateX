import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { toast } from "react-toastify";

const GetOTP = ({ showModal, handleCloseModal, fromEmail, setQrData }) => {
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

  useEffect(() => {
    // Fetch item details from backend
    const getOTPFromBackend = async () => {
      // const response = await GetApiCall(`/orders/getOrder/${id}`);
      // if (response.success) {
      //   setQTP(response.data);
      // }
    };
    getOTPFromBackend();
  }, []);

  return (
    <Modal show={showModal} onHide={handleCloseModal}>
      <Modal.Header closeButton>
        <Modal.Title>OTP Modal</Modal.Title>
      </Modal.Header>
      <Modal.Body>OTP: {QTP}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleConfirm}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default GetOTP;
