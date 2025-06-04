import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/products");
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 via-white to-pink-100 p-4">
      <div className="text-center max-w-2xl">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-4">
          Welcome to <span className="text-blue-600">MyStore</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-600 mb-6">
          Your favorite place to shop – discover products you’ll love!
        </p>
        <button onClick={handleClick} className="bg-blue-600 text-white px-6 py-3 rounded-2xl text-lg font-semibold shadow-lg hover:bg-blue-700 transition duration-300">
          Shop Now
        </button>

        <div className="mt-10 grid gap-6 grid-cols-1 sm:grid-cols-2">
          <div className="bg-white p-5 rounded-xl shadow-md hover:shadow-lg transition">
            <h3 className="text-xl font-bold text-gray-700 mb-2">
              Latest Arrivals
            </h3>
            <p className="text-gray-500">Check out our newest products.</p>
          </div>
          <div className="bg-white p-5 rounded-xl shadow-md hover:shadow-lg transition">
            <h3 className="text-xl font-bold text-gray-700 mb-2">Best Deals</h3>
            <p className="text-gray-500">Unbeatable prices every day.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Home;
