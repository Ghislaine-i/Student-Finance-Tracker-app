# Student Finance Tracker 💰

A comprehensive web application for students to track daily expenses, analyze spending patterns, and manage budgets effectively. Built with accessibility in mind and designed for both desktop and mobile use.

## 🌐 Live Demo

**Main Application**: [https://ghislaine-i.github.io/Student-Finance-Tracker-app/](https://ghislaine-i.github.io/Student-Finance-Tracker-app/

## 📋 Overview

Student Finance Tracker helps students monitor daily spending with powerful features like regex search, budget alerts, and multi-currency support. The application runs entirely in your browser with no server required, ensuring complete privacy and instant access.

## 🚀 Quick Start

### Prerequisites
- Modern web browser (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
- JavaScript enabled
- Local storage enabled

### Installation & Setup
1. **Access Live Version**: Visit the [live demo](https://ghislaine-i.github.io/Student-Finance-Tracker-app/)
2. **Local Development** (optional):
   ```bash
   git clone https://github.com/ghislaine-i/Student-Finance-Tracker-app.git
   cd Student-Finance-Tracker-app
   # Open index.html in your browser
   ```
3. **Start Using**: Begin adding transactions immediately - no registration required!

### First-Time Setup
1. Open the application
2. Add your first transaction using the form
3. Set your budget in Settings (optional)
4. Configure currency exchange rate (default: 1448 RWF = 1 USD)

## ✨ Features

### Core Functionality
- **💸 Transaction Management**: Add, edit, delete expenses with categories
- **📊 Real-time Dashboard**: Live statistics and spending overview
- **🔍 Advanced Search**: Regex-powered transaction filtering
- **💱 Multi-Currency**: Automatic RWF to USD conversion
- **🎯 Budget Tracking**: Set and monitor spending limits with color-coded alerts
- **📱 Responsive Design**: Works seamlessly on all devices
- **💾 Local Storage**: Data persists between sessions

### Advanced Capabilities
- **Data Export**: Download all transactions as JSON
- **Sample Data**: Pre-loaded demo data for testing
- **Input Validation**: Smart form validation with helpful errors
- **Future Date Prevention**: Cannot add transactions with future dates

## 🔍 Regex Search Catalog

### Basic Search Patterns
| Pattern | Description | Example Matches |
|---------|-------------|-----------------|
| `food` | Simple text search | "lunch food", "food delivery" |
| `/\d{3,}/` | Amounts ≥ 100 RWF | "1500", "25000" |
| `/^2024/` | Transactions from 2024 | "2024-01-15" |
| `/(.)\1{2,}/` | Repeated characters | "coffeeeee", "soooon" |

### Category-Based Search
| Pattern | Purpose | Usage |
|---------|---------|-------|
| `/food\|lunch\|dinner/` | Food expenses | All food-related transactions |
| `/transport\|bus\|taxi/` | Travel costs | Transport category items |
| `/books\|supplies\|stationery/` | Academic expenses | Study materials |

### Amount Filtering
| Pattern | Usage | Result |
|---------|-------|--------|
| `/\b[1-9]\d{3}\b/` | 1000-9999 RWF | Medium expenses |
| `/\b[1-9]\d{4,}\b/` | ≥10000 RWF | Large purchases |
| `/^5\d{3}$/` | 5000-5999 RWF | Specific range |

### Date Search Patterns
| Pattern | Function | Example |
|---------|----------|---------|
| `/2024-0[1-3]/` | Q1 2024 expenses | Jan-Mar 2024 |
| `/2024-1[0-2]/` | Q4 2024 expenses | Oct-Dec 2024 |
| `/\d{4}-12-\d{2}/` | December expenses | Christmas spending |

### Advanced Regex Examples
```javascript
// Find food expenses over 5000 RWF
/food/i && /\b[5-9]\d{3,}\b/

// Find transactions from last week
/2024-01-(0[8-9]|1[0-5])/

// Complex category matching
/\b(food|dining|restaurant)\b/i
```

## ⌨️ Keyboard Shortcuts & Navigation

### Global Navigation
| Key | Action | Purpose |
|-----|--------|---------|
| `Tab` | Next element | Move forward through interactive elements |
| `Shift + Tab` | Previous element | Move backward through interactive elements |
| `Enter` | Activate | Submit forms, click buttons |
| `Space` | Toggle | Activate checkboxes, toggle switches |
| `/` | Focus search | Quick access to search functionality |

### Form Operations
| Shortcut | Function | Context |
|----------|----------|---------|
| `Ctrl + Enter` / `⌘ + Enter` | Submit form | Quick transaction submission |
| `Escape` | Cancel edit | Exit edit mode, close modals |
| `Arrow Keys` | Navigate options | Move through select dropdowns |

### Accessibility Navigation
- **Skip Link**: First `Tab` press reveals "Skip to main content"
- **Landmarks**: Semantic HTML with proper ARIA landmarks
- **Focus Management**: Logical tab order throughout application

## ♿ Accessibility Features

### Screen Reader Support
- **Semantic HTML**: Proper heading structure and landmarks
- **ARIA Labels**: Descriptive labels for all interactive elements
- **Live Regions**: Dynamic updates announced to screen readers
- **Alt Texts**: Descriptive text for all visual elements

### Visual Accessibility
- **Color Contrast**: WCAG AA compliant (4.5:1 minimum)
- **Text Scaling**: Responsive to browser zoom up to 200%
- **Focus Indicators**: Clear, high-contrast focus rings
- **Motion Reduction**: Respects `prefers-reduced-motion` settings

### Keyboard Navigation
- **Full Tab Coverage**: All interactive elements accessible via keyboard
- **Logical Tab Order**: Follows visual layout and reading order
- **Keyboard Traps**: No keyboard traps in modal dialogs
- **Escape Handlers**: Consistent escape key behavior

### Cognitive Accessibility
- **Consistent Layout**: Predictable navigation and interaction patterns
- **Clear Labels**: Descriptive labels and instructions
- **Error Prevention**: Form validation with helpful error messages
- **Simple Language**: Clear, concise text throughout

## 🧪 Testing Instructions

### Automated Test Suite
Access the comprehensive test suite at: [https://ghislaine-i.github.io/Student-Finance-Tracker-app/tests.html](https://ghislaine-i.github.io/Student-Finance-Tracker-app/tests.html)

### Manual Testing Checklist

#### Core Functionality
- [ ] Add new transaction with valid data
- [ ] Edit existing transaction details
- [ ] Delete transaction with confirmation
- [ ] Form validation prevents invalid submissions
- [ ] Future date prevention works correctly

#### Dashboard Features
- [ ] Total records update in real-time
- [ ] Amount calculations are accurate
- [ ] Category statistics update correctly
- [ ] Budget status alerts show proper colors
- [ ] Currency conversion displays accurately

#### Search & Filter
- [ ] Basic text search returns correct results
- [ ] Regex patterns work as expected
- [ ] Search highlighting functions properly
- [ ] Result counting displays accurately
- [ ] Search feedback provides clear information

#### Data Management
- [ ] Local storage persists data on refresh
- [ ] Data export generates valid JSON file
- [ ] Sample data loads correctly
- [ ] Budget settings save properly

#### Responsive Design
- [ ] Mobile layout (≤768px) functions correctly
- [ ] Tablet layout (769px-1024px) displays properly
- [ ] Desktop layout (≥1025px) provides full experience
- [ ] Touch interactions work on mobile devices

#### Accessibility Testing
- [ ] Keyboard navigation works throughout
- [ ] Screen reader announces content correctly
- [ ] Focus management follows logical order
- [ ] Color contrast meets accessibility standards
- [ ] Text remains readable at 200% zoom

### Browser Compatibility
- [ ] Chrome (latest) - Full support
- [ ] Firefox (latest) - Full support  
- [ ] Safari (latest) - Full support
- [ ] Edge (latest) - Full support

### Performance Testing
- [ ] Page loads under 3 seconds
- [ ] Search responds within 100ms for 1000+ transactions
- [ ] Dashboard updates within 50ms of data changes
- [ ] Memory usage remains stable during extended use

## 🛠️ Technical Details

### Architecture
- **Frontend Only**: No backend server required
- **Local Storage**: Browser-based data persistence
- **Vanilla JavaScript**: No frameworks or dependencies
- **Responsive CSS**: Mobile-first design approach

### Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Data Structure
```javascript
{
  transactions: [
    {
      id: "string",
      description: "string",
      amount: "number",
      category: "string",
      date: "YYYY-MM-DD",
      createdAt: "ISOString",
      updatedAt: "ISOString"
    }
  ],
  settings: {
    currencyRate: "number",
    budgetCap: "number"
  }
}
```

### Performance Characteristics
- **Initial Load**: < 3 seconds
- **Search Speed**: < 100ms for 1000 transactions
- **Storage**: Unlimited transactions (browser-dependent)
- **Memory**: Efficient DOM updates and garbage collection

## 🐛 Troubleshooting

### Common Issues & Solutions

#### Data Not Saving
**Problem**: Transactions disappear after refresh
**Solution**: Ensure local storage is enabled in browser settings

#### Search Not Working
**Problem**: Regex patterns return no results
**Solution**: Check regex syntax and use simple patterns first

#### White Screen
**Problem**: Application doesn't load
**Solution**: Clear browser cache and hard refresh (Ctrl+F5)

#### Mobile Layout Issues
**Problem**: Layout breaks on small screens
**Solution**: Ensure viewport meta tag is present

### Debug Mode
Open browser console (F12) to access debug information:
- Transaction operations log
- Search pattern matching
- Performance metrics
- Error messages with stack traces

## 📞 Support & Contact

- **Email**: [Your Email]
- **GitHub Issues**: [Repository Issues Page]
- **Documentation**: Inline code comments and this README

### Feature Requests & Bug Reports
When reporting issues, please include:
1. Browser version and OS
2. Steps to reproduce
3. Expected vs actual behavior
4. Console errors (if any)

## 🤝 Contributing

While this is primarily a personal project, suggestions and feedback are welcome:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 🚀 Deployment

### GitHub Pages
This application is automatically deployed via GitHub Pages:
- **Repository**: `ghislaine-i/Student-Finance-Tracker-app`
- **Branch**: `main`
- **Source**: `/(root)`
- **URL**: https://ghislaine-i.github.io/Student-Finance-Tracker-app/

### Manual Deployment
To deploy to other platforms:
1. Ensure all file paths are relative
2. Remove ES6 module imports if necessary
3. Test functionality in target environment

---

**Built with ♥ for students everywhere** - Start tracking your expenses today and take control of your financial future! 🎓💰

---
