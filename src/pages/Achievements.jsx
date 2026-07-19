import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Share2, Medal, CheckCircle, Clock, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export default function Achievements({ userBadges }) {
  const { lang, t } = useLanguage();
  const [activeTab, setActiveTab] = useState('completed');

  const badges = userBadges || [];

  const handleDownloadPNG = async (badgeId) => {
    const element = document.getElementById(`badge-${badgeId}`);
    if (!element) return;
    try {
      const canvas = await html2canvas(element, { scale: 2, useCORS: true, backgroundColor: null });
      const link = document.createElement('a');
      link.download = `Yojana_Saathi_Badge_${badgeId}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('Error downloading PNG:', err);
    }
  };

  const handleDownloadPDF = async (badgeId) => {
    const element = document.getElementById(`badge-${badgeId}`);
    if (!element) return;
    try {
      const canvas = await html2canvas(element, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 10, pdfWidth, pdfHeight);
      pdf.save(`Yojana_Saathi_Badge_${badgeId}.pdf`);
    } catch (err) {
      console.error('Error downloading PDF:', err);
    }
  };

  const handleShare = (badge) => {
    const text = `🎉 I successfully completed my application for ${badge.schemeName} using Yojana Saathi. Making government schemes simpler through AI.\n\nVerify my achievement: ${window.location.origin}/#verify-badge/${badge.id}`;
    if (navigator.share) {
      navigator.share({
        title: 'My Yojana Saathi Achievement',
        text: text,
        url: `${window.location.origin}/#verify-badge/${badge.id}`
      }).catch(err => console.error("Share failed", err));
    } else {
      navigator.clipboard.writeText(text);
      alert('Share link copied to clipboard!');
    }
  };

  const completedBadges = badges.filter(b => b.status === 'Completed');

  return (
    <div className="view-section animate-fade-in" style={{ padding: '2rem' }}>
      <div className="schemes-hero" style={{ marginBottom: '2rem' }}>
        <h1 className="hero-title text-center" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
          <Medal size={40} color="var(--gold)" />
          {t.achievementsTitle || "My Achievements"}
        </h1>
        <p className="text-center text-muted">{t.achievementsSub || "Your verified digital credentials and completed scheme applications."}</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        <div className="glass-card" style={{ textAlign: 'center', padding: '1.5rem' }}>
          <CheckCircle size={32} color="var(--success)" style={{ margin: '0 auto 1rem auto' }} />
          <h3 style={{ fontSize: '2rem', margin: 0, color: 'var(--text-primary)' }}>{completedBadges.length}</h3>
          <p style={{ margin: 0, color: 'var(--text-secondary)' }}>{t.schemesCompleted || "Schemes Completed"}</p>
        </div>
        <div className="glass-card" style={{ textAlign: 'center', padding: '1.5rem' }}>
          <Clock size={32} color="var(--primary)" style={{ margin: '0 auto 1rem auto' }} />
          <h3 style={{ fontSize: '2rem', margin: 0, color: 'var(--text-primary)' }}>{badges.filter(b => b.status === 'Pending').length}</h3>
          <p style={{ margin: 0, color: 'var(--text-secondary)' }}>{t.applicationsInProgress || "Applications In Progress"}</p>
        </div>
        <div className="glass-card" style={{ textAlign: 'center', padding: '1.5rem' }}>
          <ShieldCheck size={32} color="var(--gold)" style={{ margin: '0 auto 1rem auto' }} />
          <h3 style={{ fontSize: '2rem', margin: 0, color: 'var(--text-primary)' }}>{completedBadges.length > 0 ? '1' : '0'}</h3>
          <p style={{ margin: 0, color: 'var(--text-secondary)' }}>{t.completionStreak || "Completion Streak"}</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
        <button className={`btn ${activeTab === 'completed' ? 'btn-primary' : 'btn-text'}`} onClick={() => setActiveTab('completed')}>
          {t.completedSchemes || "Completed Schemes"}
        </button>
        <button className={`btn ${activeTab === 'pending' ? 'btn-primary' : 'btn-text'}`} onClick={() => setActiveTab('pending')}>
          {t.pendingSchemes || "Pending"}
        </button>
      </div>

      {badges.filter(b => activeTab === 'completed' ? b.status === 'Completed' : b.status !== 'Completed').length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <Medal size={64} style={{ color: 'var(--border-color)', margin: '0 auto 1rem auto' }} />
          <h3 style={{ color: 'var(--text-secondary)' }}>{t.noAchievements || "No achievements found in this category."}</h3>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '2rem' }}>
          {badges.filter(b => activeTab === 'completed' ? b.status === 'Completed' : b.status !== 'Completed').map(badge => (
            <motion.div key={badge.id} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass-card" style={{ display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden' }}>
              
              <div id={`badge-${badge.id}`} style={{ background: 'linear-gradient(135deg, #1A1A24 0%, #0F0F16 100%)', padding: '2rem', position: 'relative', borderBottom: '1px solid var(--border-color)', color: 'white' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, var(--primary), var(--gold))' }}></div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                  <div style={{ background: 'rgba(255,255,255,0.1)', padding: '12px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: '2rem' }}>{badge.icon || '📜'}</span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)', letterSpacing: '1px', marginBottom: '4px' }}>Badge ID</div>
                    <div style={{ fontFamily: 'monospace', color: 'var(--gold)' }}>{badge.id}</div>
                  </div>
                </div>

                <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.5rem', lineHeight: '1.2' }}>{badge.schemeName}</h3>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.5rem', background: 'rgba(16, 185, 129, 0.1)', color: '#10B981', padding: '6px 12px', borderRadius: '50px', width: 'fit-content' }}>
                  <CheckCircle size={16} />
                  <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{t.appSuccess || "Application Successfully Completed"}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '2rem' }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', marginBottom: '4px' }}>{t.verifiedBy || "Verified by"}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <ShieldCheck size={16} color="var(--primary)" />
                      <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Yojana Saathi</span>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', marginBottom: '4px' }}>{t.date || "Date"}</div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{badge.date}</div>
                  </div>
                </div>
              </div>

              <div style={{ padding: '1.5rem', background: 'var(--bg-card)' }}>
                <div className="action-buttons-group">
                  <button className="btn btn-outline btn-sm" onClick={() => handleDownloadPNG(badge.id)} style={{ flex: 1, minWidth: '120px' }}>
                    <Download size={14} /> {t.downloadPng || "PNG"}
                  </button>
                  <button className="btn btn-outline btn-sm" onClick={() => handleDownloadPDF(badge.id)} style={{ flex: 1, minWidth: '120px' }}>
                    <Download size={14} /> {t.downloadPdf || "PDF"}
                  </button>
                  <button className="btn btn-primary btn-sm" onClick={() => handleShare(badge)} style={{ flex: 2, minWidth: '150px' }}>
                    <Share2 size={14} /> {t.share || "Share Achievement"}
                  </button>
                </div>
              </div>

            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
