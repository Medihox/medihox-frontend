"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useGetSuperAdminUserByIdQuery, useUpdateSuperAdminUserMutation, useDeleteSuperAdminUserMutation, useRenewSubscriptionMutation, useSuspendSubscriptionMutation } from "@/lib/redux/services/superAdminApi";
import { showSuccessToast, showErrorToast } from "@/lib/utils/toast";
import { getErrorMessage } from "@/lib/api/apiUtils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { format, formatDistanceToNow } from "date-fns";
import { ArrowLeft, Calendar, Edit, Trash2, Building, Mail, Phone, CheckCircle, XCircle, CreditCard, Clock, Eye, EyeOff, Copy, RefreshCw, Ban, Loader2 } from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";

export default function AdminDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const adminId = params.id as string;
  const [activeTab, setActiveTab] = useState("overview");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [secretKeyVisible, setSecretKeyVisible] = useState(false);

  // API hooks
  const { data: admin, isLoading, error, refetch } = useGetSuperAdminUserByIdQuery(adminId);
  const [deleteAdmin, { isLoading: isDeleting }] = useDeleteSuperAdminUserMutation();
  const [renewSubscription, { isLoading: isRenewing }] = useRenewSubscriptionMutation();
  const [suspendSubscription, { isLoading: isSuspending }] = useSuspendSubscriptionMutation();
  
  // Handle delete
  const handleDelete = async () => {
    try {
      await deleteAdmin(adminId).unwrap();
      showSuccessToast("Admin deleted successfully");
      router.push("/super-admin/admins");
    } catch (error) {
      showErrorToast(getErrorMessage(error) || "Failed to delete admin");
      setIsDeleteDialogOpen(false);
    }
  };

  // Add this function to handle subscription renewal
  const handleRenewSubscription = async () => {
    try {
      if (!admin) return;
      
      // Calculate new expiry date (1 year from now)
      const newExpiryDate = new Date();
      newExpiryDate.setFullYear(newExpiryDate.getFullYear() + 1);
      
      await renewSubscription({
        id: adminId,
        data: {
          expiryDate: newExpiryDate.toISOString(),
          subscriptionStatus: "active"
        }
      }).unwrap();
      
      showSuccessToast("Subscription renewed successfully");
      refetch();
    } catch (error) {
      showErrorToast(getErrorMessage(error) || "Failed to renew subscription");
    }
  };

  // Add this function to handle subscription suspension
  const handleSuspendSubscription = async () => {
    try {
      if (!admin) return;
      
      await suspendSubscription({
        id: adminId,
        data: {
          suspendedAt: new Date().toISOString(),
        }
      }).unwrap();
      
      showSuccessToast("Subscription suspended successfully");
      refetch();
    } catch (error) {
      showErrorToast(getErrorMessage(error) || "Failed to suspend subscription");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center mb-6 animate-pulse">
            <div className="h-6 w-32 bg-gray-200 dark:bg-gray-800 rounded"></div>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-6 animate-pulse">
            <div className="space-y-4">
              <div className="h-8 w-64 bg-gray-200 dark:bg-gray-800 rounded"></div>
              <div className="h-4 w-full bg-gray-100 dark:bg-gray-800 rounded"></div>
              <div className="h-4 w-3/4 bg-gray-100 dark:bg-gray-800 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-8">
        <div className="max-w-6xl mx-auto">
          <Link 
            href="/super-admin/admins" 
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Admins
          </Link>
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-red-200 dark:border-red-800 p-6">
            <div className="text-red-600 dark:text-red-400 font-medium">
              Error loading admin details. Please try again later.
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!admin) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-8">
        <div className="max-w-6xl mx-auto">
          <Link 
            href="/super-admin/admins" 
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Admins
          </Link>
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-6">
            <div className="text-gray-600 dark:text-gray-400">
              Admin not found.
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Link 
            href="/super-admin/admins" 
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Admins
          </Link>
          
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              className="text-red-600 dark:text-red-400 border-red-200 dark:border-red-900 hover:bg-red-50 dark:hover:bg-red-950"
              onClick={() => setIsDeleteDialogOpen(true)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Admin
            </Button>
            <Link href={`/super-admin/admins/${adminId}/edit`}>
              <Button size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Edit Admin
              </Button>
            </Link>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 mb-6">
          <div className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {admin.name}
                </h1>
                <div className="text-gray-500 dark:text-gray-400 mt-1">
                  {admin.organizationName || "No Organization Name"}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant={admin.status === "ACTIVE" ? "default" : "destructive"}>
                  {admin.status?.toLowerCase() || "active"}
                </Badge>
                <Badge variant={admin.subscriptionStatus === "active" ? "outline" : "secondary"}>
                  Subscription: {admin.subscriptionStatus || "none"}
                </Badge>
              </div>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="px-6">
            <TabsList className="w-full max-w-md mb-6">
              <TabsTrigger value="overview" className="flex-1">Overview</TabsTrigger>
              <TabsTrigger value="subscription" className="flex-1">Subscription</TabsTrigger>
              <TabsTrigger value="settings" className="flex-1">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <div className="space-y-6 pb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Contact Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-start gap-3">
                        <Mail className="w-5 h-5 text-gray-500 dark:text-gray-400 mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Email Address</p>
                          <p className="font-medium">{admin.email}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <Phone className="w-5 h-5 text-gray-500 dark:text-gray-400 mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Phone Number</p>
                          <p className="font-medium">{admin.phone || "Not provided"}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <Building className="w-5 h-5 text-gray-500 dark:text-gray-400 mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Organization</p>
                          <p className="font-medium">{admin.organizationName || "Not provided"}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Account Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-start gap-3">
                        <Calendar className="w-5 h-5 text-gray-500 dark:text-gray-400 mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Created On</p>
                          <p className="font-medium">{format(new Date(admin.createdAt), "MMMM d, yyyy")}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        {admin.emailVerified ? (
                          <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-500 mt-0.5" />
                        )}
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Email Verification</p>
                          <p className="font-medium">{admin.emailVerified ? "Verified" : "Not Verified"}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <Clock className="w-5 h-5 text-gray-500 dark:text-gray-400 mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Last Activity</p>
                          <p className="font-medium">N/A</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="subscription" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Subscription Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-col space-y-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</h4>
                        <div className="mt-1 flex items-center">
                          {admin.subscriptionStatus === "active" ? (
                            <Badge variant="success" className="capitalize">
                              {admin.subscriptionStatus}
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="capitalize">
                              {admin.subscriptionStatus || "None"}
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      {admin.subscriptionExpiresAt && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Expiry Date</h4>
                          <p className="mt-1 flex items-center text-gray-900 dark:text-gray-100">
                            <Calendar className="mr-2 h-4 w-4 text-gray-500" />
                            {format(new Date(admin.subscriptionExpiresAt), "MMMM dd, yyyy")}
                            <span className="ml-2 text-sm text-gray-500">
                              ({formatDistanceToNow(new Date(admin.subscriptionExpiresAt), { addSuffix: true })})
                            </span>
                          </p>
                        </div>
                      )}
                      
                      {admin.subscriptionSecretKey && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Secret Key</h4>
                          <div className="mt-1 flex items-center">
                            <div className="relative flex-1">
                              <Input 
                                type={secretKeyVisible ? "text" : "password"} 
                                value={admin.subscriptionSecretKey}
                                className="pr-10 font-mono text-sm"
                                readOnly
                              />
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="absolute right-0 top-0 h-full px-3"
                                onClick={() => setSecretKeyVisible(!secretKeyVisible)}
                              >
                                {secretKeyVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                              </Button>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="ml-2"
                              onClick={() => {
                                navigator.clipboard.writeText(admin.subscriptionSecretKey || "");
                                showSuccessToast("Secret key copied to clipboard");
                              }}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      )}
                      
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Start Date</h4>
                        <p className="mt-1 flex items-center text-gray-900 dark:text-gray-100">
                          <Calendar className="mr-2 h-4 w-4 text-gray-500" />
                          {format(new Date(admin.createdAt), "MMMM dd, yyyy")}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Subscription Management</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Manage the clinic subscription status and billing details.
                    </p>
                    
                    <div className="flex flex-col space-y-3">
                      <Button variant="outline" className="justify-start">
                        <CreditCard className="mr-2 h-4 w-4" />
                        Update Billing Information
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        className="justify-start"
                        onClick={handleRenewSubscription}
                        disabled={isRenewing}
                      >
                        {isRenewing ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Renewing...
                          </>
                        ) : (
                          <>
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Renew Subscription
                          </>
                        )}
                      </Button>
                      
                      <Button variant="outline" className="justify-start text-amber-600 hover:text-amber-700">
                        <Clock className="mr-2 h-4 w-4" />
                        Extend Trial Period
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        className="justify-start text-red-600 hover:text-red-700"
                        onClick={handleSuspendSubscription}
                        disabled={isSuspending}
                      >
                        {isSuspending ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Suspending...
                          </>
                        ) : (
                          <>
                            <Ban className="mr-2 h-4 w-4" />
                            Suspend Subscription
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="settings">
              <div className="space-y-6 pb-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Admin Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-500 dark:text-gray-400">Configure admin user settings and permissions.</p>
                    
                    <Separator className="my-4" />
                    
                    <div className="pt-2">
                      <Button className="mr-3">Reset Password</Button>
                      <Button variant="outline">Send Verification Email</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the admin account
              and remove all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete Admin"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
} 