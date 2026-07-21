import { useState } from "react";
import { Search, Plus, Edit, Trash2, X, Building2, User } from "lucide-react";
import { useAudit } from "../context/AuditContext";
import { Department } from "../types/audit";

const STATUS_STYLE: Record<string, { color: string; bg: string }> = {
  Excellent: { color: "#22C55E", bg: "#f0fdf4" },
  Good: { color: "#0066CC", bg: "#eff6ff" },
  "Needs Improvement": { color: "#F59E0B", bg: "#fffbeb" },
  Critical: { color: "#EF4444", bg: "#fef2f2" },
};

function ScoreBar({ score }: { score: number }) {
  const color = score >= 90 ? "#22C55E" : score >= 80 ? "#0066CC" : score >= 70 ? "#F59E0B" : "#EF4444";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <div style={{ flex: 1, height: "6px", background: "#f1f5f9", borderRadius: "3px" }}>
        <div style={{ width: `${score}%`, height: "100%", background: color, borderRadius: "3px", transition: "width 0.3s" }} />
      </div>
      <span style={{ fontSize: "13px", fontWeight: 700, color, minWidth: "36px" }}>{score}%</span>
    </div>
  );
}

interface DeptModalProps {
  isEdit?: boolean;
  dept?: Department | null;
  onClose: () => void;
  onSave: (dept: Partial<Department>) => void;
}

function DeptModal({ isEdit = false, dept, onClose, onSave }: DeptModalProps) {
  const [formData, setFormData] = useState({
    name: dept?.name || "",
    head: dept?.head || "",
    category: dept?.category || ("Clinical" as const),
    staff: dept?.staff || 10,
    score: dept?.score || 80,
  });

  const handleSave = () => {
    if (!formData.name || !formData.head) {
      alert("Department Name and Head are required!");
      return;
    }
    onSave({
      ...(dept?.id ? { id: dept.id } : {}),
      ...formData,
      staff: Number(formData.staff),
      score: Number(formData.score),
    });
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
      <div style={{ background: "white", borderRadius: "16px", width: "500px", maxWidth: "100%", padding: "28px", boxShadow: "0 25px 50px rgba(0,0,0,0.2)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
          <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#1e293b", margin: 0 }}>
            {isEdit ? "Edit Department" : "Add New Department"}
          </h3>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8", padding: "4px" }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <label style={{ fontSize: "13px", fontWeight: 600, color: "#374151", display: "block", marginBottom: "6px" }}>Department Name</label>
            <input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Cardiology"
              style={{ width: "100%", padding: "9px 12px", border: "1.5px solid #e2e8f0", borderRadius: "8px", fontSize: "13px", outline: "none", boxSizing: "border-box" }}
            />
          </div>
          <div>
            <label style={{ fontSize: "13px", fontWeight: 600, color: "#374151", display: "block", marginBottom: "6px" }}>Department Head</label>
            <input
              value={formData.head}
              onChange={(e) => setFormData({ ...formData, head: e.target.value })}
              placeholder="e.g., Dr. Jane Doe"
              style={{ width: "100%", padding: "9px 12px", border: "1.5px solid #e2e8f0", borderRadius: "8px", fontSize: "13px", outline: "none", boxSizing: "border-box" }}
            />
          </div>
          <div>
            <label style={{ fontSize: "13px", fontWeight: 600, color: "#374151", display: "block", marginBottom: "6px" }}>Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
              style={{ width: "100%", padding: "9px 12px", border: "1.5px solid #e2e8f0", borderRadius: "8px", fontSize: "13px", outline: "none", boxSizing: "border-box" }}
            >
              <option value="Clinical">Clinical</option>
              <option value="Diagnostic">Diagnostic</option>
              <option value="Admin">Admin</option>
              <option value="Support">Support</option>
            </select>
          </div>
          <div>
            <label style={{ fontSize: "13px", fontWeight: 600, color: "#374151", display: "block", marginBottom: "6px" }}>Total Staff Count</label>
            <input
              type="number"
              value={formData.staff}
              onChange={(e) => setFormData({ ...formData, staff: Number(e.target.value) })}
              style={{ width: "100%", padding: "9px 12px", border: "1.5px solid #e2e8f0", borderRadius: "8px", fontSize: "13px", outline: "none", boxSizing: "border-box" }}
            />
          </div>
          <div>
            <label style={{ fontSize: "13px", fontWeight: 600, color: "#374151", display: "block", marginBottom: "6px" }}>Initial Compliance Score (%)</label>
            <input
              type="number"
              min="0"
              max="100"
              value={formData.score}
              onChange={(e) => setFormData({ ...formData, score: Number(e.target.value) })}
              style={{ width: "100%", padding: "9px 12px", border: "1.5px solid #e2e8f0", borderRadius: "8px", fontSize: "13px", outline: "none", boxSizing: "border-box" }}
            />
          </div>
        </div>

        <div style={{ display: "flex", gap: "10px", marginTop: "24px" }}>
          <button onClick={onClose} style={{ flex: 1, padding: "10px", background: "#f1f5f9", border: "none", borderRadius: "8px", fontSize: "14px", color: "#64748b", cursor: "pointer", fontWeight: 500 }}>Cancel</button>
          <button onClick={handleSave} style={{ flex: 1, padding: "10px", background: "#0066CC", border: "none", borderRadius: "8px", fontSize: "14px", color: "white", cursor: "pointer", fontWeight: 600 }}>
            {isEdit ? "Save Changes" : "Add Department"}
          </button>
        </div>
      </div>
    </div>
  );
}

export function Departments() {
  const { departments, saveDepartment, deleteDepartment } = useAudit();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingDept, setEditingDept] = useState<Department | null>(null);

  const filtered = departments.filter(d => {
    const matchSearch = d.name.toLowerCase().includes(search.toLowerCase()) || d.head.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "All" || d.category === filter;
    return matchSearch && matchFilter;
  });

  const openEdit = (dept: Department) => {
    setEditingDept(dept);
    setShowEditModal(true);
  };

  const handleSaveModal = async (deptData: Partial<Department>) => {
    await saveDepartment(deptData);
    setShowAddModal(false);
    setShowEditModal(false);
    setEditingDept(null);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this department?")) {
      await deleteDepartment(id);
    }
  };

  return (
    <div style={{ padding: "24px", background: "#f8fafc", minHeight: "100%" }}>
      {/* Summary Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "14px", marginBottom: "24px" }}>
        {[
          { label: "Total Departments", value: departments.length, color: "#0066CC" },
          { label: "Excellent (≥90%)", value: departments.filter(d => d.score >= 90).length, color: "#22C55E" },
          { label: "Needs Attention (<80%)", value: departments.filter(d => d.score < 80).length, color: "#F59E0B" },
          { label: "Critical (<70%)", value: departments.filter(d => d.score < 70).length, color: "#EF4444" },
        ].map(s => (
          <div key={s.label} style={{ background: "white", borderRadius: "10px", padding: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", borderTop: `3px solid ${s.color}`, border: "1px solid #e2e8f0" }}>
            <div style={{ fontSize: "26px", fontWeight: 800, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: "12px", color: "#64748b", marginTop: "2px" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div style={{ background: "white", borderRadius: "12px", padding: "16px 20px", marginBottom: "16px", display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #e2e8f0" }}>
        <div style={{ position: "relative", flex: 1, minWidth: "200px" }}>
          <Search size={15} style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search departments or heads..." style={{ width: "100%", padding: "8px 12px 8px 32px", border: "1.5px solid #e2e8f0", borderRadius: "8px", fontSize: "13px", outline: "none", boxSizing: "border-box", background: "#f8fafc" }} />
        </div>
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
          {["All", "Clinical", "Diagnostic", "Admin", "Support"].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{ padding: "6px 12px", borderRadius: "6px", fontSize: "12px", fontWeight: 500, border: filter === f ? "none" : "1px solid #e2e8f0", background: filter === f ? "#0066CC" : "white", color: filter === f ? "white" : "#64748b", cursor: "pointer" }}>
              {f}
            </button>
          ))}
        </div>
        <button onClick={() => setShowAddModal(true)} style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 16px", background: "#0066CC", border: "none", borderRadius: "8px", color: "white", cursor: "pointer", fontSize: "13px", fontWeight: 600 }}>
          <Plus size={15} /> Add Department
        </button>
      </div>

      {/* Table */}
      <div style={{ background: "white", borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", overflow: "hidden", border: "1px solid #e2e8f0" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f8fafc" }}>
                {["Department", "Category", "Department Head", "Staff", "Compliance Score", "Status", "Last Audit", "NC Count", "Actions"].map(h => (
                  <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: "11px", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.5px", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((dept, idx) => {
                const st = STATUS_STYLE[dept.status] || { color: "#64748b", bg: "#f8fafc" };
                return (
                  <tr key={dept.id} style={{ borderTop: "1px solid #f1f5f9", background: idx % 2 === 0 ? "white" : "#fafbfc" }}>
                    <td style={{ padding: "14px 16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <div style={{ width: "34px", height: "34px", borderRadius: "8px", background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <Building2 size={16} color="#0066CC" />
                        </div>
                        <span style={{ fontSize: "13px", fontWeight: 600, color: "#1e293b" }}>{dept.name}</span>
                      </div>
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <span style={{ fontSize: "11px", padding: "3px 8px", borderRadius: "10px", background: "#f1f5f9", color: "#64748b", fontWeight: 500 }}>{dept.category}</span>
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <User size={13} color="#94a3b8" />
                        <span style={{ fontSize: "13px", color: "#374151" }}>{dept.head}</span>
                      </div>
                    </td>
                    <td style={{ padding: "14px 16px", fontSize: "13px", color: "#374151" }}>{dept.staff}</td>
                    <td style={{ padding: "14px 16px", minWidth: "160px" }}>
                      <ScoreBar score={dept.score} />
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <span style={{ fontSize: "11px", fontWeight: 600, color: st.color, background: st.bg, padding: "4px 10px", borderRadius: "12px" }}>{dept.status}</span>
                    </td>
                    <td style={{ padding: "14px 16px", fontSize: "12px", color: "#64748b" }}>{dept.lastAudit}</td>
                    <td style={{ padding: "14px 16px" }}>
                      <span style={{ fontSize: "13px", fontWeight: 700, color: dept.nc > 8 ? "#EF4444" : dept.nc > 4 ? "#F59E0B" : "#22C55E" }}>{dept.nc}</span>
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <div style={{ display: "flex", gap: "6px" }}>
                        <button onClick={() => openEdit(dept)} style={{ padding: "5px 8px", background: "#f1f5f9", border: "none", borderRadius: "6px", cursor: "pointer", color: "#0066CC" }} title="Edit">
                          <Edit size={13} />
                        </button>
                        <button onClick={() => handleDelete(dept.id)} style={{ padding: "5px 8px", background: "#f1f5f9", border: "none", borderRadius: "6px", cursor: "pointer", color: "#EF4444" }} title="Delete">
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={9} style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>No departments found matching your search filter.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && <DeptModal isEdit={false} onClose={() => setShowAddModal(false)} onSave={handleSaveModal} />}

      {/* Edit Modal */}
      {showEditModal && editingDept && <DeptModal isEdit={true} dept={editingDept} onClose={() => setShowEditModal(false)} onSave={handleSaveModal} />}
    </div>
  );
}