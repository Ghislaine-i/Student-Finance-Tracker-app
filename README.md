# Student Finance Tracker

A responsive web application to help students track and manage personal finances. Users can add, edit, and delete transactions, view totals and trends, and import/export data. Built with **vanilla HTML, CSS, and JavaScript** and follows accessibility best practices.

---

## 🏆 Features

- Add, edit, and delete transactions
- Categories: Food, Books, Transport, Entertainment, Fees, Other
- Live search with Regex support
- Dashboard showing totals, top category, and cap/target alerts
- LocalStorage persistence with JSON import/export
- Responsive layout (mobile, tablet, desktop)
- Accessibility: skip links, ARIA roles, keyboard navigation, focus indicators

---

## 🗂 Milestones Overview

| Milestone | File | Description |
|-----------|------|-------------|
| M1 | `docs/M1_spec.md` | Project specification, wireframes, data model, regex plan, a11y plan |
| M2 | `docs/M2_layout.md` | Semantic HTML, base CSS, mobile-first layout |
| M3 | `docs/M3_validation.md` | Forms & Regex validation, inline error messages |
| M4 | `docs/M4_search_sort.md` | Render table/cards, sorting, regex search |
| M5 | `docs/M5_dashboard.md` | Dashboard metrics, cap logic, ARIA live updates |
| M6 | `docs/M6_persistence.md` | LocalStorage persistence, JSON import/export, settings |
| M7 | `docs/M7_polish_a11y.md` | Final polish, accessibility audit, keyboard navigation, animations |

---

## 📐 Keyboard & Accessibility

- Skip link to main content  
- Full tab navigation through forms, buttons, and table  
- Enter to submit forms  
- Escape to cancel or close modals  
- ARIA live regions announce updates (e.g., “Transaction added”)  
- High contrast and focus styles

---

## 🛠 Regex Catalog

| Field | Regex Example | Description |
|-------|----------------|-------------|
| Description | `/^\S(?:.*\S)?$/` | No leading/trailing spaces |
| Amount | `/^(0|[1-9]\d*)(\.\d{1,2})?$/` | Numeric amount, up to 2 decimals |
| Date | `/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/` | Date format YYYY-MM-DD |
| Category | `/^[A-Za-z]+(?:[ -][A-Za-z]+)*$/` | Letters, spaces, hyphens only |
| Advanced | `/\b(\w+)\s+\1\b/` | Detect duplicate words |
| Search | `/food|rent|transport/i` | Basic OR search |
| Advanced Search | `/^(?=.*rent)(?=.*2025)/i` | Lookahead example – match rent + 2025 |

---

## 💾 Seed Data

- `seed.json` includes 10+ diverse transactions to test edge cases (large/small amounts, tricky strings, dates, duplicates).

---

## 🚀 How to Run

1. Clone the repo:
bash
git clone https://github.com/Ghislaine-i/student-finance-tracker.git

2. Open index.html in a browser.

3. Use the dashboard to add/edit/delete transactions.

4. Import seed.json to pre-populate data (Optional).
   
📂 Project Structure

project-root/
├── index.html
├── styles/
├── scripts/
├── assets/
├── docs/
├── tests.html
├── seed.json
└── README.md

📧 Contact

GitHub: Ghislaine-i

Email: g.ineza@alustudent.com
