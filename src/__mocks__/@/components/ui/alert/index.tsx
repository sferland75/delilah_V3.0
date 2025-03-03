import { createElement } from 'react';

export const Alert = function({ children, variant = 'default', ...props }) {
  return createElement('div', {
    'data-testid': props['data-testid'] || 'alert',
    className: `alert-${variant}`,
    role: 'alert',
    ...props
  }, children);
};

export const AlertTitle = function({ children, ...props }) {
  return createElement('h5', {
    'data-testid': props['data-testid'] || 'alert-title',
    ...props
  }, children);
};

export const AlertDescription = function({ children, ...props }) {
  return createElement('div', {
    'data-testid': props['data-testid'] || 'alert-description',
    ...props
  }, children);
};