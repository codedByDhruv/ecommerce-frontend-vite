import { Link } from "react-router-dom";

const ProductCard = ({ product }) => (
  <div className="border rounded-lg p-4 shadow hover:shadow-lg">
    <img src={product.image} alt={product.name} className="w-full h-40 object-cover mb-2" />
    <h2 className="text-lg font-bold">{product.name}</h2>
    <p className="text-gray-600">₹{product.price}</p>
    <Link
      to={`/products/${product.id}`}
      className="mt-2 inline-block text-blue-600 hover:underline"
    >
      View Details
    </Link>
  </div>
);

export default ProductCard;
