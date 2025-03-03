const React = require('react');

// Mock UI components for testing
module.exports = {
  // AlertDialog components
  AlertDialog: function AlertDialog(props) {
    return props.open ? React.createElement('div', 
      { 'data-testid': 'alert-dialog' }, props.children) : null;
  },
  AlertDialogContent: function AlertDialogContent(props) {
    return React.createElement('div', {}, props.children);
  },
  AlertDialogHeader: function AlertDialogHeader(props) {
    return React.createElement('div', {}, props.children);
  },
  AlertDialogTitle: function AlertDialogTitle(props) {
    return React.createElement('div', {}, props.children);
  },
  AlertDialogDescription: function AlertDialogDescription(props) {
    return React.createElement('div', {}, props.children);
  },

  // Tabs components
  Tabs: function Tabs(props) {
    return React.createElement('div', { 'data-testid': 'tabs' }, props.children);
  },
  TabsList: function TabsList(props) {
    return React.createElement('div', { 'data-testid': 'tabs-list' }, props.children);
  },
  TabsTrigger: function TabsTrigger(props) {
    return React.createElement('button', {
      role: 'tab',
      'data-value': props.value,
      onClick: () => {}
    }, props.children);
  },
  TabsContent: function TabsContent(props) {
    return React.createElement('div', {
      'data-value': props.value,
      role: 'tabpanel'
    }, props.children);
  },

  // Accordion components
  Accordion: function Accordion(props) {
    return React.createElement('div', { 'data-testid': 'accordion' }, props.children);
  },
  AccordionItem: function AccordionItem(props) {
    return React.createElement('div', {
      'data-value': props.value,
      className: props.className
    }, props.children);
  },
  AccordionTrigger: function AccordionTrigger(props) {
    return React.createElement('button', {
      'aria-expanded': 'false',
      className: props.className,
      onClick: () => {}
    }, props.children);
  },
  AccordionContent: function AccordionContent(props) {
    return React.createElement('div', {
      className: props.className
    }, props.children);
  },

  // Card components
  Card: function Card(props) {
    return React.createElement('div', { className: props.className }, props.children);
  },
  CardHeader: function CardHeader(props) {
    return React.createElement('div', {}, props.children);
  },
  CardTitle: function CardTitle(props) {
    return React.createElement('div', {}, props.children);
  },
  CardContent: function CardContent(props) {
    return React.createElement('div', {}, props.children);
  },

  // Input component
  Input: function Input(props) {
    return React.createElement('input', { ...props });
  },

  // Textarea component
  Textarea: function Textarea(props) {
    return React.createElement('textarea', { ...props });
  },

  // Label component
  Label: function Label(props) {
    return React.createElement('label', {}, props.children);
  }
};
