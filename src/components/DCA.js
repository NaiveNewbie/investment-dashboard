import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';

const C = {
  bg2:'#111',bg3:'#181818',border:'rgba(255,255,255,0.07)',border2:'rgba(255,255,255,0.12)',
  text:'#e8e4dc',text2:'#9a9690',text3:'#5a5652',
  gold:'#c9a84c',gold2:'#e8c97a',green:'#4a9e6f',green2:'#6abf8a',red:'#b85a4a',blue:'#4a7ab5',
};

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

function initRows() {
  return MONTHS.map((m, i) => ({ month: m, planned: 1000, actual: i < 5 ? [1000,1000,1000,1200,1050][i] : 0, ticker: i < 5 ? 'QQQ' : '', shares: i < 5 ? [1.4,1.4,1.3,1.6,1.4][i] : 0, price: i < 5 ? [714,714,769,750,750][i] : 0, note: '' }));
}

export default function DCA() {
  const [rows, setRows] = useState(initRows());
  const [monthly, setMonthly] = useState(1000);
  const [year, setYear] = useState(2026);

  const totalPlanned = rows.reduce((s, r) => s + r.planned, 0);
  const totalActual = rows.reduce((s, r) => s + r.actual, 0);
  const totalShares = rows.reduce((s, r) => s + r.shares, 0);
  const completed = rows.filter(r => r.actual > 0).length;

  function update(i, field, val) {
    setRows(prev => prev.map((r, idx) => idx === i ? { ...r, [field]: field === 'ticker' || field === 'note' ? val : parseFloat(val) || 0 } : r));
  }

  const chartData = rows.map(r => ({ name: r.month, 计划: r.planned, 实际: r.actual }));
  const cumData = rows.map((r, i) => {
    const cum = rows.slice(0, i + 1).reduce((s, x) => s + x.actual, 0);
    return { name: r.month, 累计投入: cum };
  });

  const inputS = { background: C.bg3, border: `1px solid ${C.border}`, borderRadius: 4, padding: '4px 8px', color: C.text, fontSize: 12, fontFamily: 'inherit', outline: 'none', width: '100%' };

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontFamily:"'DM Mono', monospace", fontSize:10, color:C.gold, letterSpacing:'0.2em', textTransform:'uppercase', marginBottom:8 }}>DCA Tracker</div>
        <div style={{ display:'flex', alignItems:'baseline', justifyContent:'space-between' }}>
          <h1 style={{ fontFamily:"'Noto Serif SC', serif", fontSize:28, fontWeight:700, color:'#fff' }}>定投计划</h1>
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <span style={{ fontSize:12, color:C.text3 }}>年份</span>
            <input type="number" value={year} onChange={e => setYear(e.target.value)} style={{ ...inputS, width:80 }} />
            <span style={{ fontSize:12, color:C.text3 }}>月定投目标</span>
            <input type="number" value={monthly} onChange={e => setMonthly(parseFloat(e.target.value)||0)} style={{ ...inputS, width:90 }} />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:28 }}>
        {[
          { label:'年度计划总额', val:`$${totalPlanned.toLocaleString()}`, accent:true },
          { label:'已投入金额', val:`$${totalActual.toLocaleString()}` },
          { label:'完成进度', val:`${completed}/12月` },
          { label:'完成率', val:`${(totalActual/totalPlanned*100).toFixed(0)}%` },
        ].map(s => (
          <div key={s.label} style={{ background:C.bg2, border:`1px solid ${s.accent ? 'rgba(201,168,76,0.3)':C.border}`, borderRadius:8, padding:'16px 18px', position:'relative', overflow:'hidden' }}>
            {s.accent && <div style={{ position:'absolute', top:0, left:0, right:0, height:2, background:`linear-gradient(90deg, ${C.gold}, transparent)` }} />}
            <div style={{ fontFamily:"'DM Mono', monospace", fontSize:9, color:C.text3, letterSpacing:'0.15em', textTransform:'uppercase', marginBottom:6 }}>{s.label}</div>
            <div style={{ fontFamily:"'DM Mono', monospace", fontSize:20, fontWeight:500, color: s.accent ? C.gold2 : C.text }}>{s.val}</div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:24 }}>
        <div style={{ background:C.bg2, border:`1px solid ${C.border}`, borderRadius:8, padding:20 }}>
          <div style={{ fontSize:13, color:C.text, marginBottom:14 }}>每月计划 vs 实际</div>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={chartData} barGap={2}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="name" tick={{ fill:C.text3, fontSize:10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill:C.text3, fontSize:10 }} axisLine={false} tickLine={false} tickFormatter={v=>`$${v}`} />
              <Tooltip contentStyle={{ background:C.bg3, border:`1px solid ${C.border2}`, borderRadius:6, fontSize:11 }} formatter={v=>[`$${v}`,'']} />
              <Bar dataKey="计划" fill="rgba(201,168,76,0.2)" radius={[2,2,0,0]} />
              <Bar dataKey="实际" fill={C.gold} radius={[2,2,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div style={{ background:C.bg2, border:`1px solid ${C.border}`, borderRadius:8, padding:20 }}>
          <div style={{ fontSize:13, color:C.text, marginBottom:14 }}>累计投入趋势</div>
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={cumData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="name" tick={{ fill:C.text3, fontSize:10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill:C.text3, fontSize:10 }} axisLine={false} tickLine={false} tickFormatter={v=>`$${(v/1000).toFixed(0)}K`} />
              <Tooltip contentStyle={{ background:C.bg3, border:`1px solid ${C.border2}`, borderRadius:6, fontSize:11 }} formatter={v=>[`$${v.toLocaleString()}`,'']} />
              <Line type="monotone" dataKey="累计投入" stroke={C.blue} strokeWidth={2} dot={{ fill:C.blue, r:3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Monthly records table */}
      <div style={{ background:C.bg2, border:`1px solid ${C.border}`, borderRadius:8, overflow:'hidden' }}>
        <div style={{ padding:'14px 20px', borderBottom:`1px solid ${C.border}` }}>
          <span style={{ fontSize:13, fontWeight:500, color:C.text }}>{year}年定投记录</span>
          <span style={{ fontSize:11, color:C.text3, marginLeft:12 }}>点击单元格直接编辑</span>
        </div>
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead>
            <tr>{['月份','计划金额($)','实际金额($)','标的','买入股数','成本价($)','备注'].map(h => (
              <th key={h} style={{ fontFamily:"'DM Mono', monospace", fontSize:9, color:C.text3, letterSpacing:'0.1em', textTransform:'uppercase', padding:'10px 14px', borderBottom:`1px solid ${C.border2}`, textAlign:'left', whiteSpace:'nowrap' }}>{h}</th>
            ))}</tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} style={{ borderBottom:`1px solid ${C.border}`, background: r.actual > 0 ? 'transparent' : 'rgba(255,255,255,0.01)' }}>
                <td style={{ padding:'8px 14px', fontFamily:"'DM Mono', monospace", fontSize:12, color: r.actual > 0 ? C.gold : C.text3 }}>{MONTHS[i]}</td>
                {['planned','actual','ticker','shares','price','note'].map(f => (
                  <td key={f} style={{ padding:'6px 10px' }}>
                    <input value={r[f]} onChange={e => update(i, f, e.target.value)}
                      style={{ ...inputS, color: f==='actual' && r.actual > 0 ? C.green2 : C.text2, borderColor: r.actual > 0 ? C.border : 'transparent', background: r.actual > 0 ? C.bg3 : 'transparent' }} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ padding:'12px 20px', borderTop:`1px solid ${C.border}`, display:'flex', gap:32 }}>
          <span style={{ fontSize:12, color:C.text3 }}>总计股数：<span style={{ color:C.gold, fontFamily:"'DM Mono', monospace" }}>{totalShares.toFixed(2)}</span></span>
          <span style={{ fontSize:12, color:C.text3 }}>平均成本：<span style={{ color:C.gold, fontFamily:"'DM Mono', monospace" }}>${totalShares > 0 ? (totalActual/totalShares).toFixed(2) : '—'}</span></span>
        </div>
      </div>
    </div>
  );
}
