import { ReactNode } from 'react';

export type DialogueProps = {
  title: string;
  description: string;
  triggerButtonText: string;
  children: ReactNode;
  open: boolean;
  modalSize: string;
  // onOpenChange: (open: boolean) => void;
};
