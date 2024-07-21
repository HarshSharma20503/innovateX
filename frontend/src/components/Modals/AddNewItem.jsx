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
  const [submited, setSubmited] = useState(false);

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
    setLoading(false);
    if (response.success) {
      toast.success("Item added successfully");

      // handleClose();
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add New Item</Modal.Title>
      </Modal.Header>
      <Modal.Body>
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
      </Modal.Body>
      <Modal.Footer>
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
      </Modal.Footer>
    </Modal>
  );
}

export default AddNewItem;
