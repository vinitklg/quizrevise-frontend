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
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star, MessageSquare, Settings, Lightbulb, Send, CheckCircle } from "lucide-react";

// Form schema for feedback
const feedbackSchema = z.object({
  type: z.enum(["general", "quiz", "technical", "suggestion"]),
  category: z.string().optional(),
  rating: z.number().min(1).max(5).optional(),
  feedbackText: z.string().min(5, "Feedback must be at least 5 characters"),
});

type FeedbackFormValues = z.infer<typeof feedbackSchema>;

interface Feedback {
  id: number;
  userId: number;
  type: string;
  rating?: number;
  feedbackText?: string;
  category?: string;
  status: string;
  adminResponse?: string;
  createdAt?: Date;
  reviewedAt?: Date;
}

const FeedbackPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedType, setSelectedType] = useState<string>("");
  
  // Fetch user's feedback history
  const { data: feedbackHistory = [], isLoading } = useQuery<Feedback[]>({
    queryKey: ["/api/feedback"],
  });
  
  // Initialize form
  const form = useForm<FeedbackFormValues>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      type: "general",
      feedbackText: "",
    },
  });

  const onSubmit = async (data: FeedbackFormValues) => {
    setIsSubmitting(true);
    try {
      const response = await apiRequest("POST", "/api/feedback", data);

      if (response.ok) {
        toast({
          title: "Feedback submitted",
          description: "Thank you for your feedback! We'll review it and get back to you.",
        });
        
        form.reset({
          type: "general",
          feedbackText: "",
        });
        setSelectedType("");
        
        queryClient.invalidateQueries({ queryKey: ["/api/feedback"] });
      } else {
        const errorData = await response.json();
        toast({
          title: "Submission failed",
          description: errorData.message || "Failed to submit feedback. Please try again.",
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

  const renderStars = (rating: number, interactive = false, onRate?: (rating: number) => void) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-5 w-5 ${
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            } ${interactive ? "cursor-pointer hover:text-yellow-400" : ""}`}
            onClick={() => interactive && onRate && onRate(star)}
          />
        ))}
      </div>
    );
  };

  const getFeedbackIcon = (type: string) => {
    switch (type) {
      case "general":
        return <MessageSquare className="h-5 w-5" />;
      case "technical":
        return <Settings className="h-5 w-5" />;
      case "suggestion":
        return <Lightbulb className="h-5 w-5" />;
      default:
        return <MessageSquare className="h-5 w-5" />;
    }
  };

  const getFeedbackTypeLabel = (type: string) => {
    switch (type) {
      case "general":
        return "General Feedback";
      case "technical":
        return "Technical Issue";
      case "suggestion":
        return "Suggestion";
      case "quiz":
        return "Quiz Feedback";
      default:
        return type;
    }
  };

  return (
    <div className="py-6">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Feedback</h1>
        
        <Tabs defaultValue="submit" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="submit">Submit Feedback</TabsTrigger>
            <TabsTrigger value="history">My Feedback</TabsTrigger>
          </TabsList>
          
          <TabsContent value="submit">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Feedback Categories */}
              <div className="lg:col-span-1 space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Feedback Categories</CardTitle>
                    <CardDescription>
                      Choose the type of feedback you'd like to provide
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div 
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        selectedType === "general" 
                          ? "bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800" 
                          : "bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                      onClick={() => {
                        setSelectedType("general");
                        form.setValue("type", "general");
                      }}
                    >
                      <div className="flex items-center space-x-3">
                        <MessageSquare className="h-5 w-5 text-blue-600" />
                        <div>
                          <div className="font-medium">General Feedback</div>
                          <div className="text-sm text-gray-500">Overall experience, suggestions</div>
                        </div>
                      </div>
                    </div>
                    
                    <div 
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        selectedType === "technical" 
                          ? "bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800" 
                          : "bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                      onClick={() => {
                        setSelectedType("technical");
                        form.setValue("type", "technical");
                      }}
                    >
                      <div className="flex items-center space-x-3">
                        <Settings className="h-5 w-5 text-red-600" />
                        <div>
                          <div className="font-medium">Technical Issue</div>
                          <div className="text-sm text-gray-500">Bugs, errors, performance issues</div>
                        </div>
                      </div>
                    </div>
                    
                    <div 
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        selectedType === "suggestion" 
                          ? "bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800" 
                          : "bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                      onClick={() => {
                        setSelectedType("suggestion");
                        form.setValue("type", "suggestion");
                      }}
                    >
                      <div className="flex items-center space-x-3">
                        <Lightbulb className="h-5 w-5 text-green-600" />
                        <div>
                          <div className="font-medium">Feature Suggestion</div>
                          <div className="text-sm text-gray-500">New features, improvements</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Feedback Form */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Share Your Feedback</CardTitle>
                    <CardDescription>
                      Your feedback helps us improve the platform for everyone
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                          control={form.control}
                          name="type"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Feedback Type</FormLabel>
                              <Select 
                                onValueChange={(value) => {
                                  field.onChange(value);
                                  setSelectedType(value);
                                }} 
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select feedback type" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="general">General Feedback</SelectItem>
                                  <SelectItem value="technical">Technical Issue</SelectItem>
                                  <SelectItem value="suggestion">Feature Suggestion</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="feedbackText"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Your Feedback</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Please share your detailed feedback..."
                                  className="min-h-[120px]"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <Button type="submit" disabled={isSubmitting} className="w-full">
                          {isSubmitting ? (
                            <>
                              <Send className="mr-2 h-4 w-4 animate-pulse" />
                              Submitting...
                            </>
                          ) : (
                            <>
                              <Send className="mr-2 h-4 w-4" />
                              Submit Feedback
                            </>
                          )}
                        </Button>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Feedback History</CardTitle>
                <CardDescription>
                  View your previous feedback and our responses
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center items-center h-64">
                    <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
                  </div>
                ) : feedbackHistory && feedbackHistory.length > 0 ? (
                  <div className="space-y-4">
                    {feedbackHistory.map((feedback) => (
                      <Card key={feedback.id} className="border-l-4 border-l-blue-400">
                        <CardContent className="pt-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center space-x-2">
                              {getFeedbackIcon(feedback.type)}
                              <span className="font-medium">{getFeedbackTypeLabel(feedback.type)}</span>
                              {feedback.rating && renderStars(feedback.rating)}
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                feedback.status === "reviewed" 
                                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                  : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                              }`}>
                                {feedback.status === "reviewed" ? "Reviewed" : "Pending"}
                              </span>
                              <span className="text-sm text-gray-500">
                                {feedback.createdAt ? formatDate(feedback.createdAt.toString()) : "Recently"}
                              </span>
                            </div>
                          </div>
                          
                          <p className="text-gray-700 dark:text-gray-300 mb-3">
                            {feedback.feedbackText}
                          </p>
                          
                          {feedback.adminResponse && (
                            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                              <div className="flex items-center space-x-2 mb-2">
                                <CheckCircle className="h-4 w-4 text-blue-600" />
                                <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                                  Admin Response
                                </span>
                              </div>
                              <p className="text-sm text-blue-700 dark:text-blue-300">
                                {feedback.adminResponse}
                              </p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
                      No feedback yet
                    </h3>
                    <p className="mt-2 text-gray-500">
                      Your feedback submissions will appear here.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default FeedbackPage;