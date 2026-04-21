import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import TaskModal from '../components/TaskModal';

const Dashboard = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [t, p] = await Promise.all([
        axios.get('/api/tasks', { withCredentials: true }),
        axios.get('/api/projects', { withCredentials: true }),
      ]);
      setTasks(t.data);
      setProjects(p.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const stats = {
    total: tasks.length,
    todo: tasks.filter(t => t.status === 'todo').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    done: tasks.filter(t => t.status === 'done').length,
  };

  const recentTasks = tasks.slice(0, 5);

  if (loading) return <div style={{ padding: '2rem', color: '#94a3b8' }}>Loading…</div>;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Good day, {user?.name?.split(' ')[0]} 👋</h1>
          <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            Here's what's on your plate today
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          + New Task
        </button>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        {[
          { label: 'Total Tasks', value: stats.total, color: '#818cf8' },
          { label: 'To Do', value: stats.todo, color: '#94a3b8' },
          { label: 'In Progress', value: stats.inProgress, color: '#f59e0b' },
          { label: 'Completed', value: stats.done, color: '#22c55e' },
        ].map(s => (
          <div className="stat-card" key={s.label}>
            <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        {/* Recent Tasks */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 700 }}>Recent Tasks</h2>
            <Link to="/tasks" style={{ fontSize: '0.8rem', color: '#818cf8' }}>View all →</Link>
          </div>
          {recentTasks.length === 0 ? (
            <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>No tasks yet. Create your first one!</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {recentTasks.map(task => (
                <div key={task._id} style={{
                  display: 'flex', alignItems: 'center', gap: '0.75rem',
                  padding: '0.6rem 0', borderBottom: '1px solid #1e293b'
                }}>
                  <span className={`badge badge-${task.status}`}>{task.status}</span>
                  <span style={{ fontSize: '0.875rem', flex: 1 }}>{task.title}</span>
                  <span className={`badge badge-${task.priority}`}>{task.priority}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Projects */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 700 }}>Projects</h2>
            <Link to="/projects" style={{ fontSize: '0.8rem', color: '#818cf8' }}>View all →</Link>
          </div>
          {projects.length === 0 ? (
            <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>No projects yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {projects.slice(0, 5).map(project => (
                <div key={project._id} style={{
                  display: 'flex', alignItems: 'center', gap: '0.75rem',
                  padding: '0.6rem 0', borderBottom: '1px solid #1e293b'
                }}>
                  <span style={{
                    width: 10, height: 10, borderRadius: '50%',
                    background: project.color, flexShrink: 0
                  }} />
                  <span style={{ fontSize: '0.875rem' }}>{project.title}</span>
                  <span style={{ marginLeft: 'auto', fontSize: '0.75rem', color: '#94a3b8' }}>
                    {tasks.filter(t => t.project?._id === project._id || t.project === project._id).length} tasks
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <TaskModal
          onClose={() => setShowModal(false)}
          onSave={(newTask) => setTasks(prev => [newTask, ...prev])}
        />
      )}
    </div>
  );
};

export default Dashboard;
