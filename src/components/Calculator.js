import React, { useState, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const C = {
  bg2:'#111',bg3:'#181818',border:'rgba(255,255,255,0.07)',border2:'rgba(255,255,255,0.12)',
  text:'#e8e4dc',text2:'#9a9690',text3:'#5a5652',
  gold:'#c9a84c',gold2:'#e8c97a',green:'#4a9e6f',green2:'#6abf8a',red:'#b85a4a',blue:'#4a7ab5',blue2:'#6a9ad5',
};

function Slider({ label, value, min, max, step, format, onChange }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
        <span style={{ fontFamily:"'DM Mono', monospace", fontSize:10, color:C.text3, letterSpacing:'0.12em', textTransform:'uppercase' }}>{label}</span>
        <span style={{ fontFamily:"'DM Mono', monospace", fontSize:14, color:C.gold2, fontWeight:500 }}>{format(value)}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={e => onChange(parseFloat(e.target.value))}
        style={{ width:'100%', accentColor:C.gold, cursor:'pointer', height:4 }} />
      <div style={{ display:'flex', justifyContent:'space-between', marginTop:4, fontFamily:"'DM Mono', monospace", fontSize:9, color:C.text3 }}>
        <span>{format(min)}</span><span>{format(max)}</span>
      </div>
    </div>
  );
}

export default function Calculator() {
  const [init, setInit] = useState(30000);
  const [monthly, setMonthly] = useState(1000);
  const [rate, setRate] = useState(13);
  const [years, setYears] = useState(10);

  const data = useMemo(() => {
    const mr = rate / 100 / 12;
    const results = [];
    let val = init, cost = init;
    for (let y = 0; y <= years; y++) {
      results.push({ year: `第${y}年`, 资产总值: Math.round(val), 投入本金: Math.round(cost), 复利增值: Math.round(Math.max(0, val - cost)) });
      for (let m = 0; m < 12; m++) { val = val * (1 + mr) + monthly; cost += monthly; }
    }
    return results;
  }, [init, monthly, rate, years]);

  const final = data[data.length - 1];
  const fmtM = v => v >= 1000000 ? `$${(v/1000000).toFixed(2)}M` : `$${Math.round(v/1000)}K`;
  const fmt$ = v => `$${v.toLocaleString('en', { maximumFractionDigits:0 })}`;

  const scenarios = [8, 13, 15].map(r => {
    const mr = r / 100 / 12; let v = init;
    for (let m = 0; m < years * 12; m++) v = v * (1 + mr) + monthly;
    return { rate: r, final: Math.round(v) };
  });

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontFamily:"'DM Mono', monospace", fontSize:10, color:C.gold, letterSpacing:'0.2em', textTransform:'uppercase', marginBottom:8 }}>Compound Calculator</div>
        <h1 style={{ fontFamily:"'Noto Serif SC', serif", fontSize:28, fontWeight:700, color:'#fff' }}>复利计算器</h1>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'320px 1fr', gap:24 }}>
        {/* Controls */}
        <div>
          <div style={{ background:C.bg2, border:`1px solid ${C.border}`, borderRadius:8, padding:'24px 22px', marginBottom:16 }}>
            <div style={{ fontSize:13, fontWeight:500, color:C.text, marginBottom:20 }}>参数设置</div>
            <Slider label="初始本金" value={init} min={5000} max={100000} step={1000} format={v=>`$${v.toLocaleString()}`} onChange={setInit} />
            <Slider label="每月定投" value={monthly} min={200} max={5000} step={100} format={v=>`$${v.toLocaleString()}`} onChange={setMonthly} />
            <Slider label="预期年化回报" value={rate} min={5} max={25} step={0.5} format={v=>`${v}%`} onChange={setRate} />
            <Slider label="投资年限" value={years} min={3} max={25} step={1} format={v=>`${v}年`} onChange={setYears} />
          </div>

          {/* Key results */}
          <div style={{ background:C.bg2, border:`1px solid rgba(201,168,76,0.25)`, borderRadius:8, padding:'20px 22px', position:'relative', overflow:'hidden' }}>
            <div style={{ position:'absolute', top:0, left:0, right:0, height:2, background:`linear-gradient(90deg, ${C.gold}, transparent)` }} />
            <div style={{ fontFamily:"'DM Mono', monospace", fontSize:9, color:C.text3, letterSpacing:'0.15em', textTransform:'uppercase', marginBottom:6 }}>{years}年后总资产</div>
            <div style={{ fontFamily:"'DM Mono', monospace", fontSize:32, fontWeight:500, color:C.gold2, marginBottom:16 }}>{fmtM(final?.资产总值 || 0)}</div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
              {[['总投入本金', fmt$(final?.投入本金||0), C.text2],['复利增值', fmt$(final?.复利增值||0), C.green2]].map(([l,v,col]) => (
                <div key={l} style={{ background:C.bg3, borderRadius:6, padding:'10px 12px' }}>
                  <div style={{ fontSize:10, color:C.text3, marginBottom:4 }}>{l}</div>
                  <div style={{ fontFamily:"'DM Mono', monospace", fontSize:14, color:col }}>{v}</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop:12, fontSize:11, color:C.text3 }}>
              复利占比：<span style={{ color:C.green2, fontFamily:"'DM Mono', monospace" }}>{final?.资产总值 > 0 ? ((final.复利增值/final.资产总值)*100).toFixed(0) : 0}%</span>
              {' '}资产来自市场增长
            </div>
          </div>
        </div>

        {/* Chart + table */}
        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
          <div style={{ background:C.bg2, border:`1px solid ${C.border}`, borderRadius:8, padding:'20px', flex:1 }}>
            <div style={{ fontSize:13, color:C.text, marginBottom:16 }}>资产增长曲线</div>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="gGold" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={C.gold} stopOpacity={0.15}/>
                    <stop offset="95%" stopColor={C.gold} stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="gBlue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={C.blue} stopOpacity={0.2}/>
                    <stop offset="95%" stopColor={C.blue} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="year" tick={{ fill:C.text3, fontSize:10 }} axisLine={false} tickLine={false} interval={Math.floor(years/5)} />
                <YAxis tick={{ fill:C.text3, fontSize:10 }} axisLine={false} tickLine={false} tickFormatter={v=>v>=1000000?`$${(v/1000000).toFixed(1)}M`:`$${(v/1000).toFixed(0)}K`} />
                <Tooltip contentStyle={{ background:C.bg3, border:`1px solid ${C.border2}`, borderRadius:6, fontSize:11 }} formatter={v=>[`$${v.toLocaleString()}`,'']} />
                <Legend iconSize={8} wrapperStyle={{ fontSize:11, color:C.text2 }} />
                <Area type="monotone" dataKey="资产总值" stroke={C.gold} fill="url(#gGold)" strokeWidth={2} />
                <Area type="monotone" dataKey="投入本金" stroke={C.blue2} fill="url(#gBlue)" strokeWidth={1.5} strokeDasharray="4 3" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Scenarios */}
          <div style={{ background:C.bg2, border:`1px solid ${C.border}`, borderRadius:8, padding:'18px 20px' }}>
            <div style={{ fontSize:13, color:C.text, marginBottom:14 }}>三种情景对比（{years}年后）</div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10 }}>
              {scenarios.map((s,i) => (
                <div key={s.rate} style={{ background:C.bg3, borderRadius:6, padding:'14px', textAlign:'center', border: i===1 ? `1px solid rgba(201,168,76,0.3)` : `1px solid ${C.border}` }}>
                  <div style={{ fontFamily:"'DM Mono', monospace", fontSize:10, color: [C.blue2,C.gold,C.green2][i], marginBottom:6 }}>{['保守','中性','积极'][i]} · {s.rate}%</div>
                  <div style={{ fontFamily:"'DM Mono', monospace", fontSize:16, color:C.text, fontWeight: i===1 ? 500 : 300 }}>{fmtM(s.final)}</div>
                  <div style={{ fontSize:10, color:C.text3, marginTop:4 }}>回报 {((s.final/init-1)*100).toFixed(0)}%</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Yearly breakdown */}
      <div style={{ background:C.bg2, border:`1px solid ${C.border}`, borderRadius:8, marginTop:16, overflow:'hidden' }}>
        <div style={{ padding:'14px 20px', borderBottom:`1px solid ${C.border}` }}>
          <span style={{ fontSize:13, fontWeight:500, color:C.text }}>逐年明细表</span>
        </div>
        <div style={{ overflowX:'auto' }}>
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead>
              <tr>{['时间','累计投入本金','资产总值','复利增值','增值占比','年增长'].map(h => (
                <th key={h} style={{ fontFamily:"'DM Mono', monospace", fontSize:9, color:C.text3, letterSpacing:'0.1em', textTransform:'uppercase', padding:'9px 16px', borderBottom:`1px solid ${C.border2}`, textAlign:'right', whiteSpace:'nowrap' }}>{h}</th>
              ))}</tr>
            </thead>
            <tbody>
              {data.filter((_, i) => i % Math.max(1, Math.floor(years/10)) === 0 || i === data.length-1).map((r, idx, arr) => {
                const prev = idx > 0 ? arr[idx-1].资产总值 : init;
                const yGrowth = prev > 0 ? ((r.资产总值/prev-1)*100) : 0;
                return (
                  <tr key={r.year} style={{ borderBottom:`1px solid ${C.border}` }}>
                    <td style={{ padding:'10px 16px', fontFamily:"'DM Mono', monospace", fontSize:12, color: idx===arr.length-1?C.gold2:C.text2, textAlign:'right' }}>{r.year}</td>
                    <td style={{ padding:'10px 16px', fontFamily:"'DM Mono', monospace", fontSize:12, color:C.text3, textAlign:'right' }}>${r.投入本金.toLocaleString()}</td>
                    <td style={{ padding:'10px 16px', fontFamily:"'DM Mono', monospace", fontSize:12, color: idx===arr.length-1?C.gold2:C.text, textAlign:'right' }}>${r.资产总值.toLocaleString()}</td>
                    <td style={{ padding:'10px 16px', fontFamily:"'DM Mono', monospace", fontSize:12, color:C.green2, textAlign:'right' }}>+${r.复利增值.toLocaleString()}</td>
                    <td style={{ padding:'10px 16px', fontFamily:"'DM Mono', monospace", fontSize:12, color:C.green2, textAlign:'right' }}>{r.资产总值>0?((r.复利增值/r.资产总值)*100).toFixed(0):0}%</td>
                    <td style={{ padding:'10px 16px', fontFamily:"'DM Mono', monospace", fontSize:12, color: yGrowth>0?C.green2:C.red, textAlign:'right' }}>{idx===0?'—':`+${yGrowth.toFixed(1)}%`}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
