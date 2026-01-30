import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';

const FileList = ({ files }) => {
  const [fileUrls, setFileUrls] = useState({});

  useEffect(() => {
    const loadUrls = async () => {
      const urls = {};
      for (const file of files) {
        if (!file.download_url) {
          try {
            const urlData = await api.getFileDownloadUrl(file.id);
            urls[file.id] = urlData.download_url;
          } catch (err) {
            console.error('Failed to get download URL:', err);
          }
        } else {
          urls[file.id] = file.download_url;
        }
      }
      setFileUrls(urls);
    };
    if (files && files.length > 0) {
      loadUrls();
    }
  }, [files]);

  if (!files || files.length === 0) {
    return null;
  }

  return (
    <div className="card">
      <h3 style={{ marginBottom: '20px' }}>📎 Case Files ({files.length})</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {files.map((file) => (
          <div key={file.id} className="file-list-item">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '20px' }}>
                {file.file_name.toLowerCase().endsWith('.pdf') ? '📄' : '🖼️'}
              </span>
              <div>
                {fileUrls[file.id] ? (
                  <a 
                    href={fileUrls[file.id]} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{ 
                      fontWeight: '600', 
                      color: 'var(--primary)', 
                      textDecoration: 'none',
                      display: 'block'
                    }}
                  >
                    {file.file_name}
                  </a>
                ) : (
                  <span style={{ fontWeight: '600' }}>{file.file_name}</span>
                )}
                <div style={{ fontSize: '12px', color: 'var(--gray-500)', marginTop: '2px' }}>
                  {(file.file_size / 1024).toFixed(2)} KB
                </div>
              </div>
            </div>
            {fileUrls[file.id] && (
              <a 
                href={fileUrls[file.id]} 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn btn-primary"
                style={{ padding: '6px 12px', fontSize: '12px' }}
              >
                Download →
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};


const CaseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadCase();
  }, [id]);

  const loadCase = async () => {
    try {
      setLoading(true);
      const data = await api.getCaseById(id);
      setCaseData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptQuote = async (quoteId) => {
    try {
      setError('');
      

      if (caseData && caseData.status !== 'open') {
        setError('This case is no longer open for quotes');
        return;
      }

      const response = await api.acceptQuote(quoteId);
      

      if (response.payment_link_url || response.client_secret) {
        window.location.href = response.payment_link_url;
      } else {
        throw new Error('Payment link not received');
      }
    } catch (err) {
      setError(err.message || 'Failed to accept quote');

      loadCase();
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

  if (loading) {
    return (
      <div className="container">
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Loading case details...</p>
        </div>
      </div>
    );
  }

  if (error && !caseData) {
    return (
      <div className="container">
        <div className="card">
          <div className="error">{error}</div>
        </div>
      </div>
    );
  }

  if (!caseData) {
    return (
      <div className="container">
        <div className="card">
          <div className="error">Case not found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: '40px', paddingBottom: '60px' }}>
      <button onClick={() => navigate('/client/dashboard')} className="btn btn-secondary" style={{ marginBottom: '24px' }}>
        ← Back to Dashboard
      </button>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h2 style={{ marginBottom: '12px' }}>{caseData.title}</h2>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
              <span className={`badge badge-${caseData.status}`}>{caseData.status}</span>
              <span className="case-card-category">{caseData.category}</span>
            </div>
          </div>
        </div>
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ fontSize: '16px', marginBottom: '8px', color: 'var(--gray-700)' }}>Description</h3>
          <p style={{ color: 'var(--gray-600)', lineHeight: '1.8' }}>{caseData.description}</p>
        </div>
        <div style={{ paddingTop: '16px', borderTop: '1px solid var(--gray-200)', fontSize: '14px', color: 'var(--gray-500)' }}>
          Created: {new Date(caseData.created_at).toLocaleString()}
        </div>
      </div>

      {caseData.files && caseData.files.length > 0 && (
        <FileList files={caseData.files} />
      )}

      <div className="card">
        <h3 style={{ marginBottom: '20px' }}>💼 Quotes ({caseData.quotes?.length || 0})</h3>
        {error && <div className="error">{error}</div>}
        {!caseData.quotes || caseData.quotes.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--gray-500)' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📋</div>
            <p style={{ fontSize: '16px' }}>No quotes yet. Check back later!</p>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Lawyer</th>
                <th>Amount</th>
                <th>Expected Days</th>
                <th>Note</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {caseData.quotes.map((quote) => (
                <tr key={quote.id}>
                  <td style={{ fontWeight: '600' }}>{quote.lawyer_name || 'N/A'}</td>
                  <td style={{ fontWeight: '700', color: 'var(--primary)', fontSize: '18px' }}>
                    ${quote.amount}
                  </td>
                  <td style={{ color: 'var(--gray-600)' }}>{quote.expected_days} days</td>
                  <td style={{ color: 'var(--gray-600)', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {quote.note || '-'}
                  </td>
                  <td>{getStatusBadge(quote.status)}</td>
                  <td>
                    {caseData.status === 'open' && quote.status === 'proposed' && (
                      <button
                        onClick={() => handleAcceptQuote(quote.id)}
                        className="btn btn-success"
                        style={{ padding: '8px 16px', fontSize: '14px' }}
                        disabled={caseData.status !== 'open'}
                      >
                        💳 Accept & Pay
                      </button>
                    )}
                    {quote.status === 'accepted' && (
                      <span style={{ color: 'var(--success)', fontSize: '14px', fontWeight: '600' }}>
                        ✓ Accepted
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

    </div>
  );
};

export default CaseDetail;
