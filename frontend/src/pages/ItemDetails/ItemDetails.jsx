import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Table from "react-bootstrap/Table";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/esm/Button";
import ScanQR from "../../components/Modals/ScanQR";
import Spinner from "react-bootstrap/esm/Spinner";
import GetOTP from "../../components/Modals/GetOTP";

const ItemDetails = () => {
  const { id } = useParams();
  const [showModal, setShowModal] = useState(false);
  const [showQTPModal, setShowOTPModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [qrData, setQrData] = useState(null);
  const [itemDetails, setItemDetails] = useState({
    itemName: "Sprash ka condom",
    from: "sparshgaandu@gmail.com",
    to: "harshsharma20503@gmail.com",
    imgUrl: "https://hentai.tv/wp-content/uploads/2024/07/rc1269302package.jpg",
    // imgUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOGEX8nxBnr3oM6TRZ4qiXyIRYUH2iiedLzA&s",
  });

  const handleScan = (data) => {
    if (data) {
      setQrData(data.text);
      console.log(data.text);
    }
  };

  const handleError = (err) => {
    console.error(err);
  };

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleShowOTPModal = () => setShowOTPModal(true);
  const handleCloseOTPModal = () => setShowOTPModal(false);

  useEffect(() => {
    // Fetch item details from backend
    const getItemDetails = async () => {
      // const response = await GetApiCall(`/orders/getOrder/${id}`);
      // if (response.success) {
      //   setItemDetails(response.data);
      // }
    };
    getItemDetails();
  }, []);

  return (
    <>
      <ScanQR
        handleError={handleError}
        handleCloseModal={handleCloseModal}
        showModal={showModal}
        handleScan={handleScan}
        qrData={qrData}
        fromEmail={itemDetails.from}
        setQrData={setQrData}
      />
      <GetOTP
        showModal={showQTPModal}
        handleCloseModal={handleCloseOTPModal}
        fromEmail={itemDetails.from}
        setQrData={setQrData}
      />
      <div className="container my-4">
        {/* Items Details */}
        <Card className="mb-4" style={{ borderRadius: "15px", backgroundColor: "#f8f9fa" }}>
          <Card.Header as="h5">Item Details</Card.Header>
          <Card.Body>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Iteam Name</td>
                  <td>{itemDetails.itemName}</td>
                </tr>
                <tr>
                  <td>From</td>
                  <td>{itemDetails.from}</td>
                </tr>
                <tr>
                  <td>To</td>
                  <td>{itemDetails.to}</td>
                </tr>
                <tr>
                  <td>Image</td>
                  <td>
                    <img src={itemDetails.imgUrl} />
                  </td>
                </tr>
              </tbody>
            </Table>
          </Card.Body>
        </Card>

        {/* Actions */}
        <Card className="mb-4 p-0" style={{ borderRadius: "15px", backgroundColor: "#f8f9fa" }}>
          <Card.Header as="h5">Actions you need to take</Card.Header>
          <Card.Body>
            <div className="container d-flex justify-content-around m-0">
              <Card className="text-center w-100 mx-0">
                <Card.Header as="h6">Recieve Item from</Card.Header>
                <Table striped bordered hover responsive="sm">
                  <tbody>
                    <tr>
                      <td>From</td>
                      <td>{itemDetails.from}</td>
                    </tr>
                    <tr>
                      <td>To</td>
                      <td>{itemDetails.to}</td>
                    </tr>
                    <tr>
                      <td>Confirm Your Identity</td>
                      <td>
                        <Button variant="primary" onClick={handleShowOTPModal}>
                          Get Otp
                        </Button>
                      </td>
                    </tr>
                    <tr>
                      <td>Validate Item</td>
                      <td>
                        <Button variant="primary" onClick={handleShowModal}>
                          Scan
                        </Button>
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </Card>
              <Card className="text-center w-100 me-0">
                <Card.Header as="h6">Give Item To</Card.Header>

                <Table striped bordered hover responsive="sm">
                  <tbody>
                    <tr>
                      <td>From</td>
                      <td>{itemDetails.from}</td>
                    </tr>
                    <tr>
                      <td>To</td>
                      <td>{itemDetails.to}</td>
                    </tr>
                    <tr>
                      <td>Confirm Reciever Identity</td>
                      <td>
                        <Button variant="primary">Send Otp</Button>
                      </td>
                    </tr>
                    <tr>
                      <td>Confirm item sent</td>
                      <td>
                        <Button variant="primary">Confirm</Button>
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </Card>
            </div>
          </Card.Body>
        </Card>

        {/* Track Order */}
        <Card className="mb-4" style={{ borderRadius: "15px", backgroundColor: "#f8f9fa" }}>
          <Card.Header as="h5">Track Order</Card.Header>
          <Card.Body className="m-0">
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>From</th>
                  <th>To</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Attribute 1</td>
                  <td>Detail 1</td>
                </tr>
                <tr>
                  <td>Attribute 2</td>
                  <td>Detail 2</td>
                </tr>
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      </div>
    </>
  );
};

export default ItemDetails;
