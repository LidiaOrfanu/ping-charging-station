import React from 'react';
import { Link } from 'react-router-dom';
import './PageNotFound.css';

const PageNotFound: React.FC = () => {
  return (
    <div className="page-not-found">
      <h1 className="page-not-found__title">Not Found</h1>
      <p className="page-not-found__message">Unfortunately, the page you are looking for is not available.</p>
      <Link to="/" className="page-not-found__link">Back to homepage</Link>
    </div>
  );
};

export default PageNotFound;