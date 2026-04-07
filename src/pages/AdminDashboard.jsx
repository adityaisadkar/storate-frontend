import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import Navbar from '../components/Navbar';
import { Users, ShoppingBag, Star, Search, PlusCircle, ArrowUpDown, X, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

const Modal = ({ title, onClose, onSubmit, children, modalError, loading }) => (
  <div className="modal-overlay">
    <div className="modal-content card glass">
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
        <h3>{title}</h3>
        <button onClick={onClose} style={{ background: 'transparent' }} disabled={loading}><X size={20} /></button>
      </div>
      {modalError && <div style={{ color: 'var(--danger)', marginBottom: '16px', fontSize: '14px' }}>{modalError}</div>}
      <form onSubmit={onSubmit}>
        {children}
        <button 
          type="submit" 
          className="btn-primary" 
          style={{ width: '100%', marginTop: '20px' }} 
          disabled={loading}
        >
          {loading ? 'Creating...' : `Create ${title.split(' ')[1]}`}
        </button>
      </form>
    </div>
  </div>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState({ totalUsers: 0, totalStores: 0, totalRatings: 0 });
  const [users, setUsers] = useState([]);
  const [stores, setStores] = useState([]);
  const [userFilters, setUserFilters] = useState({ search: '', role: '', sortBy: 'name', order: 'ASC' });
  const [storeFilters, setStoreFilters] = useState({ search: '', sortBy: 'name', order: 'ASC' });
  const [activeTab, setActiveTab] = useState('users');

  // Modal States
  const [showUserModal, setShowUserModal] = useState(false);
  const [showStoreModal, setShowStoreModal] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', address: '', role: 'user' });
  const [newStore, setNewStore] = useState({ name: '', email: '', address: '', ownerId: '' });
  const [modalError, setModalError] = useState('');
  const [modalLoading, setModalLoading] = useState(false);

  useEffect(() => {
    fetchStats();
    fetchUsers();
    fetchStores();
  }, [userFilters, storeFilters]);

  const fetchStats = async () => {
    try {
      const { data } = await API.get('/admin/stats');
      setStats(data);
    } catch (err) { console.error(err); }
  };

  const fetchUsers = async () => {
    try {
      const { data } = await API.get('/admin/users', { params: userFilters });
      setUsers(data);
    } catch (err) { console.error(err); }
  };

  const fetchStores = async () => {
    try {
      const { data } = await API.get('/admin/stores', { params: storeFilters });
      setStores(data);
    } catch (err) { console.error(err); }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setModalLoading(true);
    setModalError('');
    try {
      await API.post('/admin/add-user', newUser);
      setShowUserModal(false);
      setNewUser({ name: '', email: '', password: '', address: '', role: 'user' });
      fetchUsers();
      fetchStats();
    } catch (err) {
      setModalError(err.response?.data?.message || 'Failed to create user');
    } finally {
      setModalLoading(false);
    }
  };

  const handleCreateStore = async (e) => {
    e.preventDefault();
    setModalLoading(true);
    setModalError('');
    try {
      await API.post('/admin/add-store', newStore);
      setShowStoreModal(false);
      setNewStore({ name: '', email: '', address: '', ownerId: '' });
      fetchStores();
      fetchStats();
    } catch (err) {
      setModalError(err.response?.data?.message || 'Failed to create store');
    } finally {
      setModalLoading(false);
    }
  };

  const handleSort = (setFilters, filters, field) => {
    const order = filters.sortBy === field && filters.order === 'ASC' ? 'DESC' : 'ASC';
    setFilters({ ...filters, sortBy: field, order });
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-main)' }}>
      <Navbar />

      <main className="main-content">
        <header style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: '800' }}>System Administration</h2>
          <p style={{ color: 'var(--text-muted)' }}>Global platform management and monitoring</p>
        </header>

        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="card stat-card glass">
            <div className="stat-icon" style={{ background: '#e0f2fe', color: '#0ea5e9' }}><Users size={24} /></div>
            <div className="stat-value">{stats.totalUsers}</div>
            <div className="stat-label">Total Users</div>
          </div>
          <div className="card stat-card glass">
            <div className="stat-icon" style={{ background: '#fef3c7', color: '#d97706' }}><ShoppingBag size={24} /></div>
            <div className="stat-value">{stats.totalStores}</div>
            <div className="stat-label">Registered Stores</div>
          </div>
          <div className="card stat-card glass">
            <div className="stat-icon" style={{ background: '#dcfce7', color: '#16a34a' }}><Star size={24} /></div>
            <div className="stat-value">{stats.totalRatings}</div>
            <div className="stat-label">Total Ratings</div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={{ display: 'flex', gap: '24px', borderBottom: '1px solid var(--border)', marginBottom: '32px' }}>
          <button onClick={() => setActiveTab('users')} className={activeTab === 'users' ? 'active-tab' : 'inactive-tab'}>Users</button>
          <button onClick={() => setActiveTab('stores')} className={activeTab === 'stores' ? 'active-tab' : 'inactive-tab'}>Stores</button>
        </div>

        {activeTab === 'users' ? (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ position: 'relative' }}>
                  <Search size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
                  <input type="text" placeholder="Search users..." style={{ paddingLeft: '40px', width: '320px' }}
                    value={userFilters.search} onChange={(e) => setUserFilters({ ...userFilters, search: e.target.value })} />
                </div>
                <select value={userFilters.role} onChange={(e) => setUserFilters({ ...userFilters, role: e.target.value })}>
                  <option value="">All Roles</option>
                  <option value="user">User</option>
                  <option value="owner">Owner</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <button className="btn-primary" onClick={() => setShowUserModal(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <PlusCircle size={20} /> Add User
              </button>
            </div>

            <div className="card glass" style={{ padding: '0' }}>
              <table>
                <thead>
                  <tr>
                    <th onClick={() => handleSort(setUserFilters, userFilters, 'name')}>Name <ArrowUpDown size={14} /></th>
                    <th onClick={() => handleSort(setUserFilters, userFilters, 'email')}>Email <ArrowUpDown size={14} /></th>
                    <th onClick={() => handleSort(setUserFilters, userFilters, 'address')}>Address <ArrowUpDown size={14} /></th>
                    <th onClick={() => handleSort(setUserFilters, userFilters, 'role')}>Role <ArrowUpDown size={14} /></th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id}>
                      <td style={{ fontWeight: 600 }}>{u.name}</td>
                      <td>{u.email}</td>
                      <td><div style={{ maxWidth: '200px', fontSize: '13px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.address}</div></td>
                      <td><span className={`badge badge-${u.role}`}>{u.role}</span></td>
                      <td><Link to={`/user-details/${u.id}`} style={{ color: 'var(--primary)' }}><Eye size={18} /></Link></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
              <div style={{ position: 'relative' }}>
                <Search size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
                <input type="text" placeholder="Search stores..." style={{ paddingLeft: '40px', width: '320px' }}
                  value={storeFilters.search} onChange={(e) => setStoreFilters({ ...storeFilters, search: e.target.value })} />
              </div>
              <button className="btn-primary" onClick={() => setShowStoreModal(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <PlusCircle size={20} /> Add Store
              </button>
            </div>

            <div className="card glass" style={{ padding: '0' }}>
              <table>
                <thead>
                  <tr>
                    <th onClick={() => handleSort(setStoreFilters, storeFilters, 'name')}>Name <ArrowUpDown size={14} /></th>
                    <th onClick={() => handleSort(setStoreFilters, storeFilters, 'email')}>Email <ArrowUpDown size={14} /></th>
                    <th onClick={() => handleSort(setStoreFilters, storeFilters, 'address')}>Address <ArrowUpDown size={14} /></th>
                    <th onClick={() => handleSort(setStoreFilters, storeFilters, 'averageRating')}>Rating <ArrowUpDown size={14} /></th>
                  </tr>
                </thead>
                <tbody>
                  {stores.map(s => (
                    <tr key={s.id}>
                      <td style={{ fontWeight: 600 }}>{s.name}</td>
                      <td>{s.email}</td>
                      <td><div style={{ maxWidth: '200px', fontSize: '13px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.address}</div></td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#d97706', fontWeight: 700 }}>
                          <Star size={16} fill="#d97706" /> {s.averageRating ? Number(s.averageRating).toFixed(1) : 'N/A'}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* User Modal */}
      {showUserModal && (
        <Modal
          title="Add New User"
          onClose={() => setShowUserModal(false)}
          onSubmit={handleCreateUser}
          modalError={modalError}
          loading={modalLoading}
        >
          <div className="form-group">
            <label className="label">Full Name</label>
            <input
              type="text"
              required
              minLength={20}
              value={newUser.name}
              onChange={(e) => {
                setNewUser({ ...newUser, name: e.target.value });
                setModalError('');
              }}
            />
          </div>
          <div className="form-group">
            <label className="label">Email</label>
            <input type="email" required value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="label">Password</label>
            <input type="password" required value={newUser.password} onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="label">Address</label>
            <textarea required rows={2} value={newUser.address} onChange={(e) => setNewUser({ ...newUser, address: e.target.value })} style={{ resize: 'none' }} />
          </div>
          <div className="form-group">
            <label className="label">Role</label>
            <select value={newUser.role} onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}>
              <option value="user">Normal User</option>
              <option value="owner">Store Owner</option>
              <option value="admin">Administrator</option>
            </select>
          </div>
        </Modal>
      )}

      {/* Store Modal */}
      {showStoreModal && (
        <Modal
          title="Add New Store"
          onClose={() => setShowStoreModal(false)}
          onSubmit={handleCreateStore}
          modalError={modalError}
          loading={modalLoading}
        >
          <div className="form-group">
            <label className="label">Store Name</label>
            <input
              type="text"
              required
              minLength={20}
              value={newStore.name}
              onChange={(e) => {
                setNewStore({ ...newStore, name: e.target.value });
                setModalError('');
              }}
            />
          </div>
          <div className="form-group">
            <label className="label">Contact Email</label>
            <input type="email" required value={newStore.email} onChange={(e) => setNewStore({ ...newStore, email: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="label">Store Address</label>
            <textarea required rows={2} value={newStore.address} onChange={(e) => setNewStore({ ...newStore, address: e.target.value })} style={{ resize: 'none' }} />
          </div>
          <div className="form-group">
            <label className="label">Store Owner (Email or ID)</label>
            <input type="text" placeholder="UUID of owner" value={newStore.ownerId} onChange={(e) => setNewStore({ ...newStore, ownerId: e.target.value })} />
          </div>
        </Modal>
      )}

      <style>{`
        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 1000; }
        .modal-content { width: 100%; max-width: 500px; max-height: 90vh; overflow-y: auto; }
        .active-tab { border-bottom: 2px solid var(--primary); color: var(--primary); font-weight: 700; background: transparent; padding: 12px 24px; border-radius: 0; }
        .inactive-tab { color: var(--text-muted); font-weight: 500; background: transparent; padding: 12px 24px; border-radius: 0; }
        th { user-select: none; transition: background 0.2s; }
        th:hover { background: #f1f5f9; }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
