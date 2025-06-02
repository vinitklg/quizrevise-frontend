import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { formatDate } from "@/lib/utils";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Loader2, Send, Upload, X } from "lucide-react";

// Form schema for asking a doubt
const doubtSchema = z.object({
  board: z.string().min(2, "Board must be at least 2 characters"),
  class: z.string().min(1, "Class must not be empty"),
  subject: z.string().min(2, "Subject must be at least 2 characters"),
  question: z.string().min(10, "Question must be at least 10 characters"),
  fileUrl: z.string().optional(),
  fileType: z.string().optional(),
});

type DoubtFormValues = z.infer<typeof doubtSchema>;

interface Subject {
  id: number;
  name: string;
  code: string;
}

interface DoubtQuery {
  id: number;
  userId: number;
  question: string;
  answer?: string;
  subjectId: number;
  board?: string;
  class?: string;
  subjectName?: string;
  status: string;
  fileUrl?: string;
  fileType?: string;
  createdAt?: Date;
  answeredAt?: Date;
}

const AskDoubts = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  
  // Fetch user's doubt queries
  const { data: doubtQueries = [], isLoading: isLoadingDoubts } = useQuery<DoubtQuery[]>({
    queryKey: ["/api/doubt-queries"],
  });
  
  // Initialize form
  const form = useForm<DoubtFormValues>({
    resolver: zodResolver(doubtSchema),
    defaultValues: {
      board: user?.board || "CBSE",
      class: user?.grade?.toString() || "10",
      subject: "Mathematics",
      question: "",
    },
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
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

  const onSubmit = async (data: DoubtFormValues) => {
    setIsSubmitting(true);
    try {
      let fileUrl = "";
      let fileType = "";
      
      if (uploadedFile) {
        const formData = new FormData();
        formData.append('file', uploadedFile);
        
        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        
        if (uploadResponse.ok) {
          const uploadResult = await uploadResponse.json();
          fileUrl = uploadResult.url;
          fileType = uploadedFile.type.includes('pdf') ? 'pdf' : 'word';
        }
      }

      const response = await apiRequest("POST", "/api/doubt-queries", {
        ...data,
        fileUrl,
        fileType,
      });

      if (response.ok) {
        toast({
          title: "Question submitted",
          description: "Your doubt has been submitted and will be answered shortly.",
        });
        
        form.reset({
          board: user?.board || "CBSE",
          class: user?.grade?.toString() || "10",
          subject: "Mathematics",
          question: "",
        });
        setUploadedFile(null);
        setIsTyping(false);
        
        const fileInput = document.getElementById('file-upload') as HTMLInputElement;
        if (fileInput) {
          fileInput.value = '';
        }
        
        queryClient.invalidateQueries({ queryKey: ["/api/doubt-queries"] });
      } else {
        const errorData = await response.json();
        toast({
          title: "Submission failed",
          description: errorData.message || "Failed to submit your question. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Submission failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="flex-shrink-0 px-4 py-6 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-semibold text-gray-900 dark:text-white mb-2">
            How can I help you today?
          </h1>
          {user?.subscriptionTier === "free" && (
            <p className="text-sm text-amber-600 dark:text-amber-400">
              Free plan: 2 questions per day
            </p>
          )}
        </div>
      </div>

      {/* Chat Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {isLoadingDoubts ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
            </div>
          ) : doubtQueries && doubtQueries.length > 0 ? (
            // Display previous conversations
            doubtQueries.map((doubt: DoubtQuery) => (
              <div key={doubt.id} className="space-y-4">
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
                          {doubt.fileUrl && (
                            <div className="flex items-center text-xs bg-blue-700 rounded p-2 mt-2">
                              <FileText className="h-3 w-3 mr-2" />
                              <span>Attached {doubt.fileType === "pdf" ? "PDF" : "Word"} document</span>
                            </div>
                          )}
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
                        {doubt.status === "answered" && doubt.answer ? (
                          <div className="space-y-2">
                            <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                              AI Tutor
                            </div>
                            <div className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line leading-relaxed">
                              {doubt.answer}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 text-right">
                              {doubt.answeredAt ? formatDate(doubt.answeredAt.toString()) : 'Just answered'}
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center text-amber-600 dark:text-amber-400">
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            <span className="text-sm">Thinking...</span>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            ))
          ) : (
            // Welcome message when no previous conversations
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Ask your first question
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                I'm here to help you with your studies. Ask me anything!
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Input Area */}
      <div className="flex-shrink-0 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
        <div className="max-w-4xl mx-auto">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Context Details (collapsible) */}
              {showDetails && (
                <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <FormField
                    control={form.control}
                    name="board"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input placeholder="Board (e.g., CBSE)" {...field} className="text-sm" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="class"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input placeholder="Class (e.g., 10)" {...field} className="text-sm" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input placeholder="Subject" {...field} className="text-sm" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {/* File Upload Area */}
              {uploadedFile && (
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center text-sm">
                    <FileText className="h-4 w-4 mr-2 text-blue-600" />
                    <span>{uploadedFile.name}</span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setUploadedFile(null);
                      const fileInput = document.getElementById('file-upload') as HTMLInputElement;
                      if (fileInput) fileInput.value = '';
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}

              {/* Main Input */}
              <div className="flex items-end space-x-2">
                <div className="flex-1">
                  <FormField
                    control={form.control}
                    name="question"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Textarea
                            placeholder="Ask anything..."
                            {...field}
                            rows={isTyping ? 6 : 1}
                            onFocus={() => setIsTyping(true)}
                            onBlur={(e) => {
                              if (!e.target.value.trim()) {
                                setIsTyping(false);
                              }
                            }}
                            className="resize-none border-2 focus:border-blue-500 transition-all duration-200 min-h-[48px]"
                            style={{ 
                              height: isTyping ? 'auto' : '48px',
                              minHeight: '48px'
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowDetails(!showDetails)}
                    className="px-3"
                  >
                    {showDetails ? 'Hide' : 'Details'}
                  </Button>
                  
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="px-3"
                    onClick={() => document.getElementById('file-upload')?.click()}
                  >
                    <Upload className="h-4 w-4" />
                  </Button>
                  <input
                    id="file-upload"
                    type="file"
                    className="hidden"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileUpload}
                  />

                  <Button type="submit" disabled={isSubmitting} size="sm" className="px-4">
                    {isSubmitting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default AskDoubts;