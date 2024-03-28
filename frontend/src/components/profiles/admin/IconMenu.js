import React, { useState } from 'react';
import './icon.css'
const IconMenu = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionSelect = () => {
    setIsOpen(false);
  };

  return (
    <div className="icon-menu">
      <div className={`menu-icon ${isOpen ? 'open' : ''}`} onClick={toggleMenu}>
        <div></div>
        <div></div>
        <div></div>
      </div>
      <div className={`menu-options ${isOpen ? 'open' : ''}`}>
        {React.Children.map(children, (child) =>
          React.cloneElement(child, { onOptionSelect: handleOptionSelect })
        )}
      </div>
    </div>
  );
};

export default IconMenu;