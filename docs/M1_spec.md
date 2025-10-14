# Milestone 1 – Student Finance Tracker App

## 🧭 Project Overview
The **Student Finance Tracker** is a user-friendly app designed to help students efficiently manage their personal expenses and income. It allows users to add, edit, delete, categorize their financial records. The goal is to help users see their spending habits and improve their budgeting choices.

The objective of this project is to develop an accessible, mobile-first interface using clear HTML semantics, responsive CSS layouts, and modular JavaScript for dynamic data handling and persistnce with `localStorage`.

---

## ✨ Core Features
1. **Add New Transactions** – Record income or expenses with amount, category, date, and note.
2. **Edit & Delete Entries** – Update or remove transactions dynamically.
3. **Filter & Search** – Search transactions by category, amount, or keyword using **Regex**.
4. **LocalStorage Persistence** – All records are stored locally so data remains after page reloads.
5. **Data Visualization** – Use simple charts to show total expenses/income trends.
6. **Responsive Design** – Fully functional on mobile, tablet, and desktop screens.
7. **Accessibility Features** – Semantic HTML, ARIA labels, skip links, and strong color contrast.

---

## 📱 Wireframe Overview
### Mobile View
- Header with app title and “Add Transaction” button.
- List of transactions stacked vertically.
- Sticky bottom bar showing **Total Balance**.

### Tablet/Desktop View
- Two-column layout:
    - Left side: transaction list.
    - Right side: summary (charts, filters, totals).

---

## 🔍 Regex Validation & Search Plan
We’ll use **4+ regex validations** in form inputs and search:

| Field | Regex Example | Description |
|-------|---------------|-----|
| Amount | `/^\d+(\.\d{1,2})?$/` | Validates numeric amount (e.g., 1500.50) |
| Date | `/^\d{4}-\d{2}-\d{2}$/` | Validates ISO date format (YYYY-MM-DD) |
| Category | `/^[A-Za-z\s]+$/` | Ensures category contains only letters/spaces |
| Description | `/^.{0,50}$/` | Limits note length to 50 characters |
|Search | `/food\|rent\|transport/i` | Basic OR search for categories |
| Advanced Search | `/^(?=.*rent)(?=.*2025)/i` | Lookahead example – finds records mentioning both "rent" and "2025" |

---

## 💾 Data Handling
Data is stored in `localStorage` as JSON:
```js
{
  "transactions": [
    { "id": 1, "type": "expense", "amount": 1500, "category": "Rent", "date": "2025-10-01", "note": "October rent" }
  ]
}
