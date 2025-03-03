import React, { useState, useEffect } from 'react';

export const Tabs: React.FC<any> = ({ defaultValue, children }) => {
  const [activeTab, setActiveTab] = useState(defaultValue);

  // Update active tab when defaultValue changes
  useEffect(() => {
    setActiveTab(defaultValue);
  }, [defaultValue]);

  return (
    <div data-testid="mock-tabs" data-active-tab={activeTab}>
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { activeTab, setActiveTab });
        }
        return child;
      })}
    </div>
  );
};

export const TabsList: React.FC<any> = ({ children, className }) => (
  <div data-testid="mock-tabs-list" className={className}>
    {children}
  </div>
);

export const TabsTrigger: React.FC<any> = ({ value, children, activeTab, setActiveTab, ...props }) => (
  <button
    type="button"
    onClick={() => setActiveTab?.(value)}
    data-testid={props['data-testid']}
    data-state={activeTab === value ? 'active' : 'inactive'}
    {...props}
  >
    {children}
  </button>
);

export const TabsContent: React.FC<any> = ({ value, children, activeTab, ...props }) => (
  <div
    style={{ display: activeTab === value ? 'block' : 'none' }}
    data-testid={props['data-testid']}
    {...props}
  >
    {children}
  </div>
);