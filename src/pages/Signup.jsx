import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import API from '../api/axios';
import { Link } from 'react-router-dom';

const Signup = () => {
  const { login } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const validatePassword = (pw) => {
    const re = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,16}$/;
    return re.test(pw);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.name.length < 20 || formData.name.length > 60) {
      return setError('Name must be between 20 and 60 characters');
    }
    if (formData.address.length > 400) {
      return setError('Address must not exceed 400 characters');
    }
    if (!validatePassword(formData.password)) {
      return setError('Password must be 8-16 characters and include at least one uppercase letter and one special character');
    }

    setLoading(true);
    try {
      const { data } = await API.post('/auth/register', formData);
      login(data);
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || 'Signup failed');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card card glass">
        <h2 style={{ marginBottom: '8px', textAlign: 'center' }}>Create Account</h2>
        <p style={{ color: 'var(--text-muted)', textAlign: 'center', marginBottom: '32px' }}>
          Join StoRate to rate your favorite stores
        </p>

        {error && <div style={{ color: 'var(--danger)', marginBottom: '16px', textAlign: 'center', fontSize: '14px' }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="label">Full Name (20-60 Characters)</label>
            <input 
              type="text" 
              placeholder="Your Full Professional Name" 
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="label">Email Address</label>
            <input 
              type="email" 
              placeholder="you@example.com" 
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="label">Address (Max 400 Characters)</label>
            <textarea 
              placeholder="Enter your residence address" 
              rows={3}
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              required
              style={{ resize: 'none' }}
            />
          </div>

          <div className="form-group">
            <label className="label">Password (8-16 chars, 1 upper, 1 special)</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>

          <button 
            type="submit" 
            className="btn-primary" 
            style={{ width: '100%', marginTop: '16px' }}
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <p style={{ marginTop: '24px', textAlign: 'center', fontSize: '14px' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: '600' }}>Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
