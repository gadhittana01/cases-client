import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <Link to="/" className="navbar-brand">
          ⚖️ Legal Marketplace
        </Link>
        <div className="navbar-links">
          {user ? (
            <>
              {user.role === 'client' && (
                <>
                  <Link to="/client/dashboard">My Cases</Link>
                  <Link to="/client/cases/new">Create Case</Link>
                </>
              )}
              {user.role === 'lawyer' && (
                <>
                  <Link to="/lawyer/marketplace">Marketplace</Link>
                  <Link to="/lawyer/my-quotes">My Quotes</Link>
                </>
              )}
              <span style={{ color: 'var(--gray-600)', fontSize: '14px', padding: '0 12px' }}>
                👋 {user.name || user.email}
              </span>
              <button onClick={handleLogout} className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '14px' }}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/signup/client">Sign up as Client</Link>
              <Link to="/signup/lawyer">Sign up as Lawyer</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
