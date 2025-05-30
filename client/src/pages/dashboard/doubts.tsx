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
  question: z.string({
    required_error: "Please enter your question",
  }).min(10, "Question must be at least 10 characters"),
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

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
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
      
      // Create preview URL for display
      const reader = new FileReader();
      reader.onload = (e) => {
        setFilePreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: DoubtFormValues) => {
    setIsSubmitting(true);
    try {
      let fileUrl = "";
      let fileType = "";
      
      // Handle file upload if present
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
        
        // Reset form and file upload
        form.reset({
          board: user?.board || "",
          class: user?.grade?.toString() || "",
          subject: "",
          question: "",
        });
        setUploadedFile(null);
        setFilePreviewUrl(null);
        
        // Reset file input
        const fileInput = document.getElementById('file-upload') as HTMLInputElement;
        if (fileInput) {
          fileInput.value = '';
        }
        
        // Refetch doubt queries
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
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Ask Doubts</h1>
        
        <div className="mt-6">
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
                                <Input placeholder="e.g., CBSE, ICSE" {...field} />
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
                                <Input placeholder="e.g., 10, 12" {...field} />
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
                                placeholder="Describe your doubt in detail. The more specific you are, the better help we can provide."
                                className="min-h-[120px]"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              Please provide as much context as possible for better assistance.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      {/* File Upload Section */}
                      <div className="space-y-2">
                        <FormLabel>Attach Document (Optional)</FormLabel>
                        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6">
                          <div className="text-center">
                            <Upload className="mx-auto h-12 w-12 text-gray-400" />
                            <div className="mt-4">
                              <label htmlFor="file-upload" className="cursor-pointer">
                                <span className="mt-2 block text-sm font-medium text-gray-900 dark:text-white">
                                  Upload a file (PDF or Word document)
                                </span>
                                <input
                                  id="file-upload"
                                  name="file-upload"
                                  type="file"
                                  className="sr-only"
                                  accept=".pdf,.doc,.docx"
                                  onChange={handleFileUpload}
                                />
                              </label>
                              <p className="mt-1 text-xs text-gray-500">
                                PDF, DOC or DOCX up to 5MB
                              </p>
                            </div>
                          </div>
                          
                          {uploadedFile && (
                            <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-md flex items-center justify-between">
                              <div className="flex items-center">
                                <FileText className="h-5 w-5 text-primary mr-2" />
                                <span className="text-sm text-gray-700 dark:text-gray-300">
                                  {uploadedFile.name}
                                </span>
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setUploadedFile(null);
                                  setFilePreviewUrl(null);
                                  const fileInput = document.getElementById('file-upload') as HTMLInputElement;
                                  if (fileInput) {
                                    fileInput.value = '';
                                  }
                                }}
                              >
                                Remove
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <Button type="submit" disabled={isSubmitting} className="w-full">
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
                              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                <HelpCircle className="mr-2 h-4 w-4" />
                                <span>Asked on {doubt.createdAt ? formatDate(doubt.createdAt.toString()) : 'Unknown date'}</span>
                              </div>
                              
                              {doubt.status === "answered" ? (
                                <span className="px-2 py-1 text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-full">
                                  Answered
                                </span>
                              ) : (
                                <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 rounded-full">
                                  Pending
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
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                <span>Processing your question...</span>
                              </div>
                            ) : (
                              <div className="text-gray-500 dark:text-gray-400">
                                No answer available yet.
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                      <HelpCircle className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600 mb-4" />
                      <h3 className="text-lg font-medium mb-2">No questions asked yet</h3>
                      <p className="mb-4">Ask your first question to get started!</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AskDoubts;