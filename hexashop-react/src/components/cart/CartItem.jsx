import { useContext } from 'react';
import { FaTrash } from 'react-icons/fa';
import { CartContext } from '../../context/CartContext';

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useContext(CartContext);
  const { product, quantity } = item;

  return (
    <div className="cart-item">
      <img src={product.image} alt={product.name} />
      <div className="cart-item-info">
        <h4>{product.name}</h4>
        <div className="cart-item-price">${product.price.toFixed(2)} x {quantity} = ${(product.price * quantity).toFixed(2)}</div>
        <div className="cart-item-actions">
          <button onClick={() => updateQuantity(product.id, quantity - 1)}>-</button>
          <span>{quantity}</span>
          <button onClick={() => updateQuantity(product.id, quantity + 1)}>+</button>
          <button className="cart-item-remove" onClick={() => removeFromCart(product.id)}>
            <FaTrash />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
