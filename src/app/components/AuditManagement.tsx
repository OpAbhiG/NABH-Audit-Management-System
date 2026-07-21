import { useState } from "react";
import { Plus, Search, Calendar, X, Upload, CheckCircle2, Eye, Trash2 } from "lucide-react";
import { useAudit } from "../context/AuditContext";
import { Audit, AuditQuestionAnswer } from "../types/audit";

const NABH_CHAPTERS = [
  "Access Assessment & Continuity of Care",
  "Care of Patients",
  "Management of Medication",
  "Patient Rights & Education",
  "Hospital Infection Control",
  "Continuous Quality Improvement",
  "Responsibilities of Management",
  "Facility Management & Safety",
  "Human Resource Management",
  "Information Management System",
];

const STATUS_STYLES: Record<string, { color: string; bg: string; dot: string }> = {
  Completed: { color: "#22C55E", bg: "#f0fdf4", dot: "#22C55E" },
  "In Progress": { color: "#F59E0B", bg: "#fffbeb", dot: "#F59E0B" },
  Scheduled: { color: "#0066CC", bg: "#eff6ff", dot: "#0066CC" },
  Overdue: { color: "#EF4444", bg: "#fef2f2", dot: "#EF4444" },
};

const PRIORITY_STYLES: Record<string, { color: string; bg: string }> = {
  Critical: { color: "#EF4444", bg: "#fef2f2" },
  High: { color: "#F59E0B", bg: "#fffbeb" },
  Medium: { color: "#0066CC", bg: "#eff6ff" },
  Low: { color: "#22C55E", bg: "#f0fdf4" },
};

interface AuditFormModalProps {
  initialAudit?: Audit | null;
  onClose: () => void;
  onSave: (auditData: Partial<Audit>) => void;
}

function AuditFormModal({ initialAudit, onClose, onSave }: AuditFormModalProps) {
  const { departments } = useAudit();
  const [activeTab, setActiveTab] = useState<"details" | "questions">("details");

  const [formData, setFormData] = useState({
    name: initialAudit?.name || "",
    dept: initialAudit?.dept || (departments[0]?.name || "OPD"),
    auditor: initialAudit?.auditor || "Dr. Quality Manager",
    date: initialAudit?.date || new Date().toISOString().slice(0, 10),
    priority: initialAudit?.priority || ("High" as const),
    chapter: initialAudit?.chapter || NABH_CHAPTERS[0],
    scope: initialAudit?.scope || "",
  });

  const SAMPLE_QUESTIONS = [
    { id: "Q1", text: "Is there a documented patient admission policy compliant with NABH AAC standard?", type: "yes_no" },
    { id: "Q2", text: "Are initial patient clinical assessments completed within defined timeframes?", type: "yes_no" },
    { id: "Q3", text: "Rate the quality and legibility of clinical documentation", type: "rating" },
    { id: "Q4", text: "Are emergency medications stored safely and verified for expiration dates?", type: "yes_no" },
    { id: "Q5", text: "Is hospital infection control protocol displayed clearly in all wards?", type: "yes_no" },
  ];

  const [answers, setAnswers] = useState<Record<string, { answer: any; notes: string }>>({});

  const calculateScore = () => {
    const total = SAMPLE_QUESTIONS.length;
    let scoreCount = 0;
    SAMPLE_QUESTIONS.forEach(q => {
      const ans = answers[q.id]?.answer;
      if (ans === "Yes" || ans === 5 || ans === 4) scoreCount += 1;
      else if (ans === "Partial" || ans === 3) scoreCount += 0.5;
    });
    return Math.round((scoreCount / total) * 100);
  };

  const handleSubmit = () => {
    if (!formData.name) return alert("Audit Name is required!");
    const answeredCount = Object.keys(answers).length;
    const finalScore = answeredCount > 0 ? calculateScore() : (initialAudit?.score || null);
    const status = answeredCount === SAMPLE_QUESTIONS.length ? "Completed" : answeredCount > 0 ? "In Progress" : "Scheduled";

    const questionAnswers: AuditQuestionAnswer[] = Object.entries(answers).map(([qId, val]) => {
      const qText = SAMPLE_QUESTIONS.find(q => q.id === qId)?.text || qId;
      return {
        questionId: qId,
        questionText: qText,
        answer: val.answer,
        notes: val.notes,
      };
    });

    onSave({
      ...(initialAudit?.id ? { id: initialAudit.id } : {}),
      ...formData,
      status,
      score: finalScore,
      answers: questionAnswers,
    });
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
      <div style={{ background: "white", borderRadius: "16px", width: "720px", maxWidth: "100%", maxHeight: "90vh", display: "flex", flexDirection: "column", boxShadow: "0 25px 50px rgba(0,0,0,0.2)" }}>
        {/* Modal Header */}
        <div style={{ padding: "20px 28px", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
          <div>
            <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#1e293b", margin: 0 }}>
              {initialAudit ? "Edit Audit" : "Create New Audit"}
            </h3>
            <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
              <button
                onClick={() => setActiveTab("details")}
                style={{ padding: "5px 14px", borderRadius: "20px", fontSize: "12px", fontWeight: 600, border: "none", cursor: "pointer", background: activeTab === "details" ? "#0066CC" : "#f1f5f9", color: activeTab === "details" ? "white" : "#64748b" }}
              >
                1. Audit Scope & Details
              </button>
              <button
                onClick={() => setActiveTab("questions")}
                style={{ padding: "5px 14px", borderRadius: "20px", fontSize: "12px", fontWeight: 600, border: "none", cursor: "pointer", background: activeTab === "questions" ? "#0066CC" : "#f1f5f9", color: activeTab === "questions" ? "white" : "#64748b" }}
              >
                2. Audit Questionnaire
              </button>
            </div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8" }}><X size={20} /></button>
        </div>

        {/* Modal Body */}
        <div style={{ overflowY: "auto", padding: "24px 28px", flex: 1 }}>
          {activeTab === "details" ? (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div style={{ gridColumn: "span 2" }}>
                <label style={{ fontSize: "12px", fontWeight: 600, color: "#374151", display: "block", marginBottom: "6px" }}>Audit Title</label>
                <input
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., OPD Monthly Compliance Audit"
                  style={{ width: "100%", padding: "9px 12px", border: "1.5px solid #e2e8f0", borderRadius: "8px", fontSize: "13px", color: "#1e293b", background: "#f8fafc", outline: "none", boxSizing: "border-box" }}
                />
              </div>

              <div>
                <label style={{ fontSize: "12px", fontWeight: 600, color: "#374151", display: "block", marginBottom: "6px" }}>Department</label>
                <select
                  value={formData.dept}
                  onChange={e => setFormData({ ...formData, dept: e.target.value })}
                  style={{ width: "100%", padding: "9px 12px", border: "1.5px solid #e2e8f0", borderRadius: "8px", fontSize: "13px", color: "#1e293b", background: "#f8fafc", outline: "none", boxSizing: "border-box" }}
                >
                  {departments.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
                </select>
              </div>

              <div>
                <label style={{ fontSize: "12px", fontWeight: 600, color: "#374151", display: "block", marginBottom: "6px" }}>Auditor Name</label>
                <input
                  value={formData.auditor}
                  onChange={e => setFormData({ ...formData, auditor: e.target.value })}
                  style={{ width: "100%", padding: "9px 12px", border: "1.5px solid #e2e8f0", borderRadius: "8px", fontSize: "13px", color: "#1e293b", background: "#f8fafc", outline: "none", boxSizing: "border-box" }}
                />
              </div>

              <div>
                <label style={{ fontSize: "12px", fontWeight: 600, color: "#374151", display: "block", marginBottom: "6px" }}>Audit Date</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={e => setFormData({ ...formData, date: e.target.value })}
                  style={{ width: "100%", padding: "9px 12px", border: "1.5px solid #e2e8f0", borderRadius: "8px", fontSize: "13px", color: "#1e293b", background: "#f8fafc", outline: "none", boxSizing: "border-box" }}
                />
              </div>

              <div>
                <label style={{ fontSize: "12px", fontWeight: 600, color: "#374151", display: "block", marginBottom: "6px" }}>Priority Level</label>
                <select
                  value={formData.priority}
                  onChange={e => setFormData({ ...formData, priority: e.target.value as any })}
                  style={{ width: "100%", padding: "9px 12px", border: "1.5px solid #e2e8f0", borderRadius: "8px", fontSize: "13px", color: "#1e293b", background: "#f8fafc", outline: "none", boxSizing: "border-box" }}
                >
                  <option value="Critical">Critical</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>

              <div style={{ gridColumn: "span 2" }}>
                <label style={{ fontSize: "12px", fontWeight: 600, color: "#374151", display: "block", marginBottom: "6px" }}>NABH Accreditation Chapter</label>
                <select
                  value={formData.chapter}
                  onChange={e => setFormData({ ...formData, chapter: e.target.value })}
                  style={{ width: "100%", padding: "9px 12px", border: "1.5px solid #e2e8f0", borderRadius: "8px", fontSize: "13px", color: "#1e293b", background: "#f8fafc", outline: "none", boxSizing: "border-box" }}
                >
                  {NABH_CHAPTERS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div style={{ gridColumn: "span 2" }}>
                <label style={{ fontSize: "12px", fontWeight: 600, color: "#374151", display: "block", marginBottom: "6px" }}>Audit Scope / Objectives</label>
                <textarea
                  rows={3}
                  value={formData.scope}
                  onChange={e => setFormData({ ...formData, scope: e.target.value })}
                  placeholder="Describe audit scope, sampling criteria, and specific objectives..."
                  style={{ width: "100%", padding: "9px 12px", border: "1.5px solid #e2e8f0", borderRadius: "8px", fontSize: "13px", color: "#1e293b", background: "#f8fafc", outline: "none", resize: "vertical", boxSizing: "border-box" }}
                />
              </div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {/* Score Indicator */}
              <div style={{ background: "#f0f7ff", borderRadius: "10px", padding: "16px", display: "flex", alignItems: "center", gap: "20px", border: "1px solid #bae6fd" }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "32px", fontWeight: 800, color: "#0066CC" }}>{calculateScore()}%</div>
                  <div style={{ fontSize: "11px", color: "#64748b" }}>Calculated Score</div>
                </div>
                <div style={{ flex: 1, height: "8px", background: "#bfdbfe", borderRadius: "4px" }}>
                  <div style={{ width: `${calculateScore()}%`, height: "100%", background: "#0066CC", borderRadius: "4px", transition: "width 0.3s" }} />
                </div>
                <div style={{ fontSize: "12px", color: "#64748b", fontWeight: 600 }}>
                  {Object.keys(answers).length} of {SAMPLE_QUESTIONS.length} Questions Answered
                </div>
              </div>

              {SAMPLE_QUESTIONS.map((q, qi) => (
                <div key={q.id} style={{ border: "1px solid #e2e8f0", borderRadius: "10px", padding: "16px", background: "#ffffff" }}>
                  <div style={{ display: "flex", gap: "10px", marginBottom: "12px" }}>
                    <span style={{ width: "22px", height: "22px", borderRadius: "50%", background: "#0066CC", color: "white", fontSize: "11px", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{qi + 1}</span>
                    <p style={{ margin: 0, fontSize: "13px", color: "#374151", lineHeight: 1.5, fontWeight: 600 }}>{q.text}</p>
                  </div>

                  {q.type === "yes_no" && (
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                      {["Yes", "No", "Partial", "N/A"].map(opt => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => setAnswers({ ...answers, [q.id]: { answer: opt, notes: answers[q.id]?.notes || "" } })}
                          style={{
                            padding: "6px 14px", borderRadius: "6px", fontSize: "12px", fontWeight: 600,
                            border: answers[q.id]?.answer === opt ? "none" : "1px solid #cbd5e1",
                            background: answers[q.id]?.answer === opt ? (opt === "Yes" ? "#22C55E" : opt === "No" ? "#EF4444" : opt === "Partial" ? "#F59E0B" : "#64748b") : "white",
                            color: answers[q.id]?.answer === opt ? "white" : "#64748b",
                            cursor: "pointer"
                          }}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  )}

                  {q.type === "rating" && (
                    <div style={{ display: "flex", gap: "8px" }}>
                      {[1, 2, 3, 4, 5].map(r => (
                        <button
                          key={r}
                          type="button"
                          onClick={() => setAnswers({ ...answers, [q.id]: { answer: r, notes: answers[q.id]?.notes || "" } })}
                          style={{
                            width: "38px", height: "38px", borderRadius: "8px", fontSize: "14px",
                            border: answers[q.id]?.answer === r ? "none" : "1px solid #cbd5e1",
                            background: answers[q.id]?.answer === r ? "#0066CC" : "white",
                            color: answers[q.id]?.answer === r ? "white" : "#64748b",
                            cursor: "pointer", fontWeight: 700
                          }}
                        >
                          {r}
                        </button>
                      ))}
                    </div>
                  )}

                  <div style={{ marginTop: "10px" }}>
                    <input
                      placeholder="Auditor notes / observations..."
                      value={answers[q.id]?.notes || ""}
                      onChange={e => setAnswers({ ...answers, [q.id]: { answer: answers[q.id]?.answer || "Yes", notes: e.target.value } })}
                      style={{ width: "100%", padding: "7px 10px", border: "1px solid #e2e8f0", borderRadius: "6px", fontSize: "12px", outline: "none", boxSizing: "border-box" }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div style={{ padding: "16px 28px", borderTop: "1px solid #f1f5f9", display: "flex", gap: "10px", flexShrink: 0 }}>
          <button onClick={onClose} style={{ flex: 1, padding: "10px", background: "#f1f5f9", border: "none", borderRadius: "8px", fontSize: "14px", color: "#64748b", cursor: "pointer", fontWeight: 500 }}>Cancel</button>
          {activeTab === "details" ? (
            <button onClick={() => setActiveTab("questions")} style={{ flex: 2, padding: "10px", background: "#0066CC", border: "none", borderRadius: "8px", fontSize: "14px", color: "white", cursor: "pointer", fontWeight: 600 }}>
              Next: Audit Questionnaire →
            </button>
          ) : (
            <button onClick={handleSubmit} style={{ flex: 2, padding: "10px", background: "#22C55E", border: "none", borderRadius: "8px", fontSize: "14px", color: "white", cursor: "pointer", fontWeight: 600 }}>
              Save & Submit Audit
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// View Details Modal Component
function AuditDetailModal({ audit, onClose }: { audit: Audit; onClose: () => void }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
      <div style={{ background: "white", borderRadius: "16px", width: "600px", maxWidth: "100%", maxHeight: "90vh", display: "flex", flexDirection: "column", padding: "24px", boxShadow: "0 20px 40px rgba(0,0,0,0.2)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", borderBottom: "1px solid #eee", paddingBottom: "12px" }}>
          <div>
            <div style={{ fontSize: "12px", color: "#0066CC", fontWeight: 700 }}>{audit.id}</div>
            <h3 style={{ margin: 0, fontSize: "18px", color: "#1e293b" }}>{audit.name}</h3>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8" }}><X size={20} /></button>
        </div>

        <div style={{ overflowY: "auto", flex: 1, display: "flex", flexDirection: "column", gap: "14px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", background: "#f8fafc", padding: "14px", borderRadius: "8px" }}>
            <div><strong style={{ fontSize: "12px", color: "#64748b" }}>Department:</strong> <div style={{ fontSize: "13px", fontWeight: 600 }}>{audit.dept}</div></div>
            <div><strong style={{ fontSize: "12px", color: "#64748b" }}>Auditor:</strong> <div style={{ fontSize: "13px", fontWeight: 600 }}>{audit.auditor}</div></div>
            <div><strong style={{ fontSize: "12px", color: "#64748b" }}>Date:</strong> <div style={{ fontSize: "13px" }}>{audit.date}</div></div>
            <div><strong style={{ fontSize: "12px", color: "#64748b" }}>Status:</strong> <div style={{ fontSize: "13px", fontWeight: 700, color: audit.status === "Completed" ? "#22C55E" : "#F59E0B" }}>{audit.status}</div></div>
            <div><strong style={{ fontSize: "12px", color: "#64748b" }}>Score:</strong> <div style={{ fontSize: "16px", fontWeight: 800, color: "#0066CC" }}>{audit.score !== null ? `${audit.score}%` : "Pending"}</div></div>
            <div><strong style={{ fontSize: "12px", color: "#64748b" }}>NABH Chapter:</strong> <div style={{ fontSize: "13px" }}>{audit.chapter}</div></div>
          </div>

          <div>
            <h4 style={{ margin: "0 0 6px 0", fontSize: "13px", color: "#374151" }}>Audit Scope</h4>
            <p style={{ margin: 0, fontSize: "12px", color: "#64748b", background: "#fafafa", padding: "10px", borderRadius: "6px", border: "1px solid #f1f5f9" }}>
              {audit.scope || "Full departmental compliance check based on 5th Edition NABH Standards."}
            </p>
          </div>

          {audit.answers && audit.answers.length > 0 && (
            <div>
              <h4 style={{ margin: "0 0 8px 0", fontSize: "13px", color: "#374151" }}>Questionnaire Responses</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {audit.answers.map((ans, i) => (
                  <div key={i} style={{ border: "1px solid #e2e8f0", padding: "10px", borderRadius: "6px" }}>
                    <div style={{ fontSize: "12px", fontWeight: 600, color: "#1e293b" }}>{ans.questionText}</div>
                    <div style={{ display: "flex", gap: "10px", marginTop: "4px", fontSize: "11px" }}>
                      <span style={{ color: ans.answer === "Yes" ? "#22C55E" : "#EF4444", fontWeight: 700 }}>Answer: {String(ans.answer)}</span>
                      {ans.notes && <span style={{ color: "#64748b" }}>Notes: {ans.notes}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <button onClick={onClose} style={{ marginTop: "16px", padding: "10px", background: "#0066CC", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: 600 }}>
          Close Summary
        </button>
      </div>
    </div>
  );
}

export function AuditManagement() {
  const { audits, saveAudit, deleteAudit } = useAudit();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [editingAudit, setEditingAudit] = useState<Audit | null>(null);
  const [viewingAudit, setViewingAudit] = useState<Audit | null>(null);

  const filtered = audits.filter(a => {
    const matchSearch = a.name.toLowerCase().includes(search.toLowerCase()) || a.dept.toLowerCase().includes(search.toLowerCase()) || a.auditor.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All" || a.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const stats = {
    total: audits.length,
    completed: audits.filter(a => a.status === "Completed").length,
    inProgress: audits.filter(a => a.status === "In Progress").length,
    scheduled: audits.filter(a => a.status === "Scheduled").length,
  };

  const handleSaveModal = async (auditData: Partial<Audit>) => {
    await saveAudit(auditData);
    setShowModal(false);
    setEditingAudit(null);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this audit record?")) {
      await deleteAudit(id);
    }
  };

  return (
    <div style={{ padding: "24px", background: "#f8fafc", minHeight: "100%" }}>
      {showModal && <AuditFormModal initialAudit={editingAudit} onClose={() => { setShowModal(false); setEditingAudit(null); }} onSave={handleSaveModal} />}
      {viewingAudit && <AuditDetailModal audit={viewingAudit} onClose={() => setViewingAudit(null)} />}

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "14px", marginBottom: "24px" }}>
        {[
          { label: "Total Audits", value: stats.total, icon: "📋", color: "#0066CC" },
          { label: "Completed", value: stats.completed, icon: "✅", color: "#22C55E" },
          { label: "In Progress", value: stats.inProgress, icon: "🔄", color: "#F59E0B" },
          { label: "Scheduled", value: stats.scheduled, icon: "📅", color: "#8b5cf6" },
        ].map(s => (
          <div key={s.label} style={{ background: "white", borderRadius: "10px", padding: "18px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #e2e8f0", display: "flex", alignItems: "center", gap: "14px" }}>
            <span style={{ fontSize: "28px" }}>{s.icon}</span>
            <div>
              <div style={{ fontSize: "24px", fontWeight: 800, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: "12px", color: "#64748b" }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div style={{ background: "white", borderRadius: "12px", padding: "14px 20px", marginBottom: "16px", display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #e2e8f0" }}>
        <div style={{ position: "relative", flex: 1, minWidth: "200px" }}>
          <Search size={15} style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search audits by title, department, auditor..." style={{ width: "100%", padding: "8px 12px 8px 32px", border: "1.5px solid #e2e8f0", borderRadius: "8px", fontSize: "13px", outline: "none", boxSizing: "border-box", background: "#f8fafc" }} />
        </div>
        <div style={{ display: "flex", gap: "6px" }}>
          {["All", "Completed", "In Progress", "Scheduled"].map(s => (
            <button key={s} onClick={() => setStatusFilter(s)} style={{ padding: "6px 12px", borderRadius: "6px", fontSize: "12px", fontWeight: 500, border: statusFilter === s ? "none" : "1px solid #e2e8f0", background: statusFilter === s ? "#0066CC" : "white", color: statusFilter === s ? "white" : "#64748b", cursor: "pointer" }}>{s}</button>
          ))}
        </div>
        <button onClick={() => { setEditingAudit(null); setShowModal(true); }} style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 16px", background: "#0066CC", border: "none", borderRadius: "8px", color: "white", cursor: "pointer", fontSize: "13px", fontWeight: 600, flexShrink: 0 }}>
          <Plus size={15} /> New Audit
        </button>
      </div>

      {/* Table */}
      <div style={{ background: "white", borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", overflow: "hidden", border: "1px solid #e2e8f0" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f8fafc" }}>
                {["Audit ID", "Audit Name", "Department", "Auditor", "Date", "Chapter", "Priority", "Status", "Score", "Actions"].map(h => (
                  <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: "11px", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.5px", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((audit, idx) => {
                const ss = STATUS_STYLES[audit.status] || { color: "#64748b", bg: "#f8fafc", dot: "#94a3b8" };
                const ps = PRIORITY_STYLES[audit.priority] || { color: "#64748b", bg: "#f8fafc" };
                return (
                  <tr key={audit.id} style={{ borderTop: "1px solid #f1f5f9", background: idx % 2 === 0 ? "white" : "#fafbfc" }}>
                    <td style={{ padding: "14px 16px", fontSize: "12px", fontWeight: 700, color: "#0066CC" }}>{audit.id}</td>
                    <td style={{ padding: "14px 16px", maxWidth: "200px" }}>
                      <div style={{ fontSize: "13px", fontWeight: 600, color: "#1e293b", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{audit.name}</div>
                    </td>
                    <td style={{ padding: "14px 16px", fontSize: "13px", color: "#374151" }}>{audit.dept}</td>
                    <td style={{ padding: "14px 16px", fontSize: "13px", color: "#374151" }}>{audit.auditor}</td>
                    <td style={{ padding: "14px 16px", fontSize: "12px", color: "#64748b", whiteSpace: "nowrap" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                        <Calendar size={12} /> {audit.date}
                      </div>
                    </td>
                    <td style={{ padding: "14px 16px", fontSize: "12px", color: "#64748b", maxWidth: "140px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{audit.chapter}</td>
                    <td style={{ padding: "14px 16px" }}>
                      <span style={{ fontSize: "11px", fontWeight: 600, color: ps.color, background: ps.bg, padding: "3px 8px", borderRadius: "10px" }}>{audit.priority}</span>
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: ss.dot }} />
                        <span style={{ fontSize: "12px", fontWeight: 600, color: ss.color, background: ss.bg, padding: "3px 8px", borderRadius: "10px" }}>{audit.status}</span>
                      </div>
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      {audit.score !== null ? (
                        <span style={{ fontSize: "14px", fontWeight: 700, color: audit.score >= 90 ? "#22C55E" : audit.score >= 80 ? "#0066CC" : audit.score >= 70 ? "#F59E0B" : "#EF4444" }}>
                          {audit.score}%
                        </span>
                      ) : (
                        <span style={{ fontSize: "12px", color: "#94a3b8" }}>Pending</span>
                      )}
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <div style={{ display: "flex", gap: "6px" }}>
                        <button onClick={() => setViewingAudit(audit)} style={{ padding: "5px 8px", background: "#eff6ff", border: "none", borderRadius: "6px", fontSize: "11px", color: "#0066CC", cursor: "pointer", fontWeight: 600 }} title="View Details">
                          <Eye size={13} />
                        </button>
                        <button onClick={() => handleDelete(audit.id)} style={{ padding: "5px 8px", background: "#fef2f2", border: "none", borderRadius: "6px", fontSize: "11px", color: "#EF4444", cursor: "pointer" }} title="Delete Audit">
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={10} style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>No audits found matching filter criteria.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
