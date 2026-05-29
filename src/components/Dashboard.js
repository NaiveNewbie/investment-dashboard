import React, { useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';

const C = {
  bg2: '#111', bg3: '#181818', border: 'rgba(255,255,255,0.07)', border2: 'rgba(255,255,255,0.12)',
  text: '#e8e4dc', text2: '#9a9690', text3: '#5a5652',
  gold: '#c9a84c', gold2: '#e8c97a', green: '#4a9e6f', green2: '#6abf8a', red: '#b85a4a', blue: '#4a7ab5',
};

const PALETTE = ['#4a7ab5','#6a9ad5','#4a9e6f','#c97c3a','#5a5652'];

const DEFAULT_HOLDINGS = [
  { id:1, ticker:'QQQ', name:'纳斯达克100 ETF', shares:2, avgPrice:720, currentPrice:736, targetPct:40, color:PALETTE[0] },
  { id:2, ticker:'SPY', name:'标普500 ETF', shares:1, avgPrice:748, currentPrice:755, targetPct:20, color:PALETTE[1] },
  { id:3, ticker:'MSFT', name:'微软', shares:0, avgPrice:0, currentPrice:429, targetPct:10, color:PALETTE[2] },
  { id:4, ticker:'META', name:'Meta平台', shares:0, avgPrice:0, currentPrice:633, targetPct:10, color:PALETTE[3] },
];

const HISTORY = [
  {month:'1月',value:2000},{month:'2月',value:2800},{month:'3月',value:3200},{month:'4月',value:2900},{month:'5月',value:3600},
];

function StatCard({ label, value, sub, accent }) {
  return (
    <div style={{ background: C.bg2, border: `1px solid ${accent ? 'rgba(201,168,76,0.3)' : C.border}`, borderRadius: 8, padding: '18px 20px', position: 'relative', overflow: 'hidden' }}>
      {accent && <div style={{ position:'absolute', top:0, left:0, right:0, height:2, background:`linear-gradient(90deg, ${C.gold}, transparent)` }} />}
      <div style={{ fontFamily:"'DM Mono', monospace", fontSize:10, color:C.text3, letterSpacing:'0.15em', textTransform:'uppercase', marginBottom:6 }}>{label}</div>
      <div style={{ fontFamily:"'DM Mono', monospace", fontSize:22, fontWeight:500, color: accent ? C.gold2 : C.text, marginBottom:4 }}>{value}</div>
      {sub && <div style={{ fontSize:11, color:C.text3 }}>{sub}</div>}
    </div>
  );
}

export default function Dashboard() {
  const [holdings, setHoldings] = useState(DEFAULT_HOLDINGS);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ ticker:'', name:'', shares:'', avgPrice:'', currentPrice:'', targetPct:'' });
  const [cash, setCash] = useState(500);

  const totalValue = holdings.reduce((s, h) => s + h.shares * h.currentPrice, 0) + cash;
  const totalCost = holdings.reduce((s, h) => s + h.shares * h.avgPrice, 0);
  const totalGain = holdings.reduce((s, h) => s + h.shares * (h.currentPrice - h.avgPrice), 0);
  const gainPct = totalCost > 0 ? (totalGain / totalCost * 100) : 0;

  const pieData = [
    ...holdings.filter(h => h.shares > 0).map(h => ({ name: h.ticker, value: Math.round(h.shares * h.currentPrice), color: h.color })),
    { name: '现金', value: cash, color: PALETTE[4] },
  ];

  function updatePrice(id, val) {
    setHoldings(prev => prev.map(h => h.id === id ? { ...h, currentPrice: parseFloat(val) || h.currentPrice } : h));
  }

  function addHolding() {
    if (!form.ticker) return;
    setHoldings(prev => [...prev, {
      id: Date.now(), ticker: form.ticker.toUpperCase(), name: form.name || form.ticker,
      shares: parseFloat(form.shares) || 0, avgPrice: parseFloat(form.avgPrice) || 0,
      currentPrice: parseFloat(form.currentPrice) || 0, targetPct: parseFloat(form.targetPct) || 0,
      color: PALETTE[prev.length % PALETTE.length],
    }]);
    setForm({ ticker:'', name:'', shares:'', avgPrice:'', currentPrice:'', targetPct:'' });
    setShowAdd(false);
  }

  const inputStyle = { background: C.bg3, border: `1px solid ${C.border2}`, borderRadius: 6, padding: '8px 12px', color: C.text, fontSize: 13, fontFamily: "inherit", width: '100%', outline: 'none' };
  const labelStyle = { fontSize: 11, color: C.text3, marginBottom: 4, display: 'block', fontFamily:"'DM Mono', monospace", letterSpacing:'0.1em', textTransform:'uppercase' };

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontFamily:"'DM Mono', monospace", fontSize:10, color:C.gold, letterSpacing:'0.2em', textTransform:'uppercase', marginBottom:8 }}>Portfolio Overview</div>
        <h1 style={{ fontFamily:"'Noto Serif SC', serif", fontSize:28, fontWeight:700, color:'#fff' }}>投资组合</h1>
      </div>

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:28 }}>
        <StatCard accent label="总资产" value={`$${totalValue.toLocaleString('en',{maximumFractionDigits:0})}`} sub="含现金" />
        <StatCard label="总成本" value={`$${totalCost.toLocaleString('en',{maximumFractionDigits:0})}`} sub="买入均价" />
        <StatCard label="浮动盈亏" value={`${totalGain >= 0 ? '+' : ''}$${totalGain.toLocaleString('en',{maximumFractionDigits:0})}`} sub={`${gainPct >= 0 ? '+' : ''}${gainPct.toFixed(2)}%`} />
        <StatCard label="现金备用" value={`$${cash.toLocaleString()}`} sub="10%目标配置" />
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 280px', gap:20, marginBottom:28 }}>
        {/* Holdings table */}
        <div style={{ background:C.bg2, border:`1px solid ${C.border}`, borderRadius:8, overflow:'hidden' }}>
          <div style={{ padding:'16px 20px', borderBottom:`1px solid ${C.border}`, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <span style={{ fontSize:13, fontWeight:500, color:C.text }}>持仓明细</span>
            <button onClick={() => setShowAdd(!showAdd)} style={{ fontFamily:"'DM Mono', monospace", fontSize:10, color:C.gold, background:'rgba(201,168,76,0.1)', border:`1px solid rgba(201,168,76,0.3)`, borderRadius:4, padding:'4px 12px', cursor:'pointer', letterSpacing:'0.1em' }}>+ 添加持仓</button>
          </div>
          {showAdd && (
            <div style={{ padding:'16px 20px', borderBottom:`1px solid ${C.border}`, background:'rgba(201,168,76,0.03)' }}>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10, marginBottom:10 }}>
                {[['ticker','代码(如AAPL)'],['name','名称'],['shares','股数'],['avgPrice','成本价($)'],['currentPrice','现价($)'],['targetPct','目标仓位(%)']].map(([k,p]) => (
                  <div key={k}><label style={labelStyle}>{p}</label>
                    <input style={inputStyle} placeholder={p} value={form[k]} onChange={e => setForm(f => ({...f,[k]:e.target.value}))} />
                  </div>
                ))}
              </div>
              <div style={{ display:'flex', gap:8 }}>
                <button onClick={addHolding} style={{ background:C.gold, color:'#000', border:'none', borderRadius:6, padding:'8px 20px', fontSize:12, fontWeight:500, cursor:'pointer' }}>确认添加</button>
                <button onClick={() => setShowAdd(false)} style={{ background:'transparent', color:C.text2, border:`1px solid ${C.border}`, borderRadius:6, padding:'8px 16px', fontSize:12, cursor:'pointer' }}>取消</button>
              </div>
            </div>
          )}
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead>
              <tr>{['代码','名称','股数','成本价','现价','市值','盈亏','目标%','实际%'].map(h => (
                <th key={h} style={{ fontFamily:"'DM Mono', monospace", fontSize:9, color:C.text3, letterSpacing:'0.12em', textTransform:'uppercase', padding:'10px 14px', borderBottom:`1px solid ${C.border2}`, textAlign:'right', whiteSpace:'nowrap' }}>{h}</th>
              ))}</tr>
            </thead>
            <tbody>
              {holdings.map(h => {
                const mv = h.shares * h.currentPrice;
                const gain = h.shares * (h.currentPrice - h.avgPrice);
                const gainP = h.avgPrice > 0 ? (h.currentPrice / h.avgPrice - 1) * 100 : 0;
                const actualPct = totalValue > 0 ? (mv / totalValue * 100) : 0;
                const diff = actualPct - h.targetPct;
                return (
                  <tr key={h.id} style={{ borderBottom:`1px solid ${C.border}` }}>
                    <td style={{ padding:'11px 14px', fontFamily:"'DM Mono', monospace", fontSize:12, color:C.gold }}>{h.ticker}</td>
                    <td style={{ padding:'11px 14px', fontSize:12, color:C.text2 }}>{h.name}</td>
                    <td style={{ padding:'11px 14px', fontFamily:"'DM Mono', monospace", fontSize:12, color:C.text, textAlign:'right' }}>{h.shares}</td>
                    <td style={{ padding:'11px 14px', fontFamily:"'DM Mono', monospace", fontSize:12, color:C.text2, textAlign:'right' }}>${h.avgPrice.toFixed(2)}</td>
                    <td style={{ padding:'6px 14px', textAlign:'right' }}>
                      <input type="number" value={h.currentPrice} onChange={e => updatePrice(h.id, e.target.value)}
                        style={{ background:'transparent', border:`1px solid ${C.border}`, borderRadius:4, padding:'3px 6px', color:C.text, fontFamily:"'DM Mono', monospace", fontSize:12, width:72, textAlign:'right', outline:'none' }} />
                    </td>
                    <td style={{ padding:'11px 14px', fontFamily:"'DM Mono', monospace", fontSize:12, color:C.text, textAlign:'right' }}>${mv.toLocaleString('en',{maximumFractionDigits:0})}</td>
                    <td style={{ padding:'11px 14px', fontFamily:"'DM Mono', monospace", fontSize:12, color: gain >= 0 ? C.green2 : C.red, textAlign:'right' }}>{gain >= 0 ? '+' : ''}${gain.toFixed(0)}<br /><span style={{fontSize:10}}>{gainP >= 0 ? '+' : ''}{gainP.toFixed(1)}%</span></td>
                    <td style={{ padding:'11px 14px', fontFamily:"'DM Mono', monospace", fontSize:11, color:C.text3, textAlign:'right' }}>{h.targetPct}%</td>
                    <td style={{ padding:'11px 14px', fontFamily:"'DM Mono', monospace", fontSize:11, color: Math.abs(diff) > 5 ? '#c97c3a' : C.green2, textAlign:'right' }}>{actualPct.toFixed(1)}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pie chart */}
        <div style={{ background:C.bg2, border:`1px solid ${C.border}`, borderRadius:8, padding:'20px' }}>
          <div style={{ fontSize:13, fontWeight:500, color:C.text, marginBottom:16 }}>配置比例</div>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart><Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={2} dataKey="value">
              {pieData.map((e, i) => <Cell key={i} fill={e.color} stroke="transparent" />)}
            </Pie><Tooltip formatter={v => [`$${v.toLocaleString()}`, '']} contentStyle={{ background:C.bg3, border:`1px solid ${C.border2}`, borderRadius:6, fontSize:12 }} /></PieChart>
          </ResponsiveContainer>
          <div style={{ display:'flex', flexDirection:'column', gap:6, marginTop:8 }}>
            {pieData.map((d,i) => (
              <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <span style={{ display:'flex', alignItems:'center', gap:6, fontSize:12, color:C.text2 }}>
                  <span style={{ width:8, height:8, borderRadius:2, background:d.color, display:'inline-block' }} />{d.name}
                </span>
                <span style={{ fontFamily:"'DM Mono', monospace", fontSize:11, color:C.text3 }}>{totalValue > 0 ? (d.value/totalValue*100).toFixed(1) : 0}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Growth line */}
      <div style={{ background:C.bg2, border:`1px solid ${C.border}`, borderRadius:8, padding:'20px' }}>
        <div style={{ fontSize:13, fontWeight:500, color:C.text, marginBottom:16 }}>资产增长记录</div>
        <ResponsiveContainer width="100%" height={160}>
          <LineChart data={HISTORY}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="month" tick={{ fill:C.text3, fontSize:11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill:C.text3, fontSize:11 }} axisLine={false} tickLine={false} tickFormatter={v => `$${v}`} />
            <Tooltip contentStyle={{ background:C.bg3, border:`1px solid ${C.border2}`, borderRadius:6, fontSize:12 }} formatter={v => [`$${v.toLocaleString()}`, '资产']} />
            <Line type="monotone" dataKey="value" stroke={C.gold} strokeWidth={2} dot={{ fill:C.gold, r:3 }} />
          </LineChart>
        </ResponsiveContainer>
        <div style={{ marginTop:8, fontSize:11, color:C.text3 }}>💡 每月更新现价后，手动在此记录当月总资产快照</div>
      </div>
    </div>
  );
}
