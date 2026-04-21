import { useState, useEffect } from 'react';
import axios from 'axios';

const STATUSES = ['todo', 'in-progress', 'done'];
const PRIORITIES = ['low', 'medium', 'high'];

const TaskModal = ({ task, onClose, onSave }) => {
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState({
    title: task?.title || '',
    description: task?.description || '',
    status: task?.status || 'todo',
    priority: task?.priority || 'medium',
    dueDate: task?.dueDate ? task.dueDate.slice(0, 10) : '',
    project: task?.project?._id || task?.project || '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios.get('/api/projects', { withCredentials: true })
      .then(res => setProjects(res.data))
      .catch(() => {});
  }, []);

  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = 'Title is required';
    if (form.dueDate && new Date(form.dueDate) < new Date(new Date().toDateString()))
      errs.dueDate = 'Due date cannot be in the past';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      const payload = { ...form };
      if (!payload.project) delete payload.project;
      if (!payload.dueDate) delete payload.dueDate;

      let saved;
      if (task?._id) {
        const res = await axios.put(`/api/tasks/${task._id}`, payload, { withCredentials: true });
        saved = res.data;
      } else {
        const res = await axios.post('/api/tasks', payload, { withCredentials: true });
        saved = res.data;
      }
      onSave(saved);
      onClose();
    } catch (err) {
      setErrors({ server: err.response?.data?.message || 'Failed to save task' });
    } finally {
      setLoading(false);
    }
  };

  const change = (e) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setErrors(er => ({ ...er, [e.target.name]: '' }));
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <h2>{task ? 'Edit Task' : 'New Task'}</h2>

        {errors.server && (
          <div style={{ color: '#ef4444', marginBottom: '1rem', fontSize: '0.875rem' }}>{errors.server}</div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label>Title *</label>
            <input name="title" className={`form-control ${errors.title ? 'is-invalid' : ''}`}
              placeholder="Task title" value={form.title} onChange={change} />
            {errors.title && <div className="invalid-feedback">{errors.title}</div>}
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea name="description" className="form-control" rows={3}
              placeholder="Optional details…" value={form.description} onChange={change} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label>Status</label>
              <select name="status" className="form-control" value={form.status} onChange={change}>
                {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label>Priority</label>
              <select name="priority" className="form-control" value={form.priority} onChange={change}>
                {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Due Date</label>
            <input type="date" name="dueDate" className={`form-control ${errors.dueDate ? 'is-invalid' : ''}`}
              value={form.dueDate} onChange={change} />
            {errors.dueDate && <div className="invalid-feedback">{errors.dueDate}</div>}
          </div>

          <div className="form-group">
            <label>Project</label>
            <select name="project" className="form-control" value={form.project} onChange={change}>
              <option value="">— No project —</option>
              {projects.map(p => <option key={p._id} value={p._id}>{p.title}</option>)}
            </select>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving…' : task ? 'Update Task' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
