import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { Department, Audit, NonConformity, CAPA, NotificationItem } from "../types/audit";
import { AuditService } from "../services/auditService";
import { toast } from "sonner";

interface AuditContextType {
  departments: Department[];
  audits: Audit[];
  nonConformities: NonConformity[];
  capas: CAPA[];
  notifications: NotificationItem[];
  userRole: string;
  setUserRole: (role: string) => void;
  loading: boolean;
  
  // Handlers
  saveDepartment: (dept: Partial<Department>) => Promise<void>;
  deleteDepartment: (id: number) => Promise<void>;
  
  saveAudit: (audit: Partial<Audit>) => Promise<void>;
  deleteAudit: (id: string) => Promise<void>;
  
  saveNC: (nc: Partial<NonConformity>) => Promise<void>;
  updateNCStatus: (id: string, status: NonConformity["status"]) => Promise<void>;
  
  saveCAPA: (capa: Partial<CAPA>) => Promise<void>;
  updateCAPAStatus: (id: string, status: CAPA["status"]) => Promise<void>;
  
  markNotificationRead: (id: string) => Promise<void>;
  refreshData: () => Promise<void>;
  exportDataToCSV: (type: "departments" | "audits" | "nc" | "capa") => void;
}

const AuditContext = createContext<AuditContextType | undefined>(undefined);

export const AuditProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [audits, setAudits] = useState<Audit[]>([]);
  const [nonConformities, setNonConformities] = useState<NonConformity[]>([]);
  const [capas, setCapas] = useState<CAPA[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [userRole, setUserRole] = useState<string>("Quality Manager");
  const [loading, setLoading] = useState<boolean>(true);

  const refreshData = useCallback(async () => {
    try {
      setLoading(true);
      const [depsData, audsData, ncsData, capasData, notifsData] = await Promise.all([
        AuditService.getDepartments(),
        AuditService.getAudits(),
        AuditService.getNonConformities(),
        AuditService.getCAPAs(),
        AuditService.getNotifications(),
      ]);
      setDepartments(depsData);
      setAudits(audsData);
      setNonConformities(ncsData);
      setCapas(capasData);
      setNotifications(notifsData);
    } catch (e) {
      console.error("Failed to load audit data context", e);
      toast.error("Failed to refresh application data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // --- Department Handlers ---
  const saveDepartment = async (dept: Partial<Department>) => {
    const updated = await AuditService.saveDepartment(dept);
    setDepartments(updated);
    toast.success(dept.id ? "Department updated successfully" : "New department added");
  };

  const deleteDepartment = async (id: number) => {
    const updated = await AuditService.deleteDepartment(id);
    setDepartments(updated);
    toast.success("Department deleted");
  };

  // --- Audit Handlers ---
  const saveAudit = async (audit: Partial<Audit>) => {
    const updated = await AuditService.saveAudit(audit);
    setAudits(updated);
    toast.success(audit.id ? "Audit updated" : "New audit created successfully");
  };

  const deleteAudit = async (id: string) => {
    const updated = await AuditService.deleteAudit(id);
    setAudits(updated);
    toast.success("Audit removed");
  };

  // --- NC Handlers ---
  const saveNC = async (nc: Partial<NonConformity>) => {
    const updated = await AuditService.saveNC(nc);
    setNonConformities(updated);
    toast.success(nc.id ? "Non-Conformity updated" : "Non-Conformity finding reported");
  };

  const updateNCStatus = async (id: string, status: NonConformity["status"]) => {
    const updated = await AuditService.updateNCStatus(id, status);
    setNonConformities(updated);
    toast.info(`NC status changed to ${status}`);
  };

  // --- CAPA Handlers ---
  const saveCAPA = async (capa: Partial<CAPA>) => {
    const updated = await AuditService.saveCAPA(capa);
    setCapas(updated);
    toast.success(capa.id ? "CAPA action updated" : "New CAPA action logged");
  };

  const updateCAPAStatus = async (id: string, status: CAPA["status"]) => {
    const updated = await AuditService.updateCAPAStatus(id, status);
    setCapas(updated);
    toast.info(`CAPA status updated to ${status}`);
  };

  // --- Notifications ---
  const markNotificationRead = async (id: string) => {
    const updated = await AuditService.markNotificationRead(id);
    setNotifications(updated);
  };

  // --- Export ---
  const exportDataToCSV = (type: "departments" | "audits" | "nc" | "capa") => {
    if (type === "departments") AuditService.exportToCSV("NABH_Departments", departments);
    else if (type === "audits") AuditService.exportToCSV("NABH_Audits", audits);
    else if (type === "nc") AuditService.exportToCSV("NABH_NonConformities", nonConformities);
    else if (type === "capa") AuditService.exportToCSV("NABH_CAPA_Actions", capas);
    toast.success(`Exported ${type.toUpperCase()} report to CSV`);
  };

  return (
    <AuditContext.Provider
      value={{
        departments,
        audits,
        nonConformities,
        capas,
        notifications,
        userRole,
        setUserRole,
        loading,
        saveDepartment,
        deleteDepartment,
        saveAudit,
        deleteAudit,
        saveNC,
        updateNCStatus,
        saveCAPA,
        updateCAPAStatus,
        markNotificationRead,
        refreshData,
        exportDataToCSV,
      }}
    >
      {children}
    </AuditContext.Provider>
  );
};

export const useAudit = () => {
  const context = useContext(AuditContext);
  if (!context) {
    throw new Error("useAudit must be used within an AuditProvider");
  }
  return context;
};
