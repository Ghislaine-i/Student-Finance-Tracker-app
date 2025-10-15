# M2 – Semantic HTML & Base CSS

## 1. Objective
The goal of M2 is to create the **core HTML structure** of the Student Finance Tracker and apply **base CSS** with a mobile-first approach. This milestone ensures that the app is **responsive**, **accessible**, and ready for JavaScript functionality in later milestones.

---

## 2. Pages / Sections

The app will include the following semantic sections:

1. **Header (`<header>`)**
    - Site title
    - Navigation menu (Dashboard, Transactions, Settings, About)
    - Skip link for accessibility

2. **Main Content (`<main>`)**
    - **Dashboard Section (`<section id="dashboard">`)**
        - Total expenses
        - Top category
        - Remaining/overage cap display
    - **Transactions Section (`<section id="transactions">`)**
        - Table of records (desktop/tablet) or cards (mobile)
        - Sorting controls
        - Live search input
    - **Add/Edit Form Section (`<section id="form">`)**
        - Form fields: Description, Amount, Date, Category
        - Submit and reset buttons
        - Inline error message placeholders

3. **Settings Section (`<section id="settings">`)**
    - Currency selection (base + 2 other currencies)
    - Manual rate inputs

4. **About Section (`<section id="about">`)**
    - Project purpose
    - GitHub link
    - Email/contact

5. **Footer (`<footer>`)**
    - Copyright
    - Credits / Version

---

## 3. Semantic HTML Plan

- Use **landmarks** (`header`, `nav`, `main`, `section`, `footer`)
- Proper **heading hierarchy** (`h1` for title, `h2` for sections, `h3` for sub-headings)
- **Labels bound to inputs** in forms
- ARIA attributes:
    - `role="status"` for live updates
    - `aria-live="polite"` for dashboard messages
    - `aria-live="assertive"` for budget overages

---

## 4. Mobile-First CSS Plan

### Breakpoints:
- **Mobile:** ~360px
- **Tablet:** ~768px
- **Desktop:** ~1024px

### Base CSS (`styles/base.css`):
- Reset margins/paddings, box-sizing border-box
- Font: readable sans-serif (e.g., `Roboto`, `Arial`)
- Color palette: high contrast, accessible colors
- Buttons & inputs: visible focus outline
- Forms: consistent spacing and typography
- Table: simple borders, striped rows

### Responsive CSS (`styles/responsive.css`):
- Mobile-first single-column layout
- Tablet: 2-column layout for form + table
- Desktop: sidebar + main content
- Smooth transitions:
    - Button hover: `transition: background-color 0.2s ease`
    - Form input focus: `transition: border-color 0.2s ease`

---

## 5. Accessibility (a11y) in HTML/CSS

- **Skip link** at top of page
- **Visible focus states** for all interactive elements
- **High contrast** colors for text and backgrounds
- **Forms**:
    - `<label>` for each input
    - Placeholder text for guidance
    - Inline error messages for validation (regex will be handled in M3)

---

## 6. Example Structure (HTML Snippet)

```html
<header>
  <a href="#main" class="skip-link">Skip to main content</a>
  <h1>Student Finance Tracker</h1>
  <nav>
    <ul>
      <li><a href="#dashboard">Dashboard</a></li>
      <li><a href="#transactions">Transactions</a></li>
      <li><a href="#settings">Settings</a></li>
      <li><a href="#about">About</a></li>
    </ul>
  </nav>
</header>

<main id="main">
  <section id="dashboard">
    <h2>Dashboard</h2>
    <!-- Totals, top category, cap messages -->
  </section>

  <section id="transactions">
    <h2>Transactions</h2>
    <!-- Table/cards, search input, sort controls -->
  </section>

  <section id="form">
    <h2>Add / Edit Transaction</h2>
    <form id="transaction-form">
      <label for="description">Description</label>
      <input type="text" id="description" name="description" required />
      <span class="error-message" aria-live="polite"></span>

      <label for="amount">Amount</label>
      <input type="number" id="amount" name="amount" required />
      <span class="error-message" aria-live="polite"></span>

      <label for="date">Date</label>
      <input type="date" id="date" name="date" required />
      <span class="error-message" aria-live="polite"></span>

      <label for="category">Category</label>
      <input type="text" id="category" name="category" required />
      <span class="error-message" aria-live="polite"></span>

      <button type="submit">Add Transaction</button>
    </form>
  </section>
</main>

<footer>
  <p>&copy; 2025 Student Finance Tracker</p>
</footer>
