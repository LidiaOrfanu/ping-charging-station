import React, { useState } from 'react';
import './Header.css';



const Header = () => {  const [buttons, ] = useState([
    {
      text: 'Add Station',
      onClick: () => {},
      type: 'add',
    },
    {
      text: 'Delete Station',
      onClick: () => {},
      type: 'delete',
    },
    {
      text: 'Add Location',
      onClick: () => {},
      type: 'add',
    },
    {
      text: 'Delete Location',
      onClick: () => {},
      type: 'delete',
    },
    {
      text: 'Edit Location',
      onClick: () => {},
      type: 'edit',
    },
  ]);

  return (
    <header className="header">
      <div className="header__logo">
        <img src="/ping-logo3.png" alt="Logo" className="logo" />
      </div>
      <div>
      {buttons.map((button: { text: string, onClick: () => void, type: string }) => (
          <button
            key={button.text}
            className={`${button.type}-button`}
            onClick={button.onClick}
          >
            {button.text}
          </button>
        ))}
      </div>
    </header>
  );
};

export default Header;
