import { screen, within } from '@testing-library/react';

export const getFieldByName = async (name: string) => {
  const item = await screen.findByTestId(`form-item-${name}`);
  return within(item).getByRole('textbox');
};

export const getSelectByName = async (name: string) => {
  const item = await screen.findByTestId(`form-item-${name}`);
  return within(item).getByRole('combobox');
};

export const getSection = async (name: string) => {
  return screen.findByRole('tabpanel', { name });
};