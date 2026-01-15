import React from 'react';
import ItemCard from './ItemCard';
import { formatPrice } from '../utils/priceCalculator';
import { getCategoryIcon } from '../utils/categoryConfig';
import '../styles/components/ComparisonSection.css';

const ComparisonSection = ({ 
  title, 
  categoryKey,
  items, 
  selectedId, 
  onSelect, 
  onAdd, 
  onEdit, 
  onDelete,
  currency = '$'
}) => {
  const formatPriceWithCurrency = (price) => formatPrice(price, currency);

  return (
    <div className="comparison-section">
      <div className="comparison-header">
        <h3 className="comparison-title">
          <span className="comparison-icon">{getCategoryIcon(categoryKey)}</span>
          {title}
        </h3>
        <button className="btn-add-item" onClick={onAdd}>
          + Add {title}
        </button>
      </div>
      
      {items && items.length > 0 ? (
        <div className="comparison-grid">
          {items.map(item => (
            <ItemCard
              key={item.id}
              item={item}
              categoryKey={categoryKey}
              isSelected={item.id === selectedId}
              onSelect={() => onSelect(item.id)}
              onEdit={() => onEdit(item)}
              onDelete={() => onDelete(item.id)}
              formatPrice={formatPriceWithCurrency}
            />
          ))}
        </div>
      ) : (
        <div className="comparison-empty">
          <p>No {title.toLowerCase()} added yet</p>
          <button className="btn-add-first" onClick={onAdd}>
            + Add your first {title.toLowerCase().replace(/s$/, '')}
          </button>
        </div>
      )}
    </div>
  );
};

export default ComparisonSection;

