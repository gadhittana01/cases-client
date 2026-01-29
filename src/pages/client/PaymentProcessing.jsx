import { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import Pusher from 'pusher-js';

const PaymentProcessing = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('processing'); // processing, success, failed
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [error, setError] = useState('');

  const paymentLinkId = searchParams.get('payment_link_id');

  useEffect(() => {
    if (!paymentLinkId) {
      setError('Payment link ID is missing');
      setStatus('failed');
      return;
    }

    // Initialize Pusher
    const pusherKey = import.meta.env.VITE_PUSHER_KEY;
    const pusherCluster = import.meta.env.VITE_PUSHER_CLUSTER;
    
    if (!pusherKey || !pusherCluster) {
      setError('Pusher configuration is missing');
      setStatus('failed');
      return;
    }

    const pusher = new Pusher(pusherKey, {
      cluster: pusherCluster,
    });

    // Subscribe to payment channel
    const channel = pusher.subscribe(`payment-${paymentLinkId}`);

    // Listen for payment completed event (webhook → backend → Pusher)
    channel.bind('payment-completed', (data) => {
      console.log('Payment completed via Pusher:', data);
      setPaymentStatus(data);
      setStatus('success');
      
      // Redirect to case detail page after 2 seconds
      setTimeout(() => {
        navigate(`/client/cases/${data.case_id}`);
      }, 2000);
    });

    // Timeout after 30 seconds (webhook should arrive within seconds)
    const timeout = setTimeout(() => {
      if (status === 'processing') {
        setError('Payment processing is taking longer than expected. Please check your case details or refresh the page.');
        setStatus('failed');
      }
    }, 30000);

    // Cleanup
    return () => {
      clearTimeout(timeout);
      pusher.unsubscribe(`payment-${paymentLinkId}`);
      pusher.disconnect();
    };
  }, [paymentLinkId, navigate]);

  if (status === 'success') {
    return (
      <div className="container" style={{ paddingTop: '60px', paddingBottom: '60px' }}>
        <div className="card" style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: '64px', marginBottom: '24px' }}>✅</div>
          <h2 style={{ marginBottom: '16px', color: 'var(--success)' }}>Payment Successful!</h2>
          <p style={{ color: 'var(--gray-600)', marginBottom: '24px' }}>
            Your payment has been processed successfully. The quote has been accepted and the case is now engaged.
          </p>
          <p style={{ color: 'var(--gray-500)', fontSize: '14px' }}>
            Redirecting to case details...
          </p>
        </div>
      </div>
    );
  }

  if (status === 'failed') {
    return (
      <div className="container" style={{ paddingTop: '60px', paddingBottom: '60px' }}>
        <div className="card" style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: '64px', marginBottom: '24px' }}>⚠️</div>
          <h2 style={{ marginBottom: '16px', color: 'var(--error)' }}>Payment Processing Issue</h2>
          {error && <p style={{ color: 'var(--error)', marginBottom: '16px' }}>{error}</p>}
          <p style={{ color: 'var(--gray-600)', marginBottom: '24px' }}>
            {error || 'There was an issue processing your payment. Please check your case details or contact support.'}
          </p>
          <button
            onClick={() => navigate(`/client/cases/${id}`)}
            className="btn btn-primary"
          >
            Go to Case Details
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: '60px', paddingBottom: '60px' }}>
      <div className="card" style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
        <div className="loading-spinner" style={{ margin: '0 auto 24px', width: '60px', height: '60px' }}></div>
        <h2 style={{ marginBottom: '16px' }}>Processing Payment...</h2>
        <p style={{ color: 'var(--gray-600)', marginBottom: '24px' }}>
          Please wait while we confirm your payment. This usually takes just a few seconds.
        </p>
        {paymentStatus && (
          <div style={{ marginTop: '24px', padding: '16px', backgroundColor: 'var(--info-bg)', borderRadius: '8px' }}>
            <p style={{ fontSize: '14px', color: 'var(--gray-600)', margin: 0 }}>
              Payment Status: <strong>{paymentStatus.payment_status}</strong>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentProcessing;
