import { useState } from "react";
import { LoginPage } from "./components/LoginPage";
import { Sidebar, TopBar, type Page } from "./components/Sidebar";
import { Dashboard } from "./components/Dashboard";
import { Departments } from "./components/Departments";
import { AuditManagement } from "./components/AuditManagement";
import { NABHChecklist } from "./components/NABHChecklist";
import { NonConformity } from "./components/NonConformity";
import { CAPAModule } from "./components/CAPA";
import { Analytics } from "./components/Analytics";
import { ManagementDashboard } from "./components/ManagementDashboard";
import { AuditProvider, useAudit } from "./context/AuditContext";
import { Toaster } from "sonner";

function MainAppContent() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState<Page>("dashboard");
  const { userRole, setUserRole } = useAudit();

  const handleLogin = (role: string) => {
    setUserRole(role);
    setIsLoggedIn(true);
    if (role === "Hospital Management") {
      setCurrentPage("management");
    } else if (role === "Auditor") {
      setCurrentPage("audits");
    } else {
      setCurrentPage("dashboard");
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole("Quality Manager");
    setCurrentPage("dashboard");
  };

  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <Dashboard onNavigate={setCurrentPage} />;
      case "departments":
        return <Departments />;
      case "audits":
        return <AuditManagement />;
      case "checklist":
        return <NABHChecklist onNavigate={setCurrentPage} />;
      case "nonconformity":
        return <NonConformity onNavigate={setCurrentPage} />;
      case "capa":
        return <CAPAModule />;
      case "analytics":
        return <Analytics />;
      case "management":
        return <ManagementDashboard />;
      default:
        return <Dashboard onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden", background: "#f8fafc", fontFamily: "'Inter', system-ui, -apple-system, sans-serif" }}>
      <Sidebar
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        userRole={userRole}
        onLogout={handleLogout}
      />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 }}>
        <TopBar page={currentPage} userRole={userRole} />
        <main style={{ flex: 1, overflowY: "auto", transition: "opacity 0.2s ease-in-out" }}>
          {renderPage()}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuditProvider>
      <Toaster position="top-right" richColors closeButton />
      <MainAppContent />
    </AuditProvider>
  );
}
