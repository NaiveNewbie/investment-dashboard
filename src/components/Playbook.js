import React, { useState } from 'react';

const C = {
  bg2:'#111',bg3:'#181818',border:'rgba(255,255,255,0.07)',border2:'rgba(255,255,255,0.12)',
  text:'#e8e4dc',text2:'#9a9690',text3:'#5a5652',
  gold:'#c9a84c',gold2:'#e8c97a',green:'#4a9e6f',green2:'#6abf8a',red:'#b85a4a',red2:'#d4756a',blue2:'#6a9ad5',amber:'#c97c3a',
};

const MONTHLY = ['固定日期买入定投份额（如每月1日）','确认止损单仍有效（GTC状态）','记录本月买入价格和股数','阅读1–2篇宏观经济报告'];
const QUARTERLY = ['查看持仓个股季报业绩','对比实际仓位 vs 目标配置','评估个股逻辑是否仍成立','记录季度投资日志'];
const YEARLY = ['完整再平衡（12月执行）','上移止损线（跟踪上涨）','评估年度总回报 vs 目标','复盘所有买卖决策对错','税务整理（新加坡资本利得免税）'];

const RULES_DO = ['每月定投，无论市场涨跌','每笔买入都设好止损单（-15%）','大跌时加仓ETF，而非割肉','以逻辑和数据做决策，不凭感情','每年再平衡一次，不多不少','持续学习：读财报、看行业报告','只用闲钱投资，不动生活资金'];
const RULES_DONT = ['追热点、听消息买卖股票','因短期亏损恐慌卖出ETF','单只个股超过总仓位15%','使用杠杆（融资/期权）','频繁换股（每月超过2笔卖出）','看短期K线预测涨跌做决策','市场暴跌后全部清仓离场'];

const RISKS = [
  { s:'单只个股大跌', t:'买入价下跌15%', a:'止损单自动触发，全部卖出，冷静后再评估', lvl:'高', col:C.red },
  { s:'ETF回调', t:'QQQ/SPY从高点跌20%', a:'不卖出，反而加大当月定投金额（最多2倍）', lvl:'中', col:C.amber },
  { s:'账户整体亏损', t:'总净值下跌25%', a:'暂停新增个股，检查仓位配置，不恐慌卖ETF', lvl:'高', col:C.red },
  { s:'单只仓位过重', t:'单只超过总仓位15%', a:'部分减仓至10%以内，卖出收益买入欠配ETF', lvl:'中', col:C.amber },
  { s:'基本面变化', t:'季报连续两季大幅不及预期', a:'不管涨跌，评估后以逻辑决定是否换仓', lvl:'中', col:C.amber },
  { s:'市场黑天鹅', t:'指数单日跌幅超5%', a:'不操作，不刷账户，等72小时后再做判断', lvl:'低', col:C.green2 },
];

const PHASES = [
  { num:'P1', period:'第1–3个月', name:'建仓期', active:true, items:['第1个月：投入初始本金40%，买入QQQ+SPY（2:1）','第2个月：再投入30%，同时买1只个股','第3个月：剩余30%建仓，补齐配置比例','每笔买入同步设置止损单，有效期GTC','开通Paper Trading账户并行练习操作'] },
  { num:'P2', period:'第3个月–第5年', name:'定投积累期', items:['每月固定投入$1,000+，无论市场涨跌','70%自动买QQQ+SPY，30%机动买个股','市场大跌10%以上：加大买入，而非卖出','每季度花1小时看财报，确认持仓逻辑未变'] },
  { num:'P3', period:'每年12月', name:'再平衡期', items:['检查各仓位实际比例 vs 目标比例','偏差超过5%的仓位：卖出超出部分，买入不足部分','重新评估个股逻辑：基本面是否依然成立','检查止损线是否需要上移（跟随上涨调整）'] },
  { num:'P4', period:'第7–10年', name:'收获保护期', items:['卫星个股仓位逐步转移至ETF，降低集中风险','防御板块比例从10%提升至25–30%','开始评估现金流需求：股息能否覆盖生活支出','若资产达到目标，设立"不动金"：永不卖出的核心仓'] },
];

function CheckCard({ title, color, items, prefix }) {
  const [checked, setChecked] = useState({});
  const toggle = i => setChecked(p => ({ ...p, [i]: !p[i] }));
  const done = Object.values(checked).filter(Boolean).length;
  return (
    <div style={{ background:C.bg2, border:`1px solid ${C.border}`, borderRadius:8, padding:'18px 20px' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14 }}>
        <div style={{ fontFamily:"'DM Mono', monospace", fontSize:10, color, letterSpacing:'0.15em', textTransform:'uppercase' }}>{prefix}</div>
        <div style={{ fontFamily:"'DM Mono', monospace", fontSize:10, color:C.text3 }}>{done}/{items.length}</div>
      </div>
      <div style={{ fontSize:13, fontWeight:500, color:C.text, marginBottom:14 }}>{title}</div>
      {items.map((item, i) => (
        <div key={i} onClick={() => toggle(i)} style={{ display:'flex', gap:10, alignItems:'flex-start', padding:'7px 0', borderBottom: i<items.length-1?`1px solid ${C.border}`:'none', cursor:'pointer' }}>
          <div style={{ width:16, height:16, border:`1px solid ${checked[i]?color:C.border2}`, borderRadius:3, flexShrink:0, marginTop:1, background:checked[i]?`${color}20`:'transparent', display:'flex', alignItems:'center', justifyContent:'center', transition:'all 0.15s' }}>
            {checked[i] && <span style={{ fontSize:10, color }}>✓</span>}
          </div>
          <span style={{ fontSize:12, color: checked[i] ? C.text3 : C.text2, textDecoration: checked[i]?'line-through':'none', lineHeight:1.5, transition:'all 0.15s' }}>{item}</span>
        </div>
      ))}
    </div>
  );
}

export default function Playbook() {
  const [tab, setTab] = useState('checklist');
  const tabs = [{ id:'checklist',label:'操作清单' },{ id:'rules',label:'铁律规则' },{ id:'risk',label:'风险应对' },{ id:'phases',label:'执行阶段' }];

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontFamily:"'DM Mono', monospace", fontSize:10, color:C.gold, letterSpacing:'0.2em', textTransform:'uppercase', marginBottom:8 }}>Strategy Playbook</div>
        <h1 style={{ fontFamily:"'Noto Serif SC', serif", fontSize:28, fontWeight:700, color:'#fff' }}>投资手册</h1>
      </div>

      {/* Tabs */}
      <div style={{ display:'flex', gap:4, marginBottom:28, background:C.bg2, border:`1px solid ${C.border}`, borderRadius:8, padding:4, width:'fit-content' }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{ padding:'7px 18px', borderRadius:6, border:'none', cursor:'pointer', fontSize:12, fontWeight: tab===t.id?500:300, background: tab===t.id?'rgba(201,168,76,0.15)':'transparent', color: tab===t.id?C.gold2:C.text3, transition:'all 0.15s' }}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'checklist' && (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16 }}>
          <CheckCard title="每月必做" color={C.blue2} items={MONTHLY} prefix="Monthly" />
          <CheckCard title="每季度必做" color={C.gold} items={QUARTERLY} prefix="Quarterly" />
          <CheckCard title="每年必做" color={C.green2} items={YEARLY} prefix="Yearly" />
        </div>
      )}

      {tab === 'rules' && (
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
          <div style={{ background:C.bg2, border:`1px solid ${C.border}`, borderLeft:`2px solid ${C.green}`, borderRadius:8, padding:'20px 22px' }}>
            <div style={{ fontFamily:"'DM Mono', monospace", fontSize:10, color:C.green2, letterSpacing:'0.15em', textTransform:'uppercase', marginBottom:16 }}>✓ 必须坚持</div>
            {RULES_DO.map((r,i) => (
              <div key={i} style={{ display:'flex', gap:10, padding:'8px 0', borderBottom: i<RULES_DO.length-1?`1px solid ${C.border}`:'none' }}>
                <span style={{ color:C.green2, fontSize:12, flexShrink:0 }}>✓</span>
                <span style={{ fontSize:13, color:C.text2, lineHeight:1.5 }}>{r}</span>
              </div>
            ))}
          </div>
          <div style={{ background:C.bg2, border:`1px solid ${C.border}`, borderLeft:`2px solid ${C.red}`, borderRadius:8, padding:'20px 22px' }}>
            <div style={{ fontFamily:"'DM Mono', monospace", fontSize:10, color:C.red2, letterSpacing:'0.15em', textTransform:'uppercase', marginBottom:16 }}>✕ 绝对禁止</div>
            {RULES_DONT.map((r,i) => (
              <div key={i} style={{ display:'flex', gap:10, padding:'8px 0', borderBottom: i<RULES_DONT.length-1?`1px solid ${C.border}`:'none' }}>
                <span style={{ color:C.red2, fontSize:12, flexShrink:0 }}>✕</span>
                <span style={{ fontSize:13, color:C.text2, lineHeight:1.5 }}>{r}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'risk' && (
        <div style={{ background:C.bg2, border:`1px solid ${C.border}`, borderRadius:8, overflow:'hidden' }}>
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead>
              <tr>{['场景','触发条件','执行动作','风险'].map(h => (
                <th key={h} style={{ fontFamily:"'DM Mono', monospace", fontSize:9, color:C.text3, letterSpacing:'0.12em', textTransform:'uppercase', padding:'12px 18px', borderBottom:`1px solid ${C.border2}`, textAlign:'left' }}>{h}</th>
              ))}</tr>
            </thead>
            <tbody>
              {RISKS.map((r,i) => (
                <tr key={i} style={{ borderBottom:`1px solid ${C.border}` }}>
                  <td style={{ padding:'13px 18px', fontSize:13, color:C.text, fontWeight:500 }}>{r.s}</td>
                  <td style={{ padding:'13px 18px', fontSize:12, color:C.text2 }}>{r.t}</td>
                  <td style={{ padding:'13px 18px', fontSize:12, color:C.text2, lineHeight:1.5 }}>{r.a}</td>
                  <td style={{ padding:'13px 18px' }}>
                    <span style={{ fontFamily:"'DM Mono', monospace", fontSize:10, padding:'2px 9px', borderRadius:3, background:`${r.col}18`, color:r.col, border:`1px solid ${r.col}40` }}>{r.lvl}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'phases' && (
        <div style={{ position:'relative' }}>
          <div style={{ position:'absolute', left:19, top:0, bottom:0, width:1, background:C.border2 }} />
          {PHASES.map((p,i) => (
            <div key={i} style={{ display:'flex', gap:24, marginBottom:24 }}>
              <div style={{ width:39, height:39, borderRadius:'50%', background:C.bg2, border:`1px solid ${p.active?C.gold:C.border2}`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, fontFamily:"'DM Mono', monospace", fontSize:11, color: p.active?C.gold:C.text3, zIndex:1, background: p.active?'rgba(201,168,76,0.1)':C.bg2 }}>{p.num}</div>
              <div style={{ background:C.bg2, border:`1px solid ${C.border}`, borderRadius:8, padding:'18px 22px', flex:1 }}>
                <div style={{ fontFamily:"'DM Mono', monospace", fontSize:10, color:C.gold, letterSpacing:'0.15em', textTransform:'uppercase', marginBottom:6 }}>{p.period}</div>
                <div style={{ fontSize:15, fontWeight:500, color:'#fff', marginBottom:12 }}>{p.name}</div>
                {p.items.map((item,j) => (
                  <div key={j} style={{ display:'flex', gap:10, fontSize:13, color:C.text2, padding:'4px 0', lineHeight:1.5 }}>
                    <span style={{ color:C.gold, flexShrink:0 }}>→</span>{item}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
