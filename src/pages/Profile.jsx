import React, { useState, useContext } from 'react';
import API from '../api/axios';
import Navbar from '../components/Navbar';
import { Shield, Key, CheckCircle, AlertCircle } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [passwords, setPasswords] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      return setError('New passwords do not match');
    }

    try {
      await API.put('/auth/update-password', {
        oldPassword: passwords.oldPassword,
        newPassword: passwords.newPassword,
      });
      setMessage('Password updated successfully!');
      setPasswords({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || 'Update failed');
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-main)' }}>
      <Navbar />
      <main className="main-content" style={{ maxWidth: '600px' }}>
        <h2 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '32px' }}>Security Settings</h2>
        
        <div className="card glass">
           <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px', color: 'var(--primary)' }}>
              <Shield size={32} />
              <h3 style={{ fontSize: '20px', fontWeight: 700 }}>Update Password</h3>
           </div>

           {message && (
             <div style={{ background: '#dcfce7', color: 'var(--success)', padding: '12px', borderRadius: '8px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
               <CheckCircle size={18} /> {message}
             </div>
           )}

           {error && (
             <div style={{ background: '#fee2e2', color: 'var(--danger)', padding: '12px', borderRadius: '8px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
               <AlertCircle size={18} /> {error}
             </div>
           )}

           <form onSubmit={handleUpdate}>
              <div className="form-group">
                <label className="label">Current Password</label>
                <div style={{ position: 'relative' }}>
                  <Key size={18} style={{ position: 'absolute', left: '12px', top: '14px', color: 'var(--text-muted)' }} />
                  <input 
                    type="password" 
                    placeholder="Enter current password" 
                    style={{ paddingLeft: '40px' }}
                    value={passwords.oldPassword}
                    onChange={(e) => setPasswords({ ...passwords, oldPassword: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="label">New Password (8-16 chars, 1 upper, 1 special)</label>
                <div style={{ position: 'relative' }}>
                  <Shield size={18} style={{ position: 'absolute', left: '12px', top: '14px', color: 'var(--text-muted)' }} />
                  <input 
                    type="password" 
                    placeholder="Enter new password" 
                    style={{ paddingLeft: '40px' }}
                    value={passwords.newPassword}
                    onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="label">Confirm New Password</label>
                <input 
                  type="password" 
                  placeholder="Confirm new password" 
                  style={{ paddingLeft: '40px' }}
                  value={passwords.confirmPassword}
                  onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                  required
                />
              </div>

              <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '24px' }}>
                Update Password
              </button>
           </form>
        </div>
      </main>
    </div>
  );
};

export default Profile;
