import ProductCard from "../components/ProductCard";

const sampleProducts = [
  { id: 1, name: "Product 1", price: 499, image: "https://via.placeholder.com/150" },
  { id: 2, name: "Product 2", price: 999, image: "https://via.placeholder.com/150" },
];

const Products = () => (
  <div>
    <h1 className="text-2xl font-bold mb-4">All Products</h1>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {sampleProducts.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  </div>
);

export default Products;
