import React, { useState, useEffect } from 'react';
import { generateId } from '../utils/categoryConfig';
import '../styles/components/VacationModal.css';

const VacationModal = ({ 
  isOpen, 
  onClose, 
  onSave, 
  editingVacation = null
}) => {
  const [formData, setFormData] = useState({
    name: '',
    destination: '',
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    if (editingVacation) {
      setFormData({
        name: editingVacation.name || '',
        destination: editingVacation.destination || '',
        startDate: editingVacation.startDate || '',
        endDate: editingVacation.endDate || ''
      });
    } else {
      setFormData({
        name: '',
        destination: '',
        startDate: '',
        endDate: ''
      });
    }
  }, [editingVacation, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const vacationData = {
      ...formData,
      id: editingVacation?.id || generateId(),
      flights: editingVacation?.flights || [],
      hotels: editingVacation?.hotels || [],
      carRentals: editingVacation?.carRentals || [],
      activities: editingVacation?.activities || [],
      transportation: editingVacation?.transportation || [],
      insurance: editingVacation?.insurance || [],
      restaurants: editingVacation?.restaurants || [],
      customCategories: editingVacation?.customCategories || {},
      selectedOptions: editingVacation?.selectedOptions || {}
    };

    onSave(vacationData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content vacation-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{editingVacation ? 'Edit Vacation' : 'New Vacation'}</h2>
          <button className="btn-close-modal" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="name">Vacation Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Paris Summer 2026"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="destination">Destination *</label>
            <input
              type="text"
              id="destination"
              name="destination"
              value={formData.destination}
              onChange={handleChange}
              placeholder="e.g., Paris, France"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="startDate">Start Date *</label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="endDate">End Date *</label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              required
              min={formData.startDate}
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-save">
              {editingVacation ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VacationModal;

