import React from 'react';

const createIconMock = (name: string) => {
  const IconComponent = ({ size = 24, color = 'currentColor', ...props }: any) => (
    <div data-testid={`icon-${name.toLowerCase()}`} {...props}>
      {name}
    </div>
  );
  IconComponent.displayName = name;
  return IconComponent;
};

export const History = createIconMock('History');
export const Bone = createIconMock('Bone');
export const Stethoscope = createIconMock('Stethoscope');
export const Pill = createIconMock('Pill');