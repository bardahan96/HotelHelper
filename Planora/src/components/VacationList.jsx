import React from 'react';
import VacationCard from './VacationCard';
import '../styles/components/VacationList.css';

const VacationList = ({ 
  vacations, 
  onUpdate,
  onDelete,
  onAddVacation,
  onSelectItem,
  onAddItem,
  onEditItem,
  onDeleteItem,
  currency = '$'
}) => {
  return (
    <div className="vacation-list">
      <div className="vacation-list-header">
        <button className="btn-add-vacation" onClick={onAddVacation}>
          + New Vacation
        </button>
      </div>

      {vacations && vacations.length > 0 ? (
        <div className="vacation-list-grid">
          {vacations.map(vacation => (
            <VacationCard
              key={vacation.id}
              vacation={vacation}
              onUpdate={onUpdate}
              onDelete={onDelete}
              onSelectItem={(category, itemId) => onSelectItem(vacation.id, category, itemId)}
              onAddItem={(category, customName) => onAddItem(vacation.id, category, customName)}
              onEditItem={(category, item, customName) => onEditItem(vacation.id, category, item, customName)}
              onDeleteItem={(category, itemId, customName) => onDeleteItem(vacation.id, category, itemId, customName)}
              currency={currency}
            />
          ))}
        </div>
      ) : (
        <div className="vacation-list-empty">
          <div className="empty-state">
            <div className="empty-icon">✈️</div>
            <h2>No Vacations Yet</h2>
            <p>Start planning your dream vacation by creating your first trip!</p>
            <button className="btn-create-first" onClick={onAddVacation}>
              + Create Your First Vacation
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VacationList;

