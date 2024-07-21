import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Table from "react-bootstrap/Table";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/esm/Button";
import ScanQR from "../../components/Modals/ScanQR";
import Spinner from "react-bootstrap/esm/Spinner";
import GetOTP from "../../components/Modals/GetOTP";
import SendOTP from "../../components/Modals/SendOTP";
import { GetApiCall } from "../../utils/Axios";
// import ConfirmDelivery from "../../components/Modals/ConfirmDelivery";

const ItemDetails = () => {
  const { id } = useParams();

  const [userInfo, setUserInfo] = useState(JSON.parse(localStorage.getItem("userInfo")));

  const [showModal, setShowModal] = useState(false);
  const [showQTPModal, setShowOTPModal] = useState(false);
  const [showSendOTPModal, setShowSendOTPModal] = useState(false);
  // const [showConfirmDeliveryModal, setShowConfirmDeliveryModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [qrData, setQrData] = useState(null);
  const [itemDetails, setItemDetails] = useState({
    itemName: "",
    from: "",
    to: "",
    imgUrl: "",
  });
  const [orderStatus, setOrderStatus] = useState();
  const [trackRecord, setTrackRecord] = useState([]);

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

  const handleShowSendOTPModal = () => setShowSendOTPModal(true);
  const handleCloseSendOTPModal = () => setShowSendOTPModal(false);

  useEffect(() => {
    // Fetch item details from backend
    const getItemDetails = async () => {
      console.log("fetching item details");
      setLoading(true);
      const response = await GetApiCall(`api/order/orderDetails/${id}`);
      console.log(response);
      if (response.success) {
        setItemDetails(response.data.orderInfo);
        setOrderStatus(response.data.order_user_status);
        setTrackRecord(response.data.trackRecord);
      }
      setLoading(false);
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
        // fromEmail={itemDetails.from}
        orderId={id}
        setQrData={setQrData}
      />
      <GetOTP
        showModal={showQTPModal}
        handleCloseModal={handleCloseOTPModal}
        // fromEmail={itemDetails.from}
        orderId={id}
      />
      <SendOTP
        showModal={showSendOTPModal}
        handleCloseModal={handleCloseSendOTPModal}
        orderId={id}
        // fromEmail={itemDetails.from}
      />
      {/* <ConfirmDelivery
        showModal={showConfirmDeliveryModal}
        handleCloseModal={handleCloseConfirmDeliveryModal}
        fromEmail={itemDetails.from}
      /> */}
      <div className="container my-4">
        {/* Items Details */}
        <Card className="mb-4" style={{ borderRadius: "15px", backgroundColor: "#f8f9fa" }}>
          <Card.Header as="h5">Item Details</Card.Header>
          {loading ? (
            <div className="w-100 my-4 text-center">
              <Spinner className="" animation="border" variant="primary" />
            </div>
          ) : (
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
                      <img src={itemDetails.imgUrl} className="img-fluid" />
                    </td>
                  </tr>
                </tbody>
              </Table>
            </Card.Body>
          )}
        </Card>

        {/* Actions */}
        <Card className="mb-4 p-0" style={{ borderRadius: "15px", backgroundColor: "#f8f9fa" }}>
          <Card.Header as="h5">Actions you need to take</Card.Header>
          {loading ? (
            <div className="w-100 my-4 text-center">
              <Spinner className="" animation="border" variant="primary" />
            </div>
          ) : (
            <Card.Body>
              <div className="container d-flex justify-content-around m-0">
                {(userInfo.userType == "Middle" || userInfo.userType == "Buyer") && (
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
                )}
                {(userInfo.userType == "Middle" || userInfo.userType == "Seller") && (
                  <Card className="text-center w-100 me-0">
                    <Card.Header as="h6">Give Item To</Card.Header>

                    <Table striped bordered hover responsive="md">
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
                            <Button variant="primary" onClick={handleShowSendOTPModal}>
                              Send Otp
                            </Button>
                          </td>
                        </tr>
                        <tr>
                          <td>Delivery Status</td>
                          <td>pending</td>
                        </tr>
                      </tbody>
                    </Table>
                  </Card>
                )}
              </div>
            </Card.Body>
          )}
        </Card>

        {/* Track Order */}
        {userInfo.userType != "middle" && (
          <Card className="mb-4" style={{ borderRadius: "15px", backgroundColor: "#f8f9fa" }}>
            <Card.Header as="h5">Track Order</Card.Header>
            {loading ? (
              <div className="w-100 my-4 text-center">
                <Spinner className="" animation="border" variant="primary" />
              </div>
            ) : (
              <Card.Body className="m-0">
                <Table striped bordered hover responsive="sm">
                  <thead>
                    <tr>
                      <th>Persons</th>
                      <th>Email</th>
                    </tr>
                  </thead>
                  <tbody>
                    {trackRecord.map((record, index) => (
                      <tr key={record.id}>
                        <td>{record.name}</td>
                        <td>{record.email}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            )}
          </Card>
        )}
      </div>
    </>
  );
};

export default ItemDetails;
