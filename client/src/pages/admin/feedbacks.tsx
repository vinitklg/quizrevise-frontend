import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { 
  MessageSquare, 
  AlertTriangle, 
  Lightbulb, 
  CheckCircle,
  Search,
  Download,
  Eye,
  Edit
} from "lucide-react";
import AdminSidebar from "@/components/admin/AdminSidebar";

interface Feedback {
  id: number;
  userId: number;
  userName?: string;
  userEmail?: string;
  board?: string;
  class?: number;
  subject?: string;
  type: string;
  feedbackText?: string;
  file?: string;
  status: string;
  adminResponse?: string;
  createdAt?: Date;
  reviewedAt?: Date;
  reviewedBy?: number;
}

interface FeedbackStats {
  total: number;
  subjectContent: number;
  quizError: number;
  doubtAnswer: number;
  generalExperience: number;
  technicalBug: number;
  featureSuggestion: number;
  resolved: number;
}

export default function AdminFeedbacks() {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
  const [adminResponse, setAdminResponse] = useState("");

  // Fetch all feedback for admin
  const { data: feedbacks = [], isLoading } = useQuery<Feedback[]>({
    queryKey: ["/api/admin/feedback"],
  });

  // Calculate stats
  const stats: FeedbackStats = {
    total: feedbacks.length,
    subjectContent: feedbacks.filter(f => f.type === "subject_content").length,
    quizError: feedbacks.filter(f => f.type === "quiz_error").length,
    doubtAnswer: feedbacks.filter(f => f.type === "doubt_answer").length,
    generalExperience: feedbacks.filter(f => f.type === "general_experience").length,
    technicalBug: feedbacks.filter(f => f.type === "technical_bug").length,
    featureSuggestion: feedbacks.filter(f => f.type === "feature_suggestion").length,
    resolved: feedbacks.filter(f => f.status === "resolved").length,
  };

  // Filter feedbacks
  const filteredFeedbacks = feedbacks.filter(feedback => {
    const matchesSearch = !searchTerm || 
      feedback.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feedback.userEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feedback.feedbackText?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = typeFilter === "all" || feedback.type === typeFilter;
    const matchesStatus = statusFilter === "all" || feedback.status === statusFilter;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
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

  const getTypeBadge = (type: string) => {
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

  const exportToCSV = () => {
    const headers = ["ID", "Date", "User Name", "Email", "Board", "Class", "Subject", "Type", "Status", "Message"];
    const csvContent = [
      headers.join(","),
      ...filteredFeedbacks.map(feedback => [
        feedback.id,
        feedback.createdAt ? formatDate(feedback.createdAt.toString()) : "",
        feedback.userName || "",
        feedback.userEmail || "",
        feedback.board || "",
        feedback.class || "",
        feedback.subject || "",
        feedback.type,
        feedback.status,
        `"${feedback.feedbackText?.replace(/"/g, '""') || ""}"`,
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `feedback-export-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const updateFeedbackStatus = async (feedbackId: number, newStatus: string, response?: string) => {
    try {
      const updateData: any = { status: newStatus };
      if (response) {
        updateData.adminResponse = response;
      }
      
      await fetch(`/api/admin/feedback/${feedbackId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });
      
      // Refresh the data
      window.location.reload();
    } catch (error) {
      console.error("Failed to update feedback:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      <AdminSidebar />
      <div className="flex-1 overflow-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Feedback Management</h1>
          <Button onClick={exportToCSV} className="flex items-center space-x-2">
            <Download className="h-4 w-4" />
            <span>Export CSV</span>
          </Button>
        </div>

        {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Feedback</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Subject Content</CardTitle>
            <MessageSquare className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.subjectContent}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quiz Errors</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.quizError}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Doubt Answers</CardTitle>
            <MessageSquare className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats.doubtAnswer}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">General Experience</CardTitle>
            <MessageSquare className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.generalExperience}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Technical Bugs</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.technicalBug}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Feature Suggestions</CardTitle>
            <Lightbulb className="h-4 w-4 text-yellow-500" />
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
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by user name, email, or message..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by type" />
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
                <SelectValue placeholder="Filter by status" />
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
                {filteredFeedbacks.map((feedback) => (
                  <TableRow key={feedback.id}>
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
                      {feedback.file ? (
                        <Button variant="outline" size="sm" asChild>
                          <a href={feedback.file} target="_blank" rel="noopener noreferrer">
                            View File
                          </a>
                        </Button>
                      ) : (
                        "No File"
                      )}
                    </TableCell>
                    <TableCell>{getStatusBadge(feedback.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setSelectedFeedback(feedback)}
                            >
                              <Eye className="h-4 w-4" />
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
                              
                              {feedback.file && (
                                <div>
                                  <strong>Attachment:</strong>
                                  <a 
                                    href={feedback.file} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline ml-2"
                                  >
                                    View File
                                  </a>
                                </div>
                              )}
                              
                              <div className="space-y-2">
                                <label className="text-sm font-medium">Update Status:</label>
                                <Select 
                                  value={feedback.status} 
                                  onValueChange={(newStatus) => updateFeedbackStatus(feedback.id, newStatus)}
                                >
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
                                <Textarea
                                  placeholder="Add your response..."
                                  value={adminResponse}
                                  onChange={(e) => setAdminResponse(e.target.value)}
                                />
                                <Button 
                                  onClick={() => updateFeedbackStatus(feedback.id, "reviewed", adminResponse)}
                                  className="w-full"
                                >
                                  Save Response
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {filteredFeedbacks.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No feedback found matching your filters.
            </div>
          )}
        </CardContent>
      </Card>
      </div>
    </div>
  );
}