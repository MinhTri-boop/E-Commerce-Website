import { useContext } from 'react';
import { FaShoppingCart } from 'react-icons/fa';
import { CartContext } from '../../context/CartContext';

const CartIcon = () => {
  const { cartCount, toggleCart } = useContext(CartContext) || { cartCount: 0, toggleCart: () => {} };

  return (
    <button onClick={toggleCart} className="cart-icon-wrapper" style={{ background: 'none', border: 'none', padding: '0 15px', height: '40px' }}>
      <FaShoppingCart />
      {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
    </button>
  );
};

export default CartIcon;
