import test from 'node:test';
import assert from 'node:assert/strict';
import { filterTasks, formatDate, getStats, readTasks, STORAGE_KEY } from '../src/tasks.js';

const tasks = [
  { id: '1', title: 'A', subject: 'Matemática', date: '', done: false },
  { id: '2', title: 'B', subject: 'História', date: '2026-03-05', done: true },
  { id: '3', title: 'C', subject: 'História', date: '2026-02-01', done: false },
];

test('calcula progresso e trata lista vazia', () => {
  assert.deepEqual(getStats(tasks), { total: 3, completed: 1, pending: 2, percent: 33 });
  assert.equal(getStats([]).percent, 0);
});
test('filtra e ordena tarefas sem modificar a lista original', () => {
  assert.deepEqual(filterTasks(tasks, 'all').map((task) => task.id), ['3', '1', '2']);
  assert.deepEqual(filterTasks(tasks, 'pending').map((task) => task.id), ['3', '1']);
  assert.deepEqual(filterTasks(tasks, 'done').map((task) => task.id), ['2']);
  assert.deepEqual(tasks.map((task) => task.id), ['1', '2', '3']);
  assert.equal(formatDate('2026-03-05'), '05/03/2026');
  assert.equal(formatDate(''), 'Sem prazo');
});
test('carrega dados válidos e rejeita dados corrompidos', () => {
  assert.deepEqual(readTasks({ getItem: (key) => key === STORAGE_KEY ? JSON.stringify(tasks) : null }), tasks);
  assert.deepEqual(readTasks({ getItem: () => null }), []);
  assert.throws(() => readTasks({ getItem: () => '{"x":1}' }));
});
