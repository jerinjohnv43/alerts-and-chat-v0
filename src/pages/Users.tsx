
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserTable } from '@/components/users/UserTable';
import { User } from '@/types/users';
import { users as mockUsers } from '@/data/mockData';
import { useToast } from '@/components/ui/use-toast';
import { 
  Plus, 
  Search, 
  UserPlus 
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

const Users = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const filteredUsers = users.filter(user => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      user.name.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower) ||
      user.role.toLowerCase().includes(searchLower)
    );
  });
  
  const handleToggleStatus = (id: string, active: boolean) => {
    const updatedUsers = users.map(user => {
      if (user.id === id) {
        return { ...user, active };
      }
      return user;
    });
    
    setUsers(updatedUsers);
    
    toast({
      title: `User ${active ? 'activated' : 'deactivated'}`,
      description: `User has been ${active ? 'activated' : 'deactivated'}.`
    });
  };
  
  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setIsDialogOpen(true);
  };
  
  const handleSaveUser = () => {
    if (editingUser) {
      const updatedUsers = users.map(user => {
        if (user.id === editingUser.id) {
          return editingUser;
        }
        return user;
      });
      
      setUsers(updatedUsers);
      setIsDialogOpen(false);
      
      toast({
        title: "User updated",
        description: "User information has been successfully updated."
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">User Management</h1>
          <p className="text-muted-foreground">
            Manage users and their alert permissions.
          </p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
              <DialogDescription>
                Create a new user with specific permissions.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input id="name" className="col-span-3" placeholder="Enter user name" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input id="email" type="email" className="col-span-3" placeholder="Enter user email" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="role" className="text-right">
                  Role
                </Label>
                <div className="col-span-3">
                  <Select>
                    <SelectTrigger id="role">
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Roles</SelectLabel>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="manager">Manager</SelectItem>
                        <SelectItem value="analyst">Analyst</SelectItem>
                        <SelectItem value="executive">Executive</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label className="text-right pt-2">Permissions</Label>
                <div className="col-span-3 space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="manage_alerts" />
                    <Label htmlFor="manage_alerts">Manage Alerts</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="manage_users" />
                    <Label htmlFor="manage_users">Manage Users</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="receive_alerts" defaultChecked />
                    <Label htmlFor="receive_alerts">Receive Alerts</Label>
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Create User</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="max-w-md">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search users..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Total Users</CardTitle>
            <CardDescription>Active and inactive users</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{users.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {users.filter(u => u.active).length} active, {users.filter(u => !u.active).length} inactive
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Roles Distribution</CardTitle>
            <CardDescription>Users by role type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {['Admin', 'Manager', 'Analyst', 'Executive'].map(role => {
                const count = users.filter(u => u.role === role).length;
                const percentage = Math.round((count / users.length) * 100);
                
                return (
                  <div key={role} className="flex items-center justify-between text-sm">
                    <span>{role}</span>
                    <span className="font-medium">{count} ({percentage}%)</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Alert Recipients</CardTitle>
            <CardDescription>Users receiving alerts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {users.filter(u => u.permissions.includes('receive_alerts')).length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {Math.round((users.filter(u => u.permissions.includes('receive_alerts')).length / users.length) * 100)}% of total users
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div>
        <UserTable 
          users={filteredUsers}
          onEditUser={handleEditUser}
          onToggleStatus={handleToggleStatus}
        />
      </div>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user information and permissions.
            </DialogDescription>
          </DialogHeader>
          {editingUser && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-name" className="text-right">
                  Name
                </Label>
                <Input 
                  id="edit-name" 
                  className="col-span-3" 
                  value={editingUser.name}
                  onChange={(e) => setEditingUser({...editingUser, name: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-email" className="text-right">
                  Email
                </Label>
                <Input 
                  id="edit-email" 
                  type="email" 
                  className="col-span-3" 
                  value={editingUser.email}
                  onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-role" className="text-right">
                  Role
                </Label>
                <div className="col-span-3">
                  <Select 
                    value={editingUser.role} 
                    onValueChange={(value) => setEditingUser({...editingUser, role: value})}
                  >
                    <SelectTrigger id="edit-role">
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Roles</SelectLabel>
                        <SelectItem value="Admin">Admin</SelectItem>
                        <SelectItem value="Manager">Manager</SelectItem>
                        <SelectItem value="Analyst">Analyst</SelectItem>
                        <SelectItem value="Executive">Executive</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label className="text-right pt-2">Permissions</Label>
                <div className="col-span-3 space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="edit-manage_alerts"
                      checked={editingUser.permissions.includes('manage_alerts')}
                      onCheckedChange={(checked) => {
                        const permissions = [...editingUser.permissions];
                        if (checked) {
                          if (!permissions.includes('manage_alerts')) {
                            permissions.push('manage_alerts');
                          }
                        } else {
                          const index = permissions.indexOf('manage_alerts');
                          if (index !== -1) permissions.splice(index, 1);
                        }
                        setEditingUser({...editingUser, permissions});
                      }}
                    />
                    <Label htmlFor="edit-manage_alerts">Manage Alerts</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="edit-manage_users"
                      checked={editingUser.permissions.includes('manage_users')}
                      onCheckedChange={(checked) => {
                        const permissions = [...editingUser.permissions];
                        if (checked) {
                          if (!permissions.includes('manage_users')) {
                            permissions.push('manage_users');
                          }
                        } else {
                          const index = permissions.indexOf('manage_users');
                          if (index !== -1) permissions.splice(index, 1);
                        }
                        setEditingUser({...editingUser, permissions});
                      }}
                    />
                    <Label htmlFor="edit-manage_users">Manage Users</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="edit-receive_alerts"
                      checked={editingUser.permissions.includes('receive_alerts')}
                      onCheckedChange={(checked) => {
                        const permissions = [...editingUser.permissions];
                        if (checked) {
                          if (!permissions.includes('receive_alerts')) {
                            permissions.push('receive_alerts');
                          }
                        } else {
                          const index = permissions.indexOf('receive_alerts');
                          if (index !== -1) permissions.splice(index, 1);
                        }
                        setEditingUser({...editingUser, permissions});
                      }}
                    />
                    <Label htmlFor="edit-receive_alerts">Receive Alerts</Label>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={handleSaveUser}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Users;
