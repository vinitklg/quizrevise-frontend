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
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { MessageSquare, FileText, Lightbulb, Upload, CheckCircle, Star } from "lucide-react";
var feedbackCategories = [
    { value: "content", label: "Subject Content Issue", icon: FileText, color: "bg-orange-50 text-orange-700 border-orange-200" },
    { value: "quiz", label: "Quiz Error (wrong question/answer/diagram)", icon: MessageSquare, color: "bg-red-50 text-red-700 border-red-200" },
    { value: "doubt", label: "Doubt Answer Feedback", icon: Lightbulb, color: "bg-blue-50 text-blue-700 border-blue-200" },
    { value: "general", label: "General Experience", icon: MessageSquare, color: "bg-green-50 text-green-700 border-green-200" },
    { value: "technical", label: "Technical Bug / Error", icon: FileText, color: "bg-purple-50 text-purple-700 border-purple-200" },
    { value: "suggestion", label: "Feature Suggestion", icon: Lightbulb, color: "bg-indigo-50 text-indigo-700 border-indigo-200" }
];
export default function FeedbackPage() {
    var _this = this;
    var toast = useToast().toast;
    var queryClient = useQueryClient();
    var _a = useState("submit"), selectedTab = _a[0], setSelectedTab = _a[1];
    var _b = useState(""), selectedCategory = _b[0], setSelectedCategory = _b[1];
    var _c = useState({
        board: "",
        class: "",
        subject: "",
        feedbackText: "",
        rating: 0,
        file: null
    }), formData = _c[0], setFormData = _c[1];
    var _d = useQuery({
        queryKey: ["/api/feedback"],
        enabled: selectedTab === "my"
    }), _e = _d.data, feedbacks = _e === void 0 ? [] : _e, isLoading = _d.isLoading;
    var submitFeedback = useMutation({
        mutationFn: function (data) { return __awaiter(_this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fetch("/api/feedback", {
                            method: "POST",
                            body: data,
                        })];
                    case 1:
                        result = _a.sent();
                        if (!result.ok)
                            throw new Error("Failed to submit feedback");
                        return [2 /*return*/, result.json()];
                }
            });
        }); },
        onSuccess: function () {
            toast({
                title: "Feedback Submitted",
                description: "Thank you for your feedback. We'll review it soon.",
            });
            setFormData({ board: "", class: "", subject: "", feedbackText: "", rating: 0, file: null });
            setSelectedCategory("");
            queryClient.invalidateQueries({ queryKey: ["/api/feedback"] });
        },
        onError: function () {
            toast({
                title: "Error",
                description: "Failed to submit feedback. Please try again.",
                variant: "destructive",
            });
        },
    });
    var handleSubmit = function (e) {
        e.preventDefault();
        if (!selectedCategory || !formData.feedbackText.trim()) {
            toast({
                title: "Missing Information",
                description: "Please select a feedback type and provide details.",
                variant: "destructive",
            });
            return;
        }
        // Only require board, class, subject for content-specific feedback
        if (selectedCategory === "content" && (!formData.board || !formData.class || !formData.subject)) {
            toast({
                title: "Subject Information Required",
                description: "Please select board, class, and subject for content-related feedback.",
                variant: "destructive",
            });
            return;
        }
        var data = new FormData();
        data.append("type", selectedCategory);
        data.append("board", formData.board);
        data.append("class", formData.class);
        data.append("subject", formData.subject);
        data.append("feedbackText", formData.feedbackText);
        data.append("rating", formData.rating.toString());
        if (formData.file) {
            data.append("file", formData.file);
        }
        submitFeedback.mutate(data);
    };
    var handleFileChange = function (e) {
        var _a;
        var file = (_a = e.target.files) === null || _a === void 0 ? void 0 : _a[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                toast({
                    title: "File too large",
                    description: "Please select a file smaller than 5MB.",
                    variant: "destructive",
                });
                return;
            }
            setFormData(__assign(__assign({}, formData), { file: file }));
        }
    };
    return (<div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Feedback</h1>
        
        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200">
          <button onClick={function () { return setSelectedTab("submit"); }} className={"px-6 py-3 font-medium text-sm border-b-2 transition-colors ".concat(selectedTab === "submit"
            ? "border-blue-500 text-blue-600"
            : "border-transparent text-gray-500 hover:text-gray-700")}>
            Submit Feedback
          </button>
          <button onClick={function () { return setSelectedTab("my"); }} className={"px-6 py-3 font-medium text-sm border-b-2 transition-colors ".concat(selectedTab === "my"
            ? "border-blue-500 text-blue-600"
            : "border-transparent text-gray-500 hover:text-gray-700")}>
            My Feedback
          </button>
        </div>

        {selectedTab === "submit" ? (<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Feedback Categories */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Feedback Categories</CardTitle>
                <p className="text-sm text-gray-600">
                  Please select the type of feedback you'd like to provide
                </p>
              </CardHeader>
              <CardContent className="space-y-3">
                {feedbackCategories.map(function (category) {
                var IconComponent = category.icon;
                return (<div key={category.value} onClick={function () { return setSelectedCategory(category.value); }} className={"p-4 rounded-lg border-2 cursor-pointer transition-all ".concat(selectedCategory === category.value
                        ? category.color
                        : "bg-white border-gray-200 hover:border-gray-300")}>
                      <div className="flex items-center space-x-3">
                        <IconComponent className="h-5 w-5"/>
                        <div>
                          <h3 className="font-medium">{category.label}</h3>
                          <p className="text-sm text-gray-600">
                            {category.value === "content" && "Report errors in subject content, curriculum alignment issues"}
                            {category.value === "quiz" && "Report incorrect questions, answers, or diagram issues in quizzes"}
                            {category.value === "doubt" && "Provide feedback on doubt resolution quality and accuracy"}
                            {category.value === "general" && "Share your overall experience using the platform"}
                            {category.value === "technical" && "Report bugs, errors, or technical issues"}
                            {category.value === "suggestion" && "Suggest new features or improvements"}
                          </p>
                        </div>
                      </div>
                    </div>);
            })}
              </CardContent>
            </Card>

            {/* Feedback Form */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Share Your Feedback</CardTitle>
                <p className="text-sm text-gray-600">
                  Your feedback helps us improve the platform for everyone
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Board, Class, Subject Row */}
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Board {selectedCategory !== "content" && <span className="text-gray-400 font-normal">(Optional)</span>}
                      </label>
                      <Select value={formData.board} onValueChange={function (value) { return setFormData(__assign(__assign({}, formData), { board: value })); }}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Board"/>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="CBSE">CBSE</SelectItem>
                          <SelectItem value="ICSE">ICSE</SelectItem>
                          <SelectItem value="ISC">ISC</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Class {selectedCategory !== "content" && <span className="text-gray-400 font-normal">(Optional)</span>}
                      </label>
                      <Select value={formData.class} onValueChange={function (value) { return setFormData(__assign(__assign({}, formData), { class: value })); }}>
                        <SelectTrigger>
                          <SelectValue placeholder="Class 10"/>
                        </SelectTrigger>
                        <SelectContent>
                          {[6, 7, 8, 9, 10, 11, 12].map(function (grade) { return (<SelectItem key={grade} value={grade.toString()}>
                              Class {grade}
                            </SelectItem>); })}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Subject {selectedCategory !== "content" && <span className="text-gray-400 font-normal">(Optional)</span>}
                      </label>
                      <Input placeholder="e.g. Mathematics, Physics" value={formData.subject} onChange={function (e) { return setFormData(__assign(__assign({}, formData), { subject: e.target.value })); }}/>
                    </div>
                  </div>

                  {/* Feedback Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Feedback Type
                    </label>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="General Feedback"/>
                      </SelectTrigger>
                      <SelectContent>
                        {feedbackCategories.map(function (category) { return (<SelectItem key={category.value} value={category.value}>
                            {category.label}
                          </SelectItem>); })}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Feedback Text */}
                  <div>
                    <Textarea placeholder="Share your thoughts, suggestions, or report any issues you've encountered..." value={formData.feedbackText} onChange={function (e) { return setFormData(__assign(__assign({}, formData), { feedbackText: e.target.value })); }} rows={6} className="resize-none"/>
                  </div>

                  {/* Rating */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rate your experience (optional)
                    </label>
                    <div className="flex items-center space-x-1">
                      {[1, 2, 3, 4, 5].map(function (star) { return (<button key={star} type="button" onClick={function () { return setFormData(__assign(__assign({}, formData), { rating: star })); }} className={"p-1 transition-colors ".concat(star <= formData.rating
                    ? "text-yellow-400 hover:text-yellow-500"
                    : "text-gray-300 hover:text-gray-400")}>
                          <Star className={"h-6 w-6 ".concat(star <= formData.rating ? "fill-current" : "")}/>
                        </button>); })}
                      {formData.rating > 0 && (<button type="button" onClick={function () { return setFormData(__assign(__assign({}, formData), { rating: 0 })); }} className="ml-2 text-sm text-gray-500 hover:text-gray-700">
                          Clear
                        </button>)}
                    </div>
                  </div>

                  {/* File Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Attach File (Optional)
                    </label>
                    <div className="flex items-center space-x-3">
                      <Input type="file" onChange={handleFileChange} accept=".jpg,.jpeg,.png,.pdf,.doc,.docx" className="file:mr-3 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"/>
                      <Upload className="h-4 w-4 text-gray-400"/>
                    </div>
                    {formData.file && (<p className="text-sm text-gray-600 mt-1">
                        Selected: {formData.file.name}
                      </p>)}
                  </div>

                  <Button type="submit" disabled={submitFeedback.isPending} className="w-full bg-blue-600 hover:bg-blue-700">
                    {submitFeedback.isPending ? "Submitting..." : "Submit Feedback"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>) : (
        /* My Feedback Tab */
        <Card>
            <CardHeader>
              <CardTitle>My Feedback History</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (<div className="text-center py-8">Loading your feedback...</div>) : !feedbacks || feedbacks.length === 0 ? (<div className="text-center py-8 text-gray-500">
                  No feedback submitted yet. Share your thoughts using the Submit Feedback tab.
                </div>) : (<div className="space-y-4">
                  {feedbacks.map(function (feedback) {
                    var _a;
                    return (<div key={feedback.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className={"inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ".concat(feedback.type === "content" ? "bg-orange-100 text-orange-800" :
                            feedback.type === "quiz" ? "bg-red-100 text-red-800" :
                                feedback.type === "doubt" ? "bg-blue-100 text-blue-800" :
                                    feedback.type === "general" ? "bg-green-100 text-green-800" :
                                        feedback.type === "technical" ? "bg-purple-100 text-purple-800" :
                                            feedback.type === "suggestion" ? "bg-indigo-100 text-indigo-800" :
                                                "bg-gray-100 text-gray-800")}>
                            {(_a = feedbackCategories.find(function (c) { return c.value === feedback.type; })) === null || _a === void 0 ? void 0 : _a.label}
                          </span>
                          <span className={"inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ".concat(feedback.status === "pending" ? "bg-yellow-100 text-yellow-800" :
                            feedback.status === "reviewed" ? "bg-blue-100 text-blue-800" :
                                "bg-green-100 text-green-800")}>
                            {feedback.status === "pending" && "Pending Review"}
                            {feedback.status === "reviewed" && "Under Review"}
                            {feedback.status === "resolved" && "Resolved"}
                          </span>
                        </div>
                        <span className="text-sm text-gray-500">
                          {feedback.createdAt ? new Date(feedback.createdAt).toLocaleDateString() : ""}
                        </span>
                      </div>
                      
                      {(feedback.board || feedback.class || feedback.subject) && (<div className="text-sm text-gray-600">
                          {feedback.board && "".concat(feedback.board, " ")}
                          {feedback.class && "Class ".concat(feedback.class, " ")}
                          {feedback.subject && "\u2022 ".concat(feedback.subject)}
                        </div>)}
                      
                      <p className="text-gray-700">{feedback.feedbackText}</p>
                      
                      {feedback.adminResponse && (<div className="bg-blue-50 border-l-4 border-blue-400 p-3 rounded">
                          <div className="flex items-center space-x-2 mb-1">
                            <CheckCircle className="h-4 w-4 text-blue-600"/>
                            <span className="text-sm font-medium text-blue-800">Admin Response</span>
                          </div>
                          <p className="text-blue-700 text-sm">{feedback.adminResponse}</p>
                        </div>)}
                    </div>);
                })}
                </div>)}
            </CardContent>
          </Card>)}
      </div>
    </div>);
}
