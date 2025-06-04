import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);
  const user = auth?.user;
  const token = auth?.token;

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/products/${id}`);
        setProduct(res.data);
      } catch (error) {
        console.error("Failed to fetch product:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const openModal = () => {
    if (!user) return navigate("/login");
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

    setAdding(true);
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
      setAdding(false);
    }
  };

  if (loading)
    return <p className="text-center mt-10 text-gray-600">Loading...</p>;
  if (!product)
    return (
      <p className="text-center mt-10 text-gray-600">Product not found.</p>
    );

  const imageUrl = `http://localhost:5000/${product.images?.[0].replace(
    /\\/g,
    "/"
  )}`;

  return (
    <>
      <div
        className={`max-w-4xl mx-auto p-4 sm:p-6 md:p-8 mt-8 bg-white rounded-xl shadow-md ${
          showModal ? "blur-sm" : ""
        }`}
      >
        <button
          onClick={() => navigate(-1)}
          className="mb-4 text-sm px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded"
        >
          ← Back
        </button>

        <div className="grid md:grid-cols-2 gap-6">
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-64 object-cover rounded-xl"
          />

          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {product.name}
            </h2>
            <p className="text-sm text-gray-500 mb-1">
              Category:{" "}
              <span className="text-gray-700">{product.category?.name}</span>
            </p>
            <p className="text-lg text-blue-600 font-semibold mb-4">
              ₹{product.price}
            </p>
            <p className="text-gray-600 mb-6">{product.description}</p>

            <button
              onClick={openModal}
              className="w-full sm:w-auto px-6 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white font-medium transition"
            >
              Add to Cart
            </button>
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
          onClick={closeModal} // close when clicking outside modal
        >
          <div
            className={`bg-white w-full max-w-md rounded-xl shadow-xl p-6
        transform transition-transform duration-300
        ${showModal ? "opacity-100 scale-100" : "opacity-0 scale-95"}
      `}
            onClick={(e) => e.stopPropagation()} // prevent close on clicking inside modal
          >
            <h2 className="text-xl font-bold mb-4 text-blue-700">
              Add to Cart
            </h2>
            <div className="flex gap-4 mb-4">
              <img
                src={imageUrl}
                alt={product.name}
                className="w-24 h-24 object-cover rounded"
              />
              <div>
                <h3 className="text-md font-semibold">{product.name}</h3>
                <p className="text-gray-600 text-sm">₹{product.price}</p>
                <p className="text-xs text-gray-500 mt-2 line-clamp-3">
                  {product.description}
                </p>
              </div>
            </div>

            <label className="block text-sm font-medium mb-2 text-gray-700">
              Quantity:
              <input
                type="number"
                min={1}
                max={product.qty || 1000}
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

            <div className="flex justify-end mt-6 gap-3">
              <button
                onClick={closeModal}
                disabled={adding}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleAddToCart}
                disabled={adding}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm"
              >
                {adding ? "Adding..." : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductDetail;
