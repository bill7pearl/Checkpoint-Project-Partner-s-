import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiFilter, FiX } from 'react-icons/fi';
import ProductCard from '../components/ui/ProductCard';
import { productService } from '../services/productService';
import './Products.css';

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [pagination, setPagination] = useState({ totalPages: 1, currentPage: 1 });

  // Filter state
  const currentCategory = searchParams.get('category') || '';
  const currentBrand = searchParams.get('brand') || '';
  const currentSort = searchParams.get('sort') || 'created_at,DESC';

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        // Build API query
        const queryParams = {
          limit: 12,
          page: searchParams.get('page') || 1,
        };
        
        if (currentCategory) queryParams.category = currentCategory;
        if (currentBrand) queryParams.brand = currentBrand;
        if (searchParams.get('featured')) queryParams.featured = true;
        
        const [sortBy, sortOrder] = currentSort.split(',');
        queryParams.sort = sortBy;
        queryParams.order = sortOrder;

        const data = await productService.getAll(queryParams);
        setProducts(data.products);
        setPagination(data.pagination);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
    window.scrollTo(0, 0);
  }, [searchParams]);

  const updateFilter = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    // Reset page when filter changes
    newParams.delete('page');
    setSearchParams(newParams);
  };

  const handlePageChange = (newPage) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', newPage);
    setSearchParams(newParams);
  };

  return (
    <div className="products-page container section">
      <div className="products-header">
        <div>
          <h1 className="heading-serif products-title">
            {currentCategory ? `${currentCategory} Fragrances` : 'The Collection'}
          </h1>
          <p className="products-subtitle">Displaying {pagination.total || products.length} results</p>
        </div>
        
        <div className="products-actions">
          <button 
            className="filter-toggle btn-outline"
            onClick={() => setShowFilters(!showFilters)}
          >
            <FiFilter /> Filters
          </button>
          
          <select 
            className="sort-select"
            value={currentSort}
            onChange={(e) => updateFilter('sort', e.target.value)}
          >
            <option value="created_at,DESC">Newest Arrivals</option>
            <option value="price,ASC">Price: Low to High</option>
            <option value="price,DESC">Price: High to Low</option>
            <option value="name,ASC">Name: A to Z</option>
          </select>
        </div>
      </div>

      <div className="products-layout">
        {/* Sidebar Filters */}
        <aside className={`products-sidebar ${showFilters ? 'is-open' : ''}`}>
          <div className="sidebar-header">
            <h3>Filters</h3>
            <button className="close-filters" onClick={() => setShowFilters(false)}>
              <FiX size={20} />
            </button>
          </div>
          
          <div className="filter-group">
            <h4 className="filter-title">Categories</h4>
            <ul className="filter-list">
              <li>
                <button 
                  className={currentCategory === '' ? 'active' : ''}
                  onClick={() => updateFilter('category', '')}
                >
                  All Profiles
                </button>
              </li>
              {['Floral', 'Woody', 'Oriental', 'Fresh', 'Citrus', 'Aquatic', 'Gourmand', 'Spicy'].map((cat) => (
                <li key={cat}>
                  <button 
                    className={currentCategory === cat.toLowerCase() ? 'active' : ''}
                    onClick={() => updateFilter('category', cat.toLowerCase())}
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="filter-group">
            <h4 className="filter-title">Price Range</h4>
            <div className="price-inputs">
              <input type="number" placeholder="Min" />
              <span>—</span>
              <input type="number" placeholder="Max" />
            </div>
            <button className="btn btn-primary" style={{width: '100%', marginTop: '10px', padding: '8px'}}>Apply</button>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="products-content">
          {loading ? (
            <div className="products-loading">Curating collection...</div>
          ) : products.length === 0 ? (
            <div className="products-empty">
              <h3>No fragrances found</h3>
              <p>Try adjusting your filters to discover more.</p>
              <button 
                className="btn btn-outline" 
                onClick={() => setSearchParams({})}
                style={{marginTop: '20px'}}
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <>
              <div className="products-grid">
                {products.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="pagination">
                  <button 
                    className="pagination-btn"
                    disabled={pagination.currentPage === 1}
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                  >
                    Prev
                  </button>
                  {[...Array(pagination.totalPages)].map((_, i) => (
                    <button 
                      key={i + 1}
                      className={`pagination-btn ${pagination.currentPage === i + 1 ? 'active' : ''}`}
                      onClick={() => handlePageChange(i + 1)}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button 
                    className="pagination-btn"
                    disabled={pagination.currentPage === pagination.totalPages}
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
