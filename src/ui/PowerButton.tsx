import React from "react";
import "./PowerButton.css";

interface PowerButtonProps {
  isOn?: boolean;
  onClick?: () => void;
  className?: string;
}

const PowerButton: React.FC<PowerButtonProps> = ({ isOn = false, onClick, className = "" }) => {
  return (
    <button 
      className={`power-button ${isOn ? "active" : ""} ${className}`}
      onClick={onClick}
      aria-label={isOn ? "Turn off" : "Turn on"}
    >
      <div className="power-icon">
        <span className="power-ring"></span>
        <span className="power-line"></span>
      </div>
    </button>
  );
};

export default PowerButton;
