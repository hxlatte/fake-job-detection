import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { Modal } from "../components/Modal";

export function History() {
  const [scanHistory, setScanHistory] = useLocalStorage("scanHistory", []);
  
  // Search & Filter state variables
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRisk, setFilterRisk] = useState("All");
  const [filterType, setFilterType] = useState("All");

  // Modal control variables
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [clearAllMode, setClearAllMode] = useState(false);

  const handleOpenDeleteModal = (id) => {
    setSelectedId(id);
    setClearAllMode(false);
    setIsModalOpen(true);
  };

  const handleOpenClearModal = () => {
    setClearAllMode(true);
    setIsModalOpen(true);
  };

  const handleConfirmAction = () => {
    if (clearAllMode) {
      setScanHistory([]);
    } else if (selectedId) {
      setScanHistory(prev => prev.filter(item => item.id !== selectedId));
    }
    setIsModalOpen(false);
    setSelectedId(null);
  };

  // Filter computation
  const filteredHistory = scanHistory.filter(item => {
    const matchesSearch = 
      item.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRisk = filterRisk === "All" || item.riskLevel.includes(filterRisk);
    
    // Fallback if employmentType is missing in older history
    const matchesType = filterType === "All" || (item.employmentType && item.employmentType === filterType);
    
    return matchesSearch && matchesRisk && matchesType;
  });

  return (
    <div className="section-container history-section page-fade-in">
      <div className="section-header">
        <h2 className="section-title">Analysis Log Registry</h2>
        <p className="section-subtitle">Browse, compare, and manage records of previously scanned positions stored on your browser.</p>
      </div>

      {/* Search & Filter Bar */}
      <div className="history-filters-row">
        <div className="search-input-wrapper">
          <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="11" cy="11" r="8" strokeWidth="2"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <input
            type="text"
            placeholder="Search by company or job title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <label htmlFor="filter-risk">Risk Level:</label>
          <select id="filter-risk" value={filterRisk} onChange={(e) => setFilterRisk(e.target.value)}>
            <option value="All">All Levels</option>
            <option value="High Risk">High Risk</option>
            <option value="Caution">Caution</option>
            <option value="Low Risk">Low Risk</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="filter-type">Job Type:</label>
          <select id="filter-type" value={filterType} onChange={(e) => setFilterType(e.target.value)}>
            <option value="All">All Types</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Contract">Contract</option>
            <option value="Internship">Internship</option>
            <option value="Remote">Remote</option>
          </select>
        </div>

        {scanHistory.length > 0 && (
          <button className="btn btn-secondary btn-sm btn-ripple" onClick={handleOpenClearModal} style={{ marginLeft: 'auto' }}>
            Clear Ledger
          </button>
        )}
      </div>

      {scanHistory.length > 0 ? (
        <>
          <div className="history-actions-bar">
            <span className="history-count">Records Found: {filteredHistory.length}</span>
          </div>

          {filteredHistory.length > 0 ? (
            <div className="history-grid">
              {filteredHistory.map(item => (
                <div key={item.id} className="history-card">
                  <div className="history-card-header">
                    <div>
                      <span className="history-company">{item.company}</span>
                      <h4 className="history-title">{item.title}</h4>
                    </div>
                    <span className="history-date">{item.date}</span>
                  </div>
                  
                  <div className="history-card-body">
                    <div className="history-gauge-mini">
                      <svg className="circular-chart" viewBox="0 0 36 36" style={{ width: 50, height: 50 }}>
                        <path className="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                        <path className={`circle-fill ${item.threatColor}`} strokeDasharray={`${item.riskScore}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                      </svg>
                      <div className="trust-score-labels" style={{ transform: 'scale(0.65)' }}>
                        <span className="trust-number">{item.riskScore}</span>
                      </div>
                    </div>
                    <div className="history-score-info">
                      <h5 className={item.riskClass === 'badge-high-risk' ? 'text-red' : (item.riskClass === 'badge-caution' ? 'text-red' : 'text-green')}>
                        {item.riskLevel.toUpperCase()}
                      </h5>
                      <p className="font-code">{item.riskScore}/100 Risk</p>
                    </div>
                  </div>

                  <div className="history-card-footer">
                    <button className="btn-delete-history" onClick={() => handleOpenDeleteModal(item.id)} aria-label="Delete Record">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2m-6 5v6m4-6v6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="glass-card empty-state">
              <h3>No Matching Records</h3>
              <p>Try adjusting your search terms or risk level filters.</p>
            </div>
          )}
        </>
      ) : (
        <div className="glass-card empty-state">
          <div className="empty-state-visual">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="empty-state-svg">
              <circle cx="12" cy="12" r="10" strokeWidth="1.5" strokeDasharray="4, 4"/>
              <path d="M12 8v4M12 16h.01" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <h3>No Scanned Entries Found</h3>
          <p>You haven't submitted any job postings for inspection yet. Any jobs you analyze will be stored in your local registry here.</p>
          <Link to="/analyze" className="btn btn-primary mt-3">Scan Your First Job</Link>
        </div>
      )}

      {/* Confirmation modal */}
      <Modal
        isOpen={isModalOpen}
        title={clearAllMode ? "Clear Entire History" : "Delete Registry Entry"}
        onConfirm={handleConfirmAction}
        onCancel={() => setIsModalOpen(false)}
        confirmText={clearAllMode ? "Clear All" : "Delete"}
      >
        {clearAllMode 
          ? "Are you sure you want to delete all historical logs? This action is permanent."
          : "Are you sure you want to remove this record from your local ledger history?"
        }
      </Modal>
    </div>
  );
}
