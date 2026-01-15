import React, { useState, useEffect } from 'react';
import { CATEGORIES, generateId } from '../utils/categoryConfig';
import '../styles/components/AddItemModal.css';

const AddItemModal = ({ 
  isOpen, 
  onClose, 
  onSave, 
  categoryKey,
  customCategoryName,
  editingItem = null
}) => {
  const [formData, setFormData] = useState({});
  const [customFields, setCustomFields] = useState([]);
  const [newCustomCategoryName, setNewCustomCategoryName] = useState('');

  const isNewCustomCategory = categoryKey === '_newCustomCategory';
  const isCustomCategory = categoryKey?.startsWith('custom_');
  const category = isCustomCategory && !isNewCustomCategory 
    ? null 
    : CATEGORIES[categoryKey];

  useEffect(() => {
    if (editingItem) {
      setFormData(editingItem);
      if (isCustomCategory && editingItem.customFields) {
        setCustomFields(editingItem.customFields);
      }
    } else {
      setFormData({});
      setCustomFields([{ name: '', value: '' }]);
      setNewCustomCategoryName('');
    }
  }, [editingItem, isOpen, categoryKey, isCustomCategory]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCustomFieldChange = (index, field, value) => {
    const updated = [...customFields];
    updated[index][field] = value;
    setCustomFields(updated);
  };

  const addCustomField = () => {
    setCustomFields([...customFields, { name: '', value: '' }]);
  };

  const removeCustomField = (index) => {
    setCustomFields(customFields.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (isNewCustomCategory) {
      if (!newCustomCategoryName.trim()) {
        alert('Please enter a category name');
        return;
      }
      onSave(newCustomCategoryName.trim(), null);
      onClose();
      return;
    }

    const itemData = {
      ...formData,
      id: editingItem?.id || generateId()
    };

    if (isCustomCategory) {
      itemData.customFields = customFields.filter(f => f.name && f.value);
    }

    onSave(itemData, customCategoryName);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>
            {isNewCustomCategory 
              ? 'Add Custom Category'
              : editingItem 
                ? `Edit ${customCategoryName || category?.name}` 
                : `Add ${customCategoryName || category?.name}`
            }
          </h2>
          <button className="btn-close-modal" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          {isNewCustomCategory ? (
            <div className="form-group">
              <label htmlFor="categoryName">Category Name *</label>
              <input
                type="text"
                id="categoryName"
                value={newCustomCategoryName}
                onChange={(e) => setNewCustomCategoryName(e.target.value)}
                placeholder="e.g., Visas, Gear, Souvenirs"
                required
              />
            </div>
          ) : isCustomCategory ? (
            <>
              <div className="form-group">
                <label htmlFor="name">Item Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name || ''}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="price">Price *</label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price || ''}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="link">Link (optional)</label>
                <input
                  type="url"
                  id="link"
                  name="link"
                  value={formData.link || ''}
                  onChange={handleChange}
                  placeholder="https://..."
                />
              </div>

              <div className="custom-fields-section">
                <h3>Additional Fields</h3>
                {customFields.map((field, index) => (
                  <div key={index} className="custom-field-row">
                    <input
                      type="text"
                      placeholder="Field name"
                      value={field.name}
                      onChange={(e) => handleCustomFieldChange(index, 'name', e.target.value)}
                    />
                    <input
                      type="text"
                      placeholder="Value"
                      value={field.value}
                      onChange={(e) => handleCustomFieldChange(index, 'value', e.target.value)}
                    />
                    <button 
                      type="button" 
                      className="btn-remove-field"
                      onClick={() => removeCustomField(index)}
                    >
                      ✕
                    </button>
                  </div>
                ))}
                <button 
                  type="button" 
                  className="btn-add-field"
                  onClick={addCustomField}
                >
                  + Add Field
                </button>
              </div>
            </>
          ) : category ? (
            category.fields.map(field => (
              <div key={field.name} className="form-group">
                <label htmlFor={field.name}>
                  {field.label} {field.required && '*'}
                </label>
                {field.type === 'textarea' ? (
                  <textarea
                    id={field.name}
                    name={field.name}
                    value={formData[field.name] || ''}
                    onChange={handleChange}
                    placeholder={field.placeholder}
                    required={field.required}
                    rows="3"
                  />
                ) : (
                  <input
                    type={field.type}
                    id={field.name}
                    name={field.name}
                    value={formData[field.name] || ''}
                    onChange={handleChange}
                    placeholder={field.placeholder}
                    required={field.required}
                    min={field.min}
                    max={field.max}
                    step={field.step}
                  />
                )}
              </div>
            ))
          ) : null}

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-save">
              {editingItem ? 'Update' : isNewCustomCategory ? 'Create Category' : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddItemModal;

