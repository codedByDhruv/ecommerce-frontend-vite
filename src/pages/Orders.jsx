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
      const res = await axios.get(
        `http://localhost:5000/api/orders/my-orders?page=${page}&limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
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

  if (loading)
    return (
      <p className="text-center mt-10 text-lg text-gray-600">
        Loading your orders...
      </p>
    );
  if (error)
    return (
      <p className="text-center mt-10 text-red-600 font-medium">{error}</p>
    );
  if (orders.length === 0)
    return (
      <p className="text-center mt-10 text-gray-500 font-medium">
        You haven't placed any orders yet.
      </p>
    );

  return (
    <div className="max-w-6xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow-md">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Your Orders</h1>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm border rounded-xl overflow-hidden">
          <thead className="bg-gray-100 text-xs uppercase text-gray-600">
            <tr>
              <th className="p-3 text-left">#</th>
              <th className="p-3 text-left">Products</th>
              <th className="p-3 text-left">Total</th>
              <th className="p-3 text-left">Address</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Date</th>
            </tr>
          </thead>
          <tbody className="bg-white text-gray-800">
            {orders.map((order, idx) => (
              <tr
                key={order._id}
                className="border-t hover:bg-gray-50 transition"
              >
                <td className="p-3">{(page - 1) * limit + idx + 1}</td>
                <td className="p-3">
                  <ul className="list-disc ml-5">
                    {order.products.map((item) => (
                      <li key={item._id}>
                        {item.product.name} x {item.quantity}
                      </li>
                    ))}
                  </ul>
                </td>
                <td className="p-3 font-semibold">₹{order.totalAmount}</td>
                <td className="p-3">{order.shippingAddress}</td>
                <td className="p-3">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold text-white ${
                      order.status === "Pending"
                        ? "bg-yellow-500"
                        : order.status === "Shipped"
                        ? "bg-blue-600"
                        : order.status === "Delivered"
                        ? "bg-green-600"
                        : "bg-gray-500"
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="p-3">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-8 gap-3 flex-wrap">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className="px-5 py-2 border rounded-xl text-sm hover:bg-gray-100 disabled:opacity-50"
        >
          Prev
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
          <button
            key={pg}
            onClick={() => setPage(pg)}
            className={`px-5 py-2 rounded-xl text-sm border ${
              pg === page
                ? "bg-blue-600 text-white font-semibold"
                : "hover:bg-gray-100"
            }`}
          >
            {pg}
          </button>
        ))}
        <button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages}
          className="px-5 py-2 border rounded-xl text-sm hover:bg-gray-100 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Orders;
