import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../../services/api';

const FileList = ({ files }) => {
  const [fileUrls, setFileUrls] = useState({});

  useEffect(() => {
    const loadUrls = async () => {
      const urls = {};
      for (const file of files) {
        try {
          const urlData = await api.getFileDownloadUrl(file.id);
          urls[file.id] = urlData.download_url;
        } catch (err) {
          console.error('Failed to get download URL:', err);
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
                {file.file_name?.toLowerCase().endsWith('.pdf') ? '📄' : '🖼️'}
              </span>
              <div>
                {fileUrls[file.id] ? (
                  <a 
                    href={fileUrls[file.id]} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{ 
                      color: 'var(--primary)', 
                      textDecoration: 'none',
                      fontWeight: '500'
                    }}
                  >
                    {file.file_name}
                  </a>
                ) : (
                  <span>{file.file_name}</span>
                )}
                <div style={{ fontSize: '12px', color: 'var(--gray-500)', marginTop: '4px' }}>
                  {(file.file_size / 1024).toFixed(2)} KB
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const MarketplaceCaseDetail = () => {
  const { id } = useParams();
  const [caseData, setCaseData] = useState(null);
  const [existingQuote, setExistingQuote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    amount: '',
    expected_days: '',
    note: '',
  });

  useEffect(() => {
    loadCase();
  }, [id]);

  const loadCase = async () => {
    try {
      setLoading(true);
      const data = await api.getMarketplaceCase(id);
      setCaseData(data);


      if (data.has_submitted) {
        try {
          const response = await api.getMyQuoteForCase(id);

          const quoteData = response.quote;
          if (quoteData) {
            setExistingQuote(quoteData);

            setFormData({
              amount: quoteData.amount?.toString() || '',
              expected_days: quoteData.expected_days?.toString() || '',
              note: quoteData.note || '',
            });
          }
        } catch (err) {
          console.error('Failed to load quote:', err);
        }
      }


      if (data.files && data.files.length > 0) {

      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {

      const amount = parseFloat(formData.amount);
      const expectedDays = parseInt(formData.expected_days);

      if (!amount || amount <= 0) {
        throw new Error('Amount must be greater than 0');
      }
      if (!expectedDays || expectedDays <= 0) {
        throw new Error('Expected days must be greater than 0');
      }

      const quoteData = {
        amount: amount.toString(),
        expected_days: expectedDays,
        note: formData.note || '',
      };

      if (caseData.has_submitted && existingQuote) {

        await api.updateQuote(id, quoteData);
      } else {

        await api.createQuote(id, quoteData);
      }


      await loadCase();
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to submit quote');
    } finally {
      setSubmitting(false);
    }
  };

  const canViewFullDetails = caseData?.files && caseData.files.length > 0;
  const canSubmitQuote = !caseData?.has_submitted || (existingQuote && existingQuote.status !== 'accepted');

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
          <Link to="/lawyer/marketplace" className="btn btn-primary" style={{ marginTop: '20px' }}>
            ← Back to Marketplace
          </Link>
        </div>
      </div>
    );
  }

  if (!caseData) {
    return (
      <div className="container">
        <div className="card">
          <div className="error">Case not found</div>
          <Link to="/lawyer/marketplace" className="btn btn-primary" style={{ marginTop: '20px' }}>
            ← Back to Marketplace
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: '40px', paddingBottom: '60px' }}>
      <div style={{ marginBottom: '24px' }}>
        <Link to="/lawyer/marketplace" style={{ color: 'var(--primary)', textDecoration: 'none', marginBottom: '16px', display: 'inline-block' }}>
          ← Back to Marketplace
        </Link>
      </div>

      <div className="page-header">
        <div>
          <h1>{caseData.title}</h1>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginTop: '8px' }}>
            <span className="case-card-category">{caseData.category}</span>
            {caseData.status && (
              <span className={`badge badge-${caseData.status}`}>{caseData.status}</span>
            )}
          </div>
        </div>
      </div>

      {caseData.has_submitted && !canSubmitQuote && (
        <div className="card" style={{ marginBottom: '24px', backgroundColor: 'var(--info-bg)', border: '1px solid var(--info)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '24px' }}>ℹ️</span>
            <div>
              <h4 style={{ margin: 0, color: 'var(--info)' }}>Quote Already Submitted</h4>
              <p style={{ margin: '4px 0 0 0', color: 'var(--gray-600)' }}>
                {caseData.status === 'engaged' 
                  ? 'This case is engaged. Your quote has been accepted and the case is in progress.'
                  : 'You have already submitted a quote for this case. You can update it until the case is engaged.'}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="card">
        <h3 style={{ marginBottom: '16px' }}>📋 Case Description</h3>
        <p style={{ color: 'var(--gray-700)', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
          {caseData.description}
        </p>
        {!canViewFullDetails && (
          <div style={{ marginTop: '16px', padding: '12px', backgroundColor: 'var(--warning-bg)', borderRadius: '8px', fontSize: '14px', color: 'var(--warning)' }}>
            ℹ️ Description is anonymized. Full details and files will be available after your quote is accepted and payment is completed.
          </div>
        )}
      </div>

      {canViewFullDetails && caseData.files && (
        <FileList files={caseData.files} />
      )}

      {canSubmitQuote && (
        <div className="card">
          <h3 style={{ marginBottom: '20px' }}>
            {caseData.has_submitted ? '✏️ Update Your Quote' : '💼 Submit a Quote'}
          </h3>
          {caseData.has_submitted && (
            <div style={{ marginBottom: '16px', padding: '12px', backgroundColor: 'var(--info-bg)', borderRadius: '8px', fontSize: '14px', color: 'var(--info)' }}>
              You can update your quote until the case is engaged.
            </div>
          )}
          {error && <div className="error">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Amount (SGD)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                required
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                placeholder="e.g., 2000.00"
              />
            </div>
            <div className="form-group">
              <label>Expected Days</label>
              <input
                type="number"
                min="1"
                required
                value={formData.expected_days}
                onChange={(e) => setFormData({ ...formData, expected_days: e.target.value })}
                placeholder="e.g., 30"
              />
            </div>
            <div className="form-group">
              <label>Note (Optional)</label>
              <textarea
                rows="4"
                value={formData.note}
                onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                placeholder="Add any additional notes or conditions..."
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Submitting...' : caseData.has_submitted ? 'Update Quote' : 'Submit Quote'}
            </button>
          </form>
        </div>
      )}

      {existingQuote && existingQuote.status === 'accepted' && (
        <div className="card" style={{ backgroundColor: 'var(--success-bg)', border: '1px solid var(--success)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '24px' }}>✓</span>
            <div>
              <h4 style={{ margin: 0, color: 'var(--success)' }}>Quote Accepted!</h4>
              <p style={{ margin: '4px 0 0 0', color: 'var(--gray-600)' }}>
                Your quote has been accepted. {caseData.status === 'engaged' ? 'The case is now in progress.' : 'Waiting for payment to begin work.'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarketplaceCaseDetail;
