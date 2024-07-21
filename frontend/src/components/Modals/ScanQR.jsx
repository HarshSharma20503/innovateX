import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import QrScanner from "react-qr-scanner";
import Button from "react-bootstrap/Button";
import { toast } from "react-toastify";
import { PostApiCall } from "../../utils/Axios";
import { Spinner } from "react-bootstrap";

const ScanQR = ({ showModal, handleCloseModal, handleError, handleScan, qrData, orderId, setQrData }) => {
  const [loading, setLoading] = useState(false);
  const previewStyle = {
    height: 240,
    width: 320,
  };

  const handleConfirm = async () => {
    setLoading(true);
    const response = await PostApiCall(`api/transfer/confirm/${orderId}`, {});
    if (response.success) {
      toast.success("Delivery Confirmed");
      setQrData(null);
      handleCloseModal();
    }
    setLoading(false);
  };

  return (
    <Modal show={showModal} onHide={handleCloseModal}>
      <Modal.Header closeButton>
        <Modal.Title>Scan QR Code</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {qrData ? (
          <div>
            <h5>QR Code Data:</h5>
            <p>{qrData}</p>
          </div>
        ) : (
          <QrScanner delay={300} style={previewStyle} onError={handleError} onScan={handleScan} />
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" disabled={loading} onClick={handleConfirm}>
          {
            
          }
          Confirm
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ScanQR;
