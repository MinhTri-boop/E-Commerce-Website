import { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { FaTimes } from 'react-icons/fa';

const LoginModal = ({ isOpen, onClose, onSwitchToRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, error } = useContext(AuthContext);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (login(email, password)) {
      setEmail('');
      setPassword('');
      onClose();
    }
  };

  return (
    <div className={`auth-modal-overlay ${isOpen ? 'active' : ''}`} onClick={onClose}>
      <div className="auth-modal" onClick={e => e.stopPropagation()}>
        <button className="auth-close" onClick={onClose}>
          <FaTimes />
        </button>
        <h2>Sign In</h2>
        <p>Welcome back to Hexashop</p>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="login-email">Email Address</label>
            <input 
              type="email" 
              id="login-email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>
          <div className="form-group">
            <label htmlFor="login-password">Password</label>
            <input 
              type="password" 
              id="login-password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>
          <button type="submit" className="auth-submit-btn">
            Sign In
          </button>
        </form>

        <div className="auth-switch">
          Don't have an account? <button onClick={onSwitchToRegister}>Sign Up</button>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
