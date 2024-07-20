import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useState } from "react";
import Form from "react-bootstrap/Form";
import { PostApiCall } from "../../utils/Axios";
import { toast } from "react-toastify";
import Spinner from "react-bootstrap/Spinner";

const SendOTP = () => {
  const [OTP, setOTP] = useState("1234");

  const confirmOTP = async () => {
    // const response = await PostApiCall(`/orders/confirmTransfer/${fromEmail}`, OTP);
    // if (response.success) {
    toast.success("Validation Confirmed");
    // setQrData(null);
    // handleCloseModal();
    // }
  };

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

export default SendOTP;
