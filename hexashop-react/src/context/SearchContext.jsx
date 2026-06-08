import React, { createContext, useState, useEffect, useMemo } from 'react';
import axiosClient from '../api/axiosClient';

export const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 500 });
  const [sortBy, setSortBy] = useState('default');
  
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const toggleSearch = () => setIsSearchOpen(!isSearchOpen);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const params = {
          search: searchQuery || undefined,
          category: selectedCategory === 'all' ? undefined : selectedCategory,
          minPrice: priceRange.min,
          maxPrice: priceRange.max,
          sortBy: sortBy !== 'default' ? sortBy : undefined,
          page: currentPage,
          limit: 9
        };

        // Clean up undefined params
        Object.keys(params).forEach(key => params[key] === undefined && delete params[key]);

        const response = await axiosClient.get('/products', { params });
        setFilteredProducts(response.data.products);
        setTotalPages(response.data.pagination.totalPages);
        setCurrentPage(response.data.pagination.currentPage);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [searchQuery, selectedCategory, priceRange, sortBy, currentPage]);

  const value = useMemo(
    () => ({
      searchQuery,
      setSearchQuery,
      selectedCategory,
      setSelectedCategory,
      priceRange,
      setPriceRange,
      sortBy,
      setSortBy,
      filteredProducts,
      currentPage,
      setCurrentPage,
      totalPages,
      isLoading,
      isSearchOpen,
      toggleSearch,
    }),
    [
      searchQuery,
      selectedCategory,
      priceRange,
      sortBy,
      filteredProducts,
      currentPage,
      totalPages,
      isLoading,
      isSearchOpen
    ]
  );

  return (
    <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
  );
};
