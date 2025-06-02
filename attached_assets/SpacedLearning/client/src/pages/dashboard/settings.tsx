import { useState } from "react";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import Sidebar from "@/components/dashboard/Sidebar";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getSubscriptionColor } from "@/lib/utils";
import { Link } from "wouter";
import { AlertTriangle, CheckCircle2, CreditCard, User } from "lucide-react";

const profileSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Please enter a valid email address"),
  phoneNumber: z.string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number must not exceed 15 digits")
    .optional(),
  preferredSubject: z.string().optional(),
});

const educationSchema = z.object({
  grade: z.coerce.number().min(6).max(12),
  board: z.enum(["CBSE", "ICSE", "ISC"]),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(6, "Current password is required"),
  newPassword: z.string().min(6, "New password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Confirm password is required"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ProfileFormValues = z.infer<typeof profileSchema>;
type EducationFormValues = z.infer<typeof educationSchema>;
type PasswordFormValues = z.infer<typeof passwordSchema>;

const Settings = () => {
  const { user, isLoading } = useAuth();
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isUpdatingEducation, setIsUpdatingEducation] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Fetch subjects for the dropdown
  const { data: subjects = [] } = useQuery<{id: number, name: string}[]>({
    queryKey: ["/api/subjects"],
  });

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      phoneNumber: user?.phoneNumber || "",
      preferredSubject: user?.preferredSubject?.toString() || "",
    },
  });

  const educationForm = useForm<EducationFormValues>({
    resolver: zodResolver(educationSchema),
    defaultValues: {
      grade: user?.grade || 6,
      board: (user?.board as "CBSE" | "ICSE" | "ISC") || "CBSE",
    },
  });

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmitProfile = async (data: ProfileFormValues) => {
    if (!user) return;
    
    setIsUpdatingProfile(true);
    try {
      await apiRequest("PATCH", `/api/users/${user.id}`, data);
      
      toast({
        title: "Profile updated",
        description: "Your profile information has been updated successfully.",
      });
      
      // Invalidate user query to refetch updated data
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
    } catch (error) {
      toast({
        title: "Error updating profile",
        description: "There was a problem updating your profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const onSubmitEducation = async (data: EducationFormValues) => {
    if (!user) return;
    
    setIsUpdatingEducation(true);
    try {
      await apiRequest("PATCH", `/api/users/${user.id}`, data);
      
      toast({
        title: "Education details updated",
        description: "Your education information has been updated successfully.",
      });
      
      // Invalidate user query to refetch updated data
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
    } catch (error) {
      toast({
        title: "Error updating education details",
        description: "There was a problem updating your education details. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUpdatingEducation(false);
    }
  };

  const onSubmitPassword = async (data: PasswordFormValues) => {
    if (!user) return;
    
    setIsUpdatingPassword(true);
    try {
      await apiRequest("PATCH", `/api/users/${user.id}/password`, {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      
      toast({
        title: "Password updated",
        description: "Your password has been updated successfully.",
      });
      
      // Reset password form
      passwordForm.reset({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      toast({
        title: "Error updating password",
        description: "There was a problem updating your password. Please ensure your current password is correct.",
        variant: "destructive",
      });
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen overflow-hidden">
        <div className="hidden md:flex md:flex-shrink-0 md:w-64">
          <Sidebar />
        </div>
        
        <div className="flex flex-col flex-1 overflow-hidden">
          <main className="flex-1 relative overflow-y-auto focus:outline-none bg-gray-50 dark:bg-gray-900">
            <div className="py-6">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse w-48 mb-6"></div>
                <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="hidden md:flex md:flex-shrink-0 md:w-64">
        <Sidebar />
      </div>
      
      <div className="flex flex-col flex-1 overflow-hidden">
        <main className="flex-1 relative overflow-y-auto focus:outline-none bg-gray-50 dark:bg-gray-900">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Settings</h1>
              
              <Tabs defaultValue="account" className="space-y-6">
                <TabsList>
                  <TabsTrigger value="account">Account</TabsTrigger>
                  <TabsTrigger value="subscription">Subscription</TabsTrigger>
                </TabsList>
                
                <TabsContent value="account">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Profile Information</CardTitle>
                        <CardDescription>Update your personal details</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Form {...profileForm}>
                          <form onSubmit={profileForm.handleSubmit(onSubmitProfile)} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <FormField
                                control={profileForm.control}
                                name="firstName"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>First name</FormLabel>
                                    <FormControl>
                                      <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={profileForm.control}
                                name="lastName"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Last name</FormLabel>
                                    <FormControl>
                                      <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            
                            <FormField
                              control={profileForm.control}
                              name="phoneNumber"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Phone Number</FormLabel>
                                  <FormControl>
                                    <Input {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={profileForm.control}
                              name="email"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Email</FormLabel>
                                  <FormControl>
                                    <Input {...field} type="email" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={profileForm.control}
                              name="preferredSubject"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Preferred Subjects</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Physics, Chemistry, Mathematics" {...field} />
                                  </FormControl>
                                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                    Enter multiple subjects separated by commas (e.g., Physics, Mathematics)
                                  </p>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <Button 
                              type="submit" 
                              disabled={isUpdatingProfile || !profileForm.formState.isDirty}
                            >
                              {isUpdatingProfile ? "Saving..." : "Save Changes"}
                            </Button>
                          </form>
                        </Form>
                      </CardContent>
                    </Card>
                    
                    <div className="space-y-6">
                      <Card>
                        <CardHeader>
                          <CardTitle>Education Details</CardTitle>
                          <CardDescription>Update your education information</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <Form {...educationForm}>
                            <form onSubmit={educationForm.handleSubmit(onSubmitEducation)} className="space-y-4">
                              <FormField
                                control={educationForm.control}
                                name="grade"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Grade</FormLabel>
                                    <Select 
                                      onValueChange={(value) => field.onChange(parseInt(value))}
                                      defaultValue={field.value?.toString()}
                                    >
                                      <FormControl>
                                        <SelectTrigger>
                                          <SelectValue placeholder="Select grade" />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent>
                                        {[6, 7, 8, 9, 10, 11, 12].map((grade) => (
                                          <SelectItem key={grade} value={grade.toString()}>
                                            Grade {grade}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={educationForm.control}
                                name="board"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Board</FormLabel>
                                    <Select 
                                      onValueChange={field.onChange}
                                      defaultValue={field.value}
                                    >
                                      <FormControl>
                                        <SelectTrigger>
                                          <SelectValue placeholder="Select board" />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent>
                                        <SelectItem value="CBSE">CBSE</SelectItem>
                                        <SelectItem value="ICSE">ICSE</SelectItem>
                                        <SelectItem value="ISC">ISC</SelectItem>
                                      </SelectContent>
                                    </Select>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <Button 
                                type="submit" 
                                disabled={isUpdatingEducation || !educationForm.formState.isDirty}
                              >
                                {isUpdatingEducation ? "Saving..." : "Save Changes"}
                              </Button>
                            </form>
                          </Form>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader>
                          <CardTitle>Change Password</CardTitle>
                          <CardDescription>Update your password</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <Form {...passwordForm}>
                            <form onSubmit={passwordForm.handleSubmit(onSubmitPassword)} className="space-y-4">
                              <FormField
                                control={passwordForm.control}
                                name="currentPassword"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Current Password</FormLabel>
                                    <FormControl>
                                      <Input type="password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={passwordForm.control}
                                name="newPassword"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>New Password</FormLabel>
                                    <FormControl>
                                      <Input type="password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={passwordForm.control}
                                name="confirmPassword"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Confirm New Password</FormLabel>
                                    <FormControl>
                                      <Input type="password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <Button 
                                type="submit" 
                                disabled={isUpdatingPassword || !passwordForm.formState.isDirty}
                              >
                                {isUpdatingPassword ? "Updating..." : "Update Password"}
                              </Button>
                            </form>
                          </Form>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="subscription">
                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Current Subscription</CardTitle>
                        <CardDescription>Manage your subscription plan</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="flex-shrink-0">
                              <div className={`p-2 rounded-full ${
                                getSubscriptionColor(user?.subscriptionTier || "free")
                              }`}>
                                <CreditCard className="h-6 w-6" />
                              </div>
                            </div>
                            <div className="ml-4">
                              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                {user?.subscriptionTier === "premium" ? "Premium Plan" : 
                                 user?.subscriptionTier === "standard" ? "Standard Plan" : 
                                 "Free Plan"}
                              </h3>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {user?.subscriptionTier === "premium" ? "₹1999/year" : 
                                 user?.subscriptionTier === "standard" ? "₹999/year" : 
                                 "₹0/year"}
                              </p>
                            </div>
                          </div>
                          <Link href="/pricing">
                            <Button variant="outline">Change Plan</Button>
                          </Link>
                        </div>
                        
                        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Plan Features</h4>
                          <ul className="space-y-2">
                            {user?.subscriptionTier === "premium" ? (
                              <>
                                <li className="flex items-center text-sm">
                                  <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                                  <span>3 quizzes per subject per day</span>
                                </li>
                                <li className="flex items-center text-sm">
                                  <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                                  <span>15-minute daily doubt solving</span>
                                </li>
                                <li className="flex items-center text-sm">
                                  <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                                  <span>All question types</span>
                                </li>
                                <li className="flex items-center text-sm">
                                  <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                                  <span>Advanced Bloom's Taxonomy</span>
                                </li>
                                <li className="flex items-center text-sm">
                                  <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                                  <span>Comprehensive analytics</span>
                                </li>
                              </>
                            ) : user?.subscriptionTier === "standard" ? (
                              <>
                                <li className="flex items-center text-sm">
                                  <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                                  <span>1 quiz per subject per day</span>
                                </li>
                                <li className="flex items-center text-sm">
                                  <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                                  <span>Unlimited doubt queries</span>
                                </li>
                                <li className="flex items-center text-sm">
                                  <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                                  <span>All subjects</span>
                                </li>
                                <li className="flex items-center text-sm">
                                  <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                                  <span>Detailed reports</span>
                                </li>
                                <li className="flex items-center text-sm">
                                  <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                                  <span>24/7 support</span>
                                </li>
                              </>
                            ) : (
                              <>
                                <li className="flex items-center text-sm">
                                  <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                                  <span>1 quiz per subject per week</span>
                                </li>
                                <li className="flex items-center text-sm">
                                  <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                                  <span>2 daily doubt queries</span>
                                </li>
                                <li className="flex items-center text-sm">
                                  <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                                  <span>MCQs only</span>
                                </li>
                                <li className="flex items-center text-sm">
                                  <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                                  <span>Basic reports</span>
                                </li>
                                <li className="flex items-center text-sm">
                                  <AlertTriangle className="h-4 w-4 text-amber-500 mr-2" />
                                  <span>No scheduling</span>
                                </li>
                              </>
                            )}
                          </ul>
                        </div>
                      </CardContent>
                      <CardFooter className="bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          <p>Need help with your subscription? <a href="#" className="text-primary hover:underline">Contact support</a></p>
                        </div>
                      </CardFooter>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle>Billing History</CardTitle>
                        <CardDescription>View your previous transactions</CardDescription>
                      </CardHeader>
                      <CardContent>
                        {user?.subscriptionTier === "free" ? (
                          <div className="text-center py-6">
                            <User className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-600 mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No billing history</h3>
                            <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto mb-4">
                              You're currently on the Free plan. Upgrade to a paid plan to view billing history.
                            </p>
                            <Link href="/pricing">
                              <Button>Upgrade Plan</Button>
                            </Link>
                          </div>
                        ) : (
                          <div className="border rounded-md divide-y">
                            <div className="flex items-center justify-between p-4">
                              <div>
                                <p className="font-medium">{user?.subscriptionTier === "premium" ? "Premium Plan" : "Standard Plan"}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Annual subscription</p>
                              </div>
                              <div className="text-right">
                                <p className="font-medium">{user?.subscriptionTier === "premium" ? "₹1999" : "₹999"}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">May 15, 2023</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Settings;
