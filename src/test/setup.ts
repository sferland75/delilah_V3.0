import '@testing-library/jest-dom';
import { configure } from '@testing-library/react';

// Configure testing-library
configure({
  testIdAttribute: 'data-testid',
  computedStyleSupportsPseudoElements: true,
});

// Mock UI components
jest.mock('@/components/ui/accordion', () => {
  const React = require('react');
  return {
    Accordion: ({ children, type = 'single', className }) => 
      React.createElement('div', { 
        'data-testid': 'accordion', 
        'data-type': type, 
        className 
      }, children),
    AccordionItem: ({ children, value, ...props }) => 
      React.createElement('div', { 
        'data-testid': 'accordion-item', 
        'data-value': value,
        ...props 
      }, children),
    AccordionTrigger: ({ children, ...props }) => 
      React.createElement('button', { 
        type: 'button',
        role: 'button',
        ...props 
      }, children),
    AccordionContent: ({ children }) => 
      React.createElement('div', {
        'data-testid': 'accordion-content'
      }, children),
  };
});

jest.mock('@/components/ui/label', () => {
  const React = require('react');
  return {
    Label: ({ children, htmlFor }) => 
      React.createElement('label', { htmlFor }, children),
  };
});

jest.mock('@/components/ui/input', () => {
  const React = require('react');
  return {
    Input: (props) => React.createElement('input', props),
  };
});

jest.mock('@/components/ui/button', () => {
  const React = require('react');
  return {
    Button: ({ children, ...props }) => 
      React.createElement('button', { type: 'button', ...props }, children),
  };
});

jest.mock('@/components/ui/select', () => {
  const React = require('react');
  return {
    Select: ({ children, value, onChange, ...props }) => 
      React.createElement('select', { value, onChange, ...props }, children),
    SelectTrigger: ({ children }) => 
      React.createElement('div', { role: 'combobox' }, children),
    SelectValue: ({ children, placeholder }) => 
      React.createElement('span', null, children || placeholder),
    SelectContent: ({ children }) => 
      React.createElement('div', null, children),
    SelectItem: ({ children, value }) => 
      React.createElement('option', { value }, children),
  };
});

jest.mock('@/components/ui/tabs', () => {
  const React = require('react');
  return {
    Tabs: ({ children, defaultValue, className }) => 
      React.createElement('div', {
        'data-testid': 'tabs',
        'data-default-tab': defaultValue,
        className
      }, children),
    TabsList: ({ children }) => 
      React.createElement('div', {
        role: 'tablist',
        'data-testid': 'tabs-list'
      }, children),
    TabsTrigger: ({ children, value }) => 
      React.createElement('button', {
        role: 'tab',
        'data-testid': `${value}-tab-button`,
        'data-value': value
      }, children),
    TabsContent: ({ children, value }) => 
      React.createElement('div', {
        role: 'tabpanel',
        'data-testid': `${value}-tab-panel`,
        'data-value': value
      }, children),
  };
});

jest.mock('@/components/ui/card', () => {
  const React = require('react');
  return {
    Card: ({ children, className }) => 
      React.createElement('div', { className }, children),
    CardHeader: ({ children }) => 
      React.createElement('div', null, children),
    CardTitle: ({ children, ...props }) => 
      React.createElement('h2', props, children),
    CardContent: ({ children }) => 
      React.createElement('div', null, children),
  };
});

jest.mock('@/components/ui/textarea', () => {
  const React = require('react');
  return {
    Textarea: (props) => React.createElement('textarea', props),
  };
});

// Mock Lucide React icons
jest.mock('lucide-react', () => {
  const React = require('react');
  const icons = {
    ClipboardIcon: (props) => React.createElement('div', { 'data-testid': 'icon-clipboard', ...props }),
    ActivityIcon: (props) => React.createElement('div', { 'data-testid': 'icon-activity', ...props }),
    BrainIcon: (props) => React.createElement('div', { 'data-testid': 'icon-brain', ...props }),
    HeartIcon: (props) => React.createElement('div', { 'data-testid': 'icon-heart', ...props })
  };
  return icons;
});