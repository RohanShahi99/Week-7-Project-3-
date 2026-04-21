import { useState, useEffect } from 'react';
import axios from 'axios';

const COLORS = ['#6366f1', '#ec4899', '#f59e0b', '#22c55e', '#06b6d4', '#f97316', '#8b5cf6'];

const ProjectModal = ({ project, onClose, onSave }) => {
  const [form, setForm] = useState({
    title: project?.title || '',
    description: project?.description || '',
    color: project?.color || COLORS[0],
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = 'Title is required';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      let saved;
      if (project?._id) {
        const res = await axios.put(`/api/projects/${project._id}`, form, { withCredentials: true });
        saved = res.data;
      } else {
        const res = await axios.post('/api/projects', form, { withCredentials: true });
        saved = res.data;
      }
      onSave(saved);
      onClose();
    } catch (err) {
      setErrors({ server: err.response?.data?.message || 'Failed to save' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <h2>{project ? 'Edit Project' : 'New Project'}</h2>

        {errors.server && <div style={{ color: '#ef4444', marginBottom: '1rem', fontSize: '0.875rem' }}>{errors.server}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label>Title *</label>
            <input
              className={`form-control ${errors.title ? 'is-invalid' : ''}`}
              placeholder="Project name"
              value={form.title}
              onChange={e => { setForm(f => ({ ...f, title: e.target.value })); setErrors({}); }}
            />
            {errors.title && <div className="invalid-feedback">{errors.title}</div>}
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              className="form-control" rows={3}
              placeholder="What is this project about?"
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            />
          </div>

          <div className="form-group">
            <label>Color</label>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.25rem' }}>
              {COLORS.map(c => (
                <button
                  key={c} type="button"
                  onClick={() => setForm(f => ({ ...f, color: c }))}
                  style={{
                    width: 28, height: 28, borderRadius: '50%', background: c, border: 'none',
                    cursor: 'pointer',
                    outline: form.color === c ? `3px solid white` : 'none',
                    outlineOffset: 2,
                  }}
                />
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving…' : project ? 'Update' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ─── Main Projects Page ───────────────────────────────────────────────────────
const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editProject, setEditProject] = useState(null);

  const fetchAll = async () => {
    try {
      const [p, t] = await Promise.all([
        axios.get('/api/projects', { withCredentials: true }),
        axios.get('/api/tasks', { withCredentials: true }),
      ]);
      setProjects(p.data);
      setTasks(t.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const handleSave = (saved) => {
    setProjects(prev => {
      const exists = prev.find(p => p._id === saved._id);
      return exists ? prev.map(p => p._id === saved._id ? saved : p) : [saved, ...prev];
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this project and all its tasks?')) return;
    try {
      await axios.delete(`/api/projects/${id}`, { withCredentials: true });
      setProjects(prev => prev.filter(p => p._id !== id));
      setTasks(prev => prev.filter(t => t.project?._id !== id && t.project !== id));
    } catch {
      alert('Failed to delete project');
    }
  };

  const taskCount = (projectId) =>
    tasks.filter(t => t.project?._id === projectId || t.project === projectId).length;

  const doneCount = (projectId) =>
    tasks.filter(t => (t.project?._id === projectId || t.project === projectId) && t.status === 'done').length;

  return (
    <div>
      <div className="page-header">
        <h1>Projects</h1>
        <button className="btn btn-primary" onClick={() => { setEditProject(null); setShowModal(true); }}>
          + New Project
        </button>
      </div>

      {loading ? (
        <p style={{ color: '#94a3b8' }}>Loading…</p>
      ) : projects.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
          No projects yet. Create your first one!
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
          {projects.map(project => {
            const total = taskCount(project._id);
            const done = doneCount(project._id);
            const pct = total > 0 ? Math.round((done / total) * 100) : 0;

            return (
              <div className="card" key={project._id} style={{ borderTop: `3px solid ${project.color}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <h3 style={{ fontWeight: 700, fontSize: '1rem' }}>{project.title}</h3>
                  <div style={{ display: 'flex', gap: '0.4rem' }}>
                    <button className="btn btn-ghost btn-sm" onClick={() => { setEditProject(project); setShowModal(true); }}>Edit</button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(project._id)}>Del</button>
                  </div>
                </div>

                {project.description && (
                  <p style={{ color: '#94a3b8', fontSize: '0.82rem', marginBottom: '1rem' }}>
                    {project.description}
                  </p>
                )}

                <div style={{ marginTop: 'auto' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: '#94a3b8', marginBottom: '0.4rem' }}>
                    <span>{done}/{total} tasks done</span>
                    <span>{pct}%</span>
                  </div>
                  <div style={{ background: '#334155', borderRadius: 999, height: 6, overflow: 'hidden' }}>
                    <div style={{
                      height: '100%', background: project.color,
                      width: `${pct}%`, transition: 'width 0.4s ease', borderRadius: 999
                    }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showModal && (
        <ProjectModal
          project={editProject}
          onClose={() => { setShowModal(false); setEditProject(null); }}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default Projects;
