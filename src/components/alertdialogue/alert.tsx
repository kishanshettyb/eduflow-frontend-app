import {
  AlertDialog as RadixAlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog';
import { ReactNode } from 'react';

type AlertDialogProps = {
  title: string;
  description: string;
  triggerButtonText: string;
  confirmButtonText: string;
  cancelButtonText: string;
  onConfirm: () => void;
  onCancel: () => void;
  children?: ReactNode;
};

export function AlertDialog({
  title,
  description,
  triggerButtonText,
  confirmButtonText,
  cancelButtonText,
  onConfirm,
  onCancel,
  children
}: AlertDialogProps) {
  return (
    <RadixAlertDialog>
      <AlertDialogTrigger asChild>
        {children || <button>{triggerButtonText}</button>}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>{cancelButtonText}</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>{confirmButtonText}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </RadixAlertDialog>
  );
}
