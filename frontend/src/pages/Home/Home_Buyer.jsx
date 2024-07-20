import { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import { useNavigate } from "react-router-dom";
import { GetApiCall } from "../../utils/Axios";

const Home_Buyer = () => {
  const [userInfo, setUserInfo] = useState({});
  const [loading, setLoading] = useState(false);
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

  const navigate = useNavigate();

  useEffect(() => {
    setUserInfo(JSON.parse(localStorage.getItem("userInfo")));
    const fetchOrders = async () => {
      setLoading(true);
      const data = await GetApiCall(`/api/orders/${JSON.parse(localStorage.getItem("userInfo")).id}`);
      if (data.success) {
        const orders = data.data;
        const queuedOrders = orders.filter((order) => order.status === "Pending" || order.status === "Initiated");
        const historyOrders = orders.filter((order) => order.status === "Delivered" || order.status === "Cancelled");
        setOrdersQueue(queuedOrders);
        setOrdersHistory(historyOrders);
        toast.success("Orders Fetched Succesfully"); // Display success message
      }
      setLoading(false);
    };
    // fetchOrders();
  }, []);

  return (
    <div className="container">
      <h1 className="w-100 text-center text-white my-3">Welcome {userInfo.name}</h1>
      <div className="w-100 text-white my-3">
        <h2 w-100 text-white my-3>
          Orders List
        </h2>
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
              <tr key={order.id}>
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
      </div>
      <div className="w-100 text-white my-3">
        <h2 w-100 text-white my-3>
          Orders History
        </h2>
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
              <tr key={order.id}>
                <td>{index + 1}</td>
                <td>{order.itemName}</td>
                <td>{order.status}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default Home_Buyer;
