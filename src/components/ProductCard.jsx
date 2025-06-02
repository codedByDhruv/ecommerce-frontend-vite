import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);
  const user = auth?.user;
  const token = auth?.token;

  const [showModal, setShowModal] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);

  const imageUrl = `http://localhost:5000/${product.images?.[0].replace(/\\/g, "/")}`;

  const openModal = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    setQuantity(1); // reset qty on open
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleAddToCart = async () => {
    if (quantity < 1) {
      alert("Quantity must be at least 1");
      return;
    }

    setAddingToCart(true);
    try {
      await axios.post(
        "http://localhost:5000/api/cart/add",
        { productId: product._id, quantity },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Product added to cart!");
      closeModal();
    } catch (error) {
      console.error("Add to cart failed:", error);
      alert("Failed to add product to cart.");
    } finally {
      setAddingToCart(false);
    }
  };

  return (
    <>
      <div className={`border rounded-lg p-4 shadow hover:shadow-lg flex flex-col ${showModal ? "blur-sm" : ""}`}>
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-40 object-cover mb-2 rounded"
        />
        <h2 className="text-lg font-bold">{product.name}</h2>
        <p className="text-gray-600 mb-2">₹{product.price}</p>

        <div className="mt-auto flex gap-2">
          <button
            onClick={openModal}
            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
          >
            Add to Cart
          </button>
          <Link
            to={`/products/${product._id}`}
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 text-sm text-center"
          >
            View
          </Link>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Add to Cart</h2>
            <div className="flex gap-4 mb-4">
              <img
                src={imageUrl}
                alt={product.name}
                className="w-24 h-24 object-cover rounded"
              />
              <div>
                <h3 className="font-semibold">{product.name}</h3>
                <p className="text-gray-600">₹{product.price}</p>
                <p className="text-sm mt-2">{product.description}</p>
              </div>
            </div>

            <label className="block mb-2 font-medium">
              Quantity:
              <input
                type="number"
                min={1}
                max={product.qty} // assuming product.qty is stock quantity
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="border rounded w-full mt-1 p-2"
              />
              {product.qty !== undefined && (
                <small className="text-gray-500">
                  Available stock: {product.qty}
                </small>
              )}
            </label>

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={closeModal}
                disabled={addingToCart}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleAddToCart}
                disabled={addingToCart}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                {addingToCart ? "Adding..." : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductCard;
