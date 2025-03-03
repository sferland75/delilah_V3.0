// This file should be imported in individual test files to setup mocks

// Setup UI component mocks
export function setupUIComponentMocks() {
  // Create mock implementations
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

  // Setup mocks with the correct syntax
  jest.mock('@/components/ui/accordion', () => ({
    Accordion: jest.fn().mockImplementation(uiComponents.Accordion),
    AccordionItem: jest.fn().mockImplementation(uiComponents.AccordionItem),
    AccordionTrigger: jest.fn().mockImplementation(uiComponents.AccordionTrigger),
    AccordionContent: jest.fn().mockImplementation(uiComponents.AccordionContent),
  }), { virtual: true });

  jest.mock('@/components/ui/card', () => ({
    Card: jest.fn().mockImplementation(uiComponents.Card),
    CardHeader: jest.fn().mockImplementation(uiComponents.CardHeader),
    CardContent: jest.fn().mockImplementation(uiComponents.CardContent),
    CardTitle: jest.fn().mockImplementation(uiComponents.CardTitle),
  }), { virtual: true });

  jest.mock('@/components/ui/input', () => ({
    Input: jest.fn().mockImplementation(uiComponents.Input),
  }), { virtual: true });

  jest.mock('@/components/ui/label', () => ({
    Label: jest.fn().mockImplementation(uiComponents.Label),
  }), { virtual: true });

  jest.mock('@/components/ui/textarea', () => ({
    Textarea: jest.fn().mockImplementation(uiComponents.Textarea),
  }), { virtual: true });

  jest.mock('@/components/ui/tabs', () => ({
    Tabs: jest.fn().mockImplementation(uiComponents.Tabs),
    TabsList: jest.fn().mockImplementation(uiComponents.TabsList),
    TabsTrigger: jest.fn().mockImplementation(uiComponents.TabsTrigger),
    TabsContent: jest.fn().mockImplementation(uiComponents.TabsContent),
  }), { virtual: true });

  jest.mock('@/components/ui/alert-dialog', () => ({
    AlertDialog: jest.fn().mockImplementation(uiComponents.AlertDialog),
    AlertDialogContent: jest.fn().mockImplementation(uiComponents.AlertDialogContent),
    AlertDialogHeader: jest.fn().mockImplementation(uiComponents.AlertDialogHeader),
    AlertDialogTitle: jest.fn().mockImplementation(uiComponents.AlertDialogTitle),
    AlertDialogDescription: jest.fn().mockImplementation(uiComponents.AlertDialogDescription),
    AlertDialogFooter: jest.fn().mockImplementation(uiComponents.AlertDialogFooter),
    AlertDialogAction: jest.fn().mockImplementation(uiComponents.AlertDialogAction),
    AlertDialogCancel: jest.fn().mockImplementation(uiComponents.AlertDialogCancel),
  }), { virtual: true });

  // Mock lucide-react icons
  jest.mock('lucide-react', () => ({
    Shirt: jest.fn().mockImplementation(iconComponents.Shirt),
    Bath: jest.fn().mockImplementation(iconComponents.Bath),
    PersonStanding: jest.fn().mockImplementation(iconComponents.PersonStanding),
    Stethoscope: jest.fn().mockImplementation(iconComponents.Stethoscope),
    Glasses: jest.fn().mockImplementation(iconComponents.Glasses),
    Save: jest.fn().mockImplementation(iconComponents.Save),
    ArrowLeft: jest.fn().mockImplementation(iconComponents.ArrowLeft),
    ArrowRight: jest.fn().mockImplementation(iconComponents.ArrowRight),
    Check: jest.fn().mockImplementation(iconComponents.Check),
    UtensilsCrossed: jest.fn().mockImplementation(iconComponents.UtensilsCrossed),
    Smile: jest.fn().mockImplementation(iconComponents.Smile),
  }), { virtual: true });
}
