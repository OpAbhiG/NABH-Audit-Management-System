import { useState } from "react";
import { Eye, EyeOff, Shield, CheckCircle2 } from "lucide-react";

interface LoginPageProps {
  onLogin: (role: string) => void;
}

const LOGO_URL = "https://www.hvdeh.org/_next/image?url=%2Flogo.jpg&w=1080&q=75";

const DEMO_USERS = [
  { username: "nabh_coordinator", password: "nabh123", role: "NABH Coordinator" },
  { username: "quality_manager", password: "quality123", role: "Quality Manager" },
  { username: "dept_head", password: "dept123", role: "Department Head" },
  { username: "auditor", password: "audit123", role: "Auditor" },
  { username: "ceo", password: "ceo123", role: "Hospital Management" },
  { username: "staff", password: "staff123", role: "Staff Member" },
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
      setError("Invalid credentials. Please select a demo account below.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row" style={{ background: "linear-gradient(135deg, #0a1628 0%, #0066CC 50%, #003388 100%)" }}>
      {/* Left Panel - Hero Branding */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center items-start p-16 text-white">
        <div className="max-w-md">
          {/* Hospital Logo Image cleanly displayed */}
          <div className="mb-8">
            <img
              src={LOGO_URL}
              alt="Hospital Logo"
              style={{
                maxHeight: "80px",
                maxWidth: "300px",
                objectFit: "contain",
                background: "white",
                padding: "10px 18px",
                borderRadius: "12px",
                boxShadow: "0 12px 30px rgba(0,0,0,0.3)"
              }}
            />
          </div>

          <h1 className="text-white mb-4" style={{ fontSize: "36px", fontWeight: 800, lineHeight: 1.25 }}>
            NABH Quality & Audit<br />Management Platform
          </h1>
          
          <p style={{ color: "rgba(255,255,255,0.85)", fontSize: "15px", lineHeight: 1.7, marginBottom: "36px" }}>
            Comprehensive internal audit management system complying with NABH 5th Edition Standards.
            Monitor departmental performance, evaluate compliance checklists, track non-conformities, and manage CAPA resolution workflows.
          </p>

          <div className="grid grid-cols-2 gap-4 w-full">
            {[
              { label: "Departments", value: "20+" },
              { label: "NABH Chapters", value: "10" },
              { label: "Compliance Score", value: "87%" },
              { label: "Active Audits", value: "12" },
            ].map(stat => (
              <div key={stat.label} className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.1)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.18)" }}>
                <div style={{ fontSize: "26px", fontWeight: 800, color: "#fff" }}>{stat.value}</div>
                <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.75)", fontWeight: 500 }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form Container */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12" style={{ background: "#f8fafc" }}>
        <div className="w-full max-w-md">
          {/* Mobile Header Logo */}
          <div className="lg:hidden flex justify-center mb-6">
            <img
              src={LOGO_URL}
              alt="Hospital Logo"
              style={{
                maxHeight: "60px",
                maxWidth: "240px",
                objectFit: "contain",
                background: "white",
                padding: "8px 16px",
                borderRadius: "10px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
              }}
            />
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-100 modal-content">
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <Shield size={18} style={{ color: "#0066CC" }} />
                <span style={{ fontSize: "12px", color: "#0066CC", fontWeight: 700, letterSpacing: "0.5px" }}>SECURE LOGIN PORTAL</span>
              </div>
              <h2 style={{ fontSize: "24px", fontWeight: 800, color: "#1e293b", margin: 0 }}>Welcome Back</h2>
              <p style={{ color: "#64748b", fontSize: "13px", marginTop: "4px", margin: 0 }}>Sign in to access your NABH audit dashboard</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label style={{ fontSize: "12px", fontWeight: 600, color: "#374151", display: "block", marginBottom: "6px" }}>
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  required
                  style={{
                    width: "100%", padding: "11px 14px", border: "1.5px solid #e2e8f0",
                    borderRadius: "8px", fontSize: "13px", outline: "none",
                    background: "#f8fafc", color: "#1e293b", boxSizing: "border-box"
                  }}
                  onFocus={e => e.target.style.borderColor = "#0066CC"}
                  onBlur={e => e.target.style.borderColor = "#e2e8f0"}
                />
              </div>

              <div>
                <label style={{ fontSize: "12px", fontWeight: 600, color: "#374151", display: "block", marginBottom: "6px" }}>
                  Password
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    style={{
                      width: "100%", padding: "11px 42px 11px 14px", border: "1.5px solid #e2e8f0",
                      borderRadius: "8px", fontSize: "13px", outline: "none",
                      background: "#f8fafc", color: "#1e293b", boxSizing: "border-box"
                    }}
                    onFocus={e => e.target.style.borderColor = "#0066CC"}
                    onBlur={e => e.target.style.borderColor = "#e2e8f0"}
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

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={e => setRememberMe(e.target.checked)}
                    style={{ accentColor: "#0066CC", width: "14px", height: "14px" }}
                  />
                  <span style={{ fontSize: "12px", color: "#64748b" }}>Remember me</span>
                </label>
                <button type="button" style={{ fontSize: "12px", color: "#0066CC", fontWeight: 600, background: "none", border: "none", cursor: "pointer" }}>
                  Forgot Password?
                </button>
              </div>

              {error && (
                <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "8px", padding: "10px 14px", fontSize: "12px", color: "#dc2626" }}>
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%", padding: "12px", background: loading ? "#94a3b8" : "#0066CC",
                  color: "white", border: "none", borderRadius: "8px", cursor: loading ? "not-allowed" : "pointer",
                  fontWeight: 700, fontSize: "14px", transition: "all 0.2s ease"
                }}
              >
                {loading ? "Authenticating..." : "Sign In to Portal"}
              </button>
            </form>

            <div style={{ marginTop: "24px", padding: "16px", background: "#f0f9ff", borderRadius: "12px", border: "1px solid #bae6fd" }}>
              <div style={{ fontSize: "11px", fontWeight: 700, color: "#0369a1", marginBottom: "10px", textTransform: "uppercase", letterSpacing: "0.5px", display: "flex", alignItems: "center", gap: "4px" }}>
                <CheckCircle2 size={13} /> Quick Demo Sign In Roles
              </div>
              <div className="grid grid-cols-2 gap-2">
                {DEMO_USERS.slice(0, 4).map(u => (
                  <button
                    key={u.username}
                    onClick={() => { setUsername(u.username); setPassword(u.password); }}
                    style={{ fontSize: "11px", color: "#0369a1", background: "white", border: "1px solid #bae6fd", borderRadius: "6px", padding: "6px 10px", cursor: "pointer", textAlign: "left", fontWeight: 600, transition: "all 0.15s" }}
                  >
                    {u.role}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <p style={{ textAlign: "center", marginTop: "24px", fontSize: "12px", color: "#94a3b8" }}>
            © 2026 NABH Quality & Accreditation Portal v3.0
          </p>
        </div>
      </div>
    </div>
  );
}
