import { useState, useContext, useEffect, useRef } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { FaUser, FaSignInAlt } from 'react-icons/fa';
import LoginModal from './LoginModal';
import RegisterModal from './RegisterModal';

const UserMenu = () => {
  const { 
    user, 
    isAuthenticated, 
    logout,
    isLoginModalOpen,
    setLoginModalOpen,
    isRegisterModalOpen,
    setRegisterModalOpen
  } = useContext(AuthContext);
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  const openLogin = () => {
    setRegisterModalOpen(false);
    setIsMenuOpen(false);
    setLoginModalOpen(true);
  };

  const openRegister = () => {
    setLoginModalOpen(false);
    setIsMenuOpen(false);
    setRegisterModalOpen(true);
  };

  return (
    <div className="user-menu-wrapper" ref={menuRef} style={{ marginLeft: '10px' }}>
      {!isAuthenticated ? (
        <button className="user-menu-trigger" onClick={openLogin}>
          <FaSignInAlt />
          <span style={{ display: 'none' }} className="d-md-inline">Sign In</span>
        </button>
      ) : (
        <button className="user-menu-trigger" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <FaUser />
          <span style={{ display: 'none' }} className="d-md-inline">{user?.name}</span>
        </button>
      )}

      {isAuthenticated && (
        <ul className={`user-menu-dropdown ${isMenuOpen ? 'active' : ''}`}>
          <li><a href="#">My Account</a></li>
          <li><a href="#">Orders</a></li>
          <li><button onClick={handleLogout}>Sign Out</button></li>
        </ul>
      )}

      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setLoginModalOpen(false)} 
        onSwitchToRegister={openRegister} 
      />
      
      <RegisterModal 
        isOpen={isRegisterModalOpen} 
        onClose={() => setRegisterModalOpen(false)} 
        onSwitchToLogin={openLogin} 
      />
    </div>
  );
};

export default UserMenu;
