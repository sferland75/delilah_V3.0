// This wrapper resolves the casing conflict between navbar.js and Navbar.js
import React from 'react';

// Try to import both casing options and use whichever one works
let NavbarComponent;

try {
  // First try uppercase
  const UpperCaseNavbar = require('../Navbar');
  NavbarComponent = UpperCaseNavbar.default || UpperCaseNavbar;
} catch (error) {
  try {
    // Then try lowercase
    const LowerCaseNavbar = require('../navbar');
    NavbarComponent = LowerCaseNavbar.default || LowerCaseNavbar;
  } catch (secondError) {
    // Fallback if neither exists
    NavbarComponent = ({ children }) => (
      <nav className="bg-white shadow-md p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="font-bold text-xl">Delilah V3.0</div>
          <div className="flex space-x-4">
            {children}
          </div>
        </div>
      </nav>
    );
    console.error("Navbar component not found - using fallback", secondError);
  }
}

const NavbarWrapper = (props) => {
  return <NavbarComponent {...props} />;
};

export default NavbarWrapper;
