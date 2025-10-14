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

### Mobile View (~360px)
-Single column layout
-Transactions displayed as cards
-Add/Edit form at top or as a modal
-Dashboard stats at top

### Tablet (~768px)
- Two-column layout:
- Form on left, transaction table on right
- Dashboard above or alongside the table

## Desktop (~1024px)
-Sidebar navigation (Categories/Settings/About)
-Main table with transactions 
-Dashboard visible at top or side
-Add/Edit form as modal or fixed panel
---

## 🔍 Regex Validation & Search Plan

| Field          | Regex Example | Description |
|----------------|-----------|-----|
| Amount         | `/^(0`|Accept numbers ≥ 0, max 2 decimals |
| Date           | `/^\d{4}-(0[1-9]` | Validates ISO date format (YYYY-MM-DD) |
| Category       | `/^[A-Za-z]+(?:[ -][A-Za-z]+)*$/` | Ensures category contains only letters/spaces |
| Description    | `/^\S(?:.*\S)?$/` |Letters only, spaces and hyphens allowed |
| Search         | `/food\|rent\|transport/i` | Basic OR search for categories |
| Advanced Regex | `/\b(\w+)\s+\1\b/` | Detect duplicate words in description |




---

## 💾 Data Handling
Data is stored in `localStorage` as JSON:
```js
{
  "transactions": [
    { "id": 1, "type": "expense", "amount": 1500, "category": "Rent", "date": "2025-10-01", "note": "October rent" }
  ]
}
```

## 📊Data Model

Each transaction record will have the following structure:

```json
{
  "id": "txn_001",
  "description": "Lunch at cafeteria",
  "amount": 12.50,
  "category": "Food",
  "date": "2025-09-25",
  "createdAt": "2025-09-25T10:00:00Z",
  "updatedAt": "2025-09-25T10:00:00Z"
}
```

Fields explained:

-id: Unique identifier

-description: Transaction description

-amount: Numeric value of the transaction

--category: Transaction category or tag

-date: Transaction date (YYYY-MM-DD)

-createdAt / updatedAt: Timestamps for tracking changes

