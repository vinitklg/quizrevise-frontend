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
import { useState } from "react";
import { Link, useLocation } from "wouter";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useQueryClient } from "@tanstack/react-query";
import SubjectSelection from "@/components/SubjectSelection";
var signupSchema = z.object({
    username: z.string().min(3, "Username must be at least 3 characters"),
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    phoneNumber: z.string()
        .min(10, "Phone number must be at least 10 digits")
        .max(15, "Phone number must not exceed 15 digits")
        .optional(),
    subscribedSubjects: z.array(z.string()).default([]),
    grade: z.coerce.number().min(6).max(12).optional(),
    board: z.enum(["CBSE", "ICSE", "ISC"]).optional(),
    stream: z.string().optional(),
});
var Signup = function () {
    var _a = useState(false), isLoading = _a[0], setIsLoading = _a[1];
    var _b = useLocation(), navigate = _b[1];
    var toast = useToast().toast;
    var queryClient = useQueryClient();
    var _c = useState([]), selectedSubjects = _c[0], setSelectedSubjects = _c[1];
    var _d = useState(""), selectedStream = _d[0], setSelectedStream = _d[1];
    var form = useForm({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            username: "",
            email: "",
            password: "",
            firstName: "",
            lastName: "",
            phoneNumber: "",
            subscribedSubjects: [],
            grade: undefined,
            board: undefined,
            stream: "",
        },
    });
    var watchedGrade = form.watch("grade");
    var watchedBoard = form.watch("board");
    var onSubmit = function (data) { return __awaiter(void 0, void 0, void 0, function () {
        var signupData, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setIsLoading(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    signupData = __assign(__assign({}, data), { subscribedSubjects: selectedSubjects, stream: selectedStream || data.stream });
                    return [4 /*yield*/, apiRequest("POST", "/api/auth/signup", signupData)];
                case 2:
                    _a.sent();
                    // Invalidate user query to refetch after signup
                    queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
                    toast({
                        title: "Account created",
                        description: "Welcome to QuizRevise! Your account has been created successfully.",
                    });
                    navigate("/dashboard");
                    return [3 /*break*/, 5];
                case 3:
                    error_1 = _a.sent();
                    toast({
                        title: "Signup failed",
                        description: error_1 instanceof Error ? error_1.message : "Please check your information and try again.",
                        variant: "destructive",
                    });
                    return [3 /*break*/, 5];
                case 4:
                    setIsLoading(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    return (<div className="flex min-h-[80vh] flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary h-12 w-12">
            <path d="M6 4v6a6 6 0 0 0 12 0V4"></path>
            <line x1="4" y1="20" x2="20" y2="20"></line>
          </svg>
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-primary hover:text-primary-600">
            Sign in
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="firstName" render={function (_a) {
            var field = _a.field;
            return (<FormItem>
                      <FormLabel>First name</FormLabel>
                      <FormControl>
                        <Input placeholder="John" {...field}/>
                      </FormControl>
                      <FormMessage />
                    </FormItem>);
        }}/>

                <FormField control={form.control} name="lastName" render={function (_a) {
            var field = _a.field;
            return (<FormItem>
                      <FormLabel>Last name</FormLabel>
                      <FormControl>
                        <Input placeholder="Doe" {...field}/>
                      </FormControl>
                      <FormMessage />
                    </FormItem>);
        }}/>
              </div>

              <FormField control={form.control} name="username" render={function (_a) {
            var field = _a.field;
            return (<FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="johndoe" {...field}/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>);
        }}/>

              <FormField control={form.control} name="phoneNumber" render={function (_a) {
            var field = _a.field;
            return (<FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Your mobile number" {...field}/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>);
        }}/>

              <FormField control={form.control} name="email" render={function (_a) {
            var field = _a.field;
            return (<FormItem>
                    <FormLabel>Email address</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="you@example.com" {...field}/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>);
        }}/>

              <FormField control={form.control} name="password" render={function (_a) {
            var field = _a.field;
            return (<FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field}/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>);
        }}/>

              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="grade" render={function (_a) {
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

                <FormField control={form.control} name="board" render={function (_a) {
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
              </div>
              
              {/* Structured Subject Selection */}
              {watchedBoard && watchedGrade && (<div className="space-y-4">
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Select Your Subjects
                  </label>
                  <SubjectSelection board={watchedBoard} grade={watchedGrade} stream={selectedStream} selectedSubjects={selectedSubjects} onSubjectsChange={setSelectedSubjects} onStreamChange={setSelectedStream}/>
                </div>)}

              <div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Creating account..." : "Create account"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>);
};
export default Signup;
