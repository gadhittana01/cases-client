import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';

const Dashboard = () => {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadCases();
  }, [page]);

  const loadCases = async () => {
    try {
      setLoading(true);
      const data = await api.getMyCases(page, 10);
      setCases(data.data || []);
      setTotalPages(data.total_pages || 1);
    } catch (error) {
      console.error('Failed to load cases:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
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
          <p>Loading your cases...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="page-header">
        <div>
          <h1>My Cases</h1>
          <p>Manage your legal cases and track quotes from lawyers</p>
        </div>
        <Link to="/client/cases/new" className="btn btn-primary">
          ➕ Create New Case
        </Link>
      </div>

      {cases.length === 0 ? (
        <div className="empty-state">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3>No cases yet</h3>
          <p>Create your first case to get started and connect with qualified lawyers</p>
          <Link to="/client/cases/new" className="btn btn-primary" style={{ marginTop: '20px' }}>
            ➕ Create Your First Case
          </Link>
        </div>
      ) : (
        <>
          <div className="card">
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Quotes</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {cases.map((caseItem) => (
                  <tr key={caseItem.id}>
                    <td>{caseItem.title}</td>
                    <td>{caseItem.category}</td>
                    <td>{getStatusBadge(caseItem.status)}</td>
                    <td>{caseItem.quotes_count || 0}</td>
                    <td>{new Date(caseItem.created_at).toLocaleDateString()}</td>
                    <td>
                      <Link to={`/client/cases/${caseItem.id}`} className="btn btn-secondary" style={{ padding: '5px 10px', fontSize: '14px' }}>
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
                Previous
              </button>
              <span>Page {page} of {totalPages}</span>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Dashboard;
