import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import DCA from './components/DCA';
import Calculator from './components/Calculator';
import Playbook from './components/Playbook';

const NAV = [
  { id: 'dashboard', label: '投资组合', sub: 'Portfolio' },
  { id: 'dca', label: '定投计划', sub: 'DCA Tracker' },
  { id: 'calculator', label: '复利计算', sub: 'Compound' },
  { id: 'playbook', label: '投资手册', sub: 'Playbook' },
];

const styles = {
  app: { minHeight: '100vh', background: '#0a0a0a', fontFamily: "'Noto Sans SC', sans-serif", fontWeight: 300 },
  sidebar: { position: 'fixed', left: 0, top: 0, bottom: 0, width: 200, background: '#0d0d0d', borderRight: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', zIndex: 100, padding: '32px 0 24px' },
  logo: { padding: '0 24px 32px', borderBottom: '1px solid rgba(255,255,255,0.06)', marginBottom: 16 },
  logoTop: { fontFamily: "'DM Mono', monospace", fontSize: 10, color: '#c9a84c', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 6 },
  logoMain: { fontFamily: "'Noto Serif SC', serif", fontSize: 18, fontWeight: 700, color: '#fff', lineHeight: 1.3 },
  navItem: (active) => ({
    padding: '12px 24px', cursor: 'pointer', borderLeft: active ? '2px solid #c9a84c' : '2px solid transparent',
    background: active ? 'rgba(201,168,76,0.06)' : 'transparent', transition: 'all 0.15s',
  }),
  navLabel: (active) => ({ fontSize: 13, fontWeight: active ? 500 : 300, color: active ? '#e8e4dc' : '#6a6660', marginBottom: 2 }),
  navSub: { fontFamily: "'DM Mono', monospace", fontSize: 9, color: '#3a3632', letterSpacing: '0.12em', textTransform: 'uppercase' },
  sidebarFooter: { marginTop: 'auto', padding: '16px 24px', borderTop: '1px solid rgba(255,255,255,0.06)' },
  footerText: { fontFamily: "'DM Mono', monospace", fontSize: 9, color: '#3a3632', letterSpacing: '0.1em', lineHeight: 1.7 },
  main: { marginLeft: 200, minHeight: '100vh', padding: '40px 40px 80px' },
};

export default function App() {
  const [active, setActive] = useState('dashboard');
  const pages = { dashboard: <Dashboard />, dca: <DCA />, calculator: <Calculator />, playbook: <Playbook /> };

  return (
    <div style={styles.app}>
      <nav style={styles.sidebar}>
        <div style={styles.logo}>
          <div style={styles.logoTop}>美股投资系统</div>
          <div style={styles.logoMain}>财富<br />仪表盘</div>
        </div>
        {NAV.map(n => (
          <div key={n.id} style={styles.navItem(active === n.id)} onClick={() => setActive(n.id)}
            onMouseEnter={e => { if (active !== n.id) e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; }}
            onMouseLeave={e => { if (active !== n.id) e.currentTarget.style.background = 'transparent'; }}>
            <div style={styles.navLabel(active === n.id)}>{n.label}</div>
            <div style={styles.navSub}>{n.sub}</div>
          </div>
        ))}
        <div style={styles.sidebarFooter}>
          <div style={styles.footerText}>仅供参考<br />不构成投资建议<br />投资有风险</div>
        </div>
      </nav>
      <main style={styles.main}>{pages[active]}</main>
    </div>
  );
}
