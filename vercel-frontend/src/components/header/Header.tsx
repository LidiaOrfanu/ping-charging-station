import { useNavigate } from 'react-router-dom';
import './Header.css'
import SearchBar from '../search/SearchBar';
import React from 'react';

const Header: React.FC = () => {
    const navigate = useNavigate();
  
    const handleSearch = async () => {

          navigate('/not-found');
    };
  
    return (
        <header className="header">
          <div className="header__logo">
            <img src="/ping-logo3.png" alt="Logo" className="logo" />
          </div>
          <div className="header-content">
            <SearchBar onSearch={handleSearch} />
          </div>
        </header>
      );
    };
  
  export default Header;