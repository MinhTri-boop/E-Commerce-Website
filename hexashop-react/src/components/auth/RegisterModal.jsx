import { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { FaTimes } from 'react-icons/fa';

const RegisterModal = ({ isOpen, onClose, onSwitchToLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { register, error } = useContext(AuthContext);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (register(name, email, password)) {
      setName('');
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
        <h2>Sign Up</h2>
        <p>Create a new account</p>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="register-name">Full Name</label>
            <input 
              type="text" 
              id="register-name" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              required 
            />
          </div>
          <div className="form-group">
            <label htmlFor="register-email">Email Address</label>
            <input 
              type="email" 
              id="register-email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>
          <div className="form-group">
            <label htmlFor="register-password">Password</label>
            <input 
              type="password" 
              id="register-password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
              minLength={6}
            />
          </div>
          <button type="submit" className="auth-submit-btn">
            Sign Up
          </button>
        </form>

        <div className="auth-switch">
          Already have an account? <button onClick={onSwitchToLogin}>Sign In</button>
        </div>
      </div>
    </div>
  );
};

export default RegisterModal;
