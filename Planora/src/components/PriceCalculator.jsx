import React from 'react';
import { calculateVacationTotal, formatPrice } from '../utils/priceCalculator';
import { getCategoryDisplayName } from '../utils/categoryConfig';
import '../styles/components/PriceCalculator.css';

const PriceCalculator = ({ vacation, currency = '$' }) => {
  const { total, breakdown } = calculateVacationTotal(vacation);
  
  const hasSelections = Object.keys(breakdown).length > 0;
  
  return (
    <div className="price-calculator">
      <div className="price-calculator-header">
        <h3>Total Cost</h3>
        <div className="price-total">{formatPrice(total, currency)}</div>
      </div>
      
      {hasSelections && (
        <div className="price-breakdown">
          <h4>Breakdown</h4>
          <ul className="price-breakdown-list">
            {Object.entries(breakdown).map(([category, amount]) => (
              <li key={category} className="price-breakdown-item">
                <span className="breakdown-category">
                  {getCategoryDisplayName(category.replace('custom_', ''))}
                </span>
                <span className="breakdown-amount">{formatPrice(amount, currency)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {!hasSelections && (
        <p className="price-empty">Select options from each category to see the total cost</p>
      )}
    </div>
  );
};

export default PriceCalculator;

