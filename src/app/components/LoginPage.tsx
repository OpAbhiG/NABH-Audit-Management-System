import { useState } from "react";
import { Eye, EyeOff, Shield, Hospital } from "lucide-react";

interface LoginPageProps {
  onLogin: (role: string) => void;
}

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
    await new Promise(r => setTimeout(r, 800));
    const user = DEMO_USERS.find(u => u.username === username && u.password === password);
    if (user) {
      onLogin(user.role);
    } else {
      setError("Invalid credentials. Try: nabh_coordinator / nabh123");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex" style={{ background: "linear-gradient(135deg, #0066CC 0%, #004499 50%, #002266 100%)" }}>
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center items-center p-16 text-white">
        <div className="max-w-md">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <Hospital size={36} className="text-white" />
            </div>
            <div>
              <h1 className="text-white" style={{ fontSize: "28px", fontWeight: 700, lineHeight: 1.2 }}>MediCare Hospital</h1>
              <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "14px" }}>Quality Management System</p>
            </div>
          </div>
          <h2 className="text-white mb-4" style={{ fontSize: "36px", fontWeight: 700, lineHeight: 1.3 }}>
            NABH Audit<br />Management Platform
          </h2>
          <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "16px", lineHeight: 1.7, marginBottom: "40px" }}>
            Enterprise-grade internal audit management for NABH accreditation.
            Track compliance, manage non-conformities, and drive continuous quality improvement.
          </p>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Departments", value: "20+" },
              { label: "NABH Chapters", value: "10" },
              { label: "Compliance Score", value: "87%" },
              { label: "Active Audits", value: "12" },
            ].map(stat => (
              <div key={stat.label} className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.1)", backdropFilter: "blur(10px)" }}>
                <div style={{ fontSize: "28px", fontWeight: 700, color: "#fff" }}>{stat.value}</div>
                <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.7)" }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8" style={{ background: "#f8fafc" }}>
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: "#0066CC" }}>
              <Hospital size={24} className="text-white" />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: "18px", color: "#1e293b" }}>MediCare Hospital</div>
              <div style={{ fontSize: "12px", color: "#64748b" }}>Quality Management System</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-2">
                <Shield size={20} style={{ color: "#0066CC" }} />
                <span style={{ fontSize: "13px", color: "#0066CC", fontWeight: 600 }}>SECURE LOGIN</span>
              </div>
              <h2 style={{ fontSize: "26px", fontWeight: 700, color: "#1e293b" }}>Welcome Back</h2>
              <p style={{ color: "#64748b", fontSize: "14px", marginTop: "4px" }}>Sign in to access your NABH audit dashboard</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label style={{ fontSize: "13px", fontWeight: 600, color: "#374151", display: "block", marginBottom: "6px" }}>
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  required
                  style={{
                    width: "100%", padding: "10px 14px", border: "1.5px solid #e2e8f0",
                    borderRadius: "8px", fontSize: "14px", outline: "none",
                    background: "#f8fafc", color: "#1e293b", boxSizing: "border-box"
                  }}
                  onFocus={e => e.target.style.borderColor = "#0066CC"}
                  onBlur={e => e.target.style.borderColor = "#e2e8f0"}
                />
              </div>

              <div>
                <label style={{ fontSize: "13px", fontWeight: 600, color: "#374151", display: "block", marginBottom: "6px" }}>
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
                      width: "100%", padding: "10px 42px 10px 14px", border: "1.5px solid #e2e8f0",
                      borderRadius: "8px", fontSize: "14px", outline: "none",
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
                    style={{ accentColor: "#0066CC", width: "15px", height: "15px" }}
                  />
                  <span style={{ fontSize: "13px", color: "#64748b" }}>Remember me</span>
                </label>
                <button type="button" style={{ fontSize: "13px", color: "#0066CC", fontWeight: 500, background: "none", border: "none", cursor: "pointer" }}>
                  Forgot Password?
                </button>
              </div>

              {error && (
                <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "8px", padding: "10px 14px", fontSize: "13px", color: "#dc2626" }}>
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%", padding: "12px", background: loading ? "#94a3b8" : "#0066CC",
                  color: "white", border: "none", borderRadius: "8px", cursor: loading ? "not-allowed" : "pointer",
                  fontWeight: 600, fontSize: "15px", transition: "background 0.2s"
                }}
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>

            <div style={{ marginTop: "24px", padding: "16px", background: "#f0f9ff", borderRadius: "10px", border: "1px solid #bae6fd" }}>
              <div style={{ fontSize: "12px", fontWeight: 600, color: "#0369a1", marginBottom: "8px" }}>Demo Credentials</div>
              <div className="grid grid-cols-2 gap-1">
                {DEMO_USERS.slice(0, 4).map(u => (
                  <button
                    key={u.username}
                    onClick={() => { setUsername(u.username); setPassword(u.password); }}
                    style={{ fontSize: "11px", color: "#0369a1", background: "white", border: "1px solid #bae6fd", borderRadius: "6px", padding: "4px 8px", cursor: "pointer", textAlign: "left" }}
                  >
                    {u.role}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <p style={{ textAlign: "center", marginTop: "24px", fontSize: "13px", color: "#94a3b8" }}>
            © 2026 MediCare Hospital. NABH Quality Management System v3.0
          </p>
        </div>
      </div>
    </div>
  );
}
