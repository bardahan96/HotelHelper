# Planora - Vacation Planner App

A comprehensive vacation planning application that helps you compare and organize all aspects of your trips - from flights and hotels to activities and dining. Built with React + Vite, featuring a beautiful UI with dark/light themes.

## Features

### Core Functionality
- **Vacation Management**: Create and manage multiple vacation plans with destinations and dates
- **Comparison System**: Add multiple options for each category and compare them side-by-side
- **Smart Price Calculator**: Automatically calculates total trip cost based on selected options
- **Category Support**:
  - ✈️ Flights (airline, times, duration, price)
  - 🏨 Hotels (name, dates, rating, price per night)
  - 🚗 Car Rentals (company, pickup/return times, car type)
  - 🎯 Activities (name, date/time, duration)
  - 🚊 Transportation (type, route, schedule)
  - 🛡️ Insurance (provider, coverage type)
  - 🍽️ Restaurants (name, cuisine, reservations)
  - 📋 Custom Categories (create your own!)

### User Experience
- **Expandable Cards**: Keep your dashboard clean - expand vacations only when needed
- **Selection System**: Pick one option from each category, save others for later
- **External Links**: Add links to Skyscanner, Booking.com, and other booking sites
- **Dark/Light Themes**: Choose your preferred theme with smooth transitions
- **Countdown Timer**: See how many days until your trip
- **Local Storage**: All data saved locally in your browser
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile

### Smart Features
- **Auto-calculate Hotel Total**: Automatically calculates hotel cost based on nights
- **Price Breakdown**: See exactly what each selected item costs
- **Date Validation**: End date can't be before start date
- **Empty States**: Helpful guidance when starting fresh
- **Confirmation Dialogs**: Prevent accidental deletions

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Navigate to the project directory:
```bash
cd Planora
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and visit `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The optimized files will be in the `dist` folder.

## How to Use

### Creating Your First Vacation

1. Click the **"+ New Vacation"** button
2. Enter vacation name, destination, and dates
3. Click **"Create"**

### Adding Options to Compare

1. Expand your vacation card by clicking **"▼ Expand"**
2. In any category (e.g., Flights), click **"+ Add Flights"**
3. Fill in the details and add a link to the booking site
4. Click **"Add"**
5. Repeat to add multiple options to compare

### Selecting Your Preferred Options

- Click **"Select"** on any item card to mark it as your choice
- The price calculator will automatically update
- You can change selections anytime

### Creating Custom Categories

1. Expand your vacation
2. Scroll to the bottom
3. Click **"+ Add Custom Category"**
4. Enter a name (e.g., "Visas", "Equipment", "Souvenirs")
5. Add items with custom fields

### Managing Your Data

- **Edit**: Click the ✏️ icon on any item or vacation
- **Delete**: Click the 🗑️ icon (with confirmation)
- **External Links**: Click the 🔗 icon to open booking sites

## Technology Stack

- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Plain CSS with CSS Custom Properties
- **State Management**: React Hooks + Local Storage
- **Icons**: Emoji (no dependencies!)

## Project Structure

```
Planora/
├── src/
│   ├── components/          # React components
│   │   ├── AddItemModal.jsx
│   │   ├── ComparisonSection.jsx
│   │   ├── ItemCard.jsx
│   │   ├── Logo.jsx
│   │   ├── PriceCalculator.jsx
│   │   ├── ThemeToggle.jsx
│   │   ├── VacationCard.jsx
│   │   ├── VacationDetails.jsx
│   │   ├── VacationList.jsx
│   │   └── VacationModal.jsx
│   ├── hooks/               # Custom React hooks
│   │   ├── useLocalStorage.js
│   │   └── useTheme.js
│   ├── utils/               # Utility functions
│   │   ├── categoryConfig.js
│   │   └── priceCalculator.js
│   ├── styles/              # CSS files
│   │   ├── theme.css
│   │   └── components/
│   ├── App.jsx              # Main app component
│   ├── App.css
│   ├── main.jsx
│   └── index.css
├── index.html
├── package.json
└── vite.config.js
```

## Customization

### Adding More Standard Categories

Edit `src/utils/categoryConfig.js` and add your category to the `CATEGORIES` object:

```javascript
newCategory: {
  name: 'New Category',
  icon: '🎨',
  fields: [
    { name: 'fieldName', label: 'Field Label', type: 'text', required: true },
    // ... more fields
  ]
}
```

### Changing Colors/Theme

Edit `src/styles/theme.css` to customize colors:

```css
:root {
  --accent-primary: #2196f3;  /* Change main accent color */
  --bg-primary: #ffffff;       /* Change background */
  /* ... more variables */
}
```

### Currency

Currently set to `$` (USD). To change, edit the `currency` variable in `App.jsx`:

```javascript
const currency = '€'; // or '£', '¥', etc.
```

## Data Storage

All vacation data is stored in your browser's localStorage under the key `planora-vacations`. Your data persists between sessions but is local to your browser.

### Exporting/Backing Up Data

Open browser console and run:
```javascript
copy(localStorage.getItem('planora-vacations'))
```

### Importing Data

Open browser console and run:
```javascript
localStorage.setItem('planora-vacations', 'YOUR_DATA_HERE')
```

Then refresh the page.

## Browser Support

- Chrome/Edge (recommended)
- Firefox
- Safari
- Opera

Modern browsers with ES6+ support required.

## Future Enhancements (Ideas)

- Currency conversion
- Budget alerts
- Export to PDF
- Vacation templates
- Collaborative planning (share with others)
- Integration with booking APIs
- Calendar view
- Packing list generator
- Weather forecast integration

## License

This project is open source and available for personal and commercial use.

## Credits

Built with ❤️ using React and Vite.
Logo designed with custom SVG graphics.

---

**Happy Planning! ✈️🏨🌍**
