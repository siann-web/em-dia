import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { filterTasks, formatDate, getStats, readTasks, STORAGE_KEY } from './tasks.js';
import './style.css';

const navigation = [
  { id: 'inicio', label: 'Visão geral', icon: '◫' },
  { id: 'tarefas', label: 'Minhas tarefas', icon: '☑' },
  { id: 'sobre', label: 'Sobre o projeto', icon: '◇' },
];

function Icon({ children }) {
  return <span className="icon" aria-hidden="true">{children}</span>;
}

function Sidebar({ page, navigate }) {
  return <aside className="sidebar">
    <a className="brand" href="#inicio" onClick={() => navigate('inicio')}>
      <span className="brand-mark">e<span>.</span></span>
      <span>em dia<small>SEU ESPAÇO DE ESTUDOS</small></span>
    </a>
    <div className="nav-label">ESPAÇO DE ESTUDO</div>
    <nav aria-label="Navegação principal">
      {navigation.map((item) => <a key={item.id} href={`#${item.id}`} onClick={() => navigate(item.id)}
        className={page === item.id ? 'nav-item active' : 'nav-item'} aria-current={page === item.id ? 'page' : undefined}>
        <Icon>{item.icon}</Icon>{item.label}
      </a>)}
    </nav>
    <div className="sidebar-note"><span>✳</span><strong>Um passo de cada vez.</strong><p>Pequenos avanços também são grandes conquistas.</p></div>
    <div className="sidebar-footer">FEITO PARA APRENDER <span>✦</span></div>
  </aside>;
}

function StatCard({ icon, label, value, detail, color }) {
  return <article className="stat-card">
    <div className={`stat-icon ${color}`}><Icon>{icon}</Icon></div>
    <div><p>{label}</p><strong>{value}</strong><small>{detail}</small></div>
  </article>;
}

function TaskList({ tasks, toggle, remove }) {
  if (!tasks.length) return <div className="empty"><span>✳</span><strong>Nenhuma tarefa por aqui.</strong><p>Que tal começar com um pequeno passo?</p></div>;
  return <ul className="task-list">{tasks.map((task) => <li className={task.done ? 'task done' : 'task'} key={task.id}>
    <label className="check"><input type="checkbox" checked={task.done} onChange={() => toggle(task.id)} aria-label={`Marcar ${task.title} como ${task.done ? 'pendente' : 'concluída'}`} /><span /></label>
    <div className="task-content"><strong>{task.title}</strong><div><span className="subject">{task.subject}</span><span className="task-date">◷ &nbsp;{formatDate(task.date)}</span></div></div>
    <button className="delete" onClick={() => remove(task.id)} aria-label={`Excluir ${task.title}`} title="Excluir tarefa">×</button>
  </li>)}</ul>;
}

function TaskForm({ add }) {
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [date, setDate] = useState('');
  function submit(event) {
    event.preventDefault();
    if (!title.trim() || !subject.trim()) return;
    add({ title: title.trim(), subject: subject.trim(), date });
    setTitle(''); setSubject(''); setDate('');
  }
  return <form className="task-form" onSubmit={submit}>
    <div className="form-heading"><div><span className="eyebrow">ORGANIZE SEU TEMPO</span><h2>Adicionar tarefa</h2><p>O que você precisa fazer?</p></div><span className="form-spark">✳</span></div>
    <label>Nome da tarefa<input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ex.: Ler capítulo 3" maxLength="100" required /></label>
    <label>Disciplina<input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Ex.: História" maxLength="50" required /></label>
    <label>Prazo <span className="optional">(opcional)</span><input type="date" value={date} onChange={(e) => setDate(e.target.value)} /></label>
    <button className="button primary" type="submit"><span>＋</span> Adicionar tarefa</button>
    <p className="form-foot">✦ &nbsp; Seu progresso fica salvo neste navegador.</p>
  </form>;
}

function App() {
  const pages = navigation.map((item) => item.id);
  const getPage = () => pages.includes(location.hash.slice(1)) ? location.hash.slice(1) : 'inicio';
  const [page, setPage] = useState(getPage);
  const [storageError, setStorageError] = useState('');
  const [tasks, setTasks] = useState(() => {
    try { return readTasks(localStorage); }
    catch { return null; }
  });
  const [filter, setFilter] = useState('all');
  useEffect(() => {
    const onHashChange = () => setPage(getPage());
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);
  useEffect(() => {
    if (tasks === null) return;
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks)); setStorageError(''); }
    catch { setStorageError('Não foi possível salvar neste navegador. As alterações podem ser perdidas ao sair.'); }
  }, [tasks]);
  function add(data) {
    setTasks((current) => [...current, { ...data, id: crypto.randomUUID(), done: false }]);
  }
  function toggle(id) { setTasks((current) => current.map((task) => task.id === id ? { ...task, done: !task.done } : task)); }
  function remove(id) { setTasks((current) => current.filter((task) => task.id !== id)); }
  const safeTasks = tasks || [];
  const stats = getStats(safeTasks);
  const shown = filterTasks(safeTasks, filter);
  return <div className="app"><Sidebar page={page} navigate={setPage} /><main className="main">
    <header className="topbar"><span>SEU CANTINHO DE FOCO <span className="top-star">✳</span></span><div className="top-right"><span>Um dia de cada vez</span><span className="avatar">e.</span></div></header>
    {tasks === null ? <div className="alert" role="alert">Não foi possível carregar as tarefas salvas. Seus dados não foram substituídos; verifique o armazenamento do navegador e recarregue a página.</div> : storageError && <div className="alert" role="alert">{storageError}</div>}
    {page === 'sobre' ? <section className="about page-content"><span className="eyebrow">CONHEÇA O EM DIA</span><h1>Um lugar para organizar <em>suas ideias.</em></h1><p>O Em dia é um espaço simples para ajudar estudantes a organizar tarefas e acompanhar seu progresso, sem complicar a rotina.</p><div className="about-card"><span>✳</span><div><h2>Menos pressão, mais progresso.</h2><p>Adicione suas atividades, defina prazos e celebre cada tarefa concluída. Suas informações ficam salvas apenas neste navegador.</p><a className="text-link" href="#tarefas" onClick={() => setPage('tarefas')}>Começar a organizar →</a></div></div></section> :
    <div className="page-content">
      <div className="intro"><div><span className="eyebrow"><span className="eyebrow-dot" /> SEU ESPAÇO DE ESTUDOS</span><h1>{page === 'inicio' ? <>Olá, estudante<span className="hello">✳</span><br /><em>vamos com calma?</em></> : <>Suas tarefas,<br /><em>no seu ritmo.</em></>}</h1><p>{page === 'inicio' ? 'Organize suas tarefas, acompanhe seu progresso e faça acontecer, um passo de cada vez.' : 'Tudo o que você precisa fazer, organizado em um só lugar.'}</p></div><div className="intro-art" aria-hidden="true"><div className="art-orbit orbit-one" /><div className="art-orbit orbit-two" /><span className="art-star">✳</span><span className="art-small">✦</span><span className="art-caption">CRESÇA NO<br />SEU TEMPO</span></div></div>
      <div className="stats">
        <StatCard icon="▤" label="Total de tarefas" value={stats.total} detail="na sua lista" color="lilac" />
        <StatCard icon="◷" label="Pendentes" value={stats.pending} detail="para fazer" color="peach" />
        <StatCard icon="✓" label="Concluídas" value={stats.completed} detail="passos dados" color="green" />
      </div>
      <div className="workspace">
        <section className="tasks-panel"><div className="section-heading"><div><span className="eyebrow">UM PASSO DE CADA VEZ</span><h2>{page === 'inicio' ? 'Seu plano de estudos' : 'Minhas tarefas'} <span>↗</span></h2><p>Um pouco de organização vai longe.</p></div><span className="count-badge">{stats.total} {stats.total === 1 ? 'tarefa' : 'tarefas'}</span></div>
          <div className="filters" aria-label="Filtrar tarefas">{[['all', 'Todas'], ['pending', 'Pendentes'], ['done', 'Concluídas']].map(([value, label]) => <button key={value} className={filter === value ? 'selected' : ''} aria-pressed={filter === value} onClick={() => setFilter(value)}>{label}</button>)}</div>
          <TaskList tasks={shown} toggle={toggle} remove={remove} />
        </section>
        <div className="right-column"><div className="progress-card"><div className="progress-top"><span>SEU PROGRESSO</span><span>✳</span></div><div className="progress-number">{stats.percent}<span>%</span></div><p>das suas tarefas concluídas</p><div className="progress-track" role="progressbar" aria-label="Tarefas concluídas" aria-valuenow={stats.percent} aria-valuemin="0" aria-valuemax="100"><span style={{ width: `${stats.percent}%` }} /></div><small>{stats.completed} de {stats.total} tarefas concluídas</small></div>
          {tasks !== null && <TaskForm add={add} />}
        </div>
      </div>
    </div>}
    <footer>FEITO COM CALMA E UM POUQUINHO DE CAFÉ <span>✦</span> <span>EM DIA © {new Date().getFullYear()}</span></footer>
  </main></div>;
}

createRoot(document.getElementById('root')).render(<App />);
