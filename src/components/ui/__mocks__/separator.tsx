import React from 'react';

export const Separator = (props: React.HTMLAttributes<HTMLHRElement>) => (
  <hr data-testid="separator" {...props} />
);

export default Separator;