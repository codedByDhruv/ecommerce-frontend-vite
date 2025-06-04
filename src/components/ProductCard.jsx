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

  const imageUrl = `http://localhost:5000/${product.images?.[0].replace(
    /\\/g,
    "/"
  )}`;

  const openModal = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    setQuantity(1);
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
        { headers: { Authorization: `Bearer ${token}` } }
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
      <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col">
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-48 object-cover"
        />
        <div className="p-4 flex flex-col flex-grow">
          <h2 className="text-lg font-semibold text-gray-800">
            {product.name}
          </h2>
          <p className="text-blue-600 text-sm mt-1 font-medium">
            ₹{product.price}
          </p>
          <p className="text-sm text-gray-500 mt-1 line-clamp-2">
            {product.description}
          </p>

          <div className="mt-auto flex gap-2 pt-4">
            <button
              onClick={openModal}
              className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition text-sm"
            >
              Add to Cart
            </button>
            <Link
              to={`/products/${product._id}`}
              className="flex-1 text-sm text-center bg-gray-100 py-2 rounded hover:bg-gray-200"
            >
              View
            </Link>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div
          className={`fixed inset-0 flex justify-center items-center z-50 px-4
       bg-opacity-30 backdrop-blur-sm
      transition-opacity duration-300
      ${showModal ? "opacity-100" : "opacity-0"}
    `}
          onClick={closeModal} // close modal on clicking outside inner box
        >
          <div
            className={`bg-white w-full max-w-md rounded-xl shadow-lg p-6
        transform transition-transform duration-300
        ${showModal ? "opacity-100 scale-100" : "opacity-0 scale-95"}
      `}
            onClick={(e) => e.stopPropagation()} // prevent closing modal when clicking inside
          >
            <h2 className="text-xl font-bold mb-4 text-blue-700">
              Add to Cart
            </h2>
            <div className="flex items-start gap-4 mb-4">
              <img
                src={imageUrl}
                alt={product.name}
                className="w-24 h-24 object-cover rounded"
              />
              <div className="flex-1">
                <h3 className="text-lg font-semibold">{product.name}</h3>
                <p className="text-sm text-gray-600">₹{product.price}</p>
                <p className="text-sm text-gray-500 mt-2 line-clamp-3">
                  {product.description}
                </p>
              </div>
            </div>

            <label className="block mb-4 text-sm font-medium text-gray-700">
              Quantity:
              <input
                type="number"
                min={1}
                max={product.qty}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="mt-1 w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {product.qty !== undefined && (
                <small className="text-gray-500">
                  Available stock: {product.qty}
                </small>
              )}
            </label>

            <div className="flex justify-end gap-3">
              <button
                onClick={closeModal}
                disabled={addingToCart}
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleAddToCart}
                disabled={addingToCart}
                className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white text-sm"
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
