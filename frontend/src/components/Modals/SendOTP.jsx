import React, { useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useState } from "react";
import Form from "react-bootstrap/Form";
import { PostApiCall } from "../../utils/Axios";
import { toast } from "react-toastify";
import Spinner from "react-bootstrap/Spinner";

const SendOTP = ({ showModal, handleCloseModal, orderId }) => {
  const [OTP, setOTP] = useState("");
  const [loading, setLoading] = useState(false);

  const confirmOTP = async () => {
    const response = await PostApiCall(`api/transfer/verifyOtp/${orderId}`, { otp: OTP });
    console.log(response);
    if (response.success) {
      toast.success("Validation Confirmed");
      // setQrData(null);
      handleCloseModal();
    } else {
      toast.error(response.message);
    }
  };

  useEffect(() => {
    const sendOPTToBackend = async () => {
      setLoading(true);
      const response = await PostApiCall(`api/transfer/sendOtp/${orderId}`, {});
      console.log(response);
      if (response.success) {
        toast.success("OTP Sent");
      }
      setLoading(false);
    };
    if (showModal) sendOPTToBackend();
  }, [showModal]);

  return (
    <Modal show={showModal} onHide={handleCloseModal}>
      <Modal.Header closeButton>
        <Modal.Title>Confirm OTP</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading ? (
          <div className="d-flex justify-content-center">
            <Spinner animation="border" />
          </div>
        ) : (
          <Form>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Enter OTP:</Form.Label>
              <Form.Control type="text" placeholder="Enter OTP" value={OTP} onChange={(e) => setOTP(e.target.value)} />
            </Form.Group>
          </Form>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={confirmOTP}>
          Confirm
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default SendOTP;
