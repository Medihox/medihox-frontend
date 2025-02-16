"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { FilterTimeRange, UserStatus } from "@/app/admin/users/page";
import { User, Role } from "@/app/types";
import { UserDialog } from "./UserDialog";

const Pencil = dynamic(() => import("lucide-react").then((mod) => mod.Pencil), {
  ssr: false,
});
const Trash2 = dynamic(() => import("lucide-react").then((mod) => mod.Trash2), {
  ssr: false,
});
const Download = dynamic(() => import("lucide-react").then((mod) => mod.Download), {
  ssr: false,
});
const FileText = dynamic(() => import("lucide-react").then((mod) => mod.FileText), {
  ssr: false,
});

const mockUsers: User[] = [
  {
    id: "1",
    name: "John Admin",
    email: "admin@example.com",
    role: "admin",
    status: "active",
    createdAt: "2024-01-20T10:00:00Z",
    lastLogin: "2024-01-25T15:30:00Z",
  },
  {
    id: "2",
    name: "Dr. Sarah Smith",
    email: "sarah@example.com",
    role: "doctor",
    status: "active",
    createdAt: "2024-01-21T10:00:00Z",
    lastLogin: "2024-01-26T15:30:00Z",
  },
];

interface UsersListProps {
  searchQuery: string;
  timeRange: FilterTimeRange;
  statusFilter: UserStatus;
}

export function UsersList({ searchQuery, timeRange, statusFilter }: UsersListProps) {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [userToEdit, setUserToEdit] = useState<User | undefined>();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | undefined>();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const filteredUsers = users.filter(user => {
    // Search filter
    const matchesSearch = 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());

    // Status filter
    const matchesStatus = 
      statusFilter === 'all' || 
      user.status === statusFilter;

    // Time range filter
    const createdDate = new Date(user.createdAt);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const matchesTimeRange = (() => {
      switch (timeRange) {
        case 'today':
          return createdDate.toDateString() === today.toDateString();
        
        case 'week': {
          const weekAgo = new Date();
          weekAgo.setDate(today.getDate() - 7);
          return createdDate >= weekAgo && createdDate <= today;
        }
        
        case 'month': {
          const monthAgo = new Date();
          monthAgo.setMonth(today.getMonth() - 1);
          return createdDate >= monthAgo && createdDate <= today;
        }
        
        case 'all':
        default:
          return true;
      }
    })();

    return matchesSearch && matchesStatus && matchesTimeRange;
  });

  const handleEdit = (user: User) => {
    setUserToEdit(user);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (user: User) => {
    setUserToDelete(user);
    setIsDeleteDialogOpen(true);
  };

  const handleUpdateUser = (updatedUser: Partial<User>) => {
    setUsers(users.map(user => 
      user.id === userToEdit?.id 
        ? { ...user, ...updatedUser }
        : user
    ));
    setUserToEdit(undefined);
    setIsEditDialogOpen(false);
  };

  const handleConfirmDelete = () => {
    if (userToDelete) {
      setUsers(users.filter(user => user.id !== userToDelete.id));
      setUserToDelete(undefined);
      setIsDeleteDialogOpen(false);
    }
  };

  const handleExportExcel = () => {
    // Implement Excel export
    console.log('Exporting to Excel...');
  };

  const handleExportPDF = () => {
    // Implement PDF export
    console.log('Exporting to PDF...');
  };

  const getStatusColor = (status: User["status"]) => {
    return status === "active" 
      ? "bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400"
      : "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400";
  };

  const getRoleColor = (role: Role) => {
    switch (role) {
      case "admin":
        return "bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400";
      case "doctor":
        return "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400";
      case "receptionist":
        return "bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400";
      case "staff":
        return "bg-yellow-50 text-yellow-600 dark:bg-yellow-500/10 dark:text-yellow-400";
      default:
        return "bg-gray-50 text-gray-600 dark:bg-gray-500/10 dark:text-gray-400";
    }
  };

  return (
    <>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Last Login</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge className={getRoleColor(user.role)}>
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className={getStatusColor(user.status)}>
                    {user.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {new Date(user.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {user.lastLogin
                    ? new Date(user.lastLogin).toLocaleDateString()
                    : "Never"}
                </TableCell>
                <TableCell>
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => handleEdit(user)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-red-700 hover:bg-red-100 dark:text-red-300 dark:hover:bg-red-900"
                      onClick={() => handleDelete(user)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Showing {filteredUsers.length} users
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
                onClick={handleExportExcel}
              >
                <Download className="h-4 w-4" />
                Export Excel
              </Button>
              <Button 
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
                onClick={handleExportPDF}
              >
                <FileText className="h-4 w-4" />
                Export PDF
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Dialog */}
      <UserDialog 
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        user={userToEdit}
        onSave={handleUpdateUser}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the user {userToDelete?.name}.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
} 