import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose
} from '@/components/ui/dialog';
import { DialogueProps } from '@/types/common/dialogueTypes';

export function Modal({
  title,
  description,
  // triggerButtonText,
  children,
  modalSize,
  open,
  onOpenChange
}: DialogueProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{/* <Button>{triggerButtonText}</Button> */}</DialogTrigger>
      <DialogContent
        className={`${modalSize} overflow-y-auto max-h-[80vh]`}
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {children}
        <DialogFooter>
          <DialogClose asChild>{/* <Button variant="secondary">Cancel</Button> */}</DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
