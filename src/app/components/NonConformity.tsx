import { useState } from "react";
import { Plus, Search, AlertTriangle, X, CheckCircle, Clock } from "lucide-react";
import { useAudit } from "../context/AuditContext";
import { NonConformity as NCType, NCSeverity } from "../types/audit";
import { Page } from "./Sidebar";

const SEVERITY_STYLES: Record<string, { color: string; bg: string; border: string }> = {
  Critical: { color: "#EF4444", bg: "#fef2f2", border: "#fecaca" },
  Major: { color: "#F59E0B", bg: "#fffbeb", border: "#fde68a" },
  Minor: { color: "#0066CC", bg: "#eff6ff", border: "#bfdbfe" },
};

const STATUS_STYLES: Record<string, { color: string; bg: string }> = {
  Open: { color: "#F59E0B", bg: "#fffbeb" },
  "In Progress": { color: "#0066CC", bg: "#eff6ff" },
  Overdue: { color: "#EF4444", bg: "#fef2f2" },
  Closed: { color: "#22C55E", bg: "#f0fdf4" },
};

interface NonConformityProps {
  onNavigate?: (page: Page) => void;
}

interface AddNCModalProps {
  onClose: () => void;
  onSave: (nc: Partial<NCType>) => void;
}

function AddNCModal({ onClose, onSave }: AddNCModalProps) {
  const { departments } = useAudit();
  const [formData, setFormData] = useState({
    dept: departments[0]?.name || "Emergency",
    severity: "Major" as NCSeverity,
    description: "",
    rootCause: "",
    assignedTo: "",
    dueDate: new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10),
    chapter: "AAC",
    auditRef: "",
  });

  const handleSubmit = () => {
    if (!formData.description) return alert("Finding description is required!");
    onSave(formData);
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
      <div style={{ background: "white", borderRadius: "16px", width: "600px", maxWidth: "100%", padding: "28px", boxShadow: "0 25px 50px rgba(0,0,0,0.2)", maxHeight: "90vh", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#1e293b", margin: 0 }}>Report Non-Conformity Finding</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8" }}><X size={20} /></button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
          <div>
            <label style={{ fontSize: "12px", fontWeight: 600, color: "#374151", display: "block", marginBottom: "5px" }}>Department</label>
            <select value={formData.dept} onChange={e => setFormData({ ...formData, dept: e.target.value })} style={{ width: "100%", padding: "8px 10px", border: "1.5px solid #e2e8f0", borderRadius: "8px", fontSize: "13px", color: "#1e293b", background: "#f8fafc", outline: "none", boxSizing: "border-box" }}>
              {departments.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
            </select>
          </div>

          <div>
            <label style={{ fontSize: "12px", fontWeight: 600, color: "#374151", display: "block", marginBottom: "5px" }}>Severity</label>
            <select value={formData.severity} onChange={e => setFormData({ ...formData, severity: e.target.value as NCSeverity })} style={{ width: "100%", padding: "8px 10px", border: "1.5px solid #e2e8f0", borderRadius: "8px", fontSize: "13px", color: "#1e293b", background: "#f8fafc", outline: "none", boxSizing: "border-box" }}>
              <option value="Critical">Critical</option>
              <option value="Major">Major</option>
              <option value="Minor">Minor</option>
            </select>
          </div>

          <div style={{ gridColumn: "span 2" }}>
            <label style={{ fontSize: "12px", fontWeight: 600, color: "#374151", display: "block", marginBottom: "5px" }}>Finding Description</label>
            <textarea rows={3} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} placeholder="Describe the non-conformity finding in detail..." style={{ width: "100%", padding: "8px 10px", border: "1.5px solid #e2e8f0", borderRadius: "8px", fontSize: "13px", resize: "vertical", outline: "none", boxSizing: "border-box", color: "#374151" }} />
          </div>

          <div style={{ gridColumn: "span 2" }}>
            <label style={{ fontSize: "12px", fontWeight: 600, color: "#374151", display: "block", marginBottom: "5px" }}>Root Cause Analysis</label>
            <textarea rows={2} value={formData.rootCause} onChange={e => setFormData({ ...formData, rootCause: e.target.value })} placeholder="Describe identified root cause..." style={{ width: "100%", padding: "8px 10px", border: "1.5px solid #e2e8f0", borderRadius: "8px", fontSize: "13px", resize: "vertical", outline: "none", boxSizing: "border-box", color: "#374151" }} />
          </div>

          <div>
            <label style={{ fontSize: "12px", fontWeight: 600, color: "#374151", display: "block", marginBottom: "5px" }}>Assigned To</label>
            <input value={formData.assignedTo} onChange={e => setFormData({ ...formData, assignedTo: e.target.value })} placeholder="Name of responsible officer" style={{ width: "100%", padding: "8px 10px", border: "1.5px solid #e2e8f0", borderRadius: "8px", fontSize: "13px", outline: "none", boxSizing: "border-box", color: "#374151", background: "#f8fafc" }} />
          </div>

          <div>
            <label style={{ fontSize: "12px", fontWeight: 600, color: "#374151", display: "block", marginBottom: "5px" }}>Due Date</label>
            <input type="date" value={formData.dueDate} onChange={e => setFormData({ ...formData, dueDate: e.target.value })} style={{ width: "100%", padding: "8px 10px", border: "1.5px solid #e2e8f0", borderRadius: "8px", fontSize: "13px", outline: "none", boxSizing: "border-box", color: "#374151", background: "#f8fafc" }} />
          </div>

          <div>
            <label style={{ fontSize: "12px", fontWeight: 600, color: "#374151", display: "block", marginBottom: "5px" }}>NABH Chapter Code</label>
            <select value={formData.chapter} onChange={e => setFormData({ ...formData, chapter: e.target.value })} style={{ width: "100%", padding: "8px 10px", border: "1.5px solid #e2e8f0", borderRadius: "8px", fontSize: "13px", color: "#1e293b", background: "#f8fafc", outline: "none", boxSizing: "border-box" }}>
              {["AAC", "COP", "MOM", "PRE", "HIC", "CQI", "ROM", "FMS", "HRM", "IMS"].map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label style={{ fontSize: "12px", fontWeight: 600, color: "#374151", display: "block", marginBottom: "5px" }}>Audit Reference ID</label>
            <input value={formData.auditRef} onChange={e => setFormData({ ...formData, auditRef: e.target.value })} placeholder="e.g., AUD-001" style={{ width: "100%", padding: "8px 10px", border: "1.5px solid #e2e8f0", borderRadius: "8px", fontSize: "13px", outline: "none", boxSizing: "border-box", color: "#374151", background: "#f8fafc" }} />
          </div>
        </div>

        <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
          <button onClick={onClose} style={{ flex: 1, padding: "10px", background: "#f1f5f9", border: "none", borderRadius: "8px", fontSize: "14px", color: "#64748b", cursor: "pointer", fontWeight: 500 }}>Cancel</button>
          <button onClick={handleSubmit} style={{ flex: 2, padding: "10px", background: "#EF4444", border: "none", borderRadius: "8px", fontSize: "14px", color: "white", cursor: "pointer", fontWeight: 600 }}>Save NC Finding</button>
        </div>
      </div>
    </div>
  );
}

// NC Detail View Modal
function NCDetailModal({ nc, onClose }: { nc: NCType; onClose: () => void }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
      <div style={{ background: "white", borderRadius: "16px", width: "550px", maxWidth: "100%", padding: "24px", boxShadow: "0 20px 40px rgba(0,0,0,0.2)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", borderBottom: "1px solid #eee", paddingBottom: "12px" }}>
          <div>
            <div style={{ fontSize: "12px", color: "#EF4444", fontWeight: 700 }}>{nc.id} • {nc.chapter}</div>
            <h3 style={{ margin: 0, fontSize: "17px", color: "#1e293b" }}>{nc.description}</h3>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8" }}><X size={18} /></button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px", background: "#f8fafc", padding: "16px", borderRadius: "8px" }}>
          <div><strong style={{ fontSize: "12px", color: "#64748b" }}>Department:</strong> <span style={{ fontSize: "13px", fontWeight: 600 }}>{nc.dept}</span></div>
          <div><strong style={{ fontSize: "12px", color: "#64748b" }}>Severity:</strong> <span style={{ fontSize: "12px", fontWeight: 700, color: SEVERITY_STYLES[nc.severity]?.color }}>{nc.severity}</span></div>
          <div><strong style={{ fontSize: "12px", color: "#64748b" }}>Status:</strong> <span style={{ fontSize: "12px", fontWeight: 700, color: STATUS_STYLES[nc.status]?.color }}>{nc.status}</span></div>
          <div><strong style={{ fontSize: "12px", color: "#64748b" }}>Assigned Officer:</strong> <span style={{ fontSize: "13px" }}>{nc.assignedTo}</span></div>
          <div><strong style={{ fontSize: "12px", color: "#64748b" }}>Resolution Target Date:</strong> <span style={{ fontSize: "13px" }}>{nc.dueDate}</span></div>
          <div><strong style={{ fontSize: "12px", color: "#64748b" }}>Root Cause Analysis:</strong> <p style={{ margin: "4px 0 0", fontSize: "13px", color: "#374151" }}>{nc.rootCause}</p></div>
        </div>

        <button onClick={onClose} style={{ marginTop: "16px", width: "100%", padding: "10px", background: "#0066CC", color: "white", border: "none", borderRadius: "8px", fontWeight: 600, cursor: "pointer" }}>
          Close Detail View
        </button>
      </div>
    </div>
  );
}

export function NonConformity({ onNavigate }: NonConformityProps) {
  const { nonConformities, saveNC, updateNCStatus, saveCAPA } = useAudit();
  const [search, setSearch] = useState("");
  const [sevFilter, setSevFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [viewingNC, setViewingNC] = useState<NCType | null>(null);

  const stats = {
    open: nonConformities.filter(n => n.status === "Open").length,
    overdue: nonConformities.filter(n => n.status === "Overdue").length,
    inProgress: nonConformities.filter(n => n.status === "In Progress").length,
    closed: nonConformities.filter(n => n.status === "Closed").length,
    critical: nonConformities.filter(n => n.severity === "Critical").length,
  };

  const filtered = nonConformities.filter(n => {
    const matchSearch = !search || n.id.toLowerCase().includes(search.toLowerCase()) || n.dept.toLowerCase().includes(search.toLowerCase()) || n.description.toLowerCase().includes(search.toLowerCase());
    const matchSev = sevFilter === "All" || n.severity === sevFilter;
    const matchStatus = statusFilter === "All" || n.status === statusFilter;
    return matchSearch && matchSev && matchStatus;
  });

  const handleSaveNC = async (ncData: Partial<NCType>) => {
    await saveNC(ncData);
    setShowModal(false);
  };

  const handleAssignCAPA = async (nc: NCType) => {
    await saveCAPA({
      ncId: nc.id,
      action: `Corrective action for: ${nc.description}`,
      responsible: nc.assignedTo,
      dueDate: nc.dueDate,
      status: "In Progress",
    });
    await updateNCStatus(nc.id, "In Progress");
    if (onNavigate) onNavigate("capa");
  };

  return (
    <div style={{ padding: "24px", background: "#f8fafc", minHeight: "100%" }}>
      {showModal && <AddNCModal onClose={() => setShowModal(false)} onSave={handleSaveNC} />}
      {viewingNC && <NCDetailModal nc={viewingNC} onClose={() => setViewingNC(null)} />}

      {/* Stats Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "14px", marginBottom: "24px" }}>
        {[
          { label: "Open", value: stats.open, color: "#F59E0B", icon: "🔓" },
          { label: "Overdue", value: stats.overdue, color: "#EF4444", icon: "⏰" },
          { label: "In Progress", value: stats.inProgress, color: "#0066CC", icon: "🔄" },
          { label: "Closed", value: stats.closed, color: "#22C55E", icon: "✅" },
          { label: "Critical", value: stats.critical, color: "#EF4444", icon: "🚨" },
        ].map(s => (
          <div key={s.label} style={{ background: "white", borderRadius: "10px", padding: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", display: "flex", alignItems: "center", gap: "12px", border: "1px solid #e2e8f0" }}>
            <span style={{ fontSize: "24px" }}>{s.icon}</span>
            <div>
              <div style={{ fontSize: "22px", fontWeight: 800, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: "12px", color: "#64748b" }}>{s.label} Findings</div>
            </div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div style={{ background: "white", borderRadius: "12px", padding: "14px 20px", marginBottom: "16px", display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #e2e8f0" }}>
        <div style={{ position: "relative", flex: 1, minWidth: "200px" }}>
          <Search size={15} style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search findings..." style={{ width: "100%", padding: "8px 12px 8px 32px", border: "1.5px solid #e2e8f0", borderRadius: "8px", fontSize: "13px", outline: "none", boxSizing: "border-box", background: "#f8fafc" }} />
        </div>
        <div style={{ display: "flex", gap: "6px" }}>
          {["All", "Critical", "Major", "Minor"].map(s => (
            <button key={s} onClick={() => setSevFilter(s)} style={{ padding: "6px 10px", borderRadius: "6px", fontSize: "12px", border: sevFilter === s ? "none" : "1px solid #e2e8f0", background: sevFilter === s ? "#EF4444" : "white", color: sevFilter === s ? "white" : "#64748b", cursor: "pointer", fontWeight: 500 }}>{s}</button>
          ))}
        </div>
        <div style={{ display: "flex", gap: "6px" }}>
          {["All", "Open", "In Progress", "Overdue", "Closed"].map(s => (
            <button key={s} onClick={() => setStatusFilter(s)} style={{ padding: "6px 10px", borderRadius: "6px", fontSize: "12px", border: statusFilter === s ? "none" : "1px solid #e2e8f0", background: statusFilter === s ? "#0066CC" : "white", color: statusFilter === s ? "white" : "#64748b", cursor: "pointer", fontWeight: 500 }}>{s}</button>
          ))}
        </div>
        <button onClick={() => setShowModal(true)} style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 16px", background: "#EF4444", border: "none", borderRadius: "8px", color: "white", cursor: "pointer", fontSize: "13px", fontWeight: 600, flexShrink: 0 }}>
          <Plus size={15} /> Report Finding
        </button>
      </div>

      {/* Cards List */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {filtered.map(nc => {
          const ss = SEVERITY_STYLES[nc.severity] || { color: "#64748b", bg: "#f8fafc", border: "#e2e8f0" };
          const sts = STATUS_STYLES[nc.status] || { color: "#64748b", bg: "#f8fafc" };
          const isOverdue = nc.status === "Overdue";
          return (
            <div
              key={nc.id}
              style={{
                background: "white", borderRadius: "12px", padding: "20px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                borderLeft: `4px solid ${ss.color}`,
                border: "1px solid #e2e8f0",
                outline: isOverdue ? `2px solid #fecaca` : "none",
              }}
            >
              <div style={{ display: "flex", gap: "16px", alignItems: "flex-start", flexWrap: "wrap" }}>
                <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: ss.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <AlertTriangle size={20} color={ss.color} />
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", marginBottom: "6px" }}>
                    <span style={{ fontSize: "13px", fontWeight: 700, color: "#0066CC" }}>{nc.id}</span>
                    <span style={{ fontSize: "11px", fontWeight: 600, color: ss.color, background: ss.bg, padding: "3px 8px", borderRadius: "8px", border: `1px solid ${ss.border}` }}>{nc.severity}</span>
                    <span style={{ fontSize: "11px", fontWeight: 600, color: sts.color, background: sts.bg, padding: "3px 8px", borderRadius: "8px" }}>
                      {isOverdue && "⚠️ "}{nc.status}
                    </span>
                    <span style={{ fontSize: "11px", color: "#94a3b8", background: "#f1f5f9", padding: "3px 8px", borderRadius: "8px" }}>{nc.chapter}</span>
                  </div>
                  <p style={{ margin: "0 0 8px", fontSize: "14px", fontWeight: 600, color: "#1e293b" }}>{nc.description}</p>
                  <p style={{ margin: "0 0 10px", fontSize: "12px", color: "#64748b" }}>
                    <span style={{ fontWeight: 500 }}>Root Cause:</span> {nc.rootCause}
                  </p>
                  <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
                    <div style={{ fontSize: "12px", color: "#64748b" }}>
                      <span style={{ fontWeight: 500 }}>Dept:</span> {nc.dept}
                    </div>
                    <div style={{ fontSize: "12px", color: "#64748b" }}>
                      <span style={{ fontWeight: 500 }}>Assigned To:</span> {nc.assignedTo}
                    </div>
                    <div style={{ fontSize: "12px", color: isOverdue ? "#EF4444" : "#64748b", fontWeight: isOverdue ? 600 : 400 }}>
                      {isOverdue ? "⏰ " : ""}<span style={{ fontWeight: 500 }}>Due:</span> {nc.dueDate}
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
                  {nc.status !== "Closed" && (
                    <button onClick={() => handleAssignCAPA(nc)} style={{ padding: "7px 14px", background: "#eff6ff", border: "none", borderRadius: "8px", fontSize: "12px", color: "#0066CC", cursor: "pointer", fontWeight: 600 }}>
                      Assign CAPA
                    </button>
                  )}
                  <button onClick={() => setViewingNC(nc)} style={{ padding: "7px 14px", background: "#f1f5f9", border: "none", borderRadius: "8px", fontSize: "12px", color: "#64748b", cursor: "pointer", fontWeight: 500 }}>
                    Details
                  </button>
                  {nc.status !== "Closed" && (
                    <button onClick={() => updateNCStatus(nc.id, "Closed")} style={{ padding: "7px 14px", background: "#f0fdf4", border: "none", borderRadius: "8px", fontSize: "12px", color: "#22C55E", cursor: "pointer", fontWeight: 600 }}>
                      Close NC
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px", color: "#64748b", background: "white", borderRadius: "12px" }}>
            No non-conformity findings match your filter.
          </div>
        )}
      </div>
    </div>
  );
}
