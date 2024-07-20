import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import QrScanner from "react-qr-scanner";
import Button from "react-bootstrap/Button";
import { toast } from "react-toastify";

const ScanQR = ({ showModal, handleCloseModal, handleError, handleScan, qrData, fromEmail, setQrData }) => {
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
        <Button variant="secondary" onClick={handleConfirm}>
          Confirm
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ScanQR;
