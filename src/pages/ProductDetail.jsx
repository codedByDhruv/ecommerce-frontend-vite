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

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const openModal = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    setQuantity(1); // reset quantity on open
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

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!product) return <p className="text-center mt-10">Product not found.</p>;

  const imageUrl = `http://localhost:5000/${product.images?.[0].replace(/\\/g, "/")}`;

  return (
    <>
      <div className={`max-w-xl mx-auto mt-10 p-4 border rounded shadow ${showModal ? "blur-sm" : ""}`}>
        <button
          onClick={() => navigate(-1)}
          className="mb-4 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
        >
          &larr; Back
        </button>

        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-64 object-cover rounded mb-4"
        />
        <h2 className="text-2xl font-bold mb-2">{product.name}</h2>
        <p className="text-gray-600 mb-1">Category: {product.category?.name}</p>
        <p className="text-gray-800 font-semibold text-lg mb-2">₹{product.price}</p>
        <p className="text-gray-600">{product.description}</p>

        <button
          onClick={openModal}
          className="mt-6 px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
        >
          Add to Cart
        </button>
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
                max={product.qty || 1000} // fallback max if qty not provided
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
                disabled={adding}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleAddToCart}
                disabled={adding}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
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
