import { useState, useContext, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaStar, FaQuoteLeft, FaShoppingCart } from 'react-icons/fa';
import axiosClient from '../api/axiosClient';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';

const SingleProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useContext(CartContext);
  const { requireAuth } = useContext(AuthContext);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axiosClient.get(`/products/${id}`);
        setProduct(response.data);
      } catch (err) {
        console.error('Failed to fetch product details', err);
        navigate('/products');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, navigate]);

  if (loading) {
    return <div className="container" style={{ padding: '100px 0', textAlign: 'center' }}>Loading product details...</div>;
  }

  if (!product) return null;

  const handleQuantityChange = (type) => {
    if (type === 'inc') {
      setQuantity(prev => prev + 1);
    } else if (type === 'dec' && quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleAddToCart = () => {
    requireAuth(() => {
      addToCart(product, quantity);
      alert(`Added ${quantity} ${product.name}(s) to cart!`);
    });
  };

  return (
    <>
      <div className="page-heading" id="top">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="inner-content">
                <h2>Single Product Page</h2>
                <span>Awesome &amp; Creative HTML CSS layout by TemplateMo</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="section" id="product">
        <div className="container">
          <div className="row">
            <div className="col-lg-8">
              <div className="left-images">
                {product.images && product.images.length > 0 ? (
                  product.images.map((img, idx) => (
                    <img key={idx} src={img} alt={`${product.name} ${idx + 1}`} />
                  ))
                ) : (
                  <img src={product.image} alt={product.name} />
                )}
              </div>
            </div>
            <div className="col-lg-4">
              <div className="right-content">
                <h4>{product.name}</h4>
                <span className="price">${product.price.toFixed(2)}</span>
                <ul className="stars">
                  {[...Array(5)].map((_, index) => (
                    <li key={index} className={index >= product.rating ? 'empty' : ''}>
                      <FaStar />
                    </li>
                  ))}
                </ul>
                <span>{product.description}</span>
                <div className="quote">
                  <FaQuoteLeft />
                  <p>{product.quote}</p>
                </div>
                <div className="quantity-content">
                  <div className="left-content">
                    <h6>No. of Orders</h6>
                  </div>
                  <div className="right-content">
                    <div className="quantity buttons_added">
                      <input type="button" value="-" className="minus" onClick={() => handleQuantityChange('dec')} />
                      <input 
                        type="number" 
                        step="1" 
                        min="1" 
                        max="" 
                        name="quantity" 
                        value={quantity} 
                        title="Qty" 
                        className="input-text qty text" 
                        size="4" 
                        pattern="" 
                        inputMode="" 
                        readOnly
                      />
                      <input type="button" value="+" className="plus" onClick={() => handleQuantityChange('inc')} />
                    </div>
                  </div>
                </div>
                <div className="total">
                  <h4>Total: ${(product.price * quantity).toFixed(2)}</h4>
                  <div className="main-border-button">
                    <button onClick={handleAddToCart} style={{ 
                      background: 'transparent', 
                      border: '1px solid #2a2a2a', 
                      padding: '12px 25px', 
                      fontSize: '13px',
                      fontWeight: '500',
                      transition: 'all .3s',
                      cursor: 'pointer'
                    }}>
                      Add To Cart
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default SingleProductPage;
