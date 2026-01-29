import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Landing = () => {
  const { user } = useAuth();

  return (
    <>
      <div className="hero">
        <div className="hero-content">
          <h1>Legal Marketplace</h1>
          <p>
            Connect clients with qualified lawyers for legal services. 
            Fast, secure, and transparent legal solutions.
          </p>
          {user ? (
            <div className="hero-buttons">
              {user.role === 'client' ? (
                <Link to="/client/dashboard" className="btn btn-primary" style={{ background: 'white', color: '#6366f1' }}>
                  Go to Dashboard →
                </Link>
              ) : (
                <Link to="/lawyer/marketplace" className="btn btn-primary" style={{ background: 'white', color: '#6366f1' }}>
                  Browse Marketplace →
                </Link>
              )}
            </div>
          ) : (
            <div className="hero-buttons">
              <Link to="/signup/client" className="btn btn-primary" style={{ background: 'white', color: '#6366f1' }}>
                Sign up as Client
              </Link>
              <Link to="/signup/lawyer" className="btn btn-primary" style={{ background: 'rgba(255,255,255,0.2)', color: 'white', border: '2px solid white' }}>
                Sign up as Lawyer
              </Link>
              <Link to="/login" className="btn btn-secondary" style={{ background: 'transparent', color: 'white', border: '2px solid white' }}>
                Login
              </Link>
            </div>
          )}
        </div>
      </div>

      <div className="container" style={{ marginTop: '-60px', position: 'relative', zIndex: 10 }}>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">⚖️</div>
            <h3>Secure & Private</h3>
            <p>
              Your case details are anonymized until engagement. 
              Only accepted lawyers can access full information.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">💼</div>
            <h3>Expert Lawyers</h3>
            <p>
              Connect with qualified lawyers who specialize in your area of need. 
              Review quotes and choose the best fit.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">💳</div>
            <h3>Secure Payments</h3>
            <p>
              Integrated Stripe payments ensure secure transactions. 
              Pay only after accepting a quote.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Landing;
