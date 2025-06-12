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
import { useQuery } from "@tanstack/react-query";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, AlertTriangle, Lightbulb, Search, Download, Eye } from "lucide-react";
import AdminSidebar from "@/components/admin/AdminSidebar";
export default function AdminFeedbacks() {
    var _this = this;
    var _a = useState(""), searchTerm = _a[0], setSearchTerm = _a[1];
    var _b = useState("all"), typeFilter = _b[0], setTypeFilter = _b[1];
    var _c = useState("all"), statusFilter = _c[0], setStatusFilter = _c[1];
    var _d = useState(null), selectedFeedback = _d[0], setSelectedFeedback = _d[1];
    var _e = useState(""), adminResponse = _e[0], setAdminResponse = _e[1];
    // Fetch all feedback for admin
    var _f = useQuery({
        queryKey: ["/api/admin/feedback"],
    }), _g = _f.data, feedbacks = _g === void 0 ? [] : _g, isLoading = _f.isLoading;
    // Calculate stats
    var stats = {
        total: feedbacks.length,
        subjectContent: feedbacks.filter(function (f) { return f.type === "subject_content"; }).length,
        quizError: feedbacks.filter(function (f) { return f.type === "quiz_error"; }).length,
        doubtAnswer: feedbacks.filter(function (f) { return f.type === "doubt_answer"; }).length,
        generalExperience: feedbacks.filter(function (f) { return f.type === "general_experience"; }).length,
        technicalBug: feedbacks.filter(function (f) { return f.type === "technical_bug"; }).length,
        featureSuggestion: feedbacks.filter(function (f) { return f.type === "feature_suggestion"; }).length,
        resolved: feedbacks.filter(function (f) { return f.status === "resolved"; }).length,
    };
    // Filter feedbacks
    var filteredFeedbacks = feedbacks.filter(function (feedback) {
        var _a, _b, _c;
        var matchesSearch = !searchTerm ||
            ((_a = feedback.userName) === null || _a === void 0 ? void 0 : _a.toLowerCase().includes(searchTerm.toLowerCase())) ||
            ((_b = feedback.userEmail) === null || _b === void 0 ? void 0 : _b.toLowerCase().includes(searchTerm.toLowerCase())) ||
            ((_c = feedback.feedbackText) === null || _c === void 0 ? void 0 : _c.toLowerCase().includes(searchTerm.toLowerCase()));
        var matchesType = typeFilter === "all" || feedback.type === typeFilter;
        var matchesStatus = statusFilter === "all" || feedback.status === statusFilter;
        return matchesSearch && matchesType && matchesStatus;
    });
    var getStatusBadge = function (status) {
        switch (status) {
            case "pending":
                return <Badge variant="secondary">Pending</Badge>;
            case "reviewed":
                return <Badge variant="outline">Reviewed</Badge>;
            case "resolved":
                return <Badge variant="default">Resolved</Badge>;
            default:
                return <Badge variant="secondary">{status}</Badge>;
        }
    };
    var getTypeBadge = function (type) {
        switch (type) {
            case "subject_content":
                return <Badge className="bg-blue-100 text-blue-800">Subject Content</Badge>;
            case "quiz_error":
                return <Badge className="bg-red-100 text-red-800">Quiz Error</Badge>;
            case "doubt_answer":
                return <Badge className="bg-purple-100 text-purple-800">Doubt Answer</Badge>;
            case "general_experience":
                return <Badge className="bg-green-100 text-green-800">General Experience</Badge>;
            case "technical_bug":
                return <Badge className="bg-red-100 text-red-800">Technical Bug</Badge>;
            case "feature_suggestion":
                return <Badge className="bg-yellow-100 text-yellow-800">Feature Suggestion</Badge>;
            default:
                return <Badge variant="outline">{type}</Badge>;
        }
    };
    var exportToCSV = function () {
        var headers = ["ID", "Date", "User Name", "Email", "Board", "Class", "Subject", "Type", "Status", "Message"];
        var csvContent = __spreadArray([
            headers.join(",")
        ], filteredFeedbacks.map(function (feedback) {
            var _a;
            return [
                feedback.id,
                feedback.createdAt ? formatDate(feedback.createdAt.toString()) : "",
                feedback.userName || "",
                feedback.userEmail || "",
                feedback.board || "",
                feedback.class || "",
                feedback.subject || "",
                feedback.type,
                feedback.status,
                "\"".concat(((_a = feedback.feedbackText) === null || _a === void 0 ? void 0 : _a.replace(/"/g, '""')) || "", "\""),
            ].join(",");
        }), true).join("\n");
        var blob = new Blob([csvContent], { type: "text/csv" });
        var url = window.URL.createObjectURL(blob);
        var a = document.createElement("a");
        a.href = url;
        a.download = "feedback-export-".concat(new Date().toISOString().split('T')[0], ".csv");
        a.click();
        window.URL.revokeObjectURL(url);
    };
    var updateFeedbackStatus = function (feedbackId, newStatus, response) { return __awaiter(_this, void 0, void 0, function () {
        var updateData, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    updateData = { status: newStatus };
                    if (response) {
                        updateData.adminResponse = response;
                    }
                    return [4 /*yield*/, fetch("/api/admin/feedback/".concat(feedbackId), {
                            method: "PATCH",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify(updateData),
                        })];
                case 1:
                    _a.sent();
                    // Refresh the data
                    window.location.reload();
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    console.error("Failed to update feedback:", error_1);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    if (isLoading) {
        return (<div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"/>
      </div>);
    }
    return (<div className="flex h-screen">
      <AdminSidebar />
      <div className="flex-1 overflow-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Feedback Management</h1>
          <Button onClick={exportToCSV} className="flex items-center space-x-2">
            <Download className="h-4 w-4"/>
            <span>Export CSV</span>
          </Button>
        </div>

        {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Feedback</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground"/>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Subject Content</CardTitle>
            <MessageSquare className="h-4 w-4 text-blue-500"/>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.subjectContent}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quiz Errors</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500"/>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.quizError}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Doubt Answers</CardTitle>
            <MessageSquare className="h-4 w-4 text-purple-500"/>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats.doubtAnswer}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">General Experience</CardTitle>
            <MessageSquare className="h-4 w-4 text-green-500"/>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.generalExperience}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Technical Bugs</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500"/>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.technicalBug}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Feature Suggestions</CardTitle>
            <Lightbulb className="h-4 w-4 text-yellow-500"/>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.featureSuggestion}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground"/>
                <Input placeholder="Search by user name, email, or message..." value={searchTerm} onChange={function (e) { return setSearchTerm(e.target.value); }} className="pl-8"/>
              </div>
            </div>
            
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by type"/>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="subject_content">Subject Content</SelectItem>
                <SelectItem value="quiz_error">Quiz Error</SelectItem>
                <SelectItem value="doubt_answer">Doubt Answer</SelectItem>
                <SelectItem value="general_experience">General Experience</SelectItem>
                <SelectItem value="technical_bug">Technical Bug</SelectItem>
                <SelectItem value="feature_suggestion">Feature Suggestion</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by status"/>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="reviewed">Reviewed</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Feedback Table */}
      <Card>
        <CardHeader>
          <CardTitle>Feedback List ({filteredFeedbacks.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Board</TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>File</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFeedbacks.map(function (feedback) { return (<TableRow key={feedback.id}>
                    <TableCell className="font-medium">#{feedback.id}</TableCell>
                    <TableCell>
                      {feedback.createdAt ? formatDate(feedback.createdAt.toString()) : "N/A"}
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{feedback.userName || "Anonymous"}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{feedback.userEmail || "N/A"}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{feedback.userPhone || "N/A"}</div>
                    </TableCell>
                    <TableCell>{feedback.board || "N/A"}</TableCell>
                    <TableCell>{feedback.class || "N/A"}</TableCell>
                    <TableCell>{feedback.subject || "N/A"}</TableCell>
                    <TableCell>{getTypeBadge(feedback.type)}</TableCell>
                    <TableCell>
                      {feedback.file ? (<Button variant="outline" size="sm" asChild>
                          <a href={feedback.file} target="_blank" rel="noopener noreferrer">
                            View File
                          </a>
                        </Button>) : ("No File")}
                    </TableCell>
                    <TableCell>{getStatusBadge(feedback.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" onClick={function () { return setSelectedFeedback(feedback); }}>
                              <Eye className="h-4 w-4"/>
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Feedback Details #{feedback.id}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <strong>User:</strong> {feedback.userName || "Anonymous"}
                                </div>
                                <div>
                                  <strong>Email:</strong> {feedback.userEmail}
                                </div>
                                <div>
                                  <strong>Board:</strong> {feedback.board || "N/A"}
                                </div>
                                <div>
                                  <strong>Class:</strong> {feedback.class || "N/A"}
                                </div>
                                <div>
                                  <strong>Subject:</strong> {feedback.subject || "N/A"}
                                </div>
                                <div>
                                  <strong>Type:</strong> {getTypeBadge(feedback.type)}
                                </div>
                              </div>
                              
                              <div>
                                <strong>Message:</strong>
                                <p className="mt-2 p-3 bg-gray-50 rounded-lg">
                                  {feedback.feedbackText || "No message provided"}
                                </p>
                              </div>
                              
                              {feedback.file && (<div>
                                  <strong>Attachment:</strong>
                                  <a href={feedback.file} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline ml-2">
                                    View File
                                  </a>
                                </div>)}
                              
                              <div className="space-y-2">
                                <label className="text-sm font-medium">Update Status:</label>
                                <Select value={feedback.status} onValueChange={function (newStatus) { return updateFeedbackStatus(feedback.id, newStatus); }}>
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="reviewed">Reviewed</SelectItem>
                                    <SelectItem value="resolved">Resolved</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              
                              <div className="space-y-2">
                                <label className="text-sm font-medium">Admin Response:</label>
                                <Textarea placeholder="Add your response..." value={adminResponse} onChange={function (e) { return setAdminResponse(e.target.value); }}/>
                                <Button onClick={function () { return updateFeedbackStatus(feedback.id, "reviewed", adminResponse); }} className="w-full">
                                  Save Response
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </TableCell>
                  </TableRow>); })}
              </TableBody>
            </Table>
          </div>
          
          {filteredFeedbacks.length === 0 && (<div className="text-center py-8 text-muted-foreground">
              No feedback found matching your filters.
            </div>)}
        </CardContent>
      </Card>
      </div>
    </div>);
}
