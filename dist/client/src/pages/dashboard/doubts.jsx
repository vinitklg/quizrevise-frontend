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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { formatDate } from "@/lib/utils";
import { Form, FormControl, FormField, FormItem, FormMessage, } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Loader2, Send, Upload, X } from "lucide-react";
// Form schema for asking a doubt
var doubtSchema = z.object({
    board: z.string().min(2, "Board must be at least 2 characters"),
    class: z.string().min(1, "Class must not be empty"),
    subject: z.string().min(2, "Subject must be at least 2 characters"),
    question: z.string().min(10, "Question must be at least 10 characters"),
    fileUrl: z.string().optional(),
    fileType: z.string().optional(),
});
var AskDoubts = function () {
    var _a;
    var user = useAuth().user;
    var toast = useToast().toast;
    var _b = useState(false), isSubmitting = _b[0], setIsSubmitting = _b[1];
    var _c = useState(null), uploadedFile = _c[0], setUploadedFile = _c[1];
    var _d = useState(false), showDetails = _d[0], setShowDetails = _d[1];
    var _e = useState(false), isTyping = _e[0], setIsTyping = _e[1];
    // Fetch user's doubt queries
    var _f = useQuery({
        queryKey: ["/api/doubt-queries"],
    }), _g = _f.data, doubtQueries = _g === void 0 ? [] : _g, isLoadingDoubts = _f.isLoading;
    // Initialize form
    var form = useForm({
        resolver: zodResolver(doubtSchema),
        defaultValues: {
            board: (user === null || user === void 0 ? void 0 : user.board) || "CBSE",
            class: ((_a = user === null || user === void 0 ? void 0 : user.grade) === null || _a === void 0 ? void 0 : _a.toString()) || "10",
            subject: "Mathematics",
            question: "",
        },
    });
    var handleFileUpload = function (event) {
        var _a;
        var file = (_a = event.target.files) === null || _a === void 0 ? void 0 : _a[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                toast({
                    title: "File too large",
                    description: "Please select a file smaller than 5MB.",
                    variant: "destructive",
                });
                return;
            }
            if (!['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword'].includes(file.type)) {
                toast({
                    title: "Invalid file type",
                    description: "Please upload a PDF or Word document.",
                    variant: "destructive",
                });
                return;
            }
            setUploadedFile(file);
        }
    };
    var onSubmit = function (data) { return __awaiter(void 0, void 0, void 0, function () {
        var fileUrl, fileType, formData, uploadResponse, uploadResult, response, fileInput, errorData, error_1;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    setIsSubmitting(true);
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 9, 10, 11]);
                    fileUrl = "";
                    fileType = "";
                    if (!uploadedFile) return [3 /*break*/, 4];
                    formData = new FormData();
                    formData.append('file', uploadedFile);
                    return [4 /*yield*/, fetch('/api/upload', {
                            method: 'POST',
                            body: formData,
                        })];
                case 2:
                    uploadResponse = _b.sent();
                    if (!uploadResponse.ok) return [3 /*break*/, 4];
                    return [4 /*yield*/, uploadResponse.json()];
                case 3:
                    uploadResult = _b.sent();
                    fileUrl = uploadResult.url;
                    fileType = uploadedFile.type.includes('pdf') ? 'pdf' : 'word';
                    _b.label = 4;
                case 4: return [4 /*yield*/, apiRequest("POST", "/api/doubt-queries", __assign(__assign({}, data), { fileUrl: fileUrl, fileType: fileType }))];
                case 5:
                    response = _b.sent();
                    if (!response.ok) return [3 /*break*/, 6];
                    toast({
                        title: "Question submitted",
                        description: "Your doubt has been submitted and will be answered shortly.",
                    });
                    form.reset({
                        board: (user === null || user === void 0 ? void 0 : user.board) || "CBSE",
                        class: ((_a = user === null || user === void 0 ? void 0 : user.grade) === null || _a === void 0 ? void 0 : _a.toString()) || "10",
                        subject: "Mathematics",
                        question: "",
                    });
                    setUploadedFile(null);
                    setIsTyping(false);
                    fileInput = document.getElementById('file-upload');
                    if (fileInput) {
                        fileInput.value = '';
                    }
                    queryClient.invalidateQueries({ queryKey: ["/api/doubt-queries"] });
                    return [3 /*break*/, 8];
                case 6: return [4 /*yield*/, response.json()];
                case 7:
                    errorData = _b.sent();
                    toast({
                        title: "Submission failed",
                        description: errorData.message || "Failed to submit your question. Please try again.",
                        variant: "destructive",
                    });
                    _b.label = 8;
                case 8: return [3 /*break*/, 11];
                case 9:
                    error_1 = _b.sent();
                    toast({
                        title: "Submission failed",
                        description: error_1 instanceof Error ? error_1.message : "An unexpected error occurred.",
                        variant: "destructive",
                    });
                    return [3 /*break*/, 11];
                case 10:
                    setIsSubmitting(false);
                    return [7 /*endfinally*/];
                case 11: return [2 /*return*/];
            }
        });
    }); };
    return (<div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="flex-shrink-0 px-4 py-6 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-semibold text-gray-900 dark:text-white mb-2">
            How can I help you today?
          </h1>
          {(user === null || user === void 0 ? void 0 : user.subscriptionTier) === "free" && (<p className="text-sm text-amber-600 dark:text-amber-400">
              Free plan: 2 questions per day
            </p>)}
        </div>
      </div>

      {/* Chat Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {isLoadingDoubts ? (<div className="flex justify-center items-center h-64">
              <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"/>
            </div>) : doubtQueries && doubtQueries.length > 0 ? (
        // Display previous conversations
        doubtQueries.map(function (doubt) { return (<div key={doubt.id} className="space-y-4">
                {/* User Question */}
                <div className="flex justify-end">
                  <div className="max-w-3xl">
                    <Card className="bg-blue-600 text-white">
                      <CardContent className="p-4">
                        <div className="space-y-2">
                          <div className="text-xs opacity-80">
                            {doubt.board} • Class {doubt.class} • {doubt.subjectName}
                          </div>
                          <p className="text-sm">{doubt.question}</p>
                          {doubt.fileUrl && (<div className="flex items-center text-xs bg-blue-700 rounded p-2 mt-2">
                              <FileText className="h-3 w-3 mr-2"/>
                              <span>Attached {doubt.fileType === "pdf" ? "PDF" : "Word"} document</span>
                            </div>)}
                          <div className="text-xs opacity-80 text-right">
                            {doubt.createdAt ? formatDate(doubt.createdAt.toString()) : 'Just now'}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* AI Response */}
                <div className="flex justify-start">
                  <div className="max-w-3xl">
                    <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                      <CardContent className="p-4">
                        {doubt.status === "answered" && doubt.answer ? (<div className="space-y-2">
                            <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                              AI Tutor
                            </div>
                            <div className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line leading-relaxed">
                              {doubt.answer}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 text-right">
                              {doubt.answeredAt ? formatDate(doubt.answeredAt.toString()) : 'Just answered'}
                            </div>
                          </div>) : (<div className="flex items-center text-amber-600 dark:text-amber-400">
                            <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                            <span className="text-sm">Thinking...</span>
                          </div>)}
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>); })) : (
        // Welcome message when no previous conversations
        <div className="text-center py-12">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-blue-600 dark:text-blue-400"/>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Ask your first question
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                I'm here to help you with your studies. Ask me anything!
              </p>
            </div>)}
        </div>
      </div>

      {/* Input Area */}
      <div className="flex-shrink-0 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
        <div className="max-w-4xl mx-auto">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Context Details (collapsible) */}
              {showDetails && (<div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <FormField control={form.control} name="board" render={function (_a) {
                var field = _a.field;
                return (<FormItem>
                        <FormControl>
                          <Input placeholder="Board (e.g., CBSE)" {...field} className="text-sm"/>
                        </FormControl>
                        <FormMessage />
                      </FormItem>);
            }}/>
                  <FormField control={form.control} name="class" render={function (_a) {
                var field = _a.field;
                return (<FormItem>
                        <FormControl>
                          <Input placeholder="Class (e.g., 10)" {...field} className="text-sm"/>
                        </FormControl>
                        <FormMessage />
                      </FormItem>);
            }}/>
                  <FormField control={form.control} name="subject" render={function (_a) {
                var field = _a.field;
                return (<FormItem>
                        <FormControl>
                          <Input placeholder="Subject" {...field} className="text-sm"/>
                        </FormControl>
                        <FormMessage />
                      </FormItem>);
            }}/>
                </div>)}

              {/* File Upload Area */}
              {uploadedFile && (<div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center text-sm">
                    <FileText className="h-4 w-4 mr-2 text-blue-600"/>
                    <span>{uploadedFile.name}</span>
                  </div>
                  <Button type="button" variant="ghost" size="sm" onClick={function () {
                setUploadedFile(null);
                var fileInput = document.getElementById('file-upload');
                if (fileInput)
                    fileInput.value = '';
            }}>
                    <X className="h-4 w-4"/>
                  </Button>
                </div>)}

              {/* Main Input */}
              <div className="flex items-end space-x-2">
                <div className="flex-1">
                  <FormField control={form.control} name="question" render={function (_a) {
            var field = _a.field;
            return (<FormItem>
                        <FormControl>
                          <Textarea placeholder="Ask anything..." {...field} rows={isTyping ? 6 : 1} onFocus={function () { return setIsTyping(true); }} onBlur={function (e) {
                    if (!e.target.value.trim()) {
                        setIsTyping(false);
                    }
                }} className="resize-none border-2 focus:border-blue-500 transition-all duration-200 min-h-[48px]" style={{
                    height: isTyping ? 'auto' : '48px',
                    minHeight: '48px'
                }}/>
                        </FormControl>
                        <FormMessage />
                      </FormItem>);
        }}/>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  <Button type="button" variant="outline" size="sm" onClick={function () { return setShowDetails(!showDetails); }} className="px-3">
                    {showDetails ? 'Hide' : 'Details'}
                  </Button>
                  
                  <Button type="button" variant="outline" size="sm" className="px-3" onClick={function () { var _a; return (_a = document.getElementById('file-upload')) === null || _a === void 0 ? void 0 : _a.click(); }}>
                    <Upload className="h-4 w-4"/>
                  </Button>
                  <input id="file-upload" type="file" className="hidden" accept=".pdf,.doc,.docx" onChange={handleFileUpload}/>

                  <Button type="submit" disabled={isSubmitting} size="sm" className="px-4">
                    {isSubmitting ? (<Loader2 className="h-4 w-4 animate-spin"/>) : (<Send className="h-4 w-4"/>)}
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>);
};
export default AskDoubts;
