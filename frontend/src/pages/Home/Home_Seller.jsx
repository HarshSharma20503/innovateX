import { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import { useNavigate } from "react-router-dom";
import { GetApiCall } from "../../utils/Axios";
import AddNewItem from "../../components/Modals/AddNewItem";
import { toast } from "react-toastify";
import Spinner from "react-bootstrap/Spinner";

const Home_Seller = () => {
  // UserDetails
  const [userInfo, setUserInfo] = useState({});
  const [loading, setLoading] = useState(false);
  // Orders Usestate
  const [ordersQueue, setOrdersQueue] = useState([
    {
      id: 1,
      status: "Pending",
      itemName: "Item 1",
    },
  ]);
  const [ordersHistory, setOrdersHistory] = useState([
    {
      id: 1,
      status: "Delivered",
      itemName: "Item 1",
    },
  ]);

  // modal useStates
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const navigate = useNavigate();

  useEffect(() => {
    setUserInfo(JSON.parse(localStorage.getItem("userInfo")));
    const fetchOrders = async () => {
      setLoading(true);
      const data = await GetApiCall(`/api/order/showAll`);
      console.log(data);
      if (data.success) {
        const orders = data.data;
        const queuedOrders = orders.filter((order) => order.status === "pending" || order.status === "accepted");
        const historyOrders = orders.filter((order) => order.status === "delivered" || order.status === "cancelled");

        console.log(queuedOrders);
        console.log(historyOrders);
        setOrdersQueue(queuedOrders);
        setOrdersHistory(historyOrders);
        toast.success("Orders Fetched Succesfully"); // Display success message
      }
      console.log("setting loading false");
      setLoading(false);
    };
    fetchOrders();
  }, []);

  return (
    <>
      <AddNewItem show={show} handleClose={handleClose} />
      <div className="container">
        <h1 className="w-100 text-center text-white my-3">Welcome {userInfo.name}</h1>
        <div className="w-100">
          <button
            className="btn btn-primary"
            onClick={() => {
              handleShow();
            }}
          >
            Add New Item
          </button>
        </div>
        <div className="w-100 text-white my-3">
          <h2 className="w-100 text-white my-3">Orders List</h2>
          {!loading ? (
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>S.No.</th>
                  <th>Item Name</th>
                  <th>Status</th>
                  <th>View Item</th>
                </tr>
              </thead>
              <tbody>
                {ordersQueue.map((order, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{order.itemName}</td>
                    <td>{order.status}</td>
                    <td>
                      <button
                        className="btn btn-primary"
                        onClick={() => {
                          navigate(`/itemDetails/${order.id}`);
                        }}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <div className="w-100 text-center">
              <Spinner className="" animation="border" variant="light" />
            </div>
          )}
        </div>
        <div className="w-100 text-white my-3">
          <h2 className="w-100 text-white my-3">Orders History</h2>
          {!loading ? (
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>S.No.</th>
                  <th>Item Name</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {ordersHistory.map((order, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{order.itemName}</td>
                    <td>{order.status}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <div className="w-100 text-center">
              <Spinner className="" animation="border" variant="light" />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Home_Seller;
