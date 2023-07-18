import React, { useState } from 'react';
import './style.scss'; // Import the CSS file for styling
import { CheckSquare, FileText, Package } from 'react-feather';

const SwitchButton = ({ value, onChange, icon }) => {
  const [isOn, setIsOn] = useState(value)
  const iconMap = {
    FileText: FileText,
    Package: Package,
    CheckSquare: CheckSquare,
  }

  const SelectedIcon = iconMap[icon] || FileText

  const handleToggle = () => {
    let newValue = !isOn
    
    setIsOn(newValue)
    onChange(newValue)
  }

  return (
    <div className={`switch-button ${isOn ? 'on' : 'off'}`} onClick={handleToggle}>
      <div className="slider">
        <SelectedIcon style={{width: '20px'}}/>
      </div>
    </div>
  );
};

export default SwitchButton