import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import Navbar from '../components/Navbar';
import RatingStars from '../components/RatingStars';
import { Search, Store, ArrowUpDown, CheckCircle } from 'lucide-react';

const UserDashboard = () => {
  const [stores, setStores] = useState([]);
  const [loadingStoreId, setLoadingStoreId] = useState(null);
  const [success, setSuccess] = useState('');
  const [filters, setFilters] = useState({ search: '', sortBy: 'name', order: 'ASC' });

  useEffect(() => {
    fetchStores();
  }, [filters]);

  const fetchStores = async () => {
    try {
      const { data } = await API.get('/user/stores', { params: filters });
      setStores(data);
    } catch (err) { console.error(err); }
  };

  const handleRate = async (storeId, rating) => {
    setLoadingStoreId(storeId);
    try {
      await API.post('/user/rate', { storeId, rating });
      setSuccess('Rating submitted successfully!');
      setTimeout(() => setSuccess(''), 3000);
      fetchStores();
    } catch (err) { 
      console.error(err); 
    } finally {
      setLoadingStoreId(null);
    }
  };

  const handleSort = (field) => {
    const order = filters.sortBy === field && filters.order === 'ASC' ? 'DESC' : 'ASC';
    setFilters({ ...filters, sortBy: field, order });
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-main)' }}>
      <Navbar />

      <main className="main-content">
        <header style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <h2 style={{ fontSize: '28px', fontWeight: '800' }}>Explore Stores</h2>
            <p style={{ color: 'var(--text-muted)' }}>Browse stores and provide your feedback</p>
          </div>
          {success && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--success)', fontSize: '14px', background: '#dcfce7', padding: '8px 16px', borderRadius: '8px' }}>
              <CheckCircle size={16} /> {success}
            </div>
          )}
        </header>

        <div style={{ display: 'flex', gap: '24px', marginBottom: '32px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              placeholder="Search Stores by name or address..." 
              style={{ paddingLeft: '40px' }}
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            />
          </div>
          <button 
            onClick={() => handleSort('overallRating')}
            className="glass"
            style={{ padding: '0 20px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}
          >
            Sort by Rating <ArrowUpDown size={16} />
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '24px' }}>
          {stores.map(s => (
            <div key={s.id} className="card glass" style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
              <div style={{ background: 'var(--primary)', color: 'white', padding: '12px', borderRadius: '12px' }}>
                <Store size={24} />
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '4px' }}>{s.name}</h3>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px', minHeight: '40px' }}>{s.address}</p>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <label className="label" style={{ fontSize: '12px' }}>Overall Rating</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <RatingStars rating={s.overallRating ? Number(s.overallRating) : 0} />
                      <span style={{ fontWeight: 700, fontSize: '13px' }}>{s.overallRating ? Number(s.overallRating).toFixed(1) : '0.0'}</span>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <label className="label" style={{ fontSize: '12px' }}>Your Rating</label>
                    <RatingStars 
                      rating={s.ratings?.[0]?.rating || 0} 
                      editable={true} 
                      onRate={(r) => handleRate(s.id, r)}
                      disabled={loadingStoreId === s.id}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default UserDashboard;
