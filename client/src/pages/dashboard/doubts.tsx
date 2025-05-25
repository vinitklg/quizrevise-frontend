import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { formatDate } from "@/lib/utils";
import Sidebar from "@/components/dashboard/Sidebar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, HelpCircle, Loader2, Upload } from "lucide-react";

// Form schema for asking a doubt
const doubtSchema = z.object({
  board: z.string({
    required_error: "Please enter your board",
  }).min(2, "Board must be at least 2 characters"),
  class: z.string({
    required_error: "Please enter your class",
  }).min(1, "Class must not be empty"),
  subject: z.string({
    required_error: "Please enter a subject",
  }).min(2, "Subject must be at least 2 characters"),
  question: z.string()
    .min(10, "Question must be at least 10 characters")
    .max(1000, "Question must be less than 1000 characters"),
  fileUrl: z.string().optional().default(""),
  fileType: z.string().optional().default(""),
});

type DoubtFormValues = z.infer<typeof doubtSchema>;

interface Subject {
  id: number;
  name: string;
}

interface DoubtQuery {
  id: number;
  userId: number;
  subjectId: number;
  question: string;
  answer: string | null;
  board?: string;
  class?: string;
  subjectName?: string;
  status: string;
  fileUrl?: string;
  fileType?: string;
  createdAt: string;
  answeredAt: string | null;
}

const AskDoubts = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null);
  
  // Fetch subjects
  const { data: subjects = [], isLoading: isLoadingSubjects } = useQuery<Subject[]>({
    queryKey: ["/api/subjects"],
  });
  
  // Fetch user's doubt queries
  const { data: doubtQueries = [], isLoading: isLoadingDoubts } = useQuery<DoubtQuery[]>({
    queryKey: ["/api/doubt-queries"],
  });
  
  // Initialize form
  const form = useForm<DoubtFormValues>({
    resolver: zodResolver(doubtSchema),
    defaultValues: {
      board: user?.board || "",
      class: user?.grade?.toString() || "",
      subject: "",
      question: "",
    },
  });

  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      
      // Check if file is PDF or Word document
      const fileType = file.type;
      if (
        fileType !== "application/pdf" && 
        fileType !== "application/msword" && 
        fileType !== "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        toast({
          title: "Invalid file type",
          description: "Please upload a PDF or Word document",
          variant: "destructive",
        });
        return;
      }
      
      // Check file size (limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please upload a file smaller than 5MB",
          variant: "destructive",
        });
        return;
      }
      
      setUploadedFile(file);
      
      // Create preview URL for the file
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
      
      // Update form values
      form.setValue("fileUrl", URL.createObjectURL(file));
      form.setValue("fileType", fileType === "application/pdf" ? "pdf" : "word");
    }
  };
  
  const removeFile = () => {
    setUploadedFile(null);
    setFilePreviewUrl(null);
    form.setValue("fileUrl", "");
    form.setValue("fileType", "");
  };
  
  // Handle form submission
  const onSubmit = async (data: DoubtFormValues) => {
    setIsSubmitting(true);
    
    try {
      // Simplified approach - send the form data directly without creating a subject
      // This matches our updated schema that uses text fields directly
      // Need to include subjectId as part of the validation requirements
      const formData = {
        subjectId: 1, // Default to first subject to satisfy validation
        board: data.board,
        class: data.class, 
        subjectName: data.subject, // Map subject field to subjectName
        question: data.question,
        fileUrl: data.fileUrl || "",
        fileType: data.fileType || "",
      };
      
      await apiRequest("POST", "/api/doubt-queries", formData);
      
      // Reset form with defaults
      form.reset({
        board: user?.board || "",
        class: user?.grade?.toString() || "",
        subject: "",
        question: "",
      });
      removeFile();
      
      // Invalidate queries to fetch updated data
      queryClient.invalidateQueries({ queryKey: ["/api/doubt-queries"] });
      
      toast({
        title: "Question submitted",
        description: "Your doubt query has been submitted and will be answered soon.",
      });
    } catch (error: any) {
      console.error("Error submitting doubt query:", error);
      
      let errorMessage = "Failed to submit your question. Please try again.";
      
      // Check if it's a subscription limit error
      if (error.message && error.message.includes("limit reached")) {
        errorMessage = "You have reached your daily doubt query limit for your current subscription tier.";
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Ask Doubts</h1>
            
            <Tabs defaultValue="ask">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="ask">Ask a Question</TabsTrigger>
                <TabsTrigger value="history">Previous Questions</TabsTrigger>
              </TabsList>
              
              <TabsContent value="ask">
                <Card>
                  <CardHeader>
                    <CardTitle>Ask a Doubt</CardTitle>
                    <CardDescription>
                      Submit your question and our AI tutor will provide a detailed answer.
                      {user?.subscriptionTier === "free" && (
                        <div className="mt-2 text-amber-600 dark:text-amber-400">
                          Free plan: 2 questions per day
                        </div>
                      )}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <FormField
                            control={form.control}
                            name="board"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Board</FormLabel>
                                <FormControl>
                                  <Input placeholder="e.g., CBSE, ICSE, ISC" {...field} />
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
                                <FormLabel>Class</FormLabel>
                                <FormControl>
                                  <Input placeholder="e.g., 10, 11, 12" {...field} />
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
                                <FormLabel>Subject</FormLabel>
                                <FormControl>
                                  <Input placeholder="e.g., Mathematics, Physics" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <FormField
                          control={form.control}
                          name="question"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Your Question</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Type your question here. Be as specific as possible for better answers."
                                  className="min-h-[150px]"
                                  {...field} 
                                />
                              </FormControl>
                              <FormDescription>
                                Provide context and any relevant information to help us understand your question better.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <div className="space-y-2">
                          <FormLabel>Upload Document (Optional)</FormLabel>
                          <div className="flex items-center gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => document.getElementById('file-upload')?.click()}
                              className="flex-1"
                            >
                              <Upload className="mr-2 h-4 w-4" />
                              {uploadedFile ? "Change File" : "Upload File"}
                            </Button>
                            
                            {uploadedFile && (
                              <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                onClick={removeFile}
                              >
                                &times;
                              </Button>
                            )}
                            
                            <Input
                              id="file-upload"
                              type="file"
                              accept=".pdf,.doc,.docx"
                              className="hidden"
                              onChange={handleFileChange}
                            />
                          </div>
                          
                          <FormDescription>
                            Upload a PDF or Word document related to your question (max 5MB).
                          </FormDescription>
                          
                          {uploadedFile && (
                            <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-md flex items-center">
                              <FileText className="h-5 w-5 mr-2 text-primary" />
                              <div className="text-sm truncate flex-1">
                                {uploadedFile.name}
                              </div>
                              <div className="text-xs text-gray-500">
                                {(uploadedFile.size / 1024).toFixed(0)} KB
                              </div>
                            </div>
                          )}
                        </div>
                        
                        <Button 
                          type="submit" 
                          className="w-full" 
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Submitting...
                            </>
                          ) : (
                            "Submit Question"
                          )}
                        </Button>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="history">
                <Card>
                  <CardHeader>
                    <CardTitle>Previous Questions</CardTitle>
                    <CardDescription>
                      View all your previously asked questions and their answers.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isLoadingDoubts ? (
                      <div className="flex justify-center items-center h-64">
                        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
                      </div>
                    ) : doubtQueries && doubtQueries.length > 0 ? (
                      <div className="space-y-6">
                        {doubtQueries.map((doubt: DoubtQuery) => (
                          <div key={doubt.id} className="border rounded-lg overflow-hidden">
                            <div className="bg-gray-50 dark:bg-gray-800 p-4">
                              <div className="flex justify-between items-start mb-2">
                                <h3 className="font-medium">Question</h3>
                                <div className="text-xs text-gray-500">
                                  {formatDate(doubt.createdAt)}
                                </div>
                              </div>
                              
                              {/* Display board, class, and subject information */}
                              <div className="flex flex-wrap gap-2 mb-2">
                                {doubt.board && (
                                  <span className="inline-flex items-center rounded-md bg-blue-50 dark:bg-blue-900/30 px-2 py-1 text-xs font-medium text-blue-700 dark:text-blue-300">
                                    Board: {doubt.board}
                                  </span>
                                )}
                                {doubt.class && (
                                  <span className="inline-flex items-center rounded-md bg-green-50 dark:bg-green-900/30 px-2 py-1 text-xs font-medium text-green-700 dark:text-green-300">
                                    Class: {doubt.class}
                                  </span>
                                )}
                                {doubt.subjectName && (
                                  <span className="inline-flex items-center rounded-md bg-purple-50 dark:bg-purple-900/30 px-2 py-1 text-xs font-medium text-purple-700 dark:text-purple-300">
                                    Subject: {doubt.subjectName}
                                  </span>
                                )}
                              </div>
                              
                              <p className="text-gray-700 dark:text-gray-300">{doubt.question}</p>
                              
                              {doubt.fileUrl && (
                                <div className="mt-2 p-2 bg-gray-100 dark:bg-gray-700 rounded-md flex items-center">
                                  <FileText className="h-4 w-4 mr-2 text-primary" />
                                  <div className="text-xs">
                                    Attached {doubt.fileType === "pdf" ? "PDF" : "Word"} document
                                  </div>
                                </div>
                              )}
                            </div>
                            
                            <div className="p-4">
                              <h3 className="font-medium mb-2">Answer</h3>
                              
                              {doubt.status === "answered" && doubt.answer ? (
                                <div className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                                  {doubt.answer}
                                </div>
                              ) : doubt.status === "pending" ? (
                                <div className="flex items-center text-amber-600 dark:text-amber-400">
                                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                  Waiting for answer...
                                </div>
                              ) : (
                                <div className="text-gray-500">No answer yet</div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center text-gray-500 dark:text-gray-400 py-16">
                        <HelpCircle className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600 mb-4" />
                        <h3 className="text-lg font-medium mb-2">No questions yet</h3>
                        <p>You haven't asked any questions yet. Submit a new question to get started!</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AskDoubts;