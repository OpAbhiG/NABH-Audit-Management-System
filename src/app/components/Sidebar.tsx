import { useState } from "react";
import {
  LayoutDashboard, Building2, ClipboardList, BookOpen, AlertTriangle,
  Wrench, BarChart3, ChevronLeft, ChevronRight, LogOut,
  User, Bell, TrendingUp, Settings, X
} from "lucide-react";
import { useAudit } from "../context/AuditContext";
import { toast } from "sonner";

export type Page =
  | "dashboard"
  | "departments"
  | "audits"
  | "checklist"
  | "nonconformity"
  | "capa"
  | "analytics"
  | "management";

interface SidebarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  userRole: string;
  onLogout: () => void;
}

const LOGO_URL = "https://www.hvdeh.org/_next/image?url=%2Flogo.jpg&w=1080&q=75";

export function Sidebar({ currentPage, onNavigate, userRole, onLogout }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const { departments, audits, nonConformities, capas } = useAudit();

  const openNCs = nonConformities.filter(n => n.status !== "Closed").length;
  const openCAPAs = capas.filter(c => c.status !== "Closed").length;

  const NAV_ITEMS: { id: Page; label: string; icon: React.ElementType; badge?: number }[] = [
    { id: "dashboard", label: "Executive Dashboard", icon: LayoutDashboard },
    { id: "departments", label: "Departments", icon: Building2, badge: departments.length },
    { id: "audits", label: "Audit Management", icon: ClipboardList, badge: audits.length },
    { id: "checklist", label: "NABH Checklist", icon: BookOpen },
    { id: "nonconformity", label: "Non-Conformities", icon: AlertTriangle, badge: openNCs },
    { id: "capa", label: "CAPA Module", icon: Wrench, badge: openCAPAs },
    { id: "analytics", label: "Analytics & Reports", icon: BarChart3 },
    { id: "management", label: "Management View", icon: TrendingUp },
  ];

  return (
    <div
      style={{
        width: collapsed ? "72px" : "260px",
        minHeight: "100vh",
        background: "#0a1628",
        display: "flex",
        flexDirection: "column",
        transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
        flexShrink: 0,
        position: "relative",
        zIndex: 10,
        boxShadow: "4px 0 20px rgba(0,0,0,0.12)",
      }}
    >
      {/* Header Logo */}
      <div style={{
        padding: collapsed ? "20px 16px" : "20px 18px",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        display: "flex",
        alignItems: "center",
        gap: "12px",
        overflow: "hidden",
      }}>
        <img
          src={LOGO_URL}
          alt="H V Desai Eye Hospital Logo"
          style={{
            width: "36px", height: "36px", borderRadius: "50%",
            objectFit: "cover", flexShrink: 0, border: "2px solid #0066CC",
            background: "white", padding: "1px", boxShadow: "0 4px 12px rgba(0,102,204,0.3)"
          }}
          onError={(e) => {
            // Fallback if image fails to load
            (e.target as HTMLElement).style.display = "none";
          }}
        />
        {!collapsed && (
          <div style={{ overflow: "hidden" }}>
            <div style={{ fontSize: "13px", fontWeight: 700, color: "white", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>HV Desai Eye Hospital</div>
            <div style={{ fontSize: "10px", color: "#60a5fa", fontWeight: 600, whiteSpace: "nowrap" }}>NABH Quality System v3.0</div>
          </div>
        )}
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        style={{
          position: "absolute", top: "24px", right: "-12px",
          width: "24px", height: "24px", borderRadius: "50%",
          background: "#0066CC", border: "2px solid #0a1628",
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", zIndex: 20, color: "white",
          boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
          transition: "transform 0.2s"
        }}
        title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>

      {/* Nav Menu */}
      <nav style={{ flex: 1, padding: "12px 0", overflowY: "auto" }}>
        {!collapsed && (
          <div style={{ padding: "8px 20px 6px", fontSize: "10px", fontWeight: 600, color: "rgba(255,255,255,0.35)", letterSpacing: "1px", textTransform: "uppercase" }}>
            Main Navigation
          </div>
        )}
        {NAV_ITEMS.map(item => {
          const Icon = item.icon;
          const active = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              style={{
                width: "100%", display: "flex", alignItems: "center",
                gap: "12px", padding: collapsed ? "12px 18px" : "10px 20px",
                background: active ? "rgba(0,102,204,0.25)" : "transparent",
                border: "none", cursor: "pointer",
                borderLeft: active ? "3px solid #0066CC" : "3px solid transparent",
                transition: "all 0.15s ease", position: "relative",
                justifyContent: collapsed ? "center" : "flex-start",
              }}
              title={collapsed ? item.label : undefined}
            >
              <Icon size={18} color={active ? "#60a5fa" : "rgba(255,255,255,0.55)"} style={{ flexShrink: 0 }} />
              {!collapsed && (
                <>
                  <span style={{ fontSize: "13px", color: active ? "#ffffff" : "rgba(255,255,255,0.65)", fontWeight: active ? 600 : 400, flex: 1, textAlign: "left", whiteSpace: "nowrap" }}>
                    {item.label}
                  </span>
                  {Boolean(item.badge) && (
                    <span style={{
                      fontSize: "10px", fontWeight: 700,
                      background: active ? "#0066CC" : "rgba(255,255,255,0.12)",
                      color: active ? "white" : "#94a3b8",
                      borderRadius: "10px", padding: "2px 7px", minWidth: "20px", textAlign: "center"
                    }}>
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </button>
          );
        })}
      </nav>

      {/* User Footer (Left Bottom) */}
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", padding: "12px" }}>
        {!collapsed && (
          <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px", borderRadius: "10px", background: "rgba(255,255,255,0.05)", marginBottom: "8px" }}>
            <div style={{ width: "34px", height: "34px", borderRadius: "50%", background: "#0066CC", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontWeight: 700, color: "white", fontSize: "12px" }}>
              {userRole.slice(0, 2).toUpperCase()}
            </div>
            <div style={{ overflow: "hidden" }}>
              <div style={{ fontSize: "12px", fontWeight: 600, color: "white", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{userRole}</div>
              <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.4)" }}>Logged In User</div>
            </div>
          </div>
        )}
        <button
          onClick={onLogout}
          style={{
            width: "100%", display: "flex", alignItems: "center", justifyContent: collapsed ? "center" : "flex-start",
            gap: "10px", padding: "8px 10px", background: "transparent", border: "none",
            cursor: "pointer", borderRadius: "8px", color: "rgba(255,255,255,0.45)",
            transition: "all 0.15s"
          }}
          onMouseEnter={e => (e.currentTarget.style.background = "rgba(239,68,68,0.15)")}
          onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
        >
          <LogOut size={16} />
          {!collapsed && <span style={{ fontSize: "13px" }}>Sign Out</span>}
        </button>
      </div>
    </div>
  );
}

interface TopBarProps {
  page: Page;
  userRole: string;
}

const PAGE_TITLES: Record<Page, string> = {
  dashboard: "Executive Dashboard",
  departments: "Department Management",
  audits: "Audit Management",
  checklist: "NABH Checklist Library",
  nonconformity: "Non-Conformity Tracker",
  capa: "CAPA Module",
  analytics: "Analytics & Reports",
  management: "Management View",
};

export function TopBar({ page }: TopBarProps) {
  const [showNotifs, setShowNotifs] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const { notifications, markNotificationRead, exportDataToCSV } = useAudit();
  const unreadCount = notifications.filter(n => !n.read).length;

  const today = new Date().toLocaleDateString("en-IN", { weekday: "short", year: "numeric", month: "short", day: "numeric" });

  return (
    <header style={{
      height: "60px", background: "white", borderBottom: "1px solid #e2e8f0",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0 24px", flexShrink: 0, gap: "16px", zIndex: 5, position: "relative"
    }}>
      <div>
        <h1 style={{ fontSize: "18px", fontWeight: 700, color: "#1e293b", margin: 0 }}>{PAGE_TITLES[page]}</h1>
        <div style={{ fontSize: "11px", color: "#64748b", fontWeight: 500 }}>{today} • NABH 5th Edition Accreditation</div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
        {/* Notifications Button */}
        <div style={{ position: "relative" }}>
          <button
            onClick={() => setShowNotifs(!showNotifs)}
            style={{
              position: "relative", background: "#f1f5f9", border: "none", borderRadius: "8px",
              width: "36px", height: "36px", display: "flex", alignItems: "center",
              justifyContent: "center", cursor: "pointer", color: "#64748b", transition: "all 0.15s"
            }}
            title="Notifications"
          >
            <Bell size={16} />
            {unreadCount > 0 && (
              <span style={{
                position: "absolute", top: "6px", right: "6px", width: "8px", height: "8px",
                borderRadius: "50%", background: "#EF4444", border: "2px solid white"
              }} />
            )}
          </button>

          {/* Notifications Drawer */}
          {showNotifs && (
            <div style={{
              position: "absolute", right: 0, top: "46px", width: "320px", background: "white",
              borderRadius: "12px", boxShadow: "0 10px 30px rgba(0,0,0,0.15)", border: "1px solid #e2e8f0",
              zIndex: 100, padding: "16px"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                <h4 style={{ margin: 0, fontSize: "14px", fontWeight: 700, color: "#1e293b" }}>Notifications</h4>
                <button onClick={() => setShowNotifs(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8" }}><X size={16} /></button>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", maxHeight: "280px", overflowY: "auto" }}>
                {notifications.map(n => (
                  <div
                    key={n.id}
                    onClick={() => markNotificationRead(n.id)}
                    style={{
                      padding: "10px", borderRadius: "8px", background: n.read ? "#f8fafc" : "#eff6ff",
                      borderLeft: `3px solid ${n.type === "alert" ? "#EF4444" : n.type === "success" ? "#22C55E" : "#0066CC"}`,
                      cursor: "pointer"
                    }}
                  >
                    <div style={{ fontSize: "12px", fontWeight: 600, color: "#1e293b" }}>{n.title}</div>
                    <div style={{ fontSize: "11px", color: "#64748b", marginTop: "2px" }}>{n.message}</div>
                    <div style={{ fontSize: "10px", color: "#94a3b8", marginTop: "4px" }}>{n.time}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Settings Button */}
        <button
          onClick={() => setShowSettings(true)}
          style={{ background: "#f1f5f9", border: "none", borderRadius: "8px", width: "36px", height: "36px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#64748b" }}
          title="Settings"
        >
          <Settings size={16} />
        </button>

        {/* Top Right Hospital Logo & Branding Avatar (Replaced duplicate userRole) */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", paddingLeft: "12px", borderLeft: "1px solid #e2e8f0" }}>
          <img
            src={LOGO_URL}
            alt="H V Desai Eye Hospital Logo"
            style={{
              width: "36px", height: "36px", borderRadius: "50%",
              objectFit: "cover", border: "2px solid #0066CC", background: "white", padding: "1px",
              boxShadow: "0 2px 8px rgba(0,102,204,0.2)"
            }}
          />
          <div>
            <div style={{ fontSize: "12px", fontWeight: 700, color: "#1e293b", lineHeight: 1.2 }}>H V Desai Eye Hospital</div>
            <div style={{ fontSize: "10px", color: "#0066CC", fontWeight: 600 }}>NABH Quality System</div>
          </div>
        </div>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
          <div style={{ background: "white", borderRadius: "16px", width: "450px", padding: "24px", boxShadow: "0 20px 40px rgba(0,0,0,0.2)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h3 style={{ margin: 0, fontSize: "17px", fontWeight: 700 }}>System Settings & Utilities</h3>
              <button onClick={() => setShowSettings(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8" }}><X size={18} /></button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ background: "#f8fafc", padding: "12px", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                <div style={{ fontSize: "13px", fontWeight: 600, color: "#1e293b" }}>Export System Data</div>
                <div style={{ fontSize: "11px", color: "#64748b", marginBottom: "10px" }}>Download live compliance metrics as CSV files</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                  <button onClick={() => exportDataToCSV("departments")} style={{ padding: "6px 10px", background: "white", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "12px", cursor: "pointer" }}>Departments CSV</button>
                  <button onClick={() => exportDataToCSV("audits")} style={{ padding: "6px 10px", background: "white", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "12px", cursor: "pointer" }}>Audits CSV</button>
                  <button onClick={() => exportDataToCSV("nc")} style={{ padding: "6px 10px", background: "white", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "12px", cursor: "pointer" }}>NC Findings CSV</button>
                  <button onClick={() => exportDataToCSV("capa")} style={{ padding: "6px 10px", background: "white", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "12px", cursor: "pointer" }}>CAPA Actions CSV</button>
                </div>
              </div>

              <div style={{ background: "#f8fafc", padding: "12px", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                <div style={{ fontSize: "13px", fontWeight: 600, color: "#1e293b" }}>Hospital Organization</div>
                <div style={{ fontSize: "12px", color: "#64748b", marginTop: "4px" }}>PBMA's H V Desai Eye Hospital • NABH Accredited</div>
              </div>
            </div>

            <button onClick={() => { setShowSettings(false); toast.success("Settings updated"); }} style={{ width: "100%", marginTop: "20px", padding: "10px", background: "#0066CC", color: "white", border: "none", borderRadius: "8px", fontWeight: 600, cursor: "pointer" }}>
              Close Settings
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
