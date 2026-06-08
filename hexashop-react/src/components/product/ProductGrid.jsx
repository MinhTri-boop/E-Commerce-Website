import ProductCard from './ProductCard';

const ProductGrid = ({ products }) => {
  if (!products || products.length === 0) {
    return (
      <div className="col-12 text-center" style={{ padding: '40px 0', color: '#a1a1a1' }}>
        <p>No products found matching your criteria.</p>
      </div>
    );
  }

  return (
    <div className="row">
      {products.map((product) => (
        <div className="col-lg-4" key={product.id}>
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  );
};

export default ProductGrid;
