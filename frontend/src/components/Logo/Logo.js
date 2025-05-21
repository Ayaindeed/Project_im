import React from 'react';
import logo from '../../assets/logo.png'; 

const Logo = ({ width = '150px' }) => {
  return (
    <img 
      src={logo} 
      alt="InternMatch" 
      style={{ width: width }}
    />
  );
};

export default Logo;