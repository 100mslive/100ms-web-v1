import React from 'react';
import {getContrastYIQ} from "./../../changeTheme"
const ControlButton = ({ icon, label, activeIcon, isActive, onClick }) => {
  return (
    <button
      className="flex flex-col justify-between items-center w-12"
      onClick={onClick}
    >
      <div
        className={`w-10 h-10 rounded-lg flex items-center justify-center hover:bg-red-500 hover:text-red-100 transition duration-100 ease-in ${
          isActive ?'bg-red-500':'bg-indigo-900'
        }`}
        style={(!isActive&&process.env.NEXT_PUBLIC_SECONDARY_COLOR)?{
          backgroundColor:process.env.NEXT_PUBLIC_SECONDARY_COLOR,
          color:getContrastYIQ(process.env.NEXT_PUBLIC_SECONDARY_COLOR)?'black':'white'
        }:{}}
      >
        {isActive ? activeIcon :icon}
      </div>
      <div className="pt-1">
        <span className="text-xs text-indigo-100">{label}</span>
      </div>
    </button>
  );
};

export { ControlButton };
