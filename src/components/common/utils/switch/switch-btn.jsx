import React, { useState } from 'react';
import './style.scss'; // Import the CSS file for styling
import { FileText } from 'react-feather';

const SwitchButton = ({ value, onChange }) => {
  const [isOn, setIsOn] = useState(value)

  const handleToggle = () => {
    let newValue = !isOn
    
    setIsOn(newValue)
    onChange(newValue)
  }

  return (
    <div className={`switch-button ${isOn ? 'on' : 'off'}`} onClick={handleToggle}>
      <div className="slider">
        <FileText style={{width: '20px'}}/>
      </div>
    </div>
  );
};

export default SwitchButton