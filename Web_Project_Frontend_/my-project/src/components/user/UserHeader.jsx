import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

// Button component
function Button({ onClick, label, isActive, to }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg shadow-md transition duration-300 transform mb-2 sm:mb-0 ${isActive ? '' : 'bg-gradient-to-r from-violet-700 to-violet-600'} hover:from-violet-600 hover:to-violet-500 text-white font-semibold`}
    >
      {label}
    </button>
  );
}

// UserHeader component
function UserHeader() {
  const navigate = useNavigate();
  const location = useLocation();  // Get current route path

  return (
    <header className="bg-gradient-to-b from-black to-violet-900 text-white shadow-lg">
      <div className="container px-4 py-4 flex">
        <div className="flex items-center space-x-4"></div>
        <nav className="flex space-x-4 flex-wrap justify-center sm:justify-start">
          <Button
            onClick={() => navigate('/userDashboard')}
            label="Dashboard"
            isActive={location.pathname === '/userDashboard'}
          />
          <Button
            onClick={() => navigate('/user/history')}
            label="History"
            isActive={location.pathname === '/user/history'}
          />
          <Button
            onClick={() => navigate('/user/subscription')}
            label="Subscription"
            isActive={location.pathname === '/user/subscription'}
          />
          <Button
            onClick={() => navigate('/user/search')}
            label="Search"
            isActive={location.pathname === '/user/search'}
          />
          <button
            onClick={() => navigate('/logout')}
            className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-semibold rounded-lg shadow-md transition duration-200 mt-2 sm:mt-0"
          >
            Logout
          </button>
        </nav>
      </div>
    </header>
  );
}

export default UserHeader;
