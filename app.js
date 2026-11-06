:root {
  --bg: #f3f6fb;
  --panel: #ffffff;
  --panel-alt: #eef3ff;
  --primary: #2563eb;
  --primary-dark: #1d4ed8;
  --success: #16a34a;
  --warning: #f59e0b;
  --danger: #ef4444;
  --text: #0f172a;
  --muted: #64748b;
  --border: #dfe7f4;
  --shadow: 0 18px 40px rgba(15, 23, 42, 0.08);
}

* {
  box-sizing: border-box;
}

html, body {
  margin: 0;
  min-height: 100%;
  font-family: Inter, "Segoe UI", sans-serif;
  background: linear-gradient(180deg, #eff6ff, #f8fafc);
  color: var(--text);
}

body {
  min-height: 100vh;
}

button, input, select, textarea {
  font: inherit;
}

button {
  cursor: pointer;
}

.hidden {
  display: none !important;
}

.page {
  min-height: 100vh;
}

.auth-shell {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 24px;
}

.auth-card {
  width: min(480px, 100%);
  background: var(--panel);
  border: 1px solid var(--border);
  border-radius: 22px;
  box-shadow: var(--shadow);
  padding: 28px;
}

.brand-block {
  text-align: center;
  margin-bottom: 24px;
}

.brand-block h1 {
  margin: 0;
  font-size: clamp(2rem, 3vw, 2.6rem);
}

.brand-block p {
  margin: 8px 0 0;
  color: var(--muted);
}

.tab-buttons {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  margin-bottom: 18px;
}

.tab-btn,
.primary-btn,
.secondary-btn,
.danger-btn {
  border: none;
  border-radius: 12px;
  padding: 11px 16px;
  font-weight: 600;
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.tab-btn {
  background: var(--panel-alt);
  color: var(--text);
  border: 1px solid var(--border);
}

.tab-btn.active {
  background: var(--primary);
  color: #fff;
}

.primary-btn {
  background: var(--primary);
  color: #fff;
}

.primary-btn:hover,
.secondary-btn:hover,
.danger-btn:hover,
.tab-btn:hover {
  transform: translateY(-1px);
}

.secondary-btn {
  background: #e2e8f0;
  color: var(--text);
}

.danger-btn {
  background: rgba(239, 68, 68, 0.1);
  color: var(--danger);
}

.auth-form,
.stacked-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.auth-form label,
.stacked-form label {
  display: flex;
  flex-direction: column;
  gap: 8px;
  color: var(--text);
  font-weight: 600;
}

input,
select,
textarea {
  width: 100%;
  padding: 12px 14px;
  border-radius: 12px;
  border: 1px solid var(--border);
  background: #fff;
  color: var(--text);
}

input:focus,
select:focus,
textarea:focus {
  outline: 2px solid rgba(37, 99, 235, 0.2);
  border-color: var(--primary);
}

.demo-note {
  margin: 0;
  text-align: center;
  color: var(--muted);
  font-size: 0.9rem;
}

.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  background: rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--border);
  padding: 20px 32px;
  position: sticky;
  top: 0;
  z-index: 10;
}

.topbar h2 {
  margin: 4px 0 0;
}

.eyebrow {
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--primary);
  font-size: 0.7rem;
  font-weight: 700;
}

.user-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.role-badge {
  padding: 8px 12px;
  border-radius: 999px;
  background: rgba(37, 99, 235, 0.1);
  color: var(--primary);
  font-weight: 700;
  text-transform: capitalize;
}

.main-grid {
  width: min(1200px, calc(100% - 32px));
  margin: 28px auto 56px;
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: 20px;
}

.stats-grid {
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 18px;
}

.stat-card,
.panel {
  background: var(--panel);
  border: 1px solid var(--border);
  border-radius: 20px;
  box-shadow: var(--shadow);
}

.stat-card {
  padding: 20px 18px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.stat-card span {
  color: var(--muted);
  font-size: 0.9rem;
}

.stat-card strong {
  font-size: clamp(1.2rem, 3vw, 2rem);
}

.panel {
  grid-column: span 6;
  padding: 22px;
}

.panel h3 {
  margin-top: 0;
  margin-bottom: 18px;
}

.action-panel {
  grid-column: span 12;
}

.attendance-actions {
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
}

.status-line {
  margin: 0;
  color: var(--muted);
}

.inline-fields {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.list-table {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.table-row {
  display: grid;
  gap: 12px;
  padding: 14px 16px;
  border: 1px solid var(--border);
  border-radius: 14px;
  background: #fafcff;
}

.table-row-header {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: center;
}

.row-name {
  font-weight: 700;
}

.meta {
  color: var(--muted);
  font-size: 0.85rem;
}

.row-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.status-tag {
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  padding: 6px 10px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: capitalize;
}

.status-tag.pending {
  background: rgba(245, 158, 11, 0.12);
  color: var(--warning);
}

.status-tag.approved {
  background: rgba(22, 163, 74, 0.12);
  color: var(--success);
}

.status-tag.rejected {
  background: rgba(239, 68, 68, 0.12);
  color: var(--danger);
}

.empty-state {
  padding: 20px;
  text-align: center;
  color: var(--muted);
  border: 1px dashed var(--border);
  border-radius: 14px;
  background: #f8fafc;
}

@media (max-width: 900px) {
  .stats-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .panel {
    grid-column: span 12;
  }
}

@media (max-width: 640px) {
  .stats-grid,
  .inline-fields {
    grid-template-columns: 1fr;
  }

  .topbar {
    flex-direction: column;
    align-items: flex-start;
  }

  .attendance-actions {
    flex-direction: column;
  }
}
