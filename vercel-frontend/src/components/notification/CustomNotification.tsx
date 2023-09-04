import React from 'react';
import './CustomNotification.css';

interface CustomNotificationProps {
    message: string;
  }
const CustomNotification: React.FC<CustomNotificationProps> = ({ message }) => {
  console.log('successss')
  return (
    <div className='custom-notification'>
      {message}
    </div>
  );
};

export default CustomNotification;
