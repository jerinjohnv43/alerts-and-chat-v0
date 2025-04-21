
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import ManageAccessDialog from "./ManageAccessDialog";
import MoveReportDialog from "./MoveReportDialog";
import ConfirmDeleteReportDialog from "./ConfirmDeleteReportDialog";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { mockWorkspaces } from "@/data/mockPowerBIData";

interface Report {
  id: string;
  name: string;
  webUrl: string;
  workspaceId: string;
}

interface Props {
  report: Report & { workspaceName: string };
  onDelete: (id: string) => void;
  onMove: (id: string, newWorkspaceId: string) => void;
}

const ReportActionsMenu: React.FC<Props> = ({ report, onDelete, onMove }) => {
  const [manageAccessOpen, setManageAccessOpen] = useState(false);
  const [moveOpen, setMoveOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const currentWorkspaceName =
    mockWorkspaces.find(ws => ws.id === report.workspaceId)?.name ||
    report.workspaceName;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" aria-label="More actions">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="z-[100] bg-background">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <a
              href={report.webUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full"
            >
              View Report
            </a>
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => setManageAccessOpen(true)}>
            Manage Access
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => setMoveOpen(true)}>
            Move Report
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-destructive"
            onSelect={() => setDeleteOpen(true)}
          >
            Delete Report
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <ManageAccessDialog
        open={manageAccessOpen}
        onOpenChange={setManageAccessOpen}
        reportName={report.name}
      />
      <MoveReportDialog
        open={moveOpen}
        onOpenChange={setMoveOpen}
        reportName={report.name}
        currentWorkspace={currentWorkspaceName}
        onMove={targetWorkspaceId => {
          onMove(report.id, targetWorkspaceId);
          toast({
            title: "Report Moved",
            description: `Report "${report.name}" moved successfully.`,
          });
        }}
      />
      <ConfirmDeleteReportDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        reportName={report.name}
        onConfirm={() => {
          onDelete(report.id);
          toast({
            title: "Report Deleted",
            description: `Report "${report.name}" deleted.`,
            variant: "destructive"
          });
        }}
      />
    </>
  );
};

export default ReportActionsMenu;
