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
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { formatDate } from "@/lib/utils";
import { Users, Layers, BookOpen, Activity, PlusCircle, Trash2, FileEdit, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
// Schemas for forms
var subjectSchema = z.object({
    name: z.string().min(2, "Name is required"),
    gradeLevel: z.coerce.number().min(6).max(12),
    board: z.enum(["CBSE", "ICSE", "ISC"]),
});
var chapterSchema = z.object({
    name: z.string().min(2, "Name is required"),
    description: z.string().optional(),
    subjectId: z.coerce.number(),
});
var AdminDashboard = function () {
    var _a = useState("users"), activeTab = _a[0], setActiveTab = _a[1];
    var _b = useState(""), searchTerm = _b[0], setSearchTerm = _b[1];
    var _c = useState(false), isSubjectDialogOpen = _c[0], setIsSubjectDialogOpen = _c[1];
    var _d = useState(false), isChapterDialogOpen = _d[0], setIsChapterDialogOpen = _d[1];
    var _e = useState(false), isSubmitting = _e[0], setIsSubmitting = _e[1];
    var toast = useToast().toast;
    var queryClient = useQueryClient();
    // Fetch data
    var _f = useQuery({
        queryKey: ["/api/admin/users"],
    }), users = _f.data, isLoadingUsers = _f.isLoading;
    var _g = useQuery({
        queryKey: ["/api/subjects"],
    }), subjects = _g.data, isLoadingSubjects = _g.isLoading;
    var _h = useQuery({
        queryKey: ["/api/admin/chapters"],
    }), chapters = _h.data, isLoadingChapters = _h.isLoading;
    var _j = useQuery({
        queryKey: ["/api/admin/quizzes"],
    }), quizzes = _j.data, isLoadingQuizzes = _j.isLoading;
    // Form setup
    var subjectForm = useForm({
        resolver: zodResolver(subjectSchema),
        defaultValues: {
            name: "",
            gradeLevel: 10,
            board: "CBSE",
        },
    });
    var chapterForm = useForm({
        resolver: zodResolver(chapterSchema),
        defaultValues: {
            name: "",
            description: "",
            subjectId: 0,
        },
    });
    // Filter data based on search term
    var filteredUsers = users === null || users === void 0 ? void 0 : users.filter(function (user) {
        return user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (user.firstName && user.firstName.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (user.lastName && user.lastName.toLowerCase().includes(searchTerm.toLowerCase()));
    });
    var filteredSubjects = subjects === null || subjects === void 0 ? void 0 : subjects.filter(function (subject) {
        return subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            subject.board.toLowerCase().includes(searchTerm.toLowerCase());
    });
    var filteredChapters = chapters === null || chapters === void 0 ? void 0 : chapters.filter(function (chapter) {
        return chapter.name.toLowerCase().includes(searchTerm.toLowerCase());
    });
    var filteredQuizzes = quizzes === null || quizzes === void 0 ? void 0 : quizzes.filter(function (quiz) {
        return quiz.title.toLowerCase().includes(searchTerm.toLowerCase());
    });
    // Handlers
    var handleCreateSubject = function (data) { return __awaiter(void 0, void 0, void 0, function () {
        var error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setIsSubmitting(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, apiRequest("POST", "/api/admin/subjects", data)];
                case 2:
                    _a.sent();
                    toast({
                        title: "Subject created",
                        description: "The subject has been created successfully.",
                    });
                    // Invalidate subjects query to refetch data
                    queryClient.invalidateQueries({ queryKey: ["/api/subjects"] });
                    // Reset form and close dialog
                    subjectForm.reset();
                    setIsSubjectDialogOpen(false);
                    return [3 /*break*/, 5];
                case 3:
                    error_1 = _a.sent();
                    toast({
                        title: "Error creating subject",
                        description: "There was a problem creating the subject. Please try again.",
                        variant: "destructive",
                    });
                    return [3 /*break*/, 5];
                case 4:
                    setIsSubmitting(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var handleCreateChapter = function (data) { return __awaiter(void 0, void 0, void 0, function () {
        var error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setIsSubmitting(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, apiRequest("POST", "/api/admin/chapters", data)];
                case 2:
                    _a.sent();
                    toast({
                        title: "Chapter created",
                        description: "The chapter has been created successfully.",
                    });
                    // Invalidate chapters query to refetch data
                    queryClient.invalidateQueries({ queryKey: ["/api/admin/chapters"] });
                    // Reset form and close dialog
                    chapterForm.reset();
                    setIsChapterDialogOpen(false);
                    return [3 /*break*/, 5];
                case 3:
                    error_2 = _a.sent();
                    toast({
                        title: "Error creating chapter",
                        description: "There was a problem creating the chapter. Please try again.",
                        variant: "destructive",
                    });
                    return [3 /*break*/, 5];
                case 4:
                    setIsSubmitting(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    // Stats
    var userCount = (users === null || users === void 0 ? void 0 : users.length) || 0;
    var freeUsers = (users === null || users === void 0 ? void 0 : users.filter(function (u) { return u.subscriptionTier === "free"; }).length) || 0;
    var standardUsers = (users === null || users === void 0 ? void 0 : users.filter(function (u) { return u.subscriptionTier === "standard"; }).length) || 0;
    var premiumUsers = (users === null || users === void 0 ? void 0 : users.filter(function (u) { return u.subscriptionTier === "premium"; }).length) || 0;
    var subjectCount = (subjects === null || subjects === void 0 ? void 0 : subjects.length) || 0;
    var chapterCount = (chapters === null || chapters === void 0 ? void 0 : chapters.length) || 0;
    var quizCount = (quizzes === null || quizzes === void 0 ? void 0 : quizzes.length) || 0;
    return (<div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary h-8 w-8 mr-2">
                <path d="M6 4v6a6 6 0 0 0 12 0V4"></path>
                <line x1="4" y1="20" x2="20" y2="20"></line>
              </svg>
              <span className="font-bold text-xl text-gray-900 dark:text-white">QuizRevise Admin</span>
            </div>
            <div className="flex items-center">
              <form action="/api/auth/logout" method="post">
                <Button variant="outline" type="submit">Logout</Button>
              </form>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Admin Dashboard</h1>
        
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground"/>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userCount}</div>
              <div className="text-xs text-muted-foreground mt-1">
                {freeUsers} free, {standardUsers} standard, {premiumUsers} premium
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Subjects</CardTitle>
              <Layers className="h-4 w-4 text-muted-foreground"/>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{subjectCount}</div>
              <div className="text-xs text-muted-foreground mt-1">
                Across all grades
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Chapters</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground"/>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{chapterCount}</div>
              <div className="text-xs text-muted-foreground mt-1">
                Across all subjects
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Quizzes</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground"/>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{quizCount}</div>
              <div className="text-xs text-muted-foreground mt-1">
                Created by all users
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Tabs and Content */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <Tabs defaultValue="users" value={activeTab} onValueChange={setActiveTab}>
            <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
              <TabsList>
                <TabsTrigger value="users">Users</TabsTrigger>
                <TabsTrigger value="subjects">Subjects</TabsTrigger>
                <TabsTrigger value="chapters">Chapters</TabsTrigger>
                <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
              </TabsList>
              
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"/>
                  <Input placeholder={"Search ".concat(activeTab, "...")} className="w-64 pl-10" value={searchTerm} onChange={function (e) { return setSearchTerm(e.target.value); }}/>
                </div>
                
                {activeTab === "subjects" && (<Dialog open={isSubjectDialogOpen} onOpenChange={setIsSubjectDialogOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <PlusCircle className="h-4 w-4 mr-2"/>
                        Add Subject
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Subject</DialogTitle>
                        <DialogDescription>
                          Create a new subject for students to create quizzes on.
                        </DialogDescription>
                      </DialogHeader>
                      
                      <Form {...subjectForm}>
                        <form onSubmit={subjectForm.handleSubmit(handleCreateSubject)} className="space-y-4">
                          <FormField control={subjectForm.control} name="name" render={function (_a) {
                var field = _a.field;
                return (<FormItem>
                                <FormLabel>Subject Name</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="e.g., Mathematics"/>
                                </FormControl>
                                <FormMessage />
                              </FormItem>);
            }}/>
                          
                          <FormField control={subjectForm.control} name="gradeLevel" render={function (_a) {
                var field = _a.field;
                return (<FormItem>
                                <FormLabel>Grade Level</FormLabel>
                                <Select onValueChange={function (value) { return field.onChange(parseInt(value)); }} defaultValue={field.value.toString()}>
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
                          
                          <FormField control={subjectForm.control} name="board" render={function (_a) {
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
                          
                          <DialogFooter>
                            <Button type="submit" disabled={isSubmitting}>
                              {isSubmitting ? "Creating..." : "Create Subject"}
                            </Button>
                          </DialogFooter>
                        </form>
                      </Form>
                    </DialogContent>
                  </Dialog>)}
                
                {activeTab === "chapters" && (<Dialog open={isChapterDialogOpen} onOpenChange={setIsChapterDialogOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <PlusCircle className="h-4 w-4 mr-2"/>
                        Add Chapter
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Chapter</DialogTitle>
                        <DialogDescription>
                          Create a new chapter for a subject.
                        </DialogDescription>
                      </DialogHeader>
                      
                      <Form {...chapterForm}>
                        <form onSubmit={chapterForm.handleSubmit(handleCreateChapter)} className="space-y-4">
                          <FormField control={chapterForm.control} name="name" render={function (_a) {
                var field = _a.field;
                return (<FormItem>
                                <FormLabel>Chapter Name</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="e.g., Algebra Basics"/>
                                </FormControl>
                                <FormMessage />
                              </FormItem>);
            }}/>
                          
                          <FormField control={chapterForm.control} name="description" render={function (_a) {
                var field = _a.field;
                return (<FormItem>
                                <FormLabel>Description (Optional)</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="Brief description of the chapter"/>
                                </FormControl>
                                <FormMessage />
                              </FormItem>);
            }}/>
                          
                          <FormField control={chapterForm.control} name="subjectId" render={function (_a) {
                var field = _a.field;
                return (<FormItem>
                                <FormLabel>Subject</FormLabel>
                                <Select onValueChange={function (value) { return field.onChange(parseInt(value)); }} defaultValue={field.value.toString()}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select subject"/>
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {isLoadingSubjects ? (<SelectItem value="loading" disabled>Loading subjects...</SelectItem>) : subjects && subjects.length > 0 ? (subjects.map(function (subject) { return (<SelectItem key={subject.id} value={subject.id.toString()}>
                                          {subject.name} (Grade {subject.gradeLevel}, {subject.board})
                                        </SelectItem>); })) : (<SelectItem value="none" disabled>No subjects available</SelectItem>)}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>);
            }}/>
                          
                          <DialogFooter>
                            <Button type="submit" disabled={isSubmitting}>
                              {isSubmitting ? "Creating..." : "Create Chapter"}
                            </Button>
                          </DialogFooter>
                        </form>
                      </Form>
                    </DialogContent>
                  </Dialog>)}
              </div>
            </div>
            
            <TabsContent value="users" className="p-6">
              {isLoadingUsers ? (<div className="space-y-4">
                  {[1, 2, 3].map(function (i) { return (<div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>); })}
                </div>) : filteredUsers && filteredUsers.length > 0 ? (<Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User ID</TableHead>
                      <TableHead>Username</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Grade/Board</TableHead>
                      <TableHead>Subscription</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map(function (user) { return (<TableRow key={user.id}>
                        <TableCell className="font-medium">{user.id}</TableCell>
                        <TableCell>{user.username}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.firstName} {user.lastName}</TableCell>
                        <TableCell>{user.grade ? "Grade ".concat(user.grade) : "N/A"} {user.board ? "(".concat(user.board, ")") : ""}</TableCell>
                        <TableCell>
                          <span className={"px-2 py-1 rounded-full text-xs font-semibold ".concat(user.subscriptionTier === "premium"
                    ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                    : user.subscriptionTier === "standard"
                        ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                        : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300")}>
                            {user.subscriptionTier.charAt(0).toUpperCase() + user.subscriptionTier.slice(1)}
                          </span>
                        </TableCell>
                        <TableCell>{formatDate(user.createdAt)}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="icon">
                              <FileEdit className="h-4 w-4"/>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>); })}
                  </TableBody>
                </Table>) : (<div className="text-center py-12">
                  <p className="text-gray-500 dark:text-gray-400">No users found</p>
                </div>)}
            </TabsContent>
            
            <TabsContent value="subjects" className="p-6">
              {isLoadingSubjects ? (<div className="space-y-4">
                  {[1, 2, 3].map(function (i) { return (<div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>); })}
                </div>) : filteredSubjects && filteredSubjects.length > 0 ? (<Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Subject ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Grade Level</TableHead>
                      <TableHead>Board</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSubjects.map(function (subject) { return (<TableRow key={subject.id}>
                        <TableCell className="font-medium">{subject.id}</TableCell>
                        <TableCell>{subject.name}</TableCell>
                        <TableCell>Grade {subject.gradeLevel}</TableCell>
                        <TableCell>{subject.board}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="icon">
                              <FileEdit className="h-4 w-4"/>
                            </Button>
                            <Button variant="ghost" size="icon" className="text-red-500 dark:text-red-400">
                              <Trash2 className="h-4 w-4"/>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>); })}
                  </TableBody>
                </Table>) : (<div className="text-center py-12">
                  <p className="text-gray-500 dark:text-gray-400">No subjects found</p>
                </div>)}
            </TabsContent>
            
            <TabsContent value="chapters" className="p-6">
              {isLoadingChapters ? (<div className="space-y-4">
                  {[1, 2, 3].map(function (i) { return (<div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>); })}
                </div>) : filteredChapters && filteredChapters.length > 0 ? (<Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Chapter ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Subject ID</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredChapters.map(function (chapter) { return (<TableRow key={chapter.id}>
                        <TableCell className="font-medium">{chapter.id}</TableCell>
                        <TableCell>{chapter.name}</TableCell>
                        <TableCell>{chapter.description || "N/A"}</TableCell>
                        <TableCell>{chapter.subjectId}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="icon">
                              <FileEdit className="h-4 w-4"/>
                            </Button>
                            <Button variant="ghost" size="icon" className="text-red-500 dark:text-red-400">
                              <Trash2 className="h-4 w-4"/>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>); })}
                  </TableBody>
                </Table>) : (<div className="text-center py-12">
                  <p className="text-gray-500 dark:text-gray-400">No chapters found</p>
                </div>)}
            </TabsContent>
            
            <TabsContent value="quizzes" className="p-6">
              {isLoadingQuizzes ? (<div className="space-y-4">
                  {[1, 2, 3].map(function (i) { return (<div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>); })}
                </div>) : filteredQuizzes && filteredQuizzes.length > 0 ? (<Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Quiz ID</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>User ID</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created At</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredQuizzes.map(function (quiz) { return (<TableRow key={quiz.id}>
                        <TableCell className="font-medium">{quiz.id}</TableCell>
                        <TableCell>{quiz.title}</TableCell>
                        <TableCell>{quiz.userId}</TableCell>
                        <TableCell>
                          <span className={"px-2 py-1 rounded-full text-xs font-semibold ".concat(quiz.status === "active"
                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                    : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300")}>
                            {quiz.status.charAt(0).toUpperCase() + quiz.status.slice(1)}
                          </span>
                        </TableCell>
                        <TableCell>{formatDate(quiz.createdAt)}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="icon">
                              <FileEdit className="h-4 w-4"/>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>); })}
                  </TableBody>
                </Table>) : (<div className="text-center py-12">
                  <p className="text-gray-500 dark:text-gray-400">No quizzes found</p>
                </div>)}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>);
};
export default AdminDashboard;
