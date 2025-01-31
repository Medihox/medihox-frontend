"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Users as UsersIcon, UserPlus, Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { User, Role, Permission } from "../types";

const mockUsers: User[] = [
  {
    id: "1",
    name: "John Admin",
    email: "admin@example.com",
    role: "admin",
    permissions: {
      users: { view: true, create: true, edit: true, delete: true },
      appointments: { view: true, create: true, edit: true, delete: true },
      inquiries: { view: true, create: true, edit: true, delete: true },
    },
    status: "active",
    createdAt: "2024-01-20T10:00:00Z",
    lastLogin: "2024-01-25T15:30:00Z",
  },
];

const roles: Role[] = ["admin", "doctor", "receptionist", "staff"];
const modules = ["users", "appointments", "inquiries"] as const;

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [newUser, setNewUser] = useState<Partial<User>>({
    name: "",
    email: "",
    role: "staff",
    permissions: {
      users: { view: false, create: false, edit: false, delete: false },
      appointments: { view: false, create: false, edit: false, delete: false },
      inquiries: { view: false, create: false, edit: false, delete: false },
    },
    status: "active",
  });

  const handleAddUser = () => {
    const user: User = {
      ...newUser as User,
      id: (users.length + 1).toString(),
      createdAt: new Date().toISOString(),
    };
    setUsers([...users, user]);
    resetForm();
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setNewUser(user);
    setIsAddDialogOpen(true);
  };

  const handleUpdateUser = () => {
    if (!editingUser) return;
    const updatedUsers = users.map((user) =>
      user.id === editingUser.id ? { ...user, ...newUser } : user
    );
    setUsers(updatedUsers);
    resetForm();
  };

  const handleDeleteUser = (id: string) => {
    setUsers(users.filter((user) => user.id !== id));
  };

  const resetForm = () => {
    setEditingUser(null);
    setNewUser({
      name: "",
      email: "",
      role: "staff",
      permissions: {
        users: { view: false, create: false, edit: false, delete: false },
        appointments: { view: false, create: false, edit: false, delete: false },
        inquiries: { view: false, create: false, edit: false, delete: false },
      },
      status: "active",
    });
    setIsAddDialogOpen(false);
  };

  const handlePermissionChange = (
    module: keyof User["permissions"],
    action: keyof Permission,
    checked: boolean
  ) => {
    setNewUser((prev) => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [module]: {
          ...prev.permissions?.[module],
          [action]: checked,
        },
      } as User["permissions"],
    }));
  };

  const getStatusColor = (status: User["status"]) => {
    return status === "active" ? "bg-green-500" : "bg-red-500";
  };

  const getRoleColor = (role: Role) => {
    switch (role) {
      case "admin":
        return "bg-purple-500";
      case "doctor":
        return "bg-blue-500";
      case "receptionist":
        return "bg-green-500";
      case "staff":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  function cn(...classes: string[]): string {
    return classes.filter(Boolean).join(" ");
  }
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UsersIcon className="h-8 w-8 text-gray-700" />
            <h1 className="text-2xl font-bold text-gray-900">Users</h1>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <UserPlus className="h-4 w-4" />
                New User
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>
                  {editingUser ? "Edit User" : "Add New User"}
                </DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={newUser.name}
                      onChange={(e) =>
                        setNewUser({ ...newUser, name: e.target.value })
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newUser.email}
                      onChange={(e) =>
                        setNewUser({ ...newUser, email: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="role">Role</Label>
                    <Select
                      value={newUser.role}
                      onValueChange={(value: Role) =>
                        setNewUser({ ...newUser, role: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        {roles.map((role) => (
                          <SelectItem key={role} value={role}>
                            {role.charAt(0).toUpperCase() + role.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={newUser.status}
                      onValueChange={(value: User["status"]) =>
                        setNewUser({ ...newUser, status: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid gap-4">
                  <Label>Permissions</Label>
                  <div className="space-y-4">
                    {modules.map((module) => (
                      <div key={module} className="space-y-2">
                        <h3 className="font-medium capitalize">{module}</h3>
                        <div className="flex gap-6">
                          {["view", "create", "edit", "delete"].map((action) => (
                            <div
                              key={action}
                              className="flex items-center gap-2"
                            >
                              <Checkbox
                                id={`${module}-${action}`}
                                checked={
                                  newUser.permissions?.[module]?.[
                                    action as keyof Permission
                                  ] ?? false
                                }
                                onCheckedChange={(checked) =>
                                  handlePermissionChange(
                                    module,
                                    action as keyof Permission,
                                    checked as boolean
                                  )
                                }
                              />
                              <Label
                                htmlFor={`${module}-${action}`}
                                className="capitalize"
                              >
                                {action}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
                <Button onClick={editingUser ? handleUpdateUser : handleAddUser}>
                  {editingUser ? "Update" : "Add"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="rounded-lg bg-white shadow">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge
                      className={cn("text-white", getRoleColor(user.role))}
                    >
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={cn(
                        "text-white",
                        getStatusColor(user.status)
                      )}
                    >
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(user.createdAt).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    {user.lastLogin
                      ? new Date(user.lastLogin).toLocaleString()
                      : "Never"}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => handleEditUser(user)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}