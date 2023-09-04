import React from 'react';
import './CustomNotification.css';

interface CustomNotificationProps {
    message: string;
  }
const CustomNotification: React.FC<CustomNotificationProps> = ({ message }) => {
  
  return (
    <div className='custom-notification'>
      {message}
    </div>
  );
};

export default CustomNotification;
