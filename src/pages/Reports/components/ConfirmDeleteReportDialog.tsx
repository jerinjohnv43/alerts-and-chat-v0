
import React from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface Props {
  open: boolean;
  onConfirm: () => void;
  onOpenChange: (open: boolean) => void;
  reportName: string;
}

const ConfirmDeleteReportDialog: React.FC<Props> = ({
  open,
  onConfirm,
  onOpenChange,
  reportName
}) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Delete Report</DialogTitle>
        <DialogDescription>
          Are you sure you want to delete <b>{reportName}</b>? This action cannot be undone.
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <Button variant="destructive" onClick={() => { onConfirm(); onOpenChange(false); }}>
          Delete
        </Button>
        <Button variant="ghost" onClick={() => onOpenChange(false)}>
          Cancel
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

export default ConfirmDeleteReportDialog;
