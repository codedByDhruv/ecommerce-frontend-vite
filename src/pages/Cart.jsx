import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { Trash2 } from "lucide-react";

const Cart = () => {
  const { auth } = useContext(AuthContext);
  const token = auth?.token;

  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingIds, setUpdatingIds] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [shippingAddress, setShippingAddress] = useState("");
  const [placingOrder, setPlacingOrder] = useState(false);

  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [totalPages, setTotalPages] = useState(1);

  const fetchCart = async () => {
    if (!token) {
      setError("You must be logged in to view the cart.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const res = await axios.get(
        `http://localhost:5000/api/cart?page=${page}&limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCartItems(res.data.items || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      console.error("Failed to fetch cart:", err);
      setError("Failed to fetch cart items.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [token, page]);

  const deleteItem = async (productId) => {
    if (!window.confirm("Are you sure you want to remove this item?")) return;

    setUpdatingIds((ids) => [...ids, productId]);
    try {
      await axios.delete("http://localhost:5000/api/cart/remove", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: { productId },
      });

      setCartItems((items) =>
        items.filter((item) => item.product._id !== productId)
      );
    } catch (err) {
      alert("Failed to delete item.");
    } finally {
      setUpdatingIds((ids) => ids.filter((id) => id !== productId));
    }
  };

  const submitOrder = async () => {
    if (!shippingAddress.trim()) {
      alert("Please enter a shipping address.");
      return;
    }

    setPlacingOrder(true);
    try {
      const res = await axios.post(
        "http://localhost:5000/api/orders/place",
        { shippingAddress },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Order placed successfully!");
      setShowModal(false);
      setShippingAddress("");
      fetchCart(); // Refresh cart
    } catch (err) {
      console.error(err);
      alert("Failed to place order.");
    } finally {
      setPlacingOrder(false);
    }
  };

  if (loading) return <p className="text-center mt-10">Loading cart...</p>;
  if (error) return <p className="text-center mt-10 text-red-600">{error}</p>;
  if (cartItems.length === 0)
    return <p className="text-center mt-10">Your cart is empty.</p>;

  return (
    <div className="max-w-5xl mx-auto mt-10 p-4 border rounded shadow">
      <h1 className="text-2xl font-bold mb-6">Your Cart</h1>
      <table className="w-full border-collapse mb-6">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2 border">Image</th>
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Price</th>
            <th className="p-2 border">Quantity</th>
            <th className="p-2 border">Total</th>
            <th className="p-2 border">Action</th>
          </tr>
        </thead>
        <tbody>
          {cartItems.map((item) => {
            const product = item.product;
            const isUpdating = updatingIds.includes(product._id);

            return (
              <tr key={item._id} className="hover:bg-gray-50">
                <td className="p-2 border">
                  <img
                    src={`http://localhost:5000/${product.images?.[0].replace(/\\/g, "/")}`}
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                </td>
                <td className="p-2 border">{product.name}</td>
                <td className="p-2 border">₹{product.price}</td>
                <td className="p-2 border">{item.quantity}</td>
                <td className="p-2 border">₹{product.price * item.quantity}</td>
                <td className="p-2 border">
                  <Trash2
                    size={18}
                    className={`cursor-pointer text-red-600 ${
                      isUpdating ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    onClick={() => !isUpdating && deleteItem(product._id)}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="flex justify-center mt-6 gap-2">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Prev
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
          <button
            key={pg}
            onClick={() => setPage(pg)}
            className={`px-3 py-1 border rounded ${
              pg === page ? "bg-blue-600 text-white" : ""
            }`}
          >
            {pg}
          </button>
        ))}

        <button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

      <div className="text-right mt-6">
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-semibold"
        >
          Place Order
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Shipping Address</h2>
            <textarea
              rows="4"
              value={shippingAddress}
              onChange={(e) => setShippingAddress(e.target.value)}
              placeholder="Enter shipping address..."
              className="w-full border rounded p-2 mb-4"
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                onClick={submitOrder}
                disabled={placingOrder}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                {placingOrder ? "Placing..." : "Submit"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
