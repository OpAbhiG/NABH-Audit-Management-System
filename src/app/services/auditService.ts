import { Department, Audit, NonConformity, CAPA, NotificationItem } from "../types/audit";

const STORAGE_KEYS = {
  DEPARTMENTS: "nabh_hospital_departments_v2",
  AUDITS: "nabh_hospital_audits_v2",
  NON_CONFORMITIES: "nabh_hospital_ncs_v2",
  CAPAS: "nabh_hospital_capas_v2",
  NOTIFICATIONS: "nabh_hospital_notifications_v2",
};

/**
 * Security Input Sanitizer to strip potentially unsafe HTML script tags
 */
export function sanitizeInput(input: string): string {
  if (!input) return "";
  return input
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

const SEED_DEPARTMENTS: Department[] = [
  { id: 1, name: "OPD", head: "Dr. Rajesh Kumar", score: 92, prev: 88, status: "Excellent", staff: 45, lastAudit: "2026-06-01", nextAudit: "2026-07-01", nc: 2, category: "Clinical" },
  { id: 2, name: "IPD", head: "Dr. Priya Sharma", score: 85, prev: 82, status: "Good", staff: 80, lastAudit: "2026-06-05", nextAudit: "2026-07-05", nc: 5, category: "Clinical" },
  { id: 3, name: "Emergency", head: "Dr. Suresh Patel", score: 79, prev: 83, status: "Needs Improvement", staff: 35, lastAudit: "2026-05-20", nextAudit: "2026-06-20", nc: 8, category: "Clinical" },
  { id: 4, name: "ICU", head: "Dr. Meena Iyer", score: 88, prev: 85, status: "Good", staff: 28, lastAudit: "2026-06-08", nextAudit: "2026-07-08", nc: 4, category: "Clinical" },
  { id: 5, name: "OT", head: "Dr. Arvind Singh", score: 95, prev: 93, status: "Excellent", staff: 22, lastAudit: "2026-06-02", nextAudit: "2026-07-02", nc: 1, category: "Clinical" },
  { id: 6, name: "Pharmacy", head: "Mr. Anand Verma", score: 85, prev: 80, status: "Good", staff: 18, lastAudit: "2026-06-03", nextAudit: "2026-07-03", nc: 3, category: "Support" },
  { id: 7, name: "Laboratory", head: "Dr. Sunita Rao", score: 91, prev: 88, status: "Excellent", staff: 25, lastAudit: "2026-06-06", nextAudit: "2026-07-06", nc: 2, category: "Diagnostic" },
  { id: 8, name: "Radiology", head: "Dr. Vikram Shah", score: 83, prev: 85, status: "Good", staff: 20, lastAudit: "2026-05-28", nextAudit: "2026-06-28", nc: 6, category: "Diagnostic" },
  { id: 9, name: "HR", head: "Ms. Kavita Nair", score: 76, prev: 74, status: "Needs Improvement", staff: 15, lastAudit: "2026-06-04", nextAudit: "2026-07-04", nc: 9, category: "Admin" },
  { id: 10, name: "IT", head: "Mr. Rahul Mehta", score: 89, prev: 86, status: "Good", staff: 12, lastAudit: "2026-06-07", nextAudit: "2026-07-07", nc: 3, category: "Support" },
  { id: 11, name: "Biomedical", head: "Mr. Deepak Gupta", score: 86, prev: 83, status: "Good", staff: 10, lastAudit: "2026-06-09", nextAudit: "2026-07-09", nc: 4, category: "Support" },
  { id: 12, name: "Maintenance", head: "Mr. Sanjay Tiwari", score: 78, prev: 75, status: "Needs Improvement", staff: 20, lastAudit: "2026-06-01", nextAudit: "2026-07-01", nc: 7, category: "Support" },
  { id: 13, name: "Housekeeping", head: "Mr. Ramesh Das", score: 72, prev: 70, status: "Needs Improvement", staff: 40, lastAudit: "2026-05-25", nextAudit: "2026-06-25", nc: 12, category: "Support" },
  { id: 14, name: "Nursing", head: "Ms. Geeta Singh", score: 87, prev: 84, status: "Good", staff: 120, lastAudit: "2026-06-03", nextAudit: "2026-07-03", nc: 5, category: "Clinical" },
  { id: 15, name: "MRD", head: "Mr. Ajay Dubey", score: 84, prev: 82, status: "Good", staff: 8, lastAudit: "2026-06-06", nextAudit: "2026-07-06", nc: 4, category: "Admin" },
  { id: 16, name: "Infection Control", head: "Dr. Nisha Kulkarni", score: 94, prev: 90, status: "Excellent", staff: 6, lastAudit: "2026-06-08", nextAudit: "2026-07-08", nc: 2, category: "Clinical" },
  { id: 17, name: "Administration", head: "Mr. Pranav Joshi", score: 81, prev: 79, status: "Good", staff: 25, lastAudit: "2026-06-02", nextAudit: "2026-07-02", nc: 5, category: "Admin" },
  { id: 18, name: "Security", head: "Mr. Sunil Yadav", score: 75, prev: 73, status: "Needs Improvement", staff: 30, lastAudit: "2026-06-05", nextAudit: "2026-07-05", nc: 8, category: "Support" },
  { id: 19, name: "Kitchen", head: "Mr. Brijesh Singh", score: 68, prev: 65, status: "Critical", staff: 22, lastAudit: "2026-05-30", nextAudit: "2026-06-30", nc: 15, category: "Support" },
  { id: 20, name: "Laundry", head: "Mr. Mohan Patel", score: 74, prev: 72, status: "Needs Improvement", staff: 15, lastAudit: "2026-06-01", nextAudit: "2026-07-01", nc: 9, category: "Support" },
];

const SEED_AUDITS: Audit[] = [
  { id: "AUD-001", name: "OPD Monthly Compliance Audit", dept: "OPD", auditor: "Dr. Kumar", date: "2026-06-10", chapter: "Care of Patients", priority: "High", status: "Completed", score: 92, scope: "Evaluation of patient reception, triage documentation, and waiting time benchmarks." },
  { id: "AUD-002", name: "ICU Safety Standards Review", dept: "ICU", auditor: "Ms. Rao", date: "2026-06-12", chapter: "Patient Safety", priority: "Critical", status: "In Progress", score: 78, scope: "Ventilator bundle compliance, hand hygiene auditing, and high-alert drug segregation." },
  { id: "AUD-003", name: "Pharmacy Drug Management Audit", dept: "Pharmacy", auditor: "Mr. Sharma", date: "2026-06-15", chapter: "Medication Management", priority: "High", status: "Scheduled", score: null, scope: "LASA drug storage, cold chain monitoring, and emergency drug tray checks." },
  { id: "AUD-004", name: "Emergency Department Audit Q2", dept: "Emergency", auditor: "Dr. Patel", date: "2026-06-08", chapter: "Access & Continuity", priority: "Critical", status: "Completed", score: 79, scope: "Code blue readiness, trauma bay documentation, and transfer protocols." },
  { id: "AUD-005", name: "OT Sterility & Safety Check", dept: "OT", auditor: "Dr. Singh", date: "2026-06-14", chapter: "Infection Control", priority: "High", status: "Completed", score: 96, scope: "Surgical safety checklist compliance, autoclave validation, and HVAC air changes." },
  { id: "AUD-006", name: "Lab Quality Control Audit", dept: "Laboratory", auditor: "Ms. Iyer", date: "2026-06-18", chapter: "Information Management", priority: "Medium", status: "Scheduled", score: null, scope: "Internal quality control logs, critical value reporting, and specimen rejection tracking." },
  { id: "AUD-007", name: "HR Compliance & Training Audit", dept: "HR", auditor: "Mr. Verma", date: "2026-06-05", chapter: "HR Management", priority: "Medium", status: "Completed", score: 76, scope: "Staff credentialing, BLS training records, and annual health checkup verification." },
  { id: "AUD-008", name: "Housekeeping Standards Audit", dept: "Housekeeping", auditor: "Ms. Nair", date: "2026-06-20", chapter: "Facility Management", priority: "High", status: "Scheduled", score: null, scope: "Color-coded mop system, disinfectant dilution ratios, and BMW segregation." },
  { id: "AUD-009", name: "Kitchen Hygiene & Safety Audit", dept: "Kitchen", auditor: "Mr. Mehta", date: "2026-06-13", chapter: "Facility Management", priority: "Critical", status: "In Progress", score: 65, scope: "Food handler health cards, water testing certificates, and temperature logs." },
  { id: "AUD-010", name: "Nursing Documentation Review", dept: "Nursing", auditor: "Dr. Shah", date: "2026-06-09", chapter: "Care of Patients", priority: "High", status: "Completed", score: 88, scope: "Shift handover notes, pain assessment scaling, and fall risk scoring." },
];

const SEED_NCS: NonConformity[] = [
  { id: "NC-001", dept: "Emergency", description: "Triage documentation incomplete for 3 emergency admissions", severity: "Major", rootCause: "Staff not fully trained on updated digital triage form", assignedTo: "Dr. Suresh Patel", dueDate: "2026-06-25", status: "Open", chapter: "AAC", auditRef: "AUD-004" },
  { id: "NC-002", dept: "Kitchen", description: "Food temperature logs not maintained for 4 consecutive days", severity: "Critical", rootCause: "Missing log sheets and lack of shift supervisor accountability", assignedTo: "Mr. Brijesh Singh", dueDate: "2026-06-18", status: "Overdue", chapter: "FMS", auditRef: "AUD-009" },
  { id: "NC-003", dept: "Housekeeping", description: "Chemical storage bottles missing clear hazardous label tags", severity: "Major", rootCause: "Labeling policy not communicated during staff orientation", assignedTo: "Mr. Ramesh Das", dueDate: "2026-06-20", status: "In Progress", chapter: "FMS", auditRef: "AUD-008" },
  { id: "NC-004", dept: "Pharmacy", description: "High-alert medications not separately segregated in emergency tray", severity: "Critical", rootCause: "Tray storage compartment insufficient for dual-lock isolation", assignedTo: "Mr. Anand Verma", dueDate: "2026-06-15", status: "Closed", chapter: "MOM", auditRef: "AUD-003" },
  { id: "NC-005", dept: "HR", description: "Staff credential verification records incomplete for 5 junior nurses", severity: "Minor", rootCause: "Backlog in primary source verification response from universities", assignedTo: "Ms. Kavita Nair", dueDate: "2026-06-30", status: "Open", chapter: "HRM", auditRef: "AUD-007" },
  { id: "NC-006", dept: "Security", description: "CCTV coverage blind spot in rear pharmacy storage corridor", severity: "Major", rootCause: "Camera power adapter malfunction went unreported for 48 hrs", assignedTo: "Mr. Sunil Yadav", dueDate: "2026-06-22", status: "Open", chapter: "FMS" },
  { id: "NC-007", dept: "Nursing", description: "Medication administration records not countersigned by shift incharge", severity: "Minor", rootCause: "Process gap during peak evening shift handover transition", assignedTo: "Ms. Geeta Singh", dueDate: "2026-06-28", status: "In Progress", chapter: "COP", auditRef: "AUD-010" },
  { id: "NC-008", dept: "OPD", description: "Patient waiting time in eye clinic exceeded 30 minutes benchmark", severity: "Minor", rootCause: "High registration volume and temporary diagnostic equipment delay", assignedTo: "Dr. Rajesh Kumar", dueDate: "2026-07-05", status: "Open", chapter: "AAC", auditRef: "AUD-001" },
];

const SEED_CAPAS: CAPA[] = [
  { id: "CAPA-1001", ncId: "NC-004", action: "Installed dual-lock high-alert drug cabinet in emergency pharmacy area and updated drug labeling.", responsible: "Mr. Anand Verma", dueDate: "2026-06-14", status: "Closed", created: "2026-06-10", verificationNotes: "Verified by Quality Manager on 2026-06-15." },
  { id: "CAPA-1002", ncId: "NC-002", action: "Procured digital Bluetooth temperature loggers for kitchen cold rooms and trained kitchen staff.", responsible: "Mr. Brijesh Singh", dueDate: "2026-06-24", status: "In Progress", created: "2026-06-12" },
  { id: "CAPA-1003", ncId: "NC-001", action: "Conduct mandatory re-orientation training on electronic triage documentation for ED nursing staff.", responsible: "Dr. Suresh Patel", dueDate: "2026-06-26", status: "Open", created: "2026-06-15" },
];

const SEED_NOTIFICATIONS: NotificationItem[] = [
  { id: "N-1", title: "Overdue NC Alert", message: "Kitchen food temperature NC-002 is overdue for CAPA verification.", time: "10 mins ago", type: "alert", read: false },
  { id: "N-2", title: "Audit Scheduled", message: "Pharmacy Drug Management Audit scheduled for 2026-06-15.", time: "1 hour ago", type: "info", read: false },
  { id: "N-3", title: "CAPA Closed", message: "CAPA-1001 for Pharmacy drug segregation successfully closed.", time: "3 hours ago", type: "success", read: true },
];

// Helper to initialize or load from storage
function loadFromStorage<T>(key: string, seed: T): T {
  try {
    const data = localStorage.getItem(key);
    if (!data) {
      localStorage.setItem(key, JSON.stringify(seed));
      return seed;
    }
    return JSON.parse(data);
  } catch (e) {
    console.error(`Error loading storage key ${key}:`, e);
    return seed;
  }
}

function saveToStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error(`Error saving storage key ${key}:`, e);
  }
}

/**
 * Abstract API / Storage Service Layer.
 * Future API backend integration can replace localStorage reads with fetch calls here.
 */
export const AuditService = {
  // --- DEPARTMENTS ---
  async getDepartments(): Promise<Department[]> {
    return loadFromStorage(STORAGE_KEYS.DEPARTMENTS, SEED_DEPARTMENTS);
  },
  async saveDepartment(dept: Partial<Department>): Promise<Department[]> {
    const depts = await this.getDepartments();
    let updated: Department[];
    if (dept.id) {
      updated = depts.map(d => (d.id === dept.id ? ({ ...d, ...dept, name: sanitizeInput(dept.name || d.name), head: sanitizeInput(dept.head || d.head) } as Department) : d));
    } else {
      const newId = Math.max(0, ...depts.map(d => d.id)) + 1;
      const newDept: Department = {
        id: newId,
        name: sanitizeInput(dept.name || "New Department"),
        head: sanitizeInput(dept.head || "Unassigned"),
        score: dept.score || 80,
        prev: Math.max(50, (dept.score || 80) - 3),
        status: (dept.score || 80) >= 90 ? "Excellent" : (dept.score || 80) >= 80 ? "Good" : (dept.score || 80) >= 70 ? "Needs Improvement" : "Critical",
        staff: Number(dept.staff) || 10,
        lastAudit: new Date().toISOString().slice(0, 10),
        nextAudit: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10),
        nc: Math.floor(Math.random() * 5),
        category: dept.category || "Clinical",
      };
      updated = [newDept, ...depts];
    }
    saveToStorage(STORAGE_KEYS.DEPARTMENTS, updated);
    return updated;
  },
  async deleteDepartment(id: number): Promise<Department[]> {
    const depts = await this.getDepartments();
    const updated = depts.filter(d => d.id !== id);
    saveToStorage(STORAGE_KEYS.DEPARTMENTS, updated);
    return updated;
  },

  // --- AUDITS ---
  async getAudits(): Promise<Audit[]> {
    return loadFromStorage(STORAGE_KEYS.AUDITS, SEED_AUDITS);
  },
  async saveAudit(audit: Partial<Audit>): Promise<Audit[]> {
    const audits = await this.getAudits();
    let updated: Audit[];
    if (audit.id && audits.some(a => a.id === audit.id)) {
      updated = audits.map(a => (a.id === audit.id ? ({
        ...a,
        ...audit,
        name: sanitizeInput(audit.name || a.name),
        auditor: sanitizeInput(audit.auditor || a.auditor),
        scope: sanitizeInput(audit.scope || a.scope || ""),
      } as Audit) : a));
    } else {
      const newAudit: Audit = {
        id: audit.id || `AUD-${String(audits.length + 1).padStart(3, "0")}`,
        name: sanitizeInput(audit.name || "Untitled Audit"),
        dept: audit.dept || "General",
        auditor: sanitizeInput(audit.auditor || "Lead Auditor"),
        date: audit.date || new Date().toISOString().slice(0, 10),
        chapter: audit.chapter || "Care of Patients",
        priority: audit.priority || "Medium",
        status: audit.status || "Scheduled",
        score: audit.score !== undefined ? audit.score : null,
        scope: sanitizeInput(audit.scope || ""),
        answers: audit.answers || [],
        createdAt: new Date().toISOString(),
      };
      updated = [newAudit, ...audits];
    }
    saveToStorage(STORAGE_KEYS.AUDITS, updated);
    return updated;
  },
  async deleteAudit(id: string): Promise<Audit[]> {
    const audits = await this.getAudits();
    const updated = audits.filter(a => a.id !== id);
    saveToStorage(STORAGE_KEYS.AUDITS, updated);
    return updated;
  },

  // --- NON-CONFORMITIES ---
  async getNonConformities(): Promise<NonConformity[]> {
    return loadFromStorage(STORAGE_KEYS.NON_CONFORMITIES, SEED_NCS);
  },
  async saveNC(nc: Partial<NonConformity>): Promise<NonConformity[]> {
    const ncs = await this.getNonConformities();
    let updated: NonConformity[];
    if (nc.id && ncs.some(n => n.id === nc.id)) {
      updated = ncs.map(n => (n.id === nc.id ? ({
        ...n,
        ...nc,
        description: sanitizeInput(nc.description || n.description),
        rootCause: sanitizeInput(nc.rootCause || n.rootCause),
        assignedTo: sanitizeInput(nc.assignedTo || n.assignedTo),
      } as NonConformity) : n));
    } else {
      const newNC: NonConformity = {
        id: nc.id || `NC-${String(ncs.length + 1).padStart(3, "0")}`,
        dept: nc.dept || "General",
        description: sanitizeInput(nc.description || "Unspecified Non-Conformity"),
        severity: nc.severity || "Minor",
        rootCause: sanitizeInput(nc.rootCause || "Under Investigation"),
        assignedTo: sanitizeInput(nc.assignedTo || "Department Incharge"),
        dueDate: nc.dueDate || new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10),
        status: nc.status || "Open",
        chapter: nc.chapter || "AAC",
        auditRef: nc.auditRef || "",
        createdAt: new Date().toISOString(),
      };
      updated = [newNC, ...ncs];
    }
    saveToStorage(STORAGE_KEYS.NON_CONFORMITIES, updated);
    return updated;
  },
  async updateNCStatus(id: string, status: NonConformity["status"]): Promise<NonConformity[]> {
    const ncs = await this.getNonConformities();
    const updated = ncs.map(n => (n.id === id ? { ...n, status } : n));
    saveToStorage(STORAGE_KEYS.NON_CONFORMITIES, updated);
    return updated;
  },

  // --- CAPA ---
  async getCAPAs(): Promise<CAPA[]> {
    return loadFromStorage(STORAGE_KEYS.CAPAS, SEED_CAPAS);
  },
  async saveCAPA(capa: Partial<CAPA>): Promise<CAPA[]> {
    const capas = await this.getCAPAs();
    let updated: CAPA[];
    if (capa.id && capas.some(c => c.id === capa.id)) {
      updated = capas.map(c => (c.id === capa.id ? ({
        ...c,
        ...capa,
        action: sanitizeInput(capa.action || c.action),
        responsible: sanitizeInput(capa.responsible || c.responsible),
      } as CAPA) : c));
    } else {
      const newCAPA: CAPA = {
        id: capa.id || `CAPA-${String(1000 + capas.length + 1)}`,
        ncId: capa.ncId || "General-NC",
        action: sanitizeInput(capa.action || "Corrective action pending details"),
        responsible: sanitizeInput(capa.responsible || "Quality Officer"),
        dueDate: capa.dueDate || new Date(Date.now() + 21 * 86400000).toISOString().slice(0, 10),
        status: capa.status || "Open",
        created: new Date().toISOString().slice(0, 10),
      };
      updated = [newCAPA, ...capas];
    }
    saveToStorage(STORAGE_KEYS.CAPAS, updated);
    return updated;
  },
  async updateCAPAStatus(id: string, status: CAPA["status"]): Promise<CAPA[]> {
    const capas = await this.getCAPAs();
    const updated = capas.map(c => (c.id === id ? { ...c, status } : c));
    saveToStorage(STORAGE_KEYS.CAPAS, updated);
    return updated;
  },

  // --- NOTIFICATIONS ---
  async getNotifications(): Promise<NotificationItem[]> {
    return loadFromStorage(STORAGE_KEYS.NOTIFICATIONS, SEED_NOTIFICATIONS);
  },
  async markNotificationRead(id: string): Promise<NotificationItem[]> {
    const list = await this.getNotifications();
    const updated = list.map(n => (n.id === id ? { ...n, read: true } : n));
    saveToStorage(STORAGE_KEYS.NOTIFICATIONS, updated);
    return updated;
  },

  // --- UTILITY EXPORT ---
  exportToCSV(filename: string, rows: Record<string, any>[]): void {
    if (!rows || !rows.length) return;
    const separator = ",";
    const keys = Object.keys(rows[0]);
    const csvContent =
      keys.join(separator) +
      "\n" +
      rows
        .map(row => {
          return keys
            .map(k => {
              let cell = row[k] === null || row[k] === undefined ? "" : row[k];
              cell = cell.toString().replace(/"/g, '""');
              if (cell.search(/("|,|\n)/g) >= 0) {
                cell = `"${cell}"`;
              }
              return cell;
            })
            .join(separator);
        })
        .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `${filename}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },
};
