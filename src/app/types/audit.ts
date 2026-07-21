export type UserRole =
  | "NABH Coordinator"
  | "Quality Manager"
  | "Department Head"
  | "Auditor"
  | "Hospital Management"
  | "Staff Member";

export type NCSeverity = "Critical" | "Major" | "Minor";
export type NCStatus = "Open" | "In Progress" | "Overdue" | "Closed";

export interface Department {
  id: number;
  name: string;
  head: string;
  score: number;
  prev: number;
  status: "Excellent" | "Good" | "Needs Improvement" | "Critical";
  staff: number;
  lastAudit: string;
  nextAudit: string;
  nc: number;
  category: "Clinical" | "Diagnostic" | "Admin" | "Support";
}

export interface AuditQuestionAnswer {
  questionId: string;
  questionText: string;
  answer: string | number | boolean;
  notes?: string;
  evidenceUrl?: string;
}

export interface Audit {
  id: string;
  name: string;
  dept: string;
  auditor: string;
  date: string;
  chapter: string;
  priority: "Critical" | "High" | "Medium" | "Low";
  status: "Completed" | "In Progress" | "Scheduled" | "Overdue";
  score: number | null;
  scope?: string;
  answers?: AuditQuestionAnswer[];
  createdAt?: string;
}

export interface NonConformity {
  id: string;
  dept: string;
  description: string;
  severity: NCSeverity;
  rootCause: string;
  assignedTo: string;
  dueDate: string;
  status: NCStatus;
  chapter: string;
  auditRef?: string;
  createdAt?: string;
}

export interface CAPA {
  id: string;
  ncId: string;
  action: string;
  responsible: string;
  dueDate: string;
  status: "Open" | "In Progress" | "Closed";
  created: string;
  verificationNotes?: string;
}

export interface ChecklistQuestion {
  id: string;
  text: string;
  type: string;
  criteria: string;
  tags: string[];
}

export interface ChecklistChapter {
  id: number;
  code: string;
  name: string;
  questions: ChecklistQuestion[];
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  type: "warning" | "info" | "success" | "alert";
  read: boolean;
}
