import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router';
import './App.css';

const Landing = ({ onEnter }) => {
   const navigate = useNavigate();

  const handleEnterClick = () => {
    if (onEnter) onEnter();       // Starts loading
    navigate('/folio');           // Triggers routing
  };

  return (
    <div className="glitch-container">
      <h2>SEYITAN ADELEKE'S MAKER FOLIO</h2>
      <button className="glitch_button hover-target--fill distort-hover" onClick={handleEnterClick}>
        ENTER
      </button>
    </div>
  );
};

export default Landing;
