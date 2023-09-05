import React, { useCallback } from 'react';
import './Header.css';

interface HeaderProps {
  onAddStationClick?: () => void;
  onAddLocationClick?: () => void;
  onDeleteStationClick?: () => void;
  onDeleteLocationClick?: () => void;
  onEditLocationClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onAddStationClick, onDeleteStationClick, onAddLocationClick, onDeleteLocationClick, onEditLocationClick = () => {} }) => {
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

  const handleDeleteLocationClick  = useCallback(() => {
    if (onDeleteLocationClick) {
      onDeleteLocationClick();
    }
  }, [onDeleteLocationClick]);

  const handleEditLocationClick  = useCallback(() => {
    if (onEditLocationClick) {
      onEditLocationClick();
    }
  }, [onEditLocationClick]);

  const buttons = [
    {
      text: 'Add Station',
      onClick: handleAddStationClick,
      type: 'add',
    },
    {
      text: 'Delete Station',
      onClick: handleDeleteStationClick,
      type: 'delete',
    },
    {
      text: 'Add Location',
      onClick: handleAddLocationClick,
      type: 'add',
    },
    {
      text: 'Delete Location',
      onClick: handleDeleteLocationClick,
      type: 'delete',
    },
    {
      text: 'Edit Location',
      onClick: handleEditLocationClick,
      type: 'edit',
    },
  ];
  
  return (
    <header className="header">
      <div className="header__logo">
        <img src="/ping-logo3.png" alt="Logo" className="logo" />
      </div>
      <div>
        {buttons.map((button) => (
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
