var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import SubjectSelection from "@/components/SubjectSelection";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getSubscriptionColor } from "@/lib/utils";
import { Link } from "wouter";
import { AlertTriangle, CheckCircle2, CreditCard, User } from "lucide-react";
var profileSchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Please enter a valid email address"),
    phoneNumber: z.string()
        .min(10, "Phone number must be at least 10 digits")
        .max(15, "Phone number must not exceed 15 digits")
        .optional(),
    subscribedSubjects: z.array(z.string()).default([]),
});
var educationSchema = z.object({
    grade: z.coerce.number().min(6).max(12),
    board: z.enum(["CBSE", "ICSE", "ISC"]),
});
var passwordSchema = z.object({
    currentPassword: z.string().min(6, "Current password is required"),
    newPassword: z.string().min(6, "New password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Confirm password is required"),
}).refine(function (data) { return data.newPassword === data.confirmPassword; }, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});
var Settings = function () {
    var _a = useAuth(), user = _a.user, isLoading = _a.isLoading;
    var _b = useState(false), isUpdatingProfile = _b[0], setIsUpdatingProfile = _b[1];
    var _c = useState(false), isUpdatingEducation = _c[0], setIsUpdatingEducation = _c[1];
    var _d = useState(false), isUpdatingPassword = _d[0], setIsUpdatingPassword = _d[1];
    var _e = useState((user === null || user === void 0 ? void 0 : user.subscribedSubjects) || []), selectedSubjects = _e[0], setSelectedSubjects = _e[1];
    var _f = useState((user === null || user === void 0 ? void 0 : user.stream) || ""), selectedStream = _f[0], setSelectedStream = _f[1];
    var toast = useToast().toast;
    var queryClient = useQueryClient();
    // Update state when user data loads
    useEffect(function () {
        if (user) {
            setSelectedSubjects(user.subscribedSubjects || []);
            setSelectedStream(user.stream || "");
        }
    }, [user]);
    var profileForm = useForm({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            firstName: (user === null || user === void 0 ? void 0 : user.firstName) || "",
            lastName: (user === null || user === void 0 ? void 0 : user.lastName) || "",
            email: (user === null || user === void 0 ? void 0 : user.email) || "",
            phoneNumber: (user === null || user === void 0 ? void 0 : user.phoneNumber) || "",
            subscribedSubjects: (user === null || user === void 0 ? void 0 : user.subscribedSubjects) || [],
        },
    });
    var educationForm = useForm({
        resolver: zodResolver(educationSchema),
        defaultValues: {
            grade: (user === null || user === void 0 ? void 0 : user.grade) || 6,
            board: (user === null || user === void 0 ? void 0 : user.board) || "CBSE",
        },
    });
    var passwordForm = useForm({
        resolver: zodResolver(passwordSchema),
        defaultValues: {
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        },
    });
    var onSubmitProfile = function (data) { return __awaiter(void 0, void 0, void 0, function () {
        var updateData, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!user)
                        return [2 /*return*/];
                    setIsUpdatingProfile(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    updateData = __assign(__assign({}, data), { subscribedSubjects: selectedSubjects, stream: selectedStream || user.stream });
                    return [4 /*yield*/, apiRequest("PATCH", "/api/users/".concat(user.id), updateData)];
                case 2:
                    _a.sent();
                    toast({
                        title: "Profile updated",
                        description: "Your profile information has been updated successfully.",
                    });
                    // Invalidate user query to refetch updated data
                    queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
                    return [3 /*break*/, 5];
                case 3:
                    error_1 = _a.sent();
                    toast({
                        title: "Error updating profile",
                        description: "There was a problem updating your profile. Please try again.",
                        variant: "destructive",
                    });
                    return [3 /*break*/, 5];
                case 4:
                    setIsUpdatingProfile(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var onSubmitEducation = function (data) { return __awaiter(void 0, void 0, void 0, function () {
        var error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!user)
                        return [2 /*return*/];
                    setIsUpdatingEducation(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, apiRequest("PATCH", "/api/users/".concat(user.id), data)];
                case 2:
                    _a.sent();
                    toast({
                        title: "Education details updated",
                        description: "Your education information has been updated successfully.",
                    });
                    // Invalidate user query to refetch updated data
                    queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
                    return [3 /*break*/, 5];
                case 3:
                    error_2 = _a.sent();
                    toast({
                        title: "Error updating education details",
                        description: "There was a problem updating your education details. Please try again.",
                        variant: "destructive",
                    });
                    return [3 /*break*/, 5];
                case 4:
                    setIsUpdatingEducation(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var onSubmitPassword = function (data) { return __awaiter(void 0, void 0, void 0, function () {
        var error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!user)
                        return [2 /*return*/];
                    setIsUpdatingPassword(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, apiRequest("PATCH", "/api/users/".concat(user.id, "/password"), {
                            currentPassword: data.currentPassword,
                            newPassword: data.newPassword,
                        })];
                case 2:
                    _a.sent();
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
                    return [3 /*break*/, 5];
                case 3:
                    error_3 = _a.sent();
                    toast({
                        title: "Error updating password",
                        description: "There was a problem updating your password. Please ensure your current password is correct.",
                        variant: "destructive",
                    });
                    return [3 /*break*/, 5];
                case 4:
                    setIsUpdatingPassword(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    if (isLoading) {
        return (<div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse w-48 mb-6"></div>
          <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
        </div>
      </div>);
    }
    return (<div className="py-6">
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
                              <FormField control={profileForm.control} name="firstName" render={function (_a) {
            var field = _a.field;
            return (<FormItem>
                                    <FormLabel>First name</FormLabel>
                                    <FormControl>
                                      <Input {...field} disabled/>
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>);
        }}/>
                              
                              <FormField control={profileForm.control} name="lastName" render={function (_a) {
            var field = _a.field;
            return (<FormItem>
                                    <FormLabel>Last name</FormLabel>
                                    <FormControl>
                                      <Input {...field} disabled/>
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>);
        }}/>
                            </div>
                            
                            <FormField control={profileForm.control} name="phoneNumber" render={function (_a) {
            var field = _a.field;
            return (<FormItem>
                                  <FormLabel>Phone Number</FormLabel>
                                  <FormControl>
                                    <Input {...field} disabled/>
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>);
        }}/>
                            
                            <FormField control={profileForm.control} name="email" render={function (_a) {
            var field = _a.field;
            return (<FormItem>
                                  <FormLabel>Email</FormLabel>
                                  <FormControl>
                                    <Input {...field} type="email" disabled/>
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>);
        }}/>
                            
                            {/* Current Preferred Subjects Display */}
                            <div className="space-y-2">
                              <label className="text-sm font-medium leading-none">
                                Preferred Subjects
                              </label>
                              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md border">
                                {selectedSubjects.length > 0 ? (<div className="flex flex-wrap gap-2">
                                    {selectedSubjects.map(function (subjectCode) {
                var _a;
                var subjectName = (_a = subjectCode.split('_').pop()) === null || _a === void 0 ? void 0 : _a.replace(/_/g, ' ');
                return (<span key={subjectCode} className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-md text-sm">
                                          {subjectName}
                                        </span>);
            })}
                                  </div>) : (<p className="text-sm text-gray-500 dark:text-gray-400">No subjects selected</p>)}
                              </div>
                              <button type="button" onClick={function () { return setIsUpdatingProfile(!isUpdatingProfile); }} className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                                {isUpdatingProfile ? "Cancel" : "Update Subjects"}
                              </button>
                            </div>

                            {/* Structured Subject Selection - Show only when updating */}
                            {isUpdatingProfile && (user === null || user === void 0 ? void 0 : user.board) && (user === null || user === void 0 ? void 0 : user.grade) && (<div className="space-y-4 border-t pt-4">
                                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                  Select New Subjects
                                </label>
                                <SubjectSelection board={user.board} grade={user.grade} stream={user.stream || selectedStream} selectedSubjects={selectedSubjects} onSubjectsChange={setSelectedSubjects} onStreamChange={setSelectedStream}/>
                              </div>)}
                            
                            {isUpdatingProfile && (<Button type="button" onClick={function () { return __awaiter(void 0, void 0, void 0, function () {
                var updateData, error_4;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!user)
                                return [2 /*return*/];
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            updateData = {
                                subscribedSubjects: selectedSubjects,
                                stream: selectedStream || user.stream,
                            };
                            return [4 /*yield*/, apiRequest("PATCH", "/api/users/".concat(user.id), updateData)];
                        case 2:
                            _a.sent();
                            toast({
                                title: "Subjects updated",
                                description: "Your subject preferences have been updated successfully.",
                            });
                            queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
                            setIsUpdatingProfile(false);
                            return [3 /*break*/, 4];
                        case 3:
                            error_4 = _a.sent();
                            toast({
                                title: "Error updating subjects",
                                description: "There was a problem updating your subjects. Please try again.",
                                variant: "destructive",
                            });
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            }); }} disabled={selectedSubjects.length === 0}>
                                Save Changes
                              </Button>)}
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
                              <FormField control={educationForm.control} name="grade" render={function (_a) {
            var _b;
            var field = _a.field;
            return (<FormItem>
                                    <FormLabel>Grade</FormLabel>
                                    <Select onValueChange={function (value) { return field.onChange(parseInt(value)); }} defaultValue={(_b = field.value) === null || _b === void 0 ? void 0 : _b.toString()}>
                                      <FormControl>
                                        <SelectTrigger>
                                          <SelectValue placeholder="Select grade"/>
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent>
                                        {[6, 7, 8, 9, 10, 11, 12].map(function (grade) { return (<SelectItem key={grade} value={grade.toString()}>
                                            Grade {grade}
                                          </SelectItem>); })}
                                      </SelectContent>
                                    </Select>
                                    <FormMessage />
                                  </FormItem>);
        }}/>
                              
                              <FormField control={educationForm.control} name="board" render={function (_a) {
            var field = _a.field;
            return (<FormItem>
                                    <FormLabel>Board</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                      <FormControl>
                                        <SelectTrigger>
                                          <SelectValue placeholder="Select board"/>
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent>
                                        <SelectItem value="CBSE">CBSE</SelectItem>
                                        <SelectItem value="ICSE">ICSE</SelectItem>
                                        <SelectItem value="ISC">ISC</SelectItem>
                                      </SelectContent>
                                    </Select>
                                    <FormMessage />
                                  </FormItem>);
        }}/>
                              
                              <Button type="submit" disabled={isUpdatingEducation || !educationForm.formState.isDirty}>
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
                              <FormField control={passwordForm.control} name="currentPassword" render={function (_a) {
            var field = _a.field;
            return (<FormItem>
                                    <FormLabel>Current Password</FormLabel>
                                    <FormControl>
                                      <Input type="password" {...field}/>
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>);
        }}/>
                              
                              <FormField control={passwordForm.control} name="newPassword" render={function (_a) {
            var field = _a.field;
            return (<FormItem>
                                    <FormLabel>New Password</FormLabel>
                                    <FormControl>
                                      <Input type="password" {...field}/>
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>);
        }}/>
                              
                              <FormField control={passwordForm.control} name="confirmPassword" render={function (_a) {
            var field = _a.field;
            return (<FormItem>
                                    <FormLabel>Confirm New Password</FormLabel>
                                    <FormControl>
                                      <Input type="password" {...field}/>
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>);
        }}/>
                              
                              <Button type="submit" disabled={isUpdatingPassword || !passwordForm.formState.isDirty}>
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
                              <div className={"p-2 rounded-full ".concat(getSubscriptionColor((user === null || user === void 0 ? void 0 : user.subscriptionTier) || "free"))}>
                                <CreditCard className="h-6 w-6"/>
                              </div>
                            </div>
                            <div className="ml-4">
                              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                {(user === null || user === void 0 ? void 0 : user.subscriptionTier) === "premium" ? "Premium Plan" :
            (user === null || user === void 0 ? void 0 : user.subscriptionTier) === "standard" ? "Standard Plan" :
                "Free Plan"}
                              </h3>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {(user === null || user === void 0 ? void 0 : user.subscriptionTier) === "premium" ? "₹1999/year" :
            (user === null || user === void 0 ? void 0 : user.subscriptionTier) === "standard" ? "₹999/year" :
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
                            {(user === null || user === void 0 ? void 0 : user.subscriptionTier) === "premium" ? (<>
                                <li className="flex items-center text-sm">
                                  <CheckCircle2 className="h-4 w-4 text-green-500 mr-2"/>
                                  <span>3 quizzes per subject per day</span>
                                </li>
                                <li className="flex items-center text-sm">
                                  <CheckCircle2 className="h-4 w-4 text-green-500 mr-2"/>
                                  <span>15-minute daily doubt solving</span>
                                </li>
                                <li className="flex items-center text-sm">
                                  <CheckCircle2 className="h-4 w-4 text-green-500 mr-2"/>
                                  <span>All question types</span>
                                </li>
                                <li className="flex items-center text-sm">
                                  <CheckCircle2 className="h-4 w-4 text-green-500 mr-2"/>
                                  <span>Advanced Bloom's Taxonomy</span>
                                </li>
                                <li className="flex items-center text-sm">
                                  <CheckCircle2 className="h-4 w-4 text-green-500 mr-2"/>
                                  <span>Comprehensive analytics</span>
                                </li>
                              </>) : (user === null || user === void 0 ? void 0 : user.subscriptionTier) === "standard" ? (<>
                                <li className="flex items-center text-sm">
                                  <CheckCircle2 className="h-4 w-4 text-green-500 mr-2"/>
                                  <span>1 quiz per subject per day</span>
                                </li>
                                <li className="flex items-center text-sm">
                                  <CheckCircle2 className="h-4 w-4 text-green-500 mr-2"/>
                                  <span>Unlimited doubt queries</span>
                                </li>
                                <li className="flex items-center text-sm">
                                  <CheckCircle2 className="h-4 w-4 text-green-500 mr-2"/>
                                  <span>All subjects</span>
                                </li>
                                <li className="flex items-center text-sm">
                                  <CheckCircle2 className="h-4 w-4 text-green-500 mr-2"/>
                                  <span>Detailed reports</span>
                                </li>
                                <li className="flex items-center text-sm">
                                  <CheckCircle2 className="h-4 w-4 text-green-500 mr-2"/>
                                  <span>24/7 support</span>
                                </li>
                              </>) : (<>
                                <li className="flex items-center text-sm">
                                  <CheckCircle2 className="h-4 w-4 text-green-500 mr-2"/>
                                  <span>1 quiz per subject per week</span>
                                </li>
                                <li className="flex items-center text-sm">
                                  <CheckCircle2 className="h-4 w-4 text-green-500 mr-2"/>
                                  <span>2 daily doubt queries</span>
                                </li>
                                <li className="flex items-center text-sm">
                                  <CheckCircle2 className="h-4 w-4 text-green-500 mr-2"/>
                                  <span>MCQs only</span>
                                </li>
                                <li className="flex items-center text-sm">
                                  <CheckCircle2 className="h-4 w-4 text-green-500 mr-2"/>
                                  <span>Basic reports</span>
                                </li>
                                <li className="flex items-center text-sm">
                                  <AlertTriangle className="h-4 w-4 text-amber-500 mr-2"/>
                                  <span>No scheduling</span>
                                </li>
                              </>)}
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
                        {(user === null || user === void 0 ? void 0 : user.subscriptionTier) === "free" ? (<div className="text-center py-6">
                            <User className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-600 mb-4"/>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No billing history</h3>
                            <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto mb-4">
                              You're currently on the Free plan. Upgrade to a paid plan to view billing history.
                            </p>
                            <Link href="/pricing">
                              <Button>Upgrade Plan</Button>
                            </Link>
                          </div>) : (<div className="border rounded-md divide-y">
                            <div className="flex items-center justify-between p-4">
                              <div>
                                <p className="font-medium">{(user === null || user === void 0 ? void 0 : user.subscriptionTier) === "premium" ? "Premium Plan" : "Standard Plan"}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Annual subscription</p>
                              </div>
                              <div className="text-right">
                                <p className="font-medium">{(user === null || user === void 0 ? void 0 : user.subscriptionTier) === "premium" ? "₹1999" : "₹999"}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">May 15, 2023</p>
                              </div>
                            </div>
                          </div>)}
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
      </div>
    </div>);
};
export default Settings;
