
import React from 'react';
import { 
  Menu,
  LogOut,
  User
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AppHeaderProps {
  toggleSidebar: () => void;
  onLogout: () => void;
}

export function AppHeader({ toggleSidebar, onLogout }: AppHeaderProps) {
  return (
    <header className="border-b px-4 py-3 flex items-center justify-between bg-white dark:bg-gray-900 glass-panel">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={toggleSidebar} className="lg:hidden">
          <Menu className="h-5 w-5" />
        </Button>
        <div className="flex items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-gradient-to-r from-primary-600 to-primary-500 flex items-center justify-center text-white font-bold shadow-sm">
              BI
            </div>
            <h1 className="text-xl font-semibold hidden md:block gradient-heading">BI Admin Portal</h1>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <User className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 glass-panel">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">Profile</DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">Company Settings</DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">Billing</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer" onClick={onLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
