import React from 'react';
import './BigButton.css';

export default function BigButton({ 
  title, 
  onPress, 
  variant = 'primary', 
  icon, 
  disabled = false,
  style 
}) {
  const Icon = icon;
  
  return (
    <button
      className={`big-button big-button-${variant}`}
      onClick={onPress}
      disabled={disabled}
      style={style}
    >
      {Icon && <Icon className="big-button-icon" />}
      <span className="big-button-text">{title}</span>
    </button>
  );
}
