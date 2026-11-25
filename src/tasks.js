export const STORAGE_KEY = 'em-dia-tarefas-v1';

export function readTasks(storage) {
  const raw = storage.getItem(STORAGE_KEY);
  if (!raw) return [];
  const data = JSON.parse(raw);
  if (!Array.isArray(data) || !data.every((item) =>
    item && typeof item.id === 'string' && typeof item.title === 'string' &&
    typeof item.subject === 'string' && typeof item.date === 'string' &&
    typeof item.done === 'boolean')) {
    throw new Error('Dados de tarefas inválidos.');
  }
  return data;
}

export function getStats(tasks) {
  const completed = tasks.filter((task) => task.done).length;
  return {
    total: tasks.length,
    completed,
    pending: tasks.length - completed,
    percent: tasks.length ? Math.round((completed / tasks.length) * 100) : 0,
  };
}

export function filterTasks(tasks, filter) {
  const filtered = tasks.filter((task) =>
    filter === 'all' || (filter === 'done' ? task.done : !task.done));
  return [...filtered].sort((a, b) =>
    Number(a.done) - Number(b.done) || (a.date || '9999').localeCompare(b.date || '9999'));
}

export function formatDate(date) {
  if (!date) return 'Sem prazo';
  const [year, month, day] = date.split('-');
  return `${day}/${month}/${year}`;
}
