import React, { useState } from 'react';

const COLOR_OPTIONS    = ['cyan', 'purple', 'blue'];
const CATEGORY_OPTIONS = ['Languages & Data', 'Systems & Infrastructure', 'Enterprise Operations'];

// ─── Shared form primitives ───────────────────────────────────────────────────

function Field({ label, children }) {
  return (
    <div className="af-field">
      <label className="af-label">{label}</label>
      {children}
    </div>
  );
}

const TextInput = ({ value, onChange, placeholder, className = '' }) => (
  <input
    type="text"
    value={value ?? ''}
    onChange={e => onChange(e.target.value)}
    placeholder={placeholder}
    className={`af-input ${className}`}
  />
);

const TextArea = ({ value, onChange, rows = 4, placeholder }) => (
  <textarea
    value={value ?? ''}
    onChange={e => onChange(e.target.value)}
    rows={rows}
    placeholder={placeholder}
    className="af-textarea"
  />
);

const Select = ({ value, onChange, options }) => (
  <select value={value} onChange={e => onChange(e.target.value)} className="af-select">
    {options.map(o => <option key={o} value={o}>{o}</option>)}
  </select>
);

const Btn = ({ onClick, children, variant = 'ghost', size = 'sm', disabled, type = 'button' }) => (
  <button type={type} onClick={onClick} disabled={disabled}
    className={`af-btn af-btn--${variant} af-btn--${size}`}>
    {children}
  </button>
);

// ─── Profile tab ─────────────────────────────────────────────────────────────

function ProfileTab({ data, onChange }) {
  const set = key => val => onChange({ ...data, [key]: val });
  return (
    <div className="af-tab-content">
      <div className="af-two-col">
        <Field label="Full Name">
          <TextInput value={data.name} onChange={set('name')} />
        </Field>
        <Field label="Title / Role">
          <TextInput value={data.title} onChange={set('title')} />
        </Field>
        <Field label="Location">
          <TextInput value={data.location} onChange={set('location')} />
        </Field>
        <Field label="Phone">
          <TextInput value={data.phone} onChange={set('phone')} placeholder="+1 234 567 890" />
        </Field>
        <Field label="Email">
          <TextInput value={data.email} onChange={set('email')} placeholder="you@example.com" />
        </Field>
        <Field label="LinkedIn URL">
          <TextInput value={data.linkedin} onChange={set('linkedin')} placeholder="https://linkedin.com/in/..." />
        </Field>
        <Field label="GitHub URL">
          <TextInput value={data.github} onChange={set('github')} placeholder="https://github.com/..." />
        </Field>
      </div>
      <Field label="Professional Summary">
        <TextArea value={data.summary} onChange={set('summary')} rows={6} placeholder="Your professional summary..." />
      </Field>
    </div>
  );
}

// ─── Skills tab ───────────────────────────────────────────────────────────────

function SkillsTab({ data, onChange }) {
  const update = (i, key, val) =>
    onChange(data.map((s, idx) => idx === i ? { ...s, [key]: val } : s));
  const add = () =>
    onChange([...data, { name: 'New Skill', category: 'Languages & Data', color: 'cyan', level: 75 }]);
  const remove = i => onChange(data.filter((_, idx) => idx !== i));

  return (
    <div className="af-tab-content">
      <div className="af-list-header">
        <span className="af-list-count">{data.length} skills</span>
        <Btn onClick={add} variant="cyan" size="sm">+ Add Skill</Btn>
      </div>
      <div className="af-skill-list">
        {data.map((skill, i) => (
          <div key={i} className={`af-skill-row af-skill-row--${skill.color}`}>
            <div className="af-skill-row__top">
              <TextInput value={skill.name} onChange={v => update(i, 'name', v)} className="af-input--grow" />
              <Btn onClick={() => remove(i)} variant="danger" size="xs">✕</Btn>
            </div>
            <div className="af-skill-row__meta">
              <Select value={skill.category} onChange={v => update(i, 'category', v)} options={CATEGORY_OPTIONS} />
              <Select value={skill.color}    onChange={v => update(i, 'color', v)}    options={COLOR_OPTIONS} />
              <div className="af-skill-level">
                <input
                  type="number" min="1" max="100"
                  value={skill.level}
                  onChange={e => update(i, 'level', Number(e.target.value))}
                  className="af-input af-input--xs"
                />
                <span className="af-unit">%</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Experience tab ───────────────────────────────────────────────────────────

function ExperienceTab({ data, onChange }) {
  const updateEntry  = (i, k, v)      => onChange(data.map((e, idx) => idx === i ? { ...e, [k]: v } : e));
  const updateBullet = (ei, bi, v)    => updateEntry(ei, 'bullets', data[ei].bullets.map((b, idx) => idx === bi ? v : b));
  const addBullet    = ei             => updateEntry(ei, 'bullets', [...data[ei].bullets, '']);
  const removeBullet = (ei, bi)       => updateEntry(ei, 'bullets', data[ei].bullets.filter((_, idx) => idx !== bi));
  const removeEntry  = i              => onChange(data.filter((_, idx) => idx !== i));
  const addEntry     = ()             => onChange([...data, {
    role: 'New Role', company: 'Company Name', period: '2024 – Present',
    type: 'Engineering', color: 'cyan', bullets: [''],
  }]);

  return (
    <div className="af-tab-content">
      <div className="af-list-header">
        <span className="af-list-count">{data.length} entries</span>
        <Btn onClick={addEntry} variant="cyan" size="sm">+ Add Entry</Btn>
      </div>

      {data.map((entry, i) => (
        <div key={i} className={`af-exp-card af-exp-card--${entry.color}`}>
          <div className="af-exp-card__header">
            <TextInput value={entry.role} onChange={v => updateEntry(i, 'role', v)}
              placeholder="Job Title" className="af-input--grow" />
            <Btn onClick={() => removeEntry(i)} variant="danger" size="sm">Remove</Btn>
          </div>

          <div className="af-two-col">
            <Field label="Company">
              <TextInput value={entry.company} onChange={v => updateEntry(i, 'company', v)} />
            </Field>
            <Field label="Period">
              <TextInput value={entry.period} onChange={v => updateEntry(i, 'period', v)} placeholder="2020 – Present" />
            </Field>
            <Field label="Type Badge">
              <TextInput value={entry.type} onChange={v => updateEntry(i, 'type', v)} placeholder="Engineering" />
            </Field>
            <Field label="Colour">
              <Select value={entry.color} onChange={v => updateEntry(i, 'color', v)} options={COLOR_OPTIONS} />
            </Field>
          </div>

          <div className="af-bullets-block">
            <span className="af-label">Achievement Bullets</span>
            {entry.bullets.map((bullet, bi) => (
              <div key={bi} className="af-bullet-row">
                <span className="af-bullet-icon">▸</span>
                <TextArea value={bullet} onChange={v => updateBullet(i, bi, v)}
                  rows={2} placeholder="Describe this achievement…" />
                <Btn onClick={() => removeBullet(i, bi)} variant="danger" size="xs">✕</Btn>
              </div>
            ))}
            <Btn onClick={() => addBullet(i)} variant="ghost" size="sm">+ Add Bullet</Btn>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Education tab ────────────────────────────────────────────────────────────

function EducationTab({ data, onChange }) {
  const updateEntry     = (i, k, v) => onChange(data.map((e, idx) => idx === i ? { ...e, [k]: v } : e));
  const updateHighlight = (ei, hi, v) => updateEntry(ei, 'highlights', data[ei].highlights.map((h, idx) => idx === hi ? v : h));
  const addHighlight    = ei          => updateEntry(ei, 'highlights', [...data[ei].highlights, '']);
  const removeHighlight = (ei, hi)    => updateEntry(ei, 'highlights', data[ei].highlights.filter((_, idx) => idx !== hi));
  const removeEntry     = i           => onChange(data.filter((_, idx) => idx !== i));
  const addEntry        = ()          => onChange([...data, {
    degree: 'Degree / Qualification', institution: 'Institution Name',
    year: String(new Date().getFullYear()), highlights: [''],
  }]);

  return (
    <div className="af-tab-content">
      <div className="af-list-header">
        <span className="af-list-count">{data.length} entries</span>
        <Btn onClick={addEntry} variant="cyan" size="sm">+ Add Entry</Btn>
      </div>

      {data.map((edu, i) => (
        <div key={i} className="af-edu-card">
          <div className="af-exp-card__header">
            <TextInput value={edu.degree} onChange={v => updateEntry(i, 'degree', v)}
              placeholder="Degree / Qualification" className="af-input--grow" />
            <Btn onClick={() => removeEntry(i)} variant="danger" size="sm">Remove</Btn>
          </div>

          <div className="af-two-col">
            <Field label="Institution">
              <TextInput value={edu.institution} onChange={v => updateEntry(i, 'institution', v)} />
            </Field>
            <Field label="Year">
              <TextInput value={edu.year} onChange={v => updateEntry(i, 'year', v)} placeholder="2022" />
            </Field>
          </div>

          <div className="af-bullets-block">
            <span className="af-label">Highlights</span>
            {edu.highlights.map((h, hi) => (
              <div key={hi} className="af-bullet-row">
                <TextInput value={h} onChange={v => updateHighlight(i, hi, v)}
                  placeholder="Achievement or detail…" className="af-input--grow" />
                <Btn onClick={() => removeHighlight(i, hi)} variant="danger" size="xs">✕</Btn>
              </div>
            ))}
            <Btn onClick={() => addHighlight(i)} variant="ghost" size="sm">+ Add Highlight</Btn>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Auth screen ──────────────────────────────────────────────────────────────

function AuthScreen({ onAuth }) {
  const [pw, setPw]     = useState('');
  const [error, setErr] = useState('');

  const submit = e => {
    e.preventDefault();
    if (!pw.trim()) { setErr('Enter the admin password.'); return; }
    onAuth(pw.trim());
  };

  return (
    <div className="af-auth">
      <div className="grid-bg" aria-hidden="true" />
      <div className="af-auth__card">
        <div className="af-auth__icon">🔐</div>
        <h2 className="af-auth__title">Admin Access</h2>
        <p className="af-auth__sub">Enter the server password to edit CV content.</p>
        {error && <p className="af-auth__error">{error}</p>}
        <form onSubmit={submit} className="af-auth__form">
          <input
            type="password" value={pw} autoFocus
            onChange={e => { setPw(e.target.value); setErr(''); }}
            placeholder="Admin password…"
            className="af-input af-input--lg"
          />
          <Btn type="submit" variant="cyan" size="lg">Unlock</Btn>
        </form>
        <a href="#" onClick={() => { window.location.hash = ''; }} className="af-auth__back">
          ← Back to portfolio
        </a>
      </div>
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

export default function AdminPanel({ initialData, onSave }) {
  const [password, setPassword] = useState(() => sessionStorage.getItem('cv_admin_pw') || '');
  const [authed, setAuthed]     = useState(false);
  const [data, setData]         = useState(initialData);
  const [tab, setTab]           = useState('profile');
  const [status, setStatus]     = useState('idle'); // idle | saving | success | error | auth_error

  const handleAuth = pw => {
    setPassword(pw);
    sessionStorage.setItem('cv_admin_pw', pw);
    setAuthed(true);
    setStatus('idle');
  };

  const setSection = (key, val) => setData(prev => ({ ...prev, [key]: val }));

  const handleSave = async () => {
    setStatus('saving');
    try {
      const res = await fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-password': password },
        body: JSON.stringify(data),
      });
      if (res.status === 401) {
        sessionStorage.removeItem('cv_admin_pw');
        setAuthed(false);
        setStatus('idle');
        return;
      }
      if (!res.ok) throw new Error('Server error');
      onSave(data);
      setStatus('success');
      setTimeout(() => setStatus('idle'), 3500);
    } catch {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3500);
    }
  };

  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url  = URL.createObjectURL(blob);
    const a    = Object.assign(document.createElement('a'), { href: url, download: 'cv-data.json' });
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!authed) return <AuthScreen onAuth={handleAuth} />;

  const TABS = [
    { key: 'profile',    label: 'Profile'    },
    { key: 'skills',     label: 'Skills'     },
    { key: 'experience', label: 'Experience' },
    { key: 'education',  label: 'Education'  },
  ];

  return (
    <div className="admin-panel">
      <div className="grid-bg" aria-hidden="true" />

      {/* Sticky header */}
      <div className="af-header">
        <a href="#" onClick={() => { window.location.hash = ''; }} className="af-back-btn">
          ← Portfolio
        </a>
        <div className="af-header__title">
          <span className="af-header__prefix">//</span> CV ADMIN PANEL
        </div>
        <div className="af-header__actions">
          {status === 'saving'  && <span className="af-status af-status--saving">Saving…</span>}
          {status === 'success' && <span className="af-status af-status--success">✓ Saved</span>}
          {status === 'error'   && <span className="af-status af-status--error">✗ Error — check server</span>}
          <Btn onClick={exportJSON} variant="ghost" size="sm">Export JSON</Btn>
          <Btn onClick={handleSave} variant="cyan" size="md" disabled={status === 'saving'}>
            {status === 'saving' ? 'Saving…' : 'Save to Server'}
          </Btn>
        </div>
      </div>

      {/* Tabs */}
      <div className="af-tabs">
        {TABS.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`af-tab ${tab === t.key ? 'af-tab--active' : ''}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="af-body">
        {tab === 'profile'    && <ProfileTab    data={data.profile}    onChange={v => setSection('profile', v)} />}
        {tab === 'skills'     && <SkillsTab     data={data.skills}     onChange={v => setSection('skills', v)} />}
        {tab === 'experience' && <ExperienceTab data={data.experience} onChange={v => setSection('experience', v)} />}
        {tab === 'education'  && <EducationTab  data={data.education}  onChange={v => setSection('education', v)} />}
      </div>
    </div>
  );
}
