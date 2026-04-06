import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { LogOut, Store, User, Shield, Key } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="navbar glass">
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ background: 'var(--primary)', color: 'white', padding: '8px', borderRadius: '10px' }}>
          <Store size={24} />
        </div>
        <h1 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--primary)' }}>StoRate</h1>
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        <Link to="/profile" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)' }}>
          <User size={20} />
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-main)' }}>{user?.name}</span>
            <span className={`badge badge-${user?.role}`} style={{ fontSize: '10px' }}>{user?.role}</span>
          </div>
        </Link>
        
        <button 
          onClick={logout} 
          className="glass" 
          style={{ 
            padding: '10px 16px', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px',
            color: 'var(--danger)',
            border: '1px solid #fee2e2'
          }}
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
