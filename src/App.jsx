import React, {
  useState, useEffect, useRef, useCallback, useMemo,
  createContext, useContext,
} from 'react';
import AdminPanel from './AdminPanel.jsx';
import LogoLoop from './LogoLoop.jsx';
import {
  SiGo, SiNodedotjs, SiReact, SiJavascript,
  SiLinux, SiGithub, SiVirtualbox,
  SiNginx, SiPython, SiTailwindcss,
} from 'react-icons/si';
import { FaWindows } from 'react-icons/fa';

// ─────────────────────────────────────────────────────────────────────────────
// Default data (fallback when backend is unreachable)
// ─────────────────────────────────────────────────────────────────────────────

const DEFAULT_DATA = {
  profile: {
    name:        'Hilton Kholokholo',
    title:       'Aspiring Computer Scientist | IT Asset Specialist | Problem Solver',
    location:    'South Africa 🇿🇦',
    phone:       '+27-646-816-715',
    email:       'damox101za@gmail.com',
    emailAlt:    'hiltonkholokholo@icloud.com',
    linkedin:    'https://www.linkedin.com/in/hilton-k-a824361a8/',
    github:      'https://github.com/Damox101za',
    summary:     "I'm Hilton Kholokholo, an IT Asset Specialist from South Africa with a passion for Computer Science and problem-solving. Having completed a Higher Certificate in Information Technology with distinction, I'm dedicated to building meaningful solutions and expanding my technical expertise.",
    philosophy:  'Nothing is impossible — but everything has its limits.',
    currentRole: 'IT Asset Specialist',
    futureGoal:  'Full-Stack Computer Scientist',
    learning:    'Higher Certificate in Information Technology (Completed, MANCOSA)',
    workStyle:   'Detail-oriented, collaborative, and results-driven',
  },
  interests: [
    { icon: '✨', text: 'Full-Stack Development' },
    { icon: '🔐', text: 'Cybersecurity & System Administration' },
    { icon: '🤖', text: 'Problem-solving & Algorithm Design' },
    { icon: '🛠️', text: 'Open Source Contributions' },
    { icon: '📊', text: 'Data Structures & Algorithms' },
    { icon: '🌐', text: 'Web Development & Cloud Technologies' },
  ],
  techStack: {
    languages: [
      { name: 'Python',     icon: 'python'     },
      { name: 'JavaScript', icon: 'javascript' },
      { name: 'Go',         icon: 'go'         },
      { name: 'C',          icon: 'c'          },
      { name: 'Java',       icon: 'java'       },
      { name: 'HTML5',      icon: 'html5'      },
      { name: 'CSS3',       icon: 'css3'       },
      { name: 'Bash',       icon: 'bash'       },
    ],
    tools: [
      { name: 'Linux',  icon: 'linux'  },
      { name: 'Git',    icon: 'git'    },
      { name: 'VS Code',icon: 'vscode' },
      { name: 'GitHub', icon: 'github' },
      { name: 'NPM',    icon: 'npm'    },
      { name: 'Hyper-V', icon: 'hyperv' },
      { name: 'Oracle VirtualBox', icon: 'virtualbox' },
    ],
  },
  projects: [
    {
      title:       'Portfolio Website',
      description: 'Personal portfolio showcasing projects, skills, and experience',
      tech:        'HTML, CSS, JavaScript',
      link:        'https://github.com/Damox101za?tab=repositories',
    },
    {
      title:       'System Tools',
      description: 'Command-line utilities & automation scripts',
      tech:        'Python, Bash, Go',
      link:        'https://github.com/Damox101za?tab=repositories',
    },
    {
      title:       'Learning Projects',
      description: 'Educational projects demonstrating CS fundamentals',
      tech:        'Python, Java, C',
      link:        'https://github.com/Damox101za?tab=repositories',
    },
  ],
  skills: [
    { name: 'Go (Golang)',         category: 'Languages & Data',         color: 'cyan',   level: 90 },
    { name: 'Node.js',             category: 'Languages & Data',         color: 'cyan',   level: 80 },
    { name: 'JSON / CSV Data Handling', category: 'Languages & Data',    color: 'cyan',   level: 78 },
    { name: 'JavaScript (React)',  category: 'Languages & Data',         color: 'cyan',   level: 76 },
    { name: 'Advanced Excel',      category: 'Languages & Data',         color: 'cyan',   level: 93 },
    { name: 'Server Architecture', category: 'Systems & Infrastructure', color: 'purple', level: 88 },
    { name: 'Linux Workstations',  category: 'Systems & Infrastructure', color: 'purple', level: 85 },
    { name: 'WinPE Deployment',    category: 'Systems & Infrastructure', color: 'purple', level: 95 },
    { name: 'Advanced Networking', category: 'Systems & Infrastructure', color: 'purple', level: 82 },
    { name: 'Microsoft 365 Admin', category: 'Enterprise Operations',    color: 'blue',   level: 90 },
    { name: 'Azure Management',    category: 'Enterprise Operations',    color: 'blue',   level: 80 },
    { name: 'Tier 3 Support',      category: 'Enterprise Operations',    color: 'blue',   level: 96 },
    { name: 'Active Directory',    category: 'Enterprise Operations',    color: 'blue',   level: 87 },
    { name: 'ITAD ERP Systems',    category: 'Enterprise Operations',    color: 'blue',   level: 88 },
  ],
  experience: [
    {
      role: 'IT Operations Engineer / Technical Support Specialist',
      company: 'Xperien (PTY) Ltd', period: '2020 – Present',
      type: 'Engineering', color: 'cyan',
      bullets: [
        'Engineered a custom WinPE deployment application in Go to automate secure enterprise equipment data destruction and hardware sanitization.',
        'Designed and built a high-capacity custom server infrastructure tailored for high-volume, secure data-wiping processes utilizing specialized third-party tools.',
        'Successfully implemented and optimized a corporate ITAD ERP system, enhancing asset tracking accuracy and workplace sustainability metrics.',
        'Developed internal data-handling software to extract and convert Excel data streams into automated, verified PDF compliance certifications for magnetic data destruction operations.',
        'Proactively manage and maintain core server infrastructure, routing environments, and active directories while providing senior Tier 3 resolution for complex technical incidents.',
      ],
    },
    {
      role: 'Warehouse Assistant & Data Destruction Technician',
      company: 'Xperien (PTY) Ltd', period: '2016 – 2020',
      type: 'Operations', color: 'purple',
      bullets: [
        'Executed industrial data sanitization protocols, utilizing physical, magnetic, and software-driven data destruction methodologies.',
        'Supervised a small team of co-workers and managed operational tasks to ensure secure equipment processing lines ran smoothly and efficiently.',
      ],
    },
  ],
  education: [
    {
      degree: 'Higher Certificate in Information Technology',
      institution: 'MANCOSA (NQF Level 5)', year: '2026',
      highlights: [
        'Overall average ~83%, 7 of 8 modules passed with distinction',
        'Computer Hardware and Architecture: 95% (Distinction)',
        'Essential Business Mathematics: 94% (Distinction)',
        'SAQA ID: 93709',
      ],
    },
    {
      degree: 'Short Learning Programme: Introduction to Programming',
      institution: 'Boston City Campus', year: '2022',
      highlights: ['Database Systems (Access): 96% Distinction', 'Systems Development: 76%'],
    },
    {
      degree: 'National Certificate: IT (Technical Support)',
      institution: 'Gauteng City College / MICT SETA (NQF Level 4)', year: '2021',
      highlights: ['Technical Support Specialisation'],
    },
  ],
};

const CATEGORIES = ['All', 'Languages & Data', 'Systems & Infrastructure', 'Enterprise Operations'];

const SKILL_COLOR_HEX = { cyan: '#00d4ff', purple: '#a855f7', blue: '#60a5fa' };

// ─────────────────────────────────────────────────────────────────────────────
// Tech logos for the marquee strip
// ─────────────────────────────────────────────────────────────────────────────

const TECH_LOGOS = [
  { node: <SiGo />,          title: 'Go (Golang)'  },
  { node: <SiNodedotjs />,   title: 'Node.js'      },
  { node: <SiReact />,       title: 'React'        },
  { node: <SiJavascript />,  title: 'JavaScript'   },
  { node: <SiPython />,      title: 'Python'       },
  { node: <SiLinux />,       title: 'Linux'        },
  { node: <SiVirtualbox />,  title: 'VirtualBox'   },
  { node: <SiNginx />,       title: 'Nginx'        },
  { node: <SiGithub />,      title: 'GitHub'       },
  { node: <SiTailwindcss />, title: 'Tailwind CSS' },
];

// ─────────────────────────────────────────────────────────────────────────────
// Context
// ─────────────────────────────────────────────────────────────────────────────

const CVDataContext = createContext(DEFAULT_DATA);
const useCVData = () => useContext(CVDataContext);

// ─────────────────────────────────────────────────────────────────────────────
// Terminal responses (built dynamically from live data)
// ─────────────────────────────────────────────────────────────────────────────

function buildResponses(profile, skills, experience) {
  const byCategory = cat => skills.filter(s => s.category === cat).map(s => s.name).join(' · ');

  return {
    help: `┌─ Available Commands ─────────────────────────┐
│  about      →  Profile summary                │
│  skills     →  Full tech stack listing        │
│  contact    →  Contact & social links         │
│  experience →  Work history overview          │
│  education  →  Academic record                │
│  whoami     →  System identification          │
│  clear      →  Clear terminal output          │
└───────────────────────────────────────────────┘`,

    about: `> ${profile.name}
> ${profile.title}
> ${profile.location}
>
> ${profile.summary.slice(0, 140)}…`,

    skills: `> LANGUAGES & DATA
    ${byCategory('Languages & Data')}

> SYSTEMS & INFRASTRUCTURE
    ${byCategory('Systems & Infrastructure')}

> ENTERPRISE OPERATIONS
    ${byCategory('Enterprise Operations')}`,

    contact: `> Email    →  ${profile.email}
> Phone    →  ${profile.phone}
> LinkedIn →  ${profile.linkedin.replace('https://', '')}
> GitHub   →  ${profile.github.replace('https://', '')}
> Location →  ${profile.location}`,

    experience: experience.map(e =>
      `> ${e.period.padEnd(13)}·  ${e.role}  @  ${e.company}\n    └─ ${e.bullets[0].slice(0, 60)}…`
    ).join('\n\n'),

    education: `> 2022  ·  Intro to Programming — Boston City Campus
    └─ Database Systems: 96% Distinction  ·  Systems Dev: 76%

> 2021  ·  National Certificate: IT Technical Support (NQF 4)
    └─ Gauteng City College / MICT SETA`,

    whoami: `hilton@dashboard:~$ id
uid=1000(hilton) gid=1000(engineers)
groups=devops,sysadmin,tier3-support,itad-ops

System   : HVK Portfolio Dashboard v1.0.0
Built    : React + Tailwind CSS
Location : ${profile.location}
XP       : ${new Date().getFullYear() - 2016}+ years of professional experience`,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Boot sequence (static — reflects the tech stack)
// ─────────────────────────────────────────────────────────────────────────────

const BOOT_LINES = [
  { text: '╔══════════════════════════════════════════╗', type: 'divider' },
  { text: '║  HVK PORTFOLIO OS  v1.0.0  ──  INIT     ║', type: 'divider' },
  { text: '╚══════════════════════════════════════════╝', type: 'divider' },
  { text: '[SYS]  Performing POST…',                     type: 'boot'   },
  { text: '[OK]   Memory integrity: PASS',               type: 'boot'   },
  { text: '[OK]   Loading Go runtime environment…',      type: 'boot'   },
  { text: '[OK]   Node.js modules: LINKED',              type: 'boot'   },
  { text: '[OK]   JSON/CSV data pipeline: READY',        type: 'boot'   },
  { text: '[OK]   React UI layer: MOUNTED',              type: 'boot'   },
  { text: '[OK]   WinPE deployment engine: ACTIVE',      type: 'boot'   },
  { text: '[OK]   Server architecture module: ONLINE',   type: 'boot'   },
  { text: '[OK]   Network interfaces: UP',               type: 'boot'   },
  { text: '[OK]   Microsoft 365 admin: AUTHENTICATED',   type: 'boot'   },
  { text: '[OK]   Azure management API: CONNECTED',      type: 'boot'   },
  { text: '[OK]   ITAD ERP system: SYNCED',              type: 'boot'   },
  { text: '──────────────────────────────────────────',  type: 'divider'},
  { text: 'All systems nominal. Portfolio loaded.',      type: 'boot'   },
  { text: 'Type  "help"  for available commands.',       type: 'system' },
];

// ─────────────────────────────────────────────────────────────────────────────
// Icons
// ─────────────────────────────────────────────────────────────────────────────

const IconGitHub = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
  </svg>
);
const IconLinkedIn = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);
const IconMail = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="2" y="4" width="20" height="16" rx="2"/>
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
  </svg>
);
const IconPrint = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="6 9 6 2 18 2 18 9"/>
    <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
    <rect x="6" y="14" width="12" height="8"/>
  </svg>
);

// ─────────────────────────────────────────────────────────────────────────────
// Navigation
// ─────────────────────────────────────────────────────────────────────────────

function Nav() {
  const { profile } = useCVData();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = id => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <nav className={`nav ${scrolled ? 'nav--scrolled' : ''}`} aria-label="Main navigation">
      <div className="nav__brand">
        <span className="nav__brand-prefix">{'>'}</span>HVK
      </div>
      <div className="nav__links" role="list">
        {[['terminal','Terminal'],['interests','Interests'],['techstack','Tech Stack'],['skills','Skills'],['experience','Experience'],['education','Education'],['projects','Projects']].map(([id, label]) => (
          <button key={id} onClick={() => scrollTo(id)} className="nav__link" role="listitem">{label}</button>
        ))}
      </div>
      <a href={`mailto:${profile.email}`} className="nav__cta">HIRE ME</a>
    </nav>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Hero
// ─────────────────────────────────────────────────────────────────────────────

function Hero() {
  const { profile } = useCVData();

  return (
    <header className="hero">
      <div className="hero__content">
        {/* Left */}
        <div>
          <div className="hero__status">
            <span className="hero__status-dot" />
            <span className="hero__status-text">Available for opportunities</span>
          </div>

          <h1 className="hero__name">
            <span className="hero__name-first">HILTON</span>
            <span className="hero__name-last">KHOLOKHOLO</span>
          </h1>

          <p className="hero__title">{profile.title}</p>
          <p className="hero__location">📍 {profile.location}</p>

          {profile.philosophy && (
            <p className="hero__philosophy">"{profile.philosophy}"</p>
          )}

          <div className="hero__links">
            <a href={profile.github}   target="_blank" rel="noreferrer" className="hero-btn hero-btn--cyan">
              <IconGitHub /> GitHub
            </a>
            <a href={profile.linkedin} target="_blank" rel="noreferrer" className="hero-btn hero-btn--purple">
              <IconLinkedIn /> LinkedIn
            </a>
            <a href={`mailto:${profile.email}`} className="hero-btn hero-btn--blue">
              <IconMail /> Email Me
            </a>
            <button onClick={() => window.print()} className="hero-btn hero-btn--print">
              <IconPrint /> Download CV
            </button>
          </div>
        </div>

        {/* Right */}
        <div className="hero__right">
          <div className="glass-card">
            <div className="hero__stats">
              <div className="hero__stat">
                <span className="hero__stat-value">10+</span>
                <span className="hero__stat-label">Years<br/>Experience</span>
              </div>
              <div className="hero__stat">
                <span className="hero__stat-value">T3</span>
                <span className="hero__stat-label">Support<br/>Level</span>
              </div>
              <div className="hero__stat">
                <span className="hero__stat-value">5+</span>
                <span className="hero__stat-label">Systems<br/>Built</span>
              </div>
            </div>
          </div>
          <div className="glass-card glass-card--purple">
            <p className="hero__summary">{profile.summary}</p>
          </div>
        </div>
      </div>
    </header>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Tech logo marquee strip
// ─────────────────────────────────────────────────────────────────────────────

function TechStrip() {
  return (
    <div className="tech-strip">
      <span className="tech-strip__label">TECH STACK</span>
      <div className="tech-strip__loop">
        <LogoLoop
          logos={TECH_LOGOS}
          speed={55}
          direction="left"
          logoHeight={24}
          gap={48}
          hoverSpeed={0}
          scaleOnHover
          fadeOut
          fadeOutColor="#04040a"
          ariaLabel="Technologies used"
        />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Terminal
// ─────────────────────────────────────────────────────────────────────────────

function Terminal() {
  const { profile, skills, experience } = useCVData();

  const responses = useMemo(
    () => buildResponses(profile, skills, experience),
    [profile, skills, experience],
  );

  const [lines, setLines]         = useState([]);
  const [input, setInput]         = useState('');
  const [booting, setBooting]     = useState(true);
  const [showInput, setShowInput] = useState(false);
  const bodyRef                   = useRef(null);
  const inputRef                  = useRef(null);

  useEffect(() => {
    const el = bodyRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines]);

  // Focus input without scrolling the page when boot completes
  useEffect(() => {
    if (showInput) inputRef.current?.focus({ preventScroll: true });
  }, [showInput]);

  useEffect(() => {
    let cancelled = false;
    let index = 0;
    const tick = () => {
      if (cancelled || index >= BOOT_LINES.length) {
        if (!cancelled) { setBooting(false); setShowInput(true); }
        return;
      }
      const line = BOOT_LINES[index++];
      setLines(prev => [...prev, line]);
      setTimeout(tick, 280);
    };
    setTimeout(tick, 400);
    return () => { cancelled = true; };
  }, []);

  const runCommand = useCallback((raw) => {
    const cmd = raw.trim().toLowerCase();
    if (cmd === '') return;
    if (cmd === 'clear') {
      setLines([{ text: 'Terminal cleared. Type "help" for commands.', type: 'system' }]);
      setInput('');
      return;
    }
    const response = responses[cmd];
    setLines(prev => [
      ...prev,
      { text: `hilton@dashboard:~$ ${raw}`, type: 'input' },
      response
        ? { text: response, type: 'output' }
        : { text: `command not found: "${cmd}"  —  try "help"`, type: 'error' },
    ]);
    setInput('');
  }, [responses]);

  const onKeyDown = e => { if (e.key === 'Enter') runCommand(input); };

  return (
    <div className="terminal-wrap" role="region" aria-label="Interactive terminal">
      <div className="terminal-chrome">
        <div className="terminal-dots">
          <span className="terminal-dot-red"    aria-hidden="true" />
          <span className="terminal-dot-yellow" aria-hidden="true" />
          <span className="terminal-dot-green"  aria-hidden="true" />
        </div>
        <span className="terminal-titlebar">hilton@dashboard: ~</span>
        <span className={`terminal-state ${booting ? 'terminal-state--boot' : 'terminal-state--ready'}`}>
          {booting ? '● BOOTING' : '● READY'}
        </span>
      </div>

      <div ref={bodyRef} className="terminal-body" onClick={() => inputRef.current?.focus()}>
        {lines.map((line, i) => (
          <div key={i} className={`tl tl--${line.type}`}>
            {line.text.split('\n').map((row, j) => <div key={j}>{row || ' '}</div>)}
          </div>
        ))}
        {showInput && (
          <div className="terminal-input-row">
            <span className="terminal-prompt">hilton@dashboard:~$</span>
            <input ref={inputRef} type="text" value={input}
              onChange={e => setInput(e.target.value)} onKeyDown={onKeyDown}
              className="terminal-input" spellCheck={false}
              autoComplete="off" autoCapitalize="off"
              aria-label="Terminal command input" />
            <span className="terminal-cursor" aria-hidden="true" />
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Interests
// ─────────────────────────────────────────────────────────────────────────────

function InterestsSection() {
  const { interests } = useCVData();
  if (!interests?.length) return null;
  return (
    <section id="interests" className="section">
      <div className="section-header">
        <p className="section-label">INTERESTS.LIST</p>
        <h2 className="section-title">What I'm Into</h2>
        <p className="section-sub">Areas I'm passionate about and actively exploring.</p>
      </div>
      <div className="interests-grid">
        {interests.map((item, i) => (
          <div key={i} className="interest-card">
            <span className="interest-icon">{item.icon}</span>
            <span className="interest-text">{item.text}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Tech Stack
// ─────────────────────────────────────────────────────────────────────────────

const DEVICON_MAP = {
  python:     'devicon-python-plain',
  javascript: 'devicon-javascript-plain',
  go:         'devicon-go-original',
  c:          'devicon-c-plain',
  java:       'devicon-java-plain',
  html5:      'devicon-html5-plain',
  css3:       'devicon-css3-plain',
  bash:       'devicon-bash-plain',
  linux:      'devicon-linux-plain',
  git:        'devicon-git-plain',
  vscode:     'devicon-vscode-plain',
  github:     'devicon-github-original',
  npm:        'devicon-npm-original-wordmark',
};

// Tools without a devicon entry, but with a decent icon from react-icons
const REACT_ICON_MAP = {
  virtualbox: SiVirtualbox,
  hyperv:     FaWindows,
};

function TechItem({ item }) {
  const iconClass = DEVICON_MAP[item.icon];
  const ReactIcon = REACT_ICON_MAP[item.icon];
  return (
    <div className="tech-item">
      {iconClass
        ? <i className={`${iconClass} colored tech-item__icon`} aria-hidden="true" />
        : ReactIcon
          ? <span className="tech-item__icon tech-item__icon--fallback"><ReactIcon aria-hidden="true" /></span>
          : <span className="tech-item__icon tech-item__icon--fallback">{item.name[0]}</span>
      }
      <span className="tech-item__name">{item.name}</span>
    </div>
  );
}

function TechStackSection() {
  const { techStack } = useCVData();
  if (!techStack) return null;
  return (
    <section id="techstack" className="section">
      <div className="section-header">
        <p className="section-label">TECH.STACK</p>
        <h2 className="section-title">Technologies</h2>
        <p className="section-sub">Languages and tools I work with regularly.</p>
      </div>
      <div className="techstack-groups">
        <div className="techstack-group">
          <p className="techstack-group__label">Languages</p>
          <div className="tech-grid">
            {techStack.languages.map((item, i) => <TechItem key={i} item={item} />)}
          </div>
        </div>
        <div className="techstack-group">
          <p className="techstack-group__label">Tools &amp; Platforms</p>
          <div className="tech-grid">
            {techStack.tools.map((item, i) => <TechItem key={i} item={item} />)}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Projects
// ─────────────────────────────────────────────────────────────────────────────

function ProjectsSection() {
  const { projects } = useCVData();
  if (!projects?.length) return null;
  return (
    <section id="projects" className="section">
      <div className="section-header">
        <p className="section-label">PROJECTS.LOG</p>
        <h2 className="section-title">Projects</h2>
        <p className="section-sub">Things I've built, shipped, and learned from.</p>
      </div>
      <div className="projects-grid">
        {projects.map((proj, i) => (
          <article key={i} className="project-card">
            <h3 className="project-card__title">{proj.title}</h3>
            <p className="project-card__desc">{proj.description}</p>
            <p className="project-card__tech">{proj.tech}</p>
            <a href={proj.link} target="_blank" rel="noreferrer" className="project-card__link">
              View on GitHub →
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Skills
// ─────────────────────────────────────────────────────────────────────────────

function SkillCard({ skill }) {
  return (
    <article className={`skill-card skill-card--${skill.color}`}>
      <span className={`skill-badge skill-badge--${skill.color}`}>
        {skill.category.split(' ')[0]}
      </span>
      <p className="skill-name">{skill.name}</p>
      <div className="skill-bar-track">
        <div className={`skill-bar skill-bar--${skill.color}`} style={{ width: `${skill.level}%` }} />
      </div>
      <p className="skill-level">{skill.level}%</p>
    </article>
  );
}

function SkillsSection() {
  const { skills } = useCVData();
  const [active, setActive] = useState('All');
  const visible = skills.filter(s => active === 'All' || s.category === active);

  return (
    <section id="skills" className="section">
      <div className="section-header">
        <p className="section-label">SKILLS.MATRIX</p>
        <h2 className="section-title">Tech Stack</h2>
        <p className="section-sub">Filterable proficiency grid across the full engineering spectrum.</p>
      </div>
      <div className="filter-pills" role="group" aria-label="Skill category filter">
        {CATEGORIES.map(cat => (
          <button key={cat} onClick={() => setActive(cat)}
            className={`filter-pill${active === cat ? ' filter-pill--active' : ''}`}
            aria-pressed={active === cat}>
            {cat}
          </button>
        ))}
      </div>
      <div className="skills-grid">
        {visible.map(skill => <SkillCard key={skill.name} skill={skill} />)}
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Experience
// ─────────────────────────────────────────────────────────────────────────────

function ExperienceSection() {
  const { experience } = useCVData();
  return (
    <section id="experience" className="section">
      <div className="section-header">
        <p className="section-label">CAREER.LOG</p>
        <h2 className="section-title">Experience</h2>
        <p className="section-sub">Engineering history and operational achievements.</p>
      </div>
      <div className="timeline">
        <div className="timeline__line" aria-hidden="true" />
        {experience.map((entry, i) => (
          <article key={i} className="timeline-entry">
            <div className={`timeline-dot timeline-dot--${entry.color}`} aria-hidden="true" />
            <div className={`timeline-card timeline-card--${entry.color}`}>
              <div className="timeline-meta">
                <span className={`timeline-period timeline-period--${entry.color}`}>{entry.period}</span>
                <span className={`timeline-type-badge timeline-type-badge--${entry.color}`}>{entry.type}</span>
              </div>
              <h3 className="timeline-role">{entry.role}</h3>
              <p className={`timeline-company timeline-company--${entry.color}`}>@ {entry.company}</p>
              <ul className="timeline-list">
                {entry.bullets.map((b, j) => (
                  <li key={j} className="timeline-item">
                    <span className={`timeline-bullet timeline-bullet--${entry.color}`} aria-hidden="true">▸</span>
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Education
// ─────────────────────────────────────────────────────────────────────────────

function EducationSection() {
  const { education } = useCVData();
  return (
    <section id="education" className="section">
      <div className="section-header">
        <p className="section-label">EDUCATION.DATA</p>
        <h2 className="section-title">Academic Record</h2>
        <p className="section-sub">Formal qualifications and certifications.</p>
      </div>
      <div className="edu-grid">
        {education.map((edu, i) => (
          <article key={i} className="edu-card">
            <p className="edu-year">{edu.year}</p>
            <h3 className="edu-degree">{edu.degree}</h3>
            <p className="edu-institution">{edu.institution}</p>
            <div className="edu-highlights">
              {edu.highlights.map((h, j) => <span key={j} className="edu-highlight">{h}</span>)}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Footer
// ─────────────────────────────────────────────────────────────────────────────

function Footer() {
  const { profile } = useCVData();
  return (
    <footer className="footer">
      <div className="footer__inner">
        <span className="footer__text">
          © {new Date().getFullYear()} {profile.name} — Built with React &amp; Tailwind CSS
        </span>
        <div className="footer__links">
          <a href={profile.github}            target="_blank" rel="noreferrer" className="footer__link">GitHub</a>
          <a href={profile.linkedin}          target="_blank" rel="noreferrer" className="footer__link">LinkedIn</a>
          <a href={`mailto:${profile.email}`}                                  className="footer__link">Email</a>
          <a href="#admin"                                                      className="footer__link footer__link--admin">Admin</a>
        </div>
      </div>
    </footer>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PrintCV — shown only when window.print() is called
// ─────────────────────────────────────────────────────────────────────────────

function PrintCV() {
  const { profile, skills, experience, education } = useCVData();
  const byCategory = cat => skills.filter(s => s.category === cat).map(s => s.name).join(', ');

  return (
    <div className="print-cv">
      {/* Header */}
      <div className="pcv-header">
        <h1 className="pcv-name">{profile.name}</h1>
        <p className="pcv-title">{profile.title}</p>
        <p className="pcv-contact">
          {profile.location}
          {profile.phone    && ` · ${profile.phone}`}
          {profile.email    && ` · ${profile.email}`}
        </p>
        <p className="pcv-contact">
          {profile.linkedin && profile.linkedin.replace('https://', '')}
          {profile.github   && ` · ${profile.github.replace('https://', '')}`}
        </p>
      </div>

      <hr className="pcv-rule" />

      {/* Summary */}
      <section className="pcv-section">
        <h2 className="pcv-section-title">Professional Summary</h2>
        <p className="pcv-body">{profile.summary}</p>
      </section>

      <hr className="pcv-rule" />

      {/* Skills */}
      <section className="pcv-section">
        <h2 className="pcv-section-title">Technical Skills</h2>
        {['Languages & Data', 'Systems & Infrastructure', 'Enterprise Operations'].map(cat => (
          <p key={cat} className="pcv-body">
            <strong>{cat}:</strong> {byCategory(cat)}
          </p>
        ))}
      </section>

      <hr className="pcv-rule" />

      {/* Experience */}
      <section className="pcv-section">
        <h2 className="pcv-section-title">Experience</h2>
        {experience.map((exp, i) => (
          <div key={i} className="pcv-entry">
            <div className="pcv-entry__header">
              <strong className="pcv-entry__role">{exp.role}</strong>
              <span className="pcv-entry__period">{exp.period}</span>
            </div>
            <p className="pcv-entry__company">{exp.company}</p>
            <ul className="pcv-list">
              {exp.bullets.map((b, j) => <li key={j}>{b}</li>)}
            </ul>
          </div>
        ))}
      </section>

      <hr className="pcv-rule" />

      {/* Education */}
      <section className="pcv-section">
        <h2 className="pcv-section-title">Education</h2>
        {education.map((edu, i) => (
          <div key={i} className="pcv-entry">
            <div className="pcv-entry__header">
              <strong className="pcv-entry__role">{edu.degree}</strong>
              <span className="pcv-entry__period">{edu.year}</span>
            </div>
            <p className="pcv-entry__company">{edu.institution}</p>
            {edu.highlights.length > 0 && (
              <ul className="pcv-list">
                {edu.highlights.map((h, j) => <li key={j}>{h}</li>)}
              </ul>
            )}
          </div>
        ))}
      </section>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Root App
// ─────────────────────────────────────────────────────────────────────────────

export default function App() {
  const [cvData, setCvData] = useState(DEFAULT_DATA);
  const [page, setPage]     = useState(() =>
    window.location.hash === '#admin' ? 'admin' : 'portfolio'
  );

  // Fetch live data from backend (silent fallback to defaults)
  useEffect(() => {
    fetch('/api/data')
      .then(r => { if (!r.ok) throw new Error(); return r.json(); })
      .then(setCvData)
      .catch(() => {}); // use DEFAULT_DATA silently
  }, []);

  // Hash-based routing
  useEffect(() => {
    const onChange = () =>
      setPage(window.location.hash === '#admin' ? 'admin' : 'portfolio');
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);

  if (page === 'admin') {
    return (
      <CVDataContext.Provider value={cvData}>
        <AdminPanel
          initialData={cvData}
          onSave={updated => { setCvData(updated); window.location.hash = ''; }}
        />
      </CVDataContext.Provider>
    );
  }

  return (
    <CVDataContext.Provider value={cvData}>
      {/* ── Interactive portfolio (hidden in print) ── */}
      <div className="no-print">
        <div className="app">
          <div className="grid-bg"  aria-hidden="true" />
          <div className="scanline" aria-hidden="true" />

          <Nav />

          <main>
            <Hero />
            <TechStrip />
            <div className="container">
              <section id="terminal" className="section">
                <div className="section-header">
                  <p className="section-label">SYSTEM.BOOT</p>
                  <h2 className="section-title">Interactive Terminal</h2>
                  <p className="section-sub">Type "help" to explore — or try: about · skills · contact</p>
                </div>
                <Terminal />
              </section>
              <InterestsSection />
              <TechStackSection />
              <SkillsSection />
              <ExperienceSection />
              <EducationSection />
              <ProjectsSection />
            </div>
          </main>

          <Footer />
        </div>
      </div>

      {/* ── Clean CV layout (visible only in print) ── */}
      <PrintCV />
    </CVDataContext.Provider>
  );
}
