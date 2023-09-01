import './Header.css'
import React from 'react';

const Header: React.FC = () => {
  
    return (
        <header className="header">
          <div className="header__logo">
            <img src="/ping-logo3.png" alt="Logo" className="logo" />
          </div>
        </header>
      );
    };
  
  export default Header;