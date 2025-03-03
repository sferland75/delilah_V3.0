import React from 'react';
import { render, screen } from '@testing-library/react';
import { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent } from './card';

describe('Card Component', () => {
  it('should render basic card', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(
      <Card ref={ref} className="test-card">
        Test Content
      </Card>
    );
    const card = screen.getByText('Test Content');
    expect(card.parentElement).toHaveClass('test-card');
    expect(ref.current).toBeDefined();
  });

  it('should render full card with all components', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Title</CardTitle>
          <CardDescription>Description</CardDescription>
        </CardHeader>
        <CardContent>Content</CardContent>
        <CardFooter>Footer</CardFooter>
      </Card>
    );

    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
    expect(screen.getByText('Content')).toBeInTheDocument();
    expect(screen.getByText('Footer')).toBeInTheDocument();
  });

  it('should handle refs for all components', () => {
    const headerRef = React.createRef<HTMLDivElement>();
    const titleRef = React.createRef<HTMLHeadingElement>();
    const descRef = React.createRef<HTMLParagraphElement>();
    const contentRef = React.createRef<HTMLDivElement>();
    const footerRef = React.createRef<HTMLDivElement>();

    render(
      <Card>
        <CardHeader ref={headerRef}>
          <CardTitle ref={titleRef}>Title</CardTitle>
          <CardDescription ref={descRef}>Description</CardDescription>
        </CardHeader>
        <CardContent ref={contentRef}>Content</CardContent>
        <CardFooter ref={footerRef}>Footer</CardFooter>
      </Card>
    );

    expect(headerRef.current).toBeDefined();
    expect(titleRef.current).toBeDefined();
    expect(descRef.current).toBeDefined();
    expect(contentRef.current).toBeDefined();
    expect(footerRef.current).toBeDefined();
  });

  it('should handle classNames for all components', () => {
    render(
      <Card className="card-class">
        <CardHeader className="header-class">
          <CardTitle className="title-class">Title</CardTitle>
          <CardDescription className="desc-class">Description</CardDescription>
        </CardHeader>
        <CardContent className="content-class">Content</CardContent>
        <CardFooter className="footer-class">Footer</CardFooter>
      </Card>
    );

    expect(screen.getByText('Title').parentElement?.parentElement).toHaveClass('header-class');
    expect(screen.getByText('Title')).toHaveClass('title-class');
    expect(screen.getByText('Description')).toHaveClass('desc-class');
    expect(screen.getByText('Content').parentElement).toHaveClass('content-class');
    expect(screen.getByText('Footer').parentElement).toHaveClass('footer-class');
  });
});