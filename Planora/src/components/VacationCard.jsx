import React, { useState } from 'react';
import VacationDetails from './VacationDetails';
import { calculateVacationTotal, formatPrice } from '../utils/priceCalculator';
import { getDestinationImage } from '../utils/destinationImages';
import '../styles/components/VacationCard.css';

const VacationCard = ({ 
  vacation, 
  onUpdate,
  onDelete,
  onSelectItem,
  onAddItem,
  onEditItem,
  onDeleteItem,
  currency = '$'
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { total } = calculateVacationTotal(vacation);

  const formatDateRange = () => {
    if (!vacation.startDate || !vacation.endDate) return 'Dates not set';
    const start = new Date(vacation.startDate).toLocaleDateString();
    const end = new Date(vacation.endDate).toLocaleDateString();
    return `${start} - ${end}`;
  };

  const getDaysUntil = () => {
    if (!vacation.startDate) return null;
    const now = new Date();
    const start = new Date(vacation.startDate);
    const daysUntil = Math.ceil((start - now) / (1000 * 60 * 60 * 24));
    
    if (daysUntil < 0) return null;
    if (daysUntil === 0) return 'Today!';
    if (daysUntil === 1) return 'Tomorrow!';
    return `${daysUntil} days`;
  };

  const daysUntil = getDaysUntil();

  const destinationImage = getDestinationImage(vacation.destination);

  return (
    <div className="vacation-card">
      <div 
        className="vacation-card-image"
        style={{ backgroundImage: `url(${destinationImage})` }}
        role="img"
        aria-label={`${vacation.destination} destination`}
      >
        <div className="vacation-card-image-overlay">
          <h2 className="vacation-card-title">{vacation.name}</h2>
          <p className="vacation-card-destination">📍 {vacation.destination}</p>
        </div>
      </div>
      
      <div className="vacation-card-header">
        <div className="vacation-card-info">
          <p className="vacation-card-dates">📅 {formatDateRange()}</p>
          {daysUntil && (
            <p className="vacation-card-countdown">⏳ {daysUntil}</p>
          )}
        </div>
        
        <div className="vacation-card-actions">
          <div className="vacation-card-total">
            <span className="total-label">Total</span>
            <span className="total-amount">{formatPrice(total, currency)}</span>
          </div>
          <div className="vacation-card-buttons">
            <button 
              className="btn-expand"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? '▲ Collapse' : '▼ Expand'}
            </button>
            <button 
              className="btn-edit-vacation"
              onClick={() => onUpdate(vacation)}
              title="Edit vacation details"
            >
              ✏️
            </button>
            <button 
              className="btn-delete-vacation"
              onClick={() => {
                if (window.confirm(`Delete "${vacation.name}"? This cannot be undone.`)) {
                  onDelete(vacation.id);
                }
              }}
              title="Delete vacation"
            >
              🗑️
            </button>
          </div>
        </div>
      </div>

      {isExpanded && (
        <VacationDetails
          vacation={vacation}
          onSelectItem={onSelectItem}
          onAddItem={onAddItem}
          onEditItem={onEditItem}
          onDeleteItem={onDeleteItem}
          currency={currency}
        />
      )}
    </div>
  );
};

export default VacationCard;

