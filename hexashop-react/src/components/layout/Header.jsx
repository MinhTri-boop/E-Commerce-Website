import { useState, useEffect, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import CartIcon from '../cart/CartIcon';
import UserMenu from '../auth/UserMenu';
import { SearchContext } from '../../context/SearchContext';

const Header = () => {
  const [isSticky, setIsSticky] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { toggleSearch } = useContext(SearchContext) || { toggleSearch: () => {} };

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const handleNavClick = (e, targetHash) => {
    if (location.pathname !== '/') {
      e.preventDefault();
      navigate(`/${targetHash}`);
    }
  };

  const isActive = (path, hash) => {
    if (hash) {
      return location.hash === hash ? 'active' : '';
    }
    return location.pathname === path && !location.hash ? 'active' : '';
  };

  return (
    <header className={`header-area ${isSticky ? 'background-header' : ''}`}>
      <div className="container">
        <div className="row">
          <div className="col-12">
            <nav className="main-nav">
              <Link to="/" className="logo">
                <img src="/images/logo.png" alt="HexaShop" />
              </Link>

              <ul className={`nav ${isMobileMenuOpen ? 'active' : ''}`}>
                <li><Link to="/" className={isActive('/', '')}>Home</Link></li>
                <li><a href="#men" onClick={(e) => handleNavClick(e, '#men')} className={isActive('/', '#men')}>Men's</a></li>
                <li><a href="#women" onClick={(e) => handleNavClick(e, '#women')} className={isActive('/', '#women')}>Women's</a></li>
                <li><a href="#kids" onClick={(e) => handleNavClick(e, '#kids')} className={isActive('/', '#kids')}>Kid's</a></li>
                <li className="submenu">
                  <a href="#">Pages</a>
                  <ul>
                    <li><Link to="/about">About Us</Link></li>
                    <li><Link to="/products">Products</Link></li>
                    <li><Link to="/product/4">Single Product</Link></li>
                    <li><Link to="/contact">Contact Us</Link></li>
                  </ul>
                </li>
                <li><a href="#explore" onClick={(e) => handleNavClick(e, '#explore')} className={isActive('/', '#explore')}>Explore</a></li>
                <li>
                  <button onClick={toggleSearch} className="search-btn" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0 15px', color: '#2a2a2a', height: '40px', display: 'flex', alignItems: 'center' }}>
                    <FaSearch />
                  </button>
                </li>
                <li><CartIcon /></li>
                <li><UserMenu /></li>
              </ul>

              <button 
                className={`menu-trigger ${isMobileMenuOpen ? 'active' : ''}`}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <span></span>
              </button>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
