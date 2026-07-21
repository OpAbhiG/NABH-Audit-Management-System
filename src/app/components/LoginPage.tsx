import { useState } from "react";
import { Eye, EyeOff, Shield, CheckCircle2, Hospital, ArrowRight, Lock, UserCheck } from "lucide-react";

interface LoginPageProps {
  onLogin: (role: string) => void;
}

const LOGO_URL = "https://www.hvdeh.org/_next/image?url=%2Flogo.jpg&w=1080&q=75";

const DEMO_USERS = [
  { username: "nabh_coordinator", password: "nabh123", role: "NABH Coordinator", title: "Accreditation Lead" },
  { username: "quality_manager", password: "quality123", role: "Quality Manager", title: "QMS Department" },
  { username: "dept_head", password: "dept123", role: "Department Head", title: "Clinical HOD" },
  { username: "auditor", password: "audit123", role: "Auditor", title: "Internal Assessor" },
  { username: "ceo", password: "ceo123", role: "Hospital Management", title: "Executive Board" },
  { username: "staff", password: "staff123", role: "Staff Member", title: "Healthcare Staff" },
];

export function LoginPage({ onLogin }: LoginPageProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    const user = DEMO_USERS.find(u => u.username === username && u.password === password);
    if (user) {
      onLogin(user.role);
    } else {
      setError("Invalid credentials. Please click a demo role button below for instant login.");
    }
    setLoading(false);
  };

  const handleQuickLogin = (user: typeof DEMO_USERS[0]) => {
    setUsername(user.username);
    setPassword(user.password);
    onLogin(user.role);
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexWrap: "wrap", background: "#061325", fontFamily: "'Inter', system-ui, sans-serif" }}>
      
      {/* LEFT PANEL - Branding & Overview (50% Desktop, Stacked Mobile) */}
      <div
        style={{
          flex: "1 1 500px",
          minWidth: "320px",
          background: "linear-gradient(145deg, #040e1e 0%, #003366 50%, #004d99 100%)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "clamp(24px, 5vw, 64px)",
          position: "relative",
          overflow: "hidden",
          borderRight: "1px solid rgba(255, 255, 255, 0.08)",
        }}
      >
        {/* Background Subtle Glow Circles */}
        <div style={{ position: "absolute", top: "-10%", left: "-10%", width: "350px", height: "350px", borderRadius: "50%", background: "radial-gradient(circle, rgba(0,102,204,0.35) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "-10%", right: "-10%", width: "400px", height: "400px", borderRadius: "50%", background: "radial-gradient(circle, rgba(0,153,204,0.25) 0%, transparent 70%)", pointerEvents: "none" }} />

        <div style={{ maxWidth: "520px", width: "100%", margin: "0 auto", position: "relative", zIndex: 2 }}>
          
          {/* Logo Card */}
          <div style={{ marginBottom: "32px" }}>
            <div
              style={{
                display: "inline-block",
                background: "#ffffff",
                padding: "12px 24px",
                borderRadius: "16px",
                boxShadow: "0 15px 35px rgba(0, 0, 0, 0.35)",
                border: "2px solid rgba(255,255,255,0.8)",
              }}
            >
              <img
                src={LOGO_URL}
                alt="H V Desai Eye Hospital Logo"
                style={{
                  maxHeight: "75px",
                  maxWidth: "100%",
                  objectFit: "contain",
                  display: "block",
                }}
              />
            </div>
          </div>

          {/* Subtitle Badge */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(0,102,204,0.3)", padding: "6px 14px", borderRadius: "20px", border: "1px solid rgba(0,153,255,0.4)", marginBottom: "16px" }}>
            <Shield size={14} color="#60a5fa" />
            <span style={{ fontSize: "12px", color: "#93c5fd", fontWeight: 700, letterSpacing: "0.5px" }}>
              NABH 5TH EDITION ACCREDITATION PORTAL
            </span>
          </div>

          <h1 style={{ color: "#ffffff", fontSize: "clamp(26px, 3.5vw, 36px)", fontWeight: 800, lineHeight: 1.25, margin: "0 0 16px 0", letterSpacing: "-0.5px" }}>
            NABH Quality & Audit<br />Management System
          </h1>

          <p style={{ color: "#cbd5e1", fontSize: "14px", lineHeight: 1.7, marginBottom: "36px" }}>
            Enterprise internal quality assurance platform. Streamline clinical audits, manage non-conformities, evaluate compliance checklists, and automate CAPA workflows.
          </p>

          {/* Live System Stats Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(110px, 1fr))", gap: "12px" }}>
            {[
              { label: "Departments", value: "20+", icon: "🏢" },
              { label: "NABH Chapters", value: "10", icon: "📚" },
              { label: "Compliance Score", value: "87%", icon: "📊" },
              { label: "Active Audits", value: "12", icon: "📋" },
            ].map(stat => (
              <div
                key={stat.label}
                style={{
                  background: "rgba(255, 255, 255, 0.07)",
                  backdropFilter: "blur(10px)",
                  borderRadius: "12px",
                  padding: "14px 12px",
                  border: "1px solid rgba(255, 255, 255, 0.12)",
                  transition: "transform 0.2s",
                }}
                className="hover-card"
              >
                <div style={{ fontSize: "18px", marginBottom: "4px" }}>{stat.icon}</div>
                <div style={{ fontSize: "20px", fontWeight: 800, color: "#ffffff" }}>{stat.value}</div>
                <div style={{ fontSize: "11px", color: "#94a3b8", fontWeight: 500 }}>{stat.label}</div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: "36px", display: "flex", alignItems: "center", gap: "10px", color: "#94a3b8", fontSize: "12px" }}>
            <CheckCircle2 size={16} color="#22c55e" />
            <span>Encrypted 256-bit Audit Data Security</span>
          </div>

        </div>
      </div>

      {/* RIGHT PANEL - Login Form & Quick Access (50% Desktop, Stacked Mobile) */}
      <div
        style={{
          flex: "1 1 450px",
          minWidth: "320px",
          background: "#f8fafc",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "clamp(24px, 5vw, 64px)",
        }}
      >
        <div style={{ width: "100%", maxWidth: "440px" }}>
          
          {/* Main Card */}
          <div
            style={{
              background: "#ffffff",
              borderRadius: "20px",
              boxShadow: "0 20px 40px rgba(0, 51, 102, 0.08)",
              padding: "clamp(24px, 4vw, 36px)",
              border: "1px solid #e2e8f0",
            }}
            className="modal-content"
          >
            <div style={{ marginBottom: "28px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#004d99", fontSize: "12px", fontWeight: 700, letterSpacing: "0.5px", marginBottom: "4px" }}>
                <Lock size={14} /> SYSTEM ACCESS
              </div>
              <h2 style={{ fontSize: "24px", fontWeight: 800, color: "#0f172a", margin: 0 }}>
                Sign In to Account
              </h2>
              <p style={{ fontSize: "13px", color: "#64748b", marginTop: "4px", margin: 0 }}>
                Enter your credentials or select a quick demo role
              </p>
            </div>

            <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
              <div>
                <label style={{ fontSize: "12px", fontWeight: 700, color: "#334155", display: "block", marginBottom: "6px" }}>
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="e.g., quality_manager"
                  required
                  style={{
                    width: "100%", padding: "12px 14px", border: "1.5px solid #cbd5e1",
                    borderRadius: "10px", fontSize: "13px", outline: "none",
                    background: "#f8fafc", color: "#0f172a", boxSizing: "border-box",
                    transition: "border-color 0.2s"
                  }}
                  onFocus={e => e.target.style.borderColor = "#004d99"}
                  onBlur={e => e.target.style.borderColor = "#cbd5e1"}
                />
              </div>

              <div>
                <label style={{ fontSize: "12px", fontWeight: 700, color: "#334155", display: "block", marginBottom: "6px" }}>
                  Password
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Enter password"
                    required
                    style={{
                      width: "100%", padding: "12px 42px 12px 14px", border: "1.5px solid #cbd5e1",
                      borderRadius: "10px", fontSize: "13px", outline: "none",
                      background: "#f8fafc", color: "#0f172a", boxSizing: "border-box",
                      transition: "border-color 0.2s"
                    }}
                    onFocus={e => e.target.style.borderColor = "#004d99"}
                    onBlur={e => e.target.style.borderColor = "#cbd5e1"}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#94a3b8", padding: 0 }}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={e => setRememberMe(e.target.checked)}
                    style={{ accentColor: "#004d99", width: "14px", height: "14px" }}
                  />
                  <span style={{ fontSize: "12px", color: "#64748b" }}>Remember credentials</span>
                </label>
                <button type="button" style={{ fontSize: "12px", color: "#004d99", fontWeight: 600, background: "none", border: "none", cursor: "pointer" }}>
                  Forgot Password?
                </button>
              </div>

              {error && (
                <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "10px", padding: "10px 14px", fontSize: "12px", color: "#dc2626" }}>
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%", padding: "13px", background: loading ? "#94a3b8" : "linear-gradient(135deg, #003366 0%, #0055b3 100%)",
                  color: "white", border: "none", borderRadius: "10px", cursor: loading ? "not-allowed" : "pointer",
                  fontWeight: 700, fontSize: "14px", transition: "all 0.2s ease",
                  boxShadow: "0 4px 14px rgba(0, 51, 102, 0.25)", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px"
                }}
              >
                {loading ? "Signing in..." : <>Sign In to Portal <ArrowRight size={16} /></>}
              </button>
            </form>

            {/* Quick One-Click Role Access */}
            <div style={{ marginTop: "24px", paddingTop: "20px", borderTop: "1px solid #f1f5f9" }}>
              <div style={{ fontSize: "11px", fontWeight: 700, color: "#004d99", marginBottom: "12px", textTransform: "uppercase", letterSpacing: "0.5px", display: "flex", alignItems: "center", gap: "6px" }}>
                <UserCheck size={14} /> One-Click Quick Sign In
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                {DEMO_USERS.map(u => (
                  <button
                    key={u.username}
                    onClick={() => handleQuickLogin(u)}
                    style={{
                      padding: "8px 10px",
                      background: "#f0f7ff",
                      border: "1px solid #bae6fd",
                      borderRadius: "8px",
                      textAlign: "left",
                      cursor: "pointer",
                      transition: "all 0.15s",
                    }}
                    className="hover-card"
                  >
                    <div style={{ fontSize: "11px", fontWeight: 700, color: "#004d99" }}>{u.role}</div>
                    <div style={{ fontSize: "10px", color: "#64748b" }}>{u.title}</div>
                  </button>
                ))}
              </div>
            </div>

          </div>

          <p style={{ textAlign: "center", marginTop: "24px", fontSize: "12px", color: "#94a3b8" }}>
            © 2026 NABH Quality & Audit Management Portal v3.0
          </p>

        </div>
      </div>

    </div>
  );
}
