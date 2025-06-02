import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const Orders = () => {
  const { auth } = useContext(AuthContext);
  const token = auth?.token;

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [page, setPage] = useState(1);
  const limit = 5;

  const [totalPages, setTotalPages] = useState(1);

  const fetchOrders = async () => {
    if (!token) {
      setError("You must be logged in to view your orders.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:5000/api/orders/my-orders?page=${page}&limit=${limit}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setOrders(res.data.orders || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
      setError("Failed to fetch your orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [token, page]);

  if (loading) return <p className="text-center mt-10">Loading your orders...</p>;
  if (error) return <p className="text-center mt-10 text-red-600">{error}</p>;
  if (orders.length === 0) return <p className="text-center mt-10">You haven't placed any orders yet.</p>;

  return (
    <div className="max-w-6xl mx-auto mt-10 p-4 border rounded shadow">
      <h1 className="text-2xl font-bold mb-6">Your Orders</h1>

      <table className="w-full border-collapse mb-6">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2 border">#</th>
            <th className="p-2 border">Products</th>
            <th className="p-2 border">Total</th>
            <th className="p-2 border">Address</th>
            <th className="p-2 border">Status</th>
            <th className="p-2 border">Date</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order, idx) => (
            <tr key={order._id} className="hover:bg-gray-50">
              <td className="p-2 border">{(page - 1) * limit + idx + 1}</td>
              <td className="p-2 border">
                <ul className="list-disc ml-4">
                  {order.products.map((item) => (
                    <li key={item._id}>
                      {item.product.name} x {item.quantity}
                    </li>
                  ))}
                </ul>
              </td>
              <td className="p-2 border">₹{order.totalAmount}</td>
              <td className="p-2 border">{order.shippingAddress}</td>
              <td className="p-2 border">{order.status}</td>
              <td className="p-2 border">
                {new Date(order.createdAt).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="flex justify-center items-center gap-4 mt-4">
        <button
          onClick={() => setPage((prev) => Math.max(1, prev - 1))}
          disabled={page === 1}
          className="px-4 py-1 border rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
        >
          Prev
        </button>
        <span className="font-medium">
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
          disabled={page === totalPages}
          className="px-4 py-1 border rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Orders;
