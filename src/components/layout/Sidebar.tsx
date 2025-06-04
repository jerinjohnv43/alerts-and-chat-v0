
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  Bell, 
  Settings, 
  Users, 
  AlertTriangle,
  History,
  X,
  User,
  Database,
  UserPlus
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavItemProps {
  icon: React.ElementType;
  label: string;
  href: string;
  active?: boolean;
}

function NavItem({ icon: Icon, label, href, active }: NavItemProps) {
  return (
    <Link
      to={href}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
        active 
          ? "bg-primary text-primary-foreground" 
          : "hover:bg-muted hover:text-foreground"
      )}
    >
      <Icon className="h-4 w-4" />
      <span>{label}</span>
    </Link>
  );
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const location = useLocation();
  const pathname = location.pathname;
  
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed z-30 flex h-full w-64 flex-col bg-background border-r transition-transform duration-200 lg:relative lg:z-0",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex h-14 items-center border-b px-4 justify-between">
          <Link to="/alerts" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center text-white font-bold">
              BI
            </div>
            <span className="text-lg font-semibold">BI Admin Portal</span>
          </Link>
          <Button variant="ghost" size="icon" onClick={onClose} className="lg:hidden">
            <X className="h-5 w-5" />
          </Button>
        </div>
        <ScrollArea className="flex-1 px-3 py-4">
          <nav className="space-y-6">
            <div className="space-y-1">
              <h3 className="px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Alerts
              </h3>
              <NavItem 
                icon={AlertTriangle} 
                label="Alerts" 
                href="/alerts" 
                active={pathname === "/alerts" || pathname.startsWith("/alerts/")} 
              />
              <NavItem 
                icon={History} 
                label="History" 
                href="/history" 
                active={pathname === "/history"} 
              />
            </div>
            
            <div className="space-y-1">
              <h3 className="px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Data Management
              </h3>
              <NavItem 
                icon={Database} 
                label="Data Catalog" 
                href="/data-catalog" 
                active={pathname === "/data-catalog"} 
              />
            </div>
            
            <div className="space-y-1">
              <h3 className="px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Client Management
              </h3>
              <NavItem 
                icon={UserPlus} 
                label="Client Onboarding" 
                href="/client-onboarding" 
                active={pathname === "/client-onboarding"} 
              />
            </div>
            
            <div className="space-y-1">
              <h3 className="px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Administration
              </h3>
              <NavItem 
                icon={Users} 
                label="User Management" 
                href="/users" 
                active={pathname === "/users"} 
              />
              <NavItem 
                icon={Settings} 
                label="Settings" 
                href="/settings" 
                active={pathname === "/settings"} 
              />
            </div>
          </nav>
        </ScrollArea>
        <div className="border-t p-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
              <User className="h-4 w-4" />
            </div>
            <div className="text-sm">
              <p className="font-medium">Admin User</p>
              <p className="text-muted-foreground text-xs">admin@example.com</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
