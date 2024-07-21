import React, { useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useState } from "react";
import Form from "react-bootstrap/Form";
import { PostApiCall } from "../../utils/Axios";
import { toast } from "react-toastify";
import Spinner from "react-bootstrap/Spinner";

const SendOTP = ({ showModal, handleCloseModal, fromEmail }) => {
  const [OTP, setOTP] = useState("");
  const [loading, setLoading] = useState(false);

  const confirmOTP = async () => {
    // const response = await PostApiCall(`/orders/confirmTransfer/${fromEmail}`, OTP);
    // if (response.success) {
    toast.success("Validation Confirmed");
    // setQrData(null);
    // handleCloseModal();
    // }
  };

  useEffect(() => {
    const sendOPTToBackend = async () => {
      setLoading(true);
      // const response = await PostApiCall(`/orders/sendOTP/${fromEmail}`);
      // if (response.success) {
      //   setOTP(response.data);
      //   toast.success("OTP Sent");
      // }
      setLoading(false);
    };
    sendOPTToBackend();
  }, []);

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
