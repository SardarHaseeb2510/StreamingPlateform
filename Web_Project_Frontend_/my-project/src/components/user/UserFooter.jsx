import React from 'react';

function UserFooter() {
  return (
    <footer className="bg-gradient-to-b from-violet-900 to-black text-gray-200 py-4">
      <div className="container mx-auto text-center">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} Digital Cinema. All rights reserved.
        </p>
        {/* Uncomment if needed */}
        {/* <div className="mt-2 space-x-4">
          <a href="#" className="text-gray-400 hover:text-gray-300 transition duration-200">Privacy Policy</a>
          <a href="#" className="text-gray-400 hover:text-gray-300 transition duration-200">Terms of Service</a>
          <a href="#" className="text-gray-400 hover:text-gray-300 transition duration-200">Contact Us</a>
        </div> */}
      </div>
    </footer>
  );
}

export default UserFooter;
