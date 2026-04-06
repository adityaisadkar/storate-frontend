import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import Navbar from '../components/Navbar';
import RatingStars from '../components/RatingStars';
import { Star, Users, MessageSquare } from 'lucide-react';

const OwnerDashboard = () => {
  const [storeData, setStoreData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOwnerData();
  }, []);

  const fetchOwnerData = async () => {
    try {
      const { data } = await API.get('/owner/dashboard');
      setStoreData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-main)' }}>
      <Navbar />

      <main className="main-content">
        <header style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: '800' }}>Store Insights</h2>
          <p style={{ color: 'var(--text-muted)' }}>Monitor your store's performance and customer feedback</p>
        </header>

        {storeData ? (
          <>
            <div className="stats-grid">
              <div className="card stat-card glass" style={{ borderLeft: '4px solid var(--primary)' }}>
                <div className="stat-icon" style={{ background: '#eef2ff', color: 'var(--primary)' }}><Star size={24} /></div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div className="stat-value">{storeData.averageRating ? Number(storeData.averageRating).toFixed(1) : 'N/A'}</div>
                  <RatingStars rating={storeData.averageRating ? Number(storeData.averageRating) : 0} />
                </div>
                <div className="stat-label">Average Store Rating</div>
              </div>

              <div className="card stat-card glass" style={{ borderLeft: '4px solid var(--success)' }}>
                <div className="stat-icon" style={{ background: '#f0fdf4', color: 'var(--success)' }}><Users size={24} /></div>
                <div className="stat-value">{storeData.ratings?.length || 0}</div>
                <div className="stat-label">Total Customer Ratings</div>
              </div>
            </div>

            <h3 style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <MessageSquare size={20} />
              Recent Feedback
            </h3>

            <div className="card glass" style={{ padding: '0' }}>
              <table>
                <thead>
                  <tr>
                    <th>Customer Name</th>
                    <th>Email</th>
                    <th>Address</th>
                    <th>Rating</th>
                    <th>Submitted On</th>
                  </tr>
                </thead>
                <tbody>
                  {storeData.ratings?.map(r => (
                    <tr key={r.id}>
                      <td style={{ fontWeight: 600 }}>{r.user?.name}</td>
                      <td>{r.user?.email}</td>
                      <td style={{ fontSize: '13px', maxWidth: '300px' }}>{r.user?.address}</td>
                      <td>
                         <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Star size={16} fill="#f59e0b" color="#f59e0b" />
                            <span style={{ fontWeight: 700 }}>{r.rating}</span>
                         </div>
                      </td>
                      <td style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                        {new Date(r.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                  {(!storeData.ratings || storeData.ratings.length === 0) && (
                    <tr>
                      <td colSpan="5" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                        No ratings submitted yet for your store.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <div className="card glass" style={{ textAlign: 'center', padding: '100px' }}>
               <h3>Store not configured</h3>
               <p>Please contact the system administrator to link your account to a store.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default OwnerDashboard;
