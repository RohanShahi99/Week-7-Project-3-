import { useState, useEffect } from 'react';
import axios from 'axios';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';

const STATUSES = ['all', 'todo', 'in-progress', 'done'];
const PRIORITIES = ['all', 'low', 'medium', 'high'];

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [search, setSearch] = useState('');

  const fetchTasks = async () => {
    try {
      const res = await axios.get('/api/tasks', { withCredentials: true });
      setTasks(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTasks(); }, []);

  const handleSave = (saved) => {
    setTasks(prev => {
      const exists = prev.find(t => t._id === saved._id);
      return exists
        ? prev.map(t => t._id === saved._id ? saved : t)
        : [saved, ...prev];
    });
  };

  const handleDelete = (id) => setTasks(prev => prev.filter(t => t._id !== id));

  const handleEdit = (task) => { setEditTask(task); setShowModal(true); };

  const openNew = () => { setEditTask(null); setShowModal(true); };

  const filtered = tasks.filter(t => {
    if (filterStatus !== 'all' && t.status !== filterStatus) return false;
    if (filterPriority !== 'all' && t.priority !== filterPriority) return false;
    if (search && !t.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div>
      <div className="page-header">
        <h1>Tasks</h1>
        <button className="btn btn-primary" onClick={openNew}>+ New Task</button>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          className="form-control"
          style={{ maxWidth: 220 }}
          placeholder="Search tasks…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />

        <div style={{ display: 'flex', gap: '0.4rem' }}>
          {STATUSES.map(s => (
            <button
              key={s}
              className={`btn btn-sm ${filterStatus === s ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setFilterStatus(s)}
            >
              {s === 'all' ? 'All' : s}
            </button>
          ))}
        </div>

        <select
          className="form-control"
          style={{ maxWidth: 140 }}
          value={filterPriority}
          onChange={e => setFilterPriority(e.target.value)}
        >
          {PRIORITIES.map(p => <option key={p} value={p}>{p === 'all' ? 'All priorities' : p}</option>)}
        </select>

        <span style={{ color: '#94a3b8', fontSize: '0.82rem', marginLeft: 'auto' }}>
          {filtered.length} task{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      {loading ? (
        <p style={{ color: '#94a3b8' }}>Loading tasks…</p>
      ) : filtered.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
          {tasks.length === 0 ? 'No tasks yet. Create your first one!' : 'No tasks match your filters.'}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
          {filtered.map(task => (
            <TaskCard key={task._id} task={task} onEdit={handleEdit} onDelete={handleDelete} />
          ))}
        </div>
      )}

      {showModal && (
        <TaskModal
          task={editTask}
          onClose={() => { setShowModal(false); setEditTask(null); }}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default Tasks;
