import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from "recharts";
import { TrendingUp, AlertTriangle, CheckCircle, Activity, Building2, XCircle, Plus, ClipboardList, Wrench } from "lucide-react";
import { useAudit } from "../context/AuditContext";
import { Page } from "./Sidebar";

interface DashboardProps {
  onNavigate?: (page: Page) => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const { departments, audits, nonConformities, capas, loading } = useAudit();

  if (loading) {
    return (
      <div style={{ padding: "40px", textAlign: "center", color: "#64748b" }}>
        Loading real-time hospital quality metrics...
      </div>
    );
  }

  // Calculated Metrics
  const overallScore = departments.length > 0
    ? Math.round(departments.reduce((sum, d) => sum + (d.score || 80), 0) / departments.length)
    : 87;

  const openNCs = nonConformities.filter(n => n.status !== "Closed").length;
  const criticalNCs = nonConformities.filter(n => n.severity === "Critical" && n.status !== "Closed").length;
  const completedAudits = audits.filter(a => a.status === "Completed").length;
  const openCAPA = capas.filter(c => c.status !== "Closed").length;

  // Department Scores for Bar Chart
  const deptScores = departments.map(d => ({
    dept: d.name?.length > 8 ? d.name.substring(0, 8) + ".." : d.name || "Dept",
    score: d.score || 80,
  }));

  // NC Severity Pie Data
  const ncSeverity = [
    { name: "Critical", value: nonConformities.filter(n => n.severity === "Critical").length, color: "#EF4444" },
    { name: "Major", value: nonConformities.filter(n => n.severity === "Major").length, color: "#F59E0B" },
    { name: "Minor", value: nonConformities.filter(n => n.severity === "Minor").length, color: "#0066CC" },
  ].filter(item => item.value > 0);

  return (
    <div style={{ padding: "24px", background: "#f8fafc", minHeight: "100%" }}>
      {/* Header & Quick Action Buttons */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <h2 style={{ fontSize: "22px", fontWeight: 700, color: "#1e293b", margin: 0 }}>NABH Compliance Overview</h2>
          <p style={{ fontSize: "13px", color: "#64748b", margin: "4px 0 0" }}>Real-time hospital quality metrics • Connected to Audit Database</p>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          {onNavigate && (
            <>
              <button onClick={() => onNavigate("audits")} style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 14px", background: "#0066CC", color: "white", border: "none", borderRadius: "8px", fontSize: "12px", fontWeight: 600, cursor: "pointer" }}>
                <ClipboardList size={14} /> New Audit
              </button>
              <button onClick={() => onNavigate("nonconformity")} style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 14px", background: "#EF4444", color: "white", border: "none", borderRadius: "8px", fontSize: "12px", fontWeight: 600, cursor: "pointer" }}>
                <AlertTriangle size={14} /> Report NC
              </button>
              <button onClick={() => onNavigate("capa")} style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 14px", background: "#8b5cf6", color: "white", border: "none", borderRadius: "8px", fontSize: "12px", fontWeight: 600, cursor: "pointer" }}>
                <Wrench size={14} /> CAPA Actions
              </button>
            </>
          )}
        </div>
      </div>

      {/* Overall Score Banner */}
      <div style={{
        background: "linear-gradient(135deg, #0a1628 0%, #0066CC 100%)",
        borderRadius: "16px", padding: "24px 32px", marginBottom: "24px",
        display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "20px",
        boxShadow: "0 10px 25px rgba(0,102,204,0.2)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "32px", flexWrap: "wrap" }}>
          <div style={{ position: "relative", width: 110, height: 110 }}>
            <svg width="110" height="110" style={{ transform: "rotate(-90deg)" }}>
              <circle cx="55" cy="55" r="48" fill="none" stroke="#ffffff20" strokeWidth="12" />
              <circle cx="55" cy="55" r="48" fill="none" stroke="#4ade80" strokeWidth="12" strokeDasharray={`${(overallScore / 100) * 301.6} 301.6`} strokeLinecap="round" style={{ transition: "stroke-dasharray 0.8s ease-in-out" }} />
            </svg>
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
              <span style={{ fontSize: "32px", fontWeight: 800, color: "white" }}>{overallScore}%</span>
            </div>
          </div>
          <div>
            <div style={{ fontSize: "14px", color: "rgba(255,255,255,0.7)" }}>Hospital NABH Accreditation Index</div>
            <div style={{ fontSize: "38px", fontWeight: 800, color: "white", lineHeight: 1.1 }}>{overallScore}% Score</div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "8px" }}>
              <span style={{ background: "rgba(34,197,94,0.2)", color: "#4ade80", padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: 600 }}>↑ Continuous Improvement Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))", gap: "16px", marginBottom: "24px" }}>
        <KPICard title="Departments" value={departments.length} subtitle="Monitored" icon={Building2} color="#0066CC" />
        <KPICard title="Audits Completed" value={completedAudits} subtitle={`of ${audits.length} Total`} icon={CheckCircle} color="#22C55E" />
        <KPICard title="Open Non-Conformities" value={openNCs} subtitle="Require Action" icon={AlertTriangle} color="#F59E0B" />
        <KPICard title="Critical NC Issues" value={criticalNCs} subtitle="High Priority" icon={XCircle} color="#EF4444" />
        <KPICard title="Open CAPA" value={openCAPA} subtitle="Pending Closure" icon={Activity} color="#8b5cf6" />
        <KPICard title="Avg Dept Score" value={`${overallScore}%`} subtitle="Accreditation Benchmark" icon={TrendingUp} color="#0066CC" />
      </div>

      {/* Charts Section */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "16px" }}>
        {/* Department Scores Bar Chart */}
        <div style={{ background: "white", borderRadius: "12px", padding: "20px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #e2e8f0" }}>
          <h3 style={{ margin: "0 0 16px 0", fontSize: "15px", fontWeight: 700, color: "#1e293b" }}>Department Compliance Scores</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={deptScores}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="dept" tick={{ fontSize: 11 }} />
              <YAxis domain={[50, 100]} />
              <Tooltip formatter={(val) => [`${val}%`, "Score"]} />
              <Bar dataKey="score" fill="#0066CC" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* NC Severity Pie Chart */}
        <div style={{ background: "white", borderRadius: "12px", padding: "20px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #e2e8f0" }}>
          <h3 style={{ margin: "0 0 16px 0", fontSize: "15px", fontWeight: 700, color: "#1e293b" }}>Non-Conformity Severity Distribution</h3>
          {ncSeverity.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={ncSeverity} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="value">
                  {ncSeverity.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ padding: "60px 0", textAlign: "center", color: "#64748b", fontSize: "13px" }}>
              No non-conformities reported.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function KPICard({ title, value, subtitle, icon: Icon, color }: any) {
  return (
    <div style={{ background: "white", borderRadius: "12px", padding: "18px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #e2e8f0" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ fontSize: "12px", color: "#64748b", fontWeight: 500 }}>{title}</div>
          <div style={{ fontSize: "28px", fontWeight: 800, color, marginTop: "4px", lineHeight: 1 }}>{value}</div>
          <div style={{ fontSize: "11px", color: "#94a3b8", marginTop: "6px" }}>{subtitle}</div>
        </div>
        <div style={{ width: "42px", height: "42px", background: `${color}15`, borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Icon size={20} color={color} />
        </div>
      </div>
    </div>
  );
}