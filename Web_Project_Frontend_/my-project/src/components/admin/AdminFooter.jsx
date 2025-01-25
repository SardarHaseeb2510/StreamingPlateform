import React from 'react';

function AdminFooter() {
  return (
    <footer className="bg-gradient-to-b from-black to-violet-900 text-gray-200 py-4">
      <div className="container mx-auto text-center">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} Digital Cinema. All rights reserved.
        </p>
        <div className="mt-2 space-x-4 flex justify-center">
          {/* Uncomment and modify the links if needed */}
          {/* <a href="#" className="text-gray-400 hover:text-gray-300 transition duration-200">Privacy Policy</a>
          <a href="#" className="text-gray-400 hover:text-gray-300 transition duration-200">Terms of Service</a>
          <a href="#" className="text-gray-400 hover:text-gray-300 transition duration-200">Contact Us</a> */}
        </div>
      </div>
    </footer>
  );
}

export default AdminFooter;
