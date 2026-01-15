import React from 'react';
import ComparisonSection from './ComparisonSection';
import PriceCalculator from './PriceCalculator';
import { CATEGORIES } from '../utils/categoryConfig';
import '../styles/components/VacationDetails.css';

const VacationDetails = ({ 
  vacation, 
  onSelectItem,
  onAddItem,
  onEditItem,
  onDeleteItem,
  currency = '$'
}) => {
  const standardCategories = Object.keys(CATEGORIES);

  return (
    <div className="vacation-details">
      <div className="vacation-details-content">
        {/* Standard Categories */}
        {standardCategories.map(categoryKey => (
          <ComparisonSection
            key={categoryKey}
            title={CATEGORIES[categoryKey].name}
            categoryKey={categoryKey}
            items={vacation[categoryKey] || []}
            selectedId={vacation.selectedOptions?.[categoryKey]}
            onSelect={(itemId) => onSelectItem(categoryKey, itemId)}
            onAdd={() => onAddItem(categoryKey)}
            onEdit={(item) => onEditItem(categoryKey, item)}
            onDelete={(itemId) => onDeleteItem(categoryKey, itemId)}
            currency={currency}
          />
        ))}

        {/* Custom Categories */}
        {vacation.customCategories && Object.entries(vacation.customCategories).map(([categoryName, items]) => (
          <ComparisonSection
            key={`custom_${categoryName}`}
            title={categoryName}
            categoryKey={`custom_${categoryName}`}
            items={items || []}
            selectedId={vacation.selectedOptions?.[`custom_${categoryName}`]}
            onSelect={(itemId) => onSelectItem(`custom_${categoryName}`, itemId)}
            onAdd={() => onAddItem(`custom_${categoryName}`, categoryName)}
            onEdit={(item) => onEditItem(`custom_${categoryName}`, item, categoryName)}
            onDelete={(itemId) => onDeleteItem(`custom_${categoryName}`, itemId, categoryName)}
            currency={currency}
          />
        ))}

        {/* Add Custom Category Button */}
        <div className="add-custom-category">
          <button 
            className="btn-add-custom-category"
            onClick={() => onAddItem('_newCustomCategory')}
          >
            + Add Custom Category
          </button>
        </div>
      </div>

      {/* Sticky Price Calculator */}
      <div className="vacation-details-sidebar">
        <div className="sticky-sidebar">
          <PriceCalculator vacation={vacation} currency={currency} />
        </div>
      </div>
    </div>
  );
};

export default VacationDetails;

