import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from './form';
import { useForm } from 'react-hook-form';

describe('Form Components', () => {
  const TestForm = () => {
    const form = useForm({
      defaultValues: {
        username: ''
      }
    });

    return (
      <Form {...form}>
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <input {...field} />
              </FormControl>
              <FormDescription>Enter your username</FormDescription>
              <FormMessage>Required field</FormMessage>
            </FormItem>
          )}
        />
      </Form>
    );
  };

  it('renders complete form with all components', () => {
    render(<TestForm />);
    expect(screen.getByLabelText('Username')).toBeInTheDocument();
    expect(screen.getByText('Enter your username')).toBeInTheDocument();
    expect(screen.getByText('Required field')).toBeInTheDocument();
  });

  it('handles form submission', async () => {
    const onSubmit = jest.fn();
    const user = userEvent.setup();

    render(
      <Form onSubmit={onSubmit}>
        <button type="submit">Submit</button>
      </Form>
    );

    await user.click(screen.getByRole('button'));
    expect(onSubmit).toHaveBeenCalled();
  });

  it('applies custom className to form elements', () => {
    render(
      <Form className="custom-form">
        <FormItem className="custom-item">
          <FormLabel className="custom-label">Label</FormLabel>
          <FormControl className="custom-control">
            <input />
          </FormControl>
          <FormDescription className="custom-desc">Description</FormDescription>
          <FormMessage className="custom-message">Message</FormMessage>
        </FormItem>
      </Form>
    );

    expect(screen.getByRole('form')).toHaveClass('custom-form');
    expect(screen.getByText('Label')).toHaveClass('custom-label');
    expect(screen.getByText('Description')).toHaveClass('custom-desc');
    expect(screen.getByText('Message')).toHaveClass('custom-message');
  });

  it('forwards refs correctly', () => {
    const formRef = React.createRef<HTMLFormElement>();
    const labelRef = React.createRef<HTMLLabelElement>();
    const descRef = React.createRef<HTMLParagraphElement>();
    const messageRef = React.createRef<HTMLParagraphElement>();

    render(
      <Form ref={formRef}>
        <FormItem>
          <FormLabel ref={labelRef}>Label</FormLabel>
          <FormControl>
            <input />
          </FormControl>
          <FormDescription ref={descRef}>Description</FormDescription>
          <FormMessage ref={messageRef}>Message</FormMessage>
        </FormItem>
      </Form>
    );

    expect(formRef.current).toBeInstanceOf(HTMLFormElement);
    expect(labelRef.current).toBeInstanceOf(HTMLLabelElement);
    expect(descRef.current).toBeInstanceOf(HTMLParagraphElement);
    expect(messageRef.current).toBeInstanceOf(HTMLParagraphElement);
  });

  it('renders form field with validation', async () => {
    const user = userEvent.setup();
    const onSubmit = jest.fn();

    render(
      <Form onSubmit={onSubmit}>
        <FormField
          name="test"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Test Field</FormLabel>
              <FormControl>
                <input {...field} required />
              </FormControl>
              <FormMessage>Required</FormMessage>
            </FormItem>
          )}
        />
        <button type="submit">Submit</button>
      </Form>
    );

    await user.click(screen.getByRole('button'));
    expect(screen.getByText('Required')).toBeVisible();
  });
});