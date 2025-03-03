import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Menu, X, ChevronDown } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  
  const isActive = (path) => {
    return router.pathname === path ? 'bg-primary text-primary-foreground' : 'hover:bg-muted';
  };

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Full Assessment', path: '/full-assessment' },
    { 
      name: 'Import Tools', 
      path: '#',
      submenu: [
        { name: 'Basic PDF Import', path: '/import-pdf' },
        { name: 'Enhanced PDF Import', path: '/enhanced-import' },
        { name: 'Referral Import', path: '/import/referral' }
      ]
    },
    { name: 'Report Drafting', path: '/report-drafting' }
  ];

  return (
    <nav className="bg-background shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-2xl font-bold text-primary">
                Delilah V3.0
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-4">
              {navItems.map((item) => {
                if (item.submenu) {
                  return (
                    <div key={item.name} className="relative group">
                      <button className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${isActive(item.path)}`}>
                        {item.name}
                        <ChevronDown className="ml-1 h-4 w-4" />
                      </button>
                      <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-background ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition duration-150 ease-in-out z-50">
                        <div className="py-1">
                          {item.submenu.map((subitem) => (
                            <Link 
                              key={subitem.name} 
                              href={subitem.path}
                              className={`block px-4 py-2 text-sm ${router.pathname === subitem.path ? 'bg-muted font-medium' : 'hover:bg-muted'}`}
                            >
                              {subitem.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                }
                return (
                  <Link
                    key={item.name}
                    href={item.path}
                    className={`px-3 py-2 rounded-md text-sm font-medium ${isActive(item.path)}`}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
          <div className="flex items-center sm:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-muted-foreground hover:text-primary hover:bg-muted focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="sm:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => {
              if (item.submenu) {
                return (
                  <div key={item.name} className="space-y-1">
                    <div className="px-3 py-2 text-sm font-medium">{item.name}</div>
                    <div className="pl-4 space-y-1">
                      {item.submenu.map((subitem) => (
                        <Link
                          key={subitem.name}
                          href={subitem.path}
                          className={`block px-3 py-2 rounded-md text-sm font-medium ${isActive(subitem.path)}`}
                          onClick={toggleMenu}
                        >
                          {subitem.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              }
              return (
                <Link
                  key={item.name}
                  href={item.path}
                  className={`block px-3 py-2 rounded-md text-sm font-medium ${isActive(item.path)}`}
                  onClick={toggleMenu}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
