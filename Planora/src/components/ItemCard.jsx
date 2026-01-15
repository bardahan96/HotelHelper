import React from 'react';
import '../styles/components/ItemCard.css';

const ItemCard = ({ 
  item, 
  categoryKey, 
  isSelected, 
  onSelect, 
  onEdit, 
  onDelete,
  formatPrice 
}) => {
  const renderFieldValue = (field, value) => {
    if (!value) return null;
    
    if (field.type === 'datetime-local') {
      return new Date(value).toLocaleString();
    }
    if (field.type === 'date') {
      return new Date(value).toLocaleDateString();
    }
    if (field.type === 'time') {
      return value;
    }
    if (field.type === 'number' && field.name.includes('price')) {
      return formatPrice(parseFloat(value));
    }
    return value;
  };

  const getMainInfo = () => {
    switch (categoryKey) {
      case 'flights':
        return {
          title: item.airline,
          subtitle: `${item.duration || 'N/A'}`,
          details: [
            `Depart: ${item.departureTime ? new Date(item.departureTime).toLocaleString() : 'N/A'}`,
            `Arrive: ${item.arrivalTime ? new Date(item.arrivalTime).toLocaleString() : 'N/A'}`
          ]
        };
      case 'hotels':
        return {
          title: item.name,
          subtitle: item.rating ? `⭐ ${item.rating}` : '',
          details: [
            `Check-in: ${item.checkIn ? new Date(item.checkIn).toLocaleDateString() : 'N/A'}`,
            `Check-out: ${item.checkOut ? new Date(item.checkOut).toLocaleDateString() : 'N/A'}`,
            `${formatPrice(item.pricePerNight)}/night`
          ]
        };
      case 'carRentals':
        return {
          title: item.company,
          subtitle: item.carType,
          details: [
            `Pickup: ${item.pickupTime ? new Date(item.pickupTime).toLocaleString() : 'N/A'}`,
            `Return: ${item.returnTime ? new Date(item.returnTime).toLocaleString() : 'N/A'}`
          ]
        };
      case 'activities':
        return {
          title: item.name,
          subtitle: item.duration,
          details: [
            `When: ${item.dateTime ? new Date(item.dateTime).toLocaleString() : 'N/A'}`
          ]
        };
      case 'transportation':
        return {
          title: item.type,
          subtitle: item.route,
          details: [
            `Date: ${item.date ? new Date(item.date).toLocaleDateString() : 'N/A'}`,
            item.time ? `Time: ${item.time}` : ''
          ].filter(Boolean)
        };
      case 'insurance':
        return {
          title: item.provider,
          subtitle: item.coverageType,
          details: []
        };
      case 'restaurants':
        return {
          title: item.name,
          subtitle: item.cuisine,
          details: [
            item.date && item.time ? `${new Date(item.date).toLocaleDateString()} at ${item.time}` : ''
          ].filter(Boolean)
        };
      default:
        return {
          title: item.name || 'Item',
          subtitle: '',
          details: []
        };
    }
  };

  const mainInfo = getMainInfo();
  const price = item.price || item.pricePerNight || item.budgetEstimate;

  return (
    <div className={`item-card ${isSelected ? 'item-card-selected' : ''}`}>
      <div className="item-card-content">
        <div className="item-card-main">
          <h4 className="item-card-title">{mainInfo.title}</h4>
          {mainInfo.subtitle && (
            <p className="item-card-subtitle">{mainInfo.subtitle}</p>
          )}
          {mainInfo.details.length > 0 && (
            <div className="item-card-details">
              {mainInfo.details.map((detail, index) => (
                <p key={index} className="item-card-detail">{detail}</p>
              ))}
            </div>
          )}
          {item.notes && (
            <p className="item-card-notes">{item.notes}</p>
          )}
        </div>
        
        {price && (
          <div className="item-card-price">
            {formatPrice(parseFloat(price))}
          </div>
        )}
      </div>
      
      <div className="item-card-actions">
        <button 
          className={`btn-select ${isSelected ? 'btn-selected' : ''}`}
          onClick={onSelect}
        >
          {isSelected ? '✓ Selected' : 'Select'}
        </button>
        
        {item.link && (
          <a 
            href={item.link} 
            target="_blank" 
            rel="noopener noreferrer"
            className="btn-link"
            title="Open link"
          >
            🔗
          </a>
        )}
        
        <button 
          className="btn-edit"
          onClick={onEdit}
          title="Edit"
        >
          ✏️
        </button>
        
        <button 
          className="btn-delete"
          onClick={onDelete}
          title="Delete"
        >
          🗑️
        </button>
      </div>
    </div>
  );
};

export default ItemCard;

