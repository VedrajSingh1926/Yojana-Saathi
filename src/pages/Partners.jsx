import React, { useState, useEffect } from 'react';
import { ShieldCheck, Server, AlertCircle, RefreshCw, Layers, Brain, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Partners() {
  const [partners, setPartners] = useState([
    { id: 'gemini', name: 'Google Gemini', type: 'Core AI Engine', status: 'connected', latency: '450ms', desc: 'Powers scheme recommendations and reasoning.' },
    { id: 'gnani', name: 'Gnani.ai', type: 'Voice Intelligence', status: 'connected', latency: '120ms', desc: 'Handles multilingual speech-to-text and voice navigation.' },
    { id: 'alchemyst', name: 'Alchemyst AI', type: 'Orchestrator', status: 'connected', latency: '80ms', desc: 'Chains memories and LLM calls in a logical pipeline.' },
    { id: 'mem0', name: 'Mem0', type: 'Long-term Memory', status: 'connected', latency: '210ms', desc: 'Stores persistent household context across sessions.' },
    { id: 'keploy', name: 'Keploy', type: 'API Testing', status: 'pending', latency: '-', desc: 'Ensures our partner API contracts remain stable.' },
    { id: 'outlier', name: 'Outlier', type: 'Evaluation Tracking', status: 'connected', latency: 'async', desc: 'Monitors the safety and quality of AI outputs.' }
  ]);

  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'connected': return <CheckCircle2 size={18} className="text-success" />;
      case 'error': return <AlertCircle size={18} className="text-danger" />;
      default: return <RefreshCw size={18} className="text-muted spin-animation" />;
    }
  };

  return (
    <div className="view-section animate-fade-in" style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ color: 'var(--lux-text)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Layers size={28} color="var(--primary)" /> Partner Integrations
          </h1>
          <p className="text-muted">Real-time status of the external AI models and services powering Yojana Saathi.</p>
        </div>
        <button className="btn btn-outline" onClick={handleRefresh} disabled={refreshing} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <RefreshCw size={16} className={refreshing ? "spin-animation" : ""} /> {refreshing ? 'Pinging...' : 'Ping Services'}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {partners.map((p, idx) => (
          <motion.div 
            key={p.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="glass-card" 
            style={{ padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--border-color)', position: 'relative' }}
          >
            <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem' }}>
              {getStatusIcon(p.status)}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--bg-darkest)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                <Server size={24} />
              </div>
              <div>
                <h3 style={{ margin: 0, color: 'var(--lux-text)', fontSize: '1.1rem' }}>{p.name}</h3>
                <span style={{ fontSize: '0.8rem', color: 'var(--gold)', fontWeight: 500 }}>{p.type}</span>
              </div>
            </div>
            <p style={{ color: 'var(--lux-muted)', fontSize: '0.9rem', lineHeight: 1.5, marginBottom: '1.5rem', minHeight: '40px' }}>
              {p.desc}
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px dashed var(--border-color)', paddingTop: '1rem' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Status: <strong style={{ color: p.status === 'connected' ? 'var(--success)' : 'var(--text-muted)' }}>{p.status.toUpperCase()}</strong></span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Latency: <strong>{p.latency}</strong></span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="glass-card mt-5" style={{ padding: '2rem', borderRadius: '16px', border: '1px dashed var(--primary)' }}>
        <h3 style={{ color: 'var(--primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ShieldCheck size={20} /> Production Architecture
        </h3>
        <p className="text-muted mb-0" style={{ lineHeight: 1.6 }}>
          Yojana Saathi operates on a highly decoupled microservice architecture. 
          The <strong>Alchemyst AI</strong> orchestrator acts as our central nervous system, retrieving user history from <strong>Mem0</strong>, 
          querying <strong>Google Gemini</strong> for reasoning, and logging quality metrics to <strong>Outlier</strong> asynchronously. 
          Voice navigation is powered natively by <strong>Gnani.ai</strong> models.
        </p>
      </div>
    </div>
  );
}
