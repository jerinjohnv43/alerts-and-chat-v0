
import React from "react";
import { Database, Server } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface Workspace {
  id: string;
  name: string;
}
interface Warehouse {
  id: string;
  name: string;
  workspaceId: string;
}

interface WorkspaceWarehouseSelectorProps {
  workspaces: Workspace[];
  warehouses: Warehouse[];
  selectedWorkspace: string | null;
  selectedWarehouse: string | null;
  setSelectedWorkspace: (value: string) => void;
  setSelectedWarehouse: (value: string) => void;
}

const WorkspaceWarehouseSelector: React.FC<WorkspaceWarehouseSelectorProps> = ({
  workspaces,
  warehouses,
  selectedWorkspace,
  selectedWarehouse,
  setSelectedWorkspace,
  setSelectedWarehouse: setWarehouse
}) => {
  const availableWarehouses =
    selectedWorkspace
      ? warehouses.filter(wh => wh.workspaceId === selectedWorkspace)
      : [];

  return (
    <div className="grid gap-4">
      <div className="space-y-2">
        <Label htmlFor="workspace">Fabric Workspace</Label>
        <Select
          value={selectedWorkspace ?? ""}
          onValueChange={(value) => {
            setSelectedWorkspace(value);
            if (selectedWarehouse && !availableWarehouses.some(wh => wh.id === selectedWarehouse)) {
              setWarehouse("");
            }
          }}
        >
          <SelectTrigger id="workspace" aria-label="Select workspace" className="w-full">
            <SelectValue placeholder="Select workspace" />
          </SelectTrigger>
          <SelectContent position="popper" className="z-[100] bg-background">
            {workspaces.map(ws => (
              <SelectItem value={ws.id} key={ws.id}>
                <div className="flex items-center gap-2"><Database className="h-4 w-4" />{ws.name}</div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="warehouse">Data Warehouse</Label>
        <Select
          value={selectedWarehouse ?? ""}
          onValueChange={setWarehouse}
          disabled={!selectedWorkspace}
        >
          <SelectTrigger id="warehouse" aria-label="Select warehouse" className="w-full">
            <SelectValue placeholder={!selectedWorkspace ? "Select workspace first" : "Select warehouse"} />
          </SelectTrigger>
          <SelectContent position="popper" className="z-[100] bg-background">
            {selectedWorkspace
              ? availableWarehouses.map(wh => (
                  <SelectItem value={wh.id} key={wh.id}>
                    <div className="flex items-center gap-2"><Server className="h-4 w-4" />{wh.name}</div>
                  </SelectItem>
                ))
              : null}
            {selectedWorkspace &&
              availableWarehouses.length === 0 && (
                <div className="px-4 py-2 text-sm text-muted-foreground italic">No warehouses found</div>
              )}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default WorkspaceWarehouseSelector;
