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
  const [deleteConfirmProduct, setDeleteConfirmProduct] = useState(null);

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
    setUpdatingIds((ids) => [...ids, productId]);

    try {
      await axios.delete("http://localhost:5000/api/cart/remove", {
        headers: { Authorization: `Bearer ${token}` },
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
      await axios.post(
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
      fetchCart();
    } catch (err) {
      console.error(err);
      alert("Failed to place order.");
    } finally {
      setPlacingOrder(false);
    }
  };

  if (loading)
    return <p className="text-center mt-10 text-lg">Loading cart...</p>;
  if (error) return <p className="text-center mt-10 text-red-600">{error}</p>;
  if (cartItems.length === 0)
    return (
      <p className="text-center mt-10 text-gray-500">Your cart is empty.</p>
    );

  return (
    <div className="max-w-6xl mx-auto mt-10 p-4 md:p-6 bg-white rounded-2xl shadow-md">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Your Cart</h1>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm border rounded-xl overflow-hidden">
          <thead className="bg-gray-100 text-xs uppercase text-gray-600">
            <tr>
              <th className="p-3 text-left">Image</th>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Price</th>
              <th className="p-3 text-left">Quantity</th>
              <th className="p-3 text-left">Total</th>
              <th className="p-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white text-gray-800">
            {cartItems.map((item) => {
              const product = item.product;
              const isUpdating = updatingIds.includes(product._id);
              return (
                <tr key={item._id} className="border-t hover:bg-gray-50">
                  <td className="p-3">
                    <img
                      src={`http://localhost:5000/${product.images?.[0].replace(
                        /\\/g,
                        "/"
                      )}`}
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                  </td>
                  <td className="p-3">{product.name}</td>
                  <td className="p-3">₹{product.price}</td>
                  <td className="p-3">{item.quantity}</td>
                  <td className="p-3 font-semibold">
                    ₹{product.price * item.quantity}
                  </td>
                  <td className="p-3 text-center">
                    <Trash2
                      size={20}
                      className={`mx-auto cursor-pointer text-red-500 hover:text-red-700 transition ${
                        isUpdating ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                      onClick={() =>
                        !isUpdating && setDeleteConfirmProduct(product)
                      }
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center mt-8 gap-2 flex-wrap">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className="px-4 py-2 border rounded-xl text-sm hover:bg-gray-100 disabled:opacity-50"
        >
          Prev
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
          <button
            key={pg}
            onClick={() => setPage(pg)}
            className={`px-4 py-2 rounded-xl text-sm border ${
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
          className="px-4 py-2 border rounded-xl text-sm hover:bg-gray-100 disabled:opacity-50"
        >
          Next
        </button>
      </div>

      <div className="text-right mt-10">
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium shadow transition"
        >
          Place Order
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div
          className={`fixed inset-0 flex justify-center items-center z-50 px-4
       bg-opacity-30 backdrop-blur-sm
      transition-opacity duration-300
      ${showModal ? "opacity-100" : "opacity-0"}
    `}
          onClick={() => setShowModal(false)} // close on clicking outside
        >
          <div
            className={`bg-white p-6 rounded-xl shadow-lg w-full max-w-md
        transform transition-transform duration-300
        ${showModal ? "opacity-100 scale-100" : "opacity-0 scale-95"}
      `}
            onClick={(e) => e.stopPropagation()} // prevent closing modal when clicking inside
          >
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Shipping Address
            </h2>
            <textarea
              rows="4"
              value={shippingAddress}
              onChange={(e) => setShippingAddress(e.target.value)}
              placeholder="Enter shipping address..."
              className="w-full border rounded-lg p-3 text-sm mb-4 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-sm bg-gray-200 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={submitOrder}
                disabled={placingOrder}
                className="px-4 py-2 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 transition"
              >
                {placingOrder ? "Placing..." : "Submit"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmProduct && (
        <div
          className="fixed inset-0 flex justify-center items-center z-50 px-4 bg-opacity-30 backdrop-blur-sm transition-opacity duration-300 opacity-100"
          onClick={() => setDeleteConfirmProduct(null)} // close modal on outside click
        >
          <div
            className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md
                 transform transition-transform duration-300 opacity-100 scale-100"
            onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside modal
          >
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Confirm Delete
            </h2>
            <p className="mb-6">
              Are you sure you want to remove{" "}
              <strong>{deleteConfirmProduct.name}</strong> from your cart?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteConfirmProduct(null)}
                className="px-4 py-2 text-sm bg-gray-200 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteItem(deleteConfirmProduct._id);
                  setDeleteConfirmProduct(null);
                }}
                className="px-4 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
