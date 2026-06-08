import { useContext } from 'react';
import { SearchContext } from '../context/SearchContext';

const useProducts = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useProducts must be used within a SearchProvider');
  }
  return context;
};

export default useProducts;
