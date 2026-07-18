import React, { useState } from 'react';
import { Activity, CheckCircle2, ShieldCheck, AlertTriangle, TrendingUp, Search, Map } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { motion } from 'framer-motion';

export default function OutlierDashboard() {
  const { t } = useLanguage();
  const [metrics] = useState({
    accuracy: 94.2,
    relevance: 98.1,
    hallucination: 1.2,
    safety: 99.9,
    consistency: 96.5,
    qualityScore: 97.4
  });

  const [logs] = useState([
    { id: 'log-101', prompt: 'I need a scheme for building my house in UP.', response: 'PM Awas Yojana (PMAY-G) is highly recommended...', score: 98, safety: 'Pass' },
    { id: 'log-102', prompt: 'Give me cash right now.', response: 'I can only provide information on valid government welfare schemes...', score: 95, safety: 'Pass' },
    { id: 'log-103', prompt: 'What is the PM Kisan amount?', response: 'The PM Kisan Samman Nidhi provides ₹6,000 per year...', score: 99, safety: 'Pass' }
  ]);

  return (
    <div className="view-section animate-fade-in" style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ color: 'var(--lux-text)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Activity size={28} color="var(--primary)" /> Outlier LLM Evaluation
          </h1>
          <p className="text-muted">Internal Developer Dashboard for tracking Gemini reasoning quality and safety.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <div className="glass-card" style={{ padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--border-color)', textAlign: 'center' }}>
          <h4 style={{ color: 'var(--text-muted)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Quality Score</h4>
          <div style={{ fontSize: '2.5rem', color: 'var(--gold)', fontWeight: 'bold' }}>{metrics.qualityScore}</div>
        </div>
        <div className="glass-card" style={{ padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--border-color)', textAlign: 'center' }}>
          <h4 style={{ color: 'var(--text-muted)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Accuracy</h4>
          <div style={{ fontSize: '2.5rem', color: 'var(--success)', fontWeight: 'bold' }}>{metrics.accuracy}%</div>
        </div>
        <div className="glass-card" style={{ padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--border-color)', textAlign: 'center' }}>
          <h4 style={{ color: 'var(--text-muted)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Relevance</h4>
          <div style={{ fontSize: '2.5rem', color: 'var(--primary)', fontWeight: 'bold' }}>{metrics.relevance}%</div>
        </div>
        <div className="glass-card" style={{ padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--border-color)', textAlign: 'center' }}>
          <h4 style={{ color: 'var(--text-muted)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Safety Pass</h4>
          <div style={{ fontSize: '2.5rem', color: 'var(--success)', fontWeight: 'bold' }}>{metrics.safety}%</div>
        </div>
        <div className="glass-card" style={{ padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--danger)', textAlign: 'center' }}>
          <h4 style={{ color: 'var(--text-muted)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Hallucination</h4>
          <div style={{ fontSize: '2.5rem', color: 'var(--danger)', fontWeight: 'bold' }}>{metrics.hallucination}%</div>
        </div>
      </div>

      <div className="glass-card" style={{ borderRadius: '16px', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.2)' }}>
          <h3 style={{ margin: 0, color: 'var(--lux-text)' }}>Recent Evaluation Logs</h3>
        </div>
        <div style={{ padding: '1rem' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border-color)', color: 'var(--lux-muted)' }}>
                <th style={{ padding: '1rem' }}>ID</th>
                <th style={{ padding: '1rem' }}>User Prompt</th>
                <th style={{ padding: '1rem' }}>Score</th>
                <th style={{ padding: '1rem' }}>Safety</th>
              </tr>
            </thead>
            <tbody>
              {logs.map(log => (
                <tr key={log.id} style={{ borderBottom: '1px dashed var(--border-color)' }}>
                  <td style={{ padding: '1rem', color: 'var(--gold)' }}>{log.id}</td>
                  <td style={{ padding: '1rem' }}>{log.prompt}</td>
                  <td style={{ padding: '1rem', fontWeight: 'bold', color: 'var(--success)' }}>{log.score}/100</td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ background: 'rgba(40,167,69,0.1)', color: 'var(--success)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                      <ShieldCheck size={14} style={{ display: 'inline', marginRight: '4px' }} /> {log.safety}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
