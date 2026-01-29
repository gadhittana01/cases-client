import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';

const Marketplace = () => {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    created_since: '',
    page: 1,
    pageSize: 10,
  });
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadCases();
  }, [filters.page, filters.category, filters.created_since]);

  const loadCases = async () => {
    try {
      setLoading(true);
      const data = await api.getMarketplaceCases(filters);
      setCases(data.data || []);
      setTotalPages(data.total_pages || 1);
    } catch (error) {
      console.error('Failed to load cases:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value, page: 1 });
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Loading marketplace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="page-header">
        <div>
          <h1>Marketplace</h1>
          <p>Browse anonymized open cases and submit quotes</p>
        </div>
      </div>

      <div className="filter-card">
        <h3>🔍 Filters</h3>
        <div className="filter-grid">
          <div className="form-group">
            <label>Category</label>
            <input
              type="text"
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              placeholder="e.g., Contract Law, Family Law"
            />
          </div>
          <div className="form-group">
            <label>Created Since</label>
            <input
              type="date"
              value={filters.created_since}
              onChange={(e) => handleFilterChange('created_since', e.target.value)}
            />
          </div>
        </div>
      </div>

      {cases.length === 0 ? (
        <div className="empty-state">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <h3>No open cases found</h3>
          <p>Try adjusting your filters or check back later</p>
        </div>
      ) : (
        <>
          <div className="card">
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Description</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {cases.map((caseItem) => (
                  <tr key={caseItem.id}>
                    <td style={{ fontWeight: '600' }}>{caseItem.title}</td>
                    <td>
                      <span className="case-card-category">{caseItem.category}</span>
                    </td>
                    <td style={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', color: 'var(--gray-600)' }}>
                      {caseItem.description.substring(0, 100)}...
                    </td>
                    <td style={{ color: 'var(--gray-500)', fontSize: '14px' }}>
                      {new Date(caseItem.created_at).toLocaleDateString()}
                    </td>
                    <td>
                      <Link
                        to={`/lawyer/marketplace/cases/${caseItem.id}`}
                        className="btn btn-primary"
                        style={{ padding: '8px 16px', fontSize: '14px' }}
                      >
                        View & Quote →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button onClick={() => setFilters({ ...filters, page: filters.page - 1 })} disabled={filters.page === 1}>
                Previous
              </button>
              <span>Page {filters.page} of {totalPages}</span>
              <button onClick={() => setFilters({ ...filters, page: filters.page + 1 })} disabled={filters.page === totalPages}>
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Marketplace;
