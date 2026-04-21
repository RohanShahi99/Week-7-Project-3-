import axios from 'axios';

const TaskCard = ({ task, onEdit, onDelete }) => {
  const handleDelete = async () => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await axios.delete(`/api/tasks/${task._id}`, { withCredentials: true });
      onDelete(task._id);
    } catch (err) {
      alert('Failed to delete task');
    }
  };

  const dueDateStr = task.dueDate
    ? new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    : null;

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'done';

  return (
    <div className="task-card">
      <div className="task-title">{task.title}</div>

      {task.description && (
        <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: 0 }}>
          {task.description.length > 80 ? task.description.slice(0, 80) + '…' : task.description}
        </p>
      )}

      <div className="task-meta">
        <span className={`badge badge-${task.status}`}>{task.status}</span>
        <span className={`badge badge-${task.priority}`}>{task.priority}</span>
        {task.project && (
          <span style={{
            fontSize: '0.72rem', color: '#94a3b8',
            background: '#263348', padding: '0.15rem 0.5rem',
            borderRadius: '999px'
          }}>
            {task.project.title}
          </span>
        )}
        {dueDateStr && (
          <span style={{
            fontSize: '0.72rem',
            color: isOverdue ? '#ef4444' : '#94a3b8',
            marginLeft: 'auto'
          }}>
            {isOverdue ? '⚠ ' : '📅 '}{dueDateStr}
          </span>
        )}
      </div>

      <div className="task-actions">
        <button className="btn btn-ghost btn-sm" onClick={() => onEdit(task)}>Edit</button>
        <button className="btn btn-danger btn-sm" onClick={handleDelete}>Delete</button>
      </div>
    </div>
  );
};

export default TaskCard;
