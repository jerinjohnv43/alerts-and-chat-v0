
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
  onOpenChange: (open: boolean) => void;
  reportName: string;
}
const ManageAccessDialog: React.FC<Props> = ({ open, onOpenChange, reportName }) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Manage Access</DialogTitle>
        <DialogDescription>
          Manage user and group access for <b>{reportName}</b>.
        </DialogDescription>
      </DialogHeader>
      {/* Here you would list users and have UI to add/remove access, but this is a stub. */}
      <div className="my-4 text-sm text-muted-foreground">Access control management coming soon.</div>
      <DialogFooter>
        <Button onClick={() => onOpenChange(false)}>Close</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);
export default ManageAccessDialog;
