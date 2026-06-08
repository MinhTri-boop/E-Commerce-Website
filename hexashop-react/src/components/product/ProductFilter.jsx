import { useContext } from 'react';
import { SearchContext } from '../../context/SearchContext';
const categories = [
  { id: 'all', name: 'All Categories' },
  { id: 'men', name: 'Men' },
  { id: 'women', name: 'Women' },
  { id: 'kids', name: 'Kids' },
  { id: 'accessories', name: 'Accessories' }
];

const ProductFilter = () => {
  const { 
    selectedCategory, 
    setSelectedCategory, 
    priceRange, 
    setPriceRange, 
    sortBy, 
    setSortBy 
  } = useContext(SearchContext);

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const handlePriceChange = (e) => {
    setPriceRange({ ...priceRange, max: parseInt(e.target.value) });
  };

  return (
    <div className="filter-sidebar">
      <div className="filter-section">
        <h4>Category</h4>
        <ul>
          {categories.map((cat) => (
            <li key={cat.id}>
              <label>
                <input
                  type="radio"
                  name="category"
                  value={cat.id}
                  checked={selectedCategory === cat.id}
                  onChange={handleCategoryChange}
                />
                {cat.name}
              </label>
            </li>
          ))}
        </ul>
      </div>

      <div className="filter-section">
        <h4>Max Price</h4>
        <div className="price-range-wrapper">
          <input
            type="range"
            min="0"
            max="500"
            step="10"
            value={priceRange.max}
            onChange={handlePriceChange}
          />
          <div className="price-range-labels">
            <span>$0</span>
            <span>${priceRange.max}</span>
          </div>
        </div>
      </div>

      <div className="filter-section d-block d-lg-none mt-30">
        <h4>Sort By</h4>
        <select 
          className="sort-select" 
          value={sortBy} 
          onChange={(e) => setSortBy(e.target.value)}
          style={{ width: '100%' }}
        >
          <option value="default">Default Sorting</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="name-asc">Name: A to Z</option>
          <option value="name-desc">Name: Z to A</option>
          <option value="rating-desc">Top Rated</option>
        </select>
      </div>
    </div>
  );
};

export default ProductFilter;
