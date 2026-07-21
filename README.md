# 🏥 NABH Audit Management System (v3.0)

An enterprise-grade internal quality audit and accreditation management platform built for hospitals complying with **NABH (National Accreditation Board for Hospitals & Healthcare Providers) 5th Edition Standards**.

![React](https://img.shields.io/badge/React-18.3-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Vite](https://img.shields.io/badge/Vite-6.3-purple)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.0-cyan)
![Status](https://img.shields.io/badge/Production-Ready-brightgreen)

---

## ✨ Features

- 📊 **Executive Dashboard**: Real-time hospital compliance scoring, KPI metrics, department performance bar charts, and non-conformity severity distribution.
- 🏢 **Department Management**: Dynamic CRUD management for 20+ hospital clinical, diagnostic, admin, and support departments.
- 📋 **Audit Management**: Audit scheduler, status tracking, interactive questionnaire evaluation, live compliance score calculation, and summary detail views.
- 📚 **NABH Checklist Library**: Full 10-chapter NABH 5th Edition checklist library with search, tag filtering, CSV export, and custom question builder.
- ⚠️ **Non-Conformity (NC) Tracker**: Severity classification (Critical, Major, Minor), root cause analysis, due date tracking, and automated **Assign CAPA** bridging.
- 🛠️ **CAPA Module**: Corrective & Preventive Action workflow tracking, responsible officer assignment, and status updates.
- 📈 **Analytics & Executive View**: Statistical breakdown for hospital leadership with instant CSV report generation.
- 🔔 **Notifications & Settings**: Drawers for real-time alert notifications and data backup export.

---

## 🛠️ Architecture & API Readiness

The app is built with an **Abstract Service Architecture**:
- `src/app/services/auditService.ts`: Centralized data access layer.
- `src/app/context/AuditContext.tsx`: Global reactive context provider.
- Persists to `localStorage` currently, structured as an async API client so transitioning to a real REST or GraphQL backend requires **zero UI refactoring**.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm or pnpm

### Installation & Local Setup

```bash
# 1. Install dependencies
npm install

# 2. Start Vite development server
npm run dev

# 3. Build for production
npm run build
```

---

## 📤 GitHub Deployment Instructions

To upload this repository to your GitHub account (`Abhishek Gholap`), follow these simple commands:

```bash
# 1. Create a new empty repository on GitHub named "NABH-Audit-Management-App"

# 2. Add remote URL (replace YOUR_GITHUB_USERNAME and REPO_NAME)
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/NABH-Audit-Management-App.git

# 3. Push main branch to GitHub
git push -u origin main
```

---

## 📄 License
This project is licensed under the MIT License.