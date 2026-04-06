import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import Navbar from '../components/Navbar';
import RatingStars from '../components/RatingStars';
import { User, Mail, MapPin, Shield, Star, ArrowLeft } from 'lucide-react';

const UserDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUser();
  }, [id]);

  const fetchUser = async () => {
    try {
      const { data } = await API.get('/admin/users');
      const found = data.find(u => u.id === id);
      setUserData(found);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!userData) return <div>User not found</div>;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-main)' }}>
      <Navbar />
      <main className="main-content">
        <button
          onClick={() => navigate(-1)}
          style={{ background: 'transparent', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '32px', color: 'var(--text-muted)' }}
        >
          <ArrowLeft size={20} /> Back to Dashboard
        </button>

        <div className="card glass" style={{ maxWidth: '800px', margin: '0 auto', padding: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '32px', marginBottom: '40px' }}>
            <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyItems: 'center', color: 'white' }}>
              <User size={48} style={{ margin: 'auto' }} />
            </div>
            <div>
              <h2 style={{ fontSize: '32px', fontWeight: '800' }}>{userData.name}</h2>
              <span className={`badge badge-${userData.role}`} style={{ fontSize: '14px', padding: '6px 12px' }}>{userData.role} User</span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
            <div style={{ display: 'flex', gap: '16px' }}>
              <Mail style={{ color: 'var(--primary)' }} />
              <div>
                <label className="label">Email Address</label>
                <p style={{ fontWeight: 600 }}>{userData.email}</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '16px' }}>
              <MapPin style={{ color: 'var(--primary)' }} />
              <div>
                <label className="label">Residential Address</label>
                <p style={{ fontWeight: 600 }}>{userData.address}</p>
              </div>
            </div>

            {userData.role === 'owner' && (
              <div style={{ display: 'flex', gap: '16px', gridColumn: 'span 2', padding: '24px', background: '#f8fafc', borderRadius: '16px', border: '1px solid var(--border)' }}>
                <Star style={{ color: '#f59e0b' }} />
                <div>
                  <label className="label">Managed Store Rating</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <h3 style={{ fontSize: '24px', fontWeight: 800 }}>{userData.managedStore?.averageRating ? Number(userData.managedStore.averageRating).toFixed(1) : 'N/A'}</h3>
                    <RatingStars rating={userData.managedStore?.averageRating ? Number(userData.managedStore.averageRating) : 0} />
                  </div>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                    Overall customer rating for {userData.managedStore?.name || 'their store'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserDetails;
