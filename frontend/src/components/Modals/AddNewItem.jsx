import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useState } from "react";
import Form from "react-bootstrap/Form";
import { PostApiCall } from "../../utils/Axios";
import { toast } from "react-toastify";
import Spinner from "react-bootstrap/Spinner";

function AddNewItem({ show, handleClose }) {
  const [formData, setFormData] = useState({
    itemName: "",
    imageUrl: "",
    sendTo: "",
  });
  const [loading, setLoading] = useState(false);
  const [qr, setQr] = useState(null);
  // "data:image/png;base64,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"

  const handleFileChange = async (e) => {
    const data = new FormData();
    data.append("picture", e.target.files[0]);
    console.log("Data: ", data);
    toast.info("Uploading your pic please wait upload confirmation..");
    const response = await PostApiCall("api/order/uploadPicture", data);
    console.log(response);
    if (response.success) {
      toast.success("Pic uploaded successfully");
      console.log("Pic url:", response.data);
      // setPic(response.data.data.url);
      setFormData(() => {
        return {
          ...formData,
          imageUrl: response.data.url,
        };
      });
    }
    // console.log(file);
  };

  const handleChange = (event) => {
    const { name, value, files } = event.target;
    if (name === "image") {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    console.log(formData);
    if (!formData.itemName || !formData.imageUrl || !formData.sendTo) {
      toast.error("Please fill all fields and select an image");
      setLoading(false);
      return;
    }
    const response = await PostApiCall("api/order/addOrder", formData);
    console.log(response);
    setLoading(false);
    if (response.success) {
      toast.success("Item added successfully");
      setQr(response.data.qrCode);
      // handleClose();
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add New Item</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {qr ? (
          <>
            <img src={`${qr}`} />
            <a href={`${qr}`} download="image.jpg">
              {" "}
              Download QR
            </a>
          </>
        ) : (
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formItemName">
              <Form.Label>Item Name</Form.Label>
              <Form.Control
                type="text"
                name="itemName"
                value={formData.itemName}
                onChange={handleChange}
                placeholder="Enter item name"
              />
            </Form.Group>

            <Form.Group controlId="sendToUser">
              <Form.Label>Send To Email</Form.Label>
              <Form.Control
                type="text"
                name="sendTo"
                value={formData.sendTo}
                onChange={handleChange}
                placeholder="Enter user email"
              />
            </Form.Group>
            <Form.Group controlId="formItemImage">
              <Form.Label>Image</Form.Label>
              <Form.Control type="file" name="image" onChange={handleFileChange} />
            </Form.Group>
          </Form>
        )}
      </Modal.Body>
      <Modal.Footer>
        {qr ? (
          <Button variant="primary" onClick={handleClose}>
            Close
          </Button>
        ) : (
          <>
            <Button variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="primary" disabled={loading} onClick={handleSubmit}>
              {loading ? (
                <div className="w-100 text-center">
                  <Spinner className="" animation="border" variant="light" />
                </div>
              ) : (
                "Add New Item"
              )}
            </Button>
          </>
        )}
      </Modal.Footer>
    </Modal>
  );
}

export default AddNewItem;
