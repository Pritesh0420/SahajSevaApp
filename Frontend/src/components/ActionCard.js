import React from 'react';
import './ActionCard.css';

export default function ActionCard({ 
  title, 
  description, 
  icon: Icon, 
  variant = 'green', 
  onPress 
}) {
  return (
    <button className={`action-card action-card-${variant}`} onClick={onPress}>
      <div className="action-card-icon-container">
        {Icon && <Icon className="action-card-icon" />}
      </div>
      <div className="action-card-content">
        <h3 className="action-card-title">{title}</h3>
        <p className="action-card-description">{description}</p>
      </div>
    </button>
  );
}
