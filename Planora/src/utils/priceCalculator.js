export const calculateItemPrice = (item, categoryKey) => {
  if (!item) return 0;
  
  // Handle hotels - calculate total based on nights
  if (categoryKey === 'hotels' && item.pricePerNight && item.checkIn && item.checkOut) {
    const checkIn = new Date(item.checkIn);
    const checkOut = new Date(item.checkOut);
    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    return item.pricePerNight * (nights > 0 ? nights : 1);
  }
  
  // For restaurants, use budgetEstimate
  if (categoryKey === 'restaurants') {
    return parseFloat(item.budgetEstimate) || 0;
  }
  
  // Default - use price field
  return parseFloat(item.price) || 0;
};

export const calculateVacationTotal = (vacation) => {
  if (!vacation) return 0;
  
  let total = 0;
  const breakdown = {};
  
  // Standard categories
  const standardCategories = [
    'flights', 'hotels', 'carRentals', 'activities', 
    'transportation', 'insurance', 'restaurants'
  ];
  
  standardCategories.forEach(category => {
    const items = vacation[category] || [];
    const selectedId = vacation.selectedOptions?.[category];
    
    if (selectedId) {
      const selectedItem = items.find(item => item.id === selectedId);
      if (selectedItem) {
        const itemTotal = calculateItemPrice(selectedItem, category);
        total += itemTotal;
        breakdown[category] = itemTotal;
      }
    }
  });
  
  // Custom categories
  if (vacation.customCategories) {
    Object.entries(vacation.customCategories).forEach(([categoryName, items]) => {
      const selectedId = vacation.selectedOptions?.[`custom_${categoryName}`];
      
      if (selectedId && items) {
        const selectedItem = items.find(item => item.id === selectedId);
        if (selectedItem && selectedItem.price) {
          const itemTotal = parseFloat(selectedItem.price) || 0;
          total += itemTotal;
          breakdown[`custom_${categoryName}`] = itemTotal;
        }
      }
    });
  }
  
  return { total, breakdown };
};

export const formatPrice = (price, currency = '$') => {
  if (typeof price !== 'number' || isNaN(price)) return `${currency}0.00`;
  return `${currency}${price.toFixed(2)}`;
};

export const calculateHotelNights = (checkIn, checkOut) => {
  if (!checkIn || !checkOut) return 0;
  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
  return nights > 0 ? nights : 0;
};

