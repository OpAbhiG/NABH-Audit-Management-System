import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Download } from "lucide-react";
import { useAudit } from "../context/AuditContext";

export function Analytics() {
  const { departments, nonConformities, exportDataToCSV } = useAudit();

  const deptScores = departments.map(d => ({
    name: d.name?.substring(0, 10),
    score: d.score || 80
  }));

  const severityData = [
    { name: "Critical", value: nonConformities.filter(n => n.severity === "Critical").length, fill: "#EF4444" },
    { name: "Major", value: nonConformities.filter(n => n.severity === "Major").length, fill: "#F59E0B" },
    { name: "Minor", value: nonConformities.filter(n => n.severity === "Minor").length, fill: "#0066CC" },
  ].filter(item => item.value > 0);

  return (
    <div style={{ padding: "24px", background: "#f8fafc", minHeight: "100%" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <div>
          <h2 style={{ margin: 0, fontSize: "20px", fontWeight: 700, color: "#1e293b" }}>Analytics & Quality Reports</h2>
          <p style={{ margin: "4px 0 0", fontSize: "13px", color: "#64748b" }}>Comprehensive statistical breakdown of hospital accreditation metrics</p>
        </div>
        <button onClick={() => exportDataToCSV("departments")} style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 16px", background: "#0066CC", color: "white", border: "none", borderRadius: "8px", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>
          <Download size={14} /> Export Report CSV
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
        {/* Compliance by Department */}
        <div style={{ background: "white", borderRadius: "12px", padding: "20px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #e2e8f0" }}>
          <h3 style={{ margin: "0 0 16px 0", fontSize: "15px", color: "#1e293b" }}>Departmental Compliance Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={deptScores}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis domain={[0, 100]} />
              <Tooltip formatter={(v) => [`${v}%`, "Score"]} />
              <Bar dataKey="score" fill="#0066CC" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Severity Breakdown */}
        <div style={{ background: "white", borderRadius: "12px", padding: "20px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #e2e8f0" }}>
          <h3 style={{ margin: "0 0 16px 0", fontSize: "15px", color: "#1e293b" }}>Non-Conformity Severity Distribution</h3>
          {severityData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={severityData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                  {severityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ padding: "80px 0", textAlign: "center", color: "#64748b" }}>No non-conformity data recorded.</div>
          )}
        </div>
      </div>
    </div>
  );
}