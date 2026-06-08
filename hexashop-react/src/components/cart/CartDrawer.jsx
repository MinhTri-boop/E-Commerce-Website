import { useContext } from 'react';
import { FaTimes, FaShoppingCart } from 'react-icons/fa';
import { CartContext } from '../../context/CartContext';
import CartItem from './CartItem';
import { Link } from 'react-router-dom';

const CartDrawer = () => {
  const { cartItems, cartTotal, isCartOpen, closeCart } = useContext(CartContext) || { cartItems: [], cartTotal: 0, isCartOpen: false, closeCart: () => {} };

  return (
    <>
      <div 
        className={`cart-overlay ${isCartOpen ? 'active' : ''}`} 
        onClick={closeCart}
      ></div>
      <div className={`cart-drawer ${isCartOpen ? 'active' : ''}`}>
        <div className="cart-drawer-header">
          <h3>Shopping Cart</h3>
          <button className="cart-drawer-close" onClick={closeCart}>
            <FaTimes />
          </button>
        </div>
        
        <div className="cart-drawer-body">
          {cartItems.length === 0 ? (
            <div className="cart-empty">
              <FaShoppingCart />
              <p>Your cart is empty.</p>
              <button 
                onClick={closeCart} 
                className="main-dark-button" 
                style={{ marginTop: '20px' }}
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            cartItems.map((item) => (
              <CartItem key={item.product.id} item={item} />
            ))
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="cart-drawer-footer">
            <div className="cart-total">
              <span>Total:</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
            <button className="cart-checkout-btn">
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
