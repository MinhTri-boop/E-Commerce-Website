import { useState, useContext, useEffect, useRef } from 'react';
import { SearchContext } from '../../context/SearchContext';
import { FaSearch, FaTimes } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';

const SearchBar = () => {
  const { isSearchOpen, toggleSearch, setSearchQuery } = useContext(SearchContext) || { isSearchOpen: false, toggleSearch: () => {}, setSearchQuery: () => {} };
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isSearchOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isSearchOpen]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(inputValue);
      if (inputValue.trim() && location.pathname !== '/products') {
        navigate('/products');
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [inputValue, setSearchQuery, navigate, location.pathname]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSearchQuery(inputValue);
    if (location.pathname !== '/products') {
      navigate('/products');
    }
    toggleSearch();
  };

  return (
    <div className={`search-overlay ${isSearchOpen ? 'active' : ''}`}>
      <div className="container">
        <form className="search-input-wrapper" onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            type="text"
            placeholder="Search products..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <button type="submit">
            <FaSearch />
          </button>
          <button type="button" className="search-close-btn" onClick={toggleSearch}>
            <FaTimes />
          </button>
        </form>
      </div>
    </div>
  );
};

export default SearchBar;
