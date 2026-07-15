import React, { useState } from 'react';
import { Users, Network, IdCard, FolderOpen, Calendar, ShieldCheck, QrCode, Plus, CloudLightning } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Family({ user, onAddMember, onUploadDoc, onTriggerAuth }) {
  const [subtab, setSubtab] = useState('overview');
  
  // Member Form State
  const [showMemberForm, setShowMemberForm] = useState(false);
  const [memberName, setMemberName] = useState('');
  const [memberRelation, setMemberRelation] = useState('Spouse');
  const [memberAge, setMemberAge] = useState('');
  const [memberOccupation, setMemberOccupation] = useState('Student');
  const [memberIncome, setMemberIncome] = useState('');

  if (!user) {
    return (
      <div className="view-section text-center animate-fade-in">
        <div className="glass-card" style={{ maxWidth: '600px', margin: '4rem auto', padding: '3rem' }}>
          <Users size={48} className="text-gold" style={{ margin: '0 auto 1rem' }} />
          <h2>Household Dashboard Locked</h2>
          <p className="text-muted mb-4 mt-2">Log in to view your unified family members registry, verify documents, and activate your official Welfare Passport card.</p>
          <button className="btn btn-primary" onClick={() => onTriggerAuth(false)}>Sign In Now</button>
        </div>
      </div>
    );
  }

  const handleAddMemberSubmit = (e) => {
    e.preventDefault();
    if (!memberName.trim() || !memberAge || !memberIncome) return;

    onAddMember({
      name: memberName,
      relation: memberRelation,
      age: parseInt(memberAge),
      occupation: memberOccupation,
      income: parseInt(memberIncome),
      status: "Pending Verification"
    });

    // Reset Form
    setMemberName('');
    setMemberRelation('Spouse');
    setMemberAge('');
    setMemberOccupation('Student');
    setMemberIncome('');
    setShowMemberForm(false);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onUploadDoc(file.name);
    }
  };

  return (
    <div className="view-section animate-fade-in">
      <div className="family-hero">
        <h1 className="hero-title text-center">Family Welfare Dashboard</h1>
        <p className="text-center text-muted">Manage your household members, documents, and welfare profile in one place to automate eligibility checks.</p>
      </div>

      <div className="family-tabs-container">
        {/* Navigation tabs */}
        <div className="family-tabs-header">
          <button className={`family-tab-btn ${subtab === 'overview' ? 'active' : ''}`} onClick={() => setSubtab('overview')}>
            <Users size={16} /> Household Overview
          </button>
          <button className={`family-tab-btn ${subtab === 'tree' ? 'active' : ''}`} onClick={() => setSubtab('tree')}>
            <Network size={16} /> Family Tree
          </button>
          <button className={`family-tab-btn ${subtab === 'passport' ? 'active' : ''}`} onClick={() => setSubtab('passport')}>
            <IdCard size={16} /> Welfare Passport
          </button>
          <button className={`family-tab-btn ${subtab === 'documents' ? 'active' : ''}`} onClick={() => setSubtab('documents')}>
            <FolderOpen size={16} /> Documents Locker
          </button>
          <button className={`family-tab-btn ${subtab === 'events' ? 'active' : ''}`} onClick={() => setSubtab('events')}>
            <Calendar size={16} /> Life Events Log
          </button>
        </div>

        {/* Tab Content Panes */}
        <div className="family-tabs-content">
          
          {/* SUBTAB 1: Household Overview */}
          {subtab === 'overview' && (
            <div className="animate-fade-in">
              <div className="overview-grid">
                <div className="glass-card stat-summary-card">
                  <h3>Household Income Group</h3>
                  <div className="highlight-stat text-gold">₹{(user.family.reduce((acc, curr) => acc + curr.income, 0)).toLocaleString()}/yr</div>
                  <p>Eligible for Low-Income Group (LIG) & BPL benefits.</p>
                </div>
                <div className="glass-card stat-summary-card">
                  <h3>Passport Status</h3>
                  <div className="highlight-stat text-cyan">Active</div>
                  <p>Encrypted verification matches 6 state and central programs.</p>
                </div>
                <div className="glass-card stat-summary-card">
                  <h3>Locker Space</h3>
                  <div className="highlight-stat text-gold">{user.documents.length} Verified</div>
                  <p>All core family documents are encrypted and verified with DigiLocker.</p>
                </div>
              </div>

              {/* Members table list */}
              <div className="glass-card table-section">
                <div className="card-header-actions">
                  <h3>Registered Family Members</h3>
                  <button className="btn btn-outline btn-sm" onClick={() => setShowMemberForm(true)}>
                    <Plus size={16} /> Add Member
                  </button>
                </div>
                
                {showMemberForm && (
                  <form onSubmit={handleAddMemberSubmit} className="mb-4 p-3 glass-card" style={{ border: '1px solid var(--primary-glow)' }}>
                    <h4 className="mb-3">New Member Registration</h4>
                    <div className="grid-2-col">
                      <div className="form-group">
                        <label>Full Name</label>
                        <input type="text" required value={memberName} onChange={(e) => setMemberName(e.target.value)} placeholder="e.g. Riya Sharma" />
                      </div>
                      <div className="form-group">
                        <label>Relation</label>
                        <select value={memberRelation} onChange={(e) => setMemberRelation(e.target.value)}>
                          <option value="Spouse">Spouse</option>
                          <option value="Son">Son</option>
                          <option value="Daughter">Daughter</option>
                          <option value="Father">Father</option>
                          <option value="Mother">Mother</option>
                        </select>
                      </div>
                    </div>
                    <div className="grid-2-col">
                      <div className="form-group">
                        <label>Age</label>
                        <input type="number" required value={memberAge} onChange={(e) => setMemberAge(e.target.value)} placeholder="e.g. 12" />
                      </div>
                      <div className="form-group">
                        <label>Occupation</label>
                        <select value={memberOccupation} onChange={(e) => setMemberOccupation(e.target.value)}>
                          <option value="Student">Student</option>
                          <option value="Farmer">Farmer</option>
                          <option value="Housewife">Housewife</option>
                          <option value="Unemployed">Unemployed</option>
                          <option value="Business">Business</option>
                          <option value="Salaried">Salaried</option>
                        </select>
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Annual Income (₹)</label>
                      <input type="number" required value={memberIncome} onChange={(e) => setMemberIncome(e.target.value)} placeholder="e.g. 0" />
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                      <button type="submit" className="btn btn-primary btn-sm">Register Member</button>
                      <button type="button" className="btn btn-text btn-sm" onClick={() => setShowMemberForm(false)}>Cancel</button>
                    </div>
                  </form>
                )}

                <div className="table-responsive">
                  <table className="premium-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Relation</th>
                        <th>Age</th>
                        <th>Occupation</th>
                        <th>Annual Income</th>
                        <th>Status Details</th>
                      </tr>
                    </thead>
                    <tbody>
                      {user.family.map((m, idx) => (
                        <tr key={idx}>
                          <td><strong>{m.name}</strong></td>
                          <td>{m.relation}</td>
                          <td>{m.age}</td>
                          <td>{m.occupation}</td>
                          <td>₹{m.income.toLocaleString()}/yr</td>
                          <td><span className="member-tag">{m.status}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* SUBTAB 2: Family Tree */}
          {subtab === 'tree' && (
            <div className="tree-container glass-card animate-fade-in">
              <div className="tree-explanation text-center mb-4">
                <h3>Interactive Household Tree</h3>
                <p className="text-muted text-sm">Visualizes dependent relationships. AI maps parent-child categories to link generational benefits.</p>
              </div>
              <div className="tree-canvas-wrapper">
                <div className="family-node-root">
                  {/* Root Node (Head) */}
                  <div className="tree-node head-node">
                    <div className="node-avatar">RS</div>
                    <div className="node-details">
                      <strong>{user.name} (Head)</strong>
                      <span>Age: {user.age} | {user.occupation}</span>
                    </div>
                  </div>
                  
                  {/* Branches */}
                  <div className="tree-branches">
                    {user.family.filter(m => m.relation !== 'Head').map((m, idx) => {
                      let colorClass = "border-gold";
                      let avatarBg = "bg-pink";
                      if (m.relation === 'Son') {
                        colorClass = "border-cyan";
                        avatarBg = "bg-blue";
                      } else if (m.relation === 'Father') {
                        colorClass = "border-purple";
                        avatarBg = "bg-grey";
                      }

                      return (
                        <div key={idx} className="tree-branch-item">
                          <div className={`tree-node ${colorClass}`}>
                            <div className={`node-avatar ${avatarBg}`}>
                              {m.name.split(' ').map(n=>n[0]).join('')}
                            </div>
                            <div className="node-details">
                              <strong>{m.name}</strong>
                              <span>{m.relation} | Age: {m.age}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SUBTAB 3: Welfare Passport */}
          {/* visual matches user requested design screenshot (simplified, no lists of claims, only head, members, unique ID, platform name, status) */}
          {subtab === 'passport' && (
            <div className="passport-workspace animate-fade-in">
              <div className="passport-card-entry">
                <div className="passport-card-header">
                  <div className="passport-brand-block">
                    <span className="passport-tagline">
                      <ShieldCheck size={14} className="text-cyan" /> WELFARE PASSPORT
                    </span>
                    <span className="passport-platform-title">Yojana Saathi</span>
                  </div>
                  <QrCode className="passport-qrcode-icon" />
                </div>
                
                <div className="passport-details-layout">
                  <div className="passport-field-head">
                    <span className="passport-label">HOUSEHOLD HEAD</span>
                    <span className="passport-value-head">{user.name.toUpperCase()}</span>
                  </div>
                  
                  <div className="passport-fields-row">
                    <div>
                      <span className="passport-label">MEMBERS</span>
                      <span className="passport-value-normal">
                        {String(user.family.length).padStart(2, '0')}
                      </span>
                    </div>
                    <div>
                      <span className="passport-label">STATUS</span>
                      <span className="passport-status-active">Verified</span>
                    </div>
                  </div>
                  
                  <div>
                    <span className="passport-label">YOJANA ID</span>
                    <span className="passport-value-normal" style={{ letterSpacing: '1px', color: 'var(--primary)' }}>
                      YS-9824
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SUBTAB 4: Documents Locker */}
          {subtab === 'documents' && (
            <div className="doc-locker-grid animate-fade-in">
              {user.documents.map((d, idx) => (
                <div key={idx} className="locker-card">
                  <div className="locker-icon"><FolderOpen size={36} className="text-blue" /></div>
                  <div className="locker-details">
                    <h4>{d.name}</h4>
                    <p className="text-sm text-muted">{user.name} • verified</p>
                  </div>
                  <span className={`doc-badge-status ${d.verified ? 'status-verified' : 'status-pending'}`}>
                    <ShieldCheck size={12} style={{ display: 'inline', marginRight: '4px' }} /> {d.verified ? 'Verified' : 'Pending'}
                  </span>
                </div>
              ))}
              
              <div className="locker-card card-upload" onClick={() => document.getElementById('locker-upload-input').click()}>
                <div className="locker-icon"><Plus size={36} className="text-muted" /></div>
                <div className="locker-details">
                  <h4>Upload New Document</h4>
                  <p className="text-sm text-muted">PDF, PNG, JPG up to 10MB</p>
                </div>
                <input 
                  type="file" 
                  id="locker-upload-input" 
                  className="hidden" 
                  onChange={handleFileChange}
                />
              </div>
            </div>
          )}

          {/* SUBTAB 5: Life Events Log */}
          {subtab === 'events' && (
            <div className="timeline-log-panel glass-card animate-fade-in">
              <div className="card-header-actions">
                <h3>Family Life Timeline</h3>
              </div>
              <div className="life-events-timeline">
                {user.events.map((ev, idx) => (
                  <div key={idx} className="timeline-event-item">
                    <div className="timeline-dot bg-gold"></div>
                    <div className="timeline-date">{ev.date}</div>
                    <div className="timeline-content">
                      <h4>{ev.title}</h4>
                      <p>{ev.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
