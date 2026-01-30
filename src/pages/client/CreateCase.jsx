import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';

const CreateCase = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
  });
  const [files, setFiles] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length + files.length > 10) {
      setError('Maximum 10 files allowed');
      return;
    }
    
    const validFiles = selectedFiles.filter(file => {
      const ext = file.name.toLowerCase().split('.').pop();
      return ext === 'pdf' || ext === 'png';
    });

    if (validFiles.length !== selectedFiles.length) {
      setError('Only PDF and PNG files are allowed');
      return;
    }

    setFiles([...files, ...validFiles]);
    setError('');
  };

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {

      const caseData = await api.createCase(formData);
      

      if (files.length > 0) {
        for (const file of files) {
          try {
            await api.uploadCaseFile(caseData.id, file);
          } catch (fileErr) {
            console.error('Failed to upload file:', fileErr);

          }
        }
      }
      
      navigate(`/client/cases/${caseData.id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ paddingTop: '40px', paddingBottom: '60px' }}>
      <div className="page-header" style={{ marginBottom: '32px' }}>
        <div>
          <h1>Create New Case</h1>
          <p>Post your legal case and receive quotes from qualified lawyers</p>
        </div>
      </div>
      <div className="card" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Category *</label>
            <input
              type="text"
              required
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              placeholder="e.g., Contract Law, Family Law, Corporate Law"
            />
          </div>
          <div className="form-group">
            <label>Description *</label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe your legal case..."
            />
          </div>
          <div className="form-group">
            <label>Files (PDF or PNG, max 10)</label>
            <div className="file-upload-area" onClick={() => document.getElementById('file-input').click()}>
              <input
                id="file-input"
                type="file"
                multiple
                accept=".pdf,.png"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '32px', marginBottom: '12px' }}>📎</div>
                <div style={{ fontWeight: '600', marginBottom: '4px' }}>Click to upload files</div>
                <div style={{ fontSize: '14px', color: 'var(--gray-500)' }}>
                  PDF or PNG files only (max 10 files)
                </div>
              </div>
            </div>
            {files.length > 0 && (
              <div style={{ marginTop: '16px' }}>
                {files.map((file, index) => (
                  <div key={index} className="file-list-item">
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span>📄</span>
                      <span>{file.name}</span>
                      <span style={{ color: 'var(--gray-500)', fontSize: '12px' }}>
                        ({(file.size / 1024).toFixed(2)} KB)
                      </span>
                    </span>
                    <button type="button" onClick={() => removeFile(index)} className="btn btn-danger" style={{ padding: '6px 12px', fontSize: '12px' }}>
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          {error && <div className="error">{error}</div>}
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Creating...' : 'Create Case'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateCase;
