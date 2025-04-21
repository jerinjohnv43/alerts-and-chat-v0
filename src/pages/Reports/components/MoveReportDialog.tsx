
import React, { useState } from "react";
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
import { mockWorkspaces } from "@/data/mockPowerBIData";
import { Folder } from "lucide-react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reportName: string;
  currentWorkspace: string;
  onMove: (targetWorkspaceId: string) => void;
}

const MoveReportDialog: React.FC<Props> = ({
  open,
  onOpenChange,
  reportName,
  currentWorkspace,
  onMove
}) => {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Move Report</DialogTitle>
          <DialogDescription>
            Move <b>{reportName}</b> to another workspace.
          </DialogDescription>
        </DialogHeader>
        <div className="my-4 space-y-2">
          {mockWorkspaces.filter(ws => ws.name !== currentWorkspace).map(ws => (
            <Button
              variant={selected === ws.id ? "default" : "outline"}
              key={ws.id}
              onClick={() => setSelected(ws.id)}
              className="w-full flex justify-start gap-2"
            >
              <Folder className="h-4 w-4" />
              {ws.name}
            </Button>
          ))}
        </div>
        <DialogFooter>
          <Button
            disabled={!selected}
            onClick={() => {
              if (selected) {
                onMove(selected);
                onOpenChange(false);
              }
            }}
          >
            Move
          </Button>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MoveReportDialog;
