import { useState } from "react";
import { Search, BookOpen, ChevronDown, ChevronRight, CheckSquare, Download, Upload, Plus, X } from "lucide-react";
import { Page } from "./Sidebar";
import { toast } from "sonner";
import { AuditService } from "../services/auditService";

const INITIAL_CHAPTERS = [
  {
    id: 1, code: "AAC", name: "Access Assessment & Continuity of Care",
    questions: [
      { id: "AAC.1", text: "The hospital defines the services to be provided.", type: "Compliance", criteria: "Objective", tags: ["Documentation", "Policy"] },
      { id: "AAC.2", text: "There is a documented process for patient identification.", type: "Compliance", criteria: "Objective", tags: ["Documentation", "Safety"] },
      { id: "AAC.3", text: "The patient's initial assessment is completed within the defined time frame.", type: "Compliance", criteria: "Objective", tags: ["Process", "Timeliness"] },
      { id: "AAC.4", text: "A reassessment is done for all admitted patients at defined intervals.", type: "Compliance", criteria: "Objective", tags: ["Process"] },
      { id: "AAC.5", text: "The continuity of care is ensured during inter-departmental transfers.", type: "Compliance", criteria: "Process", tags: ["Handover", "Safety"] },
    ]
  },
  {
    id: 2, code: "COP", name: "Care of Patients",
    questions: [
      { id: "COP.1", text: "The hospital has a policy on patient care.", type: "Compliance", criteria: "Objective", tags: ["Policy", "Documentation"] },
      { id: "COP.2", text: "High-risk patients are identified and managed appropriately.", type: "Compliance", criteria: "Process", tags: ["Risk", "Safety"] },
      { id: "COP.3", text: "Pain assessment is performed and documented for all patients.", type: "Compliance", criteria: "Objective", tags: ["Assessment", "Documentation"] },
      { id: "COP.4", text: "End-of-life care meets established standards.", type: "Compliance", criteria: "Process", tags: ["Quality"] },
    ]
  },
  {
    id: 3, code: "MOM", name: "Management of Medication",
    questions: [
      { id: "MOM.1", text: "Medications are stored as per manufacturer requirements.", type: "Compliance", criteria: "Objective", tags: ["Storage", "Safety"] },
      { id: "MOM.2", text: "High-alert medications are clearly labeled and segregated.", type: "Compliance", criteria: "Objective", tags: ["Safety", "Labels"] },
      { id: "MOM.3", text: "Prescription writing follows the hospital's defined format.", type: "Compliance", criteria: "Objective", tags: ["Documentation"] },
      { id: "MOM.4", text: "Medication errors are reported and analyzed.", type: "Compliance", criteria: "Process", tags: ["Safety", "Reporting"] },
      { id: "MOM.5", text: "Expiry of medications is checked regularly.", type: "Compliance", criteria: "Objective", tags: ["Process", "Safety"] },
    ]
  },
  {
    id: 4, code: "PRE", name: "Patient Rights & Education",
    questions: [
      { id: "PRE.1", text: "Patient rights are displayed prominently.", type: "Compliance", criteria: "Objective", tags: ["Display", "Policy"] },
      { id: "PRE.2", text: "Informed consent is obtained before procedures.", type: "Compliance", criteria: "Objective", tags: ["Consent", "Legal"] },
      { id: "PRE.3", text: "Patient education is provided and documented.", type: "Compliance", criteria: "Process", tags: ["Education", "Documentation"] },
    ]
  },
  {
    id: 5, code: "HIC", name: "Hospital Infection Control",
    questions: [
      { id: "HIC.1", text: "Hand hygiene compliance is monitored and documented.", type: "Compliance", criteria: "Process", tags: ["Hygiene", "Monitoring"] },
      { id: "HIC.2", text: "Sterilization processes are validated and documented.", type: "Compliance", criteria: "Objective", tags: ["Sterilization", "Safety"] },
      { id: "HIC.3", text: "Healthcare-associated infection rates are tracked.", type: "Compliance", criteria: "Process", tags: ["Surveillance"] },
      { id: "HIC.4", text: "Personal protective equipment is available and used appropriately.", type: "Compliance", criteria: "Objective", tags: ["PPE", "Safety"] },
    ]
  },
  {
    id: 6, code: "CQI", name: "Continuous Quality Improvement",
    questions: [
      { id: "CQI.1", text: "Quality indicators are defined and monitored.", type: "Compliance", criteria: "Process", tags: ["Monitoring", "Metrics"] },
      { id: "CQI.2", text: "Root cause analysis is performed for sentinel events.", type: "Compliance", criteria: "Process", tags: ["Analysis", "Safety"] },
      { id: "CQI.3", text: "Clinical audits are conducted regularly.", type: "Compliance", criteria: "Process", tags: ["Audit"] },
    ]
  },
  {
    id: 7, code: "ROM", name: "Responsibilities of Management",
    questions: [
      { id: "ROM.1", text: "Leadership is involved in quality improvement activities.", type: "Compliance", criteria: "Process", tags: ["Leadership"] },
      { id: "ROM.2", text: "Policies and procedures are approved by management.", type: "Compliance", criteria: "Objective", tags: ["Policy", "Governance"] },
    ]
  },
  {
    id: 8, code: "FMS", name: "Facility Management & Safety",
    questions: [
      { id: "FMS.1", text: "Fire safety measures are in place and staff are trained.", type: "Compliance", criteria: "Objective", tags: ["Fire Safety", "Training"] },
      { id: "FMS.2", text: "Biomedical waste management follows CPCB guidelines.", type: "Compliance", criteria: "Objective", tags: ["Waste Management"] },
      { id: "FMS.3", text: "Emergency power backup is functional and tested.", type: "Compliance", criteria: "Objective", tags: ["Infrastructure"] },
    ]
  },
  {
    id: 9, code: "HRM", name: "Human Resource Management",
    questions: [
      { id: "HRM.1", text: "All staff credentials are verified and documented.", type: "Compliance", criteria: "Objective", tags: ["Credentials", "Documentation"] },
      { id: "HRM.2", text: "Orientation and training programs are conducted for new staff.", type: "Compliance", criteria: "Process", tags: ["Training"] },
      { id: "HRM.3", text: "Staff performance is evaluated at defined intervals.", type: "Compliance", criteria: "Process", tags: ["Performance"] },
    ]
  },
  {
    id: 10, code: "IMS", name: "Information Management System",
    questions: [
      { id: "IMS.1", text: "Patient records are maintained in a standardized format.", type: "Compliance", criteria: "Objective", tags: ["Records", "Documentation"] },
      { id: "IMS.2", text: "Data confidentiality and security are maintained.", type: "Compliance", criteria: "Process", tags: ["Security", "Privacy"] },
      { id: "IMS.3", text: "Statistical reports are generated and reviewed regularly.", type: "Compliance", criteria: "Process", tags: ["Reporting", "Analytics"] },
    ]
  },
];

const CHAPTER_COLORS = [
  "#0066CC", "#00A3A3", "#22C55E", "#8b5cf6", "#EF4444",
  "#F59E0B", "#06b6d4", "#ec4899", "#84cc16", "#f97316"
];

interface NABHChecklistProps {
  onNavigate?: (page: Page) => void;
}

export function NABHChecklist({ onNavigate }: NABHChecklistProps) {
  const [chapters, setChapters] = useState(INITIAL_CHAPTERS);
  const [search, setSearch] = useState("");
  const [expandedChapters, setExpandedChapters] = useState<Set<number>>(new Set([1]));
  const [selectedTag, setSelectedTag] = useState("All");
  const [showAddModal, setShowAddModal] = useState(false);

  // New question form state
  const [newQ, setNewQ] = useState({
    chapterId: 1,
    id: "",
    text: "",
    criteria: "Objective",
    tags: "Documentation, Safety",
  });

  const allTags = Array.from(new Set(chapters.flatMap(c => c.questions.flatMap(q => q.tags))));
  const totalQuestions = chapters.reduce((s, c) => s + c.questions.length, 0);

  const toggleChapter = (id: number) => {
    const next = new Set(expandedChapters);
    next.has(id) ? next.delete(id) : next.add(id);
    setExpandedChapters(next);
  };

  const handleExportCSV = () => {
    const rows = chapters.flatMap(ch =>
      ch.questions.map(q => ({
        Chapter_Code: ch.code,
        Chapter_Name: ch.name,
        Question_ID: q.id,
        Question_Text: q.text,
        Criteria: q.criteria,
        Tags: q.tags.join("; "),
      }))
    );
    AuditService.exportToCSV("NABH_Checklist_Library", rows);
    toast.success("Exported NABH Checklist library to CSV");
  };

  const handleAddQuestion = () => {
    if (!newQ.text) return alert("Question text is required!");
    const chapterCode = chapters.find(c => c.id === Number(newQ.chapterId))?.code || "AAC";
    const qId = newQ.id || `${chapterCode}.${Date.now().toString().slice(-2)}`;

    const questionObj = {
      id: qId,
      text: newQ.text,
      type: "Compliance",
      criteria: newQ.criteria,
      tags: newQ.tags.split(",").map(t => t.trim()).filter(Boolean),
    };

    setChapters(chapters.map(ch => {
      if (ch.id === Number(newQ.chapterId)) {
        return { ...ch, questions: [...ch.questions, questionObj] };
      }
      return ch;
    }));

    setShowAddModal(false);
    setNewQ({ chapterId: 1, id: "", text: "", criteria: "Objective", tags: "Documentation, Safety" });
    toast.success("New NABH question added to library");
  };

  const handleUseInAudit = (qText: string) => {
    toast.info(`Selected "${qText}" for new audit.`);
    if (onNavigate) onNavigate("audits");
  };

  const filteredChapters = chapters.map(ch => ({
    ...ch,
    questions: ch.questions.filter(q => {
      const matchSearch = !search || q.id.toLowerCase().includes(search.toLowerCase()) || q.text.toLowerCase().includes(search.toLowerCase()) || q.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
      const matchTag = selectedTag === "All" || q.tags.includes(selectedTag);
      return matchSearch && matchTag;
    })
  })).filter(ch => ch.questions.length > 0);

  return (
    <div style={{ padding: "24px", background: "#f8fafc", minHeight: "100%" }}>
      {/* Header Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "14px", marginBottom: "24px" }}>
        {[
          { label: "NABH Chapters", value: "10", color: "#0066CC", icon: "📚" },
          { label: "Total Questions", value: totalQuestions.toString(), color: "#00A3A3", icon: "❓" },
          { label: "Mandatory Standards", value: "28", color: "#22C55E", icon: "✅" },
          { label: "Accreditation Edition", value: "5th Ed.", color: "#8b5cf6", icon: "📋" },
        ].map(s => (
          <div key={s.label} style={{ background: "white", borderRadius: "10px", padding: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", display: "flex", alignItems: "center", gap: "12px", border: "1px solid #e2e8f0" }}>
            <span style={{ fontSize: "26px" }}>{s.icon}</span>
            <div>
              <div style={{ fontSize: "22px", fontWeight: 800, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: "12px", color: "#64748b" }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Chapter Overview Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "10px", marginBottom: "24px" }}>
        {chapters.map((ch, i) => (
          <button
            key={ch.id}
            onClick={() => { setExpandedChapters(new Set([ch.id])); }}
            style={{
              background: "white", borderRadius: "10px", padding: "12px", textAlign: "center",
              boxShadow: "0 1px 3px rgba(0,0,0,0.06)", cursor: "pointer",
              border: expandedChapters.has(ch.id) ? `2px solid ${CHAPTER_COLORS[i]}` : "1px solid #e2e8f0",
              transition: "all 0.15s"
            }}
          >
            <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: `${CHAPTER_COLORS[i]}15`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 6px", color: CHAPTER_COLORS[i], fontWeight: 700, fontSize: "13px" }}>
              {ch.code}
            </div>
            <div style={{ fontSize: "10px", color: "#64748b", lineHeight: 1.3 }}>{ch.name.split(" ").slice(0, 3).join(" ")}</div>
            <div style={{ fontSize: "11px", fontWeight: 600, color: CHAPTER_COLORS[i], marginTop: "4px" }}>{ch.questions.length} Qs</div>
          </button>
        ))}
      </div>

      {/* Toolbar */}
      <div style={{ background: "white", borderRadius: "12px", padding: "14px 20px", marginBottom: "16px", display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #e2e8f0" }}>
        <div style={{ position: "relative", flex: 1, minWidth: "200px" }}>
          <Search size={15} style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search questions, codes, tags..." style={{ width: "100%", padding: "8px 12px 8px 32px", border: "1.5px solid #e2e8f0", borderRadius: "8px", fontSize: "13px", outline: "none", boxSizing: "border-box", background: "#f8fafc" }} />
        </div>
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
          {["All", ...allTags.slice(0, 5)].map(tag => (
            <button key={tag} onClick={() => setSelectedTag(tag)} style={{ padding: "5px 10px", borderRadius: "6px", fontSize: "11px", fontWeight: 500, border: selectedTag === tag ? "none" : "1px solid #e2e8f0", background: selectedTag === tag ? "#0066CC" : "white", color: selectedTag === tag ? "white" : "#64748b", cursor: "pointer" }}>
              {tag}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
          <button onClick={handleExportCSV} style={{ display: "flex", alignItems: "center", gap: "5px", padding: "7px 12px", background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: "8px", fontSize: "12px", color: "#0066CC", cursor: "pointer", fontWeight: 600 }}>
            <Download size={13} /> Export CSV
          </button>
          <button onClick={() => setShowAddModal(true)} style={{ display: "flex", alignItems: "center", gap: "5px", padding: "7px 12px", background: "#0066CC", border: "none", borderRadius: "8px", fontSize: "12px", color: "white", cursor: "pointer", fontWeight: 600 }}>
            <Plus size={13} /> Add Question
          </button>
        </div>
      </div>

      {/* Question List */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {filteredChapters.map((ch, ci) => {
          const color = CHAPTER_COLORS[ci % CHAPTER_COLORS.length];
          const expanded = expandedChapters.has(ch.id);
          return (
            <div key={ch.id} style={{ background: "white", borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", overflow: "hidden", border: "1px solid #e2e8f0" }}>
              <button
                onClick={() => toggleChapter(ch.id)}
                style={{
                  width: "100%", display: "flex", alignItems: "center", gap: "14px",
                  padding: "16px 20px", background: expanded ? `${color}08` : "white",
                  border: "none", cursor: "pointer", borderLeft: `4px solid ${color}`,
                  transition: "background 0.15s"
                }}
              >
                <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: `${color}15`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <BookOpen size={18} color={color} />
                </div>
                <div style={{ flex: 1, textAlign: "left" }}>
                  <div style={{ fontSize: "14px", fontWeight: 700, color: "#1e293b" }}>
                    <span style={{ color, marginRight: "6px" }}>{ch.code}</span>
                    {ch.name}
                  </div>
                  <div style={{ fontSize: "12px", color: "#94a3b8", marginTop: "2px" }}>{ch.questions.length} questions in this chapter</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <span style={{ fontSize: "12px", fontWeight: 600, color, background: `${color}15`, padding: "4px 10px", borderRadius: "10px" }}>{ch.questions.length} Qs</span>
                  {expanded ? <ChevronDown size={16} color="#94a3b8" /> : <ChevronRight size={16} color="#94a3b8" />}
                </div>
              </button>

              {expanded && (
                <div style={{ borderTop: `1px solid ${color}20` }}>
                  {ch.questions.map((q, qi) => (
                    <div
                      key={q.id}
                      style={{
                        display: "flex", alignItems: "flex-start", gap: "14px",
                        padding: "14px 20px 14px 24px",
                        borderBottom: qi < ch.questions.length - 1 ? "1px solid #f8fafc" : "none",
                        transition: "background 0.1s"
                      }}
                      onMouseEnter={e => (e.currentTarget.style.background = "#f8fafc")}
                      onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                    >
                      <div style={{ width: "20px", height: "20px", borderRadius: "4px", border: `2px solid ${color}40`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: "2px" }}>
                        <CheckSquare size={12} color={color} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "flex-start", gap: "10px", flexWrap: "wrap" }}>
                          <span style={{ fontSize: "11px", fontWeight: 700, color, background: `${color}10`, padding: "2px 6px", borderRadius: "4px", flexShrink: 0 }}>{q.id}</span>
                          <span style={{ fontSize: "13px", color: "#374151", lineHeight: 1.5, flex: 1 }}>{q.text}</span>
                        </div>
                        <div style={{ display: "flex", gap: "6px", marginTop: "8px", flexWrap: "wrap" }}>
                          {q.tags.map(tag => (
                            <span key={tag} style={{ fontSize: "10px", color: "#64748b", background: "#f1f5f9", padding: "2px 7px", borderRadius: "8px", cursor: "pointer" }}
                              onClick={() => setSelectedTag(tag)}>
                              {tag}
                            </span>
                          ))}
                          <span style={{ fontSize: "10px", color: "#94a3b8", padding: "2px 6px" }}>{q.criteria}</span>
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: "6px", flexShrink: 0 }}>
                        <button onClick={() => handleUseInAudit(q.text)} style={{ padding: "4px 10px", background: "#eff6ff", border: "none", borderRadius: "6px", fontSize: "11px", color: "#0066CC", cursor: "pointer", fontWeight: 600 }}>
                          Use in Audit
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add Question Modal */}
      {showAddModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
          <div style={{ background: "white", borderRadius: "16px", width: "500px", padding: "24px", boxShadow: "0 20px 40px rgba(0,0,0,0.2)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h3 style={{ margin: 0, fontSize: "17px", fontWeight: 700 }}>Add Question to NABH Library</h3>
              <button onClick={() => setShowAddModal(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8" }}><X size={18} /></button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div>
                <label style={{ fontSize: "12px", fontWeight: 600, color: "#374151" }}>Select Chapter</label>
                <select value={newQ.chapterId} onChange={e => setNewQ({ ...newQ, chapterId: Number(e.target.value) })} style={{ width: "100%", padding: "8px", border: "1px solid #cbd5e1", borderRadius: "6px", marginTop: "4px" }}>
                  {chapters.map(c => <option key={c.id} value={c.id}>{c.code} - {c.name}</option>)}
                </select>
              </div>

              <div>
                <label style={{ fontSize: "12px", fontWeight: 600, color: "#374151" }}>Standard Question Text</label>
                <textarea rows={3} value={newQ.text} onChange={e => setNewQ({ ...newQ, text: e.target.value })} placeholder="Enter compliance evaluation question..." style={{ width: "100%", padding: "8px", border: "1px solid #cbd5e1", borderRadius: "6px", marginTop: "4px", boxSizing: "border-box" }} />
              </div>

              <div>
                <label style={{ fontSize: "12px", fontWeight: 600, color: "#374151" }}>Tags (comma separated)</label>
                <input value={newQ.tags} onChange={e => setNewQ({ ...newQ, tags: e.target.value })} style={{ width: "100%", padding: "8px", border: "1px solid #cbd5e1", borderRadius: "6px", marginTop: "4px", boxSizing: "border-box" }} />
              </div>
            </div>

            <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
              <button onClick={() => setShowAddModal(false)} style={{ flex: 1, padding: "10px", background: "#f1f5f9", border: "none", borderRadius: "8px", cursor: "pointer" }}>Cancel</button>
              <button onClick={handleAddQuestion} style={{ flex: 1, padding: "10px", background: "#0066CC", color: "white", border: "none", borderRadius: "8px", fontWeight: 600, cursor: "pointer" }}>Save Question</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
