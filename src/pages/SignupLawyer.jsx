import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const SignupLawyer = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    jurisdiction: '',
    bar_number: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signup({ ...formData, role: 'lawyer' });
      navigate('/lawyer/marketplace');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ paddingTop: '60px', paddingBottom: '60px' }}>
      <div className="card" style={{ maxWidth: '480px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h2 style={{ marginBottom: '8px' }}>Sign up as Lawyer</h2>
          <p style={{ color: 'var(--gray-600)' }}>Join our marketplace and help clients with legal services</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email *</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Password *</label>
            <input
              type="password"
              required
              minLength={8}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Jurisdiction</label>
            <input
              type="text"
              value={formData.jurisdiction}
              onChange={(e) => setFormData({ ...formData, jurisdiction: e.target.value })}
              placeholder="e.g., Singapore"
            />
          </div>
          <div className="form-group">
            <label>Bar Number</label>
            <input
              type="text"
              value={formData.bar_number}
              onChange={(e) => setFormData({ ...formData, bar_number: e.target.value })}
            />
          </div>
          {error && <div className="error">{error}</div>}
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Signing up...' : 'Sign up'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignupLawyer;
