import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const icons = {
  dashboard: '⊞',
  tasks: '✓',
  projects: '◈',
  logout: '→',
  menu: '☰',
};

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <>
      <button className="mobile-menu-btn" onClick={() => setOpen(o => !o)} aria-label="Toggle menu">
        {icons.menu}
      </button>

      <aside className={`sidebar ${open ? 'open' : ''}`} onClick={() => setOpen(false)}>
        <div className="logo">Task<span>Flow</span></div>

        <nav>
          <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>
            <span>{icons.dashboard}</span> Dashboard
          </NavLink>
          <NavLink to="/tasks" className={({ isActive }) => isActive ? 'active' : ''}>
            <span>{icons.tasks}</span> Tasks
          </NavLink>
          <NavLink to="/projects" className={({ isActive }) => isActive ? 'active' : ''}>
            <span>{icons.projects}</span> Projects
          </NavLink>
        </nav>

        <div className="sidebar-footer">
          <div style={{ fontSize: '0.8rem', color: '#94a3b8', padding: '0 0.75rem', marginBottom: '0.5rem' }}>
            {user?.name}
          </div>
          <button className="btn btn-ghost" style={{ width: '100%' }} onClick={handleLogout}>
            <span>{icons.logout}</span> Sign Out
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
