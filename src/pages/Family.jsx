import React, { useState } from 'react';
import { Users, User, Check, Network, IdCard, FolderOpen, Calendar, ShieldCheck, Plus, Download } from 'lucide-react';
import QRCode from 'react-qr-code';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { useLanguage } from '../context/LanguageContext';

export default function Family({ user, onAddMember, onUploadDoc, onTriggerAuth }) {
  const { t } = useLanguage();
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

  const downloadPassportPDF = async () => {
    const input = document.getElementById('passport-card-capture');
    if (!input) return;
    try {
      const canvas = await html2canvas(input, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 10, pdfWidth, pdfHeight);
      pdf.save(`${user?.saathiId || 'Welfare'}_Passport.pdf`);
    } catch (err) {
      console.error('Failed to generate PDF', err);
      alert('Error generating PDF.');
    }
  };

  return (
    <div className="view-section animate-fade-in">
      <div className="family-hero">
        <h1 className="hero-title text-center">{t.familyHeroTitle || "Family Welfare Dashboard"}</h1>
        <p className="text-center text-muted">{t.familyHeroSubtitle || "Manage your household members, documents, and welfare profile in one place to automate eligibility checks."}</p>
      </div>

      <div className="family-tabs-container">
        {/* Navigation tabs */}
        <div className="family-tabs-header">
          <button className={`family-tab-btn ${subtab === 'overview' ? 'active' : ''}`} onClick={() => setSubtab('overview')}>
            <Users size={16} /> {t.tabOverview || "Household Overview"}
          </button>
          <button className={`family-tab-btn ${subtab === 'tree' ? 'active' : ''}`} onClick={() => setSubtab('tree')}>
            <Network size={16} /> {t.tabTree || "Family Tree"}
          </button>
          <button className={`family-tab-btn ${subtab === 'passport' ? 'active' : ''}`} onClick={() => setSubtab('passport')}>
            <IdCard size={16} /> {t.tabPassport || "Welfare Passport"}
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
              <div className="overview-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
                <div className="glass-card stat-summary-card">
                  <h3>Household Income Group</h3>
                  <div className="highlight-stat text-gold">₹{(user.family.reduce((acc, curr) => acc + curr.income, 0)).toLocaleString()}/yr</div>
                  <p>Eligible for Low-Income Group (LIG) & BPL benefits.</p>
                </div>
                <div className="glass-card stat-summary-card">
                  <h3>Linked Mobile</h3>
                  <div className="highlight-stat text-cyan" style={{ letterSpacing: '2px' }}>
                    {user.mobileNumber ? 'X'.repeat(Math.max(0, user.mobileNumber.length - 2)) + user.mobileNumber.slice(-2) : 'XXXXXXXXXX'}
                  </div>
                  <p>Used for OTPs & alerts.</p>
                </div>
                <div className="glass-card stat-summary-card">
                  <h3>Passport Status</h3>
                  <div className="highlight-stat text-success">Active</div>
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
                <h3>{t.treeTitle || "Interactive Household Tree"}</h3>
                <p className="text-muted text-sm">{t.treeSubtitle || "Visualizes dependent relationships. AI maps parent-child categories to link generational benefits."}</p>
              </div>
              <div className="tree-canvas-wrapper">
                <div className="family-node-root">
                  {/* Root Node (Head) */}
                  <div className="tree-node head-node">
                    <div className="node-avatar">
                      {(user.name || 'YS').split(' ').filter(Boolean).map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                    </div>
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

          {/* SUBTAB 3: Welfare Passport (Saathi Card) */}
          {subtab === 'passport' && (
            <div className="passport-workspace animate-fade-in" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '2rem' }}>
              
              {/* Saathi Card Container */}
              <div>
                <div id="passport-card-capture" style={{
                  width: '100%',
                  maxWidth: '650px',
                  background: '#fffcf5', // warm off-white
                  borderRadius: '24px',
                  position: 'relative',
                  overflow: 'hidden',
                  boxShadow: '0 20px 50px rgba(0,0,0,0.1)',
                  border: '1px solid #e5e7eb',
                  fontFamily: '"Plus Jakarta Sans", sans-serif'
                }}>
                
                {/* Background Waves (Tricolor) */}
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '180px', zIndex: 0, overflow: 'hidden' }}>
                  <svg viewBox="0 0 1440 320" preserveAspectRatio="none" style={{ position: 'absolute', bottom: '0', width: '100%', height: '100%' }}>
                    {/* Saffron Wave */}
                    <path fill="rgba(255, 153, 51, 0.4)" d="M0,128L48,144C96,160,192,192,288,181.3C384,171,480,117,576,96C672,75,768,85,864,117.3C960,149,1056,203,1152,213.3C1248,224,1344,192,1392,176L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                    {/* White Layer to separate */}
                    <path fill="rgba(255,255,255,0.7)" d="M0,160L48,170.7C96,181,192,203,288,186.7C384,171,480,117,576,106.7C672,96,768,128,864,165.3C960,203,1056,245,1152,250.7C1248,256,1344,224,1392,208L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                    {/* Green Wave */}
                    <path fill="rgba(19, 136, 8, 0.4)" d="M0,192L48,197.3C96,203,192,213,288,197.3C384,181,480,139,576,128C672,117,768,139,864,170.7C960,203,1056,245,1152,256C1248,267,1344,245,1392,234.7L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                  </svg>
                </div>
                
                {/* Ashoka Chakra watermark */}
                <div style={{ position: 'absolute', top: '150px', right: '150px', opacity: 0.05, zIndex: 0 }}>
                  <img src="https://upload.wikimedia.org/wikipedia/commons/1/17/Ashoka_Chakra.svg" alt="Chakra" width="300" />
                </div>

                {/* Dark Blue Footer */}
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '70px', background: '#0a1945', zIndex: 2, display: 'flex', alignItems: 'center', padding: '0 2rem', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#fff', fontSize: '0.85rem' }}>
                    <ShieldCheck size={16} /> Secure. Trusted. Government of India
                  </div>
                  <div>
                    <img src="https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg" alt="Satyameva Jayate" height="40" style={{ filter: 'brightness(0) invert(1) opacity(0.8)' }} />
                  </div>
                </div>

                {/* Card Content (z-index 1) */}
                <div style={{ position: 'relative', zIndex: 1, padding: '2rem 2.5rem 6rem 2.5rem' }}>
                  
                  {/* Top Bar */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0a1945', fontWeight: 'bold', fontSize: '0.85rem', letterSpacing: '1px' }}>
                      <ShieldCheck size={18} /> WELFARE PASSPORT
                    </div>
                    <div style={{ background: '#fff', padding: '0.5rem', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                      <QRCode value={`${user.saathiId}-${user.name}`} size={80} fgColor="#0a1945" />
                    </div>
                  </div>

                  {/* Title Area */}
                  <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', marginBottom: '2.5rem', marginTop: '-2rem' }}>
                    <div style={{ width: '80px', height: '80px', background: 'linear-gradient(135deg, #fcd34d, #f59e0b)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', border: '3px solid #0a1945', boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}>
                      <Users size={40} />
                    </div>
                    <div>
                      <h1 style={{ margin: 0, fontSize: '3rem', fontWeight: '800', color: '#0a1945', letterSpacing: '-1px' }}>Yojana Saathi</h1>
                      <p style={{ margin: '0.25rem 0 0 0', color: '#64748b', fontSize: '1.1rem', fontWeight: '500' }}>One Platform. Every Scheme. Every Citizen.</p>
                    </div>
                  </div>

                  {/* Grid Data */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {/* Head */}
                    <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', background: 'rgba(255,255,255,0.6)', padding: '1rem', borderRadius: '12px' }}>
                      <div style={{ background: '#bfdbfe', padding: '0.75rem', borderRadius: '12px', color: '#1d4ed8' }}>
                        <User size={24} />
                      </div>
                      <div>
                        <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748b', letterSpacing: '1px' }}>HOUSEHOLD HEAD</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0a1945' }}>{user.name.toUpperCase()}</div>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      {/* Members */}
                      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', background: 'rgba(255,255,255,0.6)', padding: '1rem', borderRadius: '12px' }}>
                        <div style={{ background: '#bbf7d0', padding: '0.75rem', borderRadius: '12px', color: '#15803d' }}>
                          <Users size={20} />
                        </div>
                        <div>
                          <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748b', letterSpacing: '1px' }}>MEMBERS</div>
                          <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#15803d' }}>{String(user.family.length).padStart(2, '0')}</div>
                        </div>
                      </div>

                      {/* Status */}
                      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', background: 'rgba(255,255,255,0.6)', padding: '1rem', borderRadius: '12px' }}>
                        <div style={{ background: '#bbf7d0', padding: '0.75rem', borderRadius: '12px', color: '#15803d' }}>
                          <ShieldCheck size={20} />
                        </div>
                        <div>
                          <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748b', letterSpacing: '1px' }}>STATUS</div>
                          <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#15803d', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            Verified <span style={{ background: '#15803d', color: '#fff', borderRadius: '50%', padding: '2px', display: 'flex' }}><Check size={12}/></span>
                          </div>
                        </div>
                      </div>

                      {/* Yojana ID */}
                      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', background: 'rgba(255,255,255,0.6)', padding: '1rem', borderRadius: '12px' }}>
                        <div style={{ background: '#fed7aa', padding: '0.75rem', borderRadius: '12px', color: '#c2410c' }}>
                          <IdCard size={20} />
                        </div>
                        <div>
                          <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748b', letterSpacing: '1px' }}>YOJANA ID</div>
                          <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#c2410c' }}>{user.saathiId}</div>
                        </div>
                      </div>

                      {/* Created On */}
                      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', background: 'rgba(255,255,255,0.6)', padding: '1rem', borderRadius: '12px' }}>
                        <div style={{ background: '#ddd6fe', padding: '0.75rem', borderRadius: '12px', color: '#6d28d9' }}>
                          <Calendar size={20} />
                        </div>
                        <div>
                          <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748b', letterSpacing: '1px' }}>SAATHI CARD</div>
                          <div style={{ display: 'flex', gap: '20px' }}>
                            <div style={{ fontSize: '0.9rem', fontWeight: '700', color: '#0a1945' }}>Created on<br/>{user.events?.[0]?.date || new Date().toLocaleDateString('en-GB')}</div>
                            <div style={{ fontSize: '0.9rem', fontWeight: '700', color: '#0a1945' }}>Validity<br/>Lifetime</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center' }}>
                  <button className="btn btn-primary" onClick={downloadPassportPDF}>
                    <Download size={18} /> Download Passport as PDF
                  </button>
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
