import '@testing-library/jest-dom';
import { jest } from '@jest/globals';

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock ResizeObserver
class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
window.ResizeObserver = ResizeObserver;

// Mock IntersectionObserver
class IntersectionObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
window.IntersectionObserver = IntersectionObserver;

// Make sure components are properly mocked
jest.mock('@/components/ui/tabs', () => ({
  Tabs: (props: any) => props.children,
  TabsContent: (props: any) => props.children,
  TabsList: (props: any) => props.children,
  TabsTrigger: (props: any) => props.children,
}));

jest.mock('@/components/ui/card', () => ({
  Card: (props: any) => props.children,
  CardContent: (props: any) => props.children,
  CardHeader: (props: any) => props.children,
  CardTitle: (props: any) => props.children,
}));

jest.mock('@/components/ui/textarea', () => ({
  Textarea: 'textarea',
}));

jest.mock('@/components/ui/button', () => ({
  Button: 'button',
}));

jest.mock('@/components/ui/toast', () => ({
  Toast: 'div',
}));

// Make globals available
global.jest = jest;