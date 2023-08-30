import React, { useState, useEffect } from 'react';
import './CustomNotification.css';

interface CustomNotificationProps {
    message: string;
  }
const CustomNotification: React.FC<CustomNotificationProps> = ({ message }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(true);
    const timer = setTimeout(() => {
      setShow(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`custom-notification ${show ? 'show' : ''}`}>
      {message}
    </div>
  );
};

export default CustomNotification;
