import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';

const MyQuotes = () => {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: '',
    page: 1,
    pageSize: 10,
  });
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadQuotes();
  }, [filters.page, filters.status]);

  const loadQuotes = async () => {
    try {
      setLoading(true);
      const data = await api.getMyQuotes(filters);
      setQuotes(data.data || []);
      setTotalPages(data.total_pages || 1);
    } catch (error) {
      console.error('Failed to load quotes:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      proposed: 'badge-proposed',
      accepted: 'badge-accepted',
      rejected: 'badge-rejected',
    };
    return <span className={`badge ${badges[status] || ''}`}>{status}</span>;
  };

  const getCaseStatusBadge = (status) => {
    const badges = {
      open: 'badge-open',
      engaged: 'badge-engaged',
      closed: 'badge-closed',
      cancelled: 'badge-cancelled',
    };
    return <span className={`badge ${badges[status] || ''}`}>{status}</span>;
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Loading your quotes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: '40px', paddingBottom: '60px' }}>
      <div className="page-header">
        <div>
          <h1>My Quotes</h1>
          <p>Track all your submitted quotes and their status</p>
        </div>
      </div>

      <div className="filter-card">
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label>Filter by Status</label>
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}
          >
            <option value="">All Quotes</option>
            <option value="proposed">Proposed</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {quotes.length === 0 ? (
        <div className="empty-state">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3>No quotes found</h3>
          <p>Submit quotes from the marketplace to see them here</p>
          <Link to="/lawyer/marketplace" className="btn btn-primary" style={{ marginTop: '20px' }}>
            Browse Marketplace →
          </Link>
        </div>
      ) : (
        <>
          <div className="card">
            <table>
              <thead>
                <tr>
                  <th>Case Title</th>
                  <th>Category</th>
                  <th>Amount</th>
                  <th>Expected Days</th>
                  <th>Quote Status</th>
                  <th>Case Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {quotes.map((quote) => (
                  <tr key={quote.id}>
                    <td>{quote.case_title || 'N/A'}</td>
                    <td>{quote.case_category || 'N/A'}</td>
                    <td>${quote.amount}</td>
                    <td>{quote.expected_days} days</td>
                    <td>{getStatusBadge(quote.status)}</td>
                    <td>{getCaseStatusBadge(quote.case_status)}</td>
                    <td>
                      {quote.status === 'accepted' && quote.case_status === 'engaged' && (
                        <Link
                          to={`/lawyer/marketplace/cases/${quote.case_id}`}
                          className="btn btn-primary"
                          style={{ padding: '8px 16px', fontSize: '14px' }}
                        >
                          📁 View Case & Files →
                        </Link>
                      )}
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

export default MyQuotes;
