import React from 'react';

export const Select = React.forwardRef(({ children, onValueChange, value, defaultValue }: any, ref) => {
  const [open, setOpen] = React.useState(false);
  const [selectedValue, setSelectedValue] = React.useState(value || defaultValue);

  const handleSelect = (newValue: string) => {
    setSelectedValue(newValue);
    onValueChange?.(newValue);
    setOpen(false);
  };

  return (
    <div className="select-root" ref={ref} data-value={selectedValue}>
      {React.Children.map(children, child => {
        if (child?.type === SelectTrigger) {
          return React.cloneElement(child, {
            onClick: () => setOpen(!open),
            'aria-expanded': open,
            value: selectedValue
          });
        }
        if (child?.type === SelectContent && open) {
          return React.cloneElement(child, {
            onSelect: handleSelect
          });
        }
        return child;
      })}
    </div>
  );
});

Select.displayName = 'Select';

export const SelectTrigger = React.forwardRef(({ children, onClick, 'aria-expanded': expanded, value }: any, ref) => (
  <button
    ref={ref}
    role="combobox"
    aria-expanded={expanded}
    className="select-trigger"
    onClick={onClick}
    data-value={value}
  >
    {children}
  </button>
));

SelectTrigger.displayName = 'SelectTrigger';

export const SelectValue = React.forwardRef(({ children, placeholder }: any, ref) => (
  <span ref={ref} className="select-value">
    {children || placeholder}
  </span>
));

SelectValue.displayName = 'SelectValue';

export const SelectContent = React.forwardRef(({ children, onSelect }: any, ref) => (
  <div ref={ref} role="listbox" className="select-content">
    {React.Children.map(children, child => {
      if (child?.type === SelectItem) {
        return React.cloneElement(child, {
          onSelect: () => onSelect?.(child.props.value)
        });
      }
      return child;
    })}
  </div>
));

SelectContent.displayName = 'SelectContent';

export const SelectItem = React.forwardRef(({ children, value, onSelect }: any, ref) => (
  <div
    ref={ref}
    role="option"
    className="select-item"
    data-value={value}
    onClick={onSelect}
  >
    {children}
  </div>
));

SelectItem.displayName = 'SelectItem';