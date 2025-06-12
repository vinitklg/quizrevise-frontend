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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage, } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, } from "@/components/ui/card";
import { Brain, BookOpen, Sparkles } from "lucide-react";
var createQuizSchema = z.object({
    board: z.string({
        required_error: "Please select a board",
    }),
    class: z.string({
        required_error: "Please select a class",
    }),
    subject: z.string({
        required_error: "Please select a subject",
    }),
    chapter: z
        .string({
        required_error: "Please enter a chapter",
    })
        .min(2, "Chapter must be at least 2 characters"),
    title: z
        .string()
        .min(3, "Title must be at least 3 characters")
        .max(100, "Title must be less than 100 characters"),
    topic: z.string().optional(),
    questionTypes: z.array(z.string()).optional(),
    bloomTaxonomy: z.array(z.string()).optional(),
    difficultyLevels: z.array(z.string()).optional(),
    numberOfQuestions: z.number().optional(),
    diagramSupport: z.boolean().optional(),
});
var CreateQuiz = function () {
    var _a, _b;
    var _c = useLocation(), navigate = _c[1];
    var user = useAuth().user;
    var toast = useToast().toast;
    var _d = useState(false), isSubmitting = _d[0], setIsSubmitting = _d[1];
    var _e = useState(false), showCreationNotification = _e[0], setShowCreationNotification = _e[1];
    // Get user's subscribed subjects
    var userSubjects = (user === null || user === void 0 ? void 0 : user.subscribedSubjects) || [];
    // Fetch all subjects to match with user's subscribed subject codes
    var _f = useQuery({
        queryKey: ["/api/subjects"],
        enabled: !!user,
    }), _g = _f.data, allSubjects = _g === void 0 ? [] : _g, isLoadingSubjects = _f.isLoading;
    // Filter subjects based on user's subscribed subject codes
    var subscribedSubjects = allSubjects.filter(function (subject) {
        return userSubjects.includes(subject.code);
    });
    // Define board options
    var boardOptions = [
        { value: "CBSE", label: "CBSE" },
        { value: "ICSE", label: "ICSE" },
        { value: "ISC", label: "ISC" },
    ];
    // Define class options (grades 6-12)
    var classOptions = [
        { value: "6", label: "Class 6" },
        { value: "7", label: "Class 7" },
        { value: "8", label: "Class 8" },
        { value: "9", label: "Class 9" },
        { value: "10", label: "Class 10" },
        { value: "11", label: "Class 11" },
        { value: "12", label: "Class 12" },
    ];
    // Use profile data for default values
    var form = useForm({
        resolver: zodResolver(createQuizSchema),
        defaultValues: {
            board: (user === null || user === void 0 ? void 0 : user.board) || "CBSE",
            class: ((_a = user === null || user === void 0 ? void 0 : user.grade) === null || _a === void 0 ? void 0 : _a.toString()) || "",
            subject: ((_b = subscribedSubjects[0]) === null || _b === void 0 ? void 0 : _b.name) || "",
            chapter: "",
            title: "",
            topic: "",
            questionTypes: [],
            bloomTaxonomy: [],
            difficultyLevels: [],
            numberOfQuestions: 10,
        },
    });
    var onSubmit = function (data) { return __awaiter(void 0, void 0, void 0, function () {
        var formattedData, errorMessage;
        return __generator(this, function (_a) {
            setIsSubmitting(true);
            try {
                formattedData = {
                    board: data.board,
                    class: data.class,
                    subject: data.subject,
                    chapter: data.chapter,
                    title: data.title,
                    topic: data.topic || data.title,
                    questionTypes: data.questionTypes && data.questionTypes.length
                        ? data.questionTypes
                        : ["mcq"],
                    bloomTaxonomy: data.bloomTaxonomy && data.bloomTaxonomy.length
                        ? data.bloomTaxonomy
                        : ["knowledge", "comprehension"],
                    difficultyLevels: data.difficultyLevels && data.difficultyLevels.length
                        ? data.difficultyLevels
                        : ["standard"],
                    numberOfQuestions: data.numberOfQuestions || 10,
                    diagramSupport: data.diagramSupport || false,
                };
                // Show prominent creation notification
                setShowCreationNotification(true);
                // Start the quiz creation process (don't wait for completion)
                apiRequest("POST", "/api/quizzes", formattedData).catch(function (error) {
                    console.error("Quiz creation failed:", error);
                    setShowCreationNotification(false);
                });
                // Reset form
                form.reset();
                // Navigate to today's quizzes after showing notification for 30 seconds
                setTimeout(function () {
                    navigate("/dashboard/today");
                }, 30000);
                // Hide notification after 30 seconds (same time as navigation)
                setTimeout(function () {
                    setShowCreationNotification(false);
                }, 30000);
            }
            catch (error) {
                errorMessage = "Failed to start quiz creation. Please try again.";
                // Check if it's a subscription limit error
                if (error instanceof Error &&
                    error.message.includes("Quiz limit reached")) {
                    errorMessage = "You've reached your quiz limit for the ".concat(user === null || user === void 0 ? void 0 : user.subscriptionTier, " plan. Please upgrade to create more quizzes.");
                }
                toast({
                    title: "Error",
                    description: errorMessage,
                    variant: "destructive",
                });
            }
            finally {
                setIsSubmitting(false);
            }
            return [2 /*return*/];
        });
    }); };
    // No longer need the handleSubjectChange function since we're using text inputs
    return (<div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Create Quiz
        </h1>

        {/* Prominent Quiz Creation Notification */}
        {showCreationNotification && (<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-8 mx-4 max-w-md w-full text-center">
              <div className="mb-6">
                <div className="animate-spin w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Creating Your Quiz
                </h2>
                <p className="text-gray-600 dark:text-gray-300 text-lg">
                  AI is generating 8 sets of personalized questions for your spaced repetition learning journey.
                </p>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <p className="text-blue-800 dark:text-blue-200 font-medium">
                  If similar questions exist, this will be instant. Otherwise, new questions will be generated in 1-2 minutes. Please refresh the page after completion.
                </p>
              </div>
              <button onClick={function () { return setShowCreationNotification(false); }} className="mt-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                Dismiss (continues in background)
              </button>
            </div>
          </div>)}

              <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Quiz Details</CardTitle>
                      <CardDescription>
                        Create a new quiz for spaced repetition learning
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                          <FormField control={form.control} name="title" render={function (_a) {
            var field = _a.field;
            return (<FormItem>
                                <FormLabel>Quiz Title</FormLabel>
                                <FormControl>
                                  <Input placeholder="e.g., Newton's Laws of Motion" {...field}/>
                                </FormControl>
                                <FormMessage />
                              </FormItem>);
        }}/>

                          <FormField control={form.control} name="topic" render={function (_a) {
            var field = _a.field;
            return (<FormItem>
                                <FormLabel>Topic</FormLabel>
                                <FormControl>
                                  <Input placeholder="e.g., Force and Acceleration" {...field}/>
                                </FormControl>
                                <FormDescription>
                                  Specify the particular topic within the
                                  chapter you want to focus on
                                </FormDescription>
                                <FormMessage />
                              </FormItem>);
        }}/>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField control={form.control} name="board" render={function (_a) {
            var field = _a.field;
            return (<FormItem>
                                  <FormLabel>Board</FormLabel>
                                  <Input {...field} disabled/>
                                  <FormDescription>
                                    Using board from your profile settings
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>);
        }}/>

                            <FormField control={form.control} name="class" render={function (_a) {
            var field = _a.field;
            return (<FormItem>
                                  <FormLabel>Class</FormLabel>
                                  <Input {...field} disabled/>
                                  <FormDescription>
                                    Using class/grade from your profile settings
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>);
        }}/>

                            <FormField control={form.control} name="subject" render={function (_a) {
            var field = _a.field;
            return (<FormItem>
                                  <FormLabel>Subject</FormLabel>
                                  <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select a subject"/>
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      {(user === null || user === void 0 ? void 0 : user.subscriptionTier) === "free" ? (subscribedSubjects.length === 0 ? (<SelectItem value="no-subjects" disabled>
                                            No preferred subjects found. Update
                                            your profile.
                                          </SelectItem>) : (subscribedSubjects.map(function (subject) { return (<SelectItem key={subject.code} value={subject.name}>
                                              {subject.name}
                                            </SelectItem>); }))) : isLoadingSubjects ? (<SelectItem value="loading" disabled>
                                          Loading subjects...
                                        </SelectItem>) : subscribedSubjects.length === 0 ? (<SelectItem value="no-subjects" disabled>
                                          No subscribed subjects found.
                                        </SelectItem>) : (subscribedSubjects.map(function (subject) { return (<SelectItem key={subject.id} value={subject.name}>
                                            {subject.name}
                                          </SelectItem>); }))}
                                    </SelectContent>
                                  </Select>
                                  <FormDescription>
                                    Showing preferred subjects (free tier) or
                                    subscribed subjects (paid plans) available
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>);
        }}/>

                            <FormField control={form.control} name="chapter" render={function (_a) {
            var field = _a.field;
            return (<FormItem>
                                  <FormLabel>Chapter</FormLabel>
                                  <FormControl>
                                    <Input placeholder="e.g., Mechanics, Organic Chemistry" {...field}/>
                                  </FormControl>
                                  <FormDescription>
                                    Enter the chapter name
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>);
        }}/>
                          </div>

                          <div className="space-y-4 border rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
                            <h3 className="font-medium">Question Types</h3>
                            <div className="grid grid-cols-2 gap-2">
                              {[
            { id: "mcq", label: "Multiple Choice" },
            {
                id: "assertion-reasoning",
                label: "Assertion & Reasoning",
            },
            { id: "true-false", label: "True/False" },
        ].map(function (type) { return (<div key={type.id} className="flex items-center space-x-2">
                                  <Checkbox id={type.id} onCheckedChange={function (checked) {
                var current = form.getValues("questionTypes") || [];
                if (checked) {
                    form.setValue("questionTypes", __spreadArray(__spreadArray([], current, true), [
                        type.id,
                    ], false));
                }
                else {
                    form.setValue("questionTypes", current.filter(function (t) { return t !== type.id; }));
                }
            }}/>
                                  <label htmlFor={type.id} className="text-sm font-normal">
                                    {type.label}
                                  </label>
                                </div>); })}
                            </div>
                          </div>

                          <div className="space-y-4 border rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
                            <h3 className="font-medium">
                              Bloom's Taxonomy Levels
                            </h3>
                            <div className="grid grid-cols-2 gap-2">
                              {[
            { id: "knowledge", label: "Knowledge" },
            { id: "comprehension", label: "Comprehension" },
            { id: "application", label: "Application" },
            { id: "analysis", label: "Analysis" },
            { id: "synthesis", label: "Synthesis" },
            { id: "evaluation", label: "Evaluation" },
        ].map(function (level) { return (<div key={level.id} className="flex items-center space-x-2">
                                  <Checkbox id={level.id} onCheckedChange={function (checked) {
                var current = form.getValues("bloomTaxonomy") || [];
                if (checked) {
                    form.setValue("bloomTaxonomy", __spreadArray(__spreadArray([], current, true), [
                        level.id,
                    ], false));
                }
                else {
                    form.setValue("bloomTaxonomy", current.filter(function (t) { return t !== level.id; }));
                }
            }}/>
                                  <label htmlFor={level.id} className="text-sm font-normal">
                                    {level.label}
                                  </label>
                                </div>); })}
                            </div>
                          </div>

                          {/* Diagram Support Section */}
                         <div className="space-y-4 border rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
  <div>
    <h3 className="font-medium mb-2">📊 Diagram Support</h3>
    <p className="text-sm text-gray-600 dark:text-gray-400">
      🔒 Coming Soon: You will be able to force diagram-based question generation (Geometry, Economics, Physics, Biology, etc.).
    </p>
  </div>
    </div>


                          <div className="space-y-4 border rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
                            <h3 className="font-medium">Difficulty Levels</h3>
                            <div className="grid grid-cols-2 gap-2">
                              {[
            { id: "basic", label: "Basic" },
            { id: "standard", label: "Standard" },
            { id: "challenging", label: "Challenging" },
            {
                id: "most-challenging",
                label: "Most Challenging",
            },
        ].map(function (level) { return (<div key={level.id} className="flex items-center space-x-2">
                                  <Checkbox id={level.id} onCheckedChange={function (checked) {
                var current = form.getValues("difficultyLevels") ||
                    [];
                if (checked) {
                    form.setValue("difficultyLevels", __spreadArray(__spreadArray([], current, true), [
                        level.id,
                    ], false));
                }
                else {
                    form.setValue("difficultyLevels", current.filter(function (t) { return t !== level.id; }));
                }
            }}/>
                                  <label htmlFor={level.id} className="text-sm font-normal">
                                    {level.label}
                                  </label>
                                </div>); })}
                            </div>
                          </div>

                          <FormField control={form.control} name="numberOfQuestions" render={function (_a) {
            var field = _a.field;
            return (<FormItem>
                                <FormLabel>Number of Questions</FormLabel>
                                <FormControl>
                                  <Input type="number" min={5} max={50} placeholder="10" {...field} onChange={function (e) {
                    return field.onChange(parseInt(e.target.value));
                }}/>
                                </FormControl>
                                <FormDescription>
                                  Choose between 5 and 50 questions per quiz set
                                </FormDescription>
                                <FormMessage />
                              </FormItem>);
        }}/>

                          <Button type="submit" className="w-full" disabled={isSubmitting}>
                            {isSubmitting ? "Creating Quiz..." : "Create Quiz"}
                          </Button>
                        </form>
                      </Form>
                    </CardContent>
                  </Card>
                </div>

                <div>
                  <Card>
                    <CardHeader>
                      <CardTitle>How it works</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex space-x-2">
                          <Brain className="h-5 w-5 text-primary mt-0.5"/>
                          <div>
                            <h3 className="font-medium">
                              AI-Generated Questions
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Our AI creates 8 sets of questions in the background. 
                              Your quiz will be ready in 5-10 minutes and appear in "Today's Quizzes".
                            </p>
                          </div>
                        </div>

                        <div className="flex space-x-2">
                          <BookOpen className="h-5 w-5 text-primary mt-0.5"/>
                          <div>
                            <h3 className="font-medium">Spaced Repetition</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              You'll be prompted to review the material at
                              scientifically proven intervals (days 0, 1, 5, 15,
                              30, 60, 120, 180).
                            </p>
                          </div>
                        </div>

                        <div className="flex space-x-2">
                          <Sparkles className="h-5 w-5 text-primary mt-0.5"/>
                          <div>
                            <h3 className="font-medium">
                              Optimized for Retention
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              This method has been proven to increase knowledge
                              retention by up to 80% compared to traditional
                              studying.
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
      </div>
    </div>);
};
export default CreateQuiz;
