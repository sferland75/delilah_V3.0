import React, { createContext, useContext, useState } from 'react';

type Mode = 'edit' | 'view';

interface AssessmentContextType {
  mode: Mode;
  setMode: (mode: Mode) => void;
}

const AssessmentContext = createContext<AssessmentContextType>({
  mode: 'edit',
  setMode: () => {}
});

export const AssessmentProvider = ({ children }: { children: React.ReactNode }) => {
  const [mode, setMode] = useState<Mode>('edit');

  return (
    <AssessmentContext.Provider value={{ mode, setMode }}>
      {children}
    </AssessmentContext.Provider>
  );
};

export const useAssessmentContext = () => useContext(AssessmentContext);