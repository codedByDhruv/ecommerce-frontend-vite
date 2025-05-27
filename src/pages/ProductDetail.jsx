import { useParams } from "react-router-dom";

const ProductDetail = () => {
  const { id } = useParams();
  return (
    <div className="max-w-xl mx-auto mt-10">
      <img src="https://via.placeholder.com/300" alt="Product" className="w-full mb-4" />
      <h2 className="text-2xl font-bold">Product {id}</h2>
      <p className="text-gray-600 mt-2">This is a great product with lots of details.</p>
      <button className="mt-4 bg-blue-600 text-white px-4 py-2">Add to Cart</button>
    </div>
  );
};

export default ProductDetail;
