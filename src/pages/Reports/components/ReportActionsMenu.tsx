
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
}

const ReportActionsMenu: React.FC<Props> = ({ report, onDelete }) => {
  const [manageAccessOpen, setManageAccessOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

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
