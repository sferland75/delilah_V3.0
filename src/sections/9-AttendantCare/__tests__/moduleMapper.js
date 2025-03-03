// This file provides a centralized place for all component mocks
const React = require('react');

// UI Component Mocks
const uiComponents = {
  // Accordion components
  Accordion: function Accordion(props) {
    return React.createElement('div', {
      'data-testid': 'accordion',
      className: props.className
    }, props.children);
  },
  AccordionItem: function AccordionItem(props) {
    return React.createElement('div', {
      'data-testid': 'accordion-item',
      'data-value': props.value,
      className: props.className
    }, props.children);
  },
  AccordionTrigger: function AccordionTrigger(props) {
    return React.createElement('button', {
      'data-testid': 'accordion-trigger',
      className: props.className,
      onClick: props.onClick
    }, props.children);
  },
  AccordionContent: function AccordionContent(props) {
    return React.createElement('div', {
      'data-testid': 'accordion-content',
      className: props.className
    }, props.children);
  },

  // Card components
  Card: function Card(props) {
    return React.createElement('div', {
      'data-testid': 'card',
      className: props.className
    }, props.children);
  },
  CardHeader: function CardHeader(props) {
    return React.createElement('div', {
      'data-testid': 'card-header'
    }, props.children);
  },
  CardContent: function CardContent(props) {
    return React.createElement('div', {
      'data-testid': 'card-content'
    }, props.children);
  },
  CardTitle: function CardTitle(props) {
    return React.createElement('div', {
      'data-testid': 'card-title'
    }, props.children);
  },

  // Form components
  Input: function Input(props) {
    return React.createElement('input', {
      'data-testid': 'input',
      ...props
    });
  },
  Label: function Label(props) {
    return React.createElement('label', {
      'data-testid': 'label'
    }, props.children);
  },
  Textarea: function Textarea(props) {
    return React.createElement('textarea', {
      'data-testid': 'textarea',
      ...props
    });
  },

  // Tab components
  Tabs: function Tabs(props) {
    return React.createElement('div', {
      'data-testid': 'tabs',
      className: props.className
    }, props.children);
  },
  TabsList: function TabsList(props) {
    return React.createElement('div', {
      'data-testid': 'tabs-list',
      className: props.className
    }, props.children);
  },
  TabsTrigger: function TabsTrigger(props) {
    return React.createElement('button', {
      'data-testid': 'tab-trigger',
      onClick: props.onClick,
      className: props.className,
      'data-state': props.value === props.selectedValue ? 'active' : 'inactive'
    }, props.children);
  },
  TabsContent: function TabsContent(props) {
    return React.createElement('div', {
      'data-testid': 'tab-content',
      className: props.className,
      'data-state': props.value === props.selectedValue ? 'active' : 'inactive'
    }, props.children);
  },

  // Alert Dialog components
  AlertDialog: function AlertDialog(props) {
    return React.createElement('div', {
      'data-testid': 'alert-dialog',
      className: props.className
    }, props.open ? props.children : null);
  },
  AlertDialogContent: function AlertDialogContent(props) {
    return React.createElement('div', {
      'data-testid': 'alert-dialog-content',
      className: props.className
    }, props.children);
  },
  AlertDialogHeader: function AlertDialogHeader(props) {
    return React.createElement('div', {
      'data-testid': 'alert-dialog-header'
    }, props.children);
  },
  AlertDialogTitle: function AlertDialogTitle(props) {
    return React.createElement('div', {
      'data-testid': 'alert-dialog-title'
    }, props.children);
  },
  AlertDialogDescription: function AlertDialogDescription(props) {
    return React.createElement('div', {
      'data-testid': 'alert-dialog-description'
    }, props.children);
  },
  AlertDialogFooter: function AlertDialogFooter(props) {
    return React.createElement('div', {
      'data-testid': 'alert-dialog-footer'
    }, props.children);
  },
  AlertDialogAction: function AlertDialogAction(props) {
    return React.createElement('button', {
      'data-testid': 'alert-dialog-action',
      onClick: props.onClick
    }, props.children);
  },
  AlertDialogCancel: function AlertDialogCancel(props) {
    return React.createElement('button', {
      'data-testid': 'alert-dialog-cancel',
      onClick: props.onClick
    }, props.children);
  }
};

// Lucide Icon Mocks
const iconComponents = {
  Shirt: function Shirt(props) {
    return React.createElement('svg', {
      'data-testid': 'icon-shirt',
      className: props.className
    });
  },
  Bath: function Bath(props) {
    return React.createElement('svg', {
      'data-testid': 'icon-bath',
      className: props.className
    });
  },
  PersonStanding: function PersonStanding(props) {
    return React.createElement('svg', {
      'data-testid': 'icon-person-standing',
      className: props.className
    });
  },
  Stethoscope: function Stethoscope(props) {
    return React.createElement('svg', {
      'data-testid': 'icon-stethoscope',
      className: props.className
    });
  },
  Glasses: function Glasses(props) {
    return React.createElement('svg', {
      'data-testid': 'icon-glasses',
      className: props.className
    });
  },
  Save: function Save(props) {
    return React.createElement('svg', {
      'data-testid': 'icon-save',
      className: props.className
    });
  },
  ArrowLeft: function ArrowLeft(props) {
    return React.createElement('svg', {
      'data-testid': 'icon-arrow-left',
      className: props.className
    });
  },
  ArrowRight: function ArrowRight(props) {
    return React.createElement('svg', {
      'data-testid': 'icon-arrow-right',
      className: props.className
    });
  },
  Check: function Check(props) {
    return React.createElement('svg', {
      'data-testid': 'icon-check',
      className: props.className
    });
  },
  UtensilsCrossed: function UtensilsCrossed(props) {
    return React.createElement('svg', {
      'data-testid': 'icon-utensils-crossed',
      className: props.className
    });
  },
  Smile: function Smile(props) {
    return React.createElement('svg', {
      'data-testid': 'icon-smile',
      className: props.className
    });
  }
};

module.exports = {
  uiComponents,
  iconComponents
};
