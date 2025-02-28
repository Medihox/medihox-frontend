"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Pencil, Trash2, Eye } from "lucide-react";
import { format } from "date-fns";
import { AdminUser } from "@/lib/redux/services/superAdminApi";
import Link from "next/link";

interface AdminsListProps {
  admins: AdminUser[];
  isLoading: boolean;
  searchQuery: string;
  onEdit: (admin: AdminUser) => void;
  onDelete: (adminId: string) => void;
}

export function AdminsList({
  admins,
  isLoading,
  searchQuery,
  onEdit,
  onDelete,
}: AdminsListProps) {
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Pagination
  const totalPages = Math.ceil(admins.length / pageSize);
  const paginatedAdmins = admins.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div>
      {/* Admin Table */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 dark:bg-gray-800/50">
              <TableHead className="font-semibold w-[280px]">Admin</TableHead>
              <TableHead className="font-semibold">Organization</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold">Subscription</TableHead>
              <TableHead className="font-semibold">Created</TableHead>
              <TableHead className="text-right font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-[200px] text-center">
                  <div className="flex flex-col items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-purple-600 mb-2" />
                    <p className="text-gray-500 dark:text-gray-400">Loading admins...</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : paginatedAdmins.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-[200px] text-center">
                  <div className="flex flex-col items-center justify-center">
                    <p className="text-gray-500 dark:text-gray-400 text-lg mb-2">No admins found</p>
                    <p className="text-gray-400 dark:text-gray-500 text-sm">
                      {searchQuery && "Try adjusting your search or filters"}
                      {!searchQuery && "Start by adding a new admin"}
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              paginatedAdmins.map((admin) => (
                <TableRow key={admin.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/50">
                  <TableCell>
                    <div className="flex flex-col">
                      <Link 
                        href={`/super-admin/admins/${admin.id}`} 
                        className="font-medium text-gray-900 dark:text-gray-100 hover:text-purple-600 dark:hover:text-purple-400"
                      >
                        {admin.name}
                      </Link>
                      <div className="flex flex-col mt-1">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {admin.email}
                        </span>
                        {admin.phone && (
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {admin.phone}
                          </span>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {admin.organizationName ? (
                      <div className="font-medium">{admin.organizationName}</div>
                    ) : (
                      <span className="text-gray-500 dark:text-gray-400">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={admin.status === "ACTIVE" ? "success" : "destructive"} className="capitalize">
                      {admin.status.toLowerCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={admin.subscriptionStatus === "active" ? "outline" : "secondary"} className="capitalize">
                      {admin.subscriptionStatus || "none"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-900 dark:text-gray-300">
                        {format(new Date(admin.createdAt), "MMM dd, yyyy")}
                      </span>
                      <span className="text-xs text-gray-500">
                        {format(new Date(admin.createdAt), "h:mm a")}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => onEdit(admin)}
                      >
                        <Pencil className="h-4 w-4 text-gray-500" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => onDelete(admin.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {admins.length > 0 && (
        <div className="flex items-center justify-between px-4 py-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
          <div className="flex-1 text-sm text-gray-700 dark:text-gray-300">
            Showing <span className="font-medium">{Math.min((currentPage - 1) * pageSize + 1, admins.length)}</span> to{' '}
            <span className="font-medium">
              {Math.min(currentPage * pageSize, admins.length)}
            </span>{' '}
            of <span className="font-medium">{admins.length}</span> results
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={prevPage}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={nextPage}
              disabled={currentPage === totalPages || totalPages === 0}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
} 