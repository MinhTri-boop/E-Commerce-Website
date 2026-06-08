import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { FaEye, FaStar, FaShoppingCart } from 'react-icons/fa';
import { CartContext } from '../../context/CartContext';
import { AuthContext } from '../../context/AuthContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useContext(CartContext) || { addToCart: () => {} };
  const { requireAuth } = useContext(AuthContext);

  const handleFavorite = (e) => {
    e.preventDefault();
    alert(`Added ${product.name} to favorites!`);
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    requireAuth(() => {
      addToCart(product, 1);
      alert(`Added ${product.name} to cart!`);
    });
  };

  return (
    <div className="item">
      <div className="thumb">
        <div className="hover-content">
          <ul>
            <li><Link to={`/product/${product.id}`}><FaEye /></Link></li>
            <li><button onClick={handleFavorite}><FaStar /></button></li>
            <li><button onClick={handleAddToCart}><FaShoppingCart /></button></li>
          </ul>
        </div>
        <img src={product.image} alt={product.name} />
      </div>
      <div className="down-content">
        <h4>{product.name}</h4>
        <span>${product.price.toFixed(2)}</span>
        <ul className="stars">
          {[...Array(5)].map((_, index) => (
            <li key={index} className={index >= product.rating ? 'empty' : ''}>
              <FaStar />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ProductCard;
