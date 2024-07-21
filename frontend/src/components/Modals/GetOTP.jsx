import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { toast } from "react-toastify";
import { GetApiCall, PostApiCall } from "../../utils/Axios";
import { Spinner } from "react-bootstrap";

const GetOTP = ({ showModal, handleCloseModal, orderId }) => {
  const [QTP, setQTP] = useState("");
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    // const response = await PostApiCall(`/orders/confirmTransfer/${fromEmail}`, formData);
    // if (response.success) {
    toast.success("Validation Confirmed");
    // setQrData(null);
    handleCloseModal();
    // }
  };

  useEffect(() => {
    // Fetch item details from backend
    const getOTPFromBackend = async () => {
      setLoading(true);
      const response = await GetApiCall(`api/transfer/getOtp/${orderId}`);
      if (response.success) {
        console.log(response.data);
        setQTP(response.data.otp);
      }
      setLoading(false);
    };
    if (showModal) getOTPFromBackend();
  }, [showModal]);

  return (
    <Modal show={showModal} onHide={handleCloseModal}>
      <Modal.Header closeButton>
        <Modal.Title>OTP Modal</Modal.Title>
      </Modal.Header>
      {loading ? (
        <div className="w-100 my-1 text-center">
          <Spinner className="" animation="border" variant="primary" />
        </div>
      ) : (
        <Modal.Body>OTP: {QTP}</Modal.Body>
      )}

      <Modal.Footer>
        <Button variant="secondary" onClick={handleConfirm}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default GetOTP;
