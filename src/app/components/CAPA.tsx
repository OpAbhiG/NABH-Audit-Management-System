import { useState } from "react";
import { Plus, Search, CheckCircle, Clock, X, Wrench } from "lucide-react";
import { useAudit } from "../context/AuditContext";
import { CAPA } from "../types/audit";

export function CAPAModule() {
  const { capas, saveCAPA, updateCAPAStatus } = useAudit();
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState("All");

  const [newCAPA, setNewCAPA] = useState({
    ncId: "",
    action: "",
    responsible: "",
    dueDate: new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10),
    status: "Open" as const,
  });

  const filtered = capas.filter(c => {
    const matchSearch = c.action.toLowerCase().includes(search.toLowerCase()) || c.responsible.toLowerCase().includes(search.toLowerCase()) || c.id.toLowerCase().includes(search.toLowerCase()) || c.ncId.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "All" || c.status === filter;
    return matchSearch && matchFilter;
  });

  const handleAddCAPA = async () => {
    if (!newCAPA.action || !newCAPA.responsible) {
      alert("Action description and Responsible person are required!");
      return;
    }

    await saveCAPA({
      ncId: newCAPA.ncId || "NC-General",
      action: newCAPA.action,
      responsible: newCAPA.responsible,
      dueDate: newCAPA.dueDate,
      status: newCAPA.status,
    });

    setNewCAPA({ ncId: "", action: "", responsible: "", dueDate: new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10), status: "Open" });
    setShowModal(false);
  };

  return (
    <div style={{ padding: "24px", background: "#f8fafc", minHeight: "100%" }}>
      {/* Top Banner */}
      <div style={{ background: "white", borderRadius: "12px", padding: "20px", marginBottom: "20px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #e2e8f0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "#8b5cf615", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Wrench size={20} color="#8b5cf6" />
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: "18px", color: "#1e293b", fontWeight: 700 }}>Corrective & Preventive Action (CAPA)</h2>
            <p style={{ color: "#64748b", fontSize: "13px", margin: "2px 0 0" }}>Track corrective actions logged against non-conformity findings</p>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div style={{ display: "flex", gap: "12px", marginBottom: "20px", flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ position: "relative", flex: 1, minWidth: "220px" }}>
          <Search size={15} style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search CAPA actions, responsible officers..."
            style={{ width: "100%", padding: "10px 12px 10px 32px", border: "1px solid #cbd5e1", borderRadius: "8px", fontSize: "13px", background: "white", outline: "none", boxSizing: "border-box" }}
          />
        </div>
        <div style={{ display: "flex", gap: "6px" }}>
          {["All", "Open", "In Progress", "Closed"].map(s => (
            <button key={s} onClick={() => setFilter(s)} style={{ padding: "8px 14px", borderRadius: "6px", fontSize: "12px", border: filter === s ? "none" : "1px solid #cbd5e1", background: filter === s ? "#8b5cf6" : "white", color: filter === s ? "white" : "#64748b", cursor: "pointer", fontWeight: 600 }}>{s}</button>
          ))}
        </div>
        <button onClick={() => setShowModal(true)} style={{ padding: "10px 20px", background: "#8b5cf6", color: "white", border: "none", borderRadius: "8px", fontSize: "13px", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}>
          <Plus size={16} /> New CAPA Action
        </button>
      </div>

      {/* CAPA Cards List */}
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {filtered.map(capa => (
          <div key={capa.id} style={{ background: "white", padding: "20px", borderRadius: "12px", borderLeft: "5px solid #8b5cf6", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #e2e8f0" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "16px" }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ fontWeight: 700, color: "#8b5cf6", fontSize: "13px" }}>{capa.id}</span>
                  <span style={{ fontSize: "11px", background: "#f3e8ff", color: "#7e22ce", padding: "2px 8px", borderRadius: "6px", fontWeight: 600 }}>NC Ref: {capa.ncId}</span>
                  <span style={{ fontSize: "11px", color: "#94a3b8" }}>Created: {capa.created}</span>
                </div>
                <div style={{ margin: "8px 0", fontSize: "14px", fontWeight: 600, color: "#1e293b", lineHeight: 1.4 }}>{capa.action}</div>
                <div style={{ color: "#64748b", fontSize: "12px" }}>
                  Responsible: <strong style={{ color: "#374151" }}>{capa.responsible}</strong> | Target Completion: <strong>{capa.dueDate}</strong>
                </div>
                {capa.verificationNotes && (
                  <div style={{ marginTop: "6px", fontSize: "11px", color: "#22C55E", background: "#f0fdf4", padding: "4px 8px", borderRadius: "4px", width: "fit-content" }}>
                    ✓ {capa.verificationNotes}
                  </div>
                )}
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <select
                  value={capa.status}
                  onChange={(e) => updateCAPAStatus(capa.id, e.target.value as any)}
                  style={{
                    padding: "6px 12px", borderRadius: "6px", fontSize: "12px", fontWeight: 600,
                    border: "1px solid #cbd5e1",
                    background: capa.status === "Closed" ? "#f0fdf4" : capa.status === "In Progress" ? "#eff6ff" : "#fffbeb",
                    color: capa.status === "Closed" ? "#22C55E" : capa.status === "In Progress" ? "#0066CC" : "#F59E0B",
                    cursor: "pointer"
                  }}
                >
                  <option value="Open">Status: Open</option>
                  <option value="In Progress">Status: In Progress</option>
                  <option value="Closed">Status: Closed</option>
                </select>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px", color: "#64748b", background: "white", borderRadius: "12px" }}>
            No CAPA records found matching your filter criteria.
          </div>
        )}
      </div>

      {/* New CAPA Modal */}
      {showModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
          <div style={{ background: "white", padding: "28px", borderRadius: "16px", width: "500px", maxWidth: "100%", boxShadow: "0 25px 50px rgba(0,0,0,0.2)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h3 style={{ margin: 0, fontSize: "17px" }}>New CAPA Action</h3>
              <button onClick={() => setShowModal(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8" }}><X size={18} /></button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <input placeholder="NC Reference ID (e.g., NC-001)" value={newCAPA.ncId} onChange={e => setNewCAPA({ ...newCAPA, ncId: e.target.value })} style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "13px", boxSizing: "border-box" }} />
              <textarea placeholder="Corrective & Preventive Action Description..." value={newCAPA.action} onChange={e => setNewCAPA({ ...newCAPA, action: e.target.value })} rows={3} style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "13px", resize: "vertical", boxSizing: "border-box" }} />
              <input placeholder="Responsible Person / Officer" value={newCAPA.responsible} onChange={e => setNewCAPA({ ...newCAPA, responsible: e.target.value })} style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "13px", boxSizing: "border-box" }} />
              <input type="date" value={newCAPA.dueDate} onChange={e => setNewCAPA({ ...newCAPA, dueDate: e.target.value })} style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "13px", boxSizing: "border-box" }} />
            </div>

            <div style={{ marginTop: "20px", display: "flex", gap: "12px" }}>
              <button onClick={() => setShowModal(false)} style={{ flex: 1, padding: "10px", background: "#f1f5f9", border: "none", borderRadius: "8px", cursor: "pointer" }}>Cancel</button>
              <button onClick={handleAddCAPA} style={{ flex: 1, padding: "10px", background: "#8b5cf6", color: "white", border: "none", borderRadius: "8px", fontWeight: 600, cursor: "pointer" }}>Create CAPA</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}