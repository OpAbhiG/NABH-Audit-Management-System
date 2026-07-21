import { Award, AlertTriangle, CheckCircle2 } from "lucide-react";
import { useAudit } from "../context/AuditContext";

export function ManagementDashboard() {
  const { departments, nonConformities } = useAudit();

  const topDepts = [...departments].sort((a, b) => (b.score || 0) - (a.score || 0)).slice(0, 5);
  const criticalNCs = nonConformities.filter(n => n.severity === "Critical" && n.status !== "Closed");

  return (
    <div style={{ padding: "24px", background: "#f8fafc", minHeight: "100%" }}>
      {/* Banner */}
      <div style={{ background: "linear-gradient(135deg, #0a1628 0%, #0066CC 100%)", borderRadius: "16px", padding: "32px", color: "white", marginBottom: "24px", boxShadow: "0 10px 25px rgba(0,102,204,0.2)" }}>
        <h2 style={{ margin: 0, fontSize: "22px", fontWeight: 700 }}>Hospital Management Executive View</h2>
        <p style={{ margin: "6px 0 0", color: "rgba(255,255,255,0.7)", fontSize: "14px" }}>NABH Accreditation Readiness & Key Risk Indicators • Live Stream</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
        {/* Top Performers */}
        <div style={{ background: "white", borderRadius: "12px", padding: "20px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #e2e8f0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
            <Award color="#22C55E" size={20} />
            <h3 style={{ margin: 0, fontSize: "16px", color: "#1e293b" }}>Top Performing Departments</h3>
          </div>
          {topDepts.map((d, i) => (
            <div key={d.id || i} style={{ padding: "12px 0", borderBottom: i < topDepts.length - 1 ? "1px solid #eee" : "none", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ fontSize: "12px", fontWeight: 700, color: "#64748b", width: "20px" }}>#{i + 1}</span>
                <span style={{ fontSize: "13px", fontWeight: 600, color: "#1e293b" }}>{d.name}</span>
                <span style={{ fontSize: "11px", color: "#64748b", background: "#f1f5f9", padding: "2px 6px", borderRadius: "4px" }}>{d.category}</span>
              </div>
              <div style={{ fontWeight: 800, color: "#22C55E", fontSize: "14px" }}>{d.score}%</div>
            </div>
          ))}
        </div>

        {/* Critical Risk Issues */}
        <div style={{ background: "white", borderRadius: "12px", padding: "20px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #e2e8f0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
            <AlertTriangle color="#EF4444" size={20} />
            <h3 style={{ margin: 0, fontSize: "16px", color: "#1e293b" }}>Critical Open Risk Findings</h3>
          </div>
          {criticalNCs.length > 0 ? criticalNCs.slice(0, 5).map((nc, i) => (
            <div key={nc.id || i} style={{ padding: "12px 0", borderBottom: i < criticalNCs.length - 1 ? "1px solid #eee" : "none" }}>
              <div style={{ fontSize: "13px", fontWeight: 600, color: "#1e293b" }}>
                {nc.description} <span style={{ color: "#EF4444", fontSize: "12px" }}>({nc.dept})</span>
              </div>
              <div style={{ fontSize: "11px", color: "#64748b", marginTop: "4px" }}>
                Assigned: {nc.assignedTo} | Due: {nc.dueDate}
              </div>
            </div>
          )) : (
            <div style={{ padding: "40px 0", textAlign: "center", color: "#22C55E", fontSize: "14px" }}>
              <CheckCircle2 size={32} color="#22C55E" style={{ margin: "0 auto 8px" }} />
              <div>No active critical findings. Accreditation standards met!</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}