import React, { useCallback } from 'react';
import './Header.css';

interface HeaderProps {
  onAddStationClick?: () => void;
  onAddLocationClick?: () => void;
  onDeleteStationClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onAddStationClick, onDeleteStationClick, onAddLocationClick = () => {} }) => {
  const handleAddStationClick = useCallback(() => {
    if (onAddStationClick) {
      onAddStationClick();
    }
  }, [onAddStationClick]);

  const handleAddLocationClick = useCallback(() => {
    if (onAddLocationClick) {
      onAddLocationClick();
    }
  }, [onAddLocationClick]);

  const handleDeleteStationClick  = useCallback(() => {
    if (onDeleteStationClick) {
      onDeleteStationClick();
    }
  }, [onDeleteStationClick]);

  return (
    <header className="header">
      <div className="header__logo">
        <img src="/ping-logo3.png" alt="Logo" className="logo" />
      </div>
      <div>
      <button onClick={handleAddStationClick} className="add-button">
        Add Station
      </button>
      <button onClick={handleAddStationClick} className="edit-button">
        Edit Station
      </button>
      <button onClick={handleDeleteStationClick} className="delete-button">
        Delete Station
      </button>
      <button onClick={handleAddLocationClick} className="add-button">
        Add Location
      </button>
      <button onClick={handleAddStationClick} className="edit-button">
        Edit Location
      </button>
      <button onClick={handleAddStationClick} className="delete-button">
        Delete Location
      </button>

      </div>
    </header>
  );
};

export default Header;
