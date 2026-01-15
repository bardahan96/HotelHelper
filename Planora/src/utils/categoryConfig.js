export const CATEGORIES = {
  flights: {
    name: 'Flights',
    icon: '✈️',
    fields: [
      { name: 'airline', label: 'Airline', type: 'text', required: true },
      { name: 'departureTime', label: 'Departure', type: 'datetime-local', required: true },
      { name: 'arrivalTime', label: 'Arrival', type: 'datetime-local', required: true },
      { name: 'duration', label: 'Duration', type: 'text', placeholder: 'e.g. 8h 30m' },
      { name: 'price', label: 'Price', type: 'number', required: true, min: 0, step: 0.01 },
      { name: 'link', label: 'Link', type: 'url', placeholder: 'https://...' },
      { name: 'notes', label: 'Notes', type: 'textarea', placeholder: 'Baggage, stops, etc.' }
    ]
  },
  hotels: {
    name: 'Hotels',
    icon: '🏨',
    fields: [
      { name: 'name', label: 'Hotel Name', type: 'text', required: true },
      { name: 'checkIn', label: 'Check-in', type: 'date', required: true },
      { name: 'checkOut', label: 'Check-out', type: 'date', required: true },
      { name: 'rating', label: 'Rating', type: 'number', min: 0, max: 5, step: 0.1, placeholder: '0-5' },
      { name: 'pricePerNight', label: 'Price per Night', type: 'number', required: true, min: 0, step: 0.01 },
      { name: 'link', label: 'Link', type: 'url', placeholder: 'https://...' },
      { name: 'notes', label: 'Notes', type: 'textarea', placeholder: 'Room type, amenities, etc.' }
    ]
  },
  carRentals: {
    name: 'Car Rentals',
    icon: '🚗',
    fields: [
      { name: 'company', label: 'Rental Company', type: 'text', required: true },
      { name: 'pickupTime', label: 'Pickup', type: 'datetime-local', required: true },
      { name: 'returnTime', label: 'Return', type: 'datetime-local', required: true },
      { name: 'carType', label: 'Car Type', type: 'text', placeholder: 'e.g. Economy, SUV' },
      { name: 'price', label: 'Total Price', type: 'number', required: true, min: 0, step: 0.01 },
      { name: 'link', label: 'Link', type: 'url', placeholder: 'https://...' },
      { name: 'notes', label: 'Notes', type: 'textarea', placeholder: 'Insurance, fuel policy, etc.' }
    ]
  },
  activities: {
    name: 'Activities',
    icon: '🎯',
    fields: [
      { name: 'name', label: 'Activity Name', type: 'text', required: true },
      { name: 'dateTime', label: 'Date & Time', type: 'datetime-local', required: true },
      { name: 'duration', label: 'Duration', type: 'text', placeholder: 'e.g. 3 hours' },
      { name: 'price', label: 'Price', type: 'number', required: true, min: 0, step: 0.01 },
      { name: 'link', label: 'Link', type: 'url', placeholder: 'https://...' },
      { name: 'notes', label: 'Notes', type: 'textarea', placeholder: 'Details, meeting point, etc.' }
    ]
  },
  transportation: {
    name: 'Transportation',
    icon: '🚊',
    fields: [
      { name: 'type', label: 'Type', type: 'text', placeholder: 'Train, Bus, Taxi, etc.', required: true },
      { name: 'date', label: 'Date', type: 'date', required: true },
      { name: 'route', label: 'Route', type: 'text', placeholder: 'From → To', required: true },
      { name: 'time', label: 'Time', type: 'time' },
      { name: 'price', label: 'Price', type: 'number', required: true, min: 0, step: 0.01 },
      { name: 'link', label: 'Link', type: 'url', placeholder: 'https://...' },
      { name: 'notes', label: 'Notes', type: 'textarea', placeholder: 'Ticket details, etc.' }
    ]
  },
  insurance: {
    name: 'Insurance',
    icon: '🛡️',
    fields: [
      { name: 'provider', label: 'Provider', type: 'text', required: true },
      { name: 'coverageType', label: 'Coverage Type', type: 'text', placeholder: 'e.g. Comprehensive, Medical', required: true },
      { name: 'price', label: 'Price', type: 'number', required: true, min: 0, step: 0.01 },
      { name: 'link', label: 'Link', type: 'url', placeholder: 'https://...' },
      { name: 'notes', label: 'Notes', type: 'textarea', placeholder: 'Coverage details, policy number, etc.' }
    ]
  },
  restaurants: {
    name: 'Restaurants',
    icon: '🍽️',
    fields: [
      { name: 'name', label: 'Restaurant Name', type: 'text', required: true },
      { name: 'cuisine', label: 'Cuisine', type: 'text', placeholder: 'e.g. Italian, Japanese' },
      { name: 'date', label: 'Reservation Date', type: 'date' },
      { name: 'time', label: 'Reservation Time', type: 'time' },
      { name: 'budgetEstimate', label: 'Budget Estimate', type: 'number', min: 0, step: 0.01, placeholder: 'Estimated cost' },
      { name: 'link', label: 'Reservation Link', type: 'url', placeholder: 'https://...' },
      { name: 'notes', label: 'Notes', type: 'textarea', placeholder: 'Dietary restrictions, dress code, etc.' }
    ]
  }
};

export const generateId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const getCategoryDisplayName = (categoryKey) => {
  if (CATEGORIES[categoryKey]) {
    return CATEGORIES[categoryKey].name;
  }
  return categoryKey.charAt(0).toUpperCase() + categoryKey.slice(1);
};

export const getCategoryIcon = (categoryKey) => {
  if (CATEGORIES[categoryKey]) {
    return CATEGORIES[categoryKey].icon;
  }
  return '📋';
};

