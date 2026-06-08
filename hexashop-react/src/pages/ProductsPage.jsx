import { useContext, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ProductGrid from '../components/product/ProductGrid';
import ProductFilter from '../components/product/ProductFilter';
import Pagination from '../components/product/Pagination';
import { SearchContext } from '../context/SearchContext';

const ProductsPage = () => {
  const { 
    filteredProducts, 
    setSelectedCategory, 
    currentPage, 
    setCurrentPage, 
    totalPages,
    isLoading
  } = useContext(SearchContext);
  
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const category = params.get('category');
    if (category) {
      setSelectedCategory(category);
    }
  }, [location, setSelectedCategory]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <div className="page-heading" id="top">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="inner-content">
                <h2>Check Our Products</h2>
                <span>Awesome &amp; Creative HTML CSS layout by TemplateMo</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="section" id="products">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="section-heading text-center">
                <h2>Our Latest Products</h2>
                <span>Check out all of our products.</span>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-3">
              <ProductFilter />
            </div>
            <div className="col-lg-9">
              <div className="row">
                <div className="col-lg-12 mb-4 d-none d-lg-block">
                  <div className="d-flex justify-content-between align-items-center">
                    <p>Page {currentPage} of {totalPages}</p>
                    <ProductFilterSortOnly />
                  </div>
                </div>
                {isLoading ? (
                  <div className="col-12 text-center" style={{ padding: '40px 0' }}>Loading products...</div>
                ) : (
                  <>
                    <ProductGrid products={filteredProducts} />
                    <Pagination 
                      currentPage={currentPage} 
                      totalPages={totalPages} 
                      onPageChange={handlePageChange} 
                    />
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

const ProductFilterSortOnly = () => {
  const { sortBy, setSortBy } = useContext(SearchContext);
  return (
    <select 
      className="sort-select" 
      value={sortBy} 
      onChange={(e) => setSortBy(e.target.value)}
    >
      <option value="default">Default Sorting</option>
      <option value="price-asc">Price: Low to High</option>
      <option value="price-desc">Price: High to Low</option>
      <option value="name-asc">Name: A to Z</option>
      <option value="name-desc">Name: Z to A</option>
      <option value="rating-desc">Top Rated</option>
    </select>
  );
};

export default ProductsPage;
