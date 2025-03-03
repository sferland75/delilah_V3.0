const React = require('react');

// Mock Accordion components
exports.Accordion = function Accordion(props) {
  return React.createElement('div', {
    'data-testid': 'accordion',
    className: props.className
  }, props.children);
};

exports.AccordionItem = function AccordionItem(props) {
  return React.createElement('div', {
    'data-testid': 'accordion-item',
    'data-value': props.value,
    className: props.className
  }, props.children);
};

exports.AccordionTrigger = function AccordionTrigger(props) {
  return React.createElement('button', {
    'data-testid': 'accordion-trigger',
    className: props.className
  }, props.children);
};

exports.AccordionContent = function AccordionContent(props) {
  return React.createElement('div', {
    'data-testid': 'accordion-content',
    className: props.className
  }, props.children);
};

// Mock Card component
exports.Card = function Card(props) {
  return React.createElement('div', {
    'data-testid': 'card',
    className: props.className
  }, props.children);
};

// Mock Input component
exports.Input = function Input(props) {
  return React.createElement('input', {
    'data-testid': 'input',
    ...props
  });
};

// Mock Label component
exports.Label = function Label(props) {
  return React.createElement('label', {
    'data-testid': 'label'
  }, props.children);
};

// Mock Textarea component
exports.Textarea = function Textarea(props) {
  return React.createElement('textarea', {
    'data-testid': 'textarea',
    ...props
  });
};

// Mock icons
exports.Shirt = function Shirt(props) {
  return React.createElement('svg', {
    'data-testid': 'icon-shirt',
    className: props.className
  });
};

exports.Bath = function Bath(props) {
  return React.createElement('svg', {
    'data-testid': 'icon-bath',
    className: props.className
  });
};

exports.PersonStanding = function PersonStanding(props) {
  return React.createElement('svg', {
    'data-testid': 'icon-person-standing',
    className: props.className
  });
};

exports.Stethoscope = function Stethoscope(props) {
  return React.createElement('svg', {
    'data-testid': 'icon-stethoscope',
    className: props.className
  });
};

exports.Glasses = function Glasses(props) {
  return React.createElement('svg', {
    'data-testid': 'icon-glasses',
    className: props.className
  });
};
